import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { configMonitoring } from './monitoring';
import { Metric, onCLS, onINP, onLCP } from 'web-vitals';
import './index.css';
import App from './App.tsx';

// Initialize OpenTelemetry
if (import.meta.env.VITE_DISABLE_MONITORING !== 'true') {
  configMonitoring();
}
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import store from './store.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer position="top-center"></ToastContainer>
    </Provider>
  </StrictMode>,
);

// Report Web Vitals
function sendToAnalytics(metric: Metric) {
  console.log('Web Vital:', metric.name, metric.value, metric);
}
onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
