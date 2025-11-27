import { useState, useEffect } from "react";
import { Plus, Shield, Trash2, User, X, Save } from "lucide-react";

interface Employee {
  id: string;
  realId: number;
  name: string;
  email: string;
  role: string;
  hireDate: string;
}

export function EmployeesManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Formulario para nuevo empleado
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    role: "Vendedor"
  });

  // --- CARGAR EMPLEADOS ---
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.39:3001/api/employees');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- GUARDAR NUEVO EMPLEADO ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://192.168.1.39:3001/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Empleado registrado con éxito");
        setIsModalOpen(false);
        setFormData({ name: "", username: "", password: "", role: "Vendedor" }); // Limpiar
        fetchEmployees();
      } else {
        alert("Error: El usuario ya existe o datos inválidos");
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  // --- ELIMINAR EMPLEADO ---
  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar a este empleado?")) return;
    try {
      await fetch(`http://192.168.1.39:3001/api/employees/${id}`, { method: 'DELETE' });
      fetchEmployees();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin": return "bg-purple-100 text-purple-700";
      case "Gerente": return "bg-blue-100 text-blue-700";
      case "Vendedor": return "bg-green-100 text-green-700";
      case "Almacén": return "bg-amber-100 text-amber-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-gray-900 font-bold text-2xl">Gestión de Empleados</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-5 h-5" /> Añadir Nuevo Empleado
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div><p className="text-gray-500 text-sm">Total Empleados</p><h2 className="text-2xl font-bold">{employees.length}</h2></div>
          <div><p className="text-gray-500 text-sm">Vendedores</p><h2 className="text-2xl font-bold">{employees.filter(e => e.role === 'Vendedor').length}</h2></div>
          <div><p className="text-gray-500 text-sm">Gerentes</p><h2 className="text-2xl font-bold">{employees.filter(e => e.role === 'Gerente').length}</h2></div>
          <div><p className="text-gray-500 text-sm">Almacén</p><h2 className="text-2xl font-bold">{employees.filter(e => e.role === 'Almacén').length}</h2></div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">ID</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">Nombre</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">Usuario (Login)</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">Rol</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? <tr><td colSpan={5} className="text-center py-8 text-gray-500">Cargando personal...</td></tr> :
               employees.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-gray-500">No hay empleados registrados.</td></tr> :
               employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900 font-medium">{employee.id}</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500"><User className="w-4 h-4" /></div>
                    {employee.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{employee.email.split('@')[0]}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(employee.role)}`}>
                      {employee.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Shield className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(employee.realId)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nuevo Empleado */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Nuevo Empleado</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input required className="w-full px-3 py-2 border rounded-lg outline-none focus:border-accent" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario (Para Login)</label>
                <input required className="w-full px-3 py-2 border rounded-lg outline-none focus:border-accent" 
                  value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input type="password" required className="w-full px-3 py-2 border rounded-lg outline-none focus:border-accent" 
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select className="w-full px-3 py-2 border rounded-lg outline-none"
                  value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="Vendedor">Vendedor</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Almacén">Almacén</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="w-full mt-2 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 font-medium flex justify-center gap-2">
                <Save className="w-5 h-5" /> Guardar Empleado
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}