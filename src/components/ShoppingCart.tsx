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
    if (discountCode.toLowerCase() === "promo10") setAppliedDiscount(0.1);
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-5 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button onClick={() => onNavigate('home')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="flex-1 text-gray-900 font-bold text-lg">Carrito</h2>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {cartItems.length} arts
          </span>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="max-w-md mx-auto px-5 py-20 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-gray-900 text-xl font-bold mb-2">Tu carrito está vacío</h3>
          <button onClick={() => onNavigate('catalog')} className="mt-4 px-8 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors font-medium">
            Explorar Productos
          </button>
        </div>
      ) : (
        <div className="max-w-md mx-auto px-5 py-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Items */}
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                    <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <h3 className="text-gray-900 font-medium line-clamp-1">{item.name}</h3>
                        <p className="text-gray-500 text-xs mb-2">Talla: {item.size} • Color: {item.color}</p>
                    </div>
                    <div className="flex justify-between items-end">
                        <p className="text-gray-900 font-bold text-lg">${item.price.toFixed(2)}</p>
                        <button onClick={() => onRemoveItem(item.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                    <button onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                    <span className="text-gray-900 w-4 text-center font-medium text-sm">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                  </div>
                  <p className="text-gray-900 font-medium text-sm">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="text-gray-900 font-bold mb-4">Resumen del Pedido</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-medium">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Envío</span><span className="font-medium">{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Descuento</span><span>-${discount.toFixed(2)}</span></div>}
              <div className="border-t border-gray-100 pt-4 flex justify-between text-gray-900 mt-2"><span className="font-bold text-lg">Total</span><span className="font-bold text-lg">${total.toFixed(2)}</span></div>
            </div>
          </div>

          {/* BOTÓN CORRECTO: Solo navega al checkout */}
          <button 
            onClick={() => onNavigate('checkout')} 
            className="w-full py-4 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors font-bold text-lg shadow-xl shadow-accent/20 active:scale-[0.98]"
          >
            Proceder al Pago
          </button>
        </div>
      )}
    </div>
  );
}