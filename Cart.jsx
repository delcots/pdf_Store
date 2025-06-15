import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleQuantityChange = (produtoId, novaQuantidade) => {
    if (novaQuantidade < 1) return;
    updateQuantity(produtoId, novaQuantidade);
  };

  const handlePurchase = async (produto) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/carrinho' } } });
      return;
    }

    setLoading(true);
    setPurchaseStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/vendas/comprar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ produto_id: produto.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setPurchaseStatus({
          type: 'success',
          message: 'Compra realizada com sucesso!',
          details: data.email_enviado 
            ? 'O PDF foi enviado para seu email.' 
            : 'Houve um problema no envio do email, mas você pode baixar o produto em seu perfil.'
        });
        
        // Remover produto do carrinho após compra bem-sucedida
        removeFromCart(produto.id);
      } else {
        setPurchaseStatus({
          type: 'error',
          message: data.erro || 'Erro ao processar compra'
        });
      }
    } catch (error) {
      setPurchaseStatus({
        type: 'error',
        message: 'Erro de conexão. Tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <ShoppingCart size={64} className="mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          Faça login para ver seu carrinho
        </h2>
        <p className="text-gray-500 mb-6">
          Você precisa estar logado para adicionar produtos ao carrinho
        </p>
        <div className="space-x-4">
          <Link to="/login">
            <Button>Fazer Login</Button>
          </Link>
          <Link to="/cadastro">
            <Button variant="outline">Cadastrar</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart size={64} className="mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          Seu carrinho está vazio
        </h2>
        <p className="text-gray-500 mb-6">
          Adicione alguns produtos incríveis ao seu carrinho
        </p>
        <Link to="/">
          <Button>
            <ArrowLeft size={16} className="mr-2" />
            Continuar Comprando
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Seu Carrinho
        </h1>
        <p className="text-gray-600">
          Revise seus produtos antes de finalizar a compra
        </p>
      </div>

      {purchaseStatus && (
        <div className={`p-4 rounded-lg mb-6 ${
          purchaseStatus.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`font-semibold ${
            purchaseStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {purchaseStatus.message}
          </p>
          {purchaseStatus.details && (
            <p className={`text-sm mt-1 ${
              purchaseStatus.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {purchaseStatus.details}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de produtos */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((produto) => (
            <Card key={produto.id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {produto.imagem_capa ? (
                      <img 
                        src={produto.imagem_capa} 
                        alt={produto.nome}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">PDF</span>
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

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(produto.id, produto.quantidade - 1)}
                          disabled={produto.quantidade <= 1}
                        >
                          <Minus size={14} />
                        </Button>
                        
                        <span className="w-8 text-center font-medium">
                          {produto.quantidade}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(produto.id, produto.quantidade + 1)}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">
                          {formatPrice(produto.preco * produto.quantidade)}
                        </p>
                        {produto.quantidade > 1 && (
                          <p className="text-sm text-gray-500">
                            {formatPrice(produto.preco)} cada
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(produto.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Remover
                      </Button>

                      <Button
                        onClick={() => handlePurchase(produto)}
                        disabled={loading}
                        size="sm"
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                            Comprando...
                          </div>
                        ) : (
                          <>
                            <CreditCard size={14} className="mr-1" />
                            Comprar Agora
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resumo do carrinho */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'})</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Taxa de processamento</span>
                <span className="text-green-600">Grátis</span>
              </div>
              
              <hr />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">{formatPrice(getCartTotal())}</span>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center">
                  * Cada produto será processado individualmente
                </p>
                <p className="text-xs text-gray-500 text-center">
                  * Os PDFs serão enviados por email após a compra
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={clearCart}
              >
                Limpar Carrinho
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft size={16} className="mr-2" />
            Continuar Comprando
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;

