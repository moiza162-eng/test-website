import { useState, useEffect, FormEvent } from 'react';
import { Product, CartItem, LayoutSettings } from './types';
import { PRODUCTS, ACCENT_THEMES } from './data';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import SizeFinder from './components/SizeFinder';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import LayoutEditor from './components/LayoutEditor';
import CheckoutModal from './components/CheckoutModal';
import { ArrowDown, HelpCircle, CheckCircle, Flame, Mail, Sparkles } from 'lucide-react';

export default function App() {
  // Global cart management
  const [cart, setCart] = useState<CartItem[]>([]);

  // Layout presentation states
  const [layout, setLayout] = useState<LayoutSettings>({
    accent: 'sage',
    heroStyle: 'minimal',
    gridDensity: 'balanced',
    showHero: true,
    showSizeFinder: true,
  });

  // UI Open/Close panels flags
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLayoutEditorOpen, setIsLayoutEditorOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  // Success newsletter notification alert state
  const [joinedNewsletter, setJoinedNewsletter] = useState<boolean>(false);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');

  // Synchronize cart with localStorage for premium persistency
  useEffect(() => {
    const savedCart = localStorage.getItem('aether_cart_list');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error('Failed to parse cart local cache', err);
      }
    }
  }, []);

  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('aether_cart_list', JSON.stringify(updatedCart));
  };

  // Add Item to cart
  const handleAddToCart = (product: Product, size: string, color: string, qty: number = 1) => {
    const existingIndex = cart.findIndex(
      item =>
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    let updatedCart = [...cart];
    if (existingIndex !== -1) {
      updatedCart[existingIndex].quantity += qty;
    } else {
      updatedCart.push({
        product,
        selectedSize: size,
        selectedColor: color,
        quantity: qty,
      });
    }

    saveCartToStorage(updatedCart);
    setIsCartOpen(true); // Open the drawer immediately on add so they know it was processed
    setSelectedProduct(null); // Close quick view if any was open
  };

  // Update item quantity inside cart drawer
  const handleUpdateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    let updatedCart = [...cart];
    updatedCart[index].quantity = quantity;
    saveCartToStorage(updatedCart);
  };

  // Remove individual item from cart
  const handleRemoveCartItem = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    saveCartToStorage(updatedCart);
  };

  // Clear cart on complete simulated order
  const handleClearCart = () => {
    saveCartToStorage([]);
  };

  // Transition to checkout
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Newsletter submission validator
  const handleNewsletterJoin = (e: FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setJoinedNewsletter(true);
      setNewsletterEmail('');
      setTimeout(() => {
        setJoinedNewsletter(false);
      }, 5000);
    }
  };

  const accent = ACCENT_THEMES[layout.accent];

  return (
    <div className={`min-h-screen bg-white text-zinc-900 font-sans flex flex-col justify-between selection:bg-zinc-200`}>
      
      {/* Live Brand Layout Indicator flag for designers */}
      <div id="layout-indicator-banner" className={`bg-zinc-900 text-zinc-300 py-1.5 px-4 text-[10px] sm:text-xs text-center font-mono flex items-center justify-center space-x-1 sm:space-x-2`}>
        <span className="animate-pulse flex h-2 w-2 rounded-full bg-emerald-400"></span>
        <span>LAYOUT CUSTOMIZER IS ACTIVE: Current Theme is <strong>{layout.accent.toUpperCase()}</strong></span>
        <span>•</span>
        <button
          onClick={() => setIsLayoutEditorOpen(true)}
          className="underline hover:text-white font-bold transition-colors cursor-pointer"
        >
          Change layout & grids here
        </button>
      </div>

      {/* Main navigation */}
      <Navbar
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLayoutEditor={() => setIsLayoutEditorOpen(true)}
        layout={layout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Hero Header stage */}
      <Hero
        layout={layout}
        onExploreClick={() => {
          const catSec = document.getElementById('catalog-heading');
          if (catSec) {
            catSec.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenLayoutEditor={() => setIsLayoutEditorOpen(true)}
      />

      {/* Smart Body Size finder Recommendations */}
      <SizeFinder layout={layout} />

      {/* Primary Catalog Showcase */}
      <main className="flex-grow">
        <Catalog
          products={PRODUCTS}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          layout={layout}
          onSelectProduct={setSelectedProduct}
          onAddToCart={(prod, size, col) => handleAddToCart(prod, size, col, 1)}
        />
      </main>

      {/* Dynamic Designer Showcase area */}
      <section className="bg-zinc-50 border-t border-b border-zinc-200 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">AETHER WORKSPACE INSIGHT</span>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">Custom Built Layout System</h2>
          <p className="text-zinc-500 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Customize Aether's lookbook on the fly. Click the floating sliders option in the header navbar to explore column spacings, hero styles, and cozy earthy accents directly inside your browser window.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                setLayout({ ...layout, accent: 'terracotta' });
              }}
              className="px-4 py-2 text-xs font-semibold bg-orange-850 hover:bg-orange-950 text-white rounded-full transition-all"
            >
              Demo: Clay Terracotta Accent
            </button>
            <button
              onClick={() => {
                setLayout({ ...layout, heroStyle: 'editorial' });
              }}
              className="px-4 py-2 text-xs font-semibold bg-zinc-900 text-white rounded-full transition-all hover:bg-zinc-800"
            >
              Demo: Editorial Banner Layout
            </button>
          </div>
        </div>
      </section>

      {/* Sustainable Newsletter Signup Section */}
      <section className="bg-white py-16 px-4 max-w-4xl mx-auto w-full">
        <div className="border border-zinc-200 rounded-2xl p-8 bg-[radial-gradient(#00000008_1px,transparent_1px)] [background-size:16px_16px] text-center space-y-5">
          <Mail className="h-8 w-8 text-zinc-400 mx-auto" />
          <h3 className="text-lg font-bold text-zinc-900">Join the Slow Wardrobe Circles</h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Once monthly, we release extremely-limited capsule fabrics and loom updates. No noise, no marketing pitches. Zero tracking cookies.
          </p>

          <form onSubmit={handleNewsletterJoin} className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Your email address..."
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 text-xs px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:border-zinc-500"
            />
            <button
              type="submit"
              className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider ${accent.buttonClass} transition-colors`}
            >
              Subscribe
            </button>
          </form>

          {joinedNewsletter && (
            <div className="inline-flex items-center space-x-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 font-medium">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
              <span>You have joined perfectly! Welcome to our inner circle.</span>
            </div>
          )}
        </div>
      </section>

      {/* Luxury Footer bar */}
      <footer id="store-footer" className="border-t border-zinc-200 bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs font-sans text-zinc-500">
          
          <div className="space-y-3">
            <span className="font-bold text-zinc-900 uppercase tracking-widest text-[11px]">NOVA THREADS</span>
            <p className="leading-relaxed">
              Timeless silhouettes designed in collaboration with certified organic farms from Nara, Tokushima, and western Flanders.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-zinc-900 uppercase tracking-widest text-[11px]">Collections</span>
            <ul className="space-y-1.5">
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-zinc-900">Sartorial (Knits)</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-zinc-900">Atelier Home (Decor)</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-zinc-900">Objet Essential (Capsules)</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-zinc-900 uppercase tracking-widest text-[11px]">Layout Testing Tools</span>
            <ul className="space-y-1.5 font-mono text-[10px]">
              <li><button onClick={() => setLayout({...layout, gridDensity: 'compact'})} className="hover:text-zinc-950 block text-left">Set Grid: Compact 5 col</button></li>
              <li><button onClick={() => setLayout({...layout, gridDensity: 'spacious'})} className="hover:text-zinc-950 block text-left">Set Grid: Spacious 2 col</button></li>
              <li><button onClick={() => setLayout({...layout, accent: 'sage'})} className="hover:text-zinc-950 block text-left">Set Accent: Sage Field</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="font-bold text-zinc-900 uppercase tracking-wide text-[11px]">Ethics</span>
            <p>
              Certified 100% GOTS Organic cotton, low-impact discharge indigo dyeing cycles, solar powered looms, and audited ethical human wage compensation.
            </p>
          </div>

        </div>

        <div className="mx-auto max-w-7xl pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 font-sans">
          <span>&copy; 2026 Nova Threads Corporation. All layouts, graphics, and descriptions are designed to serve organic slow-apparel environments.</span>
          <div className="flex space-x-4 mt-3 sm:mt-0">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-zinc-800">Carbon Neutral Audits</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-zinc-800 font-medium">Layout Sandboxing rules</a>
          </div>
        </div>
      </footer>

      {/* FLOATING OVERLAY DIALOGS, SLIDES, AND MODALS */}

      {/* Product Information Detail overlay */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        layout={layout}
      />

      {/* Cart Drawer sliding pane */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleProceedToCheckout}
        layout={layout}
      />

      {/* Layout Editor customize toolbox */}
      <LayoutEditor
        isOpen={isLayoutEditorOpen}
        onClose={() => setIsLayoutEditorOpen(false)}
        settings={layout}
        onChangeSettings={setLayout}
      />

      {/* Checkout Multi-Step simulated wizard */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onClearCart={handleClearCart}
        layout={layout}
      />

    </div>
  );
}
