import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Egg } from "lucide-react";
import { Link } from "wouter";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useAuth or component
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-primary text-white p-4 flex items-center justify-between shadow-md z-30 sticky top-0">
          <div className="flex items-center gap-2">
            <Egg className="text-accent" />
            <span className="font-bold font-display text-xl">PoultryCare</span>
          </div>
          <div className="flex gap-2">
             <Link href="/" className="p-2 bg-white/10 rounded-lg"><Egg size={20}/></Link>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
          {/* Decorative background blur */}
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10 pointer-events-none" />
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, action }: { title: string, description: string, action?: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-display text-primary tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-2 text-lg">{description}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
