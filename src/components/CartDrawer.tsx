import { useState, useMemo, FormEvent } from 'react';
import { CartItem, LayoutSettings } from '../types';
import { ACCENT_THEMES, DISCOUNT_CODES } from '../data';
import { X, Trash2, Tag, ShoppingCart, ArrowRight, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
  layout: LayoutSettings;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  layout
}: CartDrawerProps) {
  const accent = ACCENT_THEMES[layout.accent];

  // Coupon state
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [activeCoupon, setActiveCoupon] = useState<string>('');
  const [couponError, setCouponError] = useState<string>('');

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  // Discount calculation
  const discountAmount = useMemo(() => {
    return cartSubtotal * appliedDiscount;
  }, [cartSubtotal, appliedDiscount]);

  // Shipping Calculation
  const shippingFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return cartSubtotal >= 100 ? 0 : 5;
  }, [cartSubtotal]);

  const finalTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount + shippingFee);
  }, [cartSubtotal, discountAmount, shippingFee]);

  const handleApplyCoupon = (e: FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (DISCOUNT_CODES[code] !== undefined) {
      setAppliedDiscount(DISCOUNT_CODES[code]);
      setActiveCoupon(code);
      setCouponCode('');
    } else {
      setCouponError('Invalid campaign code. Try WELCOME10 or ELEVATE20.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedDiscount(0);
    setActiveCoupon('');
    setCouponError('');
  };

  if (!isOpen) return null;

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 flex justify-end bg-zinc-950/60 backdrop-blur-xs">
      
      {/* Click-out barrier */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Actual Drawer body */}
      <div
        id="cart-drawer-content"
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
      >
        {/* Header toolbar */}
        <div className="p-5 border-b border-zinc-150 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShoppingCart className="h-5 w-5 text-zinc-800" />
            <h3 className="font-sans text-base font-bold text-zinc-900">Your Wardrobe Selection</h3>
          </div>
          <button
            id="btn-close-cart"
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 rounded-full transition-all"
            title="Close cart drawer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Selected Items Core List */}
        <div id="cart-items-list" className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-zinc-400 font-sans space-y-3">
              <ShoppingCart className="h-10 w-10 mx-auto text-zinc-300 stroke-1" />
              <p className="text-sm font-semibold">Your cart list is empty</p>
              <p className="text-[11px] max-w-xs mx-auto text-zinc-400">
                Aethers looks better layered. Explore our collection card grids and select some pieces!
              </p>
              <button
                onClick={onClose}
                className="text-xs font-semibold px-4 py-2 border border-zinc-200 hover:border-zinc-400 rounded-full transition-colors mt-2 text-zinc-700 bg-zinc-50"
              >
                Go Back Shopping
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                className="flex items-stretch gap-3 pb-4 border-b border-zinc-100 last:border-0"
              >
                {/* Thumb Visual */}
                <div className="h-20 w-20 rounded bg-zinc-50 overflow-hidden shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Info Text block */}
                <div className="flex-1 flex flex-col justify-between text-xs font-sans">
                  <div>
                    <div className="flex justify-between font-bold text-zinc-900">
                      <span className="line-clamp-1">{item.product.name}</span>
                      <span>£{item.product.price}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-[10px] text-zinc-400 font-mono uppercase mt-1">
                      <span>Size: {item.selectedSize}</span>
                      <div className="flex items-center space-x-1">
                        <span>Color:</span>
                        <span
                          className="h-2.5 w-2.5 rounded-full border border-zinc-200 inline-block"
                          style={{ backgroundColor: item.selectedColor }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Operational panel (+ - remove) */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2 bg-zinc-100 rounded p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center text-zinc-650 bg-white hover:bg-zinc-100 rounded text-[10px]"
                        title="Reduce quantity"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-mono text-[11px] font-bold text-zinc-800">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-zinc-650 bg-white hover:bg-zinc-100 rounded text-[10px]"
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-zinc-400 hover:text-red-650 p-1 rounded-md hover:bg-red-50 transition-colors"
                      title="Remove product item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Campaign Coupon & Billing details section */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-zinc-150 bg-zinc-50 space-y-4">
            
            {/* Promo application */}
            <form onSubmit={handleApplyCoupon} className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-zinc-500">
                <span>Have a discount coupon?</span>
                <span className="text-zinc-400 font-semibold italic">e.g., WELCOME10, ELEVATE20</span>
              </div>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    id="input-promo-code"
                    type="text"
                    placeholder="ENTER CODE..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full text-xs py-2 pl-8 pr-2 rounded border border-zinc-200 focus:outline-none focus:border-zinc-500 bg-white font-mono uppercase"
                  />
                  <Tag className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                </div>
                <button
                  id="btn-apply-promo"
                  type="submit"
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-950 text-white rounded text-xs font-bold transition-all"
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <p id="promo-error-message" className="text-[10px] text-red-650 font-medium font-sans">
                  {couponError}
                </p>
              )}

              {activeCoupon && (
                <div id="promo-active-badge" className="flex items-center justify-between text-[11px] bg-emerald-50 text-emerald-800 px-2 py-1 rounded border border-emerald-150 font-semibold">
                  <span>Campaign: {activeCoupon} ({(appliedDiscount * 100)}% Discount Applied)</span>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-emerald-900 hover:text-red-550 underline font-bold"
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs font-sans text-zinc-600 pt-2 border-t border-zinc-200">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono text-zinc-900 font-bold">£{cartSubtotal.toFixed(2)}</span>
              </div>
              
              {appliedDiscount > 0 && (
                <div id="calc-discount-line" className="flex justify-between text-emerald-700 font-semibold">
                  <span>Campagn Deductions</span>
                  <span className="font-mono">-£{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <span>Atelier Fast Shipping</span>
                  {cartSubtotal >= 100 && (
                    <span className="bg-emerald-100 text-emerald-800 text-[8px] font-mono uppercase px-1.5 rounded">Free over £100</span>
                  )}
                </span>
                <span className="font-mono text-zinc-900 font-bold">
                  {shippingFee === 0 ? 'FREE' : `£${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-sm text-zinc-900 font-bold pt-2 border-t border-zinc-200">
                <span>Final Billing Total</span>
                <span id="cart-final-total" className="font-mono text-base">£{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action wrapper */}
            <div className="space-y-2 pt-1">
              <button
                id="btn-drawer-checkout"
                onClick={onCheckout}
                className={`w-full flex items-center justify-center space-x-2 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-widest ${accent.buttonClass} shadow-md active:scale-[0.99] transition-all`}
              >
                <span>Proceed to Simulated Billing</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[9px] text-zinc-400 font-mono">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Simulated Secure Enclave Sandbox</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
