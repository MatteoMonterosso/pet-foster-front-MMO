import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Pencil, PlusSmall } from 'react-flaticons';
import { useModal } from '../../hooks/ModalContext';
import FosterlingProfile from '../partials/FosterlingProfile'; 
import { useAuth } from '../../hooks/AuthContext'; 
import { useToast } from '../../hooks/ToastContext';
import GalleryComponent from '../partials/GalleryComponent';
import { User } from 'src/@interfaces/user';
import UploadImageForm from '../formulaires/UploadImageForm'; 

// Ajout des imports pour Bulma ou autres composants
import { Section, Container, Heading } from 'react-bulma-components';

function ProfilUtilisateur() {
  const { showSuccessToast, showErrorToast } = useToast();
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const { openModal, closeModal } = useModal();
  const { id } = useParams<{ id: string }>(); 
  const [user, setUser] = useState<User | null>(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<Error | null>(null); 
  const { user: connectedUser } = useAuth(); // Obtenir l'utilisateur connecté

  // Récupération du token CSRF
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/csrf-token', {});
        setCsrfToken(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du token CSRF:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  // Récupération des données de l'utilisateur
  const fetchUserData = useCallback(async () => {
    try {
      const userResponse = await axios.get(`http://localhost:3000/api/users/${id}`);
      setUser(userResponse.data);
    } catch (error) {
      showErrorToast("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }, [id, showErrorToast, closeModal]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Suppression d'un profil d'accueil
  const deleteProfile = async (profileId: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/profiles/${profileId}`, {
        headers: {
          'x-xsrf-token': csrfToken || '',
        },
      });
      showSuccessToast("Profil supprimé avec succès");
      await fetchUserData(); 
    } catch (error) {
      showErrorToast("Erreur lors de la suppression du profil");
    }
  };

  // Affichage du loading ou des erreurs
  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>Error: {error.message}</div>; 
  }

  return (
    <main>
      <div>
        <h1 className="title">{user?.name}</h1>
      </div>

      <Section>
        <Container>
          {connectedUser && user && id && connectedUser.userId === parseInt(id) && (
            <p className="notification is-primary has-text-centered">
              Ceci est votre profil, vous pouvez l'éditer grâce au bouton présent plus bas.
            </p>
          )}
          <div className="columns is-multiline">
            <div className="column is-6">
              <GalleryComponent pictures={user?.pictures} userPictures={user?.pictures} />
            </div>

            <div className="column is-6">
              {user && (
                <>
                  <h2 className="title">{user.type_user}</h2>
                  <ul>
                    <li><strong>Nom:</strong> {user.name}</li>
                    <li><strong>Email:</strong> {user.email}</li>
                    <li><strong>Tél:</strong> {user.phone}</li>
                    <li><strong>Pays:</strong> {user.country}</li>
                    <li><strong>Code postal:</strong> {user.zip}</li>
                    <li><strong>Ville:</strong> {user.city}</li>
                    <li><strong>Adresse:</strong> {user.address}</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Ajout du formulaire d'upload */}
      <Section>
        <Container>
          <Heading size={2} renderAs="h2">Changer l'image de profil</Heading>
          {connectedUser && <UploadImageForm userId={connectedUser.userId} />}
        </Container>
      </Section>

      {/* Section Description */}
      <Section>
        <Container>
          <Heading size={2} renderAs="h2">Description</Heading>
          {user && <p>{user.description}</p>}

          {!connectedUser && (
            <div className="notification is-info is-light has-text-right is-pulled-right">
              <p>Connectez-vous à votre compte pour pouvoir contacter {user?.name}</p>
              <Link to="/connexion" className="button is-primary">Se connecter</Link>
            </div>
          )}

          {user && connectedUser && connectedUser.userId !== user.id && (
            <button className="button is-primary is-pulled-right" onClick={() => openModal('contactUser', connectedUser.userId, user.id)}>
              Contacter
            </button>
          )}

          {connectedUser && user && id !== undefined && connectedUser.userId === parseInt(id) && (
            <button className="button is-primary is-pulled-right" onClick={() => openModal('editUserProfile')}>
              <Pencil /> Éditer
            </button>
            
          )}
          {/* {JSON.stringify(user)} */}
        </div>
      </section>
{user?.type_user !== "association" &&(
      <section className="section">
        <div className="container">
          <h2 className="title">Profils d'accueil</h2>
          {connectedUser && user && id !== undefined && connectedUser.userId === parseInt(id) && (
            <div className="has-text-right">
              <button className="button is-primary" onClick={() => openModal('addFosterlingProfile', connectedUser.userId)}>
                <PlusSmall /> Ajouter
              </button>
            </div>
          )}
          {user?.fosterlingProfiles && user.fosterlingProfiles.length > 0 ? (
            <table className="table is-fullwidth has-text-centered card">
              <thead>
                <tr>
                  <th className="has-text-centered">Espèce</th>
                  <th className="has-text-centered">Âge</th>
                  <th className="has-text-centered">Sexe</th>
                  <th className="has-text-centered">Quantité</th>
                  <th className="has-text-centered">Périmètre</th>
                  <th className="has-text-right">Contrôle</th>
                </tr>
              </thead>
              <tbody>
                {user?.fosterlingProfiles?.map((profile) => (
                  <FosterlingProfile key={profile.id} profile={profile} deleteFunction={deleteProfile} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="notification is-info is-light has-text-centered">
              <p>Aucun profil d'accueil pour le moment</p>
            </div>
          )}
        </div>
      </section>
      )}
    </main>
  );
}

export default ProfilUtilisateur;

