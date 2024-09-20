import React, { useState, useEffect } from 'react';
import instanceAxios from '../../../axiosSetup/axiosSetup';
import LoginForm from '../formulaires/Login';
import { useToast } from '../../hooks/ToastContext';
import axios from 'axios';

const RegistrationPage = () => {
  const { showSuccessToast, showErrorToast } = useToast();

  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [type_user, settype_user] = useState('');
  const [email, setEmail] = useState('');
  const [name, setname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [country, setcountry] = useState('');
  const [zip, setzip] = useState('');
  const [city, setcity] = useState('');
  const [citysOptions, setcitysOptions] = useState<string[]>([]); // Liste des citys
  const [address, setAddress] = useState('');
  const [phone, setphone] = useState('');
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    // Traitement des données du formulaire, y compris latitude et longitude
    const formData = {
      type_user,
      email,
      name,
      password,
      country,
      zip,
      city,
      address,
      phone,
      description: '',
      longitude: longitude ?? 0, // Assurez-vous que les valeurs existent
      latitude: latitude ?? 0, // Assurez-vous que les valeurs existent
    };

    console.log(JSON.stringify(formData));

    try {
      const response = await instanceAxios.post('/users', formData, {
        headers: {
          'Content-Type': 'application/json',
          'x-xsrf-token': csrfToken || '',
        },
      });

      console.log('Utilisateur créé avec succès :', response);
      showSuccessToast(
        'Votre compte a bien été créé ! Vous pouvez maintenant vous connecter'
      );
      setActiveTab('login');
    } catch (error) {
      showErrorToast(
        'Erreur, veuillez recommencer ' + error.response.data.error
      );
      console.log(error);
    }

    setLoading(false);
  };

  // Fonction pour récupérer les citys à partir du code postal
  const fetchcitys = async (zip: string) => {
    try {
      const response = await axios.get(`https://api.zippopotam.us/fr/${zip}`);
      const citys = response.data.places.map(
        (place: any) => place['place name']
      );
      setcitysOptions(citys);
    } catch (error) {
      console.error('Erreur lors de la récupération des citys:', error);
      setcitysOptions([]); // Réinitialise si erreur
    }
  };

  // Gérer le changement du code postal
  const handlezipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newzip = e.target.value;
    setzip(newzip);

    // Si le code postal a au moins 5 chiffres, effectuer la recherche de citys
    if (newzip.length === 5) {
      fetchcitys(newzip);
    } else {
      setcitysOptions([]); // Réinitialise si le code postal est trop court
    }
  };

  // Gérer le changement de la ville et récupérer les coordonnées
  const handleCityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value;
    setcity(selectedCity);

    if (selectedCity && country) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?city=${selectedCity}&country=${country}&format=json`
        );
        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
          setLatitude(parseFloat(lat));
          setLongitude(parseFloat(lon));

          // Affichage de la notification des coordonnées
          showSuccessToast(
            `Coordonnées de ${selectedCity}: Latitude: ${lat}, Longitude: ${lon}`
          );
        } else {
          showErrorToast('Impossible de trouver les coordonnées de la ville.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des coordonnées:', error);
        showErrorToast('Erreur lors de la récupération des coordonnées.');
      }
    }
  };

  return (
    <>
      <div>
        <h1 className="title has-text-centered">Inscription</h1>
      </div>
      <div className="container">
        <div className="tabs is-centered">
          <ul>
            <li
              className={activeTab === 'login' ? 'is-active' : ''}
              onClick={() => setActiveTab('login')}
            >
              <a>Connexion</a>
            </li>
            <li
              className={activeTab === 'signup' ? 'is-active' : ''}
              onClick={() => setActiveTab('signup')}
            >
              <a>Créer un compte</a>
            </li>
          </ul>
        </div>

        <div className="box">
          {activeTab === 'login' ? (
            <LoginForm />
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Type d'utilisateur */}
              <div className="field">
                <label className="label">
                  Type d'utilisateur <span className="has-text-danger">*</span>
                </label>
                <div className="control columns is-multiline">
                  <label className="radio column is-one-third-desktop">
                    <input
                      type="radio"
                      name="type_user"
                      value="adoptant"
                      checked={type_user === 'adoptant'}
                      onChange={(e) => settype_user(e.target.value)}
                    />
                    Adoptant
                  </label>
                  <label className="radio column is-one-third-desktop">
                    <input
                      type="radio"
                      name="type_user"
                      value="famille"
                      checked={type_user === 'famille'}
                      onChange={(e) => settype_user(e.target.value)}
                    />
                    Famille d'accueil
                  </label>
                  <label className="radio column is-one-third-desktop">
                    <input
                      type="radio"
                      name="type_user"
                      value="association"
                      checked={type_user === 'association'}
                      onChange={(e) => settype_user(e.target.value)}
                    />
                    Association
                  </label>
                </div>
              </div>

              {/* Email */}
              <div className="field">
                <label className="label">
                  Email <span className="has-text-danger">*</span>
                </label>
                <div className="control">
                  <input
                    className="input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Nom */}
              <div className="field">
                <label className="label">
                  Nom <span className="has-text-danger">*</span>
                </label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="Nom"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="field">
                <label className="label">
                  Mot de passe <span className="has-text-danger">*</span>
                </label>
                <div className="control">
                  <input
                    className="input"
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Confirmation du mot de passe */}
              <div className="field">
                <label className="label">
                  Confirmer le mot de passe{' '}
                  <span className="has-text-danger">*</span>
                </label>
                <div className="control">
                  <input
                    className="input"
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {passwordError && (
                  <p className="help is-danger">{passwordError}</p>
                )}
              </div>

              {/* Pays */}
              <div className="field">
                <label className="label">
                  Pays <span className="has-text-danger">*</span>
                </label>
                <div className="control">
                  <div className="select">
                    <select
                      value={country}
                      onChange={(e) => setcountry(e.target.value)}
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

              {/* Code postal */}
              <div className="field">
                <label className="label">
                  Code postal <span className="has-text-danger">*</span>
                </label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    placeholder="Code postal"
                    value={zip}
                    onChange={handlezipChange}
                    required
                  />
                </div>
              </div>

              {/* Ville */}
              <div className="field">
                <label className="label">
                  Ville <span className="has-text-danger">*</span>
                </label>
                <div className="control">
                  <div className="select">
                    <select value={city} onChange={handleCityChange} required>
                      <option value="">Sélectionnez une ville</option>
                      {citysOptions.map((cityOption, index) => (
                        <option key={index} value={cityOption}>
                          {cityOption}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Adresse */}
              <div className="field">
                <label className="label">Adresse</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="Adresse"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div className="field">
                <label className="label">Téléphone</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="Téléphone"
                    value={phone}
                    onChange={(e) => setphone(e.target.value)}
                  />
                </div>
              </div>

              {/* Soumettre */}
              <div className="field">
                <div className="control">
                  <button
                    className={`button is-primary is-fullwidth ${loading ? 'is-loading' : ''}`}
                    type="submit"
                  >
                    S'inscrire
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default RegistrationPage;
