import { Plus, Shield, Trash2 } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Vendedor" | "Gerente" | "Almacén";
  hireDate: string;
}

export function EmployeesManagement() {
  const employees: Employee[] = [
    {
      id: "E001",
      name: "Pedro González",
      email: "pedro.gonzalez@tiendaropa.com",
      role: "Admin",
      hireDate: "2024-01-10",
    },
    {
      id: "E002",
      name: "Sofía Ramírez",
      email: "sofia.ramirez@tiendaropa.com",
      role: "Gerente",
      hireDate: "2024-03-15",
    },
    {
      id: "E003",
      name: "Diego Morales",
      email: "diego.morales@tiendaropa.com",
      role: "Vendedor",
      hireDate: "2024-05-20",
    },
    {
      id: "E004",
      name: "Carmen Vega",
      email: "carmen.vega@tiendaropa.com",
      role: "Vendedor",
      hireDate: "2024-06-12",
    },
    {
      id: "E005",
      name: "Javier Hernández",
      email: "javier.hernandez@tiendaropa.com",
      role: "Almacén",
      hireDate: "2024-07-08",
    },
    {
      id: "E006",
      name: "Patricia Díaz",
      email: "patricia.diaz@tiendaropa.com",
      role: "Vendedor",
      hireDate: "2024-08-22",
    },
    {
      id: "E007",
      name: "Fernando Castro",
      email: "fernando.castro@tiendaropa.com",
      role: "Almacén",
      hireDate: "2024-09-15",
    },
  ];

  const getRoleColor = (role: Employee["role"]) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-700";
      case "Gerente":
        return "bg-blue-100 text-blue-700";
      case "Vendedor":
        return "bg-green-100 text-green-700";
      case "Almacén":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-gray-900">Gestión de Empleados</h1>
        <button className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
          <Plus className="w-5 h-5" />
          Añadir Nuevo Empleado
        </button>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-600 text-sm mb-1">Total Empleados</p>
            <h2 className="text-gray-900">{employees.length}</h2>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Administradores</p>
            <h2 className="text-gray-900">{employees.filter((e) => e.role === "Admin").length}</h2>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Vendedores</p>
            <h2 className="text-gray-900">{employees.filter((e) => e.role === "Vendedor").length}</h2>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Personal Almacén</p>
            <h2 className="text-gray-900">{employees.filter((e) => e.role === "Almacén").length}</h2>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-gray-700">ID Empleado</th>
                <th className="text-left px-6 py-4 text-gray-700">Nombre</th>
                <th className="text-left px-6 py-4 text-gray-700">Email</th>
                <th className="text-left px-6 py-4 text-gray-700">Puesto/Rol</th>
                <th className="text-left px-6 py-4 text-gray-700">Fecha de Contratación</th>
                <th className="text-left px-6 py-4 text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{employee.id}</td>
                  <td className="px-6 py-4 text-gray-900">{employee.name}</td>
                  <td className="px-6 py-4 text-gray-600">{employee.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${getRoleColor(employee.role)}`}>
                      {employee.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(employee.hireDate).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Shield className="w-4 h-4" />
                        Editar Permisos
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
