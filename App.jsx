import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProducts from './components/admin/AdminProducts';
import AdminClients from './components/admin/AdminClients';
import AdminSales from './components/admin/AdminSales';
import AdminSettings from './components/admin/AdminSettings';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import { CartProvider } from './contexts/CartContext';
import './App.css';

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          {/* Rotas administrativas */}
          <Route path="/admin" element={<Navigate to="/admin/login" />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
          <Route path="/admin/produtos" element={<AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>} />
          <Route path="/admin/clientes" element={<AdminProtectedRoute><AdminClients /></AdminProtectedRoute>} />
          <Route path="/admin/vendas" element={<AdminProtectedRoute><AdminSales /></AdminProtectedRoute>} />
          <Route path="/admin/configuracoes" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AdminProtectedRoute({ children }) {
  const { admin } = useAdmin();
  return admin ? children : <Navigate to="/admin/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

