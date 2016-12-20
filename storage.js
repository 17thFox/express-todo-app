'use strict';

const todoStatus = require('./todo-status');

let counter = 1;
let todos = {};

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
    return Promise.resolve(newTodo);
}


function updateTodo(id, newTitle, newStatus) {
    if (typeof todos[id] === 'undefined') {
        return Promise.reject('Todo with ID ' + id + ' not found');
    }

    todos[id].title = newTitle;
    todos[id].status = newStatus;
    return Promise.resolve(todos[id]);
}


function deleteTodo(id) {
    if (typeof todos[id] === 'undefined') {
        return Promise.reject('Todo with ID ' + id + ' not found for delete');
    }

    delete todos[id];
    return Promise.resolve(todos);

}


module.exports = {
    getTodos: getTodos,
    saveTodo: saveTodo,
    updateTodo: updateTodo,
    deleteTodo: deleteTodo

};