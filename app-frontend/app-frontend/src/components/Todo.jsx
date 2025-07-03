import { useState, useEffect } from 'react';
import { FaTrashAlt, FaEdit, FaCheck, FaPlus } from 'react-icons/fa';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';   // 👈 point to backend

const Todo = ({ user }) => {
  const [todos, setTodos] = useState([]);   // always an array
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');

  /* ────────────────────────────────────────────────────────────────
     Fetch all todos for current user
     ──────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (user?.token) fetchTodos();
  }, [user]);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/todos`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      // Some APIs wrap the array as { todos: [...] }. Handle either shape.
      const data = Array.isArray(res.data) ? res.data : res.data.todos;
      setTodos(data || []);
    } catch (err) {
      console.error('Fetch todos error:', err);
    }
  };

  /* ────────────────────────────────────────────────────────────────
     Add new todo
     ──────────────────────────────────────────────────────────────── */
  const addTodo = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post(
        `${API_BASE}/api/todos`,
        { text: input },
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      setTodos([...todos, res.data]);   // API returns the created todo object
      setInput('');
    } catch (err) {
      console.error('Add todo error:', err);
    }
  };

  /* ────────────────────────────────────────────────────────────────
     Toggle complete
     ──────────────────────────────────────────────────────────────── */
  const toggleComplete = async (id) => {
    const target = todos.find((t) => t._id === id);
    if (!target) return;
    try {
      await axios.put(
        `${API_BASE}/api/todos/${id}`,
        { completed: !target.completed },
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      setTodos(
        todos.map((t) =>
          t._id === id ? { ...t, completed: !t.completed } : t,
        ),
      );
    } catch (err) {
      console.error('Toggle complete error:', err);
    }
  };

  /* ────────────────────────────────────────────────────────────────
     Edit / save
     ──────────────────────────────────────────────────────────────── */
  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  const saveEdit = async () => {
    try {
      const res = await axios.put(
        `${API_BASE}/api/todos/${editingId}`,
        { text: editText },
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      setTodos(todos.map((t) => (t._id === editingId ? res.data : t)));
      setEditingId(null);
      setEditText('');
    } catch (err) {
      console.error('Save edit error:', err);
    }
  };

  /* ────────────────────────────────────────────────────────────────
     Delete
     ──────────────────────────────────────────────────────────────── */
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Delete todo error:', err);
    }
  };

  /* ────────────────────────────────────────────────────────────────
     Derived data
     ──────────────────────────────────────────────────────────────── */
  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true; // all
  });
  const remainingCount = todos.filter((t) => !t.completed).length;

  /* ────────────────────────────────────────────────────────────────
     Render
     ──────────────────────────────────────────────────────────────── */
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
        <p className="mt-2 text-gray-600">
          {remainingCount} {remainingCount === 1 ? 'item' : 'items'} left
        </p>
      </div>

      {/* Input row */}
      <div className="flex mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a new task..."
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition"
        >
          <FaPlus />
        </button>
      </div>

      {/* Filters */}
      <div className="flex justify-center space-x-4 mb-6">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded ${
              filter === f ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Todo list */}
      <ul className="space-y-3">
        {filteredTodos.map((todo) => (
          <li
            key={todo._id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
          >
            {editingId === todo._id ? (
              <div className="flex-1 flex">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 px-2 border-b focus:outline-none focus:border-blue-500"
                  autoFocus
                />
                <button
                  onClick={saveEdit}
                  className="ml-2 text-green-500 hover:text-green-700"
                >
                  <FaCheck />
                </button>
              </div>
            ) : (
              <div className="flex items-center flex-1">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo._id)}
                  className="h-5 w-5 text-blue-500 rounded focus:ring-blue-400 mr-3"
                />
                <span
                  className={`flex-1 ${
                    todo.completed
                      ? 'line-through text-gray-400'
                      : 'text-gray-700'
                  }`}
                >
                  {todo.text}
                </span>
              </div>
            )}

            {editingId !== todo._id && (
              <div className="flex space-x-2">
                <button
                  onClick={() => startEdit(todo)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrashAlt />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
