import React from 'react';
import { createRoot } from 'react-dom/client'; // Import the new API
import { AuthProvider } from './context/AuthContext';
import App from './App';

// Get the root element from your HTML
const rootElement = document.getElementById('root');

// Create a root using the new API
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        
          <App />
        
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  console.error('Root element not found!');
}
