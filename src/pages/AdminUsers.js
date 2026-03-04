import React, { useEffect, useState } from 'react';
import UserService from '../services/UserService';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const goBack = () => {
    window.location.href = '/admin';
  };

  // registration state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('worker');
  const [newDepartment, setNewDepartment] = useState('');
  const [regError, setRegError] = useState(null);
  const [regSuccess, setRegSuccess] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await UserService.getAllUsers();
      // ensure we always have an array to map over
      setUsers(Array.isArray(data?.users) ? data.users : []);
    } catch (err) {
      setError(err?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRegister = async () => {
    setRegError(null);
    setRegSuccess(null);
    try {
      await UserService.registerUser({
        name: newName,
        email: newEmail,
        role: newRole,
        department: newDepartment
      });
      setRegSuccess('User registered successfully');
      fetchUsers();
      setNewName('');
      setNewEmail('');
      setNewDepartment('');
    } catch (err) {
      setRegError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Attendance System</h1>
          <ul className="flex gap-6">
            <li><a href="/admin" className="text-gray-700 hover:text-purple-600 font-semibold">Dashboard</a></li>
            <li><a href="/admin/users" className="text-gray-700 hover:text-purple-600 font-semibold">Users</a></li>
            <li><a href="/admin/reports" className="text-gray-700 hover:text-purple-600 font-semibold">Reports</a></li>
            <li><a href="/admin/analytics" className="text-gray-700 hover:text-purple-600 font-semibold">Analytics</a></li>
          </ul>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-200" onClick={goBack}>Logout</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <button className="mb-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-200" onClick={goBack}>← Back to Dashboard</button>
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Users</h2>

        {regError && <p className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">{regError}</p>}
        {regSuccess && <p className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">{regSuccess}</p>}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Register New User</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Full name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email address" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
              <select value={newRole} onChange={e => setNewRole(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="worker">Worker</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
              <input value={newDepartment} onChange={e => setNewDepartment(e.target.value)} placeholder="Department (optional)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200" onClick={handleRegister}>Register User</button>
          </div>
        </div>

        {loading && <p className="text-center text-gray-600">Loading users...</p>}
        {error && <p className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">{error}</p>}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{u.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.role}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.department || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
