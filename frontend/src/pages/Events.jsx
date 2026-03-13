import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Card, CardBody, Select, SelectItem, Spinner, Pagination } from '@heroui/react';
import { FaCalendarDays, FaMapPin, FaMagnifyingGlass, FaArrowRight } from 'react-icons/fa6';
import api from '../config/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
    'Workshop',
    'Conference',
    'Seminar',
    'Webinar',
    'Networking',
    'Sports',
    'Entertainment',
    'Other'
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

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    setFilteredEvents(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, events]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <Navbar />

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Explore Events</h1>
            <p className="text-gray-400 text-lg">Discover and book amazing events</p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {/* Search */}
            <Input
              type="text"
              placeholder="Search events by title, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<FaMagnifyingGlass className="text-gray-400" />}
              classNames={{
                input: "bg-white/10 text-white placeholder-gray-400",
                inputWrapper: "bg-white/10 border border-white/20 hover:border-blue-400/50",
              }}
            />

            {/* Category Filter */}
            <Select
              label="Filter by Category"
              selectedKeys={selectedCategory ? [selectedCategory] : []}
              onChange={(e) => setSelectedCategory(e.target.value)}
              classNames={{
                trigger: "bg-white/10 border border-white/20 text-white",
                popoverContent: "bg-slate-800"
              }}
            >
              <SelectItem key="" value="">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </Select>

            {/* Results Count */}
            <div className="flex items-center justify-end">
              <p className="text-gray-400">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" color="current" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No events found</p>
            </div>
          ) : (
            <>
              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {paginatedEvents.map((event) => (
                  <Card
                    key={event._id}
                    className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-blue-400/50 transition-all group cursor-pointer"
                    onClick={() => navigate(`/events/${event._id}`)}
                  >
                    <CardBody className="p-0">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-blue-500/90 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            {event.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <h3 className="text-xl font-bold text-white line-clamp-2">
                          {event.title}
                        </h3>

                        <p className="text-gray-300 text-sm line-clamp-2">
                          {event.description}
                        </p>

                        {/* Info */}
                        <div className="space-y-2 text-sm text-gray-400">
                          <p className="flex items-center gap-2">
                            <FaCalendarDays className="text-blue-400" />
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                          <p className="flex items-center gap-2">
                            <FaMapPin className="text-blue-400" />
                            {event.location}
                          </p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <span className="text-2xl font-bold text-blue-400">
                            ${event.price}
                          </span>
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
                    </CardBody>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    total={totalPages}
                    page={currentPage}
                    onChange={setCurrentPage}
                    classNames={{
                      wrapper: "gap-2",
                      item: "w-10 h-10 text-white bg-white/10 border border-white/20",
                      active: "bg-blue-500 border-blue-500"
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}