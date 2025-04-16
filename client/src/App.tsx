import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navbar";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Splash from "@/pages/splash";
import Auth from "@/pages/auth";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import Dashboard from "@/pages/dashboard";
import Indicate from "@/pages/indicate";
import History from "@/pages/history";
import Rewards from "@/pages/rewards";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import AdminPromote from "@/pages/admin/promote";
import AdminIndications from "@/pages/admin/indications";

// Layout para páginas que precisam de autenticação
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {children}
      <Navbar />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Splash} />
      <Route path="/auth" component={Auth} />
      <Route path="/admin/login" component={AdminLogin} />

      {/* Rotas protegidas administrativas */}
      <Route path="/admin/promote">
        <ProtectedRoute adminOnly>
          <AuthenticatedLayout>
            <AdminPromote />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/dashboard">
        <ProtectedRoute adminOnly>
          <AuthenticatedLayout>
            <AdminDashboard />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/indications">
        <ProtectedRoute adminOnly>
          <AuthenticatedLayout>
            <AdminIndications />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      {/* Rotas protegidas normais */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Dashboard />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/indicate">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Indicate />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/history">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <History />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/rewards">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Rewards />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Profile />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Router />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;