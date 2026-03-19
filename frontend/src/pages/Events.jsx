import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Card, CardBody, Select, SelectItem, Spinner, Pagination, Divider } from '@heroui/react';
import { FaCalendarDays, FaMapPin, FaMagnifyingGlass, FaArrowRight, FaFilter } from 'react-icons/fa6';
import api from '../config/api';
import UserSidebar from '../components/UserSidebar'; // Imported UserSidebar

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = [
    'Workshop', 'Conference', 'Seminar', 'Webinar', 'Networking', 'Sports', 'Entertainment', 'Other'
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      setEvents(response.data.data);
      setFilteredEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = events;
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }
    setFilteredEvents(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, events]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* 1. Sidebar Component */}
      <UserSidebar />

      {/* 2. Main content with matching Left and Right gaps */}
      <div className="flex-1 lg:ml-72 lg:mr-72 transition-all duration-300">
        <main className="p-6 md:p-10 space-y-10">
          
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white tracking-tight uppercase">Explore Events</h1>
            <p className="text-slate-500 text-sm font-medium italic">Discover and book premium experiences.</p>
          </div>

          {/* Filters Card - Styled like Dashboard Bento */}
          <Card className="bg-[#111119] border border-white/5 rounded-2xl shadow-xl">
            <CardBody className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                {/* Search */}
                <div className="md:col-span-7">
                  <Input
                    placeholder="Search by title or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    startContent={<FaMagnifyingGlass className="text-blue-500" />}
                    classNames={{
                      input: "text-white font-medium placeholder-slate-600",
                      inputWrapper: "bg-black/40 border-white/5 hover:border-blue-500/30 h-12 rounded-xl border transition-all",
                    }}
                  />
                </div>

                {/* Category Select */}
                <div className="md:col-span-5">
                  <Select
                    placeholder="Category"
                    selectedKeys={selectedCategory ? [selectedCategory] : []}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    startContent={<FaFilter className="text-purple-500 text-xs" />}
                    classNames={{
                      trigger: "bg-black/40 border-white/5 hover:border-blue-500/30 h-12 rounded-xl border transition-all",
                      value: "text-white font-bold text-sm",
                      popoverContent: "bg-[#111119] border border-white/10 text-white"
                    }}
                  >
                    <SelectItem key="" value="" className="text-slate-200">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat} className="text-slate-200">{cat}</SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Events Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" color="primary" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20 bg-[#111119] rounded-3xl border border-dashed border-white/10">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No events match your search</p>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedEvents.map((event) => (
                  <Card
                    key={event._id}
                    isPressable
                    className="bg-[#111119] border border-white/5 hover:border-blue-500/30 transition-all group rounded-2xl overflow-hidden"
                    onClick={() => navigate(`/events/${event._id}`)}
                  >
                    <CardBody className="p-0">
                      {/* Event Image */}
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75"
                        />
                        <div className="absolute top-3 right-3">
                          <span className="bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                            {event.category}
                          </span>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="p-5 space-y-4">
                        <h3 className="text-lg font-bold text-white truncate group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                          {event.title}
                        </h3>

                        <div className="space-y-2 text-xs text-slate-400 font-medium">
                          <p className="flex items-center gap-2">
                            <FaCalendarDays className="text-blue-500" size={12} />
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                          <p className="flex items-center gap-2">
                            <FaMapPin className="text-purple-500" size={12} />
                            <span className="truncate">{event.location}</span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <span className="text-xl font-black text-white">${event.price}</span>
                          <Button
                            isIconOnly
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/events/${event._id}`);
                            }}
                          >
                            <FaArrowRight size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center pb-10">
                  <Pagination
                    total={totalPages}
                    page={currentPage}
                    onChange={setCurrentPage}
                    classNames={{
                      wrapper: "gap-2",
                      item: "text-white bg-[#111119] border border-white/10 rounded-lg",
                      cursor: "bg-blue-600 text-white font-bold"
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Subtle Page Footer */}
          <footer className="text-center pt-6 opacity-30">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">EventHub Secure Catalog</p>
          </footer>
        </main>
      </div>
    </div>
  );
}