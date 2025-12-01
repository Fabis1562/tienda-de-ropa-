import { Heart, ShoppingCart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  onAddToCart?: () => void;
  onViewDetails?: () => void;
}

export function ProductCard({ name, price, image, onAddToCart, onViewDetails }: ProductCardProps) {
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 relative"
      onClick={onViewDetails}
    >
      <div className="aspect-[3/4] bg-gray-100 relative">
        <ImageWithFallback src={image} alt={name} className="w-full h-full object-cover" />
        
        <button className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm text-gray-600 hover:text-red-500">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-gray-900 font-medium text-sm mb-1 line-clamp-1">{name}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-gray-900">${price.toFixed(2)}</span>
          
          {/* BOTÓN CORREGIDO: Fondo Negro, Icono Blanco */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.();
            }}
            className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform hover:bg-gray-800"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>

        </div>
      </div>
    </div>
  );
}