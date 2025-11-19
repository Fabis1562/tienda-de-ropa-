import { useState } from "react";
import { CustomerHome } from "./components/CustomerHome";
import { ProductCatalog } from "./components/ProductCatalog";
import { ProductDetail } from "./components/ProductDetail";
import { ShoppingCart } from "./components/ShoppingCart";
import { AdminLogin } from "./components/AdminLogin";
import { AdminDashboard } from "./components/AdminDashboard";
import { BottomNav } from "./components/BottomNav";
import { toast, Toaster } from "sonner@2.0.3";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

type ViewType = 'home' | 'catalog' | 'detail' | 'cart' | 'profile' | 'admin-login' | 'admin-dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const handleNavigate = (view: string, data?: any) => {
    if (view === 'detail' && data) {
      setSelectedProduct(data);
    }
    setCurrentView(view as ViewType);
  };

  const handleAddToCart = (product: any, quantity: number = 1, size: string = "M", color: string = "Negro") => {
    const existingItemIndex = cartItems.findIndex(
      item => item.id === product.id && item.size === size && item.color === color
    );

    if (existingItemIndex >= 0) {
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += quantity;
      setCartItems(updatedCart);
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size,
          color,
          quantity,
        },
      ]);
    }

    toast.success("Producto añadido al carrito", {
      description: `${product.name} - Talla ${size}`,
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.success("Producto eliminado del carrito");
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    setCurrentView('admin-dashboard');
    toast.success("Sesión iniciada correctamente");
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentView('home');
    toast.success("Sesión cerrada");
  };

  // Admin views (no bottom navigation)
  if (currentView === 'admin-login') {
    return (
      <>
        <AdminLogin onLogin={handleAdminLogin} />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  if (currentView === 'admin-dashboard' && isAdminAuthenticated) {
    return (
      <>
        <AdminDashboard onLogout={handleAdminLogout} />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  // Customer views (with bottom navigation)
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {currentView === 'home' && (
          <CustomerHome
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentView === 'catalog' && (
          <ProductCatalog
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentView === 'detail' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentView === 'cart' && (
          <ShoppingCart
            cartItems={cartItems}
            onNavigate={handleNavigate}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        )}

        {currentView === 'profile' && (
          <div className="pb-20 bg-gray-50 min-h-screen">
            <div className="max-w-md mx-auto px-5 py-6">
              <h1 className="text-gray-900 mb-6">Mi Perfil</h1>
              
              <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent to-pink-400 rounded-full flex items-center justify-center text-white">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div>
                    <h2 className="text-gray-900">Usuario Demo</h2>
                    <p className="text-gray-600">cliente@tiendaropa.com</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                    📦 Mis Pedidos
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                    ❤️ Favoritos
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                    📍 Direcciones
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                    💳 Métodos de Pago
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                    ⚙️ Configuración
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleNavigate('admin-login')}
                className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                🔐 Acceso Administrador
              </button>
            </div>
          </div>
        )}

        <BottomNav
          active={currentView}
          onNavigate={handleNavigate}
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        />
      </div>
      
      <Toaster position="top-center" richColors />
    </>
  );
}
