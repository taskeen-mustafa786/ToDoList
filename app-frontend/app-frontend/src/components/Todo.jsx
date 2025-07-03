import { useState, useEffect } from 'react';
import { FaTrashAlt, FaEdit, FaCheck, FaPlus } from 'react-icons/fa';
import axios from 'axios';

const Todo = ({ user }) => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    try {
      const res = await axios.get('/api/todos', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTodo = async () => {
    if (input.trim() === '') return;
    try {
      const res = await axios.post(
        '/api/todos',
        { text: input },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setTodos([...todos, res.data]);
      setInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (id) => {
    try {
      await axios.put(
        `/api/todos/${id}`,
        { completed: !todos.find(todo => todo.id === id).completed },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = async () => {
    try {
      const res = await axios.put(
        `/api/todos/${editingId}`,
        { text: editText },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setTodos(todos.map(todo => 
        todo.id === editingId ? res.data : todo
      ));
      setEditingId(null);
      setEditText('');
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const remainingCount = todos.filter(todo => !todo.completed).length;

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
        <p className="mt-2 text-gray-600">
          {remainingCount} {remainingCount === 1 ? 'item' : 'items'} left
        </p>
      </div>
      
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
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition duration-200"
        >
          <FaPlus />
        </button>
      </div>
      
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1 rounded ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Completed
        </button>
      </div>
      
      <ul className="space-y-3">
        {filteredTodos.map(todo => (
          <li key={todo.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition">
            {editingId === todo.id ? (
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
                  onChange={() => toggleComplete(todo.id)}
                  className="h-5 w-5 text-blue-500 rounded focus:ring-blue-400 mr-3"
                />
                <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {todo.text}
                </span>
              </div>
            )}
            
            {editingId !== todo.id && (
              <div className="flex space-x-2">
                <button
                  onClick={() => startEdit(todo)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
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
