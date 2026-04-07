/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  History, 
  Plus, 
  Send, 
  LogOut, 
  UtensilsCrossed, 
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Truck
} from 'lucide-react';

// --- Types ---

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'xis' | 'bebidas' | 'porcoes' | 'pizzas';
  image: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  createdAt: number;
  items: CartItem[];
  total: number;
  deliveryFee: number;
  type: 'delivery' | 'pickup';
  status: 'pending' | 'preparing' | 'shipped' | 'delivered';
}

// --- Constants ---
const DELIVERY_FEE = 13.50;

// --- Mock Data ---

const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Xis Calabresa',
    description: 'Calabresa defumada acebolada, ovo, queijo, alface e maionese especial.',
    price: 29.90,
    category: 'xis',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=500'
  },
  {
    id: '2',
    name: 'Xis da Casa',
    description: 'O completo! Carne, bacon, calabresa, coração, ovo e queijo duplo.',
    price: 36.00,
    category: 'xis',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=500'
  },
  {
    id: '3',
    name: 'Xis Duplo Bacon',
    description: 'Duas carnes artesanais 150g e porção generosa de bacon crocante.',
    price: 42.90,
    category: 'xis',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500'
  },
  {
    id: '4',
    name: 'Xis Salada',
    description: 'Hambúrguer de carne bovina, queijo, ovo, alface, tomate, milho e ervilha.',
    price: 26.50,
    category: 'xis',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=500'
  },
  {
    id: '5',
    name: 'Porção de Batatas',
    description: '400g de batatas fritas crocantes com cheddar e bacon.',
    price: 22.00,
    category: 'porcoes',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=500'
  },
  {
    id: '6',
    name: 'Refri Lata',
    description: 'Coca-cola, Guaraná Antarctica ou Sprite (350ml).',
    price: 6.00,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=500'
  },
  {
    id: '7',
    name: 'Cerveja Long Neck',
    description: 'Heineken, Stella Artois ou Budweiser.',
    price: 12.00,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1618885472179-5e474019f2a9?q=80&w=500'
  },
  {
    id: '8',
    name: 'Pizza Calabresa',
    description: 'Molho de tomate, mussarela, calabresa fatiada, cebola e orégano.',
    price: 45.00,
    category: 'pizzas',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500'
  },
  {
    id: '9',
    name: 'Pizza Margherita',
    description: 'Molho de tomate, mussarela, manjericão fresco e azeite de oliva.',
    price: 42.00,
    category: 'pizzas',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=500'
  },
  {
    id: '10',
    name: 'Pizza Portuguesa',
    description: 'Mussarela, presunto, ovos, cebola, ervilha e azeitonas.',
    price: 48.00,
    category: 'pizzas',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500'
  },
  {
    id: '11',
    name: 'Suco Natural',
    description: 'Laranja, Limão ou Abacaxi com hortelã (500ml).',
    price: 9.00,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=500'
  },
  {
    id: '12',
    name: 'Água Mineral',
    description: 'Com ou sem gás (500ml).',
    price: 4.50,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=500'
  }
];

// --- Components ---

export default function App() {
  const [user, setUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'delivery'>('menu');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [deliveryOption, setDeliveryOption] = useState<'delivery' | 'pickup'>('delivery');

  // Login Logic
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.username && loginData.password) {
      setUser(loginData.username);
    }
  };

  // Cart Logic
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    triggerToast(`${item.name} adicionado!`);
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const finalizeOrder = () => {
    if (cart.length === 0) return;

    const now = new Date();
    const fee = deliveryOption === 'delivery' ? DELIVERY_FEE : 0;
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: now.toLocaleString('pt-BR'),
      createdAt: now.getTime(),
      items: [...cart],
      total: cartTotal + fee,
      deliveryFee: fee,
      type: deliveryOption,
      status: 'pending'
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    triggerToast('Pedido enviado com sucesso!');
    setTimeout(() => setActiveTab('orders'), 1000);
  };

  const updateOrderStatus = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const statusMap: Record<Order['status'], Order['status']> = {
          'pending': 'preparing',
          'preparing': 'shipped',
          'shipped': 'delivered',
          'delivered': 'pending'
        };
        const newStatus = statusMap[order.status];
        triggerToast(`Pedido #${order.id} agora está: ${
          newStatus === 'pending' ? 'Pendente' : 
          newStatus === 'preparing' ? 'Preparando' : 
          newStatus === 'shipped' ? 'Saiu para Entrega' : 'Entregue'
        }`);
        return { ...order, status: newStatus };
      }
      return order;
    }));
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed className="text-primary w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-dark">Lancheria Delícia</h1>
            <p className="text-gray-500">Entre para acessar o cardápio</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="Seu nome"
                value={loginData.username}
                onChange={e => setLoginData(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={loginData.password}
                onChange={e => setLoginData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              ENTRAR
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <header className="bg-dark text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="text-primary w-6 h-6" />
            <span className="font-bold text-lg hidden sm:block">Lancheria Delícia</span>
          </div>

          <nav className="flex bg-white/10 rounded-full p-1">
            <button 
              onClick={() => setActiveTab('menu')}
              className={`px-4 sm:px-6 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${activeTab === 'menu' ? 'bg-primary text-white shadow-md' : 'text-gray-300 hover:text-white'}`}
            >
              CARDÁPIO
            </button>
            <button 
              onClick={() => setActiveTab('delivery')}
              className={`px-4 sm:px-6 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${activeTab === 'delivery' ? 'bg-primary text-white shadow-md' : 'text-gray-300 hover:text-white'}`}
            >
              TELE
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-4 sm:px-6 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-primary text-white shadow-md' : 'text-gray-300 hover:text-white'}`}
            >
              PEDIDOS
              {orders.length > 0 && (
                <span className="bg-white text-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {orders.length}
                </span>
              )}
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs text-gray-400">Bem-vindo,</span>
              <span className="text-sm font-medium">{user}</span>
            </div>
            <button 
              onClick={() => setUser(null)}
              className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'menu' ? (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-12"
            >
              {/* Categories */}
              {(['xis', 'pizzas', 'porcoes', 'bebidas'] as const).map(category => (
                <section key={category}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 capitalize">
                    {category === 'xis' && '🍔'}
                    {category === 'pizzas' && '🍕'}
                    {category === 'porcoes' && '🍟'}
                    {category === 'bebidas' && '🥤'}
                    {category === 'xis' ? 'Xis da Casa' : category}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {MENU_ITEMS.filter(item => item.category === category).map(item => (
                      <motion.div 
                        key={item.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-primary shadow-sm">
                            R$ {item.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-dark mb-2">{item.name}</h3>
                          <p className="text-gray-500 text-sm line-clamp-2 mb-4">{item.description}</p>
                          <button 
                            onClick={() => addToCart(item)}
                            className="w-full bg-dark hover:bg-primary text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors group-active:scale-95"
                          >
                            <Plus className="w-5 h-5" />
                            ADICIONAR
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              ))}
            </motion.div>
          ) : activeTab === 'delivery' ? (
            <motion.div 
              key="delivery"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 text-center">
                <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Truck className="text-primary w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-dark mb-4">Tele Entrega</h2>
                <p className="text-gray-500 mb-12">Estamos prontos para levar o melhor sabor até você!</p>

                <div className="grid gap-6 text-left">
                  <div className="flex items-start gap-4 p-6 bg-bg rounded-3xl border border-gray-100">
                    <div className="bg-white p-3 rounded-2xl shadow-sm">
                      <Truck className="text-primary w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-dark">Taxa de Entrega</h3>
                      <p className="text-primary font-bold text-xl">R$ {DELIVERY_FEE.toFixed(2).replace('.', ',')}</p>
                      <p className="text-gray-500 text-sm">Valor fixo para toda a região central</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-bg rounded-3xl border border-gray-100">
                    <div className="bg-white p-3 rounded-2xl shadow-sm">
                      <MapPin className="text-primary w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-dark">Nosso Endereço</h3>
                      <p className="text-gray-500">Av. Principal, 1234 - Bairro Centro</p>
                      <p className="text-gray-500">Porto Alegre - RS</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-bg rounded-3xl border border-gray-100">
                    <div className="bg-white p-3 rounded-2xl shadow-sm">
                      <Phone className="text-primary w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-dark">Telefone / WhatsApp</h3>
                      <p className="text-primary font-bold text-xl">(51) 99876-5432</p>
                      <p className="text-gray-500 text-sm">Atendimento das 18h às 23h30</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                  <p className="text-sm text-primary font-medium">
                    🚀 Entrega rápida em até 1 hora para toda a região central!
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <History className="text-primary" />
                Histórico de Pedidos
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                  <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">Nenhum pedido realizado ainda.</p>
                  <button 
                    onClick={() => setActiveTab('menu')}
                    className="mt-4 text-primary font-bold hover:underline"
                  >
                    Ver cardápio
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <motion.div 
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-6 rounded-3xl shadow-sm border-l-8 border-primary relative overflow-hidden"
                    >
                      {order.status !== 'delivered' && (
                        <div className="absolute top-0 right-0 h-1 bg-gray-100 w-full">
                          <motion.div 
                            initial={{ width: '0%' }}
                            animate={{ width: order.status === 'pending' ? '25%' : order.status === 'preparing' ? '60%' : '90%' }}
                            className="h-full bg-primary"
                          />
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">PEDIDO #{order.id}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${order.type === 'delivery' ? 'bg-primary/10 text-primary' : 'bg-dark/10 text-dark'}`}>
                              {order.type === 'delivery' ? 'TELE' : 'RETIRADA'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                            <Clock className="w-4 h-4" />
                            {order.date}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <button 
                            onClick={() => updateOrderStatus(order.id)}
                            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors ${
                              order.status === 'pending' ? 'bg-gray-100 text-gray-600' :
                              order.status === 'preparing' ? 'bg-orange-50 text-primary' :
                              order.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                              'bg-green-50 text-green-600'
                            }`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              order.status === 'pending' ? 'bg-gray-400' :
                              order.status === 'preparing' ? 'bg-primary animate-pulse' :
                              order.status === 'shipped' ? 'bg-blue-500 animate-bounce' :
                              'bg-green-500'
                            }`} />
                            {order.status === 'pending' ? 'PENDENTE' : 
                             order.status === 'preparing' ? 'PREPARANDO' : 
                             order.status === 'shipped' ? 'SAIU PARA ENTREGA' : 'ENTREGUE'}
                          </button>
                          
                          {order.status !== 'delivered' && (
                            <div className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              PREVISÃO: ~{order.type === 'delivery' ? '1 HORA' : '45 MIN'}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="border-y border-gray-50 py-4 my-4">
                        <ul className="space-y-2">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                <span className="font-bold text-dark">{item.quantity}x</span> {item.name}
                              </span>
                              <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                          {order.deliveryFee > 0 && (
                            <li className="flex justify-between text-sm pt-2 border-t border-gray-50 mt-2">
                              <span className="text-gray-500 italic">Taxa de Entrega</span>
                              <span className="font-medium">R$ {order.deliveryFee.toFixed(2)}</span>
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-medium">Total do Pedido</span>
                        <span className="text-xl font-bold text-primary">R$ {order.total.toFixed(2)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Cart Bar */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-6 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-full md:max-w-2xl z-50"
          >
            <div className="bg-dark text-white p-4 rounded-[2rem] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="bg-primary p-3 rounded-2xl relative shrink-0">
                  <ShoppingBag className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 bg-white text-dark text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-dark">
                    {cartCount}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex bg-white/10 p-1 rounded-xl mb-1 w-fit">
                    <button 
                      onClick={() => setDeliveryOption('delivery')}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${deliveryOption === 'delivery' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      TELE
                    </button>
                    <button 
                      onClick={() => setDeliveryOption('pickup')}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${deliveryOption === 'pickup' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      RETIRADA
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    {deliveryOption === 'delivery' ? `Subtotal + Tele (R$ ${DELIVERY_FEE.toFixed(2)})` : 'Subtotal (Retirada)'}
                  </p>
                  <p className="text-xl font-bold">R$ {(cartTotal + (deliveryOption === 'delivery' ? DELIVERY_FEE : 0)).toFixed(2)}</p>
                </div>
              </div>
              
              <button 
                onClick={finalizeOrder}
                className="w-full sm:w-auto bg-success hover:scale-105 active:scale-95 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-success/20"
              >
                ENVIAR PEDIDO
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-28 left-1/2 z-[60] bg-dark/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10"
          >
            <CheckCircle2 className="text-success w-5 h-5" />
            <span className="font-medium">{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
