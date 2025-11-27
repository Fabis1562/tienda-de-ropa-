import { useState } from "react";
import { User, Lock, Mail, ArrowRight } from "lucide-react";

interface CustomerAuthProps {
  onSuccess: (customerName: string) => void; // Cuando logre entrar, avisamos el nombre
}

export function CustomerAuth({ onSuccess }: CustomerAuthProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: "", username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const endpoint = isRegistering ? '/api/register-client' : '/api/login';
    
    try {
      const response = await fetch(`http://192.168.1.39:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();

      if (response.ok && data.success) {
        // Si es registro, intentamos loguear automáticamente o pedimos loguear
        if (isRegistering) {
            alert("¡Cuenta creada! Ahora inicia sesión.");
            setIsRegistering(false);
        } else {
            // Login exitoso
            onSuccess(data.user.name);
        }
      } else {
        setError(data.message || "Error en el proceso");
      }
    } catch (err) { setError("Error de conexión"); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {isRegistering ? "Crear Cuenta" : "Bienvenido de nuevo"}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {isRegistering ? "Regístrate para comprar rápido" : "Inicia sesión para continuar"}
          </p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input placeholder="Nombre Completo" required className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-accent/20" 
                  onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input placeholder="Usuario" required className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-accent/20"
              onChange={e => setFormData({...formData, username: e.target.value})} />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input type="password" placeholder="Contraseña" required className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-accent/20"
              onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>

          <button type="submit" className="w-full py-4 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
            {isRegistering ? "Registrarme" : "Entrar"} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsRegistering(!isRegistering)} className="text-sm text-gray-600 hover:text-black font-medium">
            {isRegistering ? "¿Ya tienes cuenta? Inicia Sesión" : "¿Nuevo aquí? Crea una cuenta"}
          </button>
        </div>
      </div>
    </div>
  );
}