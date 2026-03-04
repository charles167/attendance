import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import WorkerManagement from '../components/WorkerManagement';
import AttendanceAnalytics from '../components/AttendanceAnalytics';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/admin/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (e) {
      navigate('/admin/login');
      return;
    }

    fetchDashboardData(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchDashboardData = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setDashboardData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login');
      } else {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const handleRefresh = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoading(true);
      fetchDashboardData(token);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700">
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-2xl font-semibold">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700">
      {/* Header */}
      <header className="bg-purple-700 shadow-lg">
        <div className="p-6 flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-purple-100 mt-2">Welcome, {user?.name}!</p>
          </div>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition duration-200"
              onClick={handleRefresh}
              title="Refresh"
            >
              🔄
            </button>
            <button
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="mx-4 mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="bg-purple-600 shadow">
        <div className="flex flex-wrap gap-0">
          <button
            className={`flex-1 px-4 py-3 font-semibold transition duration-200 border-b-2 ${
              activeTab === 'overview'
                ? 'bg-purple-700 text-white border-purple-300'
                : 'text-purple-100 hover:bg-purple-500 border-transparent'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`flex-1 px-4 py-3 font-semibold transition duration-200 border-b-2 ${
              activeTab === 'workers'
                ? 'bg-purple-700 text-white border-purple-300'
                : 'text-purple-100 hover:bg-purple-500 border-transparent'
            }`}
            onClick={() => setActiveTab('workers')}
          >
            👥 Worker Management
          </button>
          <button
            className={`flex-1 px-4 py-3 font-semibold transition duration-200 border-b-2 ${
              activeTab === 'attendance'
                ? 'bg-purple-700 text-white border-purple-300'
                : 'text-purple-100 hover:bg-purple-500 border-transparent'
            }`}
            onClick={() => setActiveTab('attendance')}
          >
            📋 Attendance
          </button>
          <button
            className={`flex-1 px-4 py-3 font-semibold transition duration-200 border-b-2 ${
              activeTab === 'analytics'
                ? 'bg-purple-700 text-white border-purple-300'
                : 'text-purple-100 hover:bg-purple-500 border-transparent'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'overview' && dashboardData && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 shadow hover:shadow-lg transition">
                <div className="text-4xl mb-2">👥</div>
                <div className="text-3xl font-bold text-blue-600">{dashboardData.totalWorkers}</div>
                <div className="text-gray-600 font-semibold mt-2">Total Workers</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 shadow hover:shadow-lg transition">
                <div className="text-4xl mb-2">✅</div>
                <div className="text-3xl font-bold text-green-600">{dashboardData.presentToday}</div>
                <div className="text-gray-600 font-semibold mt-2">Present Today</div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 shadow hover:shadow-lg transition">
                <div className="text-4xl mb-2">⏰</div>
                <div className="text-3xl font-bold text-yellow-600">{dashboardData.lateToday}</div>
                <div className="text-gray-600 font-semibold mt-2">Late Today</div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 shadow hover:shadow-lg transition">
                <div className="text-4xl mb-2">❌</div>
                <div className="text-3xl font-bold text-red-600">{dashboardData.absentToday}</div>
                <div className="text-gray-600 font-semibold mt-2">Absent Today</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workers' && <WorkerManagement />}
        {activeTab === 'attendance' && <AttendanceAnalytics />}
        {activeTab === 'analytics' && <AttendanceAnalytics isAnalytics={true} />}
      </main>
    </div>
  );
};

export default AdminDashboard;
