import { useState, useEffect } from "react";
import { DollarSign, ShoppingBag, Receipt, PieChart as PieIcon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export function SalesReport() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/sales-report')
      .then(res => res.json())
      .then(result => {
        // Asegurar números
        const fixedData = {
            stats: {
                totalRevenue: Number(result.stats.totalRevenue || 0),
                totalOrders: Number(result.stats.totalOrders || 0),
                averageTicket: Number(result.stats.averageTicket || 0)
            },
            chartData: result.chartData.map((d: any) => ({
                day: d.day,
                ingresos: Number(d.ingresos)
            })),
            topProducts: result.topProducts.map((p: any) => ({
                name: p.name,
                value: Number(p.value)
            }))
        };
        
        // Rellenar gráfica de líneas si viene vacía
        if (fixedData.chartData.length === 0) {
             fixedData.chartData = [{ day: 'Hoy', ingresos: 0 }];
        }
        
        setData(fixedData);
      })
      .catch(err => console.error(err));
  }, []);

  if (!data) return <div className="p-10 text-center">Cargando datos...</div>;

  const { stats, chartData, topProducts } = data;
  const COLORS = ['#000000', '#4B5563', '#9CA3AF', '#D1D5DB', '#6B7280'];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reporte Financiero</h1>

      {/* TARJETAS DE RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-green-50 text-green-600 rounded-xl"><DollarSign className="w-6 h-6"/></div>
            <div><p className="text-gray-500 text-sm font-medium">Ingresos</p><h2 className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</h2></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><ShoppingBag className="w-6 h-6"/></div>
            <div><p className="text-gray-500 text-sm font-medium">Ventas</p><h2 className="text-3xl font-bold text-gray-900">{stats.totalOrders}</h2></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-xl"><Receipt className="w-6 h-6"/></div>
            <div><p className="text-gray-500 text-sm font-medium">Ticket Promedio</p><h2 className="text-3xl font-bold text-gray-900">${stats.averageTicket.toFixed(2)}</h2></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GRÁFICA DE LÍNEAS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6">Tendencia de Ingresos</h3>
            
            {/* CORRECCIÓN: Altura fija en style */}
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(val) => `$${val}`} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                        <Line 
                            type="monotone" 
                            dataKey="ingresos" 
                            stroke="#000000" 
                            strokeWidth={3} 
                            dot={{r:4, fill:'black'}} 
                            isAnimationActive={false} /* Desactivar animación para evitar glitches */
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* GRÁFICA DE PASTEL */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-2">Productos Top (Vista SQL)</h3>
            
            {/* CORRECCIÓN: Altura fija en style */}
            <div style={{ width: '100%', height: 300 }}>
                {topProducts && topProducts.length > 0 ? (
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie 
                                data={topProducts} 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={60} 
                                outerRadius={80} 
                                paddingAngle={5} 
                                dataKey="value"
                                isAnimationActive={false} /* Desactivar animación */
                            >
                                {topProducts.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => [`${value} Unidades`, 'Ventas']} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <PieIcon className="w-12 h-12 mb-2 opacity-20" />
                        <p>Sin datos suficientes</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}