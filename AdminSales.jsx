import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Calendar, 
  DollarSign, 
  User, 
  Package,
  Mail,
  MailCheck,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminSales = () => {
  const [vendas, setVendas] = useState([]);
  const [estatisticas, setEstatisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchVendas();
    fetchEstatisticas();
  }, []);

  const fetchVendas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/vendas`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok) {
        setVendas(data);
      }
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEstatisticas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/vendas/estatisticas`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok) {
        setEstatisticas(data);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const updateVendaStatus = async (vendaId, novoStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/vendas/${vendaId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: novoStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Status da venda atualizado com sucesso!'
        });
        fetchVendas();
        fetchEstatisticas();
      } else {
        setMessage({
          type: 'error',
          text: data.erro || 'Erro ao atualizar status'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erro de conexão'
      });
    } finally {
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
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/admin/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Gerenciar Vendas
          </h1>
          <p className="text-gray-600">
            Acompanhe e gerencie todas as vendas da loja
          </p>
        </div>
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

      {/* Estatísticas */}
      {estatisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                  <p className="text-3xl font-bold text-blue-600">{estatisticas.total_vendas}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="text-blue-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatPrice(estatisticas.total_receita)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-green-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vendas Concluídas</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {estatisticas.vendas_por_status.concluida || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="text-purple-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vendas Pendentes</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {estatisticas.vendas_por_status.pendente || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-orange-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Produtos mais vendidos */}
      {estatisticas && estatisticas.produtos_mais_vendidos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 size={20} />
              <span>Produtos Mais Vendidos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {estatisticas.produtos_mais_vendidos.map((produto, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="font-medium">{produto.nome}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {produto.total_vendas} vendas
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de vendas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart size={20} />
            <span>Todas as Vendas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : vendas.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Nenhuma venda registrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vendas.map((venda) => (
                <div key={venda.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-semibold text-lg text-gray-800">
                          Venda #{venda.id}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(venda.status)}`}>
                          {getStatusText(venda.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <User size={14} />
                          <span>{venda.cliente_nome}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Package size={14} />
                          <span>{venda.produto_nome}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Calendar size={14} />
                          <span>{formatDate(venda.data_venda)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <DollarSign size={14} />
                          <span className="font-semibold text-blue-600">
                            {formatPrice(venda.preco_total)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-4">
                        {venda.email_enviado ? (
                          <div className="flex items-center space-x-1 text-green-600 text-xs">
                            <MailCheck size={12} />
                            <span>Email enviado</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-orange-600 text-xs">
                            <Mail size={12} />
                            <span>Email não enviado</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <Select
                        value={venda.status}
                        onValueChange={(novoStatus) => updateVendaStatus(venda.id, novoStatus)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="concluida">Concluída</SelectItem>
                          <SelectItem value="cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
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

export default AdminSales;

