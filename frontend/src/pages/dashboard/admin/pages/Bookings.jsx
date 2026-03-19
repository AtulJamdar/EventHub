import { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Card,
  CardBody,
  Spinner,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Divider
} from '@heroui/react';
import { 
  FaMagnifyingGlass, 
  FaCheck, 
  FaXmark, 
  FaFilter, 
  FaFileInvoiceDollar, 
  FaClock, 
  FaCircleCheck, 
  FaCircleXmark 
} from 'react-icons/fa6';
import api from '../../../../config/api';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const response = await api.get(`/bookings${params}`);
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBooking = async (bookingId) => {
    setSubmitting(true);
    try {
      const response = await api.put(`/bookings/${bookingId}/approve`);
      if (response.data.success) {
        setBookings(bookings.map(b => b._id === bookingId ? response.data.data : b));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectBooking = async () => {
    setSubmitting(true);
    try {
      const response = await api.put(`/bookings/${selectedBooking._id}/reject`, { rejectionReason });
      if (response.data.success) {
        setBookings(bookings.map(b => b._id === selectedBooking._id ? response.data.data : b));
        setRejectModalOpen(false);
        setRejectionReason('');
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
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

  const filteredBookings = bookings.filter(booking =>
    booking.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.eventId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#050505]">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] lg:ml-72 lg:mr-72 transition-all duration-300">
      <main className="max-w-full mx-auto p-8 md:p-12 space-y-10 animate-fade-in">
        
        {/* --- HEADER --- */}
        <div className="space-y-1 border-b border-white/5 pb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Transaction <span className="text-blue-500 not-italic">Ledger.</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">Verify and authorize event participation requests.</p>
        </div>

        {/* --- BENTO FILTERS --- */}
        <Card className="bg-[#111119] border border-white/5 rounded-2xl shadow-xl">
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-8">
                <Input
                  placeholder="Search by candidate or event name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startContent={<FaMagnifyingGlass className="text-blue-500" />}
                  classNames={{
                    input: "text-white font-bold placeholder-slate-600",
                    inputWrapper: "bg-black/40 border-white/5 hover:border-blue-500/30 h-12 rounded-xl border transition-all",
                  }}
                />
              </div>
              <div className="md:col-span-4">
                <Select
                  placeholder="Status Filter"
                  selectedKeys={statusFilter ? [statusFilter] : []}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  startContent={<FaFilter className="text-purple-500 text-xs" />}
                  classNames={{
                    trigger: "bg-black/40 border-white/5 hover:border-purple-500/30 h-12 rounded-xl border transition-all",
                    value: "text-white font-bold text-sm",
                    popoverContent: "bg-[#111119] border border-white/10 text-white"
                  }}
                >
                  <SelectItem key="" value="" className="text-slate-200">All Requests</SelectItem>
                  <SelectItem key="pending" value="pending" className="text-slate-200">Pending Approval</SelectItem>
                  <SelectItem key="approved" value="approved" className="text-slate-200">Authorized</SelectItem>
                  <SelectItem key="rejected" value="rejected" className="text-slate-200">Declined</SelectItem>
                </Select>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* --- REGISTRY TABLE --- */}
        <Card className="bg-[#111119] border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
          <CardBody className="p-0">
            <Table 
              aria-label="Bookings registry"
              removeWrapper
              classNames={{
                th: "bg-white/5 text-slate-400 font-black uppercase text-[9px] tracking-[0.2em] py-5 px-6",
                td: "py-6 px-6 text-white font-medium border-b border-white/5",
              }}
            >
              <TableHeader>
                <TableColumn>PARTICIPANT</TableColumn>
                <TableColumn>TARGET EVENT</TableColumn>
                <TableColumn>ECONOMICS</TableColumn>
                <TableColumn>CURRENT STATUS</TableColumn>
                <TableColumn align="center">AUTHORIZATION</TableColumn>
              </TableHeader>
              <TableBody 
                items={filteredBookings}
                emptyContent={<p className="text-slate-600 font-black uppercase text-xs py-10">Zero transaction records found</p>}
              >
                {(item) => (
                  <TableRow key={item._id} className="hover:bg-white/[0.02] transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 font-bold text-xs border border-blue-500/20">
                          {item.userId?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm tracking-tight">{item.userId?.name}</p>
                          <p className="text-[10px] text-slate-600 font-black uppercase tracking-tighter">ID: {item._id.slice(-6)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-[150px]">
                        <p className="font-bold text-sm text-slate-300">{item.eventId?.title}</p>
                        <p className="text-[10px] text-slate-600 font-medium flex items-center gap-1 mt-0.5">
                          <FaClock size={10} /> {new Date(item.bookingDate).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-sm font-black text-blue-400 tracking-tight">${item.totalPrice}</p>
                        <p className="text-[9px] text-slate-500 font-black uppercase">{item.tickets} Seat(s)</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(item.status)}`}>
                        {item.status === 'approved' && <FaCircleCheck size={10} />}
                        {item.status === 'pending' && <FaClock size={10} />}
                        {item.status === 'rejected' && <FaCircleXmark size={10} />}
                        {item.status}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-3">
                        {item.status === 'pending' ? (
                          <>
                            <Button
                              isIconOnly size="sm" variant="flat"
                              className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-600 hover:text-white rounded-lg transition-all"
                              onClick={() => handleApproveBooking(item._id)}
                              disabled={submitting}
                            >
                              <FaCheck size={14} />
                            </Button>
                            <Button
                              isIconOnly size="sm" variant="flat"
                              className="bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                              onClick={() => { setSelectedBooking(item); setRejectModalOpen(true); }}
                              disabled={submitting}
                            >
                              <FaXmark size={14} />
                            </Button>
                          </>
                        ) : (
                          <div className="h-8 flex items-center justify-center px-4 bg-white/5 rounded-lg border border-white/5">
                             <span className="text-slate-700 text-[10px] font-black uppercase tracking-widest">Locked</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* --- FOOTER --- */}
        <div className="text-center pt-4">
           <p className="text-slate-800 text-[9px] font-black uppercase tracking-[0.5em]">
             Authorized Transaction Core • Build 1.2.0
           </p>
        </div>
      </main>

      {/* --- REJECTION MODAL --- */}
      <Modal 
        isOpen={rejectModalOpen} 
        onOpenChange={setRejectModalOpen} 
        backdrop="blur"
        classNames={{
            base: "bg-[#0a0a0f] border border-white/10 rounded-[2rem]",
            header: "text-white font-black uppercase tracking-widest text-base border-b border-white/5 px-10 py-6",
            footer: "border-t border-white/5 px-10 py-6"
        }}
      >
        <ModalContent>
          <ModalHeader>Declining Authorization</ModalHeader>
          <ModalBody className="py-8 px-10 space-y-6">
            <div className="bg-red-500/5 rounded-2xl p-6 border border-red-500/10">
               <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-1">Target Participant</p>
               <p className="text-white font-bold text-lg">{selectedBooking?.userId?.name}</p>
            </div>
            <Textarea
              label="Operational Reason"
              placeholder="State the reason for authorization denial..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              classNames={{
                input: "text-white font-medium italic",
                inputWrapper: "bg-white/5 border-white/5 hover:border-red-500/30 rounded-xl transition-all",
                label: "text-slate-500 font-black uppercase text-[10px] tracking-widest"
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" className="text-slate-500 font-black uppercase text-xs" onClick={() => setRejectModalOpen(false)}>Abort</Button>
            <Button className="bg-red-600 text-white font-black uppercase tracking-widest text-xs rounded-xl px-10 h-12 shadow-lg shadow-red-900/20" onClick={handleRejectBooking} isLoading={submitting}>Confirm Denial</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}