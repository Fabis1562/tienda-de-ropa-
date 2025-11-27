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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://192.168.1.39:3001/api/products")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((item: any) => ({
            ...item,
            price: Number(item.price),
            image_url: item.image_url || 'https://via.placeholder.com/300'
        }));
        setProducts(formatted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header Fijo */}
      <div className="bg-white px-5 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => onNavigate('home')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h2 className="flex-1 text-gray-900 font-bold text-lg">Catálogo</h2>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
              <SlidersHorizontal className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-100 rounded-full border-none outline-none focus:bg-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Grid de Productos */}
      <div className="max-w-md mx-auto px-5 mt-5">
        {loading ? (
           <p className="text-center text-gray-500 mt-10">Buscando en el almacén...</p>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-4 font-medium">
              {filteredProducts.length} resultados encontrados
            </p>
            <div className="grid grid-cols-2 gap-4 pb-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image_url} // Aquí está la magia
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