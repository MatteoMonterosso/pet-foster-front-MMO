import { useState, useEffect } from 'react';
import instanceAxios from '../../../axiosSetup/axiosSetup';
import { useAuth } from '../../hooks/AuthContext';
import { useToast } from '../../hooks/ToastContext';
import { useModal } from '../../hooks/ModalContext';

interface FormData {
  name: string;
  species_id: number;
  sexe: string;
  date_of_birth: string;
  race: string;
  short_story: string;
  long_story: string;
  health: string;
  creator_id: number | null;
}

const CreateAnimalProfileForm = () => {
  const { showSuccessToast, showErrorToast } = useToast();
  const { closeModal } = useModal();

  const { user: connectedUser } = useAuth(); // Récupère les infos du token JWT

  // Gestion du token CSRF
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Pour afficher un message de succès
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Pour afficher un message d'erreur

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await instanceAxios.get('/csrf-token');
        setCsrfToken(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du token CSRF:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  // Initialise les données du formulaire
  const [formData, setFormData] = useState<FormData>({
    name: '',
    species_id: 1, // Valeur par défaut pour 'Chat'
    sexe: '',
    date_of_birth: '',
    race: '',
    short_story: '',
    long_story: '',
    health: '',
    creator_id: connectedUser?.userId || null,
  });

  // Gestion du changement dans les champs
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validation des champs obligatoires
  const validateForm = () => {
    if (
      !formData.name ||
      !formData.sexe ||
      !formData.date_of_birth ||
      formData.creator_id === null
    ) {
      setErrorMessage('Tous les champs obligatoires doivent être remplis.');
      return false;
    }
    return true;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null); // Réinitialise les erreurs
    setSuccessMessage(null); // Réinitialise le message de succès

    if (!validateForm()) {
      showErrorToast("Le formulaire n'est pas validé");
      return; // Arrête si la validation échoue
    }

    try {
      await instanceAxios.post('/animals', formData, {
        headers: {
          'x-xsrf-token': csrfToken || '',
        },
      });
      setSuccessMessage("Profil de l'animal créé avec succès !");
      showSuccessToast("Profil de l'animal créé avec succès !");
      closeModal();
      // console.log('Réponse du serveur:', response.data);
    } catch (error: any) {
      if (error.response) {
        setErrorMessage(`Erreur API: ${error.response.data.message}`);
      } else {
        setErrorMessage('Erreur lors de la soumission, veuillez réessayer.');
      }
      console.error('Erreur lors de la soumission:', error);
    }
  };

  // Redirection ou gestion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!connectedUser) {
      setErrorMessage('Vous devez être connecté pour créer un profil.');
    }
  }, [connectedUser]);

  return (
    <form className="columns is-multiline" onSubmit={handleSubmit}>
      {/* Affichage des messages de succès ou d'erreur */}
      {errorMessage && (
        <div className="notification is-danger">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="notification is-success">{successMessage}</div>
      )}

      <div className="field column is-full">
        <label className="label" htmlFor="name">
          Nom
        </label>
        <div className="control">
          <input
            className="input"
            type="text"
            id="name"
            name="name"
            placeholder="Le nom de l'animal"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="field column is-half-desktop">
        <label className="label" htmlFor="species_id">
          Espèce
        </label>
        <div className="control">
          <div className="select">
            <select
              id="species_id"
              name="species_id"
              value={formData.species_id}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Sélectionnez une espèce
              </option>
              <option value={1}>Chat</option>
              <option value={2}>Chien</option>
              <option value={3}>Cheval</option>
              <option value={4}>Lapin</option>
              <option value={5}>Cochon d'Inde</option>
              <option value={6}>Hamster</option>
              <option value={7}>Furet</option>
              <option value={8}>Oiseau</option>
              <option value={9}>Serpent</option>
              <option value={10}>Lézard</option>
              <option value={11}>Tortue</option>
              <option value={12}>Rat</option>
            </select>
          </div>
        </div>
      </div>

      <div className="field column is-half-desktop">
        <label className="label" htmlFor="sexe">
          Sexe
        </label>
        <div className="control columns">
          <label className="radio">
            <input
              type="radio"
              id="male"
              name="sexe"
              value="M"
              required
              onChange={handleChange}
            />
            Mâle
          </label>
          <label className="radio">
            <input
              type="radio"
              id="female"
              name="sexe"
              value="F"
              required
              onChange={handleChange}
            />
            Femelle
          </label>
        </div>
      </div>

      <div className="field column is-half-desktop">
        <label className="label" htmlFor="date_of_birth">
          Date de naissance
        </label>
        <div className="control">
          <input
            className="input"
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            required
            value={formData.date_of_birth}
            onChange={handleChange}
          />
        </div>
        <div className="notification is-info is-light">
          <p>Entrez une date approximative si besoin</p>
        </div>
      </div>

      <div className="field column is-half-desktop">
        <label className="label" htmlFor="race">
          Race
        </label>
        <div className="control">
          <input
            className="input"
            type="text"
            id="race"
            name="race"
            placeholder="Entrez une information sur la race"
            value={formData.race}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="field column is-full">
        <label className="label" htmlFor="short_story">
          Description courte
        </label>
        <div className="control">
          <textarea
            className="textarea"
            id="short_story"
            name="short_story"
            placeholder="L'animal en quelques mots"
            value={formData.short_story}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

      <div className="field column is-full">
        <label className="label" htmlFor="long_story">
          Description longue
        </label>
        <div className="control">
          <textarea
            className="textarea"
            id="long_story"
            name="long_story"
            placeholder="N'hésitez pas à ajouter des détails sur l'animal"
            value={formData.long_story}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

      <div className="field column is-full">
        <label className="label" htmlFor="health">
          Santé
        </label>
        <div className="control">
          <textarea
            className="textarea"
            id="health"
            name="health"
            placeholder="Entrez des informations sur sa santé si nécessaire"
            value={formData.health}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

      <input
        type="hidden"
        id="creator_id"
        name="creator_id"
        value={formData.creator_id || ''}
      />

      <div className="field column is-full">
        <div className="control">
          <button className="button is-primary is-fullwidth" type="submit">
            Enregistrer l'animal
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateAnimalProfileForm;
