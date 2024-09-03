import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './assets/css/bulma-no-dark-mode.css';
import './assets/css/petfoster.css';
import 'leaflet/dist/leaflet.css';
// Hooks
import { ModalProvider } from './hooks/ModalContext';

createRoot(document.getElementById('root')!).render(
  <ModalProvider>
    <App />
  </ModalProvider>
);
