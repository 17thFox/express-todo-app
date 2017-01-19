
const knex = require('knex')({
  client: 'pg',
  connection: process.env.HEROKU_POSTGRESQL_OLIVE_URL,
  ssl: true,
});

const todos = 'todos';
const myId = 'id';


function getTodos() {
  return knex.select().table(todos)
  .then(content => content);
}


function saveTodo(todo) {
  return new Promise((resolve, reject) => {
    if (typeof todo.title !== 'string') {
      return reject('Title is not a string');
    }

    if (todo.title.trim() === '') {
      return reject('Title is empty or just whitespace');
    }

    return knex(todos).returning(myId).insert({ title: todo.title })
    .then(id => knex(todos).where(myId, id[0]))
    .then(content => resolve(content[0]));
  });
}


function updateTodo(id, newTitle, newStatus) {
  return new Promise((resolve, reject) => {
    if (typeof newStatus === 'undefined') {
      knex(todos).where(myId, id)
                .update({ title: newTitle })
                .then(() => knex(todos).where(myId, id))
                .then(content => resolve(content[0]))
                .catch((err) => {
                  console.log(err);
                  return reject(err);
                });
    } else {
      knex(todos).where(myId, id)
                .update({ title: newTitle, status: newStatus })
                .then(() => knex(todos).where(myId, id))
                .then(content => resolve(content[0]))
                .catch((err) => {
                  console.log(err);
                  return reject(err);
                });
    }
  });
}


function deleteTodo(id) {
  return new Promise((resolve, reject) => {
    knex(todos).where(myId, id).del()
    .then(() => {
      knex.select().table(todos)
      .then(content => resolve(content));
    })
    .catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
}


module.exports = {
  getTodos,
  saveTodo,
  updateTodo,
  deleteTodo,
};
