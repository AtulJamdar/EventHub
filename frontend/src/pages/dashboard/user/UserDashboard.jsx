import { Routes, Route } from 'react-router-dom';
import UserSidebar from '../../../components/UserSidebar';
import Dashboard from './pages/Dashboard';
import MyBookings from './pages/MyBookings';
import BrowseEvents from './pages/BrowseEvents';

export default function UserDashboard() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <UserSidebar />
      <main className="flex-1 lg:ml-64 transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/browse-events" element={<BrowseEvents />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}