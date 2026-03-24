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
import { jsPDF } from 'jspdf';
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

      if (!res.data?.success) {
        console.error('Report API returned non-success:', res.data);
        setData([]);
        return;
      }

      let result = [];

      if (type === 'event' || type === 'booking') {
        result = Array.isArray(res.data?.data) ? res.data.data : [];
      } else if (type === 'revenue') {
        // Revenue endpoint returns revenueByEvent / revenueByCategory / monthlyRevenue
        if (Array.isArray(res.data?.data)) {
          result = res.data.data;
        } else if (Array.isArray(res.data?.revenueByEvent)) {
          result = res.data.revenueByEvent;
        } else if (Array.isArray(res.data?.monthlyRevenue)) {
          result = res.data.monthlyRevenue;
        } else if (Array.isArray(res.data?.revenueByCategory)) {
          result = res.data.revenueByCategory;
        }
      }

      setData(Array.isArray(result) ? result : []);

      if (result.length === 0) {
        console.warn(`Report ${type} returned no rows`, res.data);
      }
    } catch (e) {
      console.error('Report fetch failed:', e.response?.data || e.message || e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const getCellTextValue = (item, columnKey) => {
    if (type === 'event') {
      switch (columnKey) {
        case 'eventName': return item?.eventName || 'N/A';
        case 'category': return item?.category || 'N/A';
        case 'date': return item?.date ? new Date(item.date).toLocaleDateString() : 'N/A';
        case 'price': return `$${item?.price || 0}`;
      }
    }

    if (type === 'booking') {
      switch (columnKey) {
        case 'userName': return item?.userName || 'N/A';
        case 'eventName': return item?.eventName || 'N/A';
        case 'status': return item?.status || 'N/A';
        case 'totalPrice': return `$${item?.totalPrice || 0}`;
      }
    }

    if (type === 'revenue') {
      const bookings = item?.bookingCount || item?.bookings || 0;
      const revenue = item?.totalRevenue || item?.revenue || 0;
      const avg = bookings > 0 ? (revenue / bookings).toFixed(2) : '0.00';

      switch (columnKey) {
        case 'period': return item?.month || item?.eventName || item?.date || 'N/A';
        case 'bookings': return `${bookings}`;
        case 'revenue': return `$${Number(revenue).toLocaleString()}`;
        case 'avg': return `$${avg}`;
      }
    }

    return '';
  };

  const generateFallbackPDF = () => {
    const selectedColumns = columns[type] || [];
    if (!selectedColumns.length || !Array.isArray(data) || !data.length) {
      alert('No report data available for PDF export.');
      return;
    }

    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const margin = 40;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const rowHeight = 22;

    let y = margin;
    pdf.setFontSize(20);
    pdf.text(`${type.charAt(0).toUpperCase() + type.slice(1)} Report`, margin, y);
    y += 30;

    pdf.setFontSize(10);
    const colWidth = (pageWidth - margin * 2) / selectedColumns.length;

    // Header row
    selectedColumns.forEach((col, index) => {
      pdf.text(col.label.toString(), margin + index * colWidth + 2, y);
    });
    y += rowHeight;

    // Data rows
    data.forEach((item) => {
      if (y + rowHeight > pageHeight - margin) {
        pdf.addPage();
        y = margin + 10;
      }

      selectedColumns.forEach((col, index) => {
        const cellText = getCellTextValue(item, col.key);
        pdf.text(String(cellText), margin + index * colWidth + 2, y);
      });
      y += rowHeight;
    });

    pdf.save(`${type || 'report'}_report.pdf`);
  };

  const handleExportPDF = async () => {
    const report = document.getElementById('report-section');
    if (!report) {
      alert('Report section not available. Falling back to data export.');
      return generateFallbackPDF();
    }

    try {
      const canvas = await html2canvas(report, {
        backgroundColor: '#111119',
        scale: 2,
        useCORS: true,
        logging: false,
        ignoreElements: (el) => el.tagName === 'IFRAME',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);

      const imgWidth = pageWidth - 20;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, Math.min(imgHeight, pageHeight - 20));
      pdf.save(`${type || 'report'}_report.pdf`);
    } catch (error) {
      console.error('Export PDF failed:', error);
      console.warn('Falling back to data-driven PDF export');
      generateFallbackPDF();
    }
  };

  // 1. DYNAMIC COLUMN HEADERS
  const columns = {
    event: [
      { key: "eventName", label: "EVENT" },
      { key: "category", label: "CATEGORY" },
      { key: "date", label: "DATE" },
      { key: "price", label: "PRICE" }
    ],
    booking: [
      { key: "userName", label: "USER" },
      { key: "eventName", label: "EVENT" },
      { key: "status", label: "STATUS" },
      { key: "totalPrice", label: "TOTAL" }
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
        case "eventName": return <span className="font-bold">{item?.eventName || 'N/A'}</span>;
        case "category": return <span className="text-blue-400 text-[10px] font-black uppercase">{item?.category || 'N/A'}</span>;
        case "date": return <span className="text-slate-400 text-xs">{item?.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</span>;
        case "price": return <span className="font-black text-white">${item?.price || 0}</span>;
        default: return null;
      }
    }
    if (type === 'booking') {
      switch (columnKey) {
        case "userName": return <span className="font-bold">{item?.userName || 'User'}</span>;
        case "eventName": return <span className="text-slate-400 text-xs">{item?.eventName || 'Event'}</span>;
        case "status": return <span className="text-emerald-400 text-[9px] font-black uppercase">{item?.status || 'N/A'}</span>;
        case "totalPrice": return <span className="font-black text-blue-400">${item?.totalPrice || 0}</span>;
        default: return null;
      }
    }
    if (type === 'revenue') {
      const bookings = item?.bookingCount || item?.bookings || 0;
      const revenue = item?.totalRevenue || item?.revenue || 0;
      const avg = bookings > 0 ? revenue / bookings : 0;

      switch (columnKey) {
        case "period": return <span className="font-black uppercase">{item?.month || item?.eventName || item?.date || 'N/A'}</span>;
        case "bookings": return <span className="text-slate-400">{bookings} Units</span>;
        case "revenue": return <span className="font-black text-emerald-400">${Number(revenue).toLocaleString()}</span>;
        case "avg": return <span className="text-slate-500 italic text-xs">${avg ? avg.toFixed(2) : 0}</span>;
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
              <TableHeader columns={columns[type] || []}>
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