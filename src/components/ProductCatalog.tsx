import { useState, useEffect } from "react";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "./ProductCard";

interface ProductCatalogProps {
  onNavigate: (view: string, data?: any) => void;
  onAddToCart: (product: any) => void;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url: string;
}

export function ProductCatalog({ onNavigate, onAddToCart }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        if (error instanceof Error) {
            setError(error.message);
        } else {
            setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handling image URLs, assuming 'image' for static and 'image_url' for fetched
  const getImageUrl = (product: any) => {
    return product.image_url || product.image;
  };

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
        {loading && <p>Loading products...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <>
            <p className="text-gray-600 mb-4">
              {filteredProducts.length} productos encontrados
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  image={getImageUrl(product)} // Pass the correct image URL
                  onAddToCart={() => onAddToCart(product)}
                  onViewDetails={() => onNavigate('detail', product)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
