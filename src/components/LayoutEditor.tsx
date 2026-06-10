import { X, RefreshCw, Layers, Palette, Eye, LayoutGrid } from 'lucide-react';
import { LayoutSettings, ThemeAccent, HeroStyle, GridDensity } from '../types';

interface LayoutEditorProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LayoutSettings;
  onChangeSettings: (newSettings: LayoutSettings) => void;
}

export default function LayoutEditor({
  isOpen,
  onClose,
  settings,
  onChangeSettings
}: LayoutEditorProps) {
  if (!isOpen) return null;

  // Handler helpers
  const handleAccentChange = (accent: ThemeAccent) => {
    onChangeSettings({ ...settings, accent });
  };

  const handleHeroStyleChange = (heroStyle: HeroStyle) => {
    onChangeSettings({ ...settings, heroStyle });
  };

  const handleDensityChange = (gridDensity: GridDensity) => {
    onChangeSettings({ ...settings, gridDensity });
  };

  const handleToggleHero = () => {
    onChangeSettings({ ...settings, showHero: !settings.showHero });
  };

  const handleToggleSizeFinder = () => {
    onChangeSettings({ ...settings, showSizeFinder: !settings.showSizeFinder });
  };

  const handleResetSettings = () => {
    onChangeSettings({
      accent: 'charcoal',
      heroStyle: 'minimal',
      gridDensity: 'balanced',
      showHero: true,
      showSizeFinder: true
    });
  };

  // Preset definitions
  const ACCENTS_PRESETS: { value: ThemeAccent; label: string; color: string }[] = [
    { value: 'charcoal', label: 'Earth Charcoal', color: 'bg-zinc-900' },
    { value: 'terracotta', label: 'Soft Terracotta', color: 'bg-orange-800' },
    { value: 'indigo', label: 'Marine Indigo', color: 'bg-indigo-900' },
    { value: 'sage', label: 'Sage Field', color: 'bg-emerald-900' },
  ];

  return (
    <div id="layout-editor-panel" className="fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-white border-r border-zinc-200 shadow-2xl flex flex-col justify-between">
      <div>
        
        {/* Drawer Header details */}
        <div className="p-5 border-b border-zinc-150 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Palette className="h-5 w-5 text-zinc-800" />
            <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-zinc-900">
              Live Brand Customizer
            </h3>
          </div>
          <button
            id="btn-close-layout-editor"
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-800 transition-colors"
            title="Close editor panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-lg text-xs leading-normal text-zinc-600">
            Experiment with different brand themes, spacing grids, and collection modules to check your layouts.
          </div>

          {/* Theme select option */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5 uppercase tracking-wide">
              <span>Dynamic Color Accents</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ACCENTS_PRESETS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleAccentChange(opt.value)}
                  className={`flex items-center space-x-2.5 p-2 rounded-lg border text-left transition-all ${
                    settings.accent === opt.value
                      ? 'border-zinc-900 bg-zinc-50 font-bold'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <span className={`h-4.5 w-4.5 rounded-full ${opt.color} block shrink-0`} />
                  <span className="text-[11px] text-zinc-805 select-none">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hero layouts select option */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5 uppercase tracking-wide">
              <Layers className="h-4 w-4 text-zinc-500" />
              <span>Hero Stage Styles</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['minimal', 'split', 'editorial'] as HeroStyle[]).map(style => (
                <button
                  key={style}
                  onClick={() => handleHeroStyleChange(style)}
                  className={`py-2 px-1 text-center border rounded-lg text-[10px] font-mono font-bold capitalize transition-all ${
                    settings.heroStyle === style
                      ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white text-zinc-650'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog grid density option */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5 uppercase tracking-wide">
              <LayoutGrid className="h-4 w-4 text-zinc-500" />
              <span>Grid Layout Spacing</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['compact', 'balanced', 'spacious'] as GridDensity[]).map(density => (
                <button
                  key={density}
                  onClick={() => handleDensityChange(density)}
                  className={`py-2 px-1 text-center border rounded-lg text-[10px] font-mono font-bold capitalize transition-all ${
                    settings.gridDensity === density
                      ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white text-zinc-650'
                  }`}
                >
                  {density}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-zinc-400 font-mono">
              {settings.gridDensity === 'compact' && 'Compact view: displays small 5-column cells for wide catalogs.'}
              {settings.gridDensity === 'balanced' && 'Balanced view: standard 4-column cards.'}
              {settings.gridDensity === 'spacious' && 'Spacious view: massive landscape photos with description details.'}
            </p>
          </div>

          {/* Block Visibility Toggles */}
          <div className="space-y-2.5 pt-4 border-t border-zinc-150">
            <span className="block text-xs font-semibold text-zinc-800 uppercase tracking-wide">Module Swappers</span>
            
            <div className="space-y-3">
              {/* Toggle Hero Banner */}
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs text-zinc-600 group-hover:text-zinc-900 select-none">
                  Show Hero Landing Area
                </span>
                <input
                  id="toggle-hero-banner"
                  type="checkbox"
                  checked={settings.showHero}
                  onChange={handleToggleHero}
                  className="rounded text-zinc-900 focus:ring-zinc-500 h-4 w-4 accent-zinc-900"
                />
              </label>

              {/* Toggle Size Finder component */}
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs text-zinc-600 group-hover:text-zinc-900 select-none font-sans">
                  Show Smart Size Advisor
                </span>
                <input
                  id="toggle-size-finder"
                  type="checkbox"
                  checked={settings.showSizeFinder}
                  onChange={handleToggleSizeFinder}
                  className="rounded text-zinc-900 focus:ring-zinc-500 h-4 w-4 accent-zinc-900"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Footer trigger controls */}
      <div className="p-5 border-t border-zinc-150 bg-zinc-50 flex items-center justify-between">
        <button
          id="btn-reset-layout"
          onClick={handleResetSettings}
          className="flex items-center space-x-1 px-3 py-2 text-xs font-semibold border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 transition-colors rounded-lg"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Restore Original Layout</span>
        </button>

        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-bold bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
}
