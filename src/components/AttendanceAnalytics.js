import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AttendanceAnalytics = ({ isAnalytics = false }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [reportsData, setReportsData] = useState(null);
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const token = localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnalytics]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (isAnalytics) {
        // Fetch analytics and reports
        const [analyticsRes, reportsRes] = await Promise.all([
          axios.get(`${apiUrl}/api/admin/analytics`,
            { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${apiUrl}/api/admin/reports`,
            { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setAnalyticsData(analyticsRes.data);
        setReportsData(reportsRes.data);
      } else {
        // Fetch attendance records
        const response = await axios.get(`${apiUrl}/api/admin/attendance`,
          { headers: { Authorization: `Bearer ${token}` } });
        setAttendanceRecords(response.data.records || []);
      }
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = attendanceRecords.filter(record => {
    if (dateFilter) {
      const recordDate = new Date(record.date).toISOString().split('T')[0];
      if (recordDate !== dateFilter) return false;
    }
    if (statusFilter && record.status !== statusFilter) return false;
    return true;
  });

  const COLORS = ['#667eea', '#764ba2', '#ffa500', '#ef4444'];
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return 'text-green-600 bg-green-100 px-2 py-1 rounded';
      case 'absent': return 'text-red-600 bg-red-100 px-2 py-1 rounded';
      case 'late': return 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded';
      case 'excused': return 'text-blue-600 bg-blue-100 px-2 py-1 rounded';
      default: return 'text-gray-600 bg-gray-100 px-2 py-1 rounded';
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {error && <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">{error}</div>}

      {!isAnalytics && (
        <>
          <h2 className="text-3xl font-bold text-white mb-6">Attendance Records</h2>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="excused">Excused</option>
            </select>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {filteredRecords.length === 0 ? (
              <p className="p-8 text-center text-gray-500">No attendance records found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Worker Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Check-In</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Check-Out</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredRecords.map(record => (
                      <tr key={record._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{record.userId?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{record.userId?.email || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(record.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{record.timeIn ? new Date(record.timeIn).toLocaleTimeString() : '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{record.timeOut ? new Date(record.timeOut).toLocaleTimeString() : '-'}</td>
                        <td className="px-6 py-4 text-sm"><span className={getStatusColor(record.status)}>{record.status}</span></td>
                        <td className="px-6 py-4 text-sm text-gray-600">{record.verificationMethod || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {isAnalytics && analyticsData && reportsData && (
        <>
          <h2 className="text-3xl font-bold text-white mb-6">Analytics Dashboard</h2>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm font-semibold text-gray-600">Total Attendance</div>
              <div className="text-3xl font-bold text-purple-600 mt-2">{analyticsData.breakdown.present + analyticsData.breakdown.absent + analyticsData.breakdown.late}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm font-semibold text-gray-600">Present</div>
              <div className="text-3xl font-bold text-green-600 mt-2">{analyticsData.breakdown.present}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm font-semibold text-gray-600">Absent</div>
              <div className="text-3xl font-bold text-red-600 mt-2">{analyticsData.breakdown.absent}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm font-semibold text-gray-600">Late Arrivals</div>
              <div className="text-3xl font-bold text-yellow-600 mt-2">{analyticsData.lateArrivals}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm font-semibold text-gray-600">Late %</div>
              <div className="text-3xl font-bold text-orange-600 mt-2">{analyticsData.latePercentage}%</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Breakdown Pie Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Present', value: analyticsData.breakdown.present },
                      { name: 'Absent', value: analyticsData.breakdown.absent },
                      { name: 'Late', value: analyticsData.breakdown.late }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Trend Line Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Attendance Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="day"
                    label={{ value: 'Day of Month', position: 'insideBottomRight', offset: -5 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#667eea"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 7-Day Report */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">7-Day Report</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportsData.reports}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#667eea" name="Total" />
                <Bar dataKey="present" fill="#3a3" name="Present" />
                <Bar dataKey="late" fill="#ffa500" name="Late" />
                <Bar dataKey="absent" fill="#ef4444" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Department Statistics */}
          {Object.keys(analyticsData.departmentStats || {}).length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(analyticsData.departmentStats).map(([dept, stats]) => (
                  <div key={dept} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">{dept}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Workers:</span>
                        <span className="font-semibold text-gray-800">{stats.totalWorkers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Present Today:</span>
                        <span className="font-semibold text-green-600">{stats.presentToday}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AttendanceAnalytics;
