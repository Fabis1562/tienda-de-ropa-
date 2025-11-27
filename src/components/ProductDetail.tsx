import { useState } from "react";
import { ArrowLeft, Heart, Share2, Minus, Plus } from "lucide-react";
// CORREGIDO: Un solo punto (.)
import { ImageWithFallback } from "./figma/ImageWithFallback"; 

interface ProductDetailProps {
  product: any;
  onNavigate: (view: string, data?: any) => void;
  onAddToCart: (product: any, quantity: number, size: string, color: string) => void;
}

export function ProductDetail({ product, onNavigate, onAddToCart }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  
  // Colores y Tallas de ejemplo (ya que la BD aún no los trae dinámicos)
  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = [
    { name: "Negro", hex: "#000000" },
    { name: "Blanco", hex: "#FFFFFF" },
    { name: "Azul", hex: "#3B82F6" },
  ];
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Negro");

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header */}
      <div className="px-5 py-4 sticky top-0 z-10 bg-white/80 backdrop-blur-md flex items-center justify-between">
        <button onClick={() => onNavigate('home')} className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md"><Share2 className="w-5 h-5" /></button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md"><Heart className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Imagen */}
      <div className="h-96 bg-gray-100 relative">
        <ImageWithFallback 
            src={product.image_url || product.image} 
            alt={product.name} 
            className="w-full h-full object-cover" 
        />
      </div>

      {/* Info */}
      <div className="p-6 -mt-6 bg-white rounded-t-3xl relative shadow-lg">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">{product.name}</h1>
        <p className="text-xl font-bold text-gray-900 mb-4">${product.price.toFixed(2)}</p>
        
        <div className="mb-6">
            <h3 className="font-bold mb-2 text-sm text-gray-900">Descripción</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{product.description || "Sin descripción disponible."}</p>
        </div>

        {/* Selectores visuales (Adorno funcional) */}
        <div className="mb-4">
            <h3 className="font-bold mb-2 text-sm">Talla</h3>
            <div className="flex gap-2">
                {sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)} className={`w-10 h-10 rounded-lg border ${selectedSize === s ? 'bg-black text-white' : 'text-gray-600'}`}>{s}</button>
                ))}
            </div>
        </div>

        <div className="flex items-center gap-4 mb-6 mt-6">
            <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 bg-white rounded shadow-sm"><Minus className="w-4 h-4" /></button>
                <span className="font-bold w-6 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 bg-white rounded shadow-sm"><Plus className="w-4 h-4" /></button>
            </div>
            <button 
                onClick={() => onAddToCart(product, quantity, selectedSize, selectedColor)} 
                className="flex-1 py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/20"
            >
                Añadir al Carrito
            </button>
        </div>
      </div>
    </div>
  );
}