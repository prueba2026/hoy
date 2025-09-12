import React, { useState, useEffect } from 'react';
import { X, MapPin, User, Phone, Home, CreditCard, DollarSign, MessageCircle, Calculator, Truck } from 'lucide-react';

// ZONAS DE ENTREGA EMBEBIDAS - Generadas automáticamente
const EMBEDDED_DELIVERY_ZONES: DeliveryZone[] = [];

// PRECIOS EMBEBIDOS
const EMBEDDED_PRICES = {
  "moviePrice": 80,
  "seriesPrice": 300,
  "transferFeePercentage": 10,
  "novelPricePerChapter": 5
};

interface DeliveryZone {
  id: number;
  name: string;
  cost: number;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
  pickupOption?: 'delivery' | 'pickup';
}

export interface OrderData {
  orderId: string;
  customerInfo: CustomerInfo;
  deliveryZone: string;
  deliveryCost: number;
  items: any[];
  subtotal: number;
  transferFee: number;
  total: number;
  cashTotal?: number;
  transferTotal?: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (orderData: OrderData) => void;
  items: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
  }>;
  total: number;
}

export function CheckoutModal({ isOpen, onClose, onCheckout, items, total }: CheckoutModalProps) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    address: ''
  });
  const [selectedZone, setSelectedZone] = useState('');
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  const [realTimeZones, setRealTimeZones] = useState<DeliveryZone[]>([]);
  const [pickupOption, setPickupOption] = useState<'delivery' | 'pickup'>('delivery');
  const [showLocationMap, setShowLocationMap] = useState(false);

  // Listen for real-time updates from admin panel
  useEffect(() => {
    const handleAdminConfigChange = (event: CustomEvent) => {
      if (event.detail.deliveryZones) {
        setRealTimeZones(event.detail.deliveryZones);
      }
    };
    
    // Load initial zones from localStorage or embedded
    const loadInitialZones = () => {
      try {
        const adminState = localStorage.getItem('admin_system_state');
        if (adminState) {
          const state = JSON.parse(adminState);
          if (state.deliveryZones && state.deliveryZones.length > 0) {
            setRealTimeZones(state.deliveryZones);
            return;
          }
        }
      } catch (error) {
        console.warn('Error loading delivery zones from localStorage:', error);
      }
      
      // Fallback to embedded zones
      setRealTimeZones(EMBEDDED_DELIVERY_ZONES);
    };
    
    loadInitialZones();
    
    window.addEventListener('admin_config_changed', handleAdminConfigChange as EventListener);
    
    return () => {
      window.removeEventListener('admin_config_changed', handleAdminConfigChange as EventListener);
    };
  }, []);

  // Add pickup option to delivery zones
  const deliveryZones = [
    {
      id: 0,
      name: 'Recogida en el local - TV a la Carta',
      cost: 0
    },
    ...realTimeZones
  ];

  useEffect(() => {
    if (selectedZone && selectedZone !== 'Recogida en el local - TV a la Carta') {
      const zone = deliveryZones.find(z => z.name === selectedZone);
      setDeliveryCost(zone ? zone.cost : 0);
    } else if (selectedZone === 'Recogida en el local - TV a la Carta') {
      setDeliveryCost(0);
      setPickupOption('pickup');
    } else {
      setPickupOption('delivery');
    }
  }, [selectedZone, deliveryZones]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!customerInfo.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^[+]?[0-9\s\-()]{8,}$/.test(customerInfo.phone)) {
      newErrors.phone = 'Formato de teléfono inválido';
    }

    if (!customerInfo.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!selectedZone) {
      alert('Por favor selecciona una zona de entrega');
      return;
    }

    const orderId = `TV-${Date.now()}`;
    const orderData: OrderData = {
      orderId,
      customerInfo: {
        ...customerInfo,
        pickupOption
      },
      deliveryZone: selectedZone,
      deliveryCost,
      items,
      subtotal: total,
      transferFee: 0,
      total: total + deliveryCost
    };

    onCheckout(orderData);
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-xl mr-4">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Finalizar Pedido</h2>
                <p className="text-blue-100">Completa tus datos para proceder</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Customer Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Información Personal
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ingresa tu nombre completo"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+53 5469 0878"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección Completa *
                  </label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Calle, número, entre calles, referencias..."
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Zone */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-green-600" />
                Opciones de Entrega
              </h3>
              
              {deliveryZones.length > 0 ? (
                <div className="space-y-3">
                  {deliveryZones.map((zone) => (
                    <label
                      key={zone.id}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors relative ${
                        selectedZone === zone.name
                          ? zone.cost === 0 
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-green-300'
                      }`}
                    >
                      {zone.cost === 0 && (
                        <div className="absolute -top-2 -right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          GRATIS
                        </div>
                      )}
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="deliveryZone"
                          value={zone.name}
                          checked={selectedZone === zone.name}
                          onChange={(e) => setSelectedZone(e.target.value)}
                          className={`mr-3 h-4 w-4 focus:ring-2 ${
                            zone.cost === 0 
                              ? 'text-blue-600 focus:ring-blue-500'
                              : 'text-green-600 focus:ring-green-500'
                          }`}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{zone.name}</p>
                          {zone.cost === 0 && (
                            <p className="text-sm text-blue-600 font-medium">
                              📍 Reparto Nuevo Vista Alegre, Santiago de Cuba
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          zone.cost === 0 ? 'text-blue-600' : 'text-green-600'
                        }`}>
                          {zone.cost === 0 ? 'GRATIS' : `$${zone.cost.toLocaleString()} CUP`}
                        </p>
                      </div>
                    </label>
                  ))}
                  
                  {/* Show location map option for pickup */}
                  {selectedZone === 'Recogida en el local - TV a la Carta' && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-blue-900">Ubicación del Local</h4>
                        <button
                          type="button"
                          onClick={() => setShowLocationMap(!showLocationMap)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          {showLocationMap ? 'Ocultar mapa' : 'Ver ubicación'}
                        </button>
                      </div>
                      
                      {showLocationMap && (
                        <div className="space-y-3">
                          <div className="bg-white p-3 rounded-lg border border-blue-200">
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Dirección:</strong> Reparto Nuevo Vista Alegre, Santiago de Cuba
                            </p>
                            <p className="text-sm text-gray-700 mb-3">
                              <strong>Coordenadas:</strong> 20.039585, -75.849663
                            </p>
                            <a
                              href="https://www.google.com/maps/place/20%C2%B002'22.5%22N+75%C2%B050'58.8%22W/@20.0394604,-75.8495414,180m/data=!3m1!1e3!4m4!3m3!8m2!3d20.039585!4d-75.849663?entry=ttu&g_ep=EgoyMDI1MDczMC4wIKXMDSoASAFQAw%3D%3D"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              <MapPin className="h-4 w-4 mr-2" />
                              Abrir en Google Maps
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No hay zonas de entrega configuradas
                  </h3>
                  <p className="text-gray-600">
                    Contacta con el administrador para configurar las zonas de entrega.
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-blue-600" />
                Resumen del Pedido
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal ({items.length} elementos)</span>
                  <span className="font-semibold">${total.toLocaleString()} CUP</span>
                </div>
                
                {selectedZone && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Entrega</span>
                    <span className="font-semibold">${deliveryCost.toLocaleString()} CUP</span>
                  </div>
                )}
                
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-blue-600">
                      ${(total + deliveryCost).toLocaleString()} CUP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedZone || deliveryZones.length === 0}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center disabled:cursor-not-allowed"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Enviar Pedido por WhatsApp
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Al enviar el pedido serás redirigido a WhatsApp para completar la transacción
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}