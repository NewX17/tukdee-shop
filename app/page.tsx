import React, { useState } from 'react';

const ProductDetailPage = () => {
  const [selectedColor, setSelectedColor] = useState('[ official ] Naked Fever');
  const [selectedSize, setSelectedSize] = useState('L');
  const [quantity, setQuantity] = useState(1);

  const colors = [
    { name: '[ official ] Naked Fever', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=300&auto=format&fit=crop' },
    { name: 'pF 21L Pure Pufume', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=300&auto=format&fit=crop' },
  ];

  const sizes = ['L', 'XL'];

  const handleQuantityChange = (type) => {
    if (type === 'increment') {
      setQuantity((prev) => prev + 1);
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };

  return (
    <div className="bg-white min-h-screen p-4 md:p-6 lg:p-8 font-sans text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
            alt="Product"
            className="w-full h-auto rounded-lg"
          />
          <div className="absolute top-2 left-2 flex gap-2">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">31.02.2023 - 31.05.2023</span>
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              A scent that matches your naked skin
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-4">A'DDict - [Official] Solid Perfume pF 21 & pF 21L (Naked Fever / Pure Pufume)</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium text-gray-700 bg-gray-200 px-3 py-1 rounded-full" style={{ borderLeft: '3px solid blue', borderRight: '3px solid red' }}>
              A Brand Name
            </span>
            <span className="text-xs font-bold text-white bg-red-600 px-3 py-1 rounded-full">Mall</span>
            <div className="flex items-center gap-1 text-gray-500">
              <span className="text-yellow-400">★★★★☆</span>
              <span>4.8</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-700 font-medium">(1,100 รีวิว)</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-700 font-bold">1.9k ชิ้น ขายแล้ว</span>
            </div>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">A scent that perfectly matches your naked skin... A scent that matches your naked skin... A scent that matches your naked skin... A scent that matches your naked skin... A scent that matches your naked skin...</p>

          <div className="mb-6 h-64 overflow-y-auto p-4 border rounded-lg bg-gray-50">
            <p className="font-bold text-black mb-2 leading-relaxed">
              *pF 21 [ officiel ] solid perfume Naked Fever*
              A scent that perfectly matches your naked skin... Scent that perfectly matches your naked skin and mores over message.
            </p>
            <p className="font-bold text-black leading-relaxed">
              *Naked Fever - pF 21L Pure Pufume*
              A scent that perfectly matches your naked skin... Scent that perfectly matches your naked skin and mores over message.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 border-t border-b border-gray-100 mb-6 text-center text-gray-700 font-medium">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">💬</span>
              <span>รีวิวสินค้า</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">❔</span>
              <span>คำถามที่พบบ่อย</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🏬</span>
              <span>ข้อมูลร้านค้า</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            <div className="space-y-4">
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop" alt="Detailed 1" className="w-full h-auto rounded-lg" />
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=300&auto=format&fit=crop" alt="Detailed 2" className="w-full h-auto rounded-lg" />
              <p className="text-gray-600 font-medium mt-2 leading-relaxed">
                Naked Fever - pF 21L Pure Pufume, Scent that perfectly matches your naked skin... Scent that perfectly matches your naked skin and scent that perhased skin...
              </p>
            </div>
            <div className="space-y-4">
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop" alt="Detailed 3" className="w-full h-auto rounded-lg" />
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=300&auto=format&fit=crop" alt="Detailed 4" className="w-full h-auto rounded-lg" />
              <p className="text-gray-600 font-medium mt-2 leading-relaxed">
                Naked Fever - pF 21L Pure Pufume, Scent that perfectly matches your naked skin... Scent that perfectly matches your naked skin and scent that perhased skin...
              </p>
            </div>
            <div className="space-y-4">
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop" alt="Detailed 5" className="w-full h-auto rounded-lg" />
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=300&auto=format&fit=crop" alt="Detailed 6" className="w-full h-auto rounded-lg" />
              <p className="text-gray-600 font-medium mt-2 leading-relaxed">
                Naked Fever - pF 21L Pure Pufume, Scent that perfectly matches your naked skin... Scent that perfectly matches your naked skin and scent that perhased skin...
              </p>
            </div>
          </div>

          <div className="border border-gray-100 rounded-lg p-6 space-y-6">
            <h3 className="font-bold text-black">สี</h3>
            <div className="flex gap-4 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`flex items-center gap-3 p-3 border rounded-lg transition ${
                    selectedColor === color.name ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <img src={color.image} alt={color.name} className="w-10 h-10 rounded" />
                  <span className={`font-medium ${selectedColor === color.name ? 'text-blue-700' : 'text-gray-700'}`}>
                    {color.name}
                  </span>
                </button>
              ))}
            </div>

            <h3 className="font-bold text-black mt-6">ขนาด</h3>
            <div className="flex gap-4">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-5 py-2.5 border rounded-lg transition ${
                    selectedSize === size ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <span className={`font-medium ${selectedSize === size ? 'text-blue-700' : 'text-gray-700'}`}>
                    {size}
                  </span>
                </button>
              ))}
            </div>

            <h3 className="font-bold text-black mt-6">จำนวน</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button onClick={() => handleQuantityChange('decrement')} className="p-3">
                  <span className="text-gray-500 font-medium">−</span>
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-16 text-center font-bold text-black border-l border-r border-gray-200 bg-white"
                />
                <button onClick={() => handleQuantityChange('increment')} className="p-3">
                  <span className="text-gray-500 font-medium">+</span>
                </button>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white mt-8 py-4 rounded-full text-lg font-bold">
              ซื้อเลย
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;