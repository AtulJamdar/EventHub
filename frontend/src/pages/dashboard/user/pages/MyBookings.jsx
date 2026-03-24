import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider
} from '@heroui/react';
import { FaTrash, FaCalendarDays, FaMapPin, FaCircleCheck, FaClock, FaCircleXmark } from 'react-icons/fa6';
import api from '../../../../config/api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings/user/my-bookings');
      // Filter out bookings with deleted events (eventId is null)
      const validBookings = (response.data.data || []).filter(booking => booking.eventId !== null);
      setBookings(validBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    setCanceling(true);
    try {
      const response = await api.delete(`/bookings/${selectedBooking._id}`);
      if (response.data.success) {
        setBookings(bookings.filter(b => b._id !== selectedBooking._id));
        setCancelModalOpen(false);
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
    } finally {
      setCanceling(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved': return 'text-emerald-400 bg-emerald-400/5 border-emerald-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/5 border-yellow-500/20';
      case 'rejected': return 'text-red-400 bg-red-400/5 border-red-500/20';
      default: return 'text-slate-400 bg-slate-400/5 border-white/10';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'approved') return <FaCircleCheck size={10} />;
    if (status === 'pending') return <FaClock size={10} />;
    return <FaCircleXmark size={10} />;
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#050505]">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return (
    /**
     * SYMMETRIC LAYOUT FIX:
     * lg:ml-72 -> Gap for Sidebar
     * lg:mr-72 -> Matching Gap for symmetry
     */
    <div className="min-h-screen bg-[#050505] lg:ml-72 lg:mr-72 transition-all duration-300">
      <main className="max-w-full mx-auto p-6 md:p-10 space-y-10">
        
        {/* --- HEADER --- */}
        <header className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight uppercase">My Bookings</h1>
          <p className="text-slate-500 text-sm font-medium italic">Manage and track your event reservations.</p>
        </header>

        {/* --- MAIN CONTENT --- */}
        <Card className="bg-[#111119] border border-white/5 rounded-3xl shadow-xl overflow-hidden">
          <CardBody className="p-0">
            {bookings.length === 0 ? (
              <div className="p-20 text-center space-y-4">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active bookings found</p>
                <Divider className="bg-white/5 w-24 mx-auto" />
              </div>
            ) : (
              <Table 
                aria-label="Bookings list"
                removeWrapper
                classNames={{
                  th: "bg-white/5 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] py-5 px-6",
                  td: "py-6 px-6 text-white font-medium border-b border-white/5",
                }}
              >
                <TableHeader>
                  <TableColumn>EVENT</TableColumn>
                  <TableColumn>DETAILS</TableColumn>
                  <TableColumn>PRICE</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn align="center">ACTION</TableColumn>
                </TableHeader>
                <TableBody items={bookings}>
                  {(item) => (
                    item.eventId && (
                    <TableRow key={item._id} className="hover:bg-white/[0.02] transition-colors group">
                      <TableCell>
                        <div className="min-w-[200px]">
                          <p className="font-bold text-base group-hover:text-blue-500 transition-colors">{item.eventId?.title || 'Event'}</p>
                          <p className="text-slate-500 text-xs mt-1 flex items-center gap-2">
                             <FaMapPin size={10} /> {item.eventId?.location || 'No location'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-300 flex items-center gap-2">
                            <FaCalendarDays size={12} className="text-blue-500" />
                            {item.eventId?.date ? new Date(item.eventId.date).toLocaleDateString() : 'N/A'}
                          </p>
                          <p className="text-[10px] text-slate-500 font-black uppercase">{item.tickets} Ticket(s)</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-black text-blue-400 tracking-tight">${item.totalPrice}</p>
                      </TableCell>
                      <TableCell>
                         <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border ${getStatusStyle(item.status)}`}>
                            {getStatusIcon(item.status)}
                            {item.status}
                         </div>
                      </TableCell>
                      <TableCell>
                        {item.status === 'pending' ? (
                          <Button
                            isIconOnly
                            size="sm"
                            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-lg"
                            onClick={() => {
                              setSelectedBooking(item);
                              setCancelModalOpen(true);
                            }}
                          >
                            <FaTrash size={14} />
                          </Button>
                        ) : (
                          <span className="text-slate-700 text-[10px] font-black uppercase">Locked</span>
                        )}
                      </TableCell>
                    </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>

        {/* --- FOOTER INFO --- */}
        <div className="pt-4 text-center">
           <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.4em]">
             Authorized Booking Ledger • Session Encrypted
           </p>
        </div>

      </main>

      {/* --- CANCEL MODAL --- */}
      <Modal 
        isOpen={cancelModalOpen} 
        onOpenChange={setCancelModalOpen} 
        backdrop="blur"
        classNames={{
            base: "bg-[#0a0a0f] border border-white/10 rounded-[2rem]",
            header: "text-white font-black uppercase tracking-widest text-lg border-b border-white/5",
            footer: "border-t border-white/5"
        }}
      >
        <ModalContent>
          <ModalHeader>Cancel Reservation</ModalHeader>
          <ModalBody className="py-10">
            <p className="text-slate-400 font-medium">
              Are you sure you want to terminate your booking for <span className="text-white font-bold underline underline-offset-4 decoration-red-500">{selectedBooking?.eventId.title}</span>?
            </p>
            <p className="text-red-500/60 text-[10px] font-black uppercase tracking-widest mt-4">
              Warning: This action is irreversible.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              className="bg-white/5 text-slate-400 font-bold rounded-xl"
              onClick={() => setCancelModalOpen(false)}
            >
              Keep Booking
            </Button>
            <Button
              className="bg-red-600 text-white font-black uppercase tracking-widest rounded-xl"
              onClick={handleCancelBooking}
              isLoading={canceling}
            >
              Confirm Cancellation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}