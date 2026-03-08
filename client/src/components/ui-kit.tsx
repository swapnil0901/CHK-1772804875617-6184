import React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

type SafeDivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" |
  "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
>;
type SafeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" |
  "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
>;

// Enhanced Card with gradient effects and animations
export const Card = ({ children, className, ...props }: SafeDivProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    viewport={{ once: true, margin: "-100px" }}
    className={cn("glass-card rounded-2xl p-6 relative overflow-hidden group border border-white/30", className)} 
    {...props}
  >
    {/* Animated gradient background */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -z-10 transition-all duration-500 group-hover:scale-150 group-hover:from-primary/20" />
    
    {/* Bottom left accent */}
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/5 to-transparent rounded-tr-full -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    
    {/* Subtle border glow on hover */}
    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
      background: 'radial-gradient(circle at top right, rgba(142, 143, 44, 0.2), transparent)',
    }} />
    
    <div className="relative z-10">
      {children}
    </div>
  </motion.div>
);

// Enhanced Button with multiple variants and animations
export const Button = React.forwardRef<HTMLButtonElement, SafeButtonProps & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient', size?: 'sm' | 'md' | 'lg' }>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 border border-primary/30 hover:border-primary/50 active:shadow-md active:translate-y-0.5",
      secondary: "bg-gradient-to-br from-secondary to-secondary/70 text-secondary-foreground shadow-md shadow-black/5 hover:shadow-lg hover:from-secondary/90 border border-secondary/40",
      outline: "bg-white/50 border-2 border-primary/30 text-primary hover:border-primary hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/20",
      ghost: "bg-transparent text-foreground hover:bg-black/5 border border-transparent hover:border-primary/20 hover:shadow-md",
      gradient: "bg-gradient-to-r from-primary via-primary/70 to-accent text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 border border-primary/30",
    };
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg font-bold",
    };

    return (
      <motion.button
        ref={ref}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        className={cn(
          "rounded-xl font-semibold transition-all duration-200 ease-out flex items-center justify-center gap-2 backdrop-blur-sm",
          variants[variant],
          sizes[size],
          disabled && "opacity-50 cursor-not-allowed transform-none shadow-none",
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

// Enhanced Input with focus animations
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label?: string, error?: string }>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-2">
        {label && <label className="text-sm font-semibold text-foreground/70 ml-2 block">{label}</label>}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <input
            ref={ref}
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border-2 border-border/40 text-foreground placeholder:text-muted-foreground/40",
              "focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all duration-200",
              "focus:shadow-lg focus:shadow-primary/10 focus:bg-white/80",
              error && "border-destructive focus:border-destructive focus:ring-destructive/15 focus:shadow-lg focus:shadow-destructive/10",
              className
            )}
            {...props}
          />
          {/* Focus glow effect */}
          <div className="absolute inset-0 rounded-xl opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none blur-xl"
            style={{ background: 'radial-gradient(circle, rgba(142, 143, 44, 0.2), transparent)' }} />
        </motion.div>
        {error && <span className="text-xs font-medium text-destructive ml-2">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

// Enhanced Select with animations
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string, error?: string }>(
  ({ className, label, error, children, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-2">
        {label && <label className="text-sm font-semibold text-foreground/70 ml-2 block">{label}</label>}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border-2 border-border/40 text-foreground appearance-none",
              "focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all duration-200 cursor-pointer",
              "focus:shadow-lg focus:shadow-primary/10 focus:bg-white/80",
              error && "border-destructive focus:border-destructive focus:ring-destructive/15",
              className
            )}
            {...props}
          >
            {children}
          </select>
          {/* Chevron icon */}
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-primary/50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
        {error && <span className="text-xs font-medium text-destructive ml-2">{error}</span>}
      </div>
    );
  }
);
Select.displayName = "Select";

// Enhanced Modal with better animations
export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-lg card-gradient rounded-3xl shadow-2xl overflow-hidden border border-white/40 pointer-events-auto">
              {/* Gradient header */}
              <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between bg-gradient-to-r from-primary/5 to-accent/5">
                <h2 className="text-xl font-bold font-display text-primary">{title}</h2>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose} 
                  className="p-2 hover:bg-black/5 rounded-full transition-colors text-foreground/50 hover:text-foreground"
                >
                  <X size={20} />
                </motion.button>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Enhanced DataTable with better styling
export const DataTable = ({ headers, children }: { headers: string[], children: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="w-full overflow-x-auto rounded-2xl border border-border/40 bg-white/60 backdrop-blur-sm shadow-lg shadow-black/5 overflow-hidden"
  >
    <table className="w-full text-left border-collapse min-w-[600px]">
      <thead>
        <tr className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/30">
          {headers.map((h, i) => (
            <th key={i} className="px-6 py-4 font-semibold text-sm text-foreground/70 uppercase tracking-wider">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border/20">
        {children}
      </tbody>
    </table>
  </motion.div>
);
