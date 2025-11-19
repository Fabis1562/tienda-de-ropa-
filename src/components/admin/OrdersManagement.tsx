import { Package, Clock, Truck, CheckCircle } from "lucide-react";

interface Order {
  id: string;
  customerName: string;
  date: string;
  totalAmount: number;
  status: "Pendiente" | "Procesando" | "Enviado" | "Completado" | "Cancelado";
}

export function OrdersManagement() {
  const orders: Order[] = [
    {
      id: "#1234",
      customerName: "María García",
      date: "2025-11-09",
      totalAmount: 149.99,
      status: "Pendiente",
    },
    {
      id: "#1235",
      customerName: "Juan Pérez",
      date: "2025-11-09",
      totalAmount: 89.99,
      status: "Procesando",
    },
    {
      id: "#1236",
      customerName: "Ana López",
      date: "2025-11-08",
      totalAmount: 199.99,
      status: "Enviado",
    },
    {
      id: "#1237",
      customerName: "Carlos Rodríguez",
      date: "2025-11-08",
      totalAmount: 75.50,
      status: "Completado",
    },
    {
      id: "#1238",
      customerName: "Laura Martínez",
      date: "2025-11-07",
      totalAmount: 120.00,
      status: "Procesando",
    },
    {
      id: "#1239",
      customerName: "Roberto Sánchez",
      date: "2025-11-07",
      totalAmount: 99.99,
      status: "Cancelado",
    },
    {
      id: "#1240",
      customerName: "Isabel Torres",
      date: "2025-11-06",
      totalAmount: 159.99,
      status: "Enviado",
    },
    {
      id: "#1241",
      customerName: "Miguel Ángel",
      date: "2025-11-06",
      totalAmount: 220.00,
      status: "Completado",
    },
  ];

  const newOrders = orders.filter((o) => o.status === "Pendiente").length;
  const processingOrders = orders.filter((o) => o.status === "Procesando").length;
  const completedOrders = orders.filter((o) => o.status === "Completado").length;

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Pendiente":
        return "bg-amber-100 text-amber-700";
      case "Procesando":
        return "bg-blue-100 text-blue-700";
      case "Enviado":
        return "bg-green-100 text-green-700";
      case "Completado":
        return "bg-green-100 text-green-700";
      case "Cancelado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900">Gestión de Pedidos</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Pedidos Nuevos</p>
              <h2 className="text-gray-900">{newOrders}</h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Pedidos en Proceso</p>
              <h2 className="text-gray-900">{processingOrders}</h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Pedidos Completados</p>
              <h2 className="text-gray-900">{completedOrders}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-gray-700">ID Pedido</th>
                <th className="text-left px-6 py-4 text-gray-700">Nombre del Cliente</th>
                <th className="text-left px-6 py-4 text-gray-700">Fecha</th>
                <th className="text-left px-6 py-4 text-gray-700">Monto Total</th>
                <th className="text-left px-6 py-4 text-gray-700">Estatus del Pedido</th>
                <th className="text-left px-6 py-4 text-gray-700">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 text-gray-900">{order.customerName}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(order.date).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-gray-900">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="text-center text-gray-600">
        Mostrando {orders.length} pedidos
      </div>
    </div>
  );
}
