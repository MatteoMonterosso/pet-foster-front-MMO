// Importation des dépendances nécessaires

// Importation de la fonction createRoot de ReactDOM pour gérer l'affichage de l'application React
import { createRoot } from 'react-dom/client';

// Importation du composant principal de l'application (App) qui contient la logique et les vues principales de l'application
import App from './App.tsx';

// Importation du composant de modal (MainModal) qui est utilisé pour afficher des fenêtres modales (pop-ups) dans l'application
import MainModal from './components/partials/Modal.tsx';

// Importation de fichiers CSS pour appliquer des styles à l'application

import './assets/css/bulma-no-dark-mode.css';

import 'leaflet/dist/leaflet.css';

// Fichiers CSS pour Slick Carousel, une bibliothèque permettant de créer des carrousels d'images/éléments
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './assets/css/petfoster.css';


// Importation des hooks pour gérer l'état global de l'application

// ModalProvider fournit un contexte pour gérer l'état des fenêtres modales à travers l'application
import { ModalProvider } from "./hooks/ModalContext";

// GeolocationProvider fournit un contexte pour gérer la géolocalisation (exemple : localisation de l'utilisateur)
import { GeolocationProvider } from "./hooks/GeolocationContext";
import { AuthProvider } from './hooks/AuthContext.tsx';
import { ToastProvider } from './hooks/ToastContext.tsx';

// ThemeProvider fournit le contexte pour gérer l'état isDarkMode et changer le thème 
import { ThemeProvider } from './hooks/DarkModeContext.tsx';

// Initialisation de l'application

createRoot(document.getElementById('root')!).render(
<AuthProvider>
    <ToastProvider>
    <ModalProvider>  
        <GeolocationProvider>
            <ThemeProvider>
                <App />
                <MainModal />   
            </ThemeProvider>   
        </GeolocationProvider>
    </ModalProvider>
    </ToastProvider>
</AuthProvider>
);