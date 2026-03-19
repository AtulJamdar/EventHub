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
  SelectItem,
  Divider
} from '@heroui/react';
import {
  FaPlus,
  FaMagnifyingGlass,
  FaPencil,
  FaTrash,
  FaCheck,
  FaCalendarDays,
  FaMapPin,
  FaTags
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
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    setFormData(prev => ({ ...prev, category: e.target.value }));
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', category: 'Workshop', date: '', time: '', location: '',
      price: '', maxParticipants: '', image: 'https://via.placeholder.com/500x300?text=Event+Image'
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
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title, description: event.description, category: event.category,
      date: event.date.split('T')[0], time: event.time, location: event.location,
      price: event.price.toString(), maxParticipants: event.maxParticipants.toString(), image: event.image
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
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (confirm('Permanently delete this event?')) {
      try {
        const response = await api.delete(`/events/${eventId}`);
        if (response.data.success) {
          setEvents(events.filter(e => e._id !== eventId));
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
              Events <span className="text-blue-500 not-italic">Inventory.</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">Manage existing records or initialize new events.</p>
          </div>
          <Button
            className="bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-xl shadow-lg shadow-blue-900/20"
            startContent={<FaPlus />}
            onClick={() => { resetForm(); setCreateModalOpen(true); }}
          >
            Create Event
          </Button>
        </div>

        {/* --- SEARCH BENTO --- */}
        <Card className="bg-[#111119] border border-white/5 rounded-2xl">
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search inventory by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startContent={<FaMagnifyingGlass className="text-blue-500 mr-2" />}
                classNames={{
                  input: "text-white font-bold placeholder-slate-600",
                  inputWrapper: "bg-black/40 border-white/5 hover:border-blue-500/30 h-12 rounded-xl border transition-all",
                }}
              />
              <div className="px-6 h-12 flex items-center justify-center bg-white/5 border border-white/5 rounded-xl">
                 <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{filteredEvents.length} Units</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* --- DATA TABLE --- */}
        <Card className="bg-[#111119] border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
          <CardBody className="p-0">
            <Table 
              aria-label="Events table"
              removeWrapper
              classNames={{
                th: "bg-white/5 text-slate-400 font-black uppercase text-[9px] tracking-[0.2em] py-5 px-6",
                td: "py-6 px-6 text-white font-medium border-b border-white/5",
              }}
            >
              <TableHeader>
                <TableColumn>EVENT IDENTITY</TableColumn>
                <TableColumn>CLASSIFICATION</TableColumn>
                <TableColumn>LOGISTICS</TableColumn>
                <TableColumn>ECONOMICS</TableColumn>
                <TableColumn align="center">ACTIONS</TableColumn>
              </TableHeader>
              <TableBody 
                items={filteredEvents}
                emptyContent={<p className="text-slate-600 font-black uppercase text-xs py-10">No events found in registry</p>}
              >
                {(item) => (
                  <TableRow key={item._id} className="hover:bg-white/[0.02] transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                        <div>
                          <p className="font-bold text-sm tracking-tight">{item.title}</p>
                          <p className="text-[10px] text-slate-600 font-black uppercase tracking-tighter mt-0.5 italic">ID: {item._id.slice(-6)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/5 border border-blue-500/20 text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-widest">
                        <FaTags size={10} /> {item.category}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-300 flex items-center gap-2">
                           <FaCalendarDays size={12} className="text-purple-500" /> {new Date(item.date).toLocaleDateString()}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium flex items-center gap-2">
                           <FaMapPin size={10} /> {item.location}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-sm font-black text-white">${item.price}</p>
                        <p className="text-[9px] text-slate-500 font-black uppercase">{item.maxParticipants} Cap</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-3">
                        <Button
                          isIconOnly size="sm" variant="flat"
                          className="bg-white/5 text-slate-400 hover:text-white rounded-lg transition-all"
                          onClick={() => handleEditEvent(item)}
                        >
                          <FaPencil size={14} />
                        </Button>
                        <Button
                          isIconOnly size="sm" variant="flat"
                          className="bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                          onClick={() => handleDeleteEvent(item._id)}
                        >
                          <FaTrash size={14} />
                        </Button>
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
             Registry Control Protocol • Session Secure
           </p>
        </div>
      </main>

      {/* --- FORM MODAL (Unified Style) --- */}
      <Modal 
        isOpen={createModalOpen || editModalOpen} 
        onOpenChange={(open) => open ? null : (setCreateModalOpen(false), setEditModalOpen(false))} 
        backdrop="blur" 
        size="2xl"
        classNames={{
            base: "bg-[#0a0a0f] border border-white/10 rounded-[2rem]",
            header: "text-white font-black uppercase tracking-widest text-lg border-b border-white/5",
            footer: "border-t border-white/5"
        }}
      >
        <ModalContent>
          <ModalHeader>{createModalOpen ? 'Initialize New Event' : 'Edit Event Record'}</ModalHeader>
          <ModalBody className="py-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <Input label="Event Title" name="title" value={formData.title} onChange={handleChange} classNames={inputStyles} />
               <Select label="Category" selectedKeys={[formData.category]} onChange={handleSelectChange} classNames={selectStyles}>
                 {categories.map(cat => <SelectItem key={cat} value={cat} className="text-slate-900 font-bold">{cat}</SelectItem>)}
               </Select>
            </div>
            <Input label="Description" name="description" value={formData.description} onChange={handleChange} classNames={inputStyles} />
            <div className="grid grid-cols-2 gap-4">
               <Input label="Date" type="date" name="date" value={formData.date} onChange={handleChange} classNames={inputStyles} />
               <Input label="Time" type="time" name="time" value={formData.time} onChange={handleChange} classNames={inputStyles} />
            </div>
            <Input label="Location" name="location" value={formData.location} onChange={handleChange} classNames={inputStyles} />
            <div className="grid grid-cols-2 gap-4">
               <Input label="Price" type="number" name="price" value={formData.price} onChange={handleChange} classNames={inputStyles} />
               <Input label="Capacity" type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} classNames={inputStyles} />
            </div>
            <Input label="Image Asset URL" name="image" value={formData.image} onChange={handleChange} classNames={inputStyles} />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" className="text-slate-500 font-black uppercase tracking-widest text-xs" onClick={() => { setCreateModalOpen(false); setEditModalOpen(false); }}>Cancel</Button>
            <Button className="bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-xl px-10" onClick={createModalOpen ? handleCreateEvent : handleUpdateEvent} isLoading={submitting}>
              {createModalOpen ? 'Create Entry' : 'Update Entry'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

// Shared Styles for Modals
const inputStyles = {
  input: "text-white font-bold placeholder-slate-600",
  inputWrapper: "bg-white/5 border-white/5 hover:border-blue-500/30 rounded-xl transition-all",
  label: "text-slate-500 font-black uppercase text-[10px] tracking-widest"
};

const selectStyles = {
  trigger: "bg-white/5 border-white/5 hover:border-blue-500/30 rounded-xl transition-all",
  label: "text-slate-500 font-black uppercase text-[10px] tracking-widest",
  value: "text-white font-bold"
};