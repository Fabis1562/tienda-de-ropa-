import { useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "./ProductCard";

interface ProductCatalogProps {
  onNavigate: (view: string, data?: any) => void;
  onAddToCart: (product: any) => void;
}

export function ProductCatalog({ onNavigate, onAddToCart }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const allProducts = [
    {
      id: 1,
      name: "Vestido Elegante",
      price: 89.99,
      category: "Vestidos",
      image: "https://images.unsplash.com/photo-1562182856-e39faab686d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGVsZWdhbnQlMjBkcmVzc3xlbnwxfHx8fDE3NjI2MjUwODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 2,
      name: "Camisa Casual",
      price: 49.99,
      category: "Camisas",
      image: "https://images.unsplash.com/photo-1657405592096-0eb9199a8634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBzaGlydCUyMGZhc2hpb258ZW58MXx8fHwxNzYyNjM3MTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 3,
      name: "Jeans Premium",
      price: 79.99,
      category: "Pantalones",
      image: "https://images.unsplash.com/photo-1578693082747-50c396cacd81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjI2NzU5MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 4,
      name: "Outfit Verano",
      price: 59.99,
      category: "Vestidos",
      image: "https://images.unsplash.com/photo-1761918994321-ceac89b08252?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBjbG90aGluZyUyMHN0eWxlfGVufDF8fHx8MTc2MjY3NTkwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 5,
      name: "Abrigo Invierno",
      price: 129.99,
      category: "Abrigos",
      image: "https://images.unsplash.com/photo-1645606491757-bac7cd8e55b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBjb2F0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NjI2NzU5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 6,
      name: "Sneakers Modernos",
      price: 99.99,
      category: "Zapatos",
      image: "https://images.unsplash.com/photo-1650320079970-b4ee8f0dae33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjI2NjAyNzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 7,
      name: "Bolso Elegante",
      price: 69.99,
      category: "Accesorios",
      image: "https://images.unsplash.com/photo-1569388330292-79cc1ec67270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzYyNjY4MDM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 8,
      name: "Camisa Formal",
      price: 54.99,
      category: "Camisas",
      image: "https://images.unsplash.com/photo-1657405592096-0eb9199a8634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBzaGlydCUyMGZhc2hpb258ZW58MXx8fHwxNzYyNjM3MTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-5 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => onNavigate('home')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h2 className="flex-1 text-gray-900">Productos</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-100 rounded-full border-none outline-none focus:bg-gray-200 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Filters (shown when showFilters is true) */}
      {showFilters && (
        <div className="bg-white px-5 py-4 shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {["Todos", "Vestidos", "Camisas", "Pantalones", "Accesorios", "Zapatos", "Abrigos"].map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap transition-colors text-gray-700"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="max-w-md mx-auto px-5 mt-5">
        <p className="text-gray-600 mb-4">
          {filteredProducts.length} productos encontrados
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={() => onAddToCart(product)}
              onViewDetails={() => onNavigate('detail', product)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
