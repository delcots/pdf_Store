import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Carregar carrinho do localStorage ao inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (produto) => {
    setCartItems(prevItems => {
      // Verificar se o produto já está no carrinho
      const existingItem = prevItems.find(item => item.id === produto.id);
      
      if (existingItem) {
        // Se já existe, aumentar a quantidade
        return prevItems.map(item =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      } else {
        // Se não existe, adicionar novo item
        return [...prevItems, { ...produto, quantidade: 1 }];
      }
    });
  };

  const removeFromCart = (produtoId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== produtoId));
  };

  const updateQuantity = (produtoId, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removeFromCart(produtoId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === produtoId
          ? { ...item, quantidade: novaQuantidade }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantidade, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

