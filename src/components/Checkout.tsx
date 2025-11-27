import { useState } from "react";
import { ArrowLeft, CreditCard, Calendar, Lock, ShieldCheck } from "lucide-react";

interface CheckoutProps {
  cart: any[];
  total: number;
  onNavigate: (view: string) => void;
  onClearCart: () => void;
  customerName: string; // <--- 1. AQUÍ LO DEFINIMOS
}

// 2. AQUÍ LO RECIBIMOS (Agregamos customerName a la lista)
export function Checkout({ cart, total, onNavigate, onClearCart, customerName }: CheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(async () => {
      try {
        const response = await fetch('http://192.168.1.39:3001/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer: customerName, // <--- 3. AQUÍ LO USAMOS (Ya no da error)
            cart: cart,
            total: total
          })
        });

        if (response.ok) {
          const data = await response.json();
          alert(`✅ ¡Pago Aprobado!\nTu pedido #${data.orderId} está en camino.`);
          onClearCart(); 
          onNavigate('home'); 
        } else {
          alert("❌ Error: Pago rechazado por el servidor.");
        }
      } catch (error) {
        alert("❌ Error de conexión.");
      } finally {
        setLoading(false);
      }
    }, 2000); 
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-5 py-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button onClick={() => onNavigate('cart')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="font-bold text-lg text-gray-900">Pagar: {customerName}</h2>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 mt-6">
        {/* Tarjeta Visual */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
          <div className="flex justify-between items-start mb-8">
            <CreditCard className="w-8 h-8" />
            <span className="text-xs font-mono opacity-70">DEBIT</span>
          </div>
          <p className="font-mono text-xl tracking-widest mb-4">
            {cardData.number || "•••• •••• •••• ••••"}
          </p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs opacity-70 mb-1">TITULAR</p>
              <p className="font-medium uppercase">{cardData.name || "NOMBRE APELLIDO"}</p>
            </div>
            <div>
              <p className="text-xs opacity-70 mb-1">EXPIRA</p>
              <p className="font-medium">{cardData.expiry || "MM/AA"}</p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handlePayment} className="space-y-5 bg-white p-6 rounded-2xl shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Número de Tarjeta</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                name="number"
                maxLength={19}
                placeholder="0000 0000 0000 0000" 
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-accent outline-none"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Titular</label>
            <input 
              name="name"
              placeholder="Como aparece en la tarjeta" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-accent outline-none uppercase"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vencimiento</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  name="expiry"
                  maxLength={5}
                  placeholder="MM/AA" 
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-accent outline-none"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  name="cvv"
                  type="password"
                  maxLength={3}
                  placeholder="123" 
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-accent outline-none"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
              <span>Total a pagar:</span>
              <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? "Procesando..." : (
                <>
                  <ShieldCheck className="w-5 h-5" /> Pagar Ahora
                </>
              )}
            </button>
          </div>
        </form>
        
        <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" /> Pagos 100% Seguros y Encriptados
        </p>
      </div>
    </div>
  );
}