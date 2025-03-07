import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, UserPlus, History, Gift, User } from "lucide-react";

export function Navbar() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: UserPlus, label: "Indicar", path: "/indicate" },
    { icon: History, label: "Histórico", path: "/history" },
    { icon: Gift, label: "Recompensas", path: "/rewards" },
    { icon: User, label: "Perfil", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="flex justify-around p-2">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant={location === item.path ? "default" : "ghost"}
            size="sm"
            className="flex flex-col items-center gap-1"
            onClick={() => setLocation(item.path)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}
