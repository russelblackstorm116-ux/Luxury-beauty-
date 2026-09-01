import React, { useState } from 'react';
import { ExternalLink, Share2, Tag, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { trackProductClick } from '../services/productsService';

interface ProductCardProps {
  product: Product;
  onShare: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onShare }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAmazonClick = () => {
    trackProductClick(product.id);
  };

  return (
    <article
      className="group flex flex-col bg-white rounded-2xl border border-stone-200/90 hover:border-stone-300 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-square bg-stone-100 overflow-hidden">
        {product.imageUrl && !imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-stone-200 animate-pulse" />
            )}
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-4 text-center">
            <ShoppingCart className="w-10 h-10 stroke-1 mb-2 text-stone-300" />
            <span className="text-xs font-medium text-stone-500">Product Image</span>
          </div>
        )}

        {/* Category Pill */}
        {product.category && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-900/80 text-white backdrop-blur-md shadow-sm">
              <Tag className="w-3 h-3" />
              {product.category}
            </span>
          </div>
        )}

        {/* Share Button Overlay */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onShare(product);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 shadow-sm backdrop-blur-md transition-transform active:scale-95"
          title="Share Product"
          aria-label={`Share ${product.name}`}
          id={`btn-share-product-${product.id}`}
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-bold text-stone-900 line-clamp-2 leading-snug group-hover:text-amber-700 transition-colors">
            {product.name}
          </h3>
        </div>

        {product.price && (
          <div className="mb-2.5">
            <span className="text-lg font-extrabold text-stone-900 tracking-tight">
              {typeof product.price === 'number'
                ? `$${product.price.toFixed(2)}`
                : product.price.startsWith('$') || product.price.startsWith('€') || product.price.startsWith('£')
                ? product.price
                : `$${product.price}`}
            </span>
          </div>
        )}

        {product.description && (
          <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-5 flex-1">
            {product.description}
          </p>
        )}

        {/* Amazon Call to Action Button */}
        <div className="mt-auto pt-2">
          <a
            href={product.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAmazonClick}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold text-sm tracking-wide shadow-sm hover:shadow transition-all duration-150"
            id={`btn-view-amazon-${product.id}`}
          >
            <span>View on Amazon</span>
            <ExternalLink className="w-4 h-4 stroke-[2.5]" />
          </a>
        </div>
      </div>
    </article>
  );
};
