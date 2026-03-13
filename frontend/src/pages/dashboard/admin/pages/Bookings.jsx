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
  Textarea
} from '@heroui/react';
import { FaMagnifyingGlass, FaCheck, FaXmark } from 'react-icons/fa6';
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
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBooking = async (bookingId) => {
    setSubmitting(true);
    try {
      const response = await api.put(`/bookings/${bookingId}/approve`);
      if (response.data.success) {
        setBookings(bookings.map(b =>
          b._id === bookingId ? response.data.data : b
        ));
      }
    } catch (error) {
      console.error('Error approving booking:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectBooking = async () => {
    setSubmitting(true);
    try {
      const response = await api.put(`/bookings/${selectedBooking._id}/reject`, {
        rejectionReason
      });
      if (response.data.success) {
        setBookings(bookings.map(b =>
          b._id === selectedBooking._id ? response.data.data : b
        ));
        setRejectModalOpen(false);
        setRejectionReason('');
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/30 text-green-300';
      case 'pending':
        return 'bg-yellow-500/30 text-yellow-300';
      case 'rejected':
        return 'bg-red-500/30 text-red-300';
      default:
        return 'bg-gray-500/30 text-gray-300';
    }
  };

  const filteredBookings = bookings.filter(booking =>
    booking.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.eventId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Bookings Management</h1>
        <p className="text-gray-400">Review and manage event bookings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          type="text"
          placeholder="Search by user or event name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={<FaMagnifyingGlass className="text-gray-400" />}
          classNames={{
            input: "bg-white/10 text-white placeholder-gray-400",
            inputWrapper: "bg-white/10 border border-white/20 hover:border-blue-400/50",
          }}
          className="max-w-md"
        />

        <Select
          label="Filter by Status"
          selectedKeys={statusFilter ? [statusFilter] : []}
          onChange={(e) => setStatusFilter(e.target.value)}
          classNames={{
            trigger: "bg-white/10 border border-white/20 text-white",
            popoverContent: "bg-slate-800"
          }}
        >
          <SelectItem key="" value="">All Status</SelectItem>
          <SelectItem key="pending" value="pending">Pending</SelectItem>
          <SelectItem key="approved" value="approved">Approved</SelectItem>
          <SelectItem key="rejected" value="rejected">Rejected</SelectItem>
        </Select>
      </div>

      {/* Table */}
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <CardBody className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" color="current" />
            </div>
          ) : (
            <Table
              aria-label="Bookings table"
              classNames={{
                base: "bg-transparent",
                table: "text-white",
                th: "bg-white/5 text-gray-300 font-semibold",
                tr: "border-b border-white/10 hover:bg-white/5 transition-colors",
                td: "text-gray-200"
              }}
            >
              <TableHeader>
                <TableColumn>USER NAME</TableColumn>
                <TableColumn>EVENT NAME</TableColumn>
                <TableColumn>TICKETS</TableColumn>
                <TableColumn>TOTAL PRICE</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>BOOKING DATE</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody
                items={filteredBookings}
                emptyContent={<p className="text-gray-400">No bookings found</p>}
              >
                {(item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.userId?.name}</TableCell>
                    <TableCell>{item.eventId?.title}</TableCell>
                    <TableCell>{item.tickets}</TableCell>
                    <TableCell>${item.totalPrice}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(item.bookingDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.status === 'pending' && (
                          <>
                            <Button
                              isIconOnly
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleApproveBooking(item._id)}
                              disabled={submitting}
                            >
                              <FaCheck size={16} />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => {
                                setSelectedBooking(item);
                                setRejectModalOpen(true);
                              }}
                              disabled={submitting}
                            >
                              <FaXmark size={16} />
                            </Button>
                          </>
                        )}
                        {item.status === 'approved' && (
                          <span className="text-green-300 text-sm">✓ Approved</span>
                        )}
                        {item.status === 'rejected' && (
                          <span className="text-red-300 text-sm">✗ Rejected</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Reject Modal */}
      <Modal isOpen={rejectModalOpen} onOpenChange={setRejectModalOpen} backdrop="blur">
        <ModalContent className="bg-slate-900 border border-white/20">
          <ModalHeader className="text-white">Reject Booking</ModalHeader>
          <ModalBody className="space-y-4">
            <p className="text-gray-300">
              Are you sure you want to reject this booking from <span className="font-semibold">{selectedBooking?.userId?.name || "this user"}</span>?
            </p>
            <Textarea
              label="Rejection Reason"
              placeholder="Provide a reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              classNames={{
                input: "bg-white/10 text-white",
                label: "text-gray-300"
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              className="text-white"
              onClick={() => setRejectModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleRejectBooking}
              loading={submitting}
              disabled={submitting}
            >
              Reject Booking
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}