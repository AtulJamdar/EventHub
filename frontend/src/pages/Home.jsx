import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@heroui/react';
import { FaCalendarDays, FaChartLine, FaShield, FaUsers, FaArrowRight, FaStar } from 'react-icons/fa6';
import api from '../config/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
                  Manage Your Events with
                  <span className="block bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                    Confidence & Ease
                  </span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  The ultimate event management system for organizing, booking, and tracking events. 
                  Perfect for conferences, workshops, webinars, and more.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:shadow-lg transition-all"
                  onClick={() => navigate('/events')}
                  endContent={<FaArrowRight />}
                >
                  Browse Events
                </Button>
                <Button
                  size="lg"
                  variant="bordered"
                  className="border-2 border-purple-400 text-purple-400 font-semibold px-8 py-3 rounded-lg hover:bg-purple-400/10 transition-all"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <p className="text-3xl font-bold text-blue-400">500+</p>
                  <p className="text-gray-400 text-sm">Active Events</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-400">50K+</p>
                  <p className="text-gray-400 text-sm">Happy Users</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-pink-400">100%</p>
                  <p className="text-gray-400 text-sm">Satisfaction</p>
                </div>
              </div>
            </div>

            {/* Right Side - Image/Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-12 backdrop-blur-lg border border-blue-300/20">
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <FaCalendarDays className="text-white text-xl" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Easy Event Creation</p>
                        <p className="text-gray-300 text-sm">Create events in minutes</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                        <FaUsers className="text-white text-xl" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Manage Bookings</p>
                        <p className="text-gray-300 text-sm">Track all attendees</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                        <FaChartLine className="text-white text-xl" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">View Analytics</p>
                        <p className="text-gray-300 text-sm">Real-time insights</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-gray-400 text-lg">Everything you need to manage events successfully</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaCalendarDays className="text-2xl" />,
                title: 'Event Management',
                description: 'Create, edit, and manage events with detailed information'
              },
              {
                icon: <FaUsers className="text-2xl" />,
                title: 'Booking System',
                description: 'Allow users to book events and manage their reservations'
              },
              {
                icon: <FaChartLine className="text-2xl" />,
                title: 'Analytics Dashboard',
                description: 'Track metrics and visualize event performance'
              },
              {
                icon: <FaShield className="text-2xl" />,
                title: 'Secure Authentication',
                description: 'JWT-based security with role-based access control'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:border-blue-400/50 transition-all group"
              >
                <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Events</h2>
            <p className="text-gray-400 text-lg">Discover our upcoming events</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:border-blue-400/50 transition-all group cursor-pointer"
                  onClick={() => navigate(`/events/${event._id}`)}
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="inline-block bg-blue-500/30 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                        {event.category}
                      </div>
                      <h3 className="text-xl font-bold text-white">{event.title}</h3>
                    </div>

                    <p className="text-gray-300 text-sm line-clamp-2">{event.description}</p>

                    <div className="space-y-2 text-sm text-gray-400">
                      <p className="flex items-center gap-2">
                        <FaCalendarDays className="text-blue-400" />
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-300">{event.location}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-2xl font-bold text-blue-400">${event.price}</span>
                      <Button
                        isIconOnly
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/events/${event._id}`);
                        }}
                      >
                        <FaArrowRight />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:shadow-lg transition-all"
              onClick={() => navigate('/events')}
            >
              View All Events
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-white">Ready to Get Started?</h2>
          <p className="text-lg text-blue-100">
            Join thousands of event organizers who trust our platform to manage their events
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-all"
              onClick={() => navigate('/register')}
            >
              Sign Up Free
            </Button>
            <Button
              size="lg"
              variant="bordered"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-all"
              onClick={() => navigate('/events')}
            >
              Browse Events
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}