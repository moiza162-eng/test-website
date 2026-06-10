import { useState, useMemo, FormEvent } from 'react';
import { CartItem, LayoutSettings } from '../types';
import { ACCENT_THEMES } from '../data';
import { X, CheckCircle, ShieldCheck, Mail, CreditCard, ChevronRight, ArrowLeft, Printer, RefreshCw } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onClearCart: () => void;
  layout: LayoutSettings;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  onClearCart,
  layout
}: CheckoutModalProps) {
  const accent = ACCENT_THEMES[layout.accent];

  // Steps: 'address' | 'payment' | 'receipt'
  const [step, setStep] = useState<'address' | 'payment' | 'receipt'>('address');

  // Input states
  const [formData, setFormData] = useState({
    name: 'Moiz',
    email: 'moiza162@gmail.com',
    address: '108 Kyoto Sanno Green Road',
    city: 'Kyoto',
    postcode: '600-8001',
    cardName: 'Moiz',
    cardNumber: '4242 •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '185',
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [generatedOrderId, setGeneratedOrderId] = useState<string>('');
  const [orderDate, setOrderDate] = useState<string>('');

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const shippingFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return cartSubtotal >= 100 ? 0 : 5;
  }, [cartSubtotal]);

  // Handle address form validate
  const handleAddressSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Enter a valid address';
    if (!formData.address.trim()) errors.address = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City name is required';
    if (!formData.postcode.trim()) errors.postcode = 'Postcode is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      setStep('payment');
    }
  };

  // Handle final simulated payment submit
  const handlePaymentSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!formData.cardName.trim()) errors.cardName = 'Name on card is required';
    if (!formData.cardNumber.trim()) errors.cardNumber = 'Card number is required';
    if (!formData.cardExpiry.trim()) errors.cardExpiry = 'Expiry date is required';
    if (!formData.cardCvc.trim()) errors.cardCvc = 'CVC is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      
      // Generate simulated receipt parameters
      const randomId = `AET-${Math.floor(100000 + Math.random() * 900000)}-${formData.postcode.slice(0,3).toUpperCase()}`;
      setGeneratedOrderId(randomId);
      setOrderDate(new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }));

      setStep('receipt');
    }
  };

  const handleFinishCheckout = () => {
    onClearCart();
    onClose();
    setStep('address');
  };

  if (!isOpen) return null;

  return (
    <div id="checkout-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs overflow-y-auto">
      <div id="checkout-modal-content" className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Header Toolbar */}
        <div className="p-5 border-b border-zinc-150 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 block"></span>
            <h3 className="font-sans text-sm font-extrabold uppercase tracking-widest text-zinc-900">
              {step === 'address' && 'Billing & Delivery Address'}
              {step === 'payment' && 'Simulated Secure Gateway'}
              {step === 'receipt' && 'Billing Confirmed • Receipt Issued'}
            </h3>
          </div>
          {step !== 'receipt' && (
            <button
              id="btn-close-checkout"
              onClick={onClose}
              className="p-1.5 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-800 transition-colors"
              title="Close checkout"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Step indicators */}
        {step !== 'receipt' && (
          <div className="flex bg-zinc-50 border-b border-zinc-100 py-3 px-6 text-xs text-zinc-400 font-mono">
            <span className={`font-bold ${step === 'address' ? 'text-zinc-900' : ''}`}>1. Shipping</span>
            <ChevronRight className="h-4 w-4 mx-2 text-zinc-300" />
            <span className={`font-bold ${step === 'payment' ? 'text-zinc-900' : ''}`}>2. Payment details</span>
            <ChevronRight className="h-4 w-4 mx-2 text-zinc-300" />
            <span>3. Finished Receipt</span>
          </div>
        )}

        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {/* STEP 1: SHIPPING ADDRESS */}
          {step === 'address' && (
            <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-sans border-b pb-1">
                  Deliver To
                </h4>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">Consignee Name</label>
                  <input
                    id="billing-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-2.5 rounded border border-zinc-200 focus:outline-none focus:border-zinc-950 bg-white"
                    placeholder="e.g. Sarah Connor"
                  />
                  {formErrors.name && <p className="text-[10px] text-red-650">{formErrors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">Notification Email</label>
                  <input
                    id="billing-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs p-2.5 rounded border border-zinc-200 focus:outline-none focus:border-zinc-950 bg-white"
                    placeholder="e.g. sarah@cyberdyne.com"
                  />
                  {formErrors.email && <p className="text-[10px] text-red-650">{formErrors.email}</p>}
                </div>

                {/* Address */}
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">Street Address</label>
                  <input
                    id="billing-address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full text-xs p-2.5 rounded border border-zinc-200 focus:outline-none focus:border-zinc-950 bg-white"
                    placeholder="e.g. 104 Cedar Blvd"
                  />
                  {formErrors.address && <p className="text-[10px] text-red-650">{formErrors.address}</p>}
                </div>

                {/* City & Zip */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">City</label>
                    <input
                      id="billing-city"
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full text-xs p-2.5 rounded border border-zinc-200 focus:outline-none"
                      placeholder="Kyoto"
                    />
                    {formErrors.city && <p className="text-[10px] text-red-650">{formErrors.city}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">Postcode</label>
                    <input
                      id="billing-postcode"
                      type="text"
                      value={formData.postcode}
                      onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                      className="w-full text-xs p-2.5 rounded border border-zinc-200 focus:outline-none"
                      placeholder="600-8001"
                    />
                    {formErrors.postcode && <p className="text-[10px] text-red-650">{formErrors.postcode}</p>}
                  </div>
                </div>
              </div>

              {/* Order summary sidebar */}
              <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-200/65 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-1 mb-3">
                    Order Items
                  </h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs font-sans">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] bg-zinc-200 text-zinc-850 px-1 py-0.2 rounded font-mono">x{item.quantity}</span>
                          <span className="text-zinc-700 line-clamp-1">{item.product.name}</span>
                        </div>
                        <span className="font-mono text-zinc-900">£{(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200 mt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-650">
                    <span>Items Total</span>
                    <span className="font-mono">£{cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-650">
                    <span>Shipping fee</span>
                    <span className="font-mono">{shippingFee === 0 ? 'FREE' : `£${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between text-sm text-zinc-900 font-bold pt-1 border-t border-zinc-100">
                    <span>Estimate Subtotal</span>
                    <span className="font-mono">£{(cartSubtotal + shippingFee).toFixed(2)}</span>
                  </div>

                  <button
                    id="submit-shipping-address"
                    type="submit"
                    className={`w-full py-3 rounded-full text-xs font-bold uppercase tracking-widest ${accent.buttonClass} mt-4 active:scale-98 transition-transform`}
                  >
                    Go to Payments Detail
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT CARD DETAILS */}
          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="max-w-md mx-auto space-y-6">
              
              <div className="bg-zinc-900 text-white p-5 rounded-2xl relative shadow-xl font-mono border border-zinc-800 overflow-hidden">
                {/* Simulated Chip card */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-400 tracking-wider">AETHER SANDBOX CARD</span>
                    <div className="h-6 w-9 bg-yellow-500/80 rounded-sm"></div>
                  </div>
                  <CreditCard className="h-6 w-6 text-zinc-400" />
                </div>
                
                <div className="py-5 text-lg tracking-widest">
                  {formData.cardNumber || '•••• •••• •••• ••••'}
                </div>

                <div className="flex justify-between text-xs">
                  <div>
                    <span className="block text-[8px] text-zinc-500 uppercase">Card Holder</span>
                    <span className="font-semibold uppercase tracking-wider">{formData.cardName || 'YOUR FULL NAME'}</span>
                  </div>
                  <div className="flex space-x-4">
                    <div>
                      <span className="block text-[8px] text-zinc-500 uppercase">Expiry</span>
                      <span>{formData.cardExpiry || 'MM/YY'}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-zinc-500 uppercase">CVC</span>
                      <span>{formData.cardCvc || '•••'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Input fields */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">Cardholder Name</label>
                  <input
                    id="card-name-input"
                    type="text"
                    value={formData.cardName}
                    onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                    className="w-full text-xs p-2.5 rounded border border-zinc-200"
                    placeholder="Moiz"
                  />
                  {formErrors.cardName && <p className="text-[10px] text-red-650">{formErrors.cardName}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">Card Digits</label>
                  <input
                    id="card-number-input"
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    className="w-full text-xs p-2.5 rounded border border-zinc-200 font-mono"
                    placeholder="4242 4242 4242 4242"
                  />
                  {formErrors.cardNumber && <p className="text-[10px] text-red-650">{formErrors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">Expiry (MM/YY)</label>
                    <input
                      id="card-expiry-input"
                      type="text"
                      value={formData.cardExpiry}
                      onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                      className="w-full text-xs p-2.5 rounded border border-zinc-200 font-mono"
                      placeholder="12/28"
                    />
                    {formErrors.cardExpiry && <p className="text-[10px] text-red-650">{formErrors.cardExpiry}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">CVC Security Code</label>
                    <input
                      id="card-cvc-input"
                      type="text"
                      maxLength={4}
                      value={formData.cardCvc}
                      onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                      className="w-full text-xs p-2.5 rounded border border-zinc-200 font-mono"
                      placeholder="185"
                    />
                    {formErrors.cardCvc && <p className="text-[10px] text-red-650">{formErrors.cardCvc}</p>}
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex gap-4 pt-4 border-t border-zinc-150">
                <button
                  type="button"
                  onClick={() => setStep('address')}
                  className="px-5 py-3 border border-zinc-200 hover:border-zinc-405 hover:bg-zinc-50 rounded-full text-xs font-semibold flex items-center space-x-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Go Back</span>
                </button>
                <button
                  id="submit-payment-btn"
                  type="submit"
                  className={`flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-widest ${accent.buttonClass}`}
                >
                  Confirm simulated order of £{(cartSubtotal + shippingFee).toFixed(2)}
                </button>
              </div>

            </form>
          )}

          {/* STEP 3: SUCCESS CONFIRMED RECEIPT CARD */}
          {step === 'receipt' && (
            <div className="max-w-md mx-auto space-y-6">
              
              {/* Success Badge */}
              <div className="text-center py-4">
                <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto animate-bounce" />
                <h3 className="font-sans text-xl font-bold mt-2 text-zinc-900">Your order has been placed!</h3>
                <p className="text-xs text-zinc-500">Thank you for shopping at Nova Threads. We sent notifications to {formData.email}</p>
              </div>

              {/* Actual Printable Receipt Card */}
              <div id="issued-receipt" className="border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-6 rounded-xl font-mono text-[11px] leading-relaxed text-zinc-700 space-y-4">
                
                {/* Receipt Header details */}
                <div className="text-center pb-3 border-b border-zinc-200">
                  <span className="font-sans font-bold text-sm tracking-widest text-zinc-900">NOVA THREADS RECEIPT</span>
                  <div className="text-[9px] text-zinc-400 mt-1 uppercase">ESTABLISHED 2026 • ORIGINAL SOURCING</div>
                </div>

                {/* Meta details Block */}
                <div className="grid grid-cols-2 gap-2 text-left">
                  <div>
                    <span className="text-[9px] text-zinc-400 uppercase">Receipt No:</span>
                    <span className="block font-bold text-zinc-800">{generatedOrderId}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-400 uppercase">Issued Date:</span>
                    <span className="block font-bold text-zinc-800">{orderDate}</span>
                  </div>
                  <div className="col-span-2 pt-1">
                    <span className="text-[9px] text-zinc-400 uppercase">Consignee & Address:</span>
                    <span className="block font-bold text-zinc-800">{formData.name} <br /> {formData.address}, {formData.city}, {formData.postcode}</span>
                  </div>
                </div>

                {/* Items loop details in receipt */}
                <div className="border-t border-b border-zinc-200 py-3 space-y-2">
                  <span className="text-[9px] text-zinc-400 uppercase block">Purchased Goods</span>
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-zinc-800">
                      <span>{item.product.name} (Size: {item.selectedSize}) x{item.quantity}</span>
                      <span>£{(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Grand calculations Block */}
                <div className="space-y-1.5 text-right font-bold text-zinc-800">
                  <div className="flex justify-between">
                    <span className="text-zinc-450 normal-case font-normal text-[9px]">Goods Net total:</span>
                    <span>£{cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-450 normal-case font-normal text-[9px]">Fast Shipping fee:</span>
                    <span>{shippingFee === 0 ? 'FREE' : `£${shippingFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-xs border-t border-zinc-200 pt-1.5 text-zinc-900">
                    <span>Total billing amount:</span>
                    <span>£{(cartSubtotal + shippingFee).toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-center pt-2 text-[9px] text-zinc-400 uppercase tracking-widest">
                  Thank you for supporting slow fashion.
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex gap-4">
                <button
                  id="btn-print-receipt"
                  onClick={() => alert(`Simulating print process for Order ${generatedOrderId}... Your physical document is rendering!`)}
                  className="flex items-center justify-center space-x-1.5 flex-1 py-3 px-4 border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 rounded-full text-xs font-semibold transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Document</span>
                </button>
                <button
                  id="btn-confirm-receipt-finish"
                  onClick={handleFinishCheckout}
                  className={`flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-center ${accent.buttonClass} transition-all`}
                >
                  Save and Continue
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
