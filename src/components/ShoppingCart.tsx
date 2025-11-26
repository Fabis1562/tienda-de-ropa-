import { useState } from "react";
import { ArrowLeft, Minus, Plus, Trash2, Tag, ShoppingBag } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface ShoppingCartProps {
  cartItems: CartItem[];
  onNavigate: (view: string) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
}

export function ShoppingCart({ cartItems, onNavigate, onUpdateQuantity, onRemoveItem }: ShoppingCartProps) {
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 5.99;
  const discount = subtotal * appliedDiscount;
  const total = subtotal + shipping - discount;

  const applyDiscount = () => {
    if (discountCode.toLowerCase() === "bienvenido10") {
      setAppliedDiscount(0.1);
    } else if (discountCode.toLowerCase() === "verano20") {
      setAppliedDiscount(0.2);
    }
  };

  // --- AQUÍ ESTÁ LA FUNCIÓN DE PAGO CONECTADA AL BACKEND ---
  const handleCheckout = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: "Usuario Demo", // Aquí iría el nombre real si hubiera login de cliente
          cart: cartItems,
          total: total
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`¡Gracias por tu compra! Tu pedido #${result.orderId} ha sido registrado.`);
        
        // Lo ideal sería vaciar el carrito aquí, pero como el estado está en App.tsx, 
        // simplemente redirigimos al inicio.
        onNavigate('home'); 
        // (Nota: Para vaciar el carrito necesitarías pasar una función 'clearCart' desde App.tsx)
      } else {
        alert("Hubo un problema al procesar tu compra. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión. Asegúrate de que el backend esté corriendo.");
    }
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-5 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="flex-1 text-gray-900 font-bold text-lg">Carrito</h2>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {cartItems.length} {cartItems.length === 1 ? 'artículo' : 'artículos'}
          </span>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="max-w-md mx-auto px-5 py-20 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-gray-900 text-xl font-bold mb-2">Tu carrito está vacío</h3>
          <p className="text-gray-500 mb-8 max-w-[250px]">
            Parece que aún no has añadido nada. ¡Explora nuestro catálogo!
          </p>
          <button
            onClick={() => onNavigate('catalog')}
            className="px-8 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors font-medium shadow-lg shadow-accent/20"
          >
            Explorar Productos
          </button>
        </div>
      ) : (
        <div className="max-w-md mx-auto px-5 py-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <h3 className="text-gray-900 font-medium text-base leading-tight mb-1 line-clamp-1">{item.name}</h3>
                        <p className="text-gray-500 text-xs mb-2">
                        Talla: {item.size} • Color: {item.color}
                        </p>
                    </div>
                    <div className="flex justify-between items-end">
                        <p className="text-gray-900 font-bold text-lg">${item.price.toFixed(2)}</p>
                        <button
                            onClick={() => onRemoveItem(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-gray-900 w-4 text-center font-medium text-sm">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-gray-900 font-medium text-sm">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Discount Code */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-accent" />
              <h3 className="text-gray-900 font-medium text-sm">Código de Descuento</h3>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ingresa tu código"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-accent text-sm"
              />
              <button
                onClick={applyDiscount}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Aplicar
              </button>
            </div>
            {appliedDiscount > 0 && (
              <p className="mt-2 text-xs text-green-600 font-medium bg-green-50 p-2 rounded-lg inline-block">
                ✓ Descuento del {appliedDiscount * 100}% aplicado
              </p>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="text-gray-900 font-bold mb-4">Resumen del Pedido</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="font-medium">{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento</span>
                  <span className="font-medium">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-4 flex justify-between text-gray-900 mt-2">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button 
            onClick={handleCheckout}
            className="w-full py-4 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors font-bold text-lg shadow-xl shadow-accent/20 active:scale-[0.98]"
          >
            Proceder al Pago
          </button>
        </div>
      )}
    </div>
  );
}