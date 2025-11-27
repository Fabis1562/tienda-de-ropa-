import { useState, useEffect } from "react";
import {
  LayoutDashboard, Package, ShoppingBag, TrendingUp, Users, UserCog, Calendar, LogOut, Menu, X, AlertCircle
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ProductsManagement } from "./admin/ProductsManagement";
import { InventoryManagement } from "./admin/InventoryManagement";
import { OrdersManagement } from "./admin/OrdersManagement";
import { SalesReport } from "./admin/SalesReport";
import { CustomersManagement } from "./admin/CustomersManagement";
import { EmployeesManagement } from "./admin/EmployeesManagement";
import { ReservationsManagement } from "./admin/ReservationsManagement";

interface AdminDashboardProps {
  onLogout: () => void;
  role: string;
  allowedMenus: string[];
}

export function AdminDashboard({ onLogout, role, allowedMenus }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // ESTADOS PARA DATOS REALES
  const [stats, setStats] = useState({
    sales: 0,
    pendingOrders: 0,
    totalProducts: 0,
    lowStock: 0
  });
  const [salesData, setSalesData] = useState<any[]>([]);

  // --- CARGAR DATOS DEL DASHBOARD ---
// ... dentro de AdminDashboard ...

  // --- CARGAR DATOS DEL DASHBOARD ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resOrders, resProducts] = await Promise.all([
          fetch('http://192.168.1.39:3001/api/orders'),
          fetch('http://192.168.1.39:3001/api/products')
        ]);

        const orders = await resOrders.json();
        const products = await resProducts.json();

        // Calcular totales (ESTO YA LO TIENES)
        const totalSales = orders.reduce((acc: number, order: any) => acc + Number(order.totalAmount), 0);
        const pending = orders.filter((o: any) => o.status === 'Pendiente').length;
        const low = products.filter((p: any) => p.stock === 'Bajo').length;

        setStats({
          sales: totalSales,
          pendingOrders: pending,
          totalProducts: products.length,
          lowStock: low
        });

        // --- AQUÍ PEGAS EL CÓDIGO NUEVO (Reemplaza el setSalesData anterior) ---
        
        // 1. Inicializamos los días vacíos
        const ventasPorDia = [
            { day: "Lun", ventas: 0 },
            { day: "Mar", ventas: 0 },
            { day: "Mié", ventas: 0 },
            { day: "Jue", ventas: 0 },
            { day: "Vie", ventas: 0 },
        ];

        // 2. Sumamos las ventas reales
        orders.forEach((order: any) => {
            // Truco para la demo: Sumamos todo al último día (Viernes) para que se vea la barra
            // (En un sistema real usaríamos order.fecha para saber qué día fue)
            ventasPorDia[4].ventas += Number(order.totalAmount);
        });

        setSalesData(ventasPorDia);
        // -----------------------------------------------------------------------

      } catch (error) {
        console.error("Error cargando dashboard", error);
      }
    };

    fetchData();
  }, []);

  const allMenuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "products", icon: Package, label: "Productos" },
    { id: "inventory", icon: ShoppingBag, label: "Inventario" },
    { id: "orders", icon: ShoppingBag, label: "Pedidos" },
    { id: "sales", icon: TrendingUp, label: "Ventas" },
    { id: "customers", icon: Users, label: "Clientes" },
    { id: "employees", icon: UserCog, label: "Empleados" },
    { id: "reservations", icon: Calendar, label: "Reservas" },
  ];

  const visibleMenuItems = allMenuItems.filter(item => allowedMenus.includes(item.id));

  useEffect(() => {
    if (visibleMenuItems.length > 0 && !visibleMenuItems.find(m => m.id === activeSection)) {
      setActiveSection(visibleMenuItems[0].id);
    }
  }, [allowedMenus]);

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-gray-900 font-bold">Panel {role}</h2>
              <p className="text-sm text-gray-600">Tienda de Ropa</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X className="w-5 h-5" /></button>
          </div>
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {visibleMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === item.id ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}>
                      <Icon className="w-5 h-5" /> <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" /> <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 overflow-auto p-6">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden mb-4"><Menu className="w-6 h-6" /></button>
        
        {activeSection === "dashboard" && (
            <div className="max-w-7xl mx-auto space-y-6">
                {/* TARJETAS DE RESUMEN REALES */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm">Ventas Totales</p>
                        <h2 className="text-2xl font-bold text-gray-900">${stats.sales.toFixed(2)}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm">Pedidos Pendientes</p>
                        <h2 className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm">Productos Activos</p>
                        <h2 className="text-2xl font-bold text-blue-600">{stats.totalProducts}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm">Stock Bajo</p>
                        <h2 className="text-2xl font-bold text-red-600">{stats.lowStock}</h2>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4">Tendencia de Ventas</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="ventas" fill="#111827" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )}

        {activeSection === "products" && <ProductsManagement />}
        {activeSection === "inventory" && <InventoryManagement />}
        {activeSection === "orders" && <OrdersManagement />}
        {activeSection === "sales" && <SalesReport />}
        {activeSection === "customers" && <CustomersManagement />}
        {activeSection === "employees" && <EmployeesManagement />}
        {activeSection === "reservations" && <ReservationsManagement />}
      </div>
    </div>
  );
}