import React, { useState, useEffect } from 'react';
import AttendanceService from '../services/AttendanceService';
import AuthService from '../services/AuthService';

const WorkerDashboard = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [todayRecord, setTodayRecord] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await AttendanceService.getMyRecords();
      setRecords(data.records || []);
      const today = new Date();
      today.setHours(0,0,0,0);
      const todays = (data.records || []).find(r => new Date(r.date).setHours(0,0,0,0) === today.getTime());
      setTodayRecord(todays || null);
    } catch (err) {
      setError(err.message || 'Unable to load records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      await AttendanceService.checkIn({});
      await fetchRecords();
    } catch (err) {
      setError(err.message || 'Check-in failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      await AttendanceService.checkOut({});
      await fetchRecords();
    } catch (err) {
      setError(err.message || 'Check-out failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Worker Dashboard</h1>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-200" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-gray-700 mb-6">This is the worker portal where attendance can be marked and history viewed.</p>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div>
            {todayRecord ? (
              todayRecord.timeOut ? (
                <p className="text-gray-700">You've already checked out today.</p>
              ) : (
                <button className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleCheckOut} disabled={actionLoading}>
                  {actionLoading ? 'Processing...' : 'Check Out'}
                </button>
              )
            ) : (
              <button className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleCheckIn} disabled={actionLoading}>
                {actionLoading ? 'Processing...' : 'Check In'}
              </button>
            )}
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">Attendance History</h2>
        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">{error}</p>}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Time In</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Time Out</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {records.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.timeIn ? new Date(r.timeIn).toLocaleTimeString() : '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.timeOut ? new Date(r.timeOut).toLocaleTimeString() : '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.status}</td>
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

export default WorkerDashboard;
