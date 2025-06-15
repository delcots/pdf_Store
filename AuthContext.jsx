import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/status`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.logado) {
        setUser(data.cliente);
      }
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, senha) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.cliente);
        return { success: true, message: data.mensagem };
      } else {
        return { success: false, message: data.erro };
      }
    } catch (error) {
      return { success: false, message: 'Erro de conexão' };
    }
  };

  const register = async (nome, email, senha) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.cliente);
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
      await fetch(`${API_BASE_URL}/clientes/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.cliente);
        return { success: true, message: data.mensagem };
      } else {
        return { success: false, message: data.erro };
      }
    } catch (error) {
      return { success: false, message: 'Erro de conexão' };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

