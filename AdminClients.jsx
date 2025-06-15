import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Mail, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminClients = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/clientes`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok) {
        setClientes(data);
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleClienteStatus = async (clienteId, novoStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/clientes/${clienteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ativo: novoStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `Cliente ${novoStatus ? 'ativado' : 'desativado'} com sucesso!`
        });
        fetchClientes();
      } else {
        setMessage({
          type: 'error',
          text: data.erro || 'Erro ao atualizar cliente'
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            Gerenciar Clientes
          </h1>
          <p className="text-gray-600">
            Visualize e gerencie os clientes cadastrados na loja
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

      {/* Lista de clientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users size={20} />
            <span>Clientes Cadastrados</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : clientes.length === 0 ? (
            <div className="text-center py-8">
              <Users size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Nenhum cliente cadastrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {clientes.map((cliente) => (
                <div key={cliente.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users size={20} className="text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800 mb-1">
                          {cliente.nome}
                        </h3>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Mail size={14} />
                            <span>{cliente.email}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Calendar size={14} />
                            <span>Cadastrado em {formatDate(cliente.data_cadastro)}</span>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            cliente.ativo 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {cliente.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleClienteStatus(cliente.id, !cliente.ativo)}
                        className={cliente.ativo ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
                      >
                        {cliente.ativo ? (
                          <>
                            <ToggleRight size={14} className="mr-1" />
                            Desativar
                          </>
                        ) : (
                          <>
                            <ToggleLeft size={14} className="mr-1" />
                            Ativar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas */}
      {clientes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {clientes.length}
                </p>
                <p className="text-sm text-gray-600">Total de Clientes</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {clientes.filter(c => c.ativo).length}
                </p>
                <p className="text-sm text-gray-600">Clientes Ativos</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {clientes.filter(c => !c.ativo).length}
                </p>
                <p className="text-sm text-gray-600">Clientes Inativos</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminClients;

