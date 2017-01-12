'use strict';

const todoStatus = require('./todo-status');

const Redis = require('ioredis');

// Generate a v4 UUID (random) 
const uuidV4 = require('uuid/v4');


let redis = new Redis(process.env.REDIS_URL);


function getTodos(status) {
    const result = [];

    return redis.hgetall(status).then(function(content) {

        for (let prop in content) {
            if (content.hasOwnProperty(prop)) {
                result.push(JSON.parse(content[prop]));
            }
        }
        return result;
    });
}


function saveTodo(todo) {
    return new Promise(function(resolve, reject) {
        if (typeof todo.title !== 'string') {
            return reject('Title is not a string');
        }

        if (todo.title.trim() === '') {
            return reject('Title is empty or just whitespace');
        }

        //uuid for id
        let uuid = uuidV4(); // -> '110ec58a-a0f2-4ac4-8393-c866d813b8d1'

        redis.hset('not-done', uuid, JSON.stringify({
                id: uuid,
                title: todo.title,
                status: todoStatus.NOT_DONE
            }))
            .then(function() {
                return redis.hget('not-done', uuid);
            })
            .then(function(cont) {
                let content = JSON.parse(cont);
                return resolve(content);
            });
    })
}


function getStatus(id) {
    return new Promise(function(resolve, reject) {
        let status = '';

        Promise.all([
            redis.hget('not-done', id),
            redis.hget('done', id)
        ]).then(function(results) {
            var notDoneTodos = results[0];
            var doneTodos = results[1];

            if (notDoneTodos) {
                status = 'not-done';
            } else if (doneTodos) {
                status = 'done';
            } else {
                return reject('');
            }
            return resolve(status);
        });
    })
}


function updateTodo(id, newTitle, newStatus) {

    return new Promise(function(resolve, reject) {

        let status = '';
        getStatus(id).then(function(data) {
            status = data;
            return true;
        }).then(function() {

            if (status == '') {
                return reject('Todo with ID ' + id + ' not found');
            }

            redis.hget(status, id).then(function(cont) {
                let content = JSON.parse(cont);
                content.title = newTitle;

                if (typeof newStatus === 'undefined') {
                    content.status = content.status;
                } else {
                    content.status = newStatus;
                }

                if (newStatus != status) {
                    redis.hset(newStatus, id, JSON.stringify({
                            id: id,
                            title: content.title,
                            status: content.status
                        })).then(function() {
                            redis.hdel(status, id);
                        })
                        .then(function() {
                            return redis.hget(newStatus, id);
                        })
                        .then(function(info) {
                            let content = JSON.parse(info);
                            return resolve(info);
                        });
                } else {
                    redis.hset(status, id, JSON.stringify({
                            id: id,
                            title: content.title,
                            status: content.status
                        })).then(function() {
                            return redis.hget(status, id);
                        })
                        .then(function(info) {
                            let content = JSON.parse(info);
                            return resolve(info);
                        });
                }

            })

        }).catch(function(err) {
            console.log(err);
            return reject(err);
        })

    })
}


function deleteTodo(id) {

    return new Promise(function(resolve, reject) {

        let status = '';
        getStatus(id).then(function(data) {
            status = data;
            return true;
        }).then(function() {
            if (status == '') {
                return reject('Todo with ID ' + id + ' not found for delete');
            }
            redis.hdel(status, id).then(function() {
                getTodos('done').then(function(todosDone) {
                    getTodos('not-done').then(function(todosNotDone) {
                        return resolve(todosDone.concat(todosNotDone));
                    });

                })
            });

        })


    })
}


module.exports = {
    getTodos: getTodos,
    saveTodo: saveTodo,
    updateTodo: updateTodo,
    deleteTodo: deleteTodo
};