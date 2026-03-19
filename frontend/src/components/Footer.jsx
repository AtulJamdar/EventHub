import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaStar } from 'react-icons/fa6';

export default function Footer() {
  return (
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
  );
}