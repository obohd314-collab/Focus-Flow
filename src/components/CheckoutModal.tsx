import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, ShieldCheck, Zap, X, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ThemeConfig } from '@/src/types';
import { supabase } from '@/src/lib/supabase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
}

export default function CheckoutModal({ isOpen, onClose, theme }: CheckoutModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    plan: 'Pro Lifetime',
    amount: 29.00
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('orders')
        .insert([
          { 
            full_name: formData.fullName, 
            email: formData.email, 
            plan: formData.plan,
            amount: formData.amount,
            status: 'completed',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to process order. Please ensure the "orders" table exists in your Supabase project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl z-[110]",
              "p-8 rounded-[2.5rem] border shadow-2xl overflow-hidden",
              theme.colors.cardBg,
              theme.colors.cardBorder,
              theme.font
            )}
          >
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white"
                >
                  <CheckCircle2 className="w-10 h-10" />
                </motion.div>
                <div className="space-y-2">
                  <h2 className={cn("text-3xl font-bold tracking-tight", theme.colors.text)}>Welcome to Focus Flow Pro!</h2>
                  <p className={cn("text-sm opacity-50", theme.colors.text)}>Your order has been secured in the database.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Zap className={cn("w-6 h-6 fill-current", theme.colors.text)} />
                    <h2 className={cn("text-2xl font-bold tracking-tight", theme.colors.text)}>Upgrade to Pro</h2>
                  </div>
                  <button onClick={onClose} className={cn("p-2 rounded-full hover:bg-black/5", theme.colors.text)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Benefits */}
                  <div className="space-y-6">
                    <div className={cn("p-6 rounded-3xl bg-black/5 space-y-4 border", theme.colors.cardBorder)}>
                      <h3 className={cn("text-xs font-bold uppercase tracking-widest opacity-40", theme.colors.text)}>Pro Benefits</h3>
                      <ul className="space-y-3">
                        {[
                          "Cloud Stats Sync",
                          "Exclusive Nature Themes",
                          "Hifi Audio Engine",
                          "Priority Support"
                        ].map((benefit, i) => (
                          <li key={i} className="flex items-center space-x-3 text-sm">
                            <ShieldCheck className={cn("w-4 h-4", theme.colors.accent)} />
                            <span className={theme.colors.text}>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className={cn("text-[10px] uppercase font-bold tracking-widest opacity-40", theme.colors.text)}>Full Name</label>
                      <input
                        required
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="John Doe"
                        className={cn("w-full p-4 rounded-2xl bg-black/5 border outline-none focus:ring-2", theme.colors.cardBorder, theme.colors.text)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={cn("text-[10px] uppercase font-bold tracking-widest opacity-40", theme.colors.text)}>Email Address</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className={cn("w-full p-4 rounded-2xl bg-black/5 border outline-none focus:ring-2", theme.colors.cardBorder, theme.colors.text)}
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className={cn(
                          "w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all",
                          "flex items-center justify-center space-x-2 shadow-xl",
                          `bg-${theme.colors.accent} text-white hover:scale-[1.02] active:scale-95 disabled:opacity-50`
                        )}
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" />
                            <span>Complete Purchase - $29</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
