import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Upload, 
  FileText, 
  Image,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const AdminProducts = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    caminho_pdf: '',
    imagem_capa: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/produtos`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok) {
        setProdutos(data);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage(null);

    try {
      const url = editingProduct 
        ? `${API_BASE_URL}/produtos/${editingProduct.id}`
        : `${API_BASE_URL}/produtos`;
      
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          preco: parseFloat(formData.preco)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: editingProduct ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!'
        });
        
        resetForm();
        fetchProdutos();
      } else {
        setMessage({
          type: 'error',
          text: data.erro || 'Erro ao salvar produto'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erro de conexão'
      });
    } finally {
      setFormLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleEdit = (produto) => {
    setEditingProduct(produto);
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao || '',
      preco: produto.preco.toString(),
      caminho_pdf: produto.caminho_pdf || '',
      imagem_capa: produto.imagem_capa || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (produtoId) => {
    if (!confirm('Tem certeza que deseja desativar este produto?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/produtos/${produtoId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Produto desativado com sucesso!'
        });
        fetchProdutos();
      } else {
        const data = await response.json();
        setMessage({
          type: 'error',
          text: data.erro || 'Erro ao desativar produto'
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

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      caminho_pdf: '',
      imagem_capa: ''
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Gerenciar Produtos
            </h1>
            <p className="text-gray-600">
              Adicione, edite e gerencie os produtos da sua loja
            </p>
          </div>
        </div>
        
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus size={16} className="mr-2" />
            Novo Produto
          </Button>
        )}
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

      {/* Formulário */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</span>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X size={16} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Produto *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Nome do produto"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço *</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.preco}
                    onChange={(e) => setFormData({...formData, preco: e.target.value})}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Descrição do produto"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="caminho_pdf">Caminho do PDF</Label>
                  <Input
                    id="caminho_pdf"
                    value={formData.caminho_pdf}
                    onChange={(e) => setFormData({...formData, caminho_pdf: e.target.value})}
                    placeholder="/caminho/para/arquivo.pdf"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="imagem_capa">URL da Imagem de Capa</Label>
                  <Input
                    id="imagem_capa"
                    value={formData.imagem_capa}
                    onChange={(e) => setFormData({...formData, imagem_capa: e.target.value})}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      {editingProduct ? 'Atualizar' : 'Criar'} Produto
                    </>
                  )}
                </Button>
                
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de produtos */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : produtos.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Nenhum produto cadastrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {produtos.map((produto) => (
                <div key={produto.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {produto.imagem_capa ? (
                          <img 
                            src={produto.imagem_capa} 
                            alt={produto.nome}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <FileText size={24} className="text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800 mb-1">
                          {produto.nome}
                        </h3>
                        
                        {produto.descricao && (
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {produto.descricao}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="font-semibold text-blue-600">
                            {formatPrice(produto.preco)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            produto.ativo 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {produto.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(produto)}
                      >
                        <Edit size={14} className="mr-1" />
                        Editar
                      </Button>
                      
                      {produto.ativo && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(produto.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Desativar
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

export default AdminProducts;

