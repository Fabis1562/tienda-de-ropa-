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
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group border border-gray-100"
      onClick={onViewDetails}
    >
      <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
        <ImageWithFallback 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button 
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Heart className="w-4 h-4 text-gray-700 hover:text-red-500 transition-colors" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="mb-1 text-gray-900 font-medium text-sm line-clamp-1">{name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-gray-900 font-bold text-lg">${price.toFixed(2)}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.();
            }}
            className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-md"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}