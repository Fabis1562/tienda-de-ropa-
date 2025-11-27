import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, ShoppingBag, Receipt } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export function SalesReport() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://192.168.1.39:3001/api/sales-report')
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      });
  }, []);

  if (loading || !data) return <div className="p-10 text-center">Calculando ganancias... 💰</div>;

  const { stats, chartData, topProducts } = data;
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      <h1 className="text-gray-900 font-bold text-2xl">Reporte de Ventas</h1>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg"><DollarSign /></div>
            <div>
                <p className="text-sm text-gray-500">Ingresos Totales</p>
                <h2 className="text-2xl font-bold">${Number(stats.totalRevenue || 0).toFixed(2)}</h2>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><ShoppingBag /></div>
            <div>
                <p className="text-sm text-gray-500">Pedidos Totales</p>
                <h2 className="text-2xl font-bold">{stats.totalOrders}</h2>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Receipt /></div>
            <div>
                <p className="text-sm text-gray-500">Ticket Promedio</p>
                <h2 className="text-2xl font-bold">${Number(stats.averageTicket || 0).toFixed(2)}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfica de Línea */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold mb-4">Ingresos por Día</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="ingresos" stroke="#2563eb" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </div>

        {/* Gráfica de Pastel (Top Productos) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold mb-4">Top Productos Vendidos</h3>
            <div className="flex items-center justify-center h-[300px]">
                {topProducts.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={topProducts} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label={({name}) => name}>
                                {topProducts.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-gray-400">Aún no hay datos suficientes</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}