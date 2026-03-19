import { useEffect, useState } from 'react';
import { Card, CardBody, Spinner, Divider } from '@heroui/react';
import {
  PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, 
  ResponsiveContainer, CartesianGrid, Cell, AreaChart, Area
} from 'recharts';
import { FaChartPie, FaChartLine, FaArrowTrendUp, FaRankingStar } from 'react-icons/fa6';
import api from '../../../../config/api';

export default function Analytics() {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [topEvents, setTopEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Elite SaaS Color Palette
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'];

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);
      const [catRes, monthRes, revRes, topRes] = await Promise.all([
        api.get('/analytics/events-by-category'),
        api.get('/analytics/monthly-bookings'),
        api.get('/analytics/revenue-trend'),
        api.get('/analytics/top-events'),
      ]);
      setCategoryData(catRes.data.data);
      setMonthlyBookings(monthRes.data.data);
      setRevenueTrend(revRes.data.data);
      setTopEvents(topRes.data.data);
    } catch (err) {
      console.error('Error loading analytics', err);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0a0a0f] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-white font-black text-[10px] uppercase tracking-widest mb-2 border-b border-white/5 pb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
              {entry.name}: <span className="text-white">{entry.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#050505]">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] lg:ml-72 lg:mr-72 transition-all duration-300">
      <main className="max-w-full mx-auto p-8 md:p-12 space-y-10 animate-fade-in">
        
        {/* --- HEADER --- */}
        <header className="space-y-1 border-b border-white/5 pb-8">
          <div className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2">
            <FaArrowTrendUp /> Real-time Metrics
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Analytics <span className="text-blue-500 not-italic">Engine.</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">Deep dive into event performance and revenue growth.</p>
        </header>

        {/* --- CHART GRID --- */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Donut Chart: Events by Category */}
          <Card className="bg-[#111119] border border-white/5 rounded-3xl shadow-xl">
            <CardBody className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <FaChartPie className="text-blue-500" />
                <h2 className="text-white font-black uppercase tracking-widest text-xs">Inventory Distribution</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Bar Chart: Monthly Bookings */}
          <Card className="bg-[#111119] border border-white/5 rounded-3xl shadow-xl">
            <CardBody className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <FaRankingStar className="text-purple-500" />
                <h2 className="text-white font-black uppercase tracking-widest text-xs">Monthly Performance</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyBookings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                  <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Reservations" />
                  <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Gross income" />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Line Chart: Revenue Trend */}
          <Card className="bg-[#111119] border border-white/5 rounded-3xl shadow-xl xl:col-span-2">
            <CardBody className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <FaChartLine className="text-emerald-500" />
                <h2 className="text-white font-black uppercase tracking-widest text-xs">Revenue Growth Velocity</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" name="Net Revenue" />
                </AreaChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>

        {/* --- FOOTER --- */}
        <footer className="text-center pt-8">
           <p className="text-slate-800 text-[10px] font-black uppercase tracking-[0.5em]">
             Data Intelligence Core • Build 2.0.1
           </p>
        </footer>
      </main>
    </div>
  );
}