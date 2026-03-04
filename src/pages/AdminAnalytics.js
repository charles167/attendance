import React, { useEffect, useState } from 'react';
import AdminService from '../services/AdminService';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const resp = await AdminService.getAnalytics();
        setData(resp.breakdown);
      } catch (err) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

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
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-200" onClick={() => window.location.href='/login'}>Logout</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Analytics</h2>

        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">{error}</p>}
        {data && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Status Breakdown</h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(data).map(([name, value]) => ({ name, value }))}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    fill="#667eea"
                    label
                  >
                    {Object.entries(data).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
