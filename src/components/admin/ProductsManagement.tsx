import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Search, RefreshCw, X, Save, Upload } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface Product {
  id: number;
  image: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  status?: "Publicado" | "Borrador";
  stock?: string;
  marca?: string;
}

export function ProductsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Estado para el ARCHIVO
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Referencia al input oculto
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "General",
    stock: "Medio",
    color: "Varios",
    marca: "Genérica",
    provider: "Interno",
    image: "" 
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/products');
      if (!response.ok) throw new Error('Error');
      const data = await response.json();
      
      // Mapeo simple
      const formattedData = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        description: item.description,
        image: item.image_url,
        category: item.category || "General",
        status: "Publicado",
        stock: item.stock || "Disponible",
        marca: item.marca || "Genérica"
      }));
      setProducts(formattedData);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar?")) return;
    await fetch(`http://localhost:3001/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ name: "", price: "", category: "General", stock: "Medio", color: "Varios", marca: "Genérica", provider: "Interno", image: "" });
    setSelectedFile(null); // Limpiar archivo
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category || "General",
      stock: product.stock || "Medio",
      color: "Varios",
      marca: product.marca || "Genérica",
      provider: "Interno",
      image: product.image || ""
    });
    setSelectedFile(null); // Limpiar archivo nuevo
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // CAMBIO IMPORTANTE: Usamos FormData en lugar de JSON
    const dataToSend = new FormData();
    dataToSend.append("name", formData.name);
    dataToSend.append("price", formData.price);
    dataToSend.append("category", formData.category);
    dataToSend.append("stock", formData.stock);
    dataToSend.append("color", formData.color);
    dataToSend.append("marca", formData.marca);
    dataToSend.append("provider", formData.provider);
    // Si hay archivo nuevo, lo metemos. Si no, mandamos la URL vieja.
    if (selectedFile) {
      dataToSend.append("imageFile", selectedFile);
    } else {
      dataToSend.append("image", formData.image);
    }

    const url = editingId 
        ? `http://localhost:3001/api/products/${editingId}` 
        : 'http://localhost:3001/api/products';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        body: dataToSend // No lleva headers Content-Type, el navegador los pone solos
      });

      if (response.ok) {
        alert("¡Guardado con éxito!");
        setIsModalOpen(false);
        fetchProducts();
      } else {
        alert("Error al guardar");
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar la selección del archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Creamos una URL temporal para la vista previa
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-gray-900">Gestión de Productos</h1>
        <div className="flex gap-3">
            <button onClick={fetchProducts} className="p-3 bg-white border rounded-lg hover:bg-gray-50"><RefreshCw className="w-5 h-5" /></button>
            <button onClick={handleOpenCreate} className="flex gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90"><Plus className="w-5 h-5" /> Añadir Nuevo</button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <input type="text" placeholder="Buscar..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none" />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr><th className="px-6 py-4 text-left">Foto</th><th className="px-6 py-4 text-left">Nombre</th><th className="px-6 py-4 text-left">Precio</th><th className="px-6 py-4">Acciones</th></tr>
          </thead>
          <tbody className="divide-y">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => handleOpenEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-bold">{editingId ? "Editar" : "Nuevo"} Producto</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              
              {/* SELECCIÓN DE IMAGEN MEJORADA */}
              <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {formData.image ? (
                  <img src={formData.image} className="h-32 w-full object-contain rounded-lg" />
                ) : (
                  <div className="text-center text-gray-500">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Clic para subir imagen</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <input name="name" required value={formData.name} onChange={handleInputChange} placeholder="Nombre del producto" className="w-full px-3 py-2 border rounded-lg outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input name="price" type="number" required value={formData.price} onChange={handleInputChange} placeholder="Precio" className="w-full px-3 py-2 border rounded-lg outline-none" />
                <select name="stock" value={formData.stock} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg outline-none">
                  <option value="Alto">Alto</option><option value="Medio">Medio</option><option value="Bajo">Bajo</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-accent text-white rounded-lg hover:bg-accent/90 font-medium flex justify-center gap-2">
                <Save className="w-5 h-5" /> Guardar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}