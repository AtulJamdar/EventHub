import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Input, Textarea, Spinner } from '@heroui/react';
import { 
  FaCalendarDays, 
  FaChartLine, 
  FaShield, 
  FaUsers, 
  FaArrowRight, 
  FaFacebook,
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaMagnifyingGlass,
  FaStar,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGithub
} from 'react-icons/fa6';
import api from '../config/api';
import Navbar from '../components/Navbar';

export default function Home() {
  const navigate = useNavigate();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      const response = await api.get('/events');
      setFeaturedEvents(response.data.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0f] text-slate-200 selection:bg-blue-600/30 font-sans overflow-x-hidden">
      <Navbar />

      {/* --- SECTION 1: HERO --- */}
      <section id="home" className="relative min-h-screen flex flex-col items-center justify-center border-b border-slate-800/50 px-6 text-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[5%] w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 max-w-5xl space-y-12">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-semibold tracking-wide animate-pulse">
             <FaStar className="text-yellow-400 text-xs" />
             <span>The #1 Event Management Solution</span>
          </div>

          <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter leading-none text-white">
            UNLIMITED <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent uppercase">
              POSSIBILITIES.
            </span>
          </h1>
          <p className="text-xl md:text-3xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
            Organize, book, and track world-class events from one centralized, powerful dashboard.
          </p>
          <div className="pt-8">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black h-20 px-16 rounded-2xl text-2xl transition-all shadow-[0_10px_40px_rgba(37,99,235,0.3)] hover:scale-105 hover:-translate-y-1"
              onClick={() => navigate('/events')}
              endContent={<FaArrowRight />}
            >
              BROWSE EVENTS
            </Button>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: THE DASHBOARD (CENTERED) --- */}
      <section id="about" className="relative min-h-screen flex flex-col items-center justify-center py-24 px-6 border-b border-slate-800/50 text-center">
        <div className="max-w-5xl space-y-16">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-8xl font-black leading-tight text-white">
              Enjoy on your <br/>
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent italic">
                Dashboard.
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
              Real-time metrics, attendee tracking, and ticket sales. Everything you need is perfectly centered in your view.
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto group">
            <div className="relative z-10 p-3 bg-slate-900/50 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-slate-800 transition-all">
               <img 
                src="https://images.unsplash.com/photo-1551288049-bbdac8a28a1e?auto=format&fit=crop&q=80&w=1000" 
                className="rounded-2xl w-full grayscale-[50%] group-hover:grayscale-0 transition-all duration-700"
                alt="Dashboard Preview"
              />
            </div>
            <div className="absolute -inset-10 bg-blue-600/5 blur-[100px] -z-10 rounded-full" />
          </div>
        </div>
      </section>

      {/* --- SECTION 3: FEATURES (CENTERED GRID) --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center py-24 px-6 border-b border-slate-800/50 bg-[#08080c] text-center">
        <div className="max-w-6xl w-full space-y-20">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white">
            BUILT FOR <br/><span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent uppercase tracking-wider text-4xl md:text-6xl">Intelligence.</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <FaShield />, label: "Security", desc: "Bank-grade JWT" },
              { icon: <FaUsers />, label: "Community", desc: "Role-based access" },
              { icon: <FaChartLine />, label: "Analytics", desc: "Real-time growth" },
              { icon: <FaCalendarDays />, label: "Precision", desc: "Smart scheduling" }
            ].map((item, i) => (
              <div key={i} className="bg-slate-900 p-12 rounded-[2.5rem] border border-slate-800 flex flex-col items-center gap-6 group hover:border-blue-500/50 hover:bg-slate-800/50 transition-all duration-500">
                <div className="text-6xl text-blue-500 group-hover:scale-110 transition-transform">{item.icon}</div>
                <div>
                  <h4 className="font-black text-2xl uppercase tracking-tighter text-white">{item.label}</h4>
                  <p className="text-slate-500 group-hover:text-blue-200 text-sm mt-3 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 4: SHOWCASE (TRENDING) --- */}
      <section id="events" className="relative min-h-screen flex flex-col items-center justify-center py-24 px-6 border-b border-slate-800/50 text-center">
        <div className="max-w-7xl w-full space-y-16">
          <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase text-white">
            Discover <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Trending.</span>
          </h2>

          {loading ? (
            <div className="flex items-center justify-center h-64"><Spinner size="lg" color="current" className="text-purple-500" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {featuredEvents.map((event) => (
                <div
                  key={event._id}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 transition-all duration-500 hover:scale-[1.03] hover:border-blue-500/50 hover:shadow-[0_15px_60px_rgba(37,99,235,0.1)]"
                  onClick={() => navigate(`/events/${event._id}`)}
                >
                  <div className="aspect-[3/4] relative">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover brightness-[0.5] group-hover:brightness-95 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                    <div className="absolute bottom-0 p-10 space-y-4 w-full">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-[10px] font-black px-4 py-2 uppercase rounded-full tracking-wider">
                         {event.category}
                      </span>
                      <h3 className="text-4xl font-black leading-tight uppercase text-white">{event.title}</h3>
                      <p className="text-blue-400 font-black text-2xl tracking-widest">${event.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button 
            className="bg-transparent border-2 border-slate-700 text-slate-300 font-black h-20 px-16 text-xl hover:bg-white hover:text-black rounded-full"
            onClick={() => navigate('/events')}
          >
            EXPLORE ALL
          </Button>
        </div>
      </section>

      {/* --- SECTION 5: CONTACT (CENTERED) --- */}
      <section id="contact" className="relative min-h-screen flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="max-w-4xl w-full space-y-12">
          <h2 className="text-6xl md:text-9xl font-black italic text-white tracking-tighter">Connect.</h2>
          <div className="bg-slate-900/60 p-10 md:p-20 rounded-[3rem] border border-slate-800 space-y-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Name" variant="flat" classNames={{ inputWrapper: "bg-[#1a1a24] h-18 rounded-2xl", input: "text-white font-bold" }} />
              <Input label="Email" variant="flat" classNames={{ inputWrapper: "bg-[#1a1a24] h-18 rounded-2xl", input: "text-white font-bold" }} />
            </div>
            <Textarea label="Message" variant="flat" minRows={5} classNames={{ inputWrapper: "bg-[#1a1a24] rounded-2xl", input: "text-white font-bold" }} />
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black h-20 rounded-2xl text-2xl transition-all hover:shadow-[0_10px_30px_rgba(37,99,235,0.4)]">
              SEND MESSAGE
            </Button>
          </div>
        </div>
      </section>

      {/* --- SECTION 6: THE TRADITIONAL FOOTER (COMPACT) --- */}
      <footer className="bg-[#0a0a0f] text-slate-200 selection:bg-blue-600/30 font-sans overflow-x-hidden border-t border-slate-800">
      {/* Container with significant top and bottom padding */}
      <div className="max-w-7xl mx-auto py-32 px-6">
        {/* Four-column grid with dramatically increased horizontal gaps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-20 gap-y-16">
          
          {/* Column 1: EventHub - bold header, leading-relaxed paragraph, specific text */}
          {/* Increased space-y between header and paragraph */}
          <div className="space-y-10 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4">
               {/* Rounded square blue-purple gradient with letter 'E' in center from our other project */}
               <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-[0_10px_40px_rgba(168,85,247,0.3)]">
                 <span className="text-white font-black text-2xl uppercase">E</span>
               </div>
               <span className="text-white font-black text-3xl tracking-tighter uppercase">EventHub</span>
            </div>
            <p className="text-slate-400 text-base font-medium leading-relaxed max-w-sm mx-auto md:mx-0">
              The ultimate platform for managing events with ease and confidence.
            </p>
          </div>

          {/* Columns 2 & 3: Quick Links & Support - black headers, spacious list, specific links */}
          {/* Column 2: Quick Links */}
          {/* Increased space-y between header and list */}
          <div className="space-y-10 text-center md:text-left">
            <h3 className="text-lg font-black uppercase tracking-widest text-slate-100">Quick Links</h3>
            {/* Increased space-y between each link */}
            <ul className="space-y-6">
              {['Home', 'Events', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-base font-semibold text-slate-500 hover:text-white transition-colors duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          {/* Increased space-y between header and list */}
          <div className="space-y-10 text-center md:text-left">
            <h3 className="text-lg font-black uppercase tracking-widest text-slate-100">Support</h3>
            {/* Increased space-y between each link */}
            <ul className="space-y-6">
              {['Help Center', 'FAQ', 'Privacy Policy', 'Terms & Conditions'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-base font-semibold text-slate-500 hover:text-white transition-colors duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Follow Us - black header, modern social icons, increased gap */}
          {/* Increased space-y between header and icons */}
          <div className="space-y-10 text-center md:text-left">
            <h3 className="text-lg font-black uppercase tracking-widest text-slate-100">Follow Us</h3>
            {/* Increased horizontal gap between icons */}
            <div className="flex items-center justify-center md:justify-start gap-x-10 text-4xl text-slate-500">
              {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram].map((Icon, i) => (
                <a key={i} href="#" className="hover:text-blue-400 cursor-pointer transition-colors duration-300 hover:-translate-y-1">
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: separate section with thin top border and significant vertical separation */}
      <div className="border-t border-slate-800">
        {/* Container with significant padding */}
        <div className="max-w-7xl mx-auto py-16 px-6">
          {/* flex layout with dramatically increased space between items and proper alignment */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-y-10 md:gap-y-0 text-center md:text-left">
            {/* Copyright Text - with massive right pr and capitalization from screenshot */}
            <p className="text-slate-600 text-sm font-bold uppercase tracking-[0.2em] md:pr-10">
              © 2026 EVENTHUB. ALL RIGHTS RESERVED.
            </p>
            
            {/* "Made with ❤️" text - with proper bold weight and red heart color */}
            <p className="text-slate-700 text-lg font-bold flex items-center justify-center md:justify-end gap-x-3">
              <span>Made with</span>
              <span className="text-red-600 font-black">❤️</span>
              <span>for event organizers</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
}