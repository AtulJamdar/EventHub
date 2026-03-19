import { useState, useEffect } from 'react';
import { Card, CardBody, Spinner, Progress, Button, Divider } from '@heroui/react';
import { 
  FaCalendarDays, 
  FaClipboardList, 
  FaUsers, 
  FaChartLine, 
  FaCrown, 
  FaRankingStar,
  FaArrowTrendUp 
} from 'react-icons/fa6';
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

  const StatCard = ({ icon: Icon, title, value, gradient }) => (
    /* Removed 'hover:-translate-y-1' and scroll-like transitions */
    <Card className="bg-[#111119] border border-white/5 transition-colors duration-300 group">
      <CardBody className="p-8 relative overflow-hidden">
        {/* Static Glow instead of moving effect */}
        <div className={`absolute -right-2 -top-2 w-20 h-20 rounded-full blur-3xl opacity-10 ${gradient}`} />
        
        <div className="flex items-center gap-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg ${gradient}`}>
            <Icon />
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">{title}</p>
            <h3 className="text-3xl font-black text-white tracking-tighter">
              {value || '0'}
            </h3>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-slate-600 font-bold uppercase tracking-[0.3em] text-[10px]">Syncing Core Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      
      {/* MAIN GRID LAYOUT */}
      <div className="grid grid-cols-12 gap-6 p-6 lg:p-10">
  
        {/* HEADER (FULL WIDTH) */}
        <div className="col-span-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 pb-6">
          <div>
            <p className="text-blue-500 text-xs font-black uppercase tracking-[0.4em]">
              Live Performance
            </p>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight">
              System <span className="text-blue-500">Overview</span>
            </h1>
            <p className="text-slate-500 mt-2">
              Real-time analytics of your platform
            </p>
          </div>
  
          <Button
            onClick={fetchDashboardStats}
            className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600"
          >
            Refresh
          </Button>
        </div>
  
        {/* STATS (FULL WIDTH RESPONSIVE) */}
        <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            icon={FaCalendarDays}
            title="Total Events"
            value={stats?.totalEvents}
            gradient="bg-gradient-to-br from-blue-600 to-blue-400"
          />
          <StatCard
            icon={FaClipboardList}
            title="Total Bookings"
            value={stats?.totalBookings}
            gradient="bg-gradient-to-br from-purple-600 to-purple-400"
          />
          <StatCard
            icon={FaUsers}
            title="Users"
            value={stats?.totalUsers}
            gradient="bg-gradient-to-br from-indigo-600 to-indigo-400"
          />
          <StatCard
            icon={FaChartLine}
            title="Revenue"
            value={`$${stats?.totalRevenue?.toLocaleString()}`}
            gradient="bg-gradient-to-br from-emerald-600 to-emerald-400"
          />
        </div>
  
        {/* LEFT BIG SECTION */}
        <div className="col-span-12 xl:col-span-8">
          <Card className="h-full bg-[#111119] border border-white/5 rounded-3xl">
            <CardBody className="p-8 space-y-8">
  
              <h2 className="text-2xl font-black">Transaction Health</h2>
  
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Pending', val: stats?.bookingStatusSummary?.pending, color: 'text-yellow-500' },
                  { label: 'Approved', val: stats?.bookingStatusSummary?.approved, color: 'text-green-500' },
                  { label: 'Rejected', val: stats?.bookingStatusSummary?.rejected, color: 'text-red-500' }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-6 text-center">
                    <p className={`text-xs uppercase ${item.color}`}>{item.label}</p>
                    <p className="text-4xl font-black mt-2">{item.val || 0}</p>
                  </div>
                ))}
              </div>
  
              {/* PROGRESS */}
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-slate-400">Approval Rate</span>
                  <span className="font-bold">
                    {stats?.totalBookings > 0
                      ? ((stats.bookingStatusSummary.approved / stats.totalBookings) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
  
                <Progress
                  value={
                    stats?.totalBookings > 0
                      ? (stats.bookingStatusSummary.approved / stats.totalBookings) * 100
                      : 0
                  }
                  className="h-3"
                />
              </div>
  
            </CardBody>
          </Card>
        </div>
  
        {/* RIGHT PANEL */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
  
          {/* TOP EVENTS */}
          <Card className="bg-[#111119] border border-white/5 rounded-3xl">
            <CardBody className="p-6 space-y-4">
              <h3 className="font-black text-lg">Top Events</h3>
  
              {stats?.topEvents?.slice(0, 5).map((event, i) => (
                <div key={i} className="flex justify-between bg-white/5 p-4 rounded-xl">
                  <div>
                    <p className="font-bold text-sm">{event.eventName}</p>
                    <p className="text-xs text-slate-500">{event.bookings} bookings</p>
                  </div>
                  <span className="text-blue-500 font-bold">#{i + 1}</span>
                </div>
              ))}
            </CardBody>
          </Card>
  
          {/* CATEGORY */}
          <Card className="bg-[#111119] border border-white/5 rounded-3xl flex-1">
            <CardBody className="p-6 space-y-4">
              <h3 className="font-black text-lg">Category Distribution</h3>
  
              {stats?.eventsByCategory?.map((c, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{c._id}</span>
                    <span>{c.count}</span>
                  </div>
                  <Progress value={(c.count / 10) * 100} />
                </div>
              ))}
            </CardBody>
          </Card>
  
        </div>
  
        {/* FOOTER */}
        <div className="col-span-12 text-center text-xs text-slate-700 pt-4">
          SYSTEM CORE • BUILD 1.0.4
        </div>
  
      </div>
    </div>
  );
}