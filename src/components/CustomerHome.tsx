import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ProductCard } from "./ProductCard";

interface CustomerHomeProps {
  onNavigate: (view: string, data?: any) => void;
  onAddToCart: (product: any) => void;
}

export function CustomerHome({ onNavigate, onAddToCart }: CustomerHomeProps) {
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1558452919-08ae4aea8e29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBiYW5uZXJ8ZW58MXx8fHwxNzYyNjYwNzI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Nueva Colección",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1562182856-e39faab686d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGVsZWdhbnQlMjBkcmVzc3xlbnwxfHx8fDE3NjI2MjUwODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Elegancia",
    },
  ];

  const categories = [
    { id: 1, name: "Vestidos", emoji: "👗" },
    { id: 2, name: "Camisas", emoji: "👔" },
    { id: 3, name: "Pantalones", emoji: "👖" },
    { id: 4, name: "Accesorios", emoji: "👜" },
  ];

  const newProducts = [
    {
      id: 1,
      name: "Vestido Elegante",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1562182856-e39faab686d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGVsZWdhbnQlMjBkcmVzc3xlbnwxfHx8fDE3NjI2MjUwODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 2,
      name: "Camisa Casual",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1657405592096-0eb9199a8634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBzaGlydCUyMGZhc2hpb258ZW58MXx8fHwxNzYyNjM3MTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 3,
      name: "Jeans Premium",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1578693082747-50c396cacd81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjI2NzU5MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 4,
      name: "Outfit Verano",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1761918994321-ceac89b08252?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBjbG90aGluZyUyMHN0eWxlfGVufDF8fHx8MTc2MjY3NTkwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  const specialOffers = [
    {
      id: 5,
      name: "Abrigo Invierno",
      price: 129.99,
      originalPrice: 189.99,
      image: "https://images.unsplash.com/photo-1645606491757-bac7cd8e55b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBjb2F0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NjI2NzU5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 6,
      name: "Sneakers Modernos",
      price: 99.99,
      originalPrice: 149.99,
      image: "https://images.unsplash.com/photo-1650320079970-b4ee8f0dae33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjI2NjAyNzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-5 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto">
          <h1 className="text-gray-900 mb-3">Tienda de Ropa</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-100 rounded-full border-none outline-none focus:bg-gray-200 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5">
        {/* Banner Carousel */}
        <div className="mt-5 relative rounded-2xl overflow-hidden">
          <div className="relative h-48">
            <ImageWithFallback
              src={banners[currentBanner].image}
              alt={banners[currentBanner].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-5">
              <h2 className="text-white">{banners[currentBanner].title}</h2>
            </div>
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentBanner ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Categorías</h2>
            <button 
              onClick={() => onNavigate('catalog')}
              className="text-accent flex items-center gap-1"
            >
              Ver todo
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onNavigate('catalog')}
                className="bg-white rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all"
              >
                <span className="text-3xl">{category.emoji}</span>
                <span className="text-xs text-gray-600">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* New Products */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Novedades</h2>
            <button 
              onClick={() => onNavigate('catalog')}
              className="text-accent flex items-center gap-1"
            >
              Ver todo
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {newProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={() => onAddToCart(product)}
                onViewDetails={() => onNavigate('detail', product)}
              />
            ))}
          </div>
        </div>

        {/* Special Offers */}
        <div className="mt-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Ofertas Especiales</h2>
            <button 
              onClick={() => onNavigate('catalog')}
              className="text-accent flex items-center gap-1"
            >
              Ver todo
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {specialOffers.map((product) => (
              <div key={product.id} className="relative">
                <div className="absolute top-2 left-2 bg-accent text-white px-2 py-1 rounded-full text-xs z-10">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </div>
                <ProductCard
                  {...product}
                  onAddToCart={() => onAddToCart(product)}
                  onViewDetails={() => onNavigate('detail', product)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
