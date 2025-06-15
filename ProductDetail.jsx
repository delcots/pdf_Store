import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, FileText, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchProduto();
  }, [id]);

  const fetchProduto = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/produtos/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setProduto(data);
      } else {
        setError(data.erro || 'Produto não encontrado');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/produto/${id}` } } });
      return;
    }
    addToCart(produto);
    // Você pode adicionar uma notificação aqui
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <FileText size={48} className="mx-auto mb-2" />
          <p className="text-lg font-semibold">Produto não encontrado</p>
          <p className="text-sm">{error}</p>
        </div>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft size={16} className="mr-2" />
            Voltar para produtos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Voltar para produtos
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Imagem do produto */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 h-96 flex items-center justify-center">
                {produto.imagem_capa ? (
                  <img 
                    src={produto.imagem_capa} 
                    alt={produto.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <FileText size={64} className="text-blue-400 mx-auto mb-4" />
                    <span className="text-lg text-gray-500">Documento PDF</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <Star size={20} className="text-yellow-500 fill-current" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações adicionais */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-3">Informações do Produto</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Formato:</span>
                  <span className="font-medium">PDF Digital</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Entrega:</span>
                  <span className="font-medium">Imediata por email</span>
                </div>
                {produto.data_criacao && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Adicionado em:</span>
                    <span className="font-medium flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(produto.data_criacao)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalhes do produto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {produto.nome}
            </h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-4xl font-bold text-blue-600">
                {formatPrice(produto.preco)}
              </span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className="text-yellow-400 fill-current" 
                  />
                ))}
                <span className="text-sm text-gray-500 ml-2">(5.0)</span>
              </div>
            </div>

            {produto.descricao && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Descrição</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {produto.descricao}
                </p>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="space-y-4">
            {user ? (
              <div className="space-y-3">
                <Button 
                  onClick={handleAddToCart}
                  className="w-full text-lg py-6"
                  size="lg"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Adicionar ao Carrinho
                </Button>
                
                <p className="text-sm text-gray-500 text-center">
                  ✓ Entrega imediata por email após a compra
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 font-medium mb-2">
                    Faça login para comprar este produto
                  </p>
                  <p className="text-blue-600 text-sm">
                    Crie sua conta ou faça login para adicionar ao carrinho
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" state={{ from: { pathname: `/produto/${id}` } }}>
                    <Button variant="outline" className="w-full">
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/cadastro" state={{ from: { pathname: `/produto/${id}` } }}>
                    <Button className="w-full">
                      Cadastrar
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Garantias */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-3">Garantias</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Download imediato após a compra</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Arquivo PDF de alta qualidade</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Suporte por email em caso de problemas</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Acesso vitalício ao produto comprado</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

