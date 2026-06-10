import { ArrowRight, Sparkles } from 'lucide-react';
import { LayoutSettings } from '../types';
import { ACCENT_THEMES } from '../data';

interface HeroProps {
  layout: LayoutSettings;
  onExploreClick: () => void;
  onOpenLayoutEditor: () => void;
}

export default function Hero({ layout, onExploreClick, onOpenLayoutEditor }: HeroProps) {
  const accent = ACCENT_THEMES[layout.accent];

  if (!layout.showHero) return null;

  if (layout.heroStyle === 'split') {
    return (
      <section id="hero-split-layout" className="relative border-b border-zinc-100 overflow-hidden bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
          {/* Visual Column */}
          <div className="relative h-64 md:h-auto min-h-[300px] overflow-hidden bg-zinc-50">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
              alt="Artisanal Autumn Collection styled lookbook"
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover grayscale brightness-95 hover:grayscale-0 transition-all duration-700 ease-out"
            />
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 text-[10px] tracking-widest uppercase font-mono text-zinc-900 border border-zinc-100">
              Autumn Lookbook 026
            </div>
          </div>
          
          {/* Editorial copy column */}
          <div className="flex flex-col justify-center px-6 py-12 md:p-16 lg:p-24 bg-zinc-50/50">
            <div className="max-w-md space-y-6">
              <div className="inline-flex items-center space-x-1.5 text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
                <span>Natural Sourcing Atelier</span>
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
                <span>Japan & Belgium</span>
              </div>
              <h1 className="font-sans text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 leading-[1.1]">
                Form Inspired By <span className="underline decoration-zinc-300 decoration-wavy underline-offset-8">Stillness</span>.
              </h1>
              <p className="text-zinc-600 text-sm leading-relaxed font-sans">
                A study on weightless drapes and raw cotton textures. Each textile yarn is sourced from organic, fair-trade fields in Nara and hand-finished with biodegradable dyes.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  id="btn-split-hero-explore"
                  onClick={onExploreClick}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full text-xs font-semibold ${accent.buttonClass} transition-all duration-300 transform hover:scale-[1.02] shadow-sm`}
                >
                  <span>Explore the Collections</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  id="btn-split-hero-customize"
                  onClick={onOpenLayoutEditor}
                  className="flex items-center space-x-1.5 px-4 py-3 rounded-full text-xs font-semibold text-zinc-700 border border-zinc-200 hover:bg-white transition-all bg-white/50"
                >
                  <Sparkles className="h-3.5 w-3.5 text-yellow-600" />
                  <span>Customize Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout.heroStyle === 'editorial') {
    return (
      <section id="hero-editorial-layout" className={`relative p-4 sm:p-6 lg:p-8 bg-white border-b border-zinc-100`}>
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 p-8 sm:p-12 md:p-20 border border-zinc-200/40`}>
          
          {/* Subtle backdrop accents */}
          <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

          <div className="relative max-w-3xl space-y-6">
            <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-widest uppercase bg-zinc-200 text-zinc-850 rounded-full">
              COLLECTION 05 / TIMELITE
            </span>
            <h1 className="font-sans text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-zinc-900">
              Timeless <br />
              <span className={`italic font-serif font-normal ${accent.accentText}`}>Sartorial Essentials</span>
            </h1>
            <p className="max-w-lg text-zinc-600 text-base leading-relaxed font-sans">
              Designed as modular capsules for natural layering, adapting elegantly to standard movements without micro-wear fatigue. Zero waste cutting cycles.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                id="btn-editorial-explore"
                onClick={onExploreClick}
                className={`flex items-center space-x-2 px-6 py-3.5 text-xs font-bold rounded-full ${accent.buttonClass} transition-all duration-300`}
              >
                <span>Browse the Wardrobe</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-center space-x-4 pl-2">
                <div className="h-10 w-0.5 bg-zinc-200"></div>
                <div className="text-left">
                  <span className="block text-xs font-bold font-mono text-zinc-900">100% Traceable</span>
                  <span className="block text-[10px] text-zinc-500">Every single loom is documented</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floated aesthetic card displaying a detail mockup */}
          <div className="hidden lg:block absolute right-12 bottom-12 w-64 p-4 bg-white border border-zinc-150 rounded-xl shadow-xl hover:-translate-y-1 transition-transform duration-300">
            <img
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=400&auto=format&fit=crop"
              alt="Linen texture and hanger detail photo"
              referrerPolicy="no-referrer"
              className="h-36 w-full object-cover rounded-md mb-3"
            />
            <span className="block text-xs font-semibold text-zinc-900 uppercase">Atelier Scent Profile</span>
            <p className="text-[10px] text-zinc-500 leading-tight">Washed linen and raw cedarwood extracts combined perfectly.</p>
          </div>
        </div>
      </section>
    );
  }

  // Default: minimal centered
  return (
    <section id="hero-minimal-layout" className="relative bg-white border-b border-zinc-100 py-16 md:py-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
      <div className="relative max-w-2xl mx-auto space-y-6">
        <span className="text-xs font-mono tracking-[0.25em] text-zinc-400 uppercase">
          Elegance in Organic Restraint
        </span>
        <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-zinc-900">
          The Art of <span className="font-semibold">Subtle Dressing</span>
        </h1>
        <p className="text-zinc-500 text-sm md:text-base max-w-lg mx-auto leading-relaxed font-sans">
          Curated silhouettes created for those who listen closely. Crafted without redundant details, utilizing natural flax yarns and organic wool wraps.
        </p>
        <div className="flex items-center justify-center space-x-4 pt-4">
          <button
            id="btn-minimal-explore"
            onClick={onExploreClick}
            className={`px-8 py-3 text-xs tracking-wider rounded-full font-semibold uppercase ${accent.buttonClass} transition-all duration-300 transform hover:translate-y-[-1px] shadow-sm`}
          >
            Shop All Products
          </button>
          <button
            id="btn-minimal-layout-toggle"
            onClick={onOpenLayoutEditor}
            className="px-6 py-3 text-xs tracking-wider rounded-full font-semibold border border-zinc-200 text-zinc-700 bg-zinc-50 hover:bg-zinc-100 transition-all font-mono"
          >
            Layout Option: Centered
          </button>
        </div>
      </div>
    </section>
  );
}
