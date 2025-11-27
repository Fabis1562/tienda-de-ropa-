import { useState } from "react";
import { Toaster } from "sonner";

// --- IMPORTACIONES CORREGIDAS (Verifica que las rutas coincidan con tus carpetas) ---
import { AdminLogin } from "./components/AdminLogin";
// Si AdminDashboard está en 'ui', usa esta. Si está en 'components', quita el '/ui'
import { AdminDashboard } from "./components/AdminDashboard"; 
import { CustomerHome } from "./components/CustomerHome";
import { ProductCatalog } from "./components/ProductCatalog";
import { ShoppingCart } from "./components/ShoppingCart";
import { ProductDetail } from "./components/ProductDetail";
import { Checkout } from "./components/Checkout";
import { CustomerAuth } from "./components/CustomerAuth";
// BottomNav también suele estar en 'ui' según tus capturas anteriores
import { BottomNav } from "./components/BottomNav"; 
// -------------------------------

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
  const [currentView, setCurrentView] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // ESTADOS PARA PERMISOS Y LOGIN
  const [userRole, setUserRole] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  
  // ESTADO PARA EL CLIENTE (Para saber si ya se registró antes de pagar)
  const [currentCustomer, setCurrentCustomer] = useState<string | null>(null);

  const navigateTo = (view: string, data?: any) => {
    if (data) setSelectedProduct(data);
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

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
      const existing = prev.find(item => item.id === newItem.id && item.size === size && item.color === color);
      if (existing) {
        return prev.map(item => (item.id === newItem.id && item.size === size && item.color === color) ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, newItem];
    });
    alert("Producto añadido al carrito"); 
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(item => item.id !== id));
  
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };
  
  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotal = cartTotal > 100 ? cartTotal : (cartTotal > 0 ? cartTotal + 5.99 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />

      {/* LOGIN ADMIN */}
      {currentView === "login" && (
        <AdminLogin onLogin={(role, allowedMenus) => {
          setUserRole(role);
          setPermissions(allowedMenus);
          navigateTo("admin");
        }} />
      )}

      {/* DASHBOARD ADMIN */}
      {currentView === "admin" && (
        <AdminDashboard 
          onLogout={() => {
            setUserRole("");
            setPermissions([]);
            navigateTo("home");
          }} 
          role={userRole}
          allowedMenus={permissions}
        />
      )}

      {/* TIENDA (HOME) */}
      {currentView === "home" && (
        <>
          <CustomerHome onNavigate={navigateTo} onAddToCart={addToCart} />
          <BottomNav active="home" onNavigate={navigateTo} cartCount={cart.length} />
        </>
      )}

      {/* CATÁLOGO */}
      {currentView === "catalog" && (
        <>
          <ProductCatalog onNavigate={navigateTo} onAddToCart={addToCart} />
          <BottomNav active="catalog" onNavigate={navigateTo} cartCount={cart.length} />
        </>
      )}

      {/* DETALLE PRODUCTO */}
      {currentView === "detail" && selectedProduct && (
        <ProductDetail product={selectedProduct} onNavigate={navigateTo} onAddToCart={addToCart} />
      )}

      {/* CARRITO */}
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

      {/* CHECKOUT (Con protección de Login de Cliente) */}
      {currentView === "checkout" && (
        currentCustomer ? (
          <Checkout 
            cart={cart} 
            total={finalTotal} 
            onNavigate={navigateTo} 
            onClearCart={clearCart} 
            customerName={currentCustomer} // Pasamos el nombre real
          />
        ) : (
          <CustomerAuth onSuccess={(name) => {
            setCurrentCustomer(name);
            // Al actualizarse el estado, React renderizará el Checkout automáticamente
          }} />
        )
      )}

      {/* PERFIL */}
      {currentView === "profile" && (
        <div className="p-6 min-h-screen bg-white pb-20">
          <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
          {currentCustomer ? (
             <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white text-2xl">👤</div>
                <div>
                  <h2 className="font-bold">{currentCustomer}</h2>
                  <p className="text-sm text-gray-500">Cliente Registrado</p>
                </div>
             </div>
          ) : (
             <p className="mb-4 text-gray-500">Inicia sesión para ver tus datos.</p>
          )}

          <button onClick={() => navigateTo("login")} className="w-full p-4 bg-gray-900 text-white rounded-xl flex items-center justify-center gap-2">
            Acceso Administrador
          </button>
          
          <BottomNav active="profile" onNavigate={navigateTo} cartCount={cart.length} />
        </div>
      )}
    </div>
  );
}

export default App;