import React, { useState } from 'react';

const mypagelogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log('Logging in with:', { username, password });
      // Add your login logic here
    } else {
      console.log('Registering with:', { username, email, password });
      // Add your registration logic here
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isLogin ? 'Login' : 'Register'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {!isLogin && (
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:shadow-outline"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-center">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          className="text-blue-500 hover:text-blue-600 font-bold"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default mypagelogin ;