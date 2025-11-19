import { useState } from "react";
import { ArrowLeft, Minus, Plus, Trash2, Tag } from "lucide-react";
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
          <h2 className="flex-1 text-gray-900">Carrito</h2>
          <span className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'artículo' : 'artículos'}
          </span>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="max-w-md mx-auto px-5 py-20 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-gray-900 mb-2">Tu carrito está vacío</h3>
          <p className="text-gray-600 mb-6">
            Agrega algunos productos para comenzar a comprar
          </p>
          <button
            onClick={() => onNavigate('catalog')}
            className="px-8 py-3 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors"
          >
            Explorar Productos
          </button>
        </div>
      ) : (
        <div className="max-w-md mx-auto px-5 py-5">
          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Talla: {item.size} • Color: {item.color}
                    </p>
                    <p className="text-gray-900">${item.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors self-start"
                  >
                    <Trash2 className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-gray-300 transition-colors"
                    >
                      <Minus className="w-3 h-3 text-gray-700" />
                    </button>
                    <span className="text-gray-900 w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-gray-300 transition-colors"
                    >
                      <Plus className="w-3 h-3 text-gray-700" />
                    </button>
                  </div>
                  <p className="text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Discount Code */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-5 h-5 text-gray-500" />
              <h3 className="text-gray-900">Código de Descuento</h3>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ingresa tu código"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-100 rounded-lg border-none outline-none"
              />
              <button
                onClick={applyDiscount}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Aplicar
              </button>
            </div>
            {appliedDiscount > 0 && (
              <p className="mt-2 text-sm text-green-600">
                ✓ Descuento del {appliedDiscount * 100}% aplicado
              </p>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
            <h3 className="text-gray-900 mb-4">Resumen del Pedido</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button className="w-full py-4 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors">
            Proceder al Pago
          </button>
        </div>
      )}
    </div>
  );
}
