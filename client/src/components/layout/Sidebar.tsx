import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, Egg, IndianRupee, ShieldAlert, 
  Package, Receipt, Syringe, FileBarChart, Bot, LogOut, Bird
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/eggs", label: "Egg Collection", icon: Egg },
  { href: "/sales", label: "Egg Sales", icon: IndianRupee },
  { href: "/chickens", label: "Chickens", icon: Bird },
  { href: "/diseases", label: "Health & Disease", icon: ShieldAlert },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/vaccinations", label: "Vaccinations", icon: Syringe },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/ai", label: "AI Assistant", icon: Bot },
];

export function Sidebar() {
  const [location] = useLocation();
  const { logout, user } = useAuth();

  return (
    <aside className="w-72 hidden lg:flex flex-col bg-primary text-primary-foreground h-screen sticky top-0 shadow-2xl z-40">
      <div className="p-8 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg rotate-3">
          <Egg className="text-accent-foreground w-6 h-6 -rotate-3" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight leading-none text-white">PoultryCare</h1>
          <p className="text-xs text-primary-foreground/70 font-medium tracking-wide uppercase mt-0.5">Farm Management</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1.5 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group",
              isActive 
                ? "bg-white text-primary shadow-lg shadow-black/10 scale-[1.02]" 
                : "text-primary-foreground/80 hover:bg-white/10 hover:text-white"
            )}>
              <item.icon size={20} className={cn("transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10 bg-black/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-semibold truncate">{user?.name}</p>
            <p className="text-xs opacity-70 truncate">{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-destructive/90 text-white hover:bg-destructive transition-colors font-medium"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
