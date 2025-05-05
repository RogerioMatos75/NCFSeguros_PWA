import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ClipboardList, Users } from "lucide-react";

export function AdminNavbar() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: ClipboardList, label: "Indicações", path: "/admin/indications" },
    { icon: Users, label: "Promoções", path: "/admin/promote" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background border-b z-50">
      <div className="flex justify-around p-2 max-w-lg mx-auto">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant={location.startsWith(item.path) ? "default" : "ghost"}
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