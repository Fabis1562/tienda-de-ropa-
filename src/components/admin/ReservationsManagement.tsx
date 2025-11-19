import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";

interface Reservation {
  id: string;
  customerName: string;
  productName: string;
  reservationDate: string;
  pickupDate: string;
  status: "Pendiente" | "Confirmada" | "Completada" | "Cancelada";
  amount: number;
}

export function ReservationsManagement() {
  const reservations: Reservation[] = [
    {
      id: "R001",
      customerName: "María García",
      productName: "Vestido Elegante",
      reservationDate: "2025-11-08",
      pickupDate: "2025-11-12",
      status: "Confirmada",
      amount: 89.99,
    },
    {
      id: "R002",
      customerName: "Juan Pérez",
      productName: "Camisa Formal",
      reservationDate: "2025-11-09",
      pickupDate: "2025-11-11",
      status: "Pendiente",
      amount: 54.99,
    },
    {
      id: "R003",
      customerName: "Ana López",
      productName: "Abrigo Invierno",
      reservationDate: "2025-11-07",
      pickupDate: "2025-11-10",
      status: "Completada",
      amount: 129.99,
    },
    {
      id: "R004",
      customerName: "Carlos Rodríguez",
      productName: "Jeans Premium",
      reservationDate: "2025-11-09",
      pickupDate: "2025-11-13",
      status: "Pendiente",
      amount: 79.99,
    },
    {
      id: "R005",
      customerName: "Laura Martínez",
      productName: "Sneakers Modernos",
      reservationDate: "2025-11-08",
      pickupDate: "2025-11-11",
      status: "Confirmada",
      amount: 99.99,
    },
    {
      id: "R006",
      customerName: "Roberto Sánchez",
      productName: "Bolso Elegante",
      reservationDate: "2025-11-06",
      pickupDate: "2025-11-09",
      status: "Cancelada",
      amount: 69.99,
    },
    {
      id: "R007",
      customerName: "Isabel Torres",
      productName: "Outfit Verano",
      reservationDate: "2025-11-09",
      pickupDate: "2025-11-14",
      status: "Pendiente",
      amount: 59.99,
    },
  ];

  const pendingReservations = reservations.filter((r) => r.status === "Pendiente").length;
  const confirmedReservations = reservations.filter((r) => r.status === "Confirmada").length;
  const completedReservations = reservations.filter((r) => r.status === "Completada").length;

  const getStatusColor = (status: Reservation["status"]) => {
    switch (status) {
      case "Pendiente":
        return "bg-amber-100 text-amber-700";
      case "Confirmada":
        return "bg-blue-100 text-blue-700";
      case "Completada":
        return "bg-green-100 text-green-700";
      case "Cancelada":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900">Gestión de Reservas</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Reservas Pendientes</p>
              <h2 className="text-gray-900">{pendingReservations}</h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Reservas Confirmadas</p>
              <h2 className="text-gray-900">{confirmedReservations}</h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Reservas Completadas</p>
              <h2 className="text-gray-900">{completedReservations}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-gray-700">ID Reserva</th>
                <th className="text-left px-6 py-4 text-gray-700">Cliente</th>
                <th className="text-left px-6 py-4 text-gray-700">Producto</th>
                <th className="text-left px-6 py-4 text-gray-700">Fecha Reserva</th>
                <th className="text-left px-6 py-4 text-gray-700">Fecha Recogida</th>
                <th className="text-left px-6 py-4 text-gray-700">Monto</th>
                <th className="text-left px-6 py-4 text-gray-700">Estado</th>
                <th className="text-left px-6 py-4 text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{reservation.id}</td>
                  <td className="px-6 py-4 text-gray-900">{reservation.customerName}</td>
                  <td className="px-6 py-4 text-gray-900">{reservation.productName}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(reservation.reservationDate).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(reservation.pickupDate).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-gray-900">${reservation.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {reservation.status === "Pendiente" && (
                        <>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Confirmar">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Cancelar">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {reservation.status === "Confirmada" && (
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          Marcar Completada
                        </button>
                      )}
                      {(reservation.status === "Completada" || reservation.status === "Cancelada") && (
                        <span className="text-gray-500 text-sm">Sin acciones</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="text-center text-gray-600">
        Mostrando {reservations.length} reservas
      </div>
    </div>
  );
}
