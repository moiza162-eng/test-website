import { useState, useMemo } from 'react';
import { LayoutSettings } from '../types';
import { ACCENT_THEMES } from '../data';
import { Ruler, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface SizeFinderProps {
  layout: LayoutSettings;
}

export default function SizeFinder({ layout }: SizeFinderProps) {
  const accent = ACCENT_THEMES[layout.accent];

  if (!layout.showSizeFinder) return null;

  // Measurement states
  const [height, setHeight] = useState<number>(175); // default cm (175cm)
  const [weight, setWeight] = useState<number>(70);  // default kg (70kg)
  const [isImperial, setIsImperial] = useState<boolean>(false);

  // Conversion calculations
  const heightDisplay = useMemo(() => {
    if (isImperial) {
      const totalInches = height / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return `${feet}'${inches}"`;
    }
    return `${height} cm`;
  }, [height, isImperial]);

  const weightDisplay = useMemo(() => {
    if (isImperial) {
      const lbs = Math.round(weight * 2.20462);
      return `${lbs} lbs`;
    }
    return `${weight} kg`;
  }, [weight, isImperial]);

  // Simulated algorithm recommendation
  const recommendation = useMemo(() => {
    // Basic body mass scale mapping for sizing recommendations
    const bmi = weight / ((height / 100) * (height / 100));

    if (height < 155) {
      if (weight < 50) return { size: 'XS', fit: 'Tailored drape fit' };
      return { size: 'S', fit: 'Relaxed crop fit' };
    }
    
    if (bmi < 18.5) {
      if (height > 180) return { size: 'M', fit: 'Elongated slim fit' };
      return { size: 'S', fit: 'Clean draped fit' };
    } else if (bmi >= 18.5 && bmi < 24.9) {
      if (height > 185) return { size: 'L', fit: 'Clean standard slouch' };
      if (height < 168) return { size: 'S', fit: 'Cozy volume fit' };
      return { size: 'M', fit: 'Proportional casual fit' };
    } else if (bmi >= 24.9 && bmi < 29.9) {
      if (height > 182) return { size: 'XL', fit: 'Comfortable drapes' };
      return { size: 'L', fit: 'Boxy standard look' };
    } else {
      return { size: 'XL', fit: 'Spacious oversized drape' };
    }
  }, [height, weight]);

  return (
    <section id="size-finder-widget" className="relative max-w-4xl mx-auto px-4 py-8 mb-12">
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-48 h-48 bg-amber-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="relative flex flex-col md:flex-row items-stretch gap-8">
          
          {/* Inputs Section */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Ruler className="h-5 w-5 text-zinc-600" />
                <h3 className="font-sans text-lg font-bold text-zinc-900">Virtual Fit Matcher</h3>
              </div>
              
              {/* Unit Toggle */}
              <button
                onClick={() => setIsImperial(!isImperial)}
                className="text-[10px] font-mono uppercase bg-zinc-200 hover:bg-zinc-300 text-zinc-800 px-2.5 py-1 rounded transition-colors"
              >
                Units: {isImperial ? 'Imperial' : 'Metric'}
              </button>
            </div>

            {/* Height Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-500">Your Height</span>
                <span className="font-mono text-zinc-900">{heightDisplay}</span>
              </div>
              <input
                id="range-height"
                type="range"
                min={140}
                max={210}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                <span>140cm (4'7")</span>
                <span>210cm (6'11")</span>
              </div>
            </div>

            {/* Weight Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-500">Your Weight</span>
                <span className="font-mono text-zinc-900">{weightDisplay}</span>
              </div>
              <input
                id="range-weight"
                type="range"
                min={40}
                max={120}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                <span>40kg (88lbs)</span>
                <span>120kg (264lbs)</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 italic">
              Our sizing runs slightly boxy to honor traditional slouch drapes of Kyoto weaving.
            </p>
          </div>

          {/* Separation Divider */}
          <div className="hidden md:block w-px bg-zinc-200 self-stretch"></div>

          {/* Outcome Result Section */}
          <div className="w-full md:w-72 flex flex-col justify-between bg-white border border-zinc-200 p-6 rounded-xl shadow-xs">
            <div className="space-y-4 text-center md:text-left">
              <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-mono tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                <Sparkles className="h-3 w-3 fill-current animate-spin" />
                <span>Smart Recommendation</span>
              </span>
              
              <div className="py-2">
                <div className="text-[56px] font-sans font-extrabold tracking-tight text-zinc-900 leading-none">
                  {recommendation.size}
                </div>
                <span className="text-xs text-zinc-500 mt-1 block">Ideal drape profile size</span>
              </div>

              <div className="border-t border-zinc-100 pt-3 flex items-start space-x-2 text-left">
                <Layers className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-semibold text-zinc-800">Visual Silhouette:</span>
                  <p id="recommended-fit-text" className="text-xs text-zinc-500">{recommendation.fit}</p>
                </div>
              </div>
            </div>

            <div className="block mt-4 pt-3 border-t border-zinc-100 text-[10px] leading-snug text-zinc-400 text-center md:text-left">
              Fits perfectly matched for standard-weight organic blazers, knits, or slacks.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
