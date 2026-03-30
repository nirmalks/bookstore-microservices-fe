import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor, TracerConfig } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

declare global {
  interface Window {
    __OTEL_INITIALIZED__?: boolean;
  }
}

export const configMonitoring = () => {
  // Only initialize once 
  if (typeof window === 'undefined' || window.__OTEL_INITIALIZED__) return;
  window.__OTEL_INITIALIZED__ = true;

  const exporter = new OTLPTraceExporter({
    url: import.meta.env.VITE_OTEL_EXPORTER_URL || 'http://localhost:4318/v1/traces',
  });


  const providerConfig: TracerConfig = {
    resource: new Resource({
      [ATTR_SERVICE_NAME]: 'bookstore-react-frontend',
      [ATTR_SERVICE_VERSION]: '1.0.0',
    }),
    spanProcessors: [new BatchSpanProcessor(exporter)]
  };

  const provider = new WebTracerProvider(providerConfig);

  provider.register();

  registerInstrumentations({
    instrumentations: [
      getWebAutoInstrumentations({
        // Prevent tracing local dev server HMR requests
        '@opentelemetry/instrumentation-fetch': {
          propagateTraceHeaderCorsUrls: [
            new RegExp('http://localhost:8080/.*'), // API Gateway
            new RegExp('/api/.*'),
          ],
          ignoreUrls: [/localhost:5173/],
        },
        '@opentelemetry/instrumentation-xml-http-request': {
          ignoreUrls: [/localhost:5173/],
        }
      }),
    ],
  });
};
