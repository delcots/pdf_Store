import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Download, RefreshCw, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    nome: '',
    email: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    if (user) {
      setEditData({
        nome: user.nome,
        email: user.email
      });
      fetchCompras();
    }
  }, [user]);

  const fetchCompras = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/vendas/minhas-compras`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok) {
        setCompras(data);
      }
    } catch (error) {
      console.error('Erro ao carregar compras:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReenviarEmail = async (vendaId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vendas/${vendaId}/reenviar-email`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      
      setMessage({
        type: data.email_enviado ? 'success' : 'error',
        text: data.mensagem_email || data.mensagem
      });
      
      // Limpar mensagem após 5 segundos
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erro ao reenviar email'
      });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setMessage(null);

    try {
      const result = await updateProfile(editData);
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: result.message
        });
        setEditMode(false);
      } else {
        setMessage({
          type: 'error',
          text: result.message
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erro inesperado. Tente novamente.'
      });
    } finally {
      setUpdateLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'concluida':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pendente':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'cancelada':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'concluida':
        return 'Concluída';
      case 'pendente':
        return 'Pendente';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Meu Perfil
        </h1>
        <p className="text-gray-600">
          Gerencie suas informações pessoais e veja seu histórico de compras
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Informações do perfil */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <User size={20} />
            <span>Informações Pessoais</span>
          </CardTitle>
          {!editMode && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setEditMode(true)}
            >
              <Edit2 size={16} className="mr-1" />
              Editar
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editMode ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={editData.nome}
                    onChange={(e) => setEditData({...editData, nome: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  disabled={updateLoading}
                  size="sm"
                >
                  {updateLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-1" />
                      Salvar
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setEditMode(false);
                    setEditData({
                      nome: user.nome,
                      email: user.email
                    });
                  }}
                >
                  <X size={16} className="mr-1" />
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Nome</p>
                    <p className="font-medium">{user.nome}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Membro desde</p>
                    <p className="font-medium">{formatDate(user.data_cadastro)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Histórico de compras */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download size={20} />
            <span>Histórico de Compras</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : compras.length === 0 ? (
            <div className="text-center py-8">
              <Download size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Você ainda não fez nenhuma compra</p>
            </div>
          ) : (
            <div className="space-y-4">
              {compras.map((compra) => (
                <div key={compra.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {compra.produto_nome}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span>Compra #{compra.id}</span>
                        <span>{formatDate(compra.data_venda)}</span>
                        <span className="font-semibold text-blue-600">
                          {formatPrice(compra.preco_total)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(compra.status)}`}>
                          {getStatusText(compra.status)}
                        </span>
                        {compra.email_enviado ? (
                          <span className="text-xs text-green-600">✓ Email enviado</span>
                        ) : (
                          <span className="text-xs text-orange-600">⚠ Email não enviado</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {!compra.email_enviado && compra.status === 'concluida' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReenviarEmail(compra.id)}
                        >
                          <RefreshCw size={14} className="mr-1" />
                          Reenviar Email
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

