import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  UserCog,
  Calendar,
  LogOut,
  ChevronRight,
  AlertCircle,
  Menu,
  X,
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
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const salesData = [
    { day: "Lun", ventas: 4500 },
    { day: "Mar", ventas: 5200 },
    { day: "Mié", ventas: 4800 },
    { day: "Jue", ventas: 6100 },
    { day: "Vie", ventas: 7300 },
    { day: "Sáb", ventas: 8500 },
    { day: "Dom", ventas: 7800 },
  ];

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "products", icon: Package, label: "Productos" },
    { id: "inventory", icon: ShoppingBag, label: "Inventario" },
    { id: "orders", icon: ShoppingBag, label: "Pedidos" },
    { id: "sales", icon: TrendingUp, label: "Ventas" },
    { id: "customers", icon: Users, label: "Clientes" },
    { id: "employees", icon: UserCog, label: "Empleados" },
    { id: "reservations", icon: Calendar, label: "Reservas" },
  ];

  const lowStockProducts = [
    { name: "Vestido Elegante", stock: 3 },
    { name: "Camisa Casual", stock: 5 },
    { name: "Jeans Premium", stock: 2 },
  ];

  const recentOrders = [
    { id: "#1234", customer: "María García", total: 149.99, status: "Pendiente" },
    { id: "#1235", customer: "Juan Pérez", total: 89.99, status: "Procesando" },
    { id: "#1236", customer: "Ana López", total: 199.99, status: "Enviado" },
  ];

  const stats = [
    { label: "Ventas del Día", value: "$8,500", change: "+12.5%", positive: true },
    { label: "Pedidos Pendientes", value: "24", change: "+3", positive: false },
    { label: "Productos Activos", value: "156", change: "+8", positive: true },
    { label: "Nuevas Reservas", value: "7", change: "+2", positive: true },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-gray-900">Admin Panel</h2>
              <p className="text-sm text-gray-600">Tienda de Ropa</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveSection(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
              <h1 className="text-gray-900">
                {menuItems.find((m) => m.id === activeSection)?.label || "Dashboard"}
              </h1>
            </div>
            <div className="text-right">
              <p className="text-gray-900">Administrador</p>
              <p className="text-sm text-gray-600">admin@tiendaropa.com</p>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeSection === "dashboard" && (
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                    <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                    <div className="flex items-end justify-between">
                      <h2 className="text-gray-900">{stat.value}</h2>
                      <span
                        className={`text-sm ${
                          stat.positive ? "text-green-600" : "text-gray-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts and Tables Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-gray-900 mb-4">Ventas de la Semana</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="ventas" fill="#ff6b6b" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Low Stock Alert */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <h3 className="text-gray-900">Pocas Existencias</h3>
                  </div>
                  <div className="space-y-3">
                    {lowStockProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <span className="text-gray-700">{product.name}</span>
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                          {product.stock} unidades
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Orders and New Reservations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900">Pedidos Recientes</h3>
                    <button className="text-accent flex items-center gap-1 hover:gap-2 transition-all">
                      Ver todos
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                        <div>
                          <p className="text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.customer}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900">${order.total}</p>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              order.status === "Enviado"
                                ? "bg-green-100 text-green-700"
                                : order.status === "Procesando"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* New Reservations */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900">Nuevas Reservas</h3>
                    <button className="text-accent flex items-center gap-1 hover:gap-2 transition-all">
                      Ver todas
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {["Vestido Elegante", "Camisa Formal", "Abrigo Invierno"].map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                        <div>
                          <p className="text-gray-900">{item}</p>
                          <p className="text-sm text-gray-600">Cliente #{1000 + index}</p>
                        </div>
                        <Calendar className="w-5 h-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "products" && (
            <div className="max-w-7xl mx-auto">
              <ProductsManagement />
            </div>
          )}

          {activeSection === "inventory" && (
            <div className="max-w-7xl mx-auto">
              <InventoryManagement />
            </div>
          )}

          {activeSection === "orders" && (
            <div className="max-w-7xl mx-auto">
              <OrdersManagement />
            </div>
          )}

          {activeSection === "sales" && (
            <div className="max-w-7xl mx-auto">
              <SalesReport />
            </div>
          )}

          {activeSection === "customers" && (
            <div className="max-w-7xl mx-auto">
              <CustomersManagement />
            </div>
          )}

          {activeSection === "employees" && (
            <div className="max-w-7xl mx-auto">
              <EmployeesManagement />
            </div>
          )}

          {activeSection === "reservations" && (
            <div className="max-w-7xl mx-auto">
              <ReservationsManagement />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
