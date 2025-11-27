import { useState } from "react";
import { ArrowLeft, Heart, Share2, Minus, Plus, ShoppingCart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback"; 

// Interfaz correcta
interface ProductDetailProps {
  product: any;
  onNavigate: (view: string, data?: any) => void;
  onAddToCart: (product: any, quantity: number, size: string, color: string) => void;
}

export function ProductDetail({ product, onNavigate, onAddToCart }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Negro");
  
  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = [
    { name: "Negro", hex: "#000000" },
    { name: "Blanco", hex: "#000000" },
    { name: "Azul", hex: "#3B82F6" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* HEADER FLOTANTE */}
      <div className="fixed top-0 left-0 right-0 z-20 flex justify-between items-center p-4 pointer-events-none">
        <button onClick={() => onNavigate('home')} className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 pointer-events-auto active:scale-95 transition-transform"><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex gap-3 pointer-events-auto">
            <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 active:scale-95 transition-transform"><Share2 className="w-5 h-5" /></button>
            <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 active:scale-95 transition-transform"><Heart className="w-5 h-5" /></button>
        </div>
      </div>

      {/* IMAGEN */}
      <div className="w-full h-[45vh] bg-gray-200 relative">
        <ImageWithFallback src={product.image_url || product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>

      {/* INFO */}
      <div className="flex-1 bg-white -mt-8 rounded-t-3xl relative z-10 px-6 py-8 pb-32 shadow-xl">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
        <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-900 w-3/4 leading-tight">{product.name}</h1>
            <p className="text-2xl font-bold text-gray-900">${Number(product.price).toFixed(2)}</p>
        </div>
        <div className="mb-6"><h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">Descripción</h3><p className="text-gray-500 text-sm leading-relaxed">{product.description || "Diseño exclusivo."}</p></div>
        <div className="mb-6"><h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Talla</h3><div className="flex gap-3 overflow-x-auto pb-2">{sizes.map(s => (<button key={s} onClick={() => setSelectedSize(s)} className={`min-w-[3rem] h-12 rounded-xl border-2 font-medium transition-all ${selectedSize === s ? 'border-black bg-black text-white shadow-lg' : 'border-gray-200 text-gray-600'}`}>{s}</button>))}</div></div>
        <div className="mb-6"><h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Color</h3><div className="flex gap-4">{colors.map((c) => (<button key={c.name} onClick={() => setSelectedColor(c.name)} className={`w-10 h-10 rounded-full border-2 p-1 transition-all ${selectedColor === c.name ? 'border-black scale-110' : 'border-transparent'}`}><div className="w-full h-full rounded-full shadow-sm border border-gray-100" style={{ backgroundColor: c.hex }} /></button>))}</div></div>
      </div>

      {/* BARRA INFERIOR FIJA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-6 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] flex gap-4 items-center">
        <div className="flex items-center gap-4 bg-gray-100 rounded-xl px-4 py-3 h-14">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-600 active:text-black"><Minus className="w-5 h-5" /></button>
            <span className="font-bold text-lg w-4 text-center">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="text-gray-600 active:text-black"><Plus className="w-5 h-5" /></button>
        </div>
        <button onClick={() => onAddToCart(product, quantity, selectedSize, selectedColor)} className="flex-1 h-14 bg-black text-white rounded-xl font-bold text-lg shadow-lg shadow-black/20 flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <ShoppingCart className="w-5 h-5" /><span>Añadir</span><span className="text-white/60 text-sm font-normal ml-1">| ${(product.price * quantity).toFixed(2)}</span>
        </button>
      </div>
    </div>
  );
}