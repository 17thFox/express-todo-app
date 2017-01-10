'use strict';

const todoStatus = require('./todo-status');

const redisStorage = require('./redis-storage');

// Generate a v4 UUID (random) 
const uuidV4 = require('uuid/v4');

let todos = {};

// getTodos('done');
// getTodos('not-done');


function getTodos(status) {
    return new Promise(function(resolve, reject) {
        redisStorage.loadFromRedis('todos.' + status).then(function(content) {
            todos[status] = content || {};
            todos['done'] = todos['done'] || {};
            todos['not-done'] = todos['not-done'] || {};

            const result = [];

            for (let prop in todos[status]) {
                if (todos[status].hasOwnProperty(prop) && todos[status][prop]) {
                    result.push(todos[status][prop]);
                }
            }
            return resolve(result);

        }).catch(function(err) {
            todos['done'] = todos['done'] || {};
            todos['not-done'] = todos['not-done'] || {};
            return resolve([]);
        });
    });
}


function saveTodo(todo) {
    if (typeof todo.title !== 'string') {
        return Promise.reject('Title is not a string');
    }

    if (todo.title.trim() === '') {
        return Promise.reject('Title is empty or just whitespace');
    }

    //uuid for id
    let uuid = uuidV4(); // -> '110ec58a-a0f2-4ac4-8393-c866d813b8d1' 
    todos['not-done'][uuid] = {
        id: uuid,
        title: todo.title,
        status: todoStatus.NOT_DONE
    };

    return redisStorage.saveToRedis('todos.not-done', todos['not-done']).then(function() {
        return Promise.resolve(todos['not-done'][uuid]);
    });
}


function getStatus(id) {
    let status = '';

    if (todos['done'][id]) {
        status = 'done';
    } else if (todos['not-done'][id]) {
        status = 'not-done';
    } else {
        return '';
    }

    return status;
}


function updateTodo(id, newTitle, newStatus) {

    let status = getStatus(id);

    if (status == '') {
        return Promise.reject('Todo with ID ' + id + ' not found');
    }


    todos[status][id].title = newTitle;
    if (typeof newStatus === 'undefined') {
        todos[status][id].status = todos[status][id].status;
    } else {
        todos[status][id].status = newStatus;
    }

    if (newStatus != status) {
        todos[newStatus][id] = todos[status][id];

        delete todos[status][id];
        return redisStorage.saveToRedis('todos.' + newStatus, todos[newStatus]).then(function() {
            return redisStorage.saveToRedis('todos.' + status, todos[status]).then(function() {
                return Promise.resolve(todos[newStatus][id]);
            });
        });
    }

    return redisStorage.saveToRedis('todos.' + status, todos[status]).then(function() {
        return Promise.resolve(todos[status][id]);
    });
}


function deleteTodo(id) {
    let status = getStatus(id);

    if (status == '') {
        return Promise.reject('Todo with ID ' + id + ' not found for delete');
    }

    delete todos[status][id];
    return redisStorage.saveToRedis('todos.' + status, todos[status]).then(function() {
        return Promise.resolve(todos[status]);
    });
}


module.exports = {
    getTodos: getTodos,
    saveTodo: saveTodo,
    updateTodo: updateTodo,
    deleteTodo: deleteTodo
};