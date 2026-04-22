'use client';
import { useEffect, useState, useMemo } from 'react';
import Papa from 'papaparse';

// --- ส่วนที่ 1: วิดเจ็ต Real-time ผู้เข้าชม (โชว์หน้าบ้าน) ---
const RealTimeVisitors = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    // สุ่มเลขเนียนๆ ระหว่าง 12-45 คน เพื่อสร้าง Social Proof
    const randomCount = Math.floor(Math.random() * (45 - 12 + 1)) + 12;
    setCount(randomCount);
    const timer = setInterval(() => {
      const change = Math.floor(Math.random() * 3) - 1; // แกว่งตัวเลขขึ้นลงทีละนิด
      setCount(prev => Math.max(8, prev + change));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-5 left-5 z-[100] bg-white/90 backdrop-blur-md border border-gray-200 shadow-2xl rounded-full px-4 py-2 flex items-center gap-2">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </span>
      <p className="text-[11px] font-bold text-gray-800">ขณะนี้มี <span className="text-[#FE2C55]">{count}</span> คนกำลังดูสินค้านี้</p>
    </div>
  );
};

const SmallMallBadge = () => (
  <span className="bg-black text-white text-[9px] font-black px-1 py-0.5 rounded-[2px] flex items-center shadow-sm" style={{ borderLeft: '2px solid #FE2C55', borderRight: '2px solid #25F4EE' }}>
    Mall
  </span>
);

const TikTokMallBadge = () => (
  <div className="absolute top-3 left-3 z-10 bg-black text-white rounded-[4px] px-3 py-1 font-black tracking-widest flex items-center justify-center shadow-lg"
    style={{ fontSize: '16px', boxShadow: '-2.5px 0 0 0 #25F4EE, 2.5px 0 0 0 #FE2C55' }}>
    Mall
  </div>
);

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
    (p["ชื่อสินค้า"].toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleShare = (e: any, product: any) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: product["ชื่อสินค้า"], url: window.location.href });
    } else { alert("คัดลอกลิงก์แล้ว!"); }
  };

  if (loading) return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white italic text-2xl font-black">TUKDEE.</div>;

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans overflow-x-hidden">
      
      {/* วิดเจ็ตโชว์จำนวนคนเข้าใช้ (โชว์เฉพาะหน้าสินค้า) */}
      {selectedRoom && <RealTimeVisitors />}

      {!selectedRoom ? (
        <div className="max-w-7xl mx-auto p-6 md:p-10">
          <div className="text-center mb-16">
            <h1 className="text-8xl font-black mb-4 italic tracking-tighter text-white">ถูกดี<span className="text-[#FE2C55]">.</span></h1>
            <p className="text-gray-500 tracking-[0.5em] text-xs font-bold uppercase underline decoration-[#FE2C55] decoration-2">Premium Selection</p>
          </div>

          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6 text-white">
              <span className="text-2xl animate-pulse">🔥</span>
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Flash Sale ลดแรงวันนี้</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {flashSaleProducts.map((p: any, i: number) => (
                <div key={i} onClick={() => window.open(p["ลิงก์สั่งซื้อ"], '_blank')} className="bg-white rounded-xl overflow-hidden cursor-pointer group hover:border-[#FE2C55] border border-transparent transition-all">
                  <div className="relative aspect-square bg-gray-100">
                    <img src={getImageUrl(p["รูปภาพ"])} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 text-black">
                    <p className="text-[12px] font-bold line-clamp-1">{p["ชื่อสินค้า"]}</p>
                    <div className="text-[#FE2C55] font-black text-lg">฿{p["ราคา"]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {rooms.map((r: any) => (
              <button key={r.RoomName} onClick={() => setSelectedRoom(r.RoomName)} className="relative h-64 rounded-2xl overflow-hidden hover:scale-105 transition-all border border-white/10 shadow-2xl bg-[#1a1a1a] group text-white">
                <img src={getImageUrl(r.BackgroundImage)} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity" />
                <span className="relative z-10 text-3xl font-black uppercase italic tracking-tighter">{r.RoomName}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-fadeIn">
          <header className="p-4 md:p-6 border-b border-white/5 sticky top-0 bg-[#121212]/95 backdrop-blur-xl z-50">
            <div className="max-w-7xl mx-auto flex flex-col gap-4 text-white">
              <div className="flex justify-between items-center">
                <button onClick={() => {setSelectedRoom(null); setSearchQuery("");}} className="text-gray-500 font-bold hover:text-white text-sm">← หน้าแรก</button>
                <h2 className="text-xl font-black uppercase italic">{selectedRoom}</h2>
                <div className="w-8"></div>
              </div>
              <div className="relative w-full max-w-md mx-auto">
                <input type="text" placeholder={`ค้นหาใน ${selectedRoom}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-10 text-sm focus:outline-none focus:border-[#FE2C55] text-white" />
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((p: any, i: number) => {
                const price = String(p["ราคา"] || "0");
                const discount = Number(p["ส่วนลด"] || 0);
                const oldPrice = !price.includes('-') && discount > 0 ? Math.floor(Number(price.replace(/,/g,'')) / (1-(discount/100))) : null;

                return (
                  <div key={i} onClick={() => p["ลิงก์สั่งซื้อ"] && window.open(p["ลิงก์สั่งซื้อ"], '_blank')} className="bg-white rounded-xl overflow-hidden flex flex-col cursor-pointer hover:shadow-2xl transition-all group">
                    <div className="relative aspect-square bg-gray-100">
                      {p.MallStatus?.toLowerCase() === 'mall' && <TikTokMallBadge />}
                      <button onClick={(e) => handleShare(e, p)} className="absolute top-3 right-3 z-20 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all">
                        <span className="text-xs">📤</span>
                      </button>
                      <img src={getImageUrl(p["รูปภาพ"])} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 text-black flex flex-col flex-grow">
                      <p className="text-[13px] md:text-[15px] line-clamp-2 mb-2 font-medium min-h-[44px] leading-tight">{p["ชื่อสินค้า"]}</p>
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        {discount > 0 && <span className="text-[#FE2C55] text-[11px] font-black border border-[#FE2C55] px-1 py-0.5 rounded-[2px]">-{discount}%</span>}
                        <span className="text-2xl font-black text-[#FE2C55]">฿{price}</span>
                        {oldPrice && <span className="text-[11px] text-gray-400 line-through">฿{oldPrice.toLocaleString()}</span>}
                      </div>
                      <div className="flex items-center gap-1 mt-2.5 flex-wrap min-h-[20px]">
                        <span className="bg-[#149B90]/10 text-[#149B90] text-[9px] font-bold px-1.5 py-0.5 rounded-[2px]">🚚 ส่งฟรี</span>
                        <span className="bg-gray-100 text-gray-500 text-[9px] font-bold px-1.5 py-0.5 rounded-[2px]">COD</span>
                        {p["ป้ายพิเศษ"] && (
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] font-bold text-white bg-black px-1.5 py-0.5 rounded-[2px] italic">{p["ป้ายพิเศษ"]}</span>
                            <SmallMallBadge />
                          </div>
                        )}
                      </div>
                      <button className="w-full mt-3 bg-[#FE2C55] text-white py-2.5 rounded-full text-[13px] font-bold uppercase transition-all group-hover:shadow-[0_0_15px_rgba(254,44,85,0.4)]">ซื้อเลย</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}