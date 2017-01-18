const express = require('express');

const router = express.Router();

const storage = require('../knex-storage');

router.get('/', (req, res) => {
  storage.getTodos()
        .then((todosDone) => res.json(todosDone))
        .catch(err => res.status(500).send(err));
});

router.post('/', (req, res) => {
  storage.saveTodo(req.body)
        .then(newTodo => res.json(newTodo))
        .catch(err => res.status(500).send(err));
});

router.put('/', (req, res) => {
  storage.updateTodo(req.body.id, req.body.title, req.body.status)
        .then(todos => res.json(todos))
        .catch(err => res.status(500).send(err));
});

router.delete('/:id', (req, res) => {
  storage.deleteTodo(req.params.id)
        .then(todos => res.json(todos))
        .catch(err => res.status(500).send(err));
});

module.exports = router;
