import { Users, UserPlus, Eye } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  totalSpent: number;
}

export function CustomersManagement() {
  const customers: Customer[] = [
    {
      id: "C001",
      name: "María García",
      email: "maria.garcia@email.com",
      phone: "+34 612 345 678",
      registrationDate: "2025-01-15",
      totalSpent: 1249.99,
    },
    {
      id: "C002",
      name: "Juan Pérez",
      email: "juan.perez@email.com",
      phone: "+34 623 456 789",
      registrationDate: "2025-02-20",
      totalSpent: 879.50,
    },
    {
      id: "C003",
      name: "Ana López",
      email: "ana.lopez@email.com",
      phone: "+34 634 567 890",
      registrationDate: "2025-03-10",
      totalSpent: 2150.00,
    },
    {
      id: "C004",
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@email.com",
      phone: "+34 645 678 901",
      registrationDate: "2025-04-05",
      totalSpent: 650.25,
    },
    {
      id: "C005",
      name: "Laura Martínez",
      email: "laura.martinez@email.com",
      phone: "+34 656 789 012",
      registrationDate: "2025-05-12",
      totalSpent: 1580.75,
    },
    {
      id: "C006",
      name: "Roberto Sánchez",
      email: "roberto.sanchez@email.com",
      phone: "+34 667 890 123",
      registrationDate: "2025-06-18",
      totalSpent: 425.00,
    },
    {
      id: "C007",
      name: "Isabel Torres",
      email: "isabel.torres@email.com",
      phone: "+34 678 901 234",
      registrationDate: "2025-07-22",
      totalSpent: 990.50,
    },
    {
      id: "C008",
      name: "Miguel Ángel Ruiz",
      email: "miguel.ruiz@email.com",
      phone: "+34 689 012 345",
      registrationDate: "2025-10-01",
      totalSpent: 320.00,
    },
  ];

  const totalCustomers = customers.length;
  const newCustomersThisMonth = customers.filter((c) => {
    const regDate = new Date(c.registrationDate);
    const now = new Date();
    return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900">Gestión de Clientes</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Clientes Totales</p>
              <h2 className="text-gray-900">{totalCustomers}</h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Nuevos Clientes (Este Mes)</p>
              <h2 className="text-gray-900">{newCustomersThisMonth}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-gray-700">ID Cliente</th>
                <th className="text-left px-6 py-4 text-gray-700">Nombre</th>
                <th className="text-left px-6 py-4 text-gray-700">Email</th>
                <th className="text-left px-6 py-4 text-gray-700">Teléfono</th>
                <th className="text-left px-6 py-4 text-gray-700">Fecha de Registro</th>
                <th className="text-left px-6 py-4 text-gray-700">Total Gastado</th>
                <th className="text-left px-6 py-4 text-gray-700">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{customer.id}</td>
                  <td className="px-6 py-4 text-gray-900">{customer.name}</td>
                  <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                  <td className="px-6 py-4 text-gray-600">{customer.phone}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(customer.registrationDate).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-gray-900">${customer.totalSpent.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                      <Eye className="w-4 h-4" />
                      Ver Perfil
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
        Mostrando {customers.length} clientes
      </div>
    </div>
  );
}
