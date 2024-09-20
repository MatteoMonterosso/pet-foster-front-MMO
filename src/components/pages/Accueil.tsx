import { useState, useEffect } from 'react';
// import { LatLngExpression, Icon } from 'leaflet';
import AnimalItemList from '../partials/AnimalItemList';
import MapComponent from '../partials/MapComponent';
import Messagerie from '../partials/Messagerie';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import GeolocNotification from '../partials/GeolocNotification';
import { Helmet } from 'react-helmet';
import UserTypeInfo from '../partials/UserTypeInfo';
import { useModal } from '../../hooks/ModalContext';
import instanceAxios from '../../../axiosSetup/axiosSetup';

// import { useGeolocation } from '../../hooks/GeolocationContext';

// const defaultPosition: LatLngExpression = [43.3365, 1.3396];

// Custom icon for the user's location
// const userIcon = new Icon({
//   iconUrl: '/img/vector/your-position-marker.svg',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
// });

function Accueil() {
  const { closeModal } = useModal();
  const { user: connectedUser } = useAuth();
  // const { location, error } = useGeolocation();

  // Use the user's location or the default one
  // const mapCenter: LatLngExpression = location ? [location.lat, location.lng] : defaultPosition;

  // Fetching animals data
  const [allAnimals, setAllAnimals] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetching users data
  const [allUsers, setAllUsers] = useState<any>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [fetchUsersError, setFetchUsersError] = useState<string | null>(null);

  // Fetch animals data
  useEffect(() => {
    instanceAxios
      .get('/animals')
      .then((response) => {
        setAllAnimals(response.data);
        setLoading(false);
      })
      .catch(() => {
        setFetchError('Erreur lors de la récupération des données');
        setLoading(false);
      });
  }, [closeModal]);

  // Fetch users data
  useEffect(() => {
    instanceAxios
      .get('/users')
      .then((response) => {
        setAllUsers(response.data);
        setLoadingUsers(false);
      })
      .catch(() => {
        setFetchUsersError('Erreur lors de la récupération des données');
        setLoadingUsers(false);
      });
  }, [closeModal]);

  return (
    <>
      <Helmet>
        <title>Pet Foster : Bienvenue!</title>
        <meta
          name="description"
          content="Pet Foster est une application web qui permet aux associations de protections des animaux, aux familles d'accueil et aux adoptants d'échanger et de trouver ensemble un foyer pour chaque animal."
        />
      </Helmet>
      <main>
        <div
          id="splash-screen"
          className="columns is-vcentered has-text-centered is-multiline is-centered"
        >
          <div className="column is-full-mobile is-half-desktop ">
            <h1 className="title">
              {connectedUser
                ? `Bienvenue ${connectedUser.userName}`
                : 'Bienvenue sur Pet Foster !'}
            </h1>
            <h2 className="subtitle">Un foyer pour chaque animal</h2>
          </div>
          {/* N'afficher le bouton que si l'utilisateur n'est pas connecté */}
          {!connectedUser && (
            <div className="column is-full-mobile is-half-desktop">
              <Link className="button is-primary is-large" to="/connexion">
                Créer mon compte
              </Link>
            </div>
          )}
        </div>

        <section className="section">
          <div className="columns is-variable is-8">
            <div className="column has-text-centered">
              <h3 className="title is-4">
                <img
                  src="/img/vector/marker-losange.svg"
                  width="50"
                  height="50"
                  alt="Icône association"
                />
                <br />
                Associations
              </h3>
              <p className="is-size-5">
                Trouvez des foyers d'accueil temporaires ou définitifs pour vos
                animaux
              </p>
            </div>
            <div className="column has-text-centered">
              <h3 className="title is-4">
                <img
                  src="/img/vector/marker-triangle2.svg"
                  width="50"
                  height="50"
                  alt="Icône famille d'accueil"
                />
                <br />
                Familles d'accueil
              </h3>
              <p className="is-size-5">
                Renseignez vos possibilités d'accueil et entrez en contact avec
                des associations.
              </p>
            </div>

            <div className="column has-text-centered">
              <h3 className="title is-4">
                <img
                  src="/img/vector/marker-round2.svg"
                  width="50"
                  height="50"
                  alt="Icône adoptant"
                />
                <br />
                Adoptants
              </h3>
              <p className="is-size-5">
                Adoptez l'animal de vos rêves en quelques clics.
              </p>
            </div>
          </div>
          <GeolocNotification />
        </section>

        {connectedUser && <Messagerie />}

        <section className="section yellow-line">
          <div className="container info-block">
            <h2 className="title is-3">
              {allAnimals?.length} animaux et {allUsers?.length} associations
              dans toute la France
            </h2>
          </div>

          <div className="columns is-align-items-start">
            <div
              className="column is-full-mobile is-half-tablet is-7-desktop"
              id="home-map-container"
            >
              <MapComponent users={allUsers} />
              <UserTypeInfo />
            </div>

            <div className="column is-full-mobile is-5-desktop">
              <div className="animal-list ">
                {/* {JSON.stringify(allAnimals)} */}
                {allAnimals &&
                  allAnimals.map((item: any) => (
                    <AnimalItemList animal={item} key={item.id} />
                  ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section info-block">
          <div className="container">
            <h2 className="title is-3">
              Vous souhaitez affiner votre recherche?
            </h2>
            <div className="columns is-variable is-8">
              <div className="column is-full-mobile is-half-desktop">
                <p>
                  Vous pouvez affiner votre recherche pour trouver l'animal
                  idéal. Utilisez nos filtres par espèce, âge, sexe et distance
                  pour faciliter votre adoption ou accueil.
                </p>
              </div>
              <div className="column is-full-mobile is-half-desktop has-text-centered">
                <Link className="button is-primary" to="/trouver-animal">
                  Voir les animaux
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Accueil;
