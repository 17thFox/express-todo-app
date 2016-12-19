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

module.exports = {
  getTodos: getTodos,
  saveTodo: saveTodo
};
