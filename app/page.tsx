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

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-[#FE2C55] text-2xl font-black italic">TUKDEE.</div>;

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-black font-sans pb-32">
      <RealTimeVisitors />
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
                className="w-full bg-[#F1F1F2] border-none rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-1 focus:ring-[#FE2C55]"
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
                <div className="flex items-center gap-2 mb-4"><span className="text-xl">🔥</span><h3 className="text-lg font-black uppercase italic">Flash Sale ลดแรงวันนี้</h3></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {flashSaleProducts.map((p: any, i: number) => {
                    const isMall = p["MallStatus"]?.toString().toLowerCase().trim() === 'mall';
                    return (
                      <div key={i} onClick={() => window.open(p["ลิงก์สั่งซื้อ"], '_blank')} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 active:scale-95 transition-transform">
                        <div className="aspect-square bg-gray-50 relative">
                          <img src={getImageUrl(p["รูปภาพ"])} className="w-full h-full object-cover" alt="" />
                          <div className="absolute top-0 right-0 bg-[#FE2C55] text-white text-[10px] font-bold px-1.5 py-0.5">-{p["ส่วนลด"]}%</div>
                          {/* ✅ ป้าย Mall สีแดง ชัดๆ ที่หน้าแรก (Flash Sale) */}
                          {isMall && <div className="absolute top-0 left-0 bg-[#FE2C55] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-br-md shadow-sm">Mall</div>}
                        </div>
                        <div className="p-3">
                          <p className="text-[11px] font-bold line-clamp-1 text-gray-500">{p["ชื่อสินค้า"]}</p>
                          <div className="text-[#FE2C55] font-black text-lg">฿{p["ราคา"]}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>
             <h3 className="text-lg font-black uppercase italic mb-5">เลือกตามหมวดหมู่</h3>
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
          <div className="grid grid-cols-2 gap-2 animate-fadeIn">
            {filteredProducts.map((p: any, i: number) => {
              const price = String(p["ราคา"] || "0");
              const discount = p["ส่วนลด"];
              const showCod = p["CODStatus"]?.toString().toLowerCase().trim() === "yes";
              const rating = p["ดาว"] || "0.0";
              const soldCount = p["ยอดขาย"] || "0";
              const isMall = p["MallStatus"]?.toString().toLowerCase().trim() === "mall";

              return (
                <div key={i} onClick={() => p["ลิงก์สั่งซื้อ"] && window.open(p["ลิงก์สั่งซื้อ"], '_blank')} className="bg-white rounded-lg overflow-hidden flex flex-col shadow-sm border border-gray-50 active:opacity-70">
                  <div className="relative aspect-square">
                    <img src={getImageUrl(p["รูปภาพ"])} className="w-full h-full object-cover" alt="" />
                    {/* ✅ ป้าย Mall สีแดง ชัดๆ ที่หน้ารายการสินค้า (Category) */}
                    {isMall && <div className="absolute top-0 left-0 bg-[#FE2C55] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-br-md shadow-md">Mall</div>}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/20 backdrop-blur-sm px-1.5 rounded text-[9px] text-white"><span className="text-cyan-400 font-bold">XTRA</span><span>จัดส่งฟรี</span></div>
                  </div>
                  <div className="p-3">
                    <p className="text-[13px] line-clamp-2 mb-2 font-medium leading-tight min-h-[36px]">{p["ชื่อสินค้า"]}</p>
                    <div className="flex items-center gap-2">
                        <div className="text-[17px] font-bold text-[#FE2C55]">฿{price}</div>
                        {discount && (
                            <div className="bg-[#FE2C55] text-white text-[9px] font-bold px-1 rounded-sm">-{discount}%</div>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex items-center text-[10px] text-[#FFAB00] font-bold">★ {rating}</div>
                      <span className="text-[10px] text-gray-400 font-medium border-l border-gray-200 pl-1.5">ขายได้ {soldCount}</span>
                      {showCod && <span className="text-[9px] text-gray-500 font-bold border border-gray-300 px-1 rounded-sm ml-auto">COD</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-[100] pointer-events-none">
        <button onClick={() => {setSelectedRoom(null); window.scrollTo(0,0);}} className="bg-black text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-all pointer-events-auto border-4 border-white"><span className="text-2xl">🏠</span></button>
      </div>
    </div>
  );
}