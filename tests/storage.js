'use strict';
const assert = require('assert');
const expect = require('chai').expect;

const todoStatus = require('../todo-status');
const storage = require('../storage');

function expectMyPromise(theThing) {
    expect(theThing).to.be.instanceOf(Object);
    expect(theThing.then).to.be.instanceOf(Function);
    expect(theThing.catch).to.be.instanceOf(Function);
}

describe("In-memory storage", function() {
    it("should SAVE a todo to memory when calling saveTodo on it", function(done) {
        storage.saveTodo({
            title: 'title1'
        }).then(function(savedTodo) {
            expect(savedTodo).to.not.be.an('undefined');
            expect(savedTodo.id).to.not.be.an('undefined');
            expect(savedTodo.title).to.equal('title1');
            expect(savedTodo.status).to.equal(todoStatus.NOT_DONE);
            done();
        });
    });

    it('should reject when trying to UPDATE a TODO with an unknown ID', function(done) {
        const updatePromise = storage.updateTodo(-1, 'title-1', todoStatus.NOT_DONE);
        expectMyPromise(updatePromise);

        updatePromise.catch(function(err) {
            return err;
        }).then(function(errMessage) {
            expect(errMessage).to.equal('Todo with ID -1 not found');
            done();
        }).catch(done);
    });

    it('should GET todos', function(done) {
        const savedTodoPromise = storage.saveTodo({ title: 'title2' });
        expectMyPromise(savedTodoPromise);
        let savedTodo;

        savedTodoPromise.then(function(newTodo) {
                savedTodo = newTodo;
                return storage.getTodos();
            })
            .then(function(todos) {
                expect(todos).to.be.instanceOf(Array);

                const foundTodo = todos.find(function(item) {
                    return item.id === savedTodo.id;
                });

                expect(foundTodo).to.not.be.an('undefined');
                expect(foundTodo.title).to.equal(savedTodo.title);
                expect(foundTodo.status).to.equal(savedTodo.status);
                done();
            })
            .catch(done);
    });


    it('should DELETE selected todo', function(done) {
        const savedTodosPromise1 = storage.saveTodo({ title: 'titledelete3' });
        const savedTodosPromise2 = storage.saveTodo({ title: 'titledelete4' });
        expectMyPromise(savedTodosPromise1);
        expectMyPromise(savedTodosPromise2);

        Promise.all([savedTodosPromise1, savedTodosPromise2])
            .then(function(newSavedTodos) {
                // console.log("this is newSavedTodos: " + newSavedTodos.map(i => i.id))
                return storage.deleteTodo('3');
            })
            .then(function(todo) {
                // expect(todo).to.be.instanceOf(Object);

                expect(todo).to.not.be.an('undefined');

                expect(todo[3]).to.be.an('undefined');
                done();
            })
            .catch(done);
    });


    it('should be ok if status isn\'t present in UPDATE', function(done) {
        const updatePromise = storage.updateTodo('1', 'title-1');
        expectMyPromise(updatePromise);

        updatePromise.then(function(smth) {
            expect(smth).to.not.be.an('undefined');
            expect(smth.id).to.equal('1');
            expect(smth.title).to.equal('title-1');
            console.log(smth.status);
            expect(smth.status).to.equal(todoStatus.NOT_DONE);
            done();
        }).catch(done);
    });
});