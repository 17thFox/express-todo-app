'use strict';


let knex = require('knex')({
    client: 'pg',
    connection: HEROKU_POSTGRESQL_OLIVE_URL,
    ssl: true
});

let todos = 'todos';
let myId = 'id';


function getTodos(status) {
    return knex.select().table(todos).then(function(content) {
        return content;
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

        knex(todos).returning(myId).insert({ title: todo.title }).then(function(id) {
            return knex(todos).where(myId, id[0])
        }).then(function(content) {
            return resolve(content[0]);
        })

    })
}


function updateTodo(id, newTitle, newStatus) {

    return new Promise(function(resolve, reject) {

        if (typeof newStatus === 'undefined') {
            knex(todos).where(myId, id)
                .update({ title: newTitle, status: status }).then(function(smth) {
                    return knex(todos).where(myId, id)
                }).then(function(content) {
                    return resolve(content[0]);
                }).catch(function(err) {
                    console.log(err);
                    return reject(err);
                })
        } else {
            knex(todos).where(myId, id)
                .update({ title: newTitle, status: newStatus }).then(function(smth) {
                    return knex(todos).where(myId, id)
                }).then(function(content) {
                    return resolve(content[0]);
                }).catch(function(err) {
                    console.log(err);
                    return reject(err);
                })
        }

    })
}


function deleteTodo(id) {
    return new Promise(function(resolve, reject) {
        knex(todos).where(myId, id).del().then(function(smth) {
            knex.select().table(todos).then(function(content) {
                return resolve(content);
            })
        })
    })
}


module.exports = {
    getTodos: getTodos,
    saveTodo: saveTodo,
    updateTodo: updateTodo,
    deleteTodo: deleteTodo
};