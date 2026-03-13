import { useState, useEffect } from 'react';
import { Card, CardBody, Spinner } from '@heroui/react';
import { FaCalendarDays, FaClipboardList, FaUsers, FaChartLine } from 'react-icons/fa6';
import api from '../../../../config/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/analytics/dashboard/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-blue-400/50 transition-all">
      <CardBody className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <h3 className="text-4xl font-bold text-white mt-2">{value || '0'}</h3>
            {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
          </div>
          <div className={`p-4 rounded-lg ${color}`}>
            <Icon className="text-2xl text-white" />
          </div>
        </div>
      </CardBody>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" color="current" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's your event management overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FaCalendarDays}
          title="Total Events"
          value={stats?.totalEvents}
          color="bg-blue-600"
          subtitle="Active events"
        />
        <StatCard
          icon={FaClipboardList}
          title="Total Bookings"
          value={stats?.totalBookings}
          color="bg-purple-600"
          subtitle="All bookings"
        />
        <StatCard
          icon={FaUsers}
          title="Total Users"
          value={stats?.totalUsers}
          color="bg-pink-600"
          subtitle="Registered users"
        />
        <StatCard
          icon={FaChartLine}
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString()}`}
          color="bg-green-600"
          subtitle="From approved bookings"
        />
      </div>

      {/* Booking Status Summary */}
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <CardBody className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-white">Booking Status Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg p-6 border border-yellow-400/30">
              <p className="text-yellow-200 text-sm font-medium mb-2">Pending Approvals</p>
              <p className="text-3xl font-bold text-yellow-300">
                {stats?.bookingStatusSummary?.pending || 0}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg p-6 border border-green-400/30">
              <p className="text-green-200 text-sm font-medium mb-2">Approved</p>
              <p className="text-3xl font-bold text-green-300">
                {stats?.bookingStatusSummary?.approved || 0}
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg p-6 border border-red-400/30">
              <p className="text-red-200 text-sm font-medium mb-2">Rejected</p>
              <p className="text-3xl font-bold text-red-300">
                {stats?.bookingStatusSummary?.rejected || 0}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Events by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardBody className="p-8 space-y-6">
            <h3 className="text-xl font-bold text-white">Events by Category</h3>

            <div className="space-y-3">
              {stats?.eventsByCategory?.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{category._id}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                        style={{
                          width: `${(category.count / Math.max(...stats.eventsByCategory.map(c => c.count))) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-blue-400 font-semibold w-8 text-right">{category.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Top Events */}
        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardBody className="p-8 space-y-6">
            <h3 className="text-xl font-bold text-white">Top Events</h3>

            <div className="space-y-3">
              {stats?.topEvents?.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{event.eventName}</p>
                    <p className="text-gray-400 text-xs">{event.bookings} bookings</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-blue-400 font-bold">{event.bookings}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <CardBody className="p-8">
          <h3 className="text-xl font-bold text-white mb-6">Quick Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-gray-400 text-sm mb-2">Avg Revenue per Booking</p>
              <p className="text-2xl font-bold text-green-400">
                ${stats?.totalBookings > 0 ? (stats.totalRevenue / stats.totalBookings).toFixed(2) : '0.00'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Booking Approval Rate</p>
              <p className="text-2xl font-bold text-blue-400">
                {stats?.totalBookings > 0
                  ? ((stats.bookingStatusSummary.approved / stats.totalBookings) * 100).toFixed(1)
                  : '0'}
                %
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Avg Users per Event</p>
              <p className="text-2xl font-bold text-purple-400">
                {stats?.totalEvents > 0 ? (stats.totalUsers / stats.totalEvents).toFixed(1) : '0'}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}