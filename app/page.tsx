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
    <div className="fixed bottom-24 left-4 z-[100] bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-full px-4 py-2 flex items-center gap-2">
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

  const flashSaleProducts = useMemo(() => {
    return [...products]
      .sort((a: any, b: any) => Number(b["ส่วนลด"]) - Number(a["ส่วนลด"]))
      .slice(0, 4);
  }, [products]);

  const filteredProducts = products.filter((p: any) => 
    (!selectedRoom || p["กลุ่มสินค้า"] === selectedRoom) && 
    (p["ชื่อสินค้า"]?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // 🎯 ฟังก์ชันสร้างการ์ดสินค้า ตามรูปที่คุณต้องการเป๊ะๆ
  const renderProductCard = (p: any, i: number) => {
    const price = String(p["ราคา"] || "0");
    const discount = Number(p["ส่วนลด"] || 0);
    const oldPrice = discount > 0 ? Math.floor(Number(price.replace(/,/g,'')) / (1-(discount/100))).toLocaleString() : null;
    const showCod = p["CODStatus"]?.toString().toLowerCase().trim() === "yes";
    const rating = p["ดาว"] || "0.0";
    const soldCount = p["ยอดขาย"] || "0";
    const isMall = p["MallStatus"]?.toString().toLowerCase().trim() === "mall";
    const specialTag = p["ป้ายพิเศษ"]?.toString().trim();

    return (
      <div key={i} onClick={() => window.open(p["ลิงก์สั่งซื้อ"], '_blank')} 
        className="bg-white rounded-xl overflow-hidden flex flex-col shadow-sm active:scale-[0.98] transition-transform group">
        <div className="relative aspect-square bg-gray-50">
          <img src={getImageUrl(p["รูปภาพ"])} className="w-full h-full object-cover" alt="" />
          
          {/* ✅ 1. ป้าย Mall TikTok Style มุมซ้ายบน */}
          {isMall && (
            <div className="absolute top-2 left-2 bg-[#010101] text-white text-[11px] font-black px-1.5 py-0.5 rounded-[4px] z-10 tracking-wider"
                 style={{ boxShadow: '-1.5px 0 0 #25F4EE, 1.5px 0 0 #FE2C55' }}>
              Mall
            </div>
          )}
        </div>
        
        {/* รายละเอียดสินค้า (พื้นขาว ตัวหนังสือดำ) */}
        <div className="p-2.5 flex flex-col flex-grow text-black">
          <p className="text-[12px] font-medium line-clamp-2 leading-tight mb-2 min-h-[34px]">
            {p["ชื่อสินค้า"]}
          </p>
          
          {/* ✅ 2. แถวราคา + กล่องส่วนลดสีแดงขอบแดง */}
          <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
            {discount > 0 && (
              <span className="border border-[#FE2C55] text-[#FE2C55] text-[10px] font-bold px-1 rounded-sm bg-red-50">
                -{discount}%
              </span>
            )}
            <span className="text-[18px] font-black text-[#FE2C55] leading-none">฿{price}</span>
            {oldPrice && <span className="text-[10px] text-gray-400 line-through leading-none">฿{oldPrice}</span>}
          </div>

          {/* แถวรถส่งฟรี + COD */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[#00A685] text-[10px] font-bold flex items-center gap-0.5">
              🚚 ส่งฟรี
            </span>
            {showCod && (
              <span className="text-gray-500 text-[9px] font-bold bg-gray-100 border border-gray-200 px-1 py-0.5 rounded-sm">
                COD
              </span>
            )}
          </div>

          {/* แถวดาว + ยอดขาย + ป้ายดำ (ถ้ามี) */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] mb-2">
             {specialTag && <span className="bg-black text-white px-1.5 py-0.5 rounded-sm font-bold">{specialTag}</span>}
             {isMall && <span className="bg-black text-white px-1.5 py-0.5 rounded-sm font-bold">Mall</span>}
          </div>
          
          <div className="flex items-center gap-1 text-[10px] mb-2">
            <span className="text-[#FFAB00] text-[12px]">★</span>
            <span className="font-bold text-gray-700">{rating}</span>
            <span className="text-gray-300 mx-0.5">|</span>
            <span className="font-medium text-gray-500">ขายได้ {soldCount} ชิ้น</span>
          </div>

          {/* ✅ 3. ปุ่ม "ซื้อเลย" สีแดง */}
          <button className="w-full bg-[#FE2C55] text-white py-2 rounded-full text-[13px] font-bold mt-auto active:bg-red-600 transition-colors">
            ซื้อเลย
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-[#FE2C55] italic text-3xl font-black tracking-tighter">TUKDEE.</div>;

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans overflow-x-hidden pb-10">
      
      {selectedRoom && <RealTimeVisitors />}

      {!selectedRoom ? (
        /* --- 🏠 หน้าแรก (Dark Theme) --- */
        <div className="max-w-7xl mx-auto p-4 md:p-10">
          <div className="text-center mb-10 py-10">
            <h1 className="text-6xl font-black mb-2 italic tracking-tighter text-white">ถูกดี<span className="text-[#FE2C55]">.</span></h1>
            <p className="text-gray-500 tracking-[0.4em] text-[10px] font-bold uppercase">Premium Affiliate Selection</p>
          </div>

          <div className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">🔥</span>
              <h3 className="text-lg font-black uppercase italic tracking-tight">Flash Sale ลดแรงวันนี้</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {flashSaleProducts.map((p: any, i: number) => renderProductCard(p, i))}
            </div>
          </div>

          <h3 className="text-lg font-black uppercase italic tracking-tight mb-5 px-1">เลือกหมวดหมู่</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {rooms.map((r: any) => (
              <button key={r.RoomName} onClick={() => {setSelectedRoom(r.RoomName); window.scrollTo(0,0);}} 
                className="relative h-44 rounded-2xl overflow-hidden active:scale-95 transition-all border border-white/5 bg-[#1a1a1a] group">
                <img src={getImageUrl(r.BackgroundImage)} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <span className="relative z-10 text-2xl font-black uppercase italic tracking-tighter text-white drop-shadow-lg">{r.RoomName}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* --- 🛍️ หน้ารายการสินค้า (Dark Theme + หมวดหมู่แคปซูล) --- */
        <div className="animate-fadeIn">
          
          {/* ✅ HEADER แบบที่คุณวงแดงมาเป๊ะๆ */}
          <header className="fixed top-0 left-0 right-0 bg-[#121212] z-[80] border-b border-white/10 pb-4">
            {/* แถวบน: ปุ่มกากบาท + ชื่อหมวดหมู่ */}
            <div className="flex items-center justify-between p-4">
              <button onClick={() => setSelectedRoom(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 active:bg-white/20 transition-colors">
                <span className="text-white font-bold text-sm">✕</span>
              </button>
              <h2 className="text-md font-bold text-white">{selectedRoom}</h2>
              <div className="w-8"></div>
            </div>

            {/* ✅ แถวแคปซูล (Pills) แน่นอน 100% ไม่มีวงกลมรูปภาพแล้ว */}
            <div className="flex overflow-x-auto no-scrollbar gap-2 px-4 pb-4">
              {rooms.map((r: any) => (
                <button 
                  key={r.RoomName} 
                  onClick={() => {setSelectedRoom(r.RoomName); window.scrollTo(0,0);}}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-bold transition-all ${
                    selectedRoom === r.RoomName 
                    ? 'bg-[#FE2C55] text-white' 
                    : 'bg-[#2A2A2A] text-gray-300'
                  }`}
                >
                  {r.RoomName}
                </button>
              ))}
            </div>

            {/* แถวช่องค้นหาด้านล่างหมวดหมู่ */}
            <div className="px-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input 
                  type="text" 
                  placeholder={`ค้นหาใน ${selectedRoom}...`} 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#FE2C55] text-white placeholder-gray-500" 
                />
              </div>
            </div>
          </header>

          {/* เว้นพื้นที่ให้ Header */}
          <div className="h-[180px]"></div>

          <main className="max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {filteredProducts.map((p: any, i: number) => renderProductCard(p, i))}
            </div>

            <div className="mt-20 flex flex-col items-center gap-4">
               <button onClick={() => {setSelectedRoom(null); window.scrollTo(0,0);}} className="bg-white/5 border border-white/10 text-gray-400 px-10 py-4 rounded-full text-sm font-bold uppercase hover:bg-white/10 transition-all">← กลับหน้าหลัก</button>
            </div>
          </main>
        </div>
      )}

      {/* ปุ่มโฮม ตรงกลางด้านล่าง */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-[100] pointer-events-none">
        <button onClick={() => {setSelectedRoom(null); window.scrollTo(0,0);}} className="bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all pointer-events-auto border-2 border-white/20">
          <span className="text-2xl">🏠</span>
        </button>
      </div>

    </div>
  );
}