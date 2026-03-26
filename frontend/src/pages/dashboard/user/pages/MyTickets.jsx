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
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider
} from '@heroui/react';
import { FaDownload, FaPrint, FaQrcode, FaCalendarDays, FaMapPin, FaTicket } from 'react-icons/fa6';
import api from '../../../../config/api';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tickets/user/my-tickets');
      setTickets(response.data.data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = async (ticketId) => {
    try {
      const response = await api.get(`/tickets/${ticketId}/download`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket-${ticketId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading ticket:', error);
    }
  };

  const handlePrintTicket = (ticket) => {
    setSelectedTicket(ticket);
    setTicketModalOpen(true);
  };

  const printTicket = () => {
    window.print();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'used': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FaTicket className="text-2xl text-purple-400" />
        <h1 className="text-3xl font-bold text-white">My Tickets</h1>
      </div>

      {tickets.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardBody className="text-center py-12">
            <FaTicket className="text-4xl text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Tickets Found</h3>
            <p className="text-slate-400">You don't have any tickets yet. Book an event to get your tickets!</p>
          </CardBody>
        </Card>
      ) : (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardBody>
            <Table aria-label="Tickets table" className="text-white">
              <TableHeader>
                <TableColumn>TICKET NUMBER</TableColumn>
                <TableColumn>EVENT</TableColumn>
                <TableColumn>DATE</TableColumn>
                <TableColumn>LOCATION</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket._id}>
                    <TableCell>
                      <div className="font-mono text-purple-400">
                        {ticket.ticketNumber}
                      </div>
                    </TableCell>
                    <TableCell>{ticket.eventId?.title || 'N/A'}</TableCell>
                    <TableCell>
                      {ticket.eventId ? new Date(ticket.eventId.date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>{ticket.eventId?.location || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip color={getStatusColor(ticket.status)} variant="flat" size="sm">
                        {ticket.status.toUpperCase()}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="flat"
                          color="primary"
                          onPress={() => handlePrintTicket(ticket)}
                          startContent={<FaPrint />}
                        >
                          Print
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          color="secondary"
                          onPress={() => handleDownloadTicket(ticket.ticketId)}
                          startContent={<FaDownload />}
                        >
                          Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      )}

      {/* Ticket Modal for Printing */}
      <Modal
        isOpen={ticketModalOpen}
        onOpenChange={setTicketModalOpen}
        size="2xl"
        className="bg-slate-800 text-white"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-xl font-bold">Ticket Details</h3>
          </ModalHeader>
          <ModalBody>
            {selectedTicket && (
              <div id="ticket-print" className="space-y-4">
                <div className="text-center border-b border-slate-600 pb-4">
                  <h2 className="text-2xl font-bold text-purple-400 mb-2">EVENT TICKET</h2>
                  <p className="text-lg font-mono">{selectedTicket.ticketNumber}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-300 mb-2">Event Information</h4>
                    <p><strong>Event:</strong> {selectedTicket.eventId?.title}</p>
                    <p><strong>Date:</strong> {selectedTicket.eventId ? new Date(selectedTicket.eventId.date).toLocaleDateString() : ''}</p>
                    <p><strong>Location:</strong> {selectedTicket.eventId?.location}</p>
                    <p><strong>Price:</strong> ${selectedTicket.eventId?.price}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-300 mb-2">Ticket Information</h4>
                    <p><strong>Ticket ID:</strong> {selectedTicket.ticketId}</p>
                    <p><strong>Status:</strong> {selectedTicket.status}</p>
                    <p><strong>Issued:</strong> {new Date(selectedTicket.issuedDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {selectedTicket.qrCode && (
                  <div className="text-center">
                    <h4 className="font-semibold text-slate-300 mb-2">QR Code</h4>
                    <img
                      src={selectedTicket.qrCode}
                      alt="Ticket QR Code"
                      className="mx-auto max-w-32"
                    />
                  </div>
                )}

                <Divider className="bg-slate-600" />

                <div className="text-center text-sm text-slate-400">
                  <p>Please bring this ticket to the event. Keep it safe!</p>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onPress={printTicket}
              startContent={<FaPrint />}
            >
              Print Ticket
            </Button>
            <Button
              variant="flat"
              onPress={() => setTicketModalOpen(false)}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}