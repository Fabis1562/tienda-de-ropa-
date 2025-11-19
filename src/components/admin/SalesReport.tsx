import { useState } from "react";
import { DollarSign, TrendingUp, ShoppingBag, Receipt } from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function SalesReport() {
  const [dateRange, setDateRange] = useState("7days");

  const salesData = [
    { day: "3 Nov", ingresos: 4500 },
    { day: "4 Nov", ingresos: 5200 },
    { day: "5 Nov", ingresos: 4800 },
    { day: "6 Nov", ingresos: 6100 },
    { day: "7 Nov", ingresos: 7300 },
    { day: "8 Nov", ingresos: 8500 },
    { day: "9 Nov", ingresos: 7800 },
  ];

  const topProducts = [
    { name: "Vestidos", value: 35, color: "#ff6b6b" },
    { name: "Camisas", value: 25, color: "#4ecdc4" },
    { name: "Pantalones", value: 20, color: "#a78bfa" },
    { name: "Zapatos", value: 15, color: "#fbbf24" },
    { name: "Accesorios", value: 5, color: "#f472b6" },
  ];

  const stats = [
    {
      label: "Ingresos Totales",
      value: "$44,200",
      change: "+15.2%",
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Ventas Netas",
      value: "$39,780",
      change: "+12.8%",
      icon: TrendingUp,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Artículos Vendidos",
      value: "524",
      change: "+8.4%",
      icon: ShoppingBag,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Ticket Promedio",
      value: "$84.35",
      change: "+4.2%",
      icon: Receipt,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-gray-900">Reporte de Ventas</h1>
        
        {/* Date Range Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setDateRange("today")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              dateRange === "today"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Hoy
          </button>
          <button
            onClick={() => setDateRange("7days")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              dateRange === "7days"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Últimos 7 días
          </button>
          <button
            onClick={() => setDateRange("month")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              dateRange === "month"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Este Mes
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h2 className="text-gray-900">{stat.value}</h2>
                <span className="text-sm text-green-600">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-gray-900 mb-6">Ingresos por Día</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={salesData}>
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
            <Line
              type="monotone"
              dataKey="ingresos"
              stroke="#ff6b6b"
              strokeWidth={3}
              dot={{ fill: "#ff6b6b", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-900 mb-6">Productos Más Vendidos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topProducts}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {topProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products List */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-900 mb-6">Ranking de Productos</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg text-gray-900">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-900">{product.name}</span>
                    <span className="text-gray-600">{product.value}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${product.value}%`,
                        backgroundColor: product.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
