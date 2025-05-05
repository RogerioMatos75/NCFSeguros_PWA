// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; // Adjust path if needed

// Import your page components
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Products from './pages/Products';
import Orders from './pages/Orders';
import AdminUsers from './pages/AdminUsers';
import AdminSettings from './pages/AdminSettings';
import AdminReports from './pages/AdminReports';
import UserManagement from './pages/UserManagement'; // Assuming this is the component for line 51
import LoginPage from './pages/LoginPage'; // Example public route
import NotFoundPage from './pages/NotFoundPage'; // Example catch-all

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard" // Route handles the path
          element={ // Route uses the element prop
            <ProtectedRoute> {/* ProtectedRoute wraps the component */}
              <Dashboard /> {/* The actual component to render */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
         <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
         <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute isAdminRoute={true}> {/* Pass isAdminRoute here */}
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute isAdminRoute={true}>
              <AdminSettings />
            </ProtectedRoute>
          }
        />
         <Route
          path="/admin/reports"
          element={
            <ProtectedRoute isAdminRoute={true}>
              <AdminReports />
            </ProtectedRoute>
          }
        />

        {/* Another Protected Route (assuming line 51 was meant to be protected) */}
         <Route
          path="/user-management" // Example path
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Route for 404 */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </Router>
  );
}

export default App;
