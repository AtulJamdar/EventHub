import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Button, Spinner, Divider } from '@heroui/react';
import { 
  FaCalendarDays, 
  FaWallet, 
  FaTicket, 
  FaClock, 
  FaCircleCheck 
} from 'react-icons/fa6';
import api from '../../../../config/api';
import { useAuthStore } from '../../../../store/authStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const response = await api.get('/bookings/user/my-bookings');
      const userBookings = response.data.data || [];

      setBookings(userBookings.slice(0, 5));

      const approvedBookings = userBookings.filter(
        (b) => b.status === 'approved'
      );

      const upcomingBookings = approvedBookings.filter(
        (b) => new Date(b.eventId.date) > new Date()
      ).length;

      setStats({
        totalBookings: userBookings.length,
        upcomingBookings,
        totalSpent: approvedBookings
          .reduce((sum, b) => sum + b.totalPrice, 0)
          .toLocaleString()
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Loader (no layout hacks)
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return (
    // ❌ NO margin-left / margin-right
    // Grid layout (from DashboardLayout) handles spacing
    <div className="min-h-screen bg-[#050505]">
      
      <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
        
        {/* HEADER */}
        <header className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight uppercase">
            Dashboard
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Authorized Access:{' '}
            <span className="text-blue-500 font-bold">
              {user?.name}
            </span>
          </p>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: 'Bookings',
              val: stats.totalBookings,
              icon: <FaTicket />,
              color: 'text-blue-500'
            },
            {
              label: 'Upcoming',
              val: stats.upcomingBookings,
              icon: <FaCalendarDays />,
              color: 'text-purple-500'
            },
            {
              label: 'Total Spent',
              val: `$${stats.totalSpent}`,
              icon: <FaWallet />,
              color: 'text-emerald-500'
            }
          ].map((item, i) => (
            <Card
              key={i}
              className="bg-[#111119] border border-white/5 hover:border-blue-500/20 transition-all rounded-2xl shadow-xl"
            >
              <CardBody className="p-6 flex items-center gap-5">
                <div className={`text-xl ${item.color} bg-white/5 p-3 rounded-xl`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1">
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {item.val}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <Divider className="bg-white/5" />

        {/* CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          
          {/* ACTIVITY */}
          <div className="xl:col-span-2 space-y-6">
            <h2 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
              <FaClock className="text-slate-600 text-sm" />
              Recent Activity
            </h2>

            <div className="space-y-3">
              {bookings.length === 0 ? (
                <div className="p-16 text-center bg-[#111119] rounded-3xl border border-dashed border-white/10 text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                  No recent transaction data
                </div>
              ) : (
                bookings.map((booking) => (
                  booking.eventId && (
                  <Card
                    key={booking._id}
                    isPressable
                    className="bg-[#111119] border border-white/5 hover:border-blue-500/30 transition-all rounded-2xl"
                  >
                    <CardBody className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4 min-w-0">
                        <FaTicket className="text-blue-500 flex-shrink-0" />
                        <p className="text-white font-bold truncate">
                          {booking.eventId?.title || 'Event Not Available'}
                        </p>
                      </div>

                      <div
                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase flex items-center gap-2 ${
                          booking.status === 'approved'
                            ? 'text-emerald-400 bg-emerald-400/5'
                            : 'text-yellow-400 bg-yellow-400/5'
                        }`}
                      >
                        {booking.status === 'approved' && (
                          <FaCircleCheck size={10} />
                        )}
                        {booking.status}
                      </div>
                    </CardBody>
                  </Card>
                  )
                ))
              )}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="space-y-6">
            <h2 className="text-lg font-black text-white uppercase tracking-widest">
              Navigation
            </h2>

            <div className="flex flex-col gap-4">
              <Button
                fullWidth
                className="h-20 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl flex flex-col gap-0 shadow-lg border-none"
                onClick={() => navigate('/events')}
              >
                <span className="text-xs opacity-70 font-bold">Discover</span>
                <span>Browse Events</span>
              </Button>

              <Button
                fullWidth
                className="h-20 bg-[#111119] border border-white/10 hover:border-purple-500/40 text-white font-black uppercase tracking-widest rounded-2xl flex flex-col gap-0 transition-all"
                onClick={() => navigate('/dashboard/my-bookings')}
              >
                <span className="text-xs text-purple-500 font-bold">History</span>
                <span>My Tickets</span>
              </Button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}