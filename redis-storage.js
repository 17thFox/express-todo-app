

const todoStatus = require('./todo-status');

const Redis = require('ioredis');

// Generate a v4 UUID (random)
const uuidV4 = require('uuid/v4');


const redis = new Redis(process.env.REDIS_URL);


function getTodos(status) {
  const result = [];

  return redis.hgetall(status).then((content) => {
    for (const prop in content) {
      if (content.hasOwnProperty(prop)) {
        result.push(JSON.parse(content[prop]));
      }
    }
    return result;
  });
}


function saveTodo(todo) {
  return new Promise((resolve, reject) => {
    if (typeof todo.title !== 'string') {
      return reject('Title is not a string');
    }

    if (todo.title.trim() === '') {
      return reject('Title is empty or just whitespace');
    }

        // uuid for id
    const uuid = uuidV4(); // -> '110ec58a-a0f2-4ac4-8393-c866d813b8d1'

    return redis.hset('not-done', uuid, JSON.stringify({
      id: uuid,
      title: todo.title,
      status: todoStatus.NOT_DONE,
    }))
            .then(() => redis.hget('not-done', uuid))
            .then((cont) => {
              const content = JSON.parse(cont);
              return resolve(content);
            });
  });
}


function getStatus(id) {
  return new Promise((resolve, reject) => {
    let status = '';

    Promise.all([
      redis.hget('not-done', id),
      redis.hget('done', id),
    ]).then((results) => {
      const notDoneTodos = results[0];
      const doneTodos = results[1];

      if (notDoneTodos) {
        status = 'not-done';
      } else if (doneTodos) {
        status = 'done';
      } else {
        return reject('');
      }
      return resolve(status);
    });
  });
}


function updateTodo(id, newTitle, newStatus) {
  return new Promise((resolve, reject) => {
    let status = '';
    getStatus(id).then((data) => {
      status = data;
      return true;
    }).then(() => {
      if (status === '') {
        return reject(`Todo with ID ${id} not found`);
      }

      return redis.hget(status, id).then((cont) => {
        const content = JSON.parse(cont);
        content.title = newTitle;

        if (typeof newStatus === 'undefined') {
          content.status = content.status;
        } else {
          content.status = newStatus;
        }

        if (newStatus !== status) {
          redis.hset(newStatus, id, JSON.stringify({
            id,
            title: content.title,
            status: content.status,
          })).then(() => {
            redis.hdel(status, id);
          })
                        .then(() => redis.hget(newStatus, id))
                        .then((info) => {
                          return resolve(info);
                        });
        } else {
          redis.hset(status, id, JSON.stringify({
            id,
            title: content.title,
            status: content.status,
          })).then(() => redis.hget(status, id))
                        .then((info) => {
                          return resolve(info);
                        });
        }
      });
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
}


function deleteTodo(id) {
  return new Promise((resolve, reject) => {
    let status = '';
    getStatus(id).then((data) => {
      status = data;
      return true;
    }).then(() => {
      if (status === '') {
        return reject(`Todo with ID ${id} not found for delete`);
      }
      return redis.hdel(status, id).then(() => {
        getTodos('done').then((todosDone) => {
          getTodos('not-done').then(todosNotDone => resolve(todosDone.concat(todosNotDone)));
        });
      });
    });
  });
}


module.exports = {
  getTodos,
  saveTodo,
  updateTodo,
  deleteTodo,
};
