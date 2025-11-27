import { useState, useEffect } from "react";
import { Search, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ProductCard } from "./ProductCard";

interface CustomerHomeProps {
  onNavigate: (view: string, data?: any) => void;
  onAddToCart: (product: any) => void;
}

interface DBProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string; // Viene del backend
  category: string;
}

export function CustomerHome({ onNavigate, onAddToCart }: CustomerHomeProps) {
  const [dbProducts, setDbProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos reales
  useEffect(() => {
    fetch('http://192.168.1.39:3001/api/products')
      .then(res => res.json())
      .then(data => {
        const formattedData = data.map((item: any) => ({
            ...item,
            price: Number(item.price),
            // Si la imagen no es un link web, asumimos que está en la carpeta del servidor
            image_url: item.image_url || 'https://via.placeholder.com/300?text=Sin+Foto'
        }));
        // Mostramos solo los últimos 4 para que se vea bonito
        setDbProducts(formattedData.slice(0, 4));
        setLoading(false);
      })
      .catch(err => {
        console.error("Error conectando al backend:", err);
        setLoading(false);
      });
  }, []);

  const categories = [
    { id: 1, name: "Vestidos", emoji: "👗" },
    { id: 2, name: "Camisas", emoji: "👔" },
    { id: 3, name: "Pantalones", emoji: "👖" },
    { id: 4, name: "Accesorios", emoji: "👜" },
  ];

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-5 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto">
          <h1 className="text-gray-900 mb-3 font-bold text-xl">Tienda de Ropa</h1>
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
        {/* Banner */}
        <div className="mt-5 relative rounded-2xl overflow-hidden h-48">
           <img 
src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"             alt="Banner" 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
             <h2 className="text-white text-2xl font-bold">Nueva Colección</h2>
           </div>
        </div>

        {/* Categorías */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900 font-bold">Categorías</h2>
            <button onClick={() => onNavigate('catalog')} className="text-accent text-sm font-medium flex items-center gap-1">
              Ver todo <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((category) => (
              <button key={category.id} onClick={() => onNavigate('catalog')} className="bg-white rounded-xl p-3 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all">
                <span className="text-2xl">{category.emoji}</span>
                <span className="text-[10px] font-medium text-gray-600">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Novedades (Desde la BD) */}
        <div className="mt-6 mb-8">
          <h2 className="text-gray-900 font-bold mb-4">Recién Llegados</h2>
          
          {loading ? (
            <div className="text-center py-10 text-gray-400">Cargando estilo...</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {dbProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image_url}
                  onAddToCart={() => onAddToCart(product)}
                  onViewDetails={() => onNavigate('detail', product)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}