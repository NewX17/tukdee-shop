'use client';
import { useEffect, useState, useMemo } from 'react';
import Papa from 'papaparse';

const RealTimeVisitors = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const randomCount = Math.floor(Math.random() * (45 - 12 + 1)) + 12;
    setCount(randomCount);
    const timer = setInterval(() => {
      const change = Math.floor(Math.random() * 3) - 1;
      setCount(prev => Math.max(8, prev + change));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-24 left-4 z-[100] bg-white/95 backdrop-blur-md border border-gray-200 shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <p className="text-[10px] font-bold text-gray-800">ขณะนี้มี <span className="text-[#FE2C55]">{count}</span> คนกำลังดู</p>
    </div>
  );
};

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const SHEET_ID = "1qreVNyW_04G_4I4gn_dwy5mxTbVa5FObUEipBWGjWMg";
  const ROOMS_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Rooms&t=${new Date().getTime()}`;
  const PRODUCTS_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Products&t=${new Date().getTime()}`;

  const getImageUrl = (url: any) => {
    if (!url || typeof url !== 'string') return "";
    const cleanUrl = url.trim();
    if (cleanUrl.includes('drive.google.com')) {
      let fileId = cleanUrl.includes('/d/') ? cleanUrl.split('/d/')[1]?.split('/')[0] : cleanUrl.split('id=')[1]?.split('&')[0];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    return cleanUrl;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [resR, resP] = await Promise.all([fetch(ROOMS_URL), fetch(PRODUCTS_URL)]);
        const [csvR, csvP] = await Promise.all([resR.text(), resP.text()]);
        setRooms(Papa.parse(csvR, { header: true }).data as any[]);
        setProducts(Papa.parse(csvP, { header: true }).data as any[]);
        setLoading(false);
      } catch (e) { setLoading(false); }
    };
    fetchAllData();
  }, []);

  const renderProductCard = (p: any, i: number) => {
    const price = String(p["ราคา"] || "0");
    const discount = Number(p["ส่วนลด"] || 0);
    const oldPrice = discount > 0 ? Math.floor(Number(price.replace(/,/g,'')) / (1-(discount/100))).toLocaleString() : null;
    const showCod = p["CODStatus"]?.toString().toLowerCase().trim() === "yes";
    const rating = p["ดาว"] || "0.0";
    const soldCount = p["ยอดขาย"] || "0";
    const isMall = p["MallStatus"]?.toString().toLowerCase().trim() === "mall";
    const specialTag = p["ป้ายพิเศษ"]?.toString().trim();

    // สไตล์ขอบเงา น้ำเงิน-แดง แบบ TikTok
    const tiktokGlow = { boxShadow: '-1.5px 0 0 #25F4EE, 1.5px 0 0 #FE2C55' };

    return (
      <div key={i} onClick={() => window.open(p["ลิงก์สั่งซื้อ"], '_blank')} 
        className="bg-white rounded-xl overflow-hidden flex flex-col shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
        <div className="relative aspect-square">
          <img src={getImageUrl(p["รูปภาพ"])} className="w-full h-full object-cover" alt="" />
          
          {/* ✅ ป้าย Mall มุมซ้ายบน ขอบเงา น้ำเงิน-แดง */}
          {isMall && (
            <div className="absolute top-2 left-2 bg-black text-white text-[10px] font-black px-1.5 py-0.5 rounded-[4px] z-10" style={tiktokGlow}>
              Mall
            </div>
          )}

          {/* ป้าย % ลดราคา */}
          {discount > 0 && (
            <div className="absolute top-0 right-0 bg-[#FE2C55] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg">
              -{discount}%
            </div>
          )}

          {/* ป้าย XTRA */}
          <div className="absolute bottom-0 left-0 bg-[#42C8B7] text-white px-1.5 py-0.5 rounded-tr-lg">
            <p className="text-[9px] font-black italic leading-none">XTRA</p>
            <p className="text-[7px] font-bold leading-none mt-0.5">จัดส่งฟรี*</p>
          </div>
        </div>
        
        <div className="p-2.5 flex flex-col flex-grow text-black">
          {/* ✅ ป้ายแบรนด์ดังลดแรง ขอบเงา น้ำเงิน-แดง ต่อด้วยชื่อสินค้า */}
          <p className="text-[12px] font-medium line-clamp-2 leading-tight mb-2 min-h-[34px]">
            {specialTag && (
              <span className="inline-block bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm mr-1.5 align-middle" style={tiktokGlow}>
                {specialTag}
              </span>
            )}
            {p["ชื่อสินค้า"]}
          </p>
          
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[18px] font-black text-[#FE2C55]">฿{price}</span>
            {oldPrice && <span className="text-[10px] text-gray-400 line-through">฿{oldPrice}</span>}
            {discount > 0 && <span className="border border-[#FE2C55] text-[#FE2C55] text-[9px] font-bold px-1 rounded-sm bg-red-50">-{discount}%</span>}
          </div>

          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[#00A685] text-[10px] font-bold flex items-center gap-0.5">🚚 ส่งฟรี</span>
            {/* ✅ ป้าย COD สีส้มจาง ขอบส้ม */}
            {showCod && (
              <span className="text-[#F97316] text-[9px] font-bold bg-[#FFF7ED] border border-[#FED7AA] px-1 rounded-sm">COD</span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[10px] mt-auto">
            <span className="text-[#FFAB00]">★</span>
            <span className="font-bold text-gray-700">{rating}</span>
            <span className="text-gray-300 mx-0.5">|</span>
            {/* ✅ เพิ่มคำว่า "ชิ้น" ต่อท้ายยอดขาย */}
            <span className="font-medium text-gray-500">ขายได้ {soldCount} ชิ้น</span>
          </div>

          <button className="w-full bg-[#FE2C55] text-white py-2 rounded-full text-[13px] font-bold mt-3 active:bg-red-600 transition-colors">
            ซื้อเลย
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-[#FE2C55] text-3xl font-black italic">TUKDEE.</div>;

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-32">
      <RealTimeVisitors />
      
      <header className="fixed top-0 left-0 right-0 bg-white z-[80] shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-grow">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input type="text" placeholder="ค้นหาสินค้าขายดี..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F1F1F2] border-none rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-1 focus:ring-[#FE2C55]" />
            </div>
            <button className="text-[#FE2C55] font-bold text-sm">ค้นหา</button>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
            <button onClick={() => setSelectedRoom(null)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-bold ${!selectedRoom ? 'bg-[#FE2C55] text-white' : 'bg-gray-100 text-gray-500'}`}>หน้าแรก</button>
            {rooms.map((r: any) => (
              <button key={r.RoomName} onClick={() => {setSelectedRoom(r.RoomName); window.scrollTo(0,0);}}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-bold ${selectedRoom === r.RoomName ? 'bg-[#FE2C55] text-white' : 'bg-gray-100 text-gray-500'}`}>{r.RoomName}</button>
            ))}
          </div>
        </div>
      </header>

      <div className="h-[135px]"></div>
      
      <main className="max-w-7xl mx-auto p-4">
        {!selectedRoom ? (
          <div>
            <div className="mb-10">
                <h3 className="text-lg font-black italic mb-4">🔥 Flash Sale</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {flashSaleProducts.map((p: any, i: number) => renderProductCard(p, i))}
                </div>
            </div>
            <h3 className="text-lg font-black italic mb-4 text-black">หมวดหมู่</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rooms.map((r: any) => (
                  <button key={r.RoomName} onClick={() => {setSelectedRoom(r.RoomName); window.scrollTo(0,0);}} className="relative h-44 rounded-2xl overflow-hidden bg-gray-100 group">
                    <img src={getImageUrl(r.BackgroundImage)} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="" />
                    <div className="absolute inset-0 bg-black/30"></div>
                    <span className="relative z-10 text-2xl font-black italic text-white uppercase">{r.RoomName}</span>
                  </button>
                ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filteredProducts.map((p: any, i: number) => renderProductCard(p, i))}
          </div>
        )}
      </main>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-[100] pointer-events-none">
        <button onClick={() => {setSelectedRoom(null); window.scrollTo(0,0);}} className="bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all pointer-events-auto border-2 border-white/20">
          <span className="text-2xl">🏠</span>
        </button>
      </div>
    </div>
  );
}