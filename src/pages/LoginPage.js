import React, { useState } from 'react';
import AuthService from '../services/AuthService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // temporary email-based login to backend
      const result = await AuthService.login({ email });
      if (result.token) {
        // store token and redirect based on role
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        if (result.user.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/worker';
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Attendance System</h1>
          <p className="text-purple-100 text-sm">AI-Powered Face Recognition & Biometric Authentication</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {error && <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Continue'}
          </button>
        </form>

        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Features</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Face Recognition Attendance</li>
            <li>✓ WebAuthn Biometric Login</li>
            <li>✓ Real-time Verification</li>
            <li>✓ Analytics Dashboard</li>
          </ul>
        </div>

        <div className="px-8 py-4 text-center text-xs text-gray-500 bg-white border-t border-gray-100">
          <p>Phase Status: Frontend initialized - Backend integration pending</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
