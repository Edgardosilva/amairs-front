/**
 * Reporte simple de Core Web Vitals para consola
 * 
 * Para ver métricas completas usa Chrome DevTools:
 * F12 → Performance Monitor → Ctrl+Shift+P → "Show Performance Monitor"
 */

export function reportWebVitals(metric) {
  // Solo en desarrollo
  if (process.env.NODE_ENV === 'development') {
    const emoji = 
      metric.value < 2500 && metric.name === 'LCP' ? '✅' :
      metric.value < 100 && metric.name === 'FID' ? '✅' :
      metric.value < 0.1 && metric.name === 'CLS' ? '✅' :
      metric.value < 1800 && metric.name === 'FCP' ? '✅' :
      metric.value < 800 && metric.name === 'TTFB' ? '✅' : '⚠️';
    
    console.log(
      `${emoji} ${metric.name}: ${metric.value.toFixed(2)}${metric.name === 'CLS' ? '' : 'ms'}`
    );
  }
  
  // En producción: enviar a tu servicio de analytics
  // sendToAnalytics(metric);
}

