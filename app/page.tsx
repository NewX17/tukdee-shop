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
    <div className="fixed bottom-20 left-4 z-[100] bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg rounded-full px-3 py-1.5 flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <p className="text-[10px] font-bold text-gray-700">ขณะนี้มี <span className="text-[#FE2C55]">{count}</span> คนกำลังดู</p>
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

  const renderProductCard = (p: any, i: number) => {
    const price = String(p["ราคา"] || "0");
    const discountNum = Number(p["ส่วนลด"] || 0);
    const priceNum = Number(price.replace(/,/g, ''));
    const oldPrice = discountNum > 0 ? Math.floor(priceNum / (1 - (discountNum / 100))).toLocaleString() : null;
    
    const showCod = p["CODStatus"]?.toString().toLowerCase().trim() === "yes" || true;
    
    const rating = p["ดาว"] || "0.0";
    const soldCount = p["ยอดขาย"] || "0";
    const isMall = p["MallStatus"]?.toString().toLowerCase().trim() === "mall";
    const specialTag = p["ป้ายพิเศษ"]?.toString().trim();
    
    const showTopChoice = !isMall && !specialTag;

    return (
      <div key={i} onClick={() => window.open(p["ลิงก์สั่งซื้อ"], '_blank')} 
           className="bg-white rounded-[4px] overflow-hidden flex flex-col shadow-sm border border-gray-200 cursor-pointer pb-2.5 hover:shadow-md transition-shadow">
        
        <div className="relative aspect-square bg-gray-100">
          <img src={getImageUrl(p["รูปภาพ"])} className="w-full h-full object-cover" alt="" />
          
          {isMall && (
            <div className="absolute top-1.5 left-1.5 bg-[#010101] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] z-10 tracking-wide"
                 style={{ boxShadow: '-1.5px 0 0 #25F4EE, 1.5px 0 0 #FE2C55' }}>
              Mall
            </div>
          )}

          {discountNum > 0 && (
            <div className="absolute top-0 right-0 bg-[#FE2C55] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-bl-[4px] z-10">
              -{discountNum}%
            </div>
          )}

          <div className="absolute bottom-0 left-0 bg-[#42C8B7] text-white px-1.5 py-0.5 rounded-tr-[4px] z-10">
            <p className="text-[10px] font-black italic leading-none">XTRA</p>
            <p className="text-[7px] font-medium leading-none mt-0.5">จัดส่งฟรี*</p>
          </div>
        </div>
        
        <div className="px-2 pt-2 flex flex-col flex-grow">
          
          <div className="w-full mb-1">
            <div className="text-[13px] leading-[18px] h-[36px] line-clamp-2 break-words text-[#222222]">
              {specialTag && (
                <span className="inline-block bg-[#111111] text-white text-[9px] font-bold px-1 py-[1px] rounded-[2px] mr-1 align-middle"
                      style={{ borderLeft: '1.5px solid #25F4EE', borderRight: '1.5px solid #FE2C55', lineHeight: '1.2' }}>
                  {specialTag}
                </span>
              )}
              
              {isMall && (
                <span className="inline-block bg-[#1A1A1A] text-[#EAD09D] text-[9px] font-bold px-1 py-[1px] rounded-[2px] mr-1 align-middle"
                      style={{ lineHeight: '1.2' }}>
                  Mall
                </span>
              )}

              {/* ✅ แก้ไขตรงนี้: ป้าย TopChoice พื้นส้มอ่อน ตัวหนังสือสีดำ ตามรูปซ้ายเป๊ะๆ */}
              {showTopChoice && (
                <span className="inline-block bg-[#FFE0B2] text-black text-[9px] font-bold px-1.5 py-[1px] rounded-[2px] mr-1 align-middle"
                      style={{ lineHeight: '1.2' }}>
                  TopChoice
                </span>
              )}
              
              {p["ชื่อสินค้า"]}
            </div>
          </div>

          <div className="flex items-baseline gap-0.5 mt-auto pt-1">
            <span className="text-[12px] font-bold text-[#FE2C55]">฿</span>
            <span className="text-[18px] font-bold text-[#FE2C55] tracking-tight">{price}</span>
            {oldPrice && <span className="text-[11px] text-gray-400 line-through ml-1">฿{oldPrice}</span>}
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-[#277F74] bg-[#EAF6F3] font-bold flex items-center gap-0.5 px-1.5 py-[2px] rounded-[3px]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M19 7h-3V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10h2a3 3 0 0 0 6 0h4a3 3 0 0 0 6 0h2v-4l-3-5zM8 18a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm10 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-1-7h-3v-2h3v2z"/>
              </svg>
              ส่งฟรี
            </span>
            {showCod && (
              <span className="text-[10px] text-[#9B7347] bg-[#FDF4E7] font-bold px-1.5 py-[2px] rounded-[3px]">COD</span>
            )}
          </div>

          <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
            <span className="text-[#FFAB00] text-[12px]">★</span>
            <span className="font-bold">{rating}</span>
            <span className="text-gray-300 mx-0.5">|</span>
            <span className="font-medium">ขายได้ {soldCount} ชิ้น</span>
          </div>

          <button className="w-full bg-[#FE2C55] text-white mt-2.5 py-1.5 rounded-full text-[12px] font-bold active:bg-red-600 transition-colors">
            ซื้อเลย
          </button>

        </div>
      </div>
    );
  };

  if (loading) return <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center text-[#FE2C55] italic text-3xl font-black tracking-tighter">TUKDEE.</div>;

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#222222] font-sans overflow-x-hidden pb-16">
      {selectedRoom && <RealTimeVisitors />}

      <header className="fixed top-0 left-0 right-0 bg-white z-[80] shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 pt-3 pb-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative flex-grow">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input 
                type="text" 
                placeholder="ค้นหาสินค้าขายดีอันดับ 1..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F1F1F2] border-none rounded-md py-2 pl-9 pr-3 text-[13px] focus:outline-none text-black"
              />
            </div>
            <span className="text-[#FE2C55] text-[13px] font-bold px-1">ค้นหา</span>
          </div>
          
          <div className="flex overflow-x-auto no-scrollbar gap-5 px-1">
            <button onClick={() => setSelectedRoom(null)} 
              className={`pb-2 text-[14px] whitespace-nowrap font-medium transition-all ${!selectedRoom ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}>
              หน้าแรก
            </button>
            {rooms.map((r: any) => (
              <button key={r.RoomName} onClick={() => {setSelectedRoom(r.RoomName); window.scrollTo(0,0);}} 
                className={`pb-2 text-[14px] whitespace-nowrap font-medium transition-all ${selectedRoom === r.RoomName ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}>
                {r.RoomName}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="h-[95px]"></div>

      <main className="max-w-7xl mx-auto p-2">
        {!selectedRoom ? (
          <div className="animate-fadeIn">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3 mt-2 px-1">
                <span className="text-xl">🔥</span>
                <h3 className="text-lg font-black uppercase italic text-black">Flash Sale ลดแรงวันนี้</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {flashSaleProducts.map((p: any, i: number) => renderProductCard(p, i))}
              </div>
            </div>

            <h3 className="text-lg font-black uppercase italic mb-3 px-1 text-black mt-6">เลือกหมวดหมู่</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {rooms.map((r: any) => (
                <button key={r.RoomName} onClick={() => {setSelectedRoom(r.RoomName); window.scrollTo(0,0);}} 
                  className="relative h-32 rounded-xl overflow-hidden active:scale-95 transition-all border border-gray-200 group">
                  <img src={getImageUrl(r.BackgroundImage)} className="absolute inset-0 w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all"></div>
                  <span className="relative z-10 text-xl font-black uppercase italic tracking-tighter text-white drop-shadow-md">{r.RoomName}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 animate-fadeIn">
            {filteredProducts.map((p: any, i: number) => renderProductCard(p, i))}
          </div>
        )}
      </main>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-[100] pointer-events-none">
        <button onClick={() => {setSelectedRoom(null); window.scrollTo(0,0);}} 
          className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all pointer-events-auto border border-white/20">
          <span className="text-xl">🏠</span>
        </button>
      </div>

    </div>
  );
}