import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Settings, DollarSign, MapPin, BookOpen, Bell, Download, Upload, FolderSync as Sync, LogOut, Save, Plus, CreditCard as Edit, Trash2, Eye, EyeOff, User, Lock, AlertCircle, CheckCircle, Info, X, Globe, Calendar, Monitor, Image, Camera, FileText, Smartphone, RefreshCw, Database, Activity, TrendingUp, Users, Clock, Zap, Shield, Server, Wifi, WifiOff } from 'lucide-react';

export function AdminPanel() {
  const { 
    state, 
    login, 
    logout, 
    updatePrices, 
    addDeliveryZone, 
    updateDeliveryZone, 
    deleteDeliveryZone,
    addNovel,
    updateNovel,
    deleteNovel,
    clearNotifications,
    exportSystemConfig,
    importSystemConfig,
    exportCompleteSourceCode,
    syncWithRemote,
    syncAllSections
  } = useAdmin();

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'prices' | 'delivery' | 'novels' | 'notifications' | 'system'>('prices');
  const [priceForm, setPriceForm] = useState(state.prices);
  const [deliveryForm, setDeliveryForm] = useState({ name: '', cost: 0 });
  const [editingDelivery, setEditingDelivery] = useState<number | null>(null);
  const [novelForm, setNovelForm] = useState({
    titulo: '',
    genero: '',
    capitulos: 1,
    año: new Date().getFullYear(),
    descripcion: '',
    pais: '',
    imagen: '',
    estado: 'finalizada' as 'transmision' | 'finalizada'
  });
  const [editingNovel, setEditingNovel] = useState<number | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Update price form when state changes
  useEffect(() => {
    setPriceForm(state.prices);
  }, [state.prices]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(loginForm.username, loginForm.password);
    if (!success) {
      alert('Credenciales incorrectas');
    }
  };

  const handlePriceUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updatePrices(priceForm);
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDelivery) {
      const zone = state.deliveryZones.find(z => z.id === editingDelivery);
      if (zone) {
        updateDeliveryZone({
          ...zone,
          name: deliveryForm.name,
          cost: deliveryForm.cost
        });
      }
      setEditingDelivery(null);
    } else {
      addDeliveryZone(deliveryForm);
    }
    setDeliveryForm({ name: '', cost: 0 });
  };

  const handleEditDelivery = (zone: any) => {
    setDeliveryForm({ name: zone.name, cost: zone.cost });
    setEditingDelivery(zone.id);
  };

  const handleNovelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNovel) {
      const novel = state.novels.find(n => n.id === editingNovel);
      if (novel) {
        updateNovel({
          ...novel,
          ...novelForm
        });
      }
      setEditingNovel(null);
    } else {
      addNovel(novelForm);
    }
    setNovelForm({
      titulo: '',
      genero: '',
      capitulos: 1,
      año: new Date().getFullYear(),
      descripcion: '',
      pais: '',
      imagen: '',
      estado: 'finalizada'
    });
  };

  const handleEditNovel = (novel: any) => {
    setNovelForm({
      titulo: novel.titulo,
      genero: novel.genero,
      capitulos: novel.capitulos,
      año: novel.año,
      descripcion: novel.descripcion || '',
      pais: novel.pais || '',
      imagen: novel.imagen || '',
      estado: novel.estado || 'finalizada'
    });
    setEditingNovel(novel.id);
  };

  const handleImportConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) return;

    setIsImporting(true);
    try {
      const text = await importFile.text();
      const config = JSON.parse(text);
      importSystemConfig(config);
      setImportFile(null);
    } catch (error) {
      alert('Error al importar la configuración. Verifica que el archivo sea válido.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleExportConfig = async () => {
    setIsExporting(true);
    try {
      await exportSystemConfig();
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportSourceCode = async () => {
    setIsExporting(true);
    try {
      await exportCompleteSourceCode();
    } finally {
      setIsExporting(false);
    }
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      await syncAllSections();
    } finally {
      setIsSyncing(false);
    }
  };

  // Lista de países disponibles incluyendo Cuba
  const availableCountries = [
    'Cuba',
    'Turquía',
    'México',
    'Brasil',
    'Colombia',
    'Argentina',
    'España',
    'Estados Unidos',
    'Corea del Sur',
    'India',
    'Reino Unido',
    'Francia',
    'Italia',
    'Alemania',
    'Japón',
    'China',
    'Rusia',
    'Venezuela',
    'Chile',
    'Perú',
    'Ecuador',
    'No especificado'
  ];

  const availableGenres = [
    'Drama',
    'Romance',
    'Acción',
    'Comedia',
    'Familia',
    'Thriller',
    'Misterio',
    'Histórico',
    'Fantasía',
    'Ciencia Ficción',
    'Musical',
    'Aventura',
    'Crimen',
    'Guerra',
    'Western',
    'Biografía',
    'Documental'
  ];

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'Cuba': '🇨🇺',
      'Turquía': '🇹🇷',
      'México': '🇲🇽',
      'Brasil': '🇧🇷',
      'Colombia': '🇨🇴',
      'Argentina': '🇦🇷',
      'España': '🇪🇸',
      'Estados Unidos': '🇺🇸',
      'Corea del Sur': '🇰🇷',
      'India': '🇮🇳',
      'Reino Unido': '🇬🇧',
      'Francia': '🇫🇷',
      'Italia': '🇮🇹',
      'Alemania': '🇩🇪',
      'Japón': '🇯🇵',
      'China': '🇨🇳',
      'Rusia': '🇷🇺',
      'Venezuela': '🇻🇪',
      'Chile': '🇨🇱',
      'Perú': '🇵🇪',
      'Ecuador': '🇪🇨',
      'No especificado': '🌍'
    };
    return flags[country] || '🌍';
  };

  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
            <div className="bg-white/20 p-4 rounded-full w-fit mx-auto mb-4">
              <Shield className="h-12 w-12" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Panel de Administración</h1>
            <p className="text-blue-100">TV a la Carta</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa tu usuario"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className={`w-2 h-2 rounded-full ${state.syncStatus.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{state.syncStatus.isOnline ? 'En línea' : 'Sin conexión'}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications */}
        {state.notifications.length > 0 && (
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Notificaciones ({state.notifications.length})
                  </h3>
                </div>
                <button
                  onClick={clearNotifications}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Limpiar todas
                </button>
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {state.notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 last:border-b-0 ${
                    notification.type === 'success' ? 'bg-green-50' :
                    notification.type === 'error' ? 'bg-red-50' :
                    notification.type === 'warning' ? 'bg-yellow-50' :
                    'bg-blue-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`p-1 rounded-full mr-3 ${
                      notification.type === 'success' ? 'bg-green-100' :
                      notification.type === 'error' ? 'bg-red-100' :
                      notification.type === 'warning' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {notification.type === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
                      {notification.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                      {notification.type === 'info' && <Info className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.section} • {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sync Status */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Activity className="h-6 w-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Estado del Sistema</h3>
            </div>
            <button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Sincronizando...' : 'Sincronizar Todo'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <Database className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Zonas de Entrega</p>
                  <p className="text-2xl font-bold text-green-800">{state.deliveryZones.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600">Novelas</p>
                  <p className="text-2xl font-bold text-purple-800">{state.novels.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Notificaciones</p>
                  <p className="text-2xl font-bold text-blue-800">{state.notifications.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center">
                <div className="bg-orange-100 p-2 rounded-lg mr-3">
                  {state.syncStatus.isOnline ? <Wifi className="h-5 w-5 text-orange-600" /> : <WifiOff className="h-5 w-5 text-red-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-600">Estado</p>
                  <p className="text-sm font-bold text-orange-800">
                    {state.syncStatus.isOnline ? 'Conectado' : 'Desconectado'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'prices', label: 'Precios', icon: DollarSign },
                { id: 'delivery', label: 'Zonas de Entrega', icon: MapPin },
                { id: 'novels', label: 'Gestión de Novelas', icon: BookOpen },
                { id: 'notifications', label: 'Notificaciones', icon: Bell },
                { id: 'system', label: 'Sistema', icon: Settings }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Prices Tab */}
            {activeTab === 'prices' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración de Precios</h2>
                <form onSubmit={handlePriceUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio de Películas (CUP)
                      </label>
                      <input
                        type="number"
                        value={priceForm.moviePrice}
                        onChange={(e) => setPriceForm(prev => ({ ...prev, moviePrice: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio de Series por Temporada (CUP)
                      </label>
                      <input
                        type="number"
                        value={priceForm.seriesPrice}
                        onChange={(e) => setPriceForm(prev => ({ ...prev, seriesPrice: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio de Novelas por Capítulo (CUP)
                      </label>
                      <input
                        type="number"
                        value={priceForm.novelPricePerChapter}
                        onChange={(e) => setPriceForm(prev => ({ ...prev, novelPricePerChapter: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recargo por Transferencia (%)
                      </label>
                      <input
                        type="number"
                        value={priceForm.transferFeePercentage}
                        onChange={(e) => setPriceForm(prev => ({ ...prev, transferFeePercentage: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        max="100"
                        required
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Precios
                  </button>
                </form>
              </div>
            )}

            {/* Delivery Zones Tab */}
            {activeTab === 'delivery' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Zonas de Entrega</h2>
                
                <form onSubmit={handleDeliverySubmit} className="mb-8 bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingDelivery ? 'Editar Zona' : 'Agregar Nueva Zona'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de la Zona
                      </label>
                      <input
                        type="text"
                        value={deliveryForm.name}
                        onChange={(e) => setDeliveryForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Santiago de Cuba > Centro"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Costo de Entrega (CUP)
                      </label>
                      <input
                        type="number"
                        value={deliveryForm.cost}
                        onChange={(e) => setDeliveryForm(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 mt-4">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingDelivery ? 'Actualizar' : 'Agregar'} Zona
                    </button>
                    
                    {editingDelivery && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingDelivery(null);
                          setDeliveryForm({ name: '', cost: 0 });
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>

                <div className="space-y-4">
                  {state.deliveryZones.map((zone) => (
                    <div key={zone.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{zone.name}</h4>
                          <p className="text-sm text-gray-600">${zone.cost.toLocaleString()} CUP</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditDelivery(zone)}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteDeliveryZone(zone.id)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Novels Tab */}
            {activeTab === 'novels' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Gestión de Novelas</h2>
                
                <form onSubmit={handleNovelSubmit} className="mb-8 bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingNovel ? 'Editar Novela' : 'Agregar Nueva Novela'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título de la Novela
                      </label>
                      <input
                        type="text"
                        value={novelForm.titulo}
                        onChange={(e) => setNovelForm(prev => ({ ...prev, titulo: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: El Turco"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Género
                      </label>
                      <select
                        value={novelForm.genero}
                        onChange={(e) => setNovelForm(prev => ({ ...prev, genero: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Seleccionar género</option>
                        {availableGenres.map(genre => (
                          <option key={genre} value={genre}>{genre}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Capítulos
                      </label>
                      <input
                        type="number"
                        value={novelForm.capitulos}
                        onChange={(e) => setNovelForm(prev => ({ ...prev, capitulos: parseInt(e.target.value) || 1 }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Año
                      </label>
                      <input
                        type="number"
                        value={novelForm.año}
                        onChange={(e) => setNovelForm(prev => ({ ...prev, año: parseInt(e.target.value) || new Date().getFullYear() }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1900"
                        max={new Date().getFullYear() + 5}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        País de Origen
                      </label>
                      <select
                        value={novelForm.pais}
                        onChange={(e) => setNovelForm(prev => ({ ...prev, pais: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Seleccionar país</option>
                        {availableCountries.map(country => (
                          <option key={country} value={country}>
                            {getCountryFlag(country)} {country}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado
                      </label>
                      <select
                        value={novelForm.estado}
                        onChange={(e) => setNovelForm(prev => ({ ...prev, estado: e.target.value as 'transmision' | 'finalizada' }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="finalizada">✅ Finalizada</option>
                        <option value="transmision">📡 En Transmisión</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de Imagen (Opcional)
                    </label>
                    <input
                      type="url"
                      value={novelForm.imagen}
                      onChange={(e) => setNovelForm(prev => ({ ...prev, imagen: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={novelForm.descripcion}
                      onChange={(e) => setNovelForm(prev => ({ ...prev, descripcion: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Descripción de la novela..."
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingNovel ? 'Actualizar' : 'Agregar'} Novela
                    </button>
                    
                    {editingNovel && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNovel(null);
                          setNovelForm({
                            titulo: '',
                            genero: '',
                            capitulos: 1,
                            año: new Date().getFullYear(),
                            descripcion: '',
                            pais: '',
                            imagen: '',
                            estado: 'finalizada'
                          });
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>

                <div className="space-y-4">
                  {state.novels.map((novel) => (
                    <div key={novel.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="font-bold text-gray-900 text-lg mr-3">{novel.titulo}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                              novel.estado === 'transmision' ? 'bg-red-500' : 'bg-green-500'
                            }`}>
                              {novel.estado === 'transmision' ? '📡 EN TRANSMISIÓN' : '✅ FINALIZADA'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Género:</span> {novel.genero}
                            </div>
                            <div>
                              <span className="font-medium">Capítulos:</span> {novel.capitulos}
                            </div>
                            <div>
                              <span className="font-medium">Año:</span> {novel.año}
                            </div>
                            <div>
                              <span className="font-medium">País:</span> {getCountryFlag(novel.pais || 'No especificado')} {novel.pais || 'No especificado'}
                            </div>
                          </div>
                          {novel.descripcion && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{novel.descripcion}</p>
                          )}
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">Precio:</span> ${(novel.capitulos * state.prices.novelPricePerChapter).toLocaleString()} CUP
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEditNovel(novel)}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteNovel(novel.id)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {state.novels.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay novelas</h3>
                      <p className="text-gray-600">Agrega la primera novela al catálogo.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Notificaciones del Sistema</h2>
                  <button
                    onClick={clearNotifications}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpiar Todas
                  </button>
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {state.notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        notification.type === 'success' ? 'bg-green-50 border-green-400' :
                        notification.type === 'error' ? 'bg-red-50 border-red-400' :
                        notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                        'bg-blue-50 border-blue-400'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`p-1 rounded-full mr-3 ${
                          notification.type === 'success' ? 'bg-green-100' :
                          notification.type === 'error' ? 'bg-red-100' :
                          notification.type === 'warning' ? 'bg-yellow-100' :
                          'bg-blue-100'
                        }`}>
                          {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {notification.type === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
                          {notification.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                          {notification.type === 'info' && <Info className="h-4 w-4 text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded-full mr-2">{notification.section}</span>
                            <span>{new Date(notification.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {state.notifications.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay notificaciones</h3>
                      <p className="text-gray-600">Las notificaciones del sistema aparecerán aquí.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración del Sistema</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Export Section */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                      <Download className="h-5 w-5 mr-2" />
                      Exportar Configuración
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={handleExportConfig}
                        disabled={isExporting}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {isExporting ? 'Exportando...' : 'Exportar JSON'}
                      </button>
                      <button
                        onClick={handleExportSourceCode}
                        disabled={isExporting}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        <Database className="h-4 w-4 mr-2" />
                        {isExporting ? 'Exportando...' : 'Exportar Código Fuente'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Import Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                      <Upload className="h-5 w-5 mr-2" />
                      Importar Configuración
                    </h3>
                    <form onSubmit={handleImportConfig} className="space-y-3">
                      <input
                        type="file"
                        accept=".json"
                        onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={!importFile || isImporting}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {isImporting ? 'Importando...' : 'Importar JSON'}
                      </button>
                    </form>
                  </div>
                </div>

                {/* System Information */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Server className="h-5 w-5 mr-2" />
                    Información del Sistema
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <Activity className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Versión</p>
                          <p className="text-lg font-bold text-gray-900">{state.systemConfig.version}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg mr-3">
                          <Clock className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Última Sincronización</p>
                          <p className="text-sm font-bold text-gray-900">
                            {new Date(state.syncStatus.lastSync).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center">
                        <div className="bg-purple-100 p-2 rounded-lg mr-3">
                          <TrendingUp className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Cambios Pendientes</p>
                          <p className="text-lg font-bold text-gray-900">{state.syncStatus.pendingChanges}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSyncAll}
                    disabled={isSyncing}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-purple-400 disabled:to-pink-400 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                  >
                    <Sync className={`h-5 w-5 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Sincronizando Sistema...' : 'Sincronizar Todo el Sistema'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}