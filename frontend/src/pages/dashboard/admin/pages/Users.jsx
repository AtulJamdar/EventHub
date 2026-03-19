import { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardBody,
  Input,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider
} from '@heroui/react';
import { FaMagnifyingGlass, FaEye, FaEnvelope, FaCalendarDays, FaUserShield, FaCircleUser, FaWallet, FaChartSimple } from 'react-icons/fa6';
import api from '../../../../config/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const bookingsRes = await api.get('/bookings');
      const bookings = bookingsRes.data.data || [];
      const uniqueUsers = new Map();
      bookings.forEach(booking => {
        if (booking.userId && !uniqueUsers.has(booking.userId._id)) {
          uniqueUsers.set(booking.userId._id, booking.userId);
        }
      });
      setUsers(Array.from(uniqueUsers.values()));
    } catch (error) {
      console.error('Error:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUserDetails = async (user) => {
    setSelectedUser(user);
    setUserDetailsModalOpen(true);
    await fetchUserStats(user._id);
  };

  const fetchUserStats = async (userId) => {
    try {
      setStatsLoading(true);
      const response = await api.get(`/bookings?userId=${userId}`);
      const userBookings = response.data.data || [];
      setUserStats({
        totalBookings: userBookings.length,
        approvedBookings: userBookings.filter(b => b.status === 'approved').length,
        pendingBookings: userBookings.filter(b => b.status === 'pending').length,
        rejectedBookings: userBookings.filter(b => b.status === 'rejected').length,
        totalSpent: userBookings.filter(b => b.status === 'approved').reduce((sum, b) => sum + b.totalPrice, 0),
        lastBooking: userBookings.length > 0 ? new Date(userBookings[0].bookingDate).toLocaleDateString() : 'None'
      });
    } catch (error) {
      console.error('Error:', error);
      setUserStats(null);
    } finally {
      setStatsLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        <header className="space-y-1 border-b border-white/5 pb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            User <span className="text-blue-500 not-italic">Registry.</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">Global database of authenticated network members.</p>
        </header>

        {/* --- STATS SUMMARY (Compact Bento) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Accounts', val: users.length, icon: <FaCircleUser />, color: 'text-blue-500' },
            { label: 'Verified Members', val: users.filter(u => u.role === 'user').length, icon: <FaChartSimple />, color: 'text-emerald-500' },
            { label: 'System Admins', val: users.filter(u => u.role === 'admin').length, icon: <FaUserShield />, color: 'text-purple-500' }
          ].map((stat, i) => (
            <Card key={i} className="bg-[#111119] border border-white/5 shadow-xl">
              <CardBody className="p-6 flex flex-row items-center gap-5">
                 <div className={`${stat.color} text-xl bg-white/5 p-3 rounded-xl`}>{stat.icon}</div>
                 <div>
                   <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                   <p className="text-2xl font-black text-white">{stat.val}</p>
                 </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* --- SEARCH --- */}
        <div className="max-w-md">
          <Input
            placeholder="Filter by name or identity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<FaMagnifyingGlass className="text-blue-500" />}
            classNames={{
              input: "text-white font-bold placeholder-slate-600",
              inputWrapper: "bg-[#111119] border-white/5 hover:border-blue-500/30 h-12 rounded-xl border transition-all",
            }}
          />
        </div>

        {/* --- USER TABLE --- */}
        <Card className="bg-[#111119] border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
          <CardBody className="p-0">
            <Table 
              aria-label="User registry table"
              removeWrapper
              classNames={{
                th: "bg-white/5 text-slate-400 font-black uppercase text-[9px] tracking-[0.2em] py-5 px-6",
                td: "py-6 px-6 text-white font-medium border-b border-white/5",
              }}
            >
              <TableHeader>
                <TableColumn>MEMBER IDENTITY</TableColumn>
                <TableColumn>COMMUNICATION</TableColumn>
                <TableColumn>ACCESS LEVEL</TableColumn>
                <TableColumn>ENROLLMENT</TableColumn>
                <TableColumn align="center">ANALYTICS</TableColumn>
              </TableHeader>
              <TableBody items={filteredUsers} emptyContent={<p className="text-slate-600 font-black uppercase text-xs py-10">No users identified</p>}>
                {(item) => (
                  <TableRow key={item._id} className="hover:bg-white/[0.02] transition-colors group">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-white font-black text-xs border border-white/10 shadow-lg">
                           {item.name?.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-bold text-sm tracking-tight group-hover:text-blue-400 transition-colors uppercase">{item.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <FaEnvelope size={12} className="text-slate-600" />
                        {item.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        item.role === 'admin' ? 'text-purple-400 bg-purple-400/5 border-purple-500/20' : 'text-blue-400 bg-blue-400/5 border-blue-500/20'
                      }`}>
                        {item.role}
                      </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                         <FaCalendarDays size={12} />
                         {new Date(item.createdAt).toLocaleDateString()}
                       </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        isIconOnly size="sm" variant="flat"
                        className="bg-white/5 text-slate-400 hover:text-white rounded-lg transition-all"
                        onClick={() => handleViewUserDetails(item)}
                      >
                        <FaEye size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* --- FOOTER --- */}
        <footer className="text-center pt-4">
           <p className="text-slate-800 text-[9px] font-black uppercase tracking-[0.5em]">
             Authorized Member Registry • Build 3.4.0
           </p>
        </footer>
      </main>

      {/* --- USER DETAIL MODAL (Profile Style) --- */}
      <Modal 
        isOpen={userDetailsModalOpen} 
        onOpenChange={setUserDetailsModalOpen} 
        backdrop="blur" 
        size="2xl"
        classNames={{
            base: "bg-[#0a0a0f] border border-white/10 rounded-[2.5rem]",
            header: "text-white font-black uppercase tracking-widest text-base border-b border-white/5 px-10 py-6",
            footer: "border-t border-white/5 px-10 py-6"
        }}
      >
        <ModalContent>
          <ModalHeader>Member Deep Dive</ModalHeader>
          <ModalBody className="py-8 px-10 space-y-8">
            {/* Identity Banner */}
            <div className="flex items-center gap-6 bg-white/5 p-6 rounded-3xl border border-white/5">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-blue-900/20">
                   {selectedUser?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-1">
                   <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">{selectedUser?.name}</h3>
                   <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                     <FaEnvelope className="text-blue-500" /> {selectedUser?.email}
                   </p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="space-y-4">
               <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-2">Transactional History</h4>
               {statsLoading ? (
                 <div className="h-40 flex items-center justify-center"><Spinner color="primary" size="sm" /></div>
               ) : userStats ? (
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#111119] p-5 rounded-2xl border border-white/5">
                       <p className="text-slate-600 text-[8px] font-black uppercase mb-1">Total</p>
                       <p className="text-xl font-black text-white">{userStats.totalBookings}</p>
                    </div>
                    <div className="bg-[#111119] p-5 rounded-2xl border border-white/5">
                       <p className="text-emerald-500 text-[8px] font-black uppercase mb-1">Success</p>
                       <p className="text-xl font-black text-white">{userStats.approvedBookings}</p>
                    </div>
                    <div className="bg-[#111119] p-5 rounded-2xl border border-white/5">
                       <p className="text-yellow-500 text-[8px] font-black uppercase mb-1">Waiting</p>
                       <p className="text-xl font-black text-white">{userStats.pendingBookings}</p>
                    </div>
                    <div className="bg-[#111119] p-5 rounded-2xl border border-white/5">
                       <p className="text-blue-400 text-[8px] font-black uppercase mb-1">Invested</p>
                       <p className="text-xl font-black text-white">${userStats.totalSpent}</p>
                    </div>
                 </div>
               ) : <p className="text-slate-700 italic text-center py-10">No metric data available.</p>}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button className="bg-white/5 text-slate-400 font-black uppercase tracking-widest text-xs rounded-xl px-10 h-12" onClick={() => setUserDetailsModalOpen(false)}>Close Dossier</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}