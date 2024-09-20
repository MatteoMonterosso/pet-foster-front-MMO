import { useState, useEffect } from 'react';
import instanceAxios from '../../../axiosSetup/axiosSetup';
import { useNavigate } from 'react-router-dom';
import AnimalItemList from '../partials/AnimalItemList';
import { useModal } from '../../hooks/ModalContext';
import { useAuth } from '../../hooks/AuthContext';
import { PlusSmall } from 'react-flaticons';
import { User } from 'src/@interfaces/user';
import { UserAnimal } from 'src/@interfaces/userAnimals';
import { Helmet } from 'react-helmet';

const MesAnimaux = () => {
  // State pour stocker les animaux (du user)
  const [myUser, setMyUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { openModal, isActive, closeModal } = useModal();
  const { user: connectedUser } = useAuth();
  const navigate = useNavigate();
  // Si l'utilisateur n'est pas connecté, rediriger vers la page d'accueil'
  useEffect(() => {
    if (!connectedUser) {
      navigate('/');
    }
  }, [connectedUser, navigate]);

  // Récupérer les animaux de l'utilisateur
  useEffect(() => {
    // console.log('Connected user:', connectedUser);
    if (!connectedUser) {
    }

    if (connectedUser) {
      instanceAxios
        .get(`/users/${connectedUser.userId}`)
        .then((response) => {
          // console.log('User data:', response.data);
          setMyUser(response.data); // Assurez-vous que `response.data` contient bien la structure attendue pour `myUser`
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setFetchError('Erreur lors de la récupération des données.');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [connectedUser, isActive]);

  return (
    <>
      <Helmet>
        <title>Pet Foster : Mes animaux</title>
        <meta
          name="description"
          content="Liste de vos animaux sur Pet Foster."
        />
      </Helmet>
      <main>
        <div>
          <h1 className="title">Mes animaux</h1>
        </div>
        {/* {JSON.stringify(myUser?.userAnimals)} */}
        <section className="section">
          <div className="has-text-centered">
            {connectedUser && connectedUser.userType === 'association' && (
              <button
                className="button is-primary is-pulled-right"
                onClick={() => openModal('createAnimal')}
              >
                <PlusSmall /> Enregistrer un animal
              </button>
            )}
          </div>
        </section>

        {/* Chargement ou message d'erreur */}
        {loading ? (
          <p>Chargement...</p>
        ) : fetchError ? (
          <p>{fetchError}</p>
        ) : (
          <div className="container columns is-multiline">
            {/* Liste des animaux créés */}
            {connectedUser?.userType &&
              connectedUser.userType === 'association' && (
                <div className="column is-full is-half-desktop">
                  <h2 className="subtitle">
                    Animaux créés{' '}
                    {myUser?.createdAnimals &&
                      myUser.createdAnimals.length > 0 && (
                        <span className="is-size-6	">
                          ({myUser.createdAnimals.length})
                        </span>
                      )}
                  </h2>
                  {/* {JSON.stringify(myUser?.createdAnimals)} */}
                  {myUser?.createdAnimals &&
                  myUser.createdAnimals.length > 0 ? (
                    myUser.createdAnimals.map((oneAnimal) => (
                      <AnimalItemList animal={oneAnimal} key={oneAnimal.id} />
                    ))
                  ) : (
                    <div className="notification is-info is-light ">
                      <p className="is-full has-text-centered">
                        Vous n'avez pas encore créé d'animaux.
                      </p>
                    </div>
                  )}
                </div>
              )}

            {/* Liste des animaux hébergés */}

            <div
              className={
                connectedUser?.userType === 'association'
                  ? 'column is-full is-half-desktop'
                  : 'column is-full'
              }
            >
              <h2 className="subtitle">
                Animaux hébergés{' '}
                {myUser?.userAnimals &&
                  myUser.userAnimals.filter(
                    (animal) => animal.date_end === null
                  ).length > 0 && (
                    <span className="is-size-6	">
                      (
                      {
                        myUser.userAnimals.filter(
                          (animal) => animal.date_end === null
                        ).length
                      }
                      )
                    </span>
                  )}
              </h2>
              {myUser?.userAnimals && myUser.userAnimals.length > 0 ? (
                myUser.userAnimals
                  .filter((animal) => animal.date_end === null)
                  .map((sejour) => (
                    <AnimalItemList animal={sejour.animal} key={sejour.id} />
                  ))
              ) : (
                <div className="notification is-info is-light ">
                  <p className="is-full has-text-centered">
                    Vous n'hébergez aucun animal pour le moment.
                    <br />
                    Vous pouvez <strong>
                      Créer un profil d'accueil
                    </strong> ou{' '}
                    <strong>Faire une demande sur un animal</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default MesAnimaux;
