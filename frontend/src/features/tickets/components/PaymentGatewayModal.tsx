'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  QrCode,
  Zap,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Smartphone,
  ExternalLink,
  Key,
  Info,
  Tag,
  Building2,
  FileText,
  Share2,
  Users,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  tierName: string;
  price: number;
  ticketTypeId?: string;
  seatInfo?: string;
  initialRemainingSeconds?: number;
  onPaymentSuccess: (ticketData?: any) => void;
}

// Dynamically load Razorpay standard checkout script
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  eventTitle,
  tierName,
  price,
  ticketTypeId = 'tier-vip-01',
  seatInfo,
  initialRemainingSeconds = 600,
  onPaymentSuccess,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialRemainingSeconds);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'sandbox'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showKeyConfig, setShowKeyConfig] = useState(false);

  // 1. Coupon & Promo Code State
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number; flat: number } | null>(null);

  // 2. Corporate B2B GST Invoicing State
  const [needGstInvoice, setNeedGstInvoice] = useState(false);
  const [companyName, setCompanyName] = useState('Acme Corp India Private Limited');
  const [gstin, setGstin] = useState('29AABCU9603R1ZM');
  const [stateOfSupply, setStateOfSupply] = useState('Karnataka (29)');

  // 3. WhatsApp Split Bill State
  const [showSplitBill, setShowSplitBill] = useState(false);
  const [splitFriendsCount, setSplitFriendsCount] = useState(3);

  // Razorpay Key & Prefill
  const [razorpayKey, setRazorpayKey] = useState<string>(
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_51O2XQ86qU8yB0'
  );
  const [attendeeName, setAttendeeName] = useState('Public User');
  const [attendeeEmail, setAttendeeEmail] = useState('user@eventsphere.ai');
  const [attendeePhone, setAttendeePhone] = useState('9876543210');

  // Timer countdown
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          toast.error('Seat hold expired. Ticket returned to pool.');
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate pricing with coupons
  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.percent > 0) {
      discountAmount = Math.round((price * appliedDiscount.percent) / 100);
    } else if (appliedDiscount.flat > 0) {
      discountAmount = Math.min(price, appliedDiscount.flat);
    }
  }
  const finalPayable = Math.max(0, price - discountAmount);

  // GST Breakdown (18% inclusive)
  const basePrice = Math.round(finalPayable / 1.18);
  const cgst = Math.round((finalPayable - basePrice) / 2);
  const sgst = finalPayable - basePrice - cgst;

  // Apply Promo Coupon
  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'STARTUP50') {
      setAppliedDiscount({ code: 'STARTUP50', percent: 50, flat: 0 });
      toast.success('Coupon STARTUP50 applied: 50% Flat Discount!');
    } else if (code === 'EARLYBIRD') {
      setAppliedDiscount({ code: 'EARLYBIRD', percent: 20, flat: 0 });
      toast.success('Coupon EARLYBIRD applied: 20% Discount!');
    } else if (code === 'BENGALURU100') {
      setAppliedDiscount({ code: 'BENGALURU100', percent: 0, flat: 100 });
      toast.success('Coupon BENGALURU100 applied: ₹100 Flat Off!');
    } else if (code === 'VIPFREE') {
      setAppliedDiscount({ code: 'VIPFREE', percent: 100, flat: 0 });
      toast.success('VIP Sponsor Pass: 100% Complimentary!');
    } else {
      toast.error('Invalid coupon code. Try STARTUP50, EARLYBIRD, or BENGALURU100');
    }
  };

  // Launch Real Razorpay Standard Checkout Popup
  const handleRazorpayCheckout = async () => {
    setIsProcessing(true);
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      toast.error('Could not load Razorpay CDN. Check internet connection or use Instant Sandbox.');
      setIsProcessing(false);
      return;
    }

    try {
      // Step A: Create Order on backend
      const orderRes = await apiClient.post('/payments/razorpay/order', {
        ticketTypeId: ticketTypeId,
        amount: finalPayable,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
      });

      const orderData = orderRes.data?.data;
      if (!orderData?.orderId) {
        throw new Error('Failed to generate Razorpay order ID.');
      }

      toast.info('Opening Razorpay Payment Gateway...');

      // Step B: Configure Razorpay Checkout Options
      const options = {
        key: razorpayKey.trim() || orderData.keyId,
        amount: orderData.amountInPaise,
        currency: orderData.currency || 'INR',
        name: 'EventSphere AI',
        description: `${tierName} • ${eventTitle}`,
        image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        order_id: orderData.orderId,
        prefill: {
          name: attendeeName,
          email: attendeeEmail,
          contact: attendeePhone,
        },
        notes: {
          event: eventTitle,
          tier: tierName,
          seat: seatInfo || 'General Entry',
          gstin: needGstInvoice ? gstin : 'N/A',
          company: needGstInvoice ? companyName : 'Individual',
        },
        theme: {
          color: '#f97316',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.info('Razorpay payment window closed.');
          },
        },
        handler: async function (response: any) {
          try {
            toast.loading('Verifying Razorpay payment signature with backend...');
            const verifyRes = await apiClient.post('/payments/razorpay/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              ticketTypeId: ticketTypeId,
              userEmail: attendeeEmail,
              userName: attendeeName,
            });

            toast.dismiss();
            toast.success(`Payment verified via Razorpay! Pass: ${verifyRes.data?.data?.ticketNumber}`);
            onPaymentSuccess({
              ...verifyRes.data?.data,
              gstin: needGstInvoice ? gstin : undefined,
              companyName: needGstInvoice ? companyName : undefined,
              seatInfo,
            });
          } catch (err: any) {
            toast.dismiss();
            toast.error(err?.response?.data?.message || 'Payment verification failed on server.');
          } finally {
            setIsProcessing(false);
          }
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);

      razorpayInstance.on('payment.failed', function (res: any) {
        toast.error(`Razorpay Payment Failed: ${res.error?.description || 'Transaction declined'}`);
        setIsProcessing(false);
      });

      razorpayInstance.open();
    } catch (err: any) {
      setIsProcessing(false);
      const msg = err?.response?.data?.message || err?.message || 'Failed to initiate Razorpay checkout';
      toast.error(msg);
    }
  };

  // Instant Sandbox Test Gateway
  const handleSandboxAuthorize = async () => {
    setIsProcessing(true);
    try {
      const orderRes = await apiClient.post('/payments/razorpay/order', {
        ticketTypeId: ticketTypeId,
        amount: finalPayable,
        currency: 'INR',
        receipt: `rcpt_sandbox_${Date.now()}`,
      });

      const orderData = orderRes.data?.data;
      const orderId = orderData?.orderId || `order_mock_${Date.now()}`;

      const verifyRes = await apiClient.post('/payments/razorpay/verify', {
        razorpayOrderId: orderId,
        razorpayPaymentId: `pay_test_${Date.now()}`,
        razorpaySignature: 'mock_signature_success',
        ticketTypeId: ticketTypeId,
        userEmail: attendeeEmail,
        userName: attendeeName,
      });

      toast.success(`Payment authorized & verified! Ticket: ${verifyRes.data?.data?.ticketNumber}`);
      onPaymentSuccess({
        ...verifyRes.data?.data,
        gstin: needGstInvoice ? gstin : undefined,
        companyName: needGstInvoice ? companyName : undefined,
        seatInfo,
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Sandbox verification failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // WhatsApp Split Bill Share Link
  const perPersonShare = Math.round(finalPayable / Math.max(1, splitFriendsCount));
  const shareText = encodeURIComponent(
    `Hey! I'm booking our passes for ${eventTitle} on EventSphere AI! 🎟️\n` +
    `Tier: ${tierName}\n` +
    `Total: ₹${finalPayable} | Split between ${splitFriendsCount} of us = ₹${perPersonShare} each.\n` +
    `Pay your share via UPI / Razorpay here: http://localhost:3000/portal`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-neutral-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-orange-950/80 via-neutral-900 to-emerald-950/80 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white tracking-tight">BharatPay & Razorpay Gateway</h3>
                <span className="px-1.5 py-0.2 text-[8px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded uppercase">
                  GST & UPI 2.0
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">Official Checkout • Split Bill • Corporate Invoicing</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-mono font-bold animate-pulse">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Scrollable Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {/* Order Summary Strip */}
          <div className="p-3.5 bg-neutral-950/70 border border-neutral-800 rounded-2xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{tierName}</span>
                {seatInfo && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                    {seatInfo}
                  </span>
                )}
              </div>
              <span className="text-neutral-400 text-[11px] block truncate max-w-xs">{eventTitle}</span>
            </div>
            <div className="text-right">
              <span className="text-neutral-400 text-[10px] uppercase font-bold block">Payable Amount</span>
              <div className="flex items-baseline gap-1.5 justify-end">
                {appliedDiscount && (
                  <span className="text-xs line-through text-neutral-500 font-mono">₹{price}</span>
                )}
                <span className="text-lg font-bold font-mono text-emerald-400">
                  ₹{finalPayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* 1. Coupon & Promo Code Section */}
          <div className="p-3 bg-neutral-950/50 border border-neutral-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-neutral-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Apply Promo Code / Coupon</span>
              </span>
              {appliedDiscount && (
                <button
                  type="button"
                  onClick={() => setAppliedDiscount(null)}
                  className="text-[10px] text-rose-400 hover:underline"
                >
                  Remove ({appliedDiscount.code})
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="e.g. STARTUP50, EARLYBIRD, BENGALURU100"
                className="flex-1 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs uppercase font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-all"
              >
                Apply
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-[9px] text-neutral-400 pt-0.5 no-scrollbar">
              <span className="text-neutral-500">Available:</span>
              <button
                type="button"
                onClick={() => setCouponCode('STARTUP50')}
                className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-mono"
              >
                STARTUP50 (50% Off)
              </button>
              <button
                type="button"
                onClick={() => setCouponCode('EARLYBIRD')}
                className="px-1.5 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded font-mono"
              >
                EARLYBIRD (20% Off)
              </button>
            </div>
          </div>

          {/* 2. WhatsApp 1-Click Pay & Split Bill */}
          <div className="p-3 bg-neutral-950/50 border border-neutral-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-neutral-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Split Bill with Friends via WhatsApp</span>
              </span>
              <button
                type="button"
                onClick={() => setShowSplitBill(!showSplitBill)}
                className="text-[10px] text-emerald-400 hover:underline font-semibold"
              >
                {showSplitBill ? 'Hide Split' : 'Split Amount'}
              </button>
            </div>

            {showSplitBill && (
              <div className="p-3 bg-emerald-950/10 border border-emerald-500/20 rounded-xl space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Number of people:</span>
                  <div className="flex items-center gap-2">
                    {[2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSplitFriendsCount(num)}
                        className={`w-7 h-7 rounded-lg border text-xs font-bold transition-all ${
                          splitFriendsCount === num
                            ? 'bg-emerald-500 text-neutral-950 border-emerald-400'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-neutral-800">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Each Friend Pays</span>
                    <span className="text-sm font-bold font-mono text-emerald-400">
                      ₹{perPersonShare.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share on WhatsApp</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* 3. Corporate B2B GST Invoicing */}
          <div className="p-3 bg-neutral-950/50 border border-neutral-800 rounded-2xl space-y-2.5">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[11px] font-bold text-neutral-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Claim Corporate GST Input Tax Credit (ITC)</span>
              </span>
              <input
                type="checkbox"
                checked={needGstInvoice}
                onChange={(e) => setNeedGstInvoice(e.target.checked)}
                className="w-4 h-4 rounded text-blue-500 accent-blue-500 cursor-pointer"
              />
            </label>

            {needGstInvoice && (
              <div className="space-y-2.5 p-3 bg-blue-950/10 border border-blue-500/20 rounded-xl animate-in fade-in">
                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Company Legal Name</label>
                  <input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                      Company GSTIN (15-Digit)
                    </label>
                    <input
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      maxLength={15}
                      className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">State of Supply</label>
                    <input
                      value={stateOfSupply}
                      onChange={(e) => setStateOfSupply(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Tax Breakdown */}
                <div className="p-2 bg-neutral-900/80 rounded-lg space-y-1 text-[10px] font-mono text-neutral-400">
                  <div className="flex justify-between">
                    <span>Taxable Base (SAC 998596):</span>
                    <span className="text-white">₹{basePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CGST (9%):</span>
                    <span className="text-white">₹{cgst}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST (9%):</span>
                    <span className="text-white">₹{sgst}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-neutral-800 font-bold text-emerald-400">
                    <span>Total Tax-Paid Invoice:</span>
                    <span>₹{finalPayable}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Methods Tabs */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Choose Payment Gateway</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-2.5 rounded-2xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'bg-gradient-to-b from-blue-500/20 to-blue-600/10 border-blue-500 text-white shadow-md'
                    : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <ExternalLink className="w-4 h-4 text-blue-400" />
                <span>Real Razorpay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-2.5 rounded-2xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-gradient-to-b from-orange-500/20 to-orange-600/10 border-orange-500 text-white shadow-md shadow-orange-500/10'
                    : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4 text-orange-400" />
                <span>UPI / BharatPay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('sandbox')}
                className={`p-2.5 rounded-2xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'sandbox'
                    ? 'bg-gradient-to-b from-emerald-500/20 to-emerald-600/10 border-emerald-500 text-white shadow-md'
                    : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>1-Click Test</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            Cancel Hold
          </button>

          {paymentMethod === 'razorpay' ? (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleRazorpayCheckout}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Connecting Razorpay...</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{finalPayable.toLocaleString('en-IN')} with Razorpay</span>
                  <ExternalLink className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSandboxAuthorize}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 hover:from-orange-600 hover:to-emerald-700 text-neutral-950 font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                  <span>Verifying Ticket...</span>
                </>
              ) : (
                <>
                  <span>Authorize ₹{finalPayable.toLocaleString('en-IN')}</span>
                  <ArrowRight className="w-4 h-4 text-neutral-950" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
