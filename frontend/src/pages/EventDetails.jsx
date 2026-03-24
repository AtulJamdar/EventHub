import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner, Divider } from '@heroui/react';
import { FaCalendarDays, FaMapPin, FaClock, FaUsers, FaArrowLeft, FaTicket, FaCircleCheck, FaUserTie, FaShieldHeart } from 'react-icons/fa6';
import api from '../config/api';
import { normalizeImageUrl } from '../utils/imagePath';
import { useAuthStore } from '../store/authStore';
import UserSidebar from '../components/UserSidebar';

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
    if (!isAuthenticated) { navigate('/login'); return; }
    setBookingError('');
    setBookingSuccess('');
    setBookingLoading(true);
    try {
      const response = await api.post('/bookings', {
        eventId: id,
        tickets: parseInt(bookingData.tickets)
      });
      if (response.data.success) {
        setBookingSuccess('Booking confirmed!');
        setTimeout(() => {
          setBookingModalOpen(false);
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      setBookingError(error.response?.data?.message || 'Booking failed.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Spinner color="primary" />
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date();

  return (
    <div className="min-h-screen bg-[#050505] flex">
      <UserSidebar />

      <div className="flex-1 lg:ml-72 lg:mr-72 transition-all duration-300">
        <main className="p-6 md:p-8 space-y-8 animate-fade-in max-w-[1200px] mx-auto">
          
          {/* --- TOP BAR --- */}
          <div className="flex items-center justify-between">
            <Button
              size="sm"
              variant="flat"
              className="bg-white/5 text-slate-400 font-bold rounded-lg"
              onClick={() => navigate('/events')}
              startContent={<FaArrowLeft />}
            >
              Back
            </Button>
            <div className="flex items-center gap-2 text-slate-600 text-[9px] font-black uppercase tracking-[0.2em]">
               <FaShieldHeart className="text-blue-500" /> Secure Encryption
            </div>
          </div>

          {/* --- COMPACT HERO --- */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-3">
                <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">{event.category}</span>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-tight">
                  {event.title}
                </h1>
              </div>

              <div className="w-full h-[320px] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl relative">
                <img src={normalizeImageUrl(event.image)} alt={event.title} className="w-full h-full object-cover brightness-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-black text-white uppercase tracking-tight">Overview</h2>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  {event.description}
                </p>
              </div>
            </div>

            {/* --- BOOKING SIDEBAR (SCALED DOWN) --- */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="bg-[#111119] border border-blue-500/10 rounded-[2rem] shadow-xl overflow-hidden">
                <div className="h-1.5 bg-blue-600" />
                <CardBody className="p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Entry Fee</p>
                      <h3 className="text-3xl font-black text-white">${event.price}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-500">
                      <FaTicket />
                    </div>
                  </div>

                  <Divider className="bg-white/5" />

                  <div className="grid grid-cols-2 gap-3">
                     <div className="space-y-2">
                        <p className="text-slate-500 text-[9px] font-black uppercase ml-1">Quantity</p>
                        <Input
                          type="number"
                          size="sm"
                          value={bookingData.tickets}
                          onChange={(e) => setBookingData({ tickets: e.target.value })}
                          classNames={{
                            input: "text-white font-bold text-center",
                            inputWrapper: "bg-black/40 border-white/5 rounded-xl h-12",
                          }}
                        />
                     </div>
                     <div className="space-y-2">
                        <p className="text-slate-500 text-[9px] font-black uppercase ml-1">Total</p>
                        <div className="h-12 flex items-center justify-center bg-blue-500/10 border border-blue-500/20 rounded-xl">
                           <span className="text-blue-400 font-black">${(event.price * bookingData.tickets).toFixed(0)}</span>
                        </div>
                     </div>
                  </div>

                  <Button
                    fullWidth
                    className="h-14 bg-blue-600 text-white font-black uppercase tracking-widest rounded-xl shadow-lg border-none text-sm"
                    onClick={() => setBookingModalOpen(true)}
                    disabled={isPastEvent}
                  >
                    {isPastEvent ? 'Expired' : 'Book Now'}
                  </Button>
                </CardBody>
              </Card>

              {/* QUICK INFO BENTO */}
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: <FaCalendarDays />, label: 'Date', val: eventDate.toLocaleDateString(), color: 'text-blue-500' },
                  { icon: <FaClock />, label: 'Time', val: event.time, color: 'text-purple-500' },
                  { icon: <FaMapPin />, label: 'Venue', val: event.location, color: 'text-emerald-500' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-[#111119] border border-white/5 rounded-xl">
                    <div className={`${item.color} text-sm`}>{item.icon}</div>
                    <div>
                      <p className="text-slate-600 text-[8px] font-black uppercase tracking-widest leading-none">{item.label}</p>
                      <p className="text-white font-bold text-[11px] mt-1">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      <Modal 
        isOpen={bookingModalOpen} 
        onOpenChange={setBookingModalOpen} 
        backdrop="blur"
        classNames={{
            base: "bg-[#0a0a0f] border border-white/10 rounded-[2rem]",
            header: "text-white font-black uppercase tracking-widest text-sm border-b border-white/5 px-8 py-4",
            footer: "border-t border-white/5 px-8 py-4"
        }}
      >
        <ModalContent>
          <ModalHeader>Confirm Order</ModalHeader>
          <ModalBody className="px-8 py-8 space-y-4">
            <p className="text-slate-400 text-sm font-medium">You are booking tickets for:</p>
            <p className="text-white font-black text-xl tracking-tight uppercase italic">{event.title}</p>
            <div className="flex justify-between bg-white/5 p-4 rounded-xl border border-white/5">
               <span className="text-slate-500 text-xs font-bold uppercase">Final Total</span>
               <span className="text-blue-400 font-black">${(event.price * bookingData.tickets).toFixed(2)}</span>
            </div>
            {bookingError && <p className="text-red-500 text-[10px] font-bold text-center italic">{bookingError}</p>}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" className="text-slate-500 text-xs font-black uppercase" onClick={() => setBookingModalOpen(false)}>Back</Button>
            <Button className="bg-blue-600 text-white text-xs font-black uppercase rounded-lg px-6" onClick={handleBookEvent} isLoading={bookingLoading}>Confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}