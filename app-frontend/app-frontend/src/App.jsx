import { useState } from 'react';
import axios from 'axios';
import Todo from './Todo';

const App = () => {
  const [user, setUser ] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/users/${isLogin ? 'login' : 'register'}`, {
        email,
        password,
      });
      setUser (res.data);
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          {user ? (
            <>
              <Todo user={user} />
              <button onClick={() => setUser (null)} className="mt-4 text-red-500">Logout</button>
            </>
          ) : (
            <form onSubmit={handleAuth} className="flex flex-col">
              <h1 className="text-3xl font-bold text-center mb-4">{isLogin ? 'Login' : 'Register'}</h1>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4 p-2 border rounded"
                placeholder="Email"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4 p-2 border rounded"
                placeholder="Password"
                required
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                {isLogin ? 'Login' : 'Register'}
              </button>
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="mt-2 text-blue-500">
                {isLogin ? 'Create an account' : 'Already have an account?'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
