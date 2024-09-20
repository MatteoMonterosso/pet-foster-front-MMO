import React, { useState, useEffect } from 'react';
import { useToast } from '../../hooks/ToastContext';
import { useModal } from '../../hooks/ModalContext';
import instanceAxios from '../../../axiosSetup/axiosSetup';

interface IAddFosterlingProfileFormProps {
  userId: number;
}

const AddFosterlingProfileForm = ({
  userId,
}: IAddFosterlingProfileFormProps) => {
  const [formData, setFormData] = useState({
    species_id: '',
    sexe: '',
    age: '',
    quantity: 1,
    search_area: 30,
    users_id: userId,
  });
  // Toasts de submit
  const { showSuccessToast } = useToast();
  const { closeModal } = useModal();
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

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

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: e.target.type === 'range' ? parseInt(value, 10) : value,
    });
  };

  const validateForm = () => {
    if (
      formData.species_id === '' ||
      formData.sexe === '' ||
      formData.age === ''
    ) {
      setError('Veuillez remplir tous les champs requis.');
      return false;
    }
    if (formData.quantity <= 0) {
      setError('La quantité doit être supérieure à 0.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    console.log(formData);

    setIsSubmitting(true);
    try {
      await instanceAxios.post('/profiles', formData, {
        headers: {
          'Content-Type': 'application/json',
          'x-xsrf-token': csrfToken || '',
        },
      });
      showSuccessToast("Votre profil d'accueil à été créé !");
      closeModal(); // Fermer la modal après succès
    } catch (error) {
      setError(
        "Une erreur s'est produite lors de la soumission. Veuillez réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="notification is-danger">{error}</div>}
      {/* {success && <div className="notification is-success">Le profil a été ajouté avec succès.</div>} */}

      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label" htmlFor="species_id">
              Espèce
            </label>
            <div className="control">
              <div className="select">
                <select
                  name="species_id"
                  value={formData.species_id}
                  onChange={handleChange}
                  aria-label="Sélectionnez une espèce"
                  id="species_id"
                >
                  <option value="" disabled>
                    Sélectionnez
                  </option>
                  <option value="1">Chat</option>
                  <option value="2">Chien</option>
                  <option value="3">Cheval</option>
                  <option value="4">Lapin</option>
                  <option value="5">Cochon d'Inde</option>
                  <option value="6">Hamster</option>
                  <option value="7">Furet</option>
                  <option value="8">Oiseau</option>
                  <option value="9">Serpent</option>
                  <option value="10">Lézard</option>
                  <option value="11">Tortue</option>
                  <option value="12">Rat</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="column">
          <div className="field">
            <label className="label" htmlFor="sexe">
              Sexe
            </label>
            <div className="control">
              <div className="select">
                <select
                  name="sexe"
                  value={formData.sexe}
                  onChange={handleChange}
                  aria-label="Sélectionnez un sexe"
                  id="sexe"
                >
                  <option value="" disabled>
                    Sélectionnez
                  </option>
                  <option value="M">Mâle</option>
                  <option value="F">Femelle</option>
                  <option value="">Indifférent</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="column">
          <div className="field">
            <label className="label" htmlFor="age">
              Âge
            </label>
            <div className="control">
              <div className="select">
                <select
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  aria-label="Sélectionnez un âge"
                  id="age"
                >
                  <option value="" disabled>
                    Sélectionnez
                  </option>
                  <option value="-1">- d'1 an</option>
                  <option value="1-3">Entre 1 et 3 ans</option>
                  <option value="3-5">Entre 3 et 5 ans</option>
                  <option value="+5">Plus de 5 ans</option>
                  <option value="">Indifférent</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label" htmlFor="quantity">
              Quantité
            </label>
            <div className="control">
              <input
                className="input"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Entrez la quantité"
                aria-label="Entrez la quantité"
                id="quantity"
                max="50"
              />
            </div>
          </div>
        </div>

        <div className="column">
          <div className="field">
            <label className="label" htmlFor="search_area">
              Périmètre
            </label>
            <div className="control">
              <input
                className="input"
                type="range"
                name="search_area"
                value={formData.search_area}
                onChange={handleChange}
                min="30"
                max="1000"
                aria-label="Sélectionnez le périmètre de recherche"
                id="search_area"
              />
              <p>
                Périmètre : <strong>{formData.search_area}</strong> Km
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="control">
        <button
          className="button is-primary is-fullwidth"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Envoi en cours...' : 'Valider'}
        </button>
      </div>
    </form>
  );
};

export default AddFosterlingProfileForm;
