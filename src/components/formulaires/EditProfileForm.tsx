import React, { useState, useEffect } from 'react';
import axios from 'axios';
import instanceAxios from '../../../axiosSetup/axiosSetup';
import { useToast } from '../../hooks/ToastContext';
import { User } from 'src/@interfaces/user';

// Interface pour les données du formulaire
interface FormData {
  name: string;
  phone: string;
  country: string;
  zip: string | number;
  city: string;
  address: string;
  description: string;
  website: string;
}

// Interface pour les propriétés du formulaire d'édition
interface EditProfileFormProps {
  user?: User | null;
}

function EditProfileForm({ user }: EditProfileFormProps) {
  const { showSuccessToast, showErrorToast } = useToast();

  // État pour stocker le token CSRF
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  // État pour stocker la position (latitude, longitude)
  const [position, setPosition] = useState<number[] | null>(null);

  // État pour les données du formulaire, initialisé avec les données de l'utilisateur
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || '',
    phone: user?.phone || '',
    country: user?.country || '',
    zip: user?.zip || '',
    city: user?.city || '',
    address: user?.address || '',
    description: user?.description || '',
    website: user?.website || '',
  });

  const [loading, setLoading] = useState(false); // Pour indiquer le chargement lors de la soumission
  const [cityOptions, setCityOptions] = useState<string[]>([]); // Liste des villes basées sur le code postal

  // Effet pour récupérer le token CSRF au chargement du composant
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await instanceAxios.get('/csrf-token');
        setCsrfToken(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du token CSRF:', error);
        showErrorToast('Erreur lors de la récupération du token CSRF');
      }
    };
    fetchCsrfToken();
  }, [showErrorToast]);

  // Effet pour pré-remplir le formulaire avec les données de l'utilisateur si elles sont disponibles
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        country: user.country || '',
        zip: user.zip || '',
        city: user.city || '',
        address: user.address || '',
        description: user?.description || '',
        website: user?.website || '',
      });
    }
  }, [user]);

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Met à jour le champ correspondant dans formData
    });
  };

  // Gère le changement de ville et récupère les coordonnées (latitude, longitude) pour la ville sélectionnée
  const handleCityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value;
    setFormData((prevData) => ({ ...prevData, city: selectedCity }));

    if (selectedCity && formData.country) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?city=${selectedCity}&country=${formData.country}&format=json`
        );
        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
          showSuccessToast(
            `Coordonnées de ${selectedCity}: Latitude: ${lat}, Longitude: ${lon}`
          );
          setPosition([lat, lon]);
        } else {
          showErrorToast('Impossible de trouver les coordonnées de la ville.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des coordonnées:', error);
        showErrorToast('Erreur lors de la récupération des coordonnées.');
      }
    }
  };

  // Récupère les villes associées à un code postal
  const fetchCities = async (zip: string) => {
    try {
      const response = await axios.get(`https://api.zippopotam.us/fr/${zip}`);
      const cities = response.data.places.map(
        (place: any) => place['place name']
      );
      setCityOptions(cities);
    } catch (error) {
      console.error('Erreur lors de la récupération des villes:', error);
      showErrorToast('Erreur lors de la récupération des villes.');
      setCityOptions([]); // Réinitialise la liste des villes en cas d'erreur
    }
  };

  // Gère le changement du code postal et appelle fetchCities pour récupérer les villes associées
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPostalCode = e.target.value;
    setFormData((prevData) => ({ ...prevData, zip: newPostalCode }));

    // Si le code postal a 5 chiffres, récupère les villes
    if (newPostalCode.length === 5) {
      fetchCities(newPostalCode);
    } else {
      setCityOptions([]); // Réinitialise les options si le code postal est trop court
    }
  };

  // Gère la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Affiche l'indicateur de chargement

    try {
      const response = await instanceAxios.put(
        `/users/${user?.id}`,
        {
          ...formData,
          latitude: position ? position[0] : null,
          longitude: position ? position[1] : null,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-xsrf-token': csrfToken || '',
          },
        }
      );
      console.log(formData);
      if (response.status === 200) {
        showSuccessToast('Profil mis à jour avec succès');
      } else {
        showErrorToast('Erreur lors de la mise à jour du profil');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du profil', error);
      showErrorToast('Erreur lors de la soumission du profil');
    } finally {
      setLoading(false); // Cache l'indicateur de chargement
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Champ Nom */}
      <div className="field">
        <label className="label">Nom</label>
        <div className="control">
          <input
            className="input"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Votre nom"
            aria-label="Nom"
            required
            type="text"
          />
        </div>
      </div>

      {/* Champ Téléphone */}
      <div className="field">
        <label className="label">Tél</label>
        <div className="control">
          <input
            className="input"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Votre numéro de téléphone"
            aria-label="Téléphone"
            required
          />
        </div>
      </div>

      {/* Champ Pays */}
      <div className="field">
        <label className="label">Pays</label>
        <div className="control">
          <div className="select">
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez un pays</option>
              <option value="france">France</option>
              <option value="belgique">Belgique</option>
              <option value="suisse">Suisse</option>
            </select>
          </div>
        </div>
      </div>

      {/* Champs Code postal et Ville */}
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Code postal</label>
            <div className="control">
              <input
                className="input"
                name="zip"
                type="number"
                value={formData.zip}
                onChange={handlePostalCodeChange}
                placeholder="Votre code postal"
                aria-label="Code postal"
                required
              />
            </div>
          </div>
        </div>

        <div className="column">
          <div className="field">
            <label className="label">Ville</label>
            <div className="control">
              <div className="select">
                <select
                  value={formData.city}
                  onChange={handleCityChange}
                  required
                >
                  <option value="">Sélectionnez une ville</option>
                  {cityOptions.map((cityOption, index) => (
                    <option key={index} value={cityOption}>
                      {cityOption}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Champ Adresse */}
      <div className="field">
        <label className="label">Adresse</label>
        <div className="control">
          <input
            className="input"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Votre adresse (optionnel)"
            aria-label="Adresse"
            type="text"
          />
        </div>
      </div>

      {/* Champ Site web */}
      <div className="field">
        <label className="label">Site web</label>
        <div className="control">
          <input
            className="input"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Votre site web (optionnel)"
            aria-label="Site web"
            type="text"
          />
        </div>
      </div>

      {/* Champ Description */}
      <div className="field">
        <label className="label">Description</label>
        <div className="control">
          <input
            className="input"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Votre description (optionnel)"
            aria-label="Description"
            type="text"
          />
        </div>
      </div>

      {/* Bouton de soumission */}
      <div className="field">
        <div className="control">
          <button
            className={`button is-primary is-fullwidth ${loading ? 'is-loading' : ''}`}
            type="submit"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </form>
  );
}

export default EditProfileForm;
