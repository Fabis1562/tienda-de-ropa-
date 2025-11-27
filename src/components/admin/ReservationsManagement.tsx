import { useState, useEffect } from "react";
import { Calendar, CheckCircle, XCircle } from "lucide-react";

export function ReservationsManagement() {
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://192.168.1.39:3001/api/reservations')
      .then(res => res.json())
      .then(data => setReservations(data));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendiente": return "bg-amber-100 text-amber-700";
      case "Confirmada": return "bg-blue-100 text-blue-700";
      case "Completada": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Gestión de Reservas</h1>
      {/* Aquí va tu tabla igual que antes, pero mapeando 'reservations' */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Cliente</th>
              <th className="px-6 py-4 text-left">Producto</th>
              <th className="px-6 py-4 text-left">Recogida</th>
              <th className="px-6 py-4 text-left">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {reservations.map((res) => (
              <tr key={res.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{res.id}</td>
                <td className="px-6 py-4">{res.customerName}</td>
                <td className="px-6 py-4">{res.productName}</td>
                <td className="px-6 py-4 text-gray-500">{new Date(res.pickupDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(res.status)}`}>
                        {res.status}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}