import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/status`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.logado) {
        setAdmin(data.admin);
      }
    } catch (error) {
      console.error('Erro ao verificar status de admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (usuario, senha) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ usuario, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        setAdmin(data.admin);
        return { success: true, message: data.mensagem };
      } else {
        return { success: false, message: data.erro };
      }
    } catch (error) {
      return { success: false, message: 'Erro de conexão' };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/admin/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setAdmin(null);
    }
  };

  const createFirstAdmin = async (usuario, senha) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/criar-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.mensagem };
      } else {
        return { success: false, message: data.erro };
      }
    } catch (error) {
      return { success: false, message: 'Erro de conexão' };
    }
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    createFirstAdmin,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

