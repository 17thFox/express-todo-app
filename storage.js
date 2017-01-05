'use strict';

const todoStatus = require('./todo-status');

const redisStorage = require('./redis-storage');

let counter = 1;
let todos = {};

redisStorage.loadFromRedis().then(function(content) {
    counter = content.counter || 1;
    todos = content.todos || {};
}).catch(function(err){
    console.log(err);
});

function getTodos(status) {
    const result = [];

    for (let prop in todos) {
        if (todos.hasOwnProperty(prop)) {
            result.push(todos[prop]);
        }
    }

    return Promise.resolve(result);
}

function saveTodo(todo) {
    if (typeof todo.title !== 'string') {
        return Promise.reject('Title is not a string');
    }

    if (todo.title.trim() === '') {
        return Promise.reject('Title is empty or just whitespace');
    }

    const newTodo = todos['' + counter] = {
        id: '' + counter,
        title: todo.title,
        status: todoStatus.NOT_DONE
    };

    counter += 1;
    return redisStorage.saveToRedis({counter: counter, todos: todos}).then(function () {
        return Promise.resolve(newTodo);
    });
}


function updateTodo(id, newTitle, newStatus) {
    if (typeof todos[id] === 'undefined') {
        return Promise.reject('Todo with ID ' + id + ' not found');
    }

    todos[id].title = newTitle;
    if (typeof newStatus === 'undefined') {
        todos[id].status = todos[id].status;
    } else {
        todos[id].status = newStatus;
    }
    return redisStorage.saveToRedis({counter: counter, todos: todos}).then(function () { 
        return Promise.resolve(todos[id]);
    });
}


function deleteTodo(id) {
    if (typeof todos[id] === 'undefined') {
        return Promise.reject('Todo with ID ' + id + ' not found for delete');
    }

    delete todos[id];
    return redisStorage.saveToRedis({counter: counter, todos: todos}).then(function () {
        return Promise.resolve(todos);
    });
}


module.exports = {
    getTodos: getTodos,
    saveTodo: saveTodo,
    updateTodo: updateTodo,
    deleteTodo: deleteTodo

};