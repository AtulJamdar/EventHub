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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Card,
  CardBody,
  Select,
  SelectItem
} from '@heroui/react';
import {
  FaPlus,
  FaMagnifyingGlass,
  FaPencil,
  FaTrash,
//   FaTimes,
  FaCheck
} from 'react-icons/fa6';
import api from '../../../../config/api';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Workshop',
    date: '',
    time: '',
    location: '',
    price: '',
    maxParticipants: '',
    image: 'https://via.placeholder.com/500x300?text=Event+Image'
  });

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
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e) => {
    setFormData(prev => ({
      ...prev,
      category: e.target.value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Workshop',
      date: '',
      time: '',
      location: '',
      price: '',
      maxParticipants: '',
      image: 'https://via.placeholder.com/500x300?text=Event+Image'
    });
  };

  const handleCreateEvent = async () => {
    setSubmitting(true);
    try {
      const response = await api.post('/events', formData);
      if (response.data.success) {
        setEvents([...events, response.data.data]);
        setCreateModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date.split('T')[0],
      time: event.time,
      location: event.location,
      price: event.price.toString(),
      maxParticipants: event.maxParticipants.toString(),
      image: event.image
    });
    setEditModalOpen(true);
  };

  const handleUpdateEvent = async () => {
    setSubmitting(true);
    try {
      const response = await api.put(`/events/${selectedEvent._id}`, formData);
      if (response.data.success) {
        setEvents(events.map(e => e._id === selectedEvent._id ? response.data.data : e));
        setEditModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await api.delete(`/events/${eventId}`);
        if (response.data.success) {
          setEvents(events.filter(e => e._id !== eventId));
        }
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Events Management</h1>
          <p className="text-gray-400">Create, edit, and manage your events</p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold"
          startContent={<FaPlus />}
          onClick={() => {
            resetForm();
            setCreateModalOpen(true);
          }}
        >
          Create Event
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="Search events by title or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={<FaMagnifyingGlass className="text-gray-400" />}
          classNames={{
            input: "bg-white/10 text-white placeholder-gray-400",
            inputWrapper: "bg-white/10 border border-white/20 hover:border-blue-400/50",
          }}
          className="max-w-md"
        />
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
              aria-label="Events table"
              classNames={{
                base: "bg-transparent",
                table: "text-white",
                th: "bg-white/5 text-gray-300 font-semibold",
                tr: "border-b border-white/10 hover:bg-white/5 transition-colors",
                td: "text-gray-200"
              }}
            >
              <TableHeader>
                <TableColumn>TITLE</TableColumn>
                <TableColumn>CATEGORY</TableColumn>
                <TableColumn>DATE</TableColumn>
                <TableColumn>LOCATION</TableColumn>
                <TableColumn>PRICE</TableColumn>
                <TableColumn>MAX PARTICIPANTS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody
                items={filteredEvents}
                emptyContent={<p className="text-gray-400">No events found</p>}
              >
                {(item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-xs text-gray-400">{item.category}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="bg-blue-500/30 text-blue-300 text-xs px-2 py-1 rounded">
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>{item.maxParticipants}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleEditEvent(item)}
                        >
                          <FaPencil size={16} />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleDeleteEvent(item._id)}
                        >
                          <FaTrash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Create Event Modal */}
      <Modal isOpen={createModalOpen} onOpenChange={setCreateModalOpen} backdrop="blur" size="2xl">
        <ModalContent className="bg-slate-900 border border-white/20">
          <ModalHeader className="text-white">Create New Event</ModalHeader>
          <ModalBody className="space-y-4">
            <Input
              type="text"
              label="Event Title"
              name="title"
              placeholder="Enter event title"
              value={formData.title}
              onChange={handleChange}
              classNames={{
                input: "bg-white/10 text-white",
                label: "text-gray-300"
              }}
            />

            <Input
              type="text"
              label="Description"
              name="description"
              placeholder="Enter event description"
              value={formData.description}
              onChange={handleChange}
              classNames={{
                input: "bg-white/10 text-white",
                label: "text-gray-300"
              }}
            />

            <Select
              label="Category"
              value={formData.category}
              onChange={handleSelectChange}
              classNames={{
                trigger: "bg-white/10 text-white",
                label: "text-gray-300",
                popoverContent: "bg-slate-800"
              }}
            >
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                label="Date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                classNames={{
                  input: "bg-white/10 text-white",
                  label: "text-gray-300"
                }}
              />
              <Input
                type="time"
                label="Time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                classNames={{
                  input: "bg-white/10 text-white",
                  label: "text-gray-300"
                }}
              />
            </div>

            <Input
              type="text"
              label="Location"
              name="location"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleChange}
              classNames={{
                input: "bg-white/10 text-white",
                label: "text-gray-300"
              }}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                label="Price"
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                classNames={{
                  input: "bg-white/10 text-white",
                  label: "text-gray-300"
                }}
              />
              <Input
                type="number"
                label="Max Participants"
                name="maxParticipants"
                placeholder="0"
                value={formData.maxParticipants}
                onChange={handleChange}
                classNames={{
                  input: "bg-white/10 text-white",
                  label: "text-gray-300"
                }}
              />
            </div>

            <Input
              type="text"
              label="Image URL"
              name="image"
              placeholder="https://..."
              value={formData.image}
              onChange={handleChange}
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
              onClick={() => setCreateModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleCreateEvent}
              loading={submitting}
              disabled={submitting}
            >
              Create Event
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Event Modal */}
      <Modal isOpen={editModalOpen} onOpenChange={setEditModalOpen} backdrop="blur" size="2xl">
        <ModalContent className="bg-slate-900 border border-white/20">
          <ModalHeader className="text-white">Edit Event</ModalHeader>
          <ModalBody className="space-y-4">
            <Input
              type="text"
              label="Event Title"
              name="title"
              placeholder="Enter event title"
              value={formData.title}
              onChange={handleChange}
              classNames={{
                input: "bg-white/10 text-white",
                label: "text-gray-300"
              }}
            />

            <Input
              type="text"
              label="Description"
              name="description"
              placeholder="Enter event description"
              value={formData.description}
              onChange={handleChange}
              classNames={{
                input: "bg-white/10 text-white",
                label: "text-gray-300"
              }}
            />

            <Select
              label="Category"
              value={formData.category}
              onChange={handleSelectChange}
              classNames={{
                trigger: "bg-white/10 text-white",
                label: "text-gray-300",
                popoverContent: "bg-slate-800"
              }}
            >
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                label="Date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                classNames={{
                  input: "bg-white/10 text-white",
                  label: "text-gray-300"
                }}
              />
              <Input
                type="time"
                label="Time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                classNames={{
                  input: "bg-white/10 text-white",
                  label: "text-gray-300"
                }}
              />
            </div>

            <Input
              type="text"
              label="Location"
              name="location"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleChange}
              classNames={{
                input: "bg-white/10 text-white",
                label: "text-gray-300"
              }}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                label="Price"
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                classNames={{
                  input: "bg-white/10 text-white",
                  label: "text-gray-300"
                }}
              />
              <Input
                type="number"
                label="Max Participants"
                name="maxParticipants"
                placeholder="0"
                value={formData.maxParticipants}
                onChange={handleChange}
                classNames={{
                  input: "bg-white/10 text-white",
                  label: "text-gray-300"
                }}
              />
            </div>

            <Input
              type="text"
              label="Image URL"
              name="image"
              placeholder="https://..."
              value={formData.image}
              onChange={handleChange}
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
              onClick={() => setEditModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleUpdateEvent}
              loading={submitting}
              disabled={submitting}
            >
              Update Event
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}