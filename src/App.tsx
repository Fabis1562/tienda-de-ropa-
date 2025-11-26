import { useState } from "react";
import { AdminLogin } from "./components/AdminLogin";
import { AdminDashboard } from "./components/AdminDashboard";
import { CustomerHome } from "./components/CustomerHome";
import { ProductCatalog } from "./components/ProductCatalog";
import { ShoppingCart } from "./components/ShoppingCart";
import { ProductDetail } from "./components/ProductDetail";
import { BottomNav } from './components/BottomNav';
import { Toaster } from "sonner"; // Para notificaciones bonitas

// Tipos para el carrito
interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

function App() {
  // Estado de navegación: 'home', 'catalog', 'cart', 'detail', 'admin', 'login'
  const [currentView, setCurrentView] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Estado del Carrito
  const [cart, setCart] = useState<CartItem[]>([]);

  // --- LÓGICA DE NAVEGACIÓN ---
  const navigateTo = (view: string, data?: any) => {
    if (data) setSelectedProduct(data);
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  // --- LÓGICA DEL CARRITO ---
  const addToCart = (product: any, quantity = 1, size = "M", color = "Negro") => {
    const newItem = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image_url || product.image,
      size,
      color,
      quantity
    };

    setCart((prev) => {
      // Si ya existe el producto con misma talla y color, sumamos cantidad
      const existing = prev.find(item => item.id === newItem.id && item.size === size && item.color === color);
      if (existing) {
        return prev.map(item => 
          (item.id === newItem.id && item.size === size && item.color === color)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, newItem];
    });
    
    // Pequeña notificación (opcional)
    alert("Producto añadido al carrito"); 
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  // --- RENDERIZADO DE VISTAS ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notificaciones */}
      <Toaster position="top-center" />

      {/* VISTA: LOGIN ADMIN */}
      {currentView === "login" && (
        <AdminLogin onLogin={() => navigateTo("admin")} />
      )}

      {/* VISTA: DASHBOARD ADMIN */}
      {currentView === "admin" && (
        <AdminDashboard onLogout={() => navigateTo("home")} />
      )}

      {/* VISTAS DE CLIENTE (TIENDA) */}
      {currentView === "home" && (
        <>
          <CustomerHome onNavigate={navigateTo} onAddToCart={addToCart} />
          <BottomNav active="home" onNavigate={navigateTo} cartCount={cart.length} />
        </>
      )}

      {currentView === "catalog" && (
        <>
          <ProductCatalog onNavigate={navigateTo} onAddToCart={addToCart} />
          <BottomNav active="catalog" onNavigate={navigateTo} cartCount={cart.length} />
        </>
      )}

      {currentView === "detail" && selectedProduct && (
        <ProductDetail 
          product={selectedProduct} 
          onNavigate={navigateTo} 
          onAddToCart={addToCart} 
        />
      )}

      {currentView === "cart" && (
        <>
          <ShoppingCart 
            cartItems={cart} 
            onNavigate={navigateTo} 
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
          />
          <BottomNav active="cart" onNavigate={navigateTo} cartCount={cart.length} />
        </>
      )}

      {/* VISTA: PERFIL (Botoncito para ir al Admin) */}
      {currentView === "profile" && (
        <div className="p-6 min-h-screen bg-white pb-20">
          <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
          {/* Aquí simulamos los datos del usuario */}
          <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white text-2xl">
              👤
            </div>
            <div>
              <h2 className="font-bold">Usuario Demo</h2>
              <p className="text-sm text-gray-500">cliente@tiendaropa.com</p>
            </div>
          </div>

          <div className="space-y-2">
            {/* BOTÓN SECRETO PARA IR AL LOGIN DE ADMIN */}
            <button 
              onClick={() => navigateTo("login")}
              className="w-full p-4 bg-gray-900 text-white rounded-xl flex items-center justify-center gap-2"
            >
              🔐 Acceso Administrador
            </button>
          </div>
          
          <BottomNav active="profile" onNavigate={navigateTo} cartCount={cart.length} />
        </div>
      )}
    </div>
  );
}

export default App;