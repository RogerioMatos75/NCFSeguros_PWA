import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navbar";
import { ProtectedRoute } from "@/components/auth/protected-route";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Splash} />
      <Route path="/auth" component={Auth} />
      <Route path="/admin/login" component={AdminLogin} />
      
      {/* Rotas protegidas administrativas */}
      <Route path="/admin/promote">
        <ProtectedRoute adminOnly>
          <AdminPromote />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/dashboard">
        <ProtectedRoute adminOnly>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/indications">
        <ProtectedRoute adminOnly>
          <AdminIndications />
        </ProtectedRoute>
      </Route>

      {/* Rotas protegidas normais */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/indicate">
        <ProtectedRoute>
          <Indicate />
        </ProtectedRoute>
      </Route>
      <Route path="/history">
        <ProtectedRoute>
          <History />
        </ProtectedRoute>
      </Route>
      <Route path="/rewards">
        <ProtectedRoute>
          <Rewards />
        </ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Router />
        <Navbar />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;