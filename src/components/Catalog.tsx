import { useState, useMemo } from 'react';
import { Product, LayoutSettings } from '../types';
import { PRODUCTS, ACCENT_THEMES } from '../data';
import { Grid, List, Search, Star, Sparkles, Filter, SlidersHorizontal, Eye } from 'lucide-react';

interface CatalogProps {
  products: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  layout: LayoutSettings;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
}

export default function Catalog({
  products,
  searchQuery,
  setSearchQuery,
  layout,
  onSelectProduct,
  onAddToCart,
}: CatalogProps) {
  const accent = ACCENT_THEMES[layout.accent];
  
  // Local state controls
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showInStockOnly, setShowInStockOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Categories extraction
  const categories = useMemo(() => {
    return ['All', 'Apparel', 'Outerwear'];
  }, []);

  // Filter & Sort Logic
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // In-Stock Filter
    if (showInStockOnly) {
      result = result.filter(p => p.inStock);
    }

    // Text Search Bar
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q)
      );
    }

    // Sort mappings
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: featured first, then standard ordering
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, selectedCategory, showInStockOnly, searchQuery, sortBy]);

  // Handle grid density responsive settings
  const gridColsClass = useMemo(() => {
    if (layout.gridDensity === 'compact') {
      return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3';
    } else if (layout.gridDensity === 'spacious') {
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8';
    }
    // balanced default
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
  }, [layout.gridDensity]);

  return (
    <section id="catalog-section" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-150 pb-5 mb-8">
        <div>
          <h2 id="catalog-heading" className="text-2xl font-semibold tracking-tight text-zinc-900 font-sans">
            Curated Atelier Products
          </h2>
          <p className="text-zinc-500 text-xs mt-1">
            Displaying {processedProducts.length} of {products.length} natural items
          </p>
        </div>

        {/* Action Toggles (In stock, sorting, modes) */}
        <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
          
          {/* Category Badges */}
          <div className="flex space-x-1.5 p-1 bg-zinc-100 rounded-lg">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-250 ${
                  selectedCategory === cat
                    ? 'bg-white text-zinc-900 shadow-sm font-semibold'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sorter Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono uppercase text-zinc-400">Sort</span>
            <select
              id="select-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-white border border-zinc-200 rounded-md py-1.5 pl-2 pr-8 focus:outline-none focus:border-zinc-500 text-zinc-800"
            >
              <option value="featured">Best Matches</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Grid/List View Toggles */}
          <div className="flex bg-zinc-100 rounded-md p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-xs text-zinc-900' : 'text-zinc-400'}`}
              title="Show grid layout"
            >
              <Grid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-xs text-zinc-900' : 'text-zinc-400'}`}
              title="Show list layout"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Catalog Filtering Rail and Cards Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side Filters Sidebar - Keeps it Desktop Premium */}
        <aside className="w-full lg:w-56 shrink-0 space-y-6">
          <div className="border border-zinc-200 bg-zinc-50/50 p-5 rounded-xl space-y-5">
            <div className="flex items-center space-x-2 pb-3 border-b border-zinc-200 text-zinc-800 font-medium text-xs font-mono uppercase">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Refine Items</span>
            </div>

            {/* In Stock Toggle */}
            <div className="space-y-2">
              <span className="block text-[10px] font-mono uppercase text-zinc-500">Availability</span>
              <label className="flex items-center space-x-2.5 cursor-pointer group">
                <input
                  id="chk-instock-only"
                  type="checkbox"
                  checked={showInStockOnly}
                  onChange={(e) => setShowInStockOnly(e.target.checked)}
                  className="rounded text-zinc-900 focus:ring-zinc-500 h-3.5 w-3.5 accent-zinc-900 border-zinc-300"
                />
                <span className="text-xs text-zinc-600 group-hover:text-zinc-950 select-none transition-colors">
                  In-Stock Items Only
                </span>
              </label>
            </div>

            {/* Info Snippet */}
            <div className="pt-2 border-t border-zinc-200 text-[11px] text-zinc-400 leading-normal space-y-1">
              <span className="font-semibold text-zinc-650 block">Shipping Guarantee:</span>
              <p>Free custom carbon-neutral ground shipping for orders above £100.</p>
            </div>
          </div>
        </aside>

        {/* Products Display Container */}
        <div className="flex-1">
          {processedProducts.length === 0 ? (
            <div className="text-center py-16 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200/40">
              <Search className="h-8 w-8 mx-auto text-zinc-300 stroke-1 mb-2" />
              <h3 className="text-sm font-semibold text-zinc-800 mb-1">No products found</h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                No catalog item matched "{searchQuery}". Try modifying your queries or category choices.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setShowInStockOnly(false);
                }}
                className={`mt-4 text-xs font-semibold px-4 py-2 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-colors`}
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'list' ? (
            /* LIST VIEW MODE */
            <div className="space-y-4">
              {processedProducts.map(p => (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row items-stretch bg-white border border-zinc-150 rounded-xl overflow-hidden hover:shadow-xs transition-shadow duration-300 group p-4 gap-4"
                >
                  <div className="relative w-full sm:w-44 h-44 sm:h-36 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {!p.inStock && (
                      <span className="absolute top-2 left-2 text-[9px] font-bold font-mono uppercase bg-red-600 text-white px-1.5 py-0.5 rounded">
                        Sold Out
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">{p.category}</span>
                        <div className="flex items-center text-xs text-yellow-600">
                          <Star className="h-3 w-3 fill-current mr-0.5" />
                          <span>{p.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-base font-semibold text-zinc-900 tracking-tight mt-1">{p.name}</h3>
                      <p className="text-xs text-zinc-500 line-clamp-2 mt-1 leading-relaxed">{p.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-100">
                      <span className="text-base font-bold text-zinc-900">£{p.price}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onSelectProduct(p)}
                          className="px-3.5 py-1.5 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors rounded-full flex items-center space-x-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Quick View</span>
                        </button>
                        <button
                          onClick={() => onAddToCart(p, p.sizes[0] || 'M', p.colors[0])}
                          disabled={!p.inStock}
                          className={`px-4 py-1.5 text-xs font-semibold rounded-full group transition-all ${
                            p.inStock
                              ? accent.buttonClass
                              : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                          }`}
                        >
                          {p.inStock ? 'Quick Add' : 'Sold Out'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* GRID VIEW MODE MAPS LAYOUT DENSITY OPTION */
            <div className={`grid ${gridColsClass}`}>
              {processedProducts.map(p => {
                const isCompact = layout.gridDensity === 'compact';
                const isSpacious = layout.gridDensity === 'spacious';

                return (
                  <div
                    key={p.id}
                    className="flex flex-col bg-white border border-zinc-150 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 group"
                  >
                    {/* Image Stage */}
                    <div className={`relative ${isCompact ? 'h-40' : isSpacious ? 'h-80' : 'h-64'} overflow-hidden bg-zinc-50`}>
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      
                      {/* Interactive Float Overlays */}
                      <button
                        onClick={() => onSelectProduct(p)}
                        className="absolute right-3 bottom-3 p-2 bg-white/90 backdrop-blur text-zinc-800 rounded-full shadow-lg hover:bg-white transition-colors duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 scale-95 group-hover:scale-100"
                        title="Quick View specification details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {!p.inStock && (
                          <span className="text-[9px] font-bold font-mono tracking-wider uppercase bg-gray-900/90 text-white px-2 py-0.5 rounded-full">
                            Sold Out
                          </span>
                        )}
                        {p.featured && p.inStock && (
                          <span className={`inline-flex items-center space-x-0.5 text-[8px] font-bold font-mono tracking-wider uppercase bg-amber-500/95 text-white px-2 py-0.5 rounded-full`}>
                            <Sparkles className="h-2 w-2 fill-current" />
                            <span>Staff Pick</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta Content */}
                    <div className={`flex-1 flex flex-col justify-between ${isCompact ? 'p-3' : 'p-5'}`}>
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-zinc-450">
                          <span>{p.category}</span>
                          <div className="flex items-center text-yellow-600 font-semibold">
                            <Star className="h-2.5 w-2.5 fill-current mr-0.5" />
                            <span>{p.rating}</span>
                          </div>
                        </div>
                        <h3 className={`font-semibold text-zinc-900 tracking-tight mt-1 group-hover:text-zinc-700 transition-colors ${
                          isCompact ? 'text-sm' : 'text-base'
                        }`}>
                          {p.name}
                        </h3>
                        {!isCompact && (
                          <p className="text-zinc-500 text-xs line-clamp-2 mt-1.5 leading-relaxed">
                            {p.description}
                          </p>
                        )}
                      </div>

                      {/* Add Button & Pricing */}
                      <div className={`flex items-center justify-between pt-3 mt-4 border-t border-zinc-100 ${
                        isCompact ? 'gap-1' : ''
                      }`}>
                        <span className={`font-bold text-zinc-900 ${isCompact ? 'text-sm' : 'text-base'}`}>
                          £{p.price}
                        </span>
                        
                        <button
                          onClick={() => onAddToCart(p, p.sizes[0] || 'M', p.colors[0])}
                          disabled={!p.inStock}
                          className={`text-xs font-semibold uppercase tracking-wider rounded-full py-1 px-3.5 transition-all ${
                            p.inStock
                              ? accent.buttonClass + ' active:scale-95'
                              : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                          }`}
                        >
                          {p.inStock ? 'Add' : 'Sold'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
