import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export function ImageWithFallback({ src, alt, className, fallbackSrc = 'https://via.placeholder.com/300?text=Sin+Imagen', ...props }: Props) {
  const [error, setError] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {!error ? (
        <img
          src={src || fallbackSrc}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
          {...props}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
          <ImageOff className="h-1/3 w-1/3" />
        </div>
      )}
    </div>
  );
}