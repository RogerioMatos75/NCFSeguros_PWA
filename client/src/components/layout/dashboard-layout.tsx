import { Link } from "wouter";
import { Home, UserPlus, History, Gift, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
    return (
        <Link href={href}>
            <a className={cn(
                "flex flex-col items-center justify-center p-2 text-sm",
                isActive ? "text-primary" : "text-muted-foreground"
            )}>
                {icon}
                <span className="mt-1">{label}</span>
            </a>
        </Link>
    );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    // Obtém o caminho atual
    const pathname = window.location.pathname;

    return (
        <div className="min-h-screen pb-16">
            {/* Conteúdo principal */}
            <main className="container mx-auto px-4">
                {children}
            </main>

            {/* Navegação fixa na parte inferior */}
            <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
                <div className="grid grid-cols-5 gap-1">
                    <NavItem
                        href="/dashboard"
                        icon={<Home className="h-5 w-5" />}
                        label="Início"
                        isActive={pathname === "/dashboard"}
                    />
                    <NavItem
                        href="/indicate"
                        icon={<UserPlus className="h-5 w-5" />}
                        label="Indicar"
                        isActive={pathname === "/indicate"}
                    />
                    <NavItem
                        href="/history"
                        icon={<History className="h-5 w-5" />}
                        label="Histórico"
                        isActive={pathname === "/history"}
                    />
                    <NavItem
                        href="/rewards"
                        icon={<Gift className="h-5 w-5" />}
                        label="Recompensas"
                        isActive={pathname === "/rewards"}
                    />
                    <NavItem
                        href="/profile"
                        icon={<User className="h-5 w-5" />}
                        label="Perfil"
                        isActive={pathname === "/profile"}
                    />
                </div>
            </nav>
        </div>
    );
}