import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner } from '@heroui/react';
import { FaCalendarDays, FaMapPin, FaClock, FaUsers, FaArrowLeft, FaTicket } from 'react-icons/fa6';
import api from '../config/api';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState({ tickets: 1 });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${id}`);
      setEvent(response.data.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookEvent = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setBookingError('');
    setBookingSuccess('');

    if (!bookingData.tickets || bookingData.tickets < 1) {
      setBookingError('Please select at least 1 ticket');
      return;
    }

    setBookingLoading(true);

    try {
      const response = await api.post('/bookings', {
        eventId: id,
        tickets: parseInt(bookingData.tickets)
      });

      if (response.data.success) {
        setBookingSuccess('Booking created successfully! Waiting for admin approval.');
        setBookingData({ tickets: 1 });
        setTimeout(() => {
          setBookingModalOpen(false);
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Booking failed. Please try again.';
      setBookingError(errorMessage);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" color="current" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white text-lg mb-4">Event not found</p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => navigate('/events')}
            >
              Back to Events
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <Navbar />

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            isIconOnly
            variant="light"
            className="text-white mb-8 hover:bg-white/10"
            onClick={() => navigate('/events')}
          >
            <FaArrowLeft size={20} />
          </Button>

          {/* Event Header */}
          <div className="mb-8">
            <div className="inline-block bg-blue-500/30 text-blue-300 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              {event.category}
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">{event.title}</h1>
            <p className="text-xl text-gray-300">{event.description}</p>
          </div>

          {/* Image */}
          <div className="w-full h-96 rounded-2xl overflow-hidden mb-8 border border-white/20">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Information */}
              <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                <CardBody className="p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-white">Event Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaCalendarDays className="text-blue-400 text-xl" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Date</p>
                        <p className="text-white font-semibold">
                          {eventDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaClock className="text-purple-400 text-xl" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Time</p>
                        <p className="text-white font-semibold">{event.time}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaMapPin className="text-pink-400 text-xl" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Location</p>
                        <p className="text-white font-semibold">{event.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaUsers className="text-green-400 text-xl" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Max Participants</p>
                        <p className="text-white font-semibold">{event.maxParticipants}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Organizer */}
              <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                <CardBody className="p-8 space-y-4">
                  <h3 className="text-xl font-bold text-white">Organized By</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {event.createdBy.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{event.createdBy.name}</p>
                      <p className="text-gray-400 text-sm">{event.createdBy.email}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Right Column - Booking Card */}
            <div>
              <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-blue-400/30 sticky top-24">
                <CardBody className="p-8 space-y-6">
                  <div>
                    <p className="text-gray-400 text-sm">Price per ticket</p>
                    <p className="text-4xl font-bold text-blue-400">${event.price}</p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-white font-semibold">Select Tickets</p>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={bookingData.tickets}
                      onChange={(e) => setBookingData({ tickets: e.target.value })}
                      classNames={{
                        input: "bg-white/10 text-white text-center text-lg",
                        inputWrapper: "bg-white/10 border border-white/20",
                      }}
                      startContent={<FaTicket className="text-blue-400" />}
                    />
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Total Price</p>
                    <p className="text-3xl font-bold text-white">
                      ${(event.price * bookingData.tickets).toFixed(2)}
                    </p>
                  </div>

                  <Button
                    fullWidth
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all"
                    onClick={() => setBookingModalOpen(true)}
                    disabled={isPastEvent}
                  >
                    {isPastEvent ? 'Event has passed' : 'Book Event'}
                  </Button>

                  {!isPastEvent && (
                    <p className="text-gray-400 text-xs text-center">
                      Booking will be pending admin approval
                    </p>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal isOpen={bookingModalOpen} onOpenChange={setBookingModalOpen} backdrop="blur">
        <ModalContent className="bg-slate-900 border border-white/20">
          <ModalHeader className="text-white">Confirm Booking</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Event</p>
                <p className="text-white font-semibold">{event.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Tickets</p>
                  <p className="text-white font-semibold">{bookingData.tickets}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total</p>
                  <p className="text-blue-400 font-semibold">
                    ${(event.price * bookingData.tickets).toFixed(2)}
                  </p>
                </div>
              </div>

              {bookingError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                  {bookingError}
                </div>
              )}

              {bookingSuccess && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-green-200 text-sm">
                  {bookingSuccess}
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              className="text-white"
              onClick={() => setBookingModalOpen(false)}
              disabled={bookingLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleBookEvent}
              loading={bookingLoading}
              disabled={bookingLoading}
            >
              {bookingLoading ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Footer />
    </div>
  );
}