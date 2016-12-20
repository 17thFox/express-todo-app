'use strict';

const fs = require('fs');

const todoStatus = require('./todo-status');

const storageFileName = './storage.json';

let counter = 1;
let todos = {};

// first step
//read from storage.json (if exists) fs.readFileSync

// THIS IS NOT SAFE
fs.readFile(storageFileName, function read(err, data) {
    if (err) {
        return console.log(err);
    }
    let content = JSON.parse(data);
    counter = content.counter;
    todos = content.todos;
});


function persistToDisk() {
    fs.writeFile(storageFileName, JSON.stringify({
        counter: counter,
        todos: todos
    }), function(err) {
        if (err)
            return console.log(err);
    });

    return 
}

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
    persistToDisk();
    return Promise.resolve(newTodo);
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
    persistToDisk();
    return Promise.resolve(todos[id]);
}


function deleteTodo(id) {
    if (typeof todos[id] === 'undefined') {
        return Promise.reject('Todo with ID ' + id + ' not found for delete');
    }

    delete todos[id];
    persistToDisk();
    return Promise.resolve(todos);
}


module.exports = {
    getTodos: getTodos,
    saveTodo: saveTodo,
    updateTodo: updateTodo,
    deleteTodo: deleteTodo

};