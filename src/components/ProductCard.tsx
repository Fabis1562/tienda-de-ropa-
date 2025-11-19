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
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={onViewDetails}
    >
      <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
        <ImageWithFallback 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
        <button 
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Heart className="w-4 h-4 text-gray-700" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="mb-1 text-gray-900">{name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-gray-900">${price.toFixed(2)}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.();
            }}
            className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center hover:bg-accent/90 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
