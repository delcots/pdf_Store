import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, FileText, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductList = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/produtos`);
      const data = await response.json();
      
      if (response.ok) {
        setProdutos(data);
      } else {
        setError(data.erro || 'Erro ao carregar produtos');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (produto) => {
    addToCart(produto);
    // Você pode adicionar uma notificação aqui
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
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
          <p className="text-lg font-semibold">Erro ao carregar produtos</p>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={fetchProdutos} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (produtos.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText size={48} className="mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-600 mb-2">
          Nenhum produto disponível
        </h2>
        <p className="text-gray-500">
          Volte em breve para ver nossos novos produtos!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Produtos Disponíveis
        </h1>
        <p className="text-gray-600">
          Descubra nossa coleção de PDFs digitais de alta qualidade
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {produtos.map((produto) => (
          <Card key={produto.id} className="group hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-0">
              <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-50 to-indigo-100 h-48 flex items-center justify-center">
                {produto.imagem_capa ? (
                  <img 
                    src={produto.imagem_capa} 
                    alt={produto.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-center">
                    <FileText size={48} className="text-blue-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-500">PDF</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1">
                  <Star size={16} className="text-yellow-500 fill-current" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                {produto.nome}
              </h3>
              
              {produto.descricao && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {produto.descricao}
                </p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(produto.preco)}
                </span>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex gap-2">
              <Link to={`/produto/${produto.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  Ver Detalhes
                </Button>
              </Link>
              
              <Button 
                onClick={() => handleAddToCart(produto)}
                className="flex-1"
                disabled={!user}
              >
                <ShoppingCart size={16} className="mr-2" />
                Comprar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {!user && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-blue-800 mb-2">
            <strong>Faça login para comprar produtos</strong>
          </p>
          <p className="text-blue-600 text-sm">
            Crie sua conta ou faça login para adicionar produtos ao carrinho
          </p>
          <div className="mt-3 space-x-2">
            <Link to="/login">
              <Button size="sm">Entrar</Button>
            </Link>
            <Link to="/cadastro">
              <Button variant="outline" size="sm">Cadastrar</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;

