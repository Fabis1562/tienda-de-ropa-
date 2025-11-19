import { useState } from "react";
import { Package, AlertTriangle, Save } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  currentQuantity: number;
  stockStatus: "En Stock" | "Poco Stock" | "Agotado";
}

export function InventoryManagement() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { id: "P001", name: "Vestido Elegante", currentQuantity: 15, stockStatus: "En Stock" },
    { id: "P002", name: "Camisa Casual", currentQuantity: 5, stockStatus: "Poco Stock" },
    { id: "P003", name: "Jeans Premium", currentQuantity: 2, stockStatus: "Poco Stock" },
    { id: "P004", name: "Abrigo Invierno", currentQuantity: 0, stockStatus: "Agotado" },
    { id: "P005", name: "Sneakers Modernos", currentQuantity: 20, stockStatus: "En Stock" },
    { id: "P006", name: "Bolso Elegante", currentQuantity: 8, stockStatus: "Poco Stock" },
    { id: "P007", name: "Outfit Verano", currentQuantity: 25, stockStatus: "En Stock" },
    { id: "P008", name: "Camisa Formal", currentQuantity: 0, stockStatus: "Agotado" },
  ]);

  const [adjustments, setAdjustments] = useState<{ [key: string]: number }>({});

  const totalValue = inventoryItems.reduce(
    (sum, item) => sum + item.currentQuantity * 65.99,
    0
  );

  const outOfStock = inventoryItems.filter((item) => item.stockStatus === "Agotado").length;
  const lowStock = inventoryItems.filter((item) => item.stockStatus === "Poco Stock").length;

  const handleAdjustmentChange = (id: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setAdjustments({ ...adjustments, [id]: numValue });
  };

  const handleSave = (id: string) => {
    const adjustment = adjustments[id] || 0;
    setInventoryItems(
      inventoryItems.map((item) => {
        if (item.id === id) {
          const newQuantity = item.currentQuantity + adjustment;
          let newStatus: "En Stock" | "Poco Stock" | "Agotado" = "En Stock";
          if (newQuantity === 0) newStatus = "Agotado";
          else if (newQuantity <= 5) newStatus = "Poco Stock";

          return { ...item, currentQuantity: newQuantity, stockStatus: newStatus };
        }
        return item;
      })
    );
    setAdjustments({ ...adjustments, [id]: 0 });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900">Gestión de Inventario</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Valor Total del Inventario</p>
              <h2 className="text-gray-900">${totalValue.toFixed(2)}</h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Poco Stock</p>
              <h2 className="text-gray-900">{lowStock} productos</h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Productos sin Stock</p>
              <h2 className="text-gray-900">{outOfStock} productos</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-gray-700">ID Producto</th>
                <th className="text-left px-6 py-4 text-gray-700">Nombre del Producto</th>
                <th className="text-left px-6 py-4 text-gray-700">Cantidad Actual</th>
                <th className="text-left px-6 py-4 text-gray-700">Estatus de Stock</th>
                <th className="text-left px-6 py-4 text-gray-700">Ajustar Cantidad</th>
                <th className="text-left px-6 py-4 text-gray-700">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventoryItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-gray-900">{item.currentQuantity}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${
                        item.stockStatus === "En Stock"
                          ? "bg-green-100 text-green-700"
                          : item.stockStatus === "Poco Stock"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.stockStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={adjustments[item.id] || ""}
                      onChange={(e) => handleAdjustmentChange(item.id, e.target.value)}
                      placeholder="0"
                      className="w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-accent transition-colors"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleSave(item.id)}
                      disabled={!adjustments[item.id]}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      Guardar
                    </button>
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
