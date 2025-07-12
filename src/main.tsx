
import { StrictMode, Component, ErrorInfo, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './lib/i18n'
import './index.css'

// Comprehensive Error Boundary
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          fontFamily: 'system-ui, sans-serif',
          maxWidth: '800px',
          margin: '20px auto',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px'
        }}>
          <h1 style={{ color: '#dc2626', marginBottom: '15px' }}>
            ⚠️ Application Error
          </h1>
          <p style={{ marginBottom: '15px' }}>
            The application encountered an error and could not render properly.
          </p>
          <details style={{ marginBottom: '15px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Error Details</summary>
            <pre style={{ 
              background: '#fff', 
              padding: '10px', 
              borderRadius: '4px', 
              overflow: 'auto',
              fontSize: '12px',
              marginTop: '10px'
            }}>
              {this.state.error?.toString()}
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

console.log('Starting application...');

try {
  const container = document.getElementById("root");
  if (!container) {
    console.error("Root element not found");
    throw new Error("Root element not found");
  }

  console.log('Root element found, creating React root...');
  const root = createRoot(container);
  
  console.log('Rendering app with error boundary...');
  
  // Add window error listener to catch any uncaught errors
  window.addEventListener('error', (event) => {
    console.error('Window error:', event.error);
    console.error('Error message:', event.message);
    console.error('Error filename:', event.filename);
    console.error('Error line:', event.lineno);
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });
  
  root.render(
    <StrictMode>
      <GlobalErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GlobalErrorBoundary>
    </StrictMode>
  );
  
  console.log('App rendered successfully');
} catch (error) {
  console.error('Failed to start application:', error);
  
  // Display error message in the root element if possible
  const container = document.getElementById("root");
  if (container) {
    container.innerHTML = `
      <div style="padding: 20px; background: #fef2f2; border: 1px solid #fecaca; margin: 20px; border-radius: 8px; font-family: system-ui, sans-serif;">
        <h2 style="color: #dc2626; margin-bottom: 15px;">⚠️ Critical Startup Error</h2>
        <p style="margin-bottom: 10px;"><strong>Error:</strong> ${error.message}</p>
        <p style="margin-bottom: 15px;">The application failed to initialize. Check the browser console for more details.</p>
        <button onclick="window.location.reload()" style="background: #dc2626; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `;
  }
}
