import { useState, useEffect } from "react";
import { Package, Clock, Truck, CheckCircle, RefreshCw, Eye, X, Save } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface Order {
  id: string;
  realId: number;
  customerName: string;
  date: string;
  totalAmount: number;
  status: "Pendiente" | "Procesando" | "Enviado" | "Completado" | "Cancelado";
}

interface OrderDetail {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  // --- CARGAR PEDIDOS ---
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.39:3001/api/orders');
      if (response.ok) {
        const data = await response.json();
        const formatted = data.map((d: any) => ({
            ...d,
            realId: d.id.replace('#', '') 
        }));
        setOrders(formatted);
      }
    } catch (error) {
      console.error("Error cargando pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- VER DETALLES ---
  const handleViewDetails = async (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setLoadingDetails(true);
    
    try {
      const response = await fetch(`http://192.168.1.39:3001/api/orders/${order.realId}`);
      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data);
      }
    } catch (error) {
      alert("Error al cargar los productos del pedido");
    } finally {
      setLoadingDetails(false);
    }
  };

  // --- ACTUALIZAR ESTATUS ---
  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    try {
      const response = await fetch(`http://192.168.1.39:3001/api/orders/${selectedOrder.realId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert("Estatus actualizado correctamente");
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch (error) {
      alert("Error al actualizar");
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const newOrders = orders.filter((o) => o.status === "Pendiente").length;
  const processingOrders = orders.filter((o) => ["Procesando", "Enviado"].includes(o.status)).length;
  const completedOrders = orders.filter((o) => o.status === "Completado").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendiente": return "bg-amber-100 text-amber-700";
      case "Procesando": return "bg-blue-100 text-blue-700";
      case "Enviado": return "bg-indigo-100 text-indigo-700";
      case "Completado": return "bg-green-100 text-green-700";
      case "Cancelado": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-gray-900 font-bold text-2xl">Gestión de Pedidos</h1>
        <button onClick={fetchOrders} className="p-2 bg-white border rounded-lg hover:bg-gray-50 text-gray-600">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center"><Clock className="text-amber-600" /></div>
            <div><p className="text-sm text-gray-500">Pendientes</p><h2 className="text-2xl font-bold">{newOrders}</h2></div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Truck className="text-blue-600" /></div>
            <div><p className="text-sm text-gray-500">En Proceso</p><h2 className="text-2xl font-bold">{processingOrders}</h2></div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle className="text-green-600" /></div>
            <div><p className="text-sm text-gray-500">Completados</p><h2 className="text-2xl font-bold">{completedOrders}</h2></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">ID</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">Cliente</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">Fecha</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">Total</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">Estatus</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (<tr><td colSpan={6} className="text-center py-8 text-gray-500">Cargando...</td></tr>) : 
               orders.length === 0 ? (<tr><td colSpan={6} className="text-center py-8 text-gray-500">No hay pedidos.</td></tr>) : 
               orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{order.id}</td>
                    <td className="px-6 py-4">{order.customerName}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleViewDetails(order)} className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 flex items-center gap-2">
                        <Eye className="w-4 h-4" /> Ver
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detalles */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Pedido {selectedOrder.id}</h2>
                <p className="text-sm text-gray-500">{selectedOrder.customerName}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <label className="block text-sm font-medium text-blue-800 mb-2">Estatus del Pedido</label>
                <div className="flex gap-2">
                  <select 
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="flex-1 px-3 py-2 border border-blue-200 rounded-lg outline-none text-sm"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Procesando">Procesando</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Completado">Completado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                  <button onClick={handleUpdateStatus} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2">
                    <Save className="w-4 h-4" /> Actualizar
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-3">Productos</h3>
              {loadingDetails ? (<p className="text-center text-gray-500">Cargando...</p>) : (
                <div className="space-y-3">
                  {orderDetails.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                        <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Cant: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-900">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}