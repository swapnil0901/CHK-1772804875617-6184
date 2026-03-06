import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Input, Button, Card } from "@/components/ui-kit";
import { Egg } from "lucide-react";
import { motion } from "framer-motion";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, isLoggingIn, isRegistering } = useAuth();
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'worker' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register(formData as any);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-primary rounded-2xl items-center justify-center shadow-xl shadow-primary/30 mb-4 rotate-3">
            <Egg className="text-white w-8 h-8 -rotate-3" />
          </div>
          <h1 className="text-4xl font-bold font-display text-primary tracking-tight">PoultryCare</h1>
          <p className="text-muted-foreground mt-2 text-lg">Smart farm management system</p>
        </div>

        <Card className="p-8 shadow-2xl shadow-black/5">
          <h2 className="text-2xl font-bold mb-6 font-display text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input 
                label="Full Name" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            )}
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="you@farm.com" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              required
            />
            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-foreground/80 ml-1">Role</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl bg-white border-2 border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="worker">Worker</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full mt-6" 
              size="lg"
              disabled={isLoggingIn || isRegistering}
            >
              {isLoggingIn || isRegistering ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm font-medium">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-primary hover:underline hover:text-primary-light transition-colors"
            >
              {isLogin ? "Sign up here" : "Sign in here"}
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
