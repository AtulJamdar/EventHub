import { useNavigate } from 'react-router-dom';
import Events from '../../../Events';
// import UserSidebar from '../components/UserSidebar'; // Ensure this path is correct for your structure
import UserSidebar from '../../../../components/UserSidebar';

export default function BrowseEvents() {
  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* 1. Sidebar stays fixed on the left */}
      <UserSidebar />

      {/* 2. Main Content Area starts after Sidebar and mirrors the gap on the right */}
      <div className="flex-1 lg:ml-72 lg:mr-72 transition-all duration-300">
        <main className="p-6 md:p-10 space-y-8">
          
          {/* Header section to match Dashboard/Bookings style */}
          <header className="space-y-1 mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight uppercase">
              Browse Events
            </h1>
            <p className="text-slate-500 text-sm font-medium italic">
              Discover and book your next premium experience.
            </p>
          </header>

          {/* Core Events Component */}
          <div className="animate-fade-in">
            <Events />
          </div>

          {/* Footer Info */}
          <div className="pt-12 text-center">
            <p className="text-slate-800 text-[10px] font-black uppercase tracking-[0.4em]">
              EventHub Global Catalog • Secure Booking System
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}