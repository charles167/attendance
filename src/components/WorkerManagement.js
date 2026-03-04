import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WorkerManagement = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: ''
  });
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [departments, setDepartments] = useState([]);

  const token = localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchWorkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/api/admin/workers`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setWorkers(response.data.workers);
      // Extract unique departments
      const depts = [...new Set(response.data.workers.map(w => w.department).filter(Boolean))];
      setDepartments(depts);
    } catch (err) {
      setError('Failed to fetch workers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (!formData.name || !formData.email || !formData.department) {
      setSubmitError('All fields are required');
      return;
    }

    try {
      await axios.post(
        `${apiUrl}/api/admin/create-worker`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmitSuccess('Worker created successfully');
      setFormData({ name: '', email: '', department: '' });
      setShowForm(false);
      fetchWorkers();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to create worker');
    }
  };

  const handleDeleteWorker = async (id) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        await axios.delete(
          `${apiUrl}/api/admin/worker/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWorkers(workers.filter(w => w._id !== id));
      } catch (err) {
        setError('Failed to delete worker');
      }
    }
  };

  const handleResetCredentials = async (id) => {
    if (window.confirm('Reset this worker\'s credentials? They will need to re-register their face and WebAuthn.')) {
      try {
        await axios.post(
          `${apiUrl}/api/admin/worker/${id}/reset-credentials`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchWorkers();
        setSubmitSuccess('Credentials reset successfully');
      } catch (err) {
        setSubmitError('Failed to reset credentials');
      }
    }
  };

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = !departmentFilter || worker.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading workers...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">Worker Management</h2>

      {error && <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">{error}</div>}
      {submitError && <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">{submitError}</div>}
      {submitSuccess && <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">{submitSuccess}</div>}

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 flex gap-3">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {departments.length > 0 && (
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200"
        >
          {showForm ? '✕ Cancel' : '+ Add Worker'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Create New Worker</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Worker full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Worker email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="e.g. HR, IT, Operations"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button type="submit" className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200">
              Create Worker
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Workers ({filteredWorkers.length})</h3>
        </div>
        {filteredWorkers.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No workers found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Face</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">WebAuthn</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredWorkers.map(worker => (
                  <tr key={worker._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{worker.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{worker.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{worker.department || '-'}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{worker.userId.substring(0, 8)}...</td>
                    <td className="px-6 py-4 text-sm">{worker.faceDescriptor ? <span className="text-green-600">✓</span> : <span className="text-red-600">✗</span>}</td>
                    <td className="px-6 py-4 text-sm">{worker.webAuthnCredential?.credentialID ? <span className="text-green-600">✓</span> : <span className="text-red-600">✗</span>}</td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleResetCredentials(worker._id)}
                        className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition duration-200"
                        title="Reset credentials"
                      >
                        🔄
                      </button>
                      <button
                        onClick={() => handleDeleteWorker(worker._id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition duration-200"
                        title="Delete worker"
                      >
                        🗑️
                      </button>
                    </td>
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

export default WorkerManagement;
