import React, { StrictMode, Component, ReactNode, ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SMARTEURA Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F8F9F6',
          fontFamily: 'system-ui, sans-serif',
          padding: '24px',
          textAlign: 'center',
          color: '#193E33'
        }}>
          <div style={{
            maxWidth: '480px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(18, 63, 50, 0.08)',
            border: '1px solid #D5DED6'
          }}>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>
              SMARTEURA
            </h1>
            <p style={{ fontSize: '14px', color: '#586B62', marginBottom: '20px' }}>
              Səhifə yüklənərkən xəta baş verdi. Zəhmət olmasa səhifəni yeniləyin.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#123F32',
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Yenidən yüklə (Refresh)
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
);
