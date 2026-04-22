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
    <div className="fixed bottom-20 left-4 z-[100] bg-white/90 backdrop-blur-md border border-gray-100 shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <p className="text-[10px] font-bold text-gray-600">ขณะนี้มี <span className="text-[#FE2C55]">{count}</span> คนกำลังดู</p>
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
  const ROOMS_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Rooms`;
  const PRODUCTS_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Products`;

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

  const filteredProducts = products.filter((p: any) => 
    (!selectedRoom || p["กลุ่มสินค้า"] === selectedRoom) && 
    (p["ชื่อสินค้า"]?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-[#FE2C55] text-2xl font-black italic">TUKDEE.</div>;

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-black font-sans pb-20">
      
      <RealTimeVisitors />

      {/* 🎯 TIKTOK STYLE FIXED HEADER */}
      <header className="fixed top-0 left-0 right-0 bg-white z-[80] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
          {/* Search Bar Row */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-grow">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
              <input 
                type="text" 
                placeholder="ค้นหาสินค้าขายดีอันดับ 1..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F1F1F2] border-none rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-1 focus:ring-[#FE2C55]"
              />
            </div>
            <button className="text-[#FE2C55] font-bold text-sm px-2">ค้นหา</button>
          </div>

          {/* Categories Row (Horizontal Scroll) */}
          <div className="flex overflow-x-auto no-scrollbar gap-6 border-b border-gray-100">
            <button 
              onClick={() => setSelectedRoom(null)}
              className={`pb-2 text-[15px] whitespace-nowrap font-bold transition-all ${!selectedRoom ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}
            >
              ทั้งหมด
            </button>
            {rooms.map((r: any) => (
              <button 
                key={r.RoomName} 
                onClick={() => {setSelectedRoom(r.RoomName); window.scrollTo(0,0);}}
                className={`pb-2 text-[15px] whitespace-nowrap font-bold transition-all ${selectedRoom === r.RoomName ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}
              >
                {r.RoomName}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Spacer for Fixed Header */}
      <div className="h-[125px]"></div>

      {/* Product Feed */}
      <main className="max-w-7xl mx-auto p-2">
        <div className="grid grid-cols-2 gap-1.5 md:gap-4">
          {filteredProducts.map((p: any, i: number) => {
            const price = String(p["ราคา"] || "0");
            const discount = Number(p["ส่วนลด"] || 0);
            
            return (
              <div key={i} onClick={() => p["ลิงก์สั่งซื้อ"] && window.open(p["ลิงก์สั่งซื้อ"], '_blank')} 
                className="bg-white rounded-sm overflow-hidden flex flex-col shadow-sm active:opacity-80">
                <div className="relative aspect-square">
                  <img src={getImageUrl(p["รูปภาพ"])} className="w-full h-full object-cover" alt="" />
                  {discount > 0 && (
                    <span className="absolute top-0 right-0 bg-[#FE2C55] text-white text-[10px] font-bold px-1.5 py-0.5">
                      -{discount}%
                    </span>
                  )}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/20 backdrop-blur-sm px-1.5 rounded text-[9px] text-white">
                    <span className="text-cyan-400 font-bold">XTRA</span>
                    <span>จัดส่งฟรี</span>
                  </div>
                </div>
                
                <div className="p-2.5 flex flex-col flex-grow">
                  <p className="text-[13px] line-clamp-2 mb-1.5 font-medium leading-tight min-h-[36px]">
                    {p["ชื่อสินค้า"]}
                  </p>
                  
                  <div className="flex items-baseline gap-1 mt-auto">
                    <span className="text-[16px] font-bold text-[#FE2C55]">฿{price}</span>
                    <span className="text-[10px] text-gray-400 line-through">฿{ (Number(price.replace(/,/g,'')) * 1.5).toLocaleString() }</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex items-center text-[10px] text-[#FFAB00]">
                      ★ 5.0
                    </div>
                    <span className="text-[10px] text-gray-400">ขายได้ 1k+ ชิ้น</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 📱 Bottom Navigation Bar (Optional - To complete TikTok vibe) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-center z-[100]">
        <div className="flex flex-col items-center opacity-100" onClick={() => {setSelectedRoom(null); window.scrollTo(0,0);}}>
          <span className="text-xl">🏠</span>
          <span className="text-[9px] mt-0.5 font-bold">หน้าหลัก</span>
        </div>
        <div className="flex flex-col items-center opacity-40">
          <span className="text-xl">🛍️</span>
          <span className="text-[9px] mt-0.5">ร้านค้า</span>
        </div>
        <div className="bg-black rounded-lg px-3 py-1 text-white text-xl font-bold">+</div>
        <div className="flex flex-col items-center opacity-40">
          <span className="text-xl">💬</span>
          <span className="text-[9px] mt-0.5">ข้อความ</span>
        </div>
        <div className="flex flex-col items-center opacity-40">
          <span className="text-xl">👤</span>
          <span className="text-[9px] mt-0.5">โปรไฟล์</span>
        </div>
      </div>
    </div>
  );
}