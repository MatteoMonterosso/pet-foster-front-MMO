import { useEffect } from 'react';
import tarteaucitron from 'tarteaucitronjs';

const useTarteaucitron = () => {
  useEffect(() => {
    tarteaucitron.init({
      privacyUrl : "" ,  /* URL de la politique de confidentialité */ 
      bodyPosition : "bottom" ,  /* ou top pour l'amener comme premier élément pour l'accessibilité */
  
      hcookieName : "tarteaucitron" ,  /* Nom du cookie */
  
      orientation : "milieu" ,  /* Position de la bannière (haut - bas - milieu - popup) */
  
      groupServices : false ,  /* Regrouper les services par catégorie */ 
      showDetailsOnClick : true ,  /* Cliquer pour développer la description */ 
      serviceDefaultState : "wait" ,  /* État par défaut (true - wait - false) */
  
      showAlertSmall : false ,  /* Afficher la petite bannière en bas à droite */ 
      cookieslist : false ,  /* Afficher la liste des cookies */
      
      showIcon : true ,  /* Afficher l'icône de cookie pour gérer les cookies */ 
      // "iconSrc": "", /* Facultatif : URL ou image encodée en base64 */ 
      iconPosition : "BottomRight" ,  /* Position de l'icône entre BottomRight, BottomLeft, TopRight et TopLeft */
  
      adblocker : false ,  /* Afficher un avertissement si un bloqueur de publicités est détecté */
  
      DenyAllCta : true ,  /* Afficher le bouton Refuser tout */ 
      AcceptAllCta : true ,  /* Afficher le bouton Accepter tout lorsque highPrivacy est activé */ 
      highPrivacy : true ,  /* FORTEMENT RECOMMANDÉ Désactiver le consentement automatique */ 
      alwaysNeedConsent : false ,  /* Demander le consentement pour les services "Privacy by design" */
      
      handleBrowserDNTRequest : false ,  /* Si Ne pas suivre == 1, interdire tout */
  
      removeCredit : false ,  /* Supprimer le lien de crédit */ 
      moreInfoLink : true ,  /* Afficher plus d'informations */ 
      useExternalCss : false ,  /* Si false, le fichier tarteaucitron.css sera chargé */ 
      useExternalJs : false ,  /* Si false, le fichier tarteaucitron.services.js sera chargé */
  
      // "cookieDomain": ".my-multisite-domaine.fr", /* Cookie partagé pour le site Web du sous-domaine */
  
      readmoreLink : "" ,  /* Modifiez le lien readmore par défaut pointant vers tarteaucitron.io */
      
      mandatory : true ,  /* Afficher un message sur les cookies obligatoires */ 
      mandatoryCta : true ,  /* Afficher le bouton d'acceptation désactivé lorsque obligatoire activé */
      
      // "customCloserId": "", /* Facultatif a11y : ID d'élément personnalisé utilisé pour ouvrir le panneau */
  
      googleConsentMode : true ,  /* Activer le mode de consentement de Google v2 pour les annonces Google et GA4 */
      
      partnersList : false  /* Détaille le nombre de partenaires sur la popup et la bannière du milieu */ 
    });  


    // Configuration des services gérer par Tarteaucitron
    tarteaucitron.user.analyticsUa = 'UA-XXXXXXXXX-X'; // service Google Analytics
    tarteaucitron.job = tarteaucitron.job || []; // Initialise tableau 'job', s'il n'a pas encore été crée

    // Ce tableau contient la liste des services que Tarteaucitron va gérer selon le consentement de l'utilisateur
    tarteaucitron.job.push('analytics'); 
  }, []);
};

export default useTarteaucitron;