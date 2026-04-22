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
    <div className="fixed bottom-6 left-4 z-[100] bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-full px-4 py-2.5 flex items-center gap-2 animate-bounce">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </span>
      <p className="text-[12px] font-bold text-gray-800">ขณะนี้มี <span className="text-[#FE2C55]">{count}</span> คนกำลังดูสินค้านี้</p>
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

  const flashSaleProducts = useMemo(() => {
    return [...products]
      .sort((a: any, b: any) => Number(b["ส่วนลด"]) - Number(a["ส่วนลด"]))
      .slice(0, 4);
  }, [products]);

  const filteredProducts = products.filter((p: any) => 
    p["กลุ่มสินค้า"] === selectedRoom && 
    (p["ชื่อสินค้า"]?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white italic text-3xl font-black tracking-tighter">TUKDEE.</div>;

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans overflow-x-hidden pb-10">
      
      {selectedRoom && <RealTimeVisitors />}

      {!selectedRoom ? (
        <div className="max-w-7xl mx-auto p-6 md:p-10">
          <div className="text-center mb-12 py-10">
            <h1 className="text-7xl font-black mb-2 italic tracking-tighter text-white">ถูกดี<span className="text-[#FE2C55]">.</span></h1>
            <p className="text-gray-500 tracking-[0.4em] text-[10px] font-bold uppercase">Premium Affiliate Selection</p>
          </div>

          {/* Flash Sale Section */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">🔥</span>
              <h3 className="text-lg font-black uppercase italic tracking-tight">Flash Sale ลดแรงวันนี้</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {flashSaleProducts.map((p: any, i: number) => (
                <div key={i} onClick={() => window.open(p["ลิงก์สั่งซื้อ"], '_blank')} className="bg-white rounded-2xl overflow-hidden cursor-pointer shadow-lg active:scale-95 transition-transform">
                  <div className="aspect-square bg-gray-50">
                    <img src={getImageUrl(p["รูปภาพ"])} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="p-3 text-black">
                    <p className="text-[11px] font-bold line-clamp-1 opacity-70">{p["ชื่อสินค้า"]}</p>
                    <div className="text-[#FE2C55] font-black text-lg">฿{p["ราคา"]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Room Selection */}
          <h3 className="text-lg font-black uppercase italic tracking-tight mb-5 px-1">เลือกหมวดหมู่</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {rooms.map((r: any) => (
              <button 
                key={r.RoomName} 
                onClick={() => {setSelectedRoom(r.RoomName); window.scrollTo(0,0);}} 
                className="relative h-48 rounded-3xl overflow-hidden active:scale-95 transition-all border border-white/5 bg-[#1a1a1a] group"
              >
                {r.BackgroundImage && (
                  <img 
                    src={getImageUrl(r.BackgroundImage)} 
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" 
                    alt={r.RoomName} 
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <span className="relative z-10 text-2xl font-black uppercase italic tracking-tighter text-white">
                  {r.RoomName}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-fadeIn">
          {/* 🎯 FIXED HEADER - แก้ไขใหม่ให้ปุ่มไม่พัง */}
<header className="fixed top-0 left-0 right-0 bg-[#121212]/95 backdrop-blur-2xl z-[80] border-b border-white/5">
  <div className="max-w-7xl mx-auto">
    {/* แถวบน: ปุ่มปิดและชื่อหมวดหมู่ที่เลือก */}
    <div className="flex items-center justify-between p-4">
      <button onClick={() => setSelectedRoom(null)} 
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 active:bg-[#FE2C55]">
        <span className="text-xl font-bold text-white">✕</span>
      </button>
      <h2 className="text-md font-black uppercase italic tracking-tight text-white">{selectedRoom}</h2>
      <div className="w-10"></div>
    </div>

    {/* แถวล่าง: ปุ่มหมวดหมู่แบบวงกลม (ไม่พังแน่นอน) */}
    <div className="flex overflow-x-auto no-scrollbar gap-5 px-6 pb-5">
      {rooms.map((r: any) => (
        <button 
          key={r.RoomName} 
          onClick={() => {setSelectedRoom(r.RoomName); window.scrollTo(0,0);}}
          className="flex flex-col items-center gap-2 flex-shrink-0"
        >
          {/* วงกลมใส่รูป */}
          <div className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all ${
            selectedRoom === r.RoomName ? 'border-[#FE2C55] scale-110 shadow-[0_0_10px_rgba(254,44,85,0.5)]' : 'border-white/10 opacity-60'
          }`}>
            <img 
              src={getImageUrl(r.BackgroundImage)} 
              className="w-full h-full object-cover" 
              alt="" 
            />
          </div>
          {/* ชื่อหมวดหมู่ด้านล่างปุ่ม */}
          <span className={`text-[10px] font-bold uppercase tracking-tighter ${
            selectedRoom === r.RoomName ? 'text-[#FE2C55]' : 'text-gray-500'
          }`}>
            {r.RoomName}
          </span>
        </button>
      ))}
    </div>
  </div>
</header>

          <div className="h-[140px]"></div>

          <main className="max-w-7xl mx-auto p-4 pt-2">
            <div className="mb-6 px-1">
                <input type="text" placeholder={`ค้นหาใน ${selectedRoom}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-[#FE2C55] text-white placeholder:text-gray-600" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {filteredProducts.map((p: any, i: number) => {
                const price = String(p["ราคา"] || "0");
                const discount = Number(p["ส่วนลด"] || 0);
                const oldPrice = !price.includes('-') && discount > 0 ? Math.floor(Number(price.replace(/,/g,'')) / (1-(discount/100))) : null;

                return (
                  <div key={i} onClick={() => p["ลิงก์สั่งซื้อ"] && window.open(p["ลิงก์สั่งซื้อ"], '_blank')} 
                    className="bg-white rounded-2xl overflow-hidden flex flex-col shadow-sm active:scale-[0.98] transition-transform group">
                    <div className="relative aspect-square bg-gray-50">
                      <img src={getImageUrl(p["รูปภาพ"])} className="w-full h-full object-cover" alt="" />
                      {discount > 0 && <span className="absolute top-2 left-2 bg-[#FE2C55] text-white text-[10px] font-black px-2 py-1 rounded-lg">-{discount}%</span>}
                    </div>
                    <div className="p-3 text-black flex flex-col flex-grow">
                      <p className="text-[12px] md:text-[14px] line-clamp-2 mb-1 font-bold leading-tight min-h-[32px]">{p["ชื่อสินค้า"]}</p>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-xl font-black text-[#FE2C55]">฿{price}</span>
                        {oldPrice && <span className="text-[10px] text-gray-400 line-through">฿{oldPrice.toLocaleString()}</span>}
                      </div>
                      <div className="flex items-center gap-1 mt-2 mb-3">
                        <span className="bg-green-50 text-green-600 text-[8px] font-bold px-1.5 py-0.5 rounded border border-green-100">ส่งฟรี</span>
                        <span className="bg-gray-50 text-gray-400 text-[8px] font-bold px-1.5 py-0.5 rounded border border-gray-100">COD</span>
                      </div>
                      <button className="w-full bg-[#FE2C55] text-white py-3 rounded-xl text-[12px] font-black uppercase shadow-lg shadow-[#FE2C55]/20">สั่งซื้อ</button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-20 flex flex-col items-center gap-4">
               <button onClick={() => {setSelectedRoom(null); window.scrollTo(0,0);}} 
                className="bg-white/5 border border-white/10 text-gray-400 px-10 py-4 rounded-full text-sm font-bold uppercase hover:bg-white/10 transition-all">
                ← กลับไปเลือกหมวดหมู่อื่น
               </button>
               <p className="text-[10px] text-gray-700 font-bold tracking-widest uppercase">Tukdee Selection • 2026</p>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}