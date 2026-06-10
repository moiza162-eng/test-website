import { Search, ShoppingBag, Sliders, Info, ShoppingCart } from 'lucide-react';
import { CartItem, LayoutSettings } from '../types';
import { ACCENT_THEMES } from '../data';

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenLayoutEditor: () => void;
  layout: LayoutSettings;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export default function Navbar({
  cart,
  onOpenCart,
  onOpenLayoutEditor,
  layout,
  searchQuery,
  setSearchQuery
}: NavbarProps) {
  const accent = ACCENT_THEMES[layout.accent];
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header id="store-header" className="sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand identity */}
        <div className="flex items-center space-x-6">
          <a
            id="brand-logo"
            href="#"
            className="select-none hover:opacity-95 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              setSearchQuery('');
            }}
          >
            <div className="flex items-center space-x-0.5 font-sans text-xl font-bold tracking-tight uppercase">
              <span className="text-[#838a4d]">NOVA</span>
              <span className="text-[#c2bc9e] inline-flex items-center">
                <span>THR</span>
                {/* Custom E with three horizontal lines matching the logo precisely */}
                <span className="inline-flex flex-col justify-between h-[11px] w-[9px] mx-[1.5px] translate-y-[-0.5px] shrink-0">
                  <span className="h-[2px] w-full bg-[#c2bc9e]"></span>
                  <span className="h-[2px] w-full bg-[#c2bc9e]"></span>
                  <span className="h-[2px] w-full bg-[#c2bc9e]"></span>
                </span>
                {/* Custom A with downward pointing green triangle inside */}
                <span className="relative inline-flex items-center">
                  <span>A</span>
                  <span className="absolute bottom-[2.5px] left-[3.5px] w-0 h-0 border-l-[2.5px] border-l-transparent border-r-[2.5px] border-r-transparent border-t-[4px] border-t-[#838a4d]"></span>
                </span>
                <span>DS</span>
              </span>
            </div>
          </a>
        </div>

        {/* Search bar inside navigation is streamlined */}
        <div id="search-container" className="hidden md:flex relative max-w-sm w-full mx-5">
          <input
            id="search-input-nav"
            type="text"
            placeholder="Search wool, linen, accessories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm py-1.5 pl-9 pr-4 rounded-full border border-zinc-200 focus:outline-none focus:border-zinc-500 transition-colors bg-zinc-50 focus:bg-white"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-4">
          
          {/* Custom style layout editor button */}
          <button
            id="btn-layout-editor-trigger"
            onClick={onOpenLayoutEditor}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs text-zinc-600 bg-zinc-50 border border-zinc-200 rounded-full hover:bg-zinc-100 transition-colors"
            title="Interactive page preview customizer"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span className="font-medium">Customize Layout</span>
          </button>

          {/* Cart triggers */}
          <button
            id="btn-navbar-cart"
            onClick={onOpenCart}
            aria-label="Open cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors group"
          >
            <ShoppingBag className="h-5 w-5 group-hover:scale-105 transition-transform" />
            {cartCount > 0 && (
              <span
                id="cart-badge-nav"
                className={`absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${accent.badge} animate-pulse shadow-sm`}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Search drawer for mobile screens */}
      <div className="md:hidden border-t border-zinc-50 px-4 py-2 bg-white flex items-center justify-center">
        <div className="relative w-full">
          <input
            id="search-input-mobile"
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm py-1.5 pl-9 pr-4 rounded-full border border-zinc-200 focus:outline-none bg-zinc-50"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        </div>
      </div>
    </header>
  );
}
