var express = require('express');
var router = express.Router();

var storage = require('../storage');

router.get('/', function(req, res) {
    storage.getTodos()
        .then(function(todos) {
            return res.json(todos);
        })
        .catch(function(err) {
            return res.status(500).send(err);
        });
});

router.post('/', function(req, res) {
    storage.saveTodo(req.body)
        .then(function(newTodo) {
            return res.json(newTodo);
        })
        .catch(function(err) {
            return res.status(500).send(err);
        });
});

router.put('/', function(req, res) {
    storage.updateTodo(req.body.id, req.body.title, req.body.status)
        .then(function(todos) {
            return res.json(todos);
        })
        .catch(function(err) {
            return res.status(500).send(err);
        });
});

router.delete('/:id', function(req, res) {
    storage.deleteTodo(req.params.id)
        .then(function(todos) {
            return res.json(todos);
        })
        .catch(function(err) {
            return res.status(500).send(err);
        });
});

module.exports = router;
