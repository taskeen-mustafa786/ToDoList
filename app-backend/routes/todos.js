const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
} = require('../controllers/todoController');

const router = express.Router();

router.route('/')
  .get(protect, getTodos)
  .post(protect, createTodo);

router.route('/:id')
  .put(protect, updateTodo)
  .delete(protect, deleteTodo);

module.exports = router;
