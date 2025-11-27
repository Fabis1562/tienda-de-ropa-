import { useState, useEffect } from "react";
import { Users, Mail, Phone, Calendar, DollarSign, RefreshCw } from "lucide-react";

export function CustomersManagement() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para pedir los clientes al backend
  const fetchCustomers = () => {
    setLoading(true);
    fetch('http://192.168.1.39:3001/api/customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Cartera de Clientes</h1>
        <button onClick={fetchCustomers} className="p-2 bg-white border rounded-lg hover:bg-gray-50 text-gray-600">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {/* Tarjeta Resumen */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 w-full md:w-1/3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Clientes Activos</p>
            <h2 className="text-2xl font-bold">{customers.length}</h2>
          </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">Nombre</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">Última Compra</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">Total Gastado</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
               <tr><td colSpan={4} className="text-center py-8 text-gray-500">Cargando clientes...</td></tr>
            ) : customers.length === 0 ? (
               <tr><td colSpan={4} className="text-center py-8 text-gray-500">Aún no hay clientes con compras registradas.</td></tr>
            ) : (
                customers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {c.name.substring(0, 2).toUpperCase()}
                      </div>
                      {c.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                        {new Date(c.lastOrder).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-green-600">
                        ${Number(c.totalSpent).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                        <button className="text-blue-600 hover:underline text-sm">Ver Historial</button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}