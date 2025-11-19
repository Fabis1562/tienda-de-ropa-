import { Home, LayoutGrid, ShoppingCart, User } from "lucide-react";

interface BottomNavProps {
  active: string;
  onNavigate: (view: string) => void;
  cartCount?: number;
}

export function BottomNav({ active, onNavigate, cartCount = 0 }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'catalog', icon: LayoutGrid, label: 'Categorías' },
    { id: 'cart', icon: ShoppingCart, label: 'Carrito', badge: cartCount },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 z-50">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-1 relative"
            >
              <div className="relative">
                <Icon 
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-accent' : 'text-gray-500'
                  }`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs transition-colors ${
                isActive ? 'text-accent' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
