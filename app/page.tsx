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
    <div className="fixed bottom-24 left-4 z-[100] bg-white/90 backdrop-blur-md border border-gray-100 shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
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

  // ฟังก์ชันช่วยสร้างการ์ดสินค้าให้เหมือนกันทั้งหน้าแรกและหน้าหมวดหมู่
  const renderProductCard = (p: any, i: number) => {
    const price = String(p["ราคา"] || "0");
    const priceNum = Number(price.replace(/,/g, ''));
    const discountNum = Number(p["ส่วนลด"] || 0);
    // คำนวณราคาเต็ม (ขีดฆ่า)
    const oldPrice = discountNum > 0 ? Math.round(priceNum / (1 - discountNum / 100)).toLocaleString() : null;
    
    const showCod = p["CODStatus"]?.toString().toLowerCase().trim() === "yes";
    const rating = p["ดาว"] || "0.0";
    const soldCount = p["ยอดขาย"] || "0";
    const isMall = p["MallStatus"]?.toString().toLowerCase().trim() === "mall";
    const specialTag = p["ป้ายพิเศษ"]?.toString().trim();

    return (
      <div key={i} onClick={() => window.open(p["ลิงก์สั่งซื้อ"], '_blank')} className="bg-white rounded-md overflow-hidden flex flex-col shadow-sm border border-gray-100 active:opacity-70">
        <div className="relative aspect-square bg-gray-50">
          <img src={getImageUrl(p["รูปภาพ"])} className="w-full h-full object-cover" alt="" />
          
          {/* ✅ 1. ป้าย Mall มุมซ้ายบน สีดำขอบเหลือบแสง (TikTok Style เป๊ะๆ) */}
          {isMall && (
            <div className="absolute top-1.5 left-1.5 bg-[#010101] text-white text-[10px] font-bold px-1.5 py-px rounded-[4px] z-10 tracking-wide"
                 style={{ boxShadow: '-1.5px 0 0 #25F4EE, 1.5px 0 0 #FE2C55' }}>
              Mall
            </div>
          )}

          {/* ✅ 2. ป้ายส่วนลด มุมขวาบน (สีแดง) */}
          {discountNum > 0 && (
            <div className="absolute top-0 right-0 bg-[#FE2C55] text-white text-[11px] font-medium px-1.5 py-0.5 rounded-bl-lg z-10">
              -{discountNum}%
            </div>
          )}

          {/* ✅ 3. ป้าย XTRA จัดส่งฟรี มุมซ้ายล่าง */}
          <div className="absolute bottom-0 left-0 bg-[#42C8B7] text-white px-1.5 py-0.5 rounded-tr-lg z-10">
            <p className="text-[9px] font-black italic leading-none">XTRA</p>
            <p className="text-[7px] font-medium leading-none mt-0.5">จัดส่งฟรี*</p>
          </div>
        </div>
        
        {/* รายละเอียดสินค้า */}
        <div className="p-2 flex-grow flex flex-col">
          <p className="text-[12px] line-clamp-2 mb-1 text-[#222222] font-medium leading-[16px]">
            {/* ป้าย แบรนด์ดังลดแรง (ถ้ามี) */}
            {specialTag && (
              <span className="inline-block bg-black text-white text-[9px] font-medium px-1 rounded-sm mr-1 align-middle">
                {specialTag}
              </span>
            )}
            {p["ชื่อสินค้า"]}
          </p>

          {/* ราคา และ ราคาขีดฆ่า */}
          <div className="flex items-baseline gap-1 mt-auto pt-1">
            <span className="text-[10px] font-bold text-[#FE2C55]">฿</span>
            <span className="text-[16px] font-bold text-[#FE2C55] -ml-0.5 tracking-tight">{price}</span>
            {oldPrice && <span className="text-[10px] text-gray-400 line-through ml-0.5">฿{oldPrice}</span>}
          </div>

          {/* ส่งฟรี และ COD */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[9px] text-[#00A685] font-medium flex items-center gap-0.5">
              🚚 ส่งฟรี
            </span>
            {showCod && (
              <span className="text-[9px] text-[#757575] font-medium bg-[#F5F5F5] px-1 py-0.5 rounded-[2px]">
                COD
              </span>
            )}
          </div>

          {/* ดาว และ ยอดขาย */}
          <div className="flex items-center gap-1 mt-1 text-[10px] text-[#757575]">
            <span className="text-[#FACC15] text-[11px]">★</span>
            <span className="font-medium">{rating}</span>
            <span className="text-gray-300 mx-0.5">|</span>
            <span className="font-medium">ขายได้ {soldCount}</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-[#FE2C55] text-2xl font-black italic">TUKDEE.</div>;

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-black font-sans pb-32">
      <RealTimeVisitors />
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 bg-white z-[80] shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-grow">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
              <input 
                type="text" 
                placeholder="ค้นหาสินค้าขายดีอันดับ 1..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F1F1F2] border-none rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-1 focus:ring-[#FE2C55] text-black placeholder:text-gray-500"
              />
            </div>
            <button className="text-[#FE2C55] font-bold text-sm px-2">ค้นหา</button>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-6">
            <button onClick={() => setSelectedRoom(null)} className={`pb-2 text-[15px] whitespace-nowrap font-bold transition-all ${!selectedRoom ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}>หน้าแรก</button>
            {rooms.map((r: any) => (
              <button key={r.RoomName} onClick={() => {setSelectedRoom(r.RoomName); window.scrollTo(0,0);}} className={`pb-2 text-[15px] whitespace-nowrap font-bold transition-all ${selectedRoom === r.RoomName ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}>{r.RoomName}</button>
            ))}
          </div>
        </div>
      </header>
      <div className="h-[125px]"></div>
      
      <main className="max-w-7xl mx-auto p-4">
        {!selectedRoom ? (
          <div className="animate-fadeIn">
             <div className="text-center mb-8 py-6"><h1 className="text-5xl font-black mb-1 italic tracking-tighter text-black">ถูกดี<span className="text-[#FE2C55]">.</span></h1></div>
             <div className="mb-10">
                <div className="flex items-center gap-2 mb-4"><span className="text-xl">🔥</span><h3 className="text-lg font-black uppercase italic text-black">Flash Sale ลดแรงวันนี้</h3></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {/* ใช้ฟังก์ชันสร้างการ์ดที่เหมือนกัน */}
                  {flashSaleProducts.map((p: any, i: number) => renderProductCard(p, i))}
                </div>
             </div>
             <h3 className="text-lg font-black uppercase italic mb-5 text-black">เลือกตามหมวดหมู่</h3>
             <div className="grid grid-cols-1 gap-4">
                {rooms.map((r: any) => (
                  <button key={r.RoomName} onClick={() => {setSelectedRoom(r.RoomName); window.scrollTo(0,0);}} className="relative h-44 rounded-2xl overflow-hidden active:scale-[0.98] transition-all border border-gray-100 group">
                    <img src={getImageUrl(r.BackgroundImage)} className="absolute inset-0 w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
                    <span className="relative z-10 text-2xl font-black uppercase italic tracking-tighter text-white">{r.RoomName}</span>
                  </button>
                ))}
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 animate-fadeIn">
            {/* ใช้ฟังก์ชันสร้างการ์ดที่เหมือนกัน */}
            {filteredProducts.map((p: any, i: number) => renderProductCard(p, i))}
          </div>
        )}
      </main>
      
      {/* ปุ่มหน้าหลักตรงกลาง */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-[100] pointer-events-none">
        <button onClick={() => {setSelectedRoom(null); window.scrollTo(0,0);}} className="bg-black text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-all pointer-events-auto border-4 border-white"><span className="text-2xl">🏠</span></button>
      </div>
    </div>
  );
}