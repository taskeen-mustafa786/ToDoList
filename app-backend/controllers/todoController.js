const Todo = require('../models/Todo');
const asyncHandler = require('express-async-handler');

// @desc    Get all todos for a user
// @route   GET /api/todos
// @access  Private
const getTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find({ user: req.user.id });
  res.status(200).json(todos);
});

// @desc    Create new todo
// @route   POST /api/todos
// @access  Private
const createTodo = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error('Please add a text field');
  }

  const todo = await Todo.create({
    text: req.body.text,
    user: req.user.id
  });

  res.status(201).json(todo);
});

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(404);
    throw new Error('Todo not found');
  }

  // Check for user
  if (todo.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedTodo);
});

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(404);
    throw new Error('Todo not found');
  }

  // Check for user
  if (todo.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await todo.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};
