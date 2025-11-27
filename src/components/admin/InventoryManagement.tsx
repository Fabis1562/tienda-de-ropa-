import { useState, useEffect } from "react";
import { Package, AlertTriangle } from "lucide-react";

export function InventoryManagement() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://192.168.1.39:3001/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Control de Inventario</h1>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-green-700">
            <h3 className="font-bold text-lg">Stock Alto</h3>
            <p className="text-3xl font-bold">{products.filter(p => p.stock === 'Alto').length}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-orange-700">
            <h3 className="font-bold text-lg">Stock Medio</h3>
            <p className="text-3xl font-bold">{products.filter(p => p.stock === 'Medio').length}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-700">
            <h3 className="font-bold text-lg">Stock Bajo</h3>
            <p className="text-3xl font-bold">{products.filter(p => p.stock === 'Bajo').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left">Producto</th>
              <th className="px-6 py-4 text-left">Precio</th>
              <th className="px-6 py-4 text-left">Nivel de Stock</th>
              <th className="px-6 py-4 text-left">Estatus</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{p.name}</td>
                <td className="px-6 py-4">${p.price}</td>
                <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold 
                        ${p.stock === 'Alto' ? 'bg-green-100 text-green-700' : 
                          p.stock === 'Medio' ? 'bg-orange-100 text-orange-700' : 
                          'bg-red-100 text-red-700'}`}>
                        {p.stock}
                    </span>
                </td>
                <td className="px-6 py-4 text-gray-500">Activo</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}