import { Routes, Route } from 'react-router-dom';
import AdminSidebar from '../../../components/AdminSidebar';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Bookings from './pages/Bookings';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Users from './pages/Users';

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}