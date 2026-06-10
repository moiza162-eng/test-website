import { useState, useEffect } from 'react';
import { Product, LayoutSettings } from '../types';
import { ACCENT_THEMES } from '../data';
import { X, Star, Sparkles, Heart, RefreshCw, ThumbsUp } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  layout: LayoutSettings;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  layout
}: ProductDetailModalProps) {
  const accent = ACCENT_THEMES[layout.accent];

  // Selected state options
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'info' | 'fabric' | 'reviews'>('info');

  // Sync state options when product matches change
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'M');
      setSelectedColor(product.colors[0] || '#18181b');
      setQuantity(1);
      setIsFavorite(false);
      setActiveTab('info');
    }
  }, [product]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
  };

  // Helper reviews generator based on product rating
  const mockReviews = [
    { name: 'Sarah L.', rating: 5, date: '2 weeks ago', comment: 'Absolutely divine fabric weight. Holds its drape even after double washes. Highly recommend matching with stone-gray aesthetic trousers!' },
    { name: 'Kenji Y.', rating: 4, date: '1 month ago', comment: 'The wool construction is top grade. Fits slightly on the looser oversized side so order true-to-size. Colors look incredibly earthy in warm natural light.' }
  ];

  return (
    <div id="product-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
      <div
        id="product-modal-content"
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
      >
        {/* Close Button overlay */}
        <button
          id="btn-close-modal"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 text-zinc-400 hover:text-zinc-900 bg-white/80 hover:bg-white rounded-full transition-all border border-zinc-200"
          title="Close details"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Visual Media Showcase */}
        <div className="w-full md:w-1/2 bg-zinc-50 relative flex items-center justify-center min-h-[300px] md:min-h-0">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover max-h-[400px] md:max-h-full"
          />
          
          <div className="absolute bottom-4 left-4 flex gap-1.5">
            <span className="bg-white/95 backdrop-blur text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded border border-zinc-150 text-zinc-800">
              {product.category}
            </span>
            {!product.inStock && (
              <span className="bg-red-600 text-white text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Detailed Description panel */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between max-h-[50vh] md:max-h-full">
          <div>
            
            {/* Upper Metadata */}
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Atelier Capsule Series</span>
              <div className="flex items-center text-xs text-yellow-600 font-semibold bg-yellow-50 px-2 py-0.5 rounded">
                <Star className="h-3 w-3 fill-current mr-1" />
                <span>{product.rating} Stars</span>
              </div>
            </div>

            <h2 id="modal-product-name" className="text-2xl font-bold text-zinc-900 tracking-tight font-sans">
              {product.name}
            </h2>

            <div className="text-xl font-bold text-zinc-900 mt-2">
              £{product.price}
            </div>

            {/* TAB INTERACTORS */}
            <div className="flex border-b border-zinc-150 mt-6 space-x-4">
              <button
                onClick={() => setActiveTab('info')}
                className={`pb-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'info' ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-700'
                }`}
              >
                Story
              </button>
              <button
                onClick={() => setActiveTab('fabric')}
                className={`pb-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'fabric' ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-700'
                }`}
              >
                Materials
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'reviews' ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-700'
                }`}
              >
                Reviews ({mockReviews.length})
              </button>
            </div>

            {/* TAB OUTCOMES */}
            <div className="py-4 min-h-[140px] text-xs text-zinc-650 leading-relaxed font-sans">
              {activeTab === 'info' && (
                <p id="tab-story-content">{product.description}</p>
              )}
              {activeTab === 'fabric' && (
                <div id="tab-fabric-content" className="space-y-3">
                  <div>
                    <span className="font-semibold text-zinc-800 block">Composition:</span>
                    <p>{product.fabric}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-800 block">Care Guidelines:</span>
                    <p>{product.care}</p>
                  </div>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div id="tab-reviews-content" className="space-y-4">
                  {mockReviews.map((rev, idx) => (
                    <div key={idx} className="border-b border-zinc-100 pb-3 last:border-0">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-zinc-800">{rev.name}</span>
                        <span className="text-zinc-400">{rev.date}</span>
                      </div>
                      <div className="flex items-center text-yellow-600 mb-1">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="h-2.5 w-2.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-zinc-500 italic text-[11px] leading-snug">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PRODUCT CONFIGURATION SWITCHERS */}
            {product.inStock && (
              <div className="space-y-4 pt-4 border-t border-zinc-100">
                
                {/* Select Size Option */}
                {product.sizes.length > 0 && product.sizes[0] !== 'O/S' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-zinc-800">
                      <span>Selected Fit Size</span>
                      <span className="font-mono text-zinc-500 uppercase">{selectedSize}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[40px] h-10 px-2.5 text-xs font-mono font-bold rounded-lg border flex items-center justify-center transition-all ${
                            selectedSize === size
                              ? 'border-zinc-900 bg-zinc-900 text-white'
                              : 'border-zinc-200 hover:border-zinc-400 text-zinc-700 bg-white'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Select Color Option */}
                {product.colors.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-zinc-800">
                      <span>Artisan Palette Tone</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {product.colors.map(col => (
                        <button
                          key={col}
                          onClick={() => setSelectedColor(col)}
                          style={{ backgroundColor: col }}
                          className={`h-7 w-7 rounded-full border border-zinc-300 ring-offset-2 transition-all ${
                            selectedColor === col ? 'ring-2 ring-zinc-950 scale-110' : 'hover:scale-105'
                          }`}
                          title={`Color shade block`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Selector Quantity count */}
                <div className="space-y-1.5">
                  <span className="block text-xs font-semibold text-zinc-800">Order Quantity</span>
                  <div className="flex items-center space-x-3 bg-zinc-100 rounded-lg p-1 w-28">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 flex items-center justify-center text-zinc-700 bg-white hover:bg-zinc-100 rounded shadow-xs transition-colors"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-mono font-bold text-xs text-zinc-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-zinc-700 bg-white hover:bg-zinc-100 rounded shadow-xs transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* LOWER OPERATIONAL BUTTONS BAR */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-zinc-150">
            <button
              id="btn-add-to-cart-modal"
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`flex-1 py-3 px-6 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xs ${
                product.inStock
                  ? accent.buttonClass + ' active:scale-98'
                  : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
              }`}
            >
              {product.inStock ? `Add to Cart • £${(product.price * quantity).toFixed(2)}` : 'Sold Out at Atelier'}
            </button>
            
            <button
              id="btn-favorite-item"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-3 rounded-full border border-zinc-200 transition-colors flex items-center justify-center ${
                isFavorite ? 'bg-red-50 text-red-650 border-red-250' : 'bg-white text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
              title="Add current item to wish-list"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
