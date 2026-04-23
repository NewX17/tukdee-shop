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
    <div className="fixed bottom-24 left-4 z-[100] bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-full px-4 py-2.5 flex items-center gap-2 animate-bounce">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </span>
      <p className="text-[11px] font-bold text-gray-800">ขณะนี้มี <span className="text-[#FE2C55]">{count}</span> คนกำลังดูสินค้านี้</p>
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
    const priceNum = Number(price.replace(/,/g, ''));
    const discountNum = Number(p["ส่วนลด"] || 0);
    const oldPrice = discountNum > 0 ? Math.round(priceNum / (1 - discountNum / 100)).toLocaleString() : null;
    
    const showCod = p["CODStatus"]?.toString().toLowerCase().trim() === "yes";
    const rating = p["ดาว"] || "0.0"; 
    const soldCount = p["ยอดขาย"] || "0";
    const isMall = p["MallStatus"]?.toString().toLowerCase().trim() === "mall";
    const specialTag = p["ป้ายพิเศษ"]?.toString().trim(); 

    return (
      <div key={i} onClick={() => window.open(p["ลิงก์สั่งซื้อ"], '_blank')} 
           className="bg-white rounded-2xl overflow-hidden flex flex-col shadow-sm border border-gray-100 active:scale-[0.98] transition-transform group cursor-pointer">
        
        <div className="relative aspect-square bg-gray-50">
          <img src={getImageUrl(p["รูปภาพ"])} className="w-full h-full object-cover" alt="" />
          
          {/* ป้ายลดราคา % มุมขวาบน */}
          {discountNum > 0 && (
            <div className="absolute top-0 right-0 bg-[#FE2C55] text-white text-[11px] font-bold px-2 py-0.5 rounded-bl-xl z-10">
              -{discountNum}%
            </div>
          )}

          {/* ป้าย XTRA มุมซ้ายล่าง */}
          <div className="absolute bottom-0 left-0 bg-[#42C8B7] text-white px-1.5 py-0.5 rounded-tr-xl z-10">
            <p className="text-[10px] font-black italic leading-none">XTRA</p>
            <p className="text-[7px] font-medium leading-none mt-0.5">จัดส่งฟรี*</p>
          </div>
        </div>
        
        {/* รายละเอียดสินค้า */}
        <div className="p-2.5 flex-grow flex flex-col bg-white">
          
          {/* ✅ ย้ายป้ายแบรนด์ดัง+Mall มาตรงนี้ หน้าชื่อสินค้าเป๊ะๆ */}
          <div className="text-[13px] md:text-[14px] line-clamp-2 mb-1.5 text-[#222222] font-medium leading-[20px] min-h-[40px]">
            {/* ✅ ป้ายแบรนด์ดังลดแรง (ขอบฟ้า-แดง) */}
            {specialTag && (
              <span className="inline-flex items-center justify-center bg-[#111111] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[3px] mr-1 align-text-bottom h-[18px]"
                    style={{ borderLeft: '2px solid #25F4EE', borderRight: '2px solid #FE2C55' }}>
                {specialTag}
              </span>
            )}
            
            {/* ✅ ป้าย Mall (สีดำ ตัวหนังสือทอง) วางต่อกัน */}
            {isMall && (
              <span className="inline-flex items-center justify-center bg-[#1A1A1A] text-[#EAD09D] text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] mr-1 align-text-bottom h-[18px]">
                Mall
              </span>
            )}
            
            {p["ชื่อสินค้า"]}
          </div>

          <div className="flex items-baseline gap-1 mt-auto pt-1.5">
            <span className="text-[10px] font-bold text-[#FE2C55]">฿</span>
            <span className="text-[18px] font-bold text-[#FE2C55] -ml-0.5 tracking-tight">{price}</span>
            {oldPrice && <span className="text-[10px] text-gray-400 line-through ml-0.5">฿{oldPrice}</span>}
          </div>

          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span className="text-[10px] text-[#00A685] font-bold flex items-center gap-0.5 whitespace-nowrap">
              🚚 ส่งฟรี
            </span>
            {/* ✅ COD สีส้มจาง */}
            {showCod && (
              <span className="border border-[#FED7AA] text-[#F97316] bg-[#FFF7ED] px-1 py-0.5 rounded-sm text-[9px] font-bold whitespace-nowrap">
                COD
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-[#757575] flex-wrap">
            <div className="flex items-center gap-0.5 whitespace-nowrap">
                <span className="text-[#FFAB00] text-[12px]">★</span>
                <span className="font-bold">{rating}</span>
            </div>
            <span className="text-gray-300 mx-0.5">|</span>
            {/* ✅ เพิ่มคำว่า ชิ้น ต่อท้าย */}
            <span className="font-medium whitespace-nowrap">ขายได้ {soldCount} ชิ้น</span>
          </div>

          {/* ปุ่ม ซื้อเลย สีแดง */}
          <button className="w-full bg-[#FE2C55] text-white mt-3 py-2.5 rounded-full text-[13px] font-bold shadow-md shadow-[#FE2C55]/20 active:bg-red-600 transition-colors">
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
        <div className="max-w-7xl mx-auto p-4 md:p-10 animate-fadeIn">
          <div className="text-center mb-10 py-10">
            <h1 className="text-6xl md:text-7xl font-black mb-2 italic tracking-tighter text-white">ถูกดี<span className="text-[#FE2C55]">.</span></h1>
            <p className="text-gray-500 tracking-[0.4em] text-[10px] font-bold uppercase">Premium Affiliate Selection</p>
          </div>

          <div className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">🔥</span>
              <h3 className="text-lg font-black uppercase italic tracking-tight text-white">Flash Sale ลดแรงวันนี้</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
              {flashSaleProducts.map((p: any, i: number) => renderProductCard(p, i))}
            </div>
          </div>

          <h3 className="text-lg font-black uppercase italic tracking-tight mb-5 px-1 text-white">เลือกหมวดหมู่</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {rooms.map((r: any) => (
              <button key={r.RoomName} onClick={() => {setSelectedRoom(r.RoomName); window.scrollTo(0,0);}} 
                className="relative h-44 md:h-48 rounded-3xl overflow-hidden active:scale-95 transition-all border border-white/5 bg-[#1a1a1a] group">
                <img src={getImageUrl(r.BackgroundImage)} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <span className="relative z-10 text-2xl font-black uppercase italic tracking-tighter text-white drop-shadow-lg">{r.RoomName}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-fadeIn">
          <header className="fixed top-0 left-0 right-0 bg-[#121212] z-[80] border-b border-white/10 pb-4">
            <div className="flex items-center justify-between p-4">
              <button onClick={() => setSelectedRoom(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 active:bg-white/20 transition-colors">
                <span className="text-white font-bold text-sm">✕</span>
              </button>
              <h2 className="text-md font-bold text-white">{selectedRoom}</h2>
              <div className="w-8"></div>
            </div>

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

            <div className="px-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input 
                  type="text" 
                  placeholder={`ค้นหาใน ${selectedRoom}...`} 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/5 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#FE2C55] text-white placeholder-gray-500" 
                />
              </div>
            </div>
          </header>

          <div className="h-[180px]"></div>

          <main className="max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
              {filteredProducts.map((p: any, i: number) => renderProductCard(p, i))}
            </div>

            <div className="mt-20 flex flex-col items-center gap-4">
               <button onClick={() => {setSelectedRoom(null); window.scrollTo(0,0);}} className="bg-white/5 border border-white/10 text-gray-400 px-10 py-4 rounded-full text-sm font-bold uppercase hover:bg-white/10 transition-all">← กลับหน้าหลัก</button>
            </div>
          </main>
        </div>
      )}

      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-[100] pointer-events-none">
        <button onClick={() => {setSelectedRoom(null); window.scrollTo(0,0);}} className="bg-[#1A1A1A] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all pointer-events-auto border-2 border-white/10">
          <span className="text-2xl">🏠</span>
        </button>
      </div>

    </div>
  );
}