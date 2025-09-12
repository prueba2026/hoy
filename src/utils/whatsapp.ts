import { OrderData, CustomerInfo } from '../components/CheckoutModal';

export function sendOrderToWhatsApp(orderData: OrderData): void {
  const { 
    orderId, 
    customerInfo, 
    deliveryZone, 
    deliveryCost, 
    items, 
    subtotal, 
    transferFee, 
    total,
    cashTotal = 0,
    transferTotal = 0
  } = orderData;

  // Obtener el porcentaje de transferencia actual del contexto admin
  const getTransferFeePercentage = () => {
    try {
      const adminState = localStorage.getItem('admin_system_state');
      if (adminState) {
        const state = JSON.parse(adminState);
        return state.prices?.transferFeePercentage || 10;
      }
    } catch (error) {
      console.warn('No se pudo obtener el porcentaje de transferencia del admin:', error);
    }
    return 10; // Valor por defecto
  };

  // Obtener precios actuales del contexto admin
  const getCurrentPrices = () => {
    try {
      const adminState = localStorage.getItem('admin_system_state');
      if (adminState) {
        const state = JSON.parse(adminState);
        return {
          moviePrice: state.prices?.moviePrice || 80,
          seriesPrice: state.prices?.seriesPrice || 300,
          transferFeePercentage: state.prices?.transferFeePercentage || 10
        };
      }
    } catch (error) {
      console.warn('No se pudieron obtener los precios del admin:', error);
    }
    return {
      moviePrice: 80,
      seriesPrice: 300,
      transferFeePercentage: 10
    };
  };

  const currentPrices = getCurrentPrices();
  const transferFeePercentage = currentPrices.transferFeePercentage;
  const isPickup = customerInfo.pickupOption === 'pickup' || deliveryZone === 'Recogida en el local - TV a la Carta';
  
  // Formatear lista de productos
  const itemsList = items
    .map(item => {
      const seasonInfo = item.selectedSeasons && item.selectedSeasons.length > 0 
        ? `\n  📺 Temporadas: ${item.selectedSeasons.sort((a, b) => a - b).join(', ')}` 
        : '';
      const itemType = item.type === 'movie' ? 'Película' : 'Serie';
      const basePrice = item.type === 'movie' ? currentPrices.moviePrice : (item.selectedSeasons?.length || 1) * currentPrices.seriesPrice;
      const finalPrice = item.paymentType === 'transfer' ? Math.round(basePrice * (1 + transferFeePercentage / 100)) : basePrice;
      const paymentTypeText = item.paymentType === 'transfer' 
        ? `🏦 Transferencia (+${transferFeePercentage}% recargo)` 
        : '💵 Efectivo (sin recargo)';
      const emoji = item.type === 'movie' ? '🎬' : '📺';
      
      let itemDetails = `${emoji} *${item.title}*${seasonInfo}\n`;
      itemDetails += `  📋 Tipo: ${itemType}\n`;
      itemDetails += `  💳 Método de pago: ${paymentTypeText}\n`;
      
      if (item.paymentType === 'transfer') {
        itemDetails += `  💰 Precio base: $${basePrice.toLocaleString()} CUP\n`;
        itemDetails += `  💳 Recargo (${transferFeePercentage}%): +$${(finalPrice - basePrice).toLocaleString()} CUP\n`;
        itemDetails += `  💰 Precio final: $${finalPrice.toLocaleString()} CUP`;
      } else {
        itemDetails += `  💰 Precio: $${finalPrice.toLocaleString()} CUP (sin recargo)`;
      }
      
      return itemDetails;
    })
    .join('\n\n');

  // Construir mensaje completo
  let message = `🎬 *NUEVO PEDIDO - TV A LA CARTA*\n\n`;
  message += `📋 *ID de Orden:* ${orderId}\n\n`;
  
  message += `👤 *DATOS DEL CLIENTE:*\n`;
  message += `• Nombre: ${customerInfo.fullName}\n`;
  message += `• Teléfono: ${customerInfo.phone}\n`;
  message += `• Dirección: ${customerInfo.address}\n\n`;
  
  message += `🎯 *PRODUCTOS SOLICITADOS:*\n${itemsList}\n\n`;
  
  message += `💰 *DESGLOSE DETALLADO DE COSTOS:*\n`;
  
  // Desglosar por tipo de pago
  const cashItems = items.filter(item => item.paymentType === 'cash');
  const transferItems = items.filter(item => item.paymentType === 'transfer');
  
  if (cashItems.length > 0) {
    message += `💵 *PAGO EN EFECTIVO (${cashItems.length} títulos):*\n`;
    cashItems.forEach(item => {
      const basePrice = item.type === 'movie' ? currentPrices.moviePrice : (item.selectedSeasons?.length || 1) * currentPrices.seriesPrice;
      const emoji = item.type === 'movie' ? '🎬' : '📺';
      message += `  ${emoji} ${item.title}: $${basePrice.toLocaleString()} CUP (sin recargo)\n`;
    });
    message += `  ✅ *Subtotal Efectivo: $${cashTotal.toLocaleString()} CUP*\n\n`;
  }
  
  if (transferItems.length > 0) {
    message += `🏦 *PAGO POR TRANSFERENCIA (${transferItems.length} títulos, +${transferFeePercentage}% recargo):*\n`;
    transferItems.forEach(item => {
      const basePrice = item.type === 'movie' ? currentPrices.moviePrice : (item.selectedSeasons?.length || 1) * currentPrices.seriesPrice;
      const finalPrice = Math.round(basePrice * (1 + transferFeePercentage / 100));
      const recargo = finalPrice - basePrice;
      const emoji = item.type === 'movie' ? '🎬' : '📺';
      message += `  ${emoji} ${item.title}:\n`;
      message += `    💰 Precio base: $${basePrice.toLocaleString()} CUP\n`;
      message += `    💳 Recargo (${transferFeePercentage}%): +$${recargo.toLocaleString()} CUP\n`;
      message += `    ✅ Total: $${finalPrice.toLocaleString()} CUP\n`;
    });
    message += `  ✅ *Subtotal Transferencia: $${transferTotal.toLocaleString()} CUP*\n\n`;
  }
  
  message += `📊 *RESUMEN FINAL DE PAGOS:*\n`;
  message += `═══════════════════════════════════\n`;
  if (cashTotal > 0) {
    message += `💵 *Pago en Efectivo:*\n`;
    message += `  • Cantidad de títulos: ${cashItems.length}\n`;
    message += `  • Total sin recargo: $${cashTotal.toLocaleString()} CUP\n\n`;
  }
  if (transferTotal > 0) {
    const transferBase = transferItems.reduce((sum, item) => {
      const basePrice = item.type === 'movie' ? currentPrices.moviePrice : (item.selectedSeasons?.length || 1) * currentPrices.seriesPrice;
      return sum + basePrice;
    }, 0);
    const totalRecargo = transferTotal - transferBase;
    
    message += `🏦 *Pago por Transferencia:*\n`;
    message += `  • Cantidad de títulos: ${transferItems.length}\n`;
    message += `  • Subtotal base: $${transferBase.toLocaleString()} CUP\n`;
    message += `  • Recargo (${transferFeePercentage}%): +$${totalRecargo.toLocaleString()} CUP\n`;
    message += `  • Total con recargo: $${transferTotal.toLocaleString()} CUP\n\n`;
  }
  
  message += `🎬 *TOTAL CONTENIDO: $${subtotal.toLocaleString()} CUP*\n`;
  
  // Información de entrega
  message += `\n📍 *MÉTODO DE ENTREGA:*\n`;
  if (isPickup) {
    message += `🏪 *RECOGIDA EN EL LOCAL (GRATIS)*\n`;
    message += `  • Ubicación: TV a la Carta\n`;
    message += `  • Dirección: Reparto Nuevo Vista Alegre, Santiago de Cuba\n`;
    message += `  • Coordenadas: 20.039585, -75.849663\n`;
    message += `  • Costo de recogida: GRATIS\n`;
    message += `  • Google Maps: https://www.google.com/maps/place/20%C2%B002'22.5%22N+75%C2%B050'58.8%22W/@20.0394604,-75.8495414,180m/data=!3m1!1e3!4m4!3m3!8m2!3d20.039585!4d-75.849663\n\n`;
  } else {
    message += `🚚 *ENTREGA A DOMICILIO*\n`;
    message += `  • Zona: ${deliveryZone.replace(' > ', ' → ')}\n`;
    message += `  • Costo de entrega: $${deliveryCost.toLocaleString()} CUP\n\n`;
  }
  
  message += `🎯 *TOTAL FINAL A PAGAR: $${total.toLocaleString()} CUP*\n`;
  message += `═══════════════════════════════════\n\n`;
  
  message += `📊 *ESTADÍSTICAS DEL PEDIDO:*\n`;
  message += `• Total de elementos: ${items.length}\n`;
  message += `• Películas: ${items.filter(item => item.type === 'movie').length}\n`;
  message += `• Series: ${items.filter(item => item.type === 'tv').length}\n`;
  if (cashItems.length > 0) {
    message += `• Pago en efectivo: ${cashItems.length} títulos ($${cashTotal.toLocaleString()} CUP)\n`;
  }
  if (transferItems.length > 0) {
    message += `• Pago por transferencia: ${transferItems.length} títulos ($${transferTotal.toLocaleString()} CUP)\n`;
  }
  message += `• Método de entrega: ${isPickup ? 'Recogida en local (GRATIS)' : 'Entrega a domicilio'}\n`;
  message += `\n`;
  
  message += `💼 *CONFIGURACIÓN DE PRECIOS APLICADA:*\n`;
  message += `• Películas: $${currentPrices.moviePrice.toLocaleString()} CUP\n`;
  message += `• Series: $${currentPrices.seriesPrice.toLocaleString()} CUP por temporada\n`;
  message += `• Recargo transferencia: ${transferFeePercentage}%\n\n`;
  
  message += `📱 *Enviado desde:* TV a la Carta App\n`;
  message += `⏰ *Fecha y hora:* ${new Date().toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })}\n`;
  message += `🌟 *¡Gracias por elegir TV a la Carta!*`;
  
  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = '5354690878'; // Número de WhatsApp
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}