import { useEffect, useState } from 'react';
import { 
  Card, 
  CardBody, 
  Button, 
  Select, 
  SelectItem, 
  Spinner, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
} from '@heroui/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaFilePdf, FaPrint, FaArrowsRotate, FaFilter } from 'react-icons/fa6';
import api from '../../../../config/api';

const reportTypes = [
  { key: 'event', label: 'Event Inventory' },
  { key: 'booking', label: 'Booking Ledger' },
  { key: 'revenue', label: 'Revenue Report' }
];

export default function Reports() {
  const [type, setType] = useState('event');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, [type]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reports/${type}`);
      // Force the data to be an array. If res.data.data is missing, use empty array.
      const result = res.data.data || res.data || [];
      setData(Array.isArray(result) ? result : []); 
    } catch (e) {
      console.error('Report fetch failed:', e);
      setData([]); // Crucial: Set to empty array on error so table doesn't crash
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    const report = document.getElementById('report-section');
    if (!report) return;
    const canvas = await html2canvas(report, { backgroundColor: '#111119', scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 10, 10, 277, 0);
    pdf.save(`${type}_report.pdf`);
  };

  // 1. DYNAMIC COLUMN HEADERS
  const columns = {
    event: [
      { key: "title", label: "TITLE" },
      { key: "category", label: "CATEGORY" },
      { key: "date", label: "DATE" },
      { key: "price", label: "PRICE" }
    ],
    booking: [
      { key: "user", label: "USER" },
      { key: "event", label: "EVENT" },
      { key: "status", label: "STATUS" },
      { key: "total", label: "TOTAL" }
    ],
    revenue: [
      { key: "period", label: "PERIOD" },
      { key: "bookings", label: "BOOKINGS" },
      { key: "revenue", label: "TOTAL REVENUE" },
      { key: "avg", label: "AVG VALUE" }
    ]
  };

  // 2. HELPER TO RENDER CELLS WITHOUT FRAGMENTS
  const renderCell = (item, columnKey) => {
    if (type === 'event') {
      switch (columnKey) {
        case "title": return <span className="font-bold">{item.title}</span>;
        case "category": return <span className="text-blue-400 text-[10px] font-black uppercase">{item.category}</span>;
        case "date": return <span className="text-slate-400 text-xs">{new Date(item.date).toLocaleDateString()}</span>;
        case "price": return <span className="font-black text-white">${item.price}</span>;
        default: return null;
      }
    }
    if (type === 'booking') {
      switch (columnKey) {
        case "user": return <span className="font-bold">{item.userId?.name || 'User'}</span>;
        case "event": return <span className="text-slate-400 text-xs">{item.eventId?.title || 'Event'}</span>;
        case "status": return <span className="text-emerald-400 text-[9px] font-black uppercase">{item.status}</span>;
        case "total": return <span className="font-black text-blue-400">${item.totalPrice}</span>;
        default: return null;
      }
    }
    if (type === 'revenue') {
      switch (columnKey) {
        case "period": return <span className="font-black uppercase">{item.month || item.date}</span>;
        case "bookings": return <span className="text-slate-400">{item.bookings || 0} Units</span>;
        case "revenue": return <span className="font-black text-emerald-400">${item.revenue?.toLocaleString()}</span>;
        case "avg": return <span className="text-slate-500 italic text-xs">${item.revenue ? (item.revenue / (item.bookings || 1)).toFixed(0) : 0}</span>;
        default: return null;
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#050505]">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] lg:ml-72 lg:mr-72 transition-all duration-300">
      <main className="max-w-full mx-auto p-8 md:p-12 space-y-10">
        
        <header className="space-y-1 border-b border-white/5 pb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Intelligence <span className="text-blue-500">Reports.</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium italic">Authorized data registry access.</p>
        </header>

        {/* --- CONTROLS --- */}
        <Card className="bg-[#111119] border border-white/5 rounded-2xl shadow-xl">
          <CardBody className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-end">
              <div className="xl:col-span-6 space-y-2">
                <label className="text-slate-600 text-[10px] font-black uppercase tracking-widest ml-1">Archive Type</label>
                <Select
                  aria-label="Select report type" // Fixes accessibility warning
                  selectedKeys={[type]}
                  onChange={e => setType(e.target.value)}
                  startContent={<FaFilter className="text-blue-500 text-xs mr-2" />}
                  classNames={{
                    trigger: "bg-black/40 border-white/5 hover:border-blue-500/30 h-12 rounded-xl border transition-all",
                    value: "text-white font-bold text-sm",
                    popoverContent: "bg-[#111119] border border-white/10 text-white"
                  }}
                >
                  {reportTypes.map(r => <SelectItem key={r.key} value={r.key} className="text-slate-200">{r.label}</SelectItem>)}
                </Select>
              </div>

              <div className="xl:col-span-6 flex gap-3 h-12">
                <Button fullWidth variant="flat" className="bg-white/5 text-slate-400 font-bold uppercase text-[10px] rounded-xl h-12" onClick={fetchReportData} startContent={<FaArrowsRotate />}>Refresh</Button>
                <Button fullWidth className="bg-purple-600 text-white font-black uppercase text-[10px] rounded-xl h-12 shadow-lg" onClick={handleExportPDF} startContent={<FaFilePdf />}>PDF</Button>
                <Button fullWidth className="bg-[#111119] border border-white/10 text-slate-300 font-black uppercase text-[10px] rounded-xl h-12 hover:bg-white hover:text-black" onClick={() => window.print()} startContent={<FaPrint />}>Print</Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* --- DATA REGISTRY --- */}
        <Card className="bg-[#111119] border border-white/5 rounded-3xl overflow-hidden shadow-2xl" id="report-section">
          <CardBody className="p-0">
            <Table 
              aria-label="System data report"
              removeWrapper
              classNames={{
                th: "bg-white/5 text-slate-500 font-black uppercase text-[9px] tracking-widest py-5 px-6",
                td: "py-6 px-6 text-white font-medium border-b border-white/5",
              }}
            >
              <TableHeader columns={columns[type]}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
              </TableHeader>
              <TableBody 
  items={Array.isArray(data) ? data : []} // Extra safety check
  emptyContent={
    <div className="flex flex-col items-center justify-center p-20">
       <p className="text-slate-600 font-black uppercase text-xs tracking-widest">
         No Records Found
       </p>
       <p className="text-slate-800 text-[10px] mt-2">
         Check backend logs for 500 Internal Server Error
       </p>
    </div>
  }
>
  {(item) => (
    <TableRow key={item._id || Math.random()}>
      {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
    </TableRow>
  )}
</TableBody>
            </Table>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}