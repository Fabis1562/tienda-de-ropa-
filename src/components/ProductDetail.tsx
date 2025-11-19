import { useState } from "react";
import { ArrowLeft, Heart, Share2, Minus, Plus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ProductCard } from "./ProductCard";

interface ProductDetailProps {
  product: any;
  onNavigate: (view: string, data?: any) => void;
  onAddToCart: (product: any, quantity: number, size: string, color: string) => void;
}

export function ProductDetail({ product, onNavigate, onAddToCart }: ProductDetailProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Negro");
  const [quantity, setQuantity] = useState(1);

  const images = [product.image, product.image, product.image];
  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = [
    { name: "Negro", hex: "#000000" },
    { name: "Blanco", hex: "#FFFFFF" },
    { name: "Gris", hex: "#9CA3AF" },
    { name: "Azul", hex: "#3B82F6" },
  ];

  const relatedProducts = [
    {
      id: 101,
      name: "Camisa Casual",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1657405592096-0eb9199a8634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBzaGlydCUyMGZhc2hpb258ZW58MXx8fHwxNzYyNjM3MTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 102,
      name: "Jeans Premium",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1578693082747-50c396cacd81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjI2NzU5MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedSize, selectedColor);
  };

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header */}
      <div className="px-5 py-4 sticky top-0 z-10 bg-white/80 backdrop-blur-md flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors">
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors">
            <Heart className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative">
        <div className="aspect-square bg-gray-100">
          <ImageWithFallback
            src={images[currentImage]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImage ? 'bg-white w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-5 mt-5">
        {/* Product Info */}
        <div className="mb-6">
          <h1 className="text-gray-900 mb-2">{product.name}</h1>
          <p className="text-gray-900">${product.price.toFixed(2)}</p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-2">Descripción</h3>
          <p className="text-gray-600">
            {product.description || 
              "Prenda de alta calidad confeccionada con los mejores materiales. Perfecta para cualquier ocasión, combina estilo y comodidad de manera excepcional."}
          </p>
        </div>

        {/* Size Selector */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-3">Talla</h3>
          <div className="flex gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-12 rounded-lg border-2 transition-all ${
                  selectedSize === size
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selector */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-3">Color</h3>
          <div className="flex gap-3">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === color.name
                    ? 'border-accent scale-110'
                    : 'border-gray-200'
                }`}
                title={color.name}
              >
                <div
                  className="w-full h-full rounded-full"
                  style={{ backgroundColor: color.hex }}
                />
                {color.hex === "#FFFFFF" && (
                  <div className="absolute inset-0 rounded-full border border-gray-200" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-3">Cantidad</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-gray-300 transition-colors"
            >
              <Minus className="w-4 h-4 text-gray-700" />
            </button>
            <span className="text-gray-900 w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-gray-300 transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-4 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors"
          >
            Añadir al Carrito
          </button>
          <button className="flex-1 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors">
            Reservar
          </button>
        </div>

        {/* Related Products */}
        <div className="mb-6">
          <h2 className="text-gray-900 mb-4">Productos Relacionados</h2>
          <div className="grid grid-cols-2 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                {...relatedProduct}
                onAddToCart={() => onAddToCart(relatedProduct, 1, "M", "Negro")}
                onViewDetails={() => onNavigate('detail', relatedProduct)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
