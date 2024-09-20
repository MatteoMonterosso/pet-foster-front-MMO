import { useState, useEffect } from 'react';
import instanceAxios from '../../../axiosSetup/axiosSetup';
import { useAuth } from '../../hooks/AuthContext';
import { User } from '../../@interfaces/user';
import { Animal } from '../../@interfaces/animal';
import { FRequest } from '../../@interfaces/frequest';
import { useNavigate } from 'react-router-dom';
import { Check, Cross } from 'react-flaticons';
import MiniatureAnimal from '../partials/Miniature';

const FilterPage = () => {
  // Gestion du token CSRF
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const navigate = useNavigate();
  const [myUser, setMyUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { user: connectedUser } = useAuth();
  const [requestUserDetails, setRequestUserDetails] = useState<
    Record<number, User>
  >({});
  const [requestAnimalDetails, setRequestAnimalDetails] = useState<
    Record<number, Animal>
  >({});
  const [allFosterlingRequests, setAllFosterlingRequests] = useState<
    FRequest[]
  >([]);

  function sortRequests(requestsList: FRequest[]) {
    type Etats = 'pending' | 'approved' | 'rejected';

    // Fonction de comparaison pour le tri
    const ordreDesEtats = {
      Pending: 1 as number, // On met pending en premier
      Approved: 2 as number, // approved en second
      Rejected: 3 as number, // rejected en dernier
    };

    const orderedList = [...requestsList].sort((a, b) => {
      return (
        ordreDesEtats[a.request_status as Etats] -
        ordreDesEtats[b.request_status as Etats]
      );
    });

    console.log('TRI !');

    return orderedList;
  }

  // Récupérer les données de l'utilisateur connecté
  useEffect(() => {
    if (connectedUser) {
      instanceAxios
        .get(`/users/${connectedUser.userId}`)
        .then((response) => {
          const userData = response.data;
          setMyUser(userData);
          setLoading(false);

          const fetchFosterlingDetails = async () => {
            const userRequests = userData.fosterlingRequests || [];

            // Récupérer les détails des utilisateurs et des animaux
            const userDetailsPromises = userRequests.map((request: any) =>
              instanceAxios.get(`/users/${request.users_id}`)
            );
            const animalDetailsPromises = userRequests.map((request: any) =>
              instanceAxios.get(`/animals/${request.animals_id}`)
            );

            const userDetailsResponses = await Promise.all(userDetailsPromises);
            const animalDetailsResponses = await Promise.all(
              animalDetailsPromises
            );

            const userDetailsMap = userDetailsResponses.reduce(
              (acc: Record<number, User>, userResponse) => {
                acc[userResponse.data.id] = userResponse.data;
                return acc;
              },
              {}
            );

            const animalDetailsMap = animalDetailsResponses.reduce(
              (acc: Record<number, Animal>, animalResponse) => {
                acc[animalResponse.data.id] = animalResponse.data;
                return acc;
              },
              {}
            );

            setRequestUserDetails(userDetailsMap);
            setRequestAnimalDetails(animalDetailsMap);
          };

          fetchFosterlingDetails();
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des données:', error);
          setFetchError('Erreur lors de la récupération des données.');
          setLoading(false);
        });
    } else {
      setLoading(false);
      navigate('/');
    }
  }, [connectedUser, navigate]);

  // Récupérer toutes les demandes
  useEffect(() => {
    async function getAllRequests() {
      try {
        const response = await instanceAxios.get('/requests');
        setAllFosterlingRequests(sortRequests(response.data));
      } catch (e) {
        console.error(e);
      }
    }
    const fetchCsrfToken = async () => {
      try {
        const response = await instanceAxios.get('/csrf-token');
        setCsrfToken(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du token CSRF:', error);
      }
    };

    getAllRequests();
    fetchCsrfToken();
  }, []);

  const handleConfirm = async (requestId: number, status: string) => {
    if (
      window.confirm(
        status === 'approved'
          ? 'Êtes-vous sûr de vouloir valider ?'
          : 'Êtes-vous sûr de vouloir refuser ?'
      )
    ) {
      try {
        await instanceAxios.patch(
          `/requests/${requestId}`,
          { request_status: status },
          {
            headers: {
              'x-xsrf-token': csrfToken || '',
            },
          }
        );

        const response = await instanceAxios.get(`/requests/${requestId}`);

        const requestData = response.data;

        const newAllFosterlingRequests = allFosterlingRequests.filter(
          (request) => request.id !== requestId
        );

        newAllFosterlingRequests.push(requestData);
        setAllFosterlingRequests(sortRequests(newAllFosterlingRequests));

        if (status === 'approved') {
          alert('Demande validée avec succès.');
        } else {
          alert('Demande refusée avec succès.');
        }
      } catch (error) {
        alert('Erreur lors de la validation de la demande.');
        console.error(error);
      }
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (fetchError) return <p>{fetchError}</p>;

  console.log(allFosterlingRequests);

  return (
    <>
      <div>
        <h1 className="title">Mes demandes</h1>
      </div>
      <section className="section">
        <div className="container">
          <div className="notification is-info is-light">
            {connectedUser?.userType === 'association' ? (
              <p>
                Cette page liste les demandes d'adoption ou d'accueil temporaire
                pour vos animaux enregistrés.
              </p>
            ) : (
              <p>
                Cette page liste les demandes d'adoption que vous avez
                formulées.
              </p>
            )}
          </div>
        </div>
        <div className="container">
          <table id="request-table" className="table is-fullwidth">
            <thead>
              <tr>
                <th colSpan={2} className="has-text-centered">
                  Animal
                </th>
                {connectedUser?.userType === 'association' ? (
                  <th>Demandeur</th>
                ) : (
                  <th>Propriétaire</th>
                )}
                <th>Texte</th>
                <th>Statut</th>
                {connectedUser?.userType === 'association' && (
                  <th>Validation</th>
                )}
              </tr>
            </thead>
            <tbody>
              {myUser?.type_user === 'association' &&
                allFosterlingRequests?.map((request) => {
                  const animal = myUser.createdAnimals.find(
                    (animal) => animal.id === request.animals_id
                  );

                  if (animal) {
                    return (
                      <tr key={request.id}>
                        <td>
                          {/* <div className="animal-miniature">
                            <img
                              src={`/img/animaux/${request.animal.pictures[0].URL_picture}`}
                              alt={request.animal.name}
                              width="64"
                              height="64"
                            />
                          </div> */}
                          <MiniatureAnimal animal={animal} />
                        </td>
                        <td>{animal.name}</td>
                        <td>
                          <a href={`/profil/${request.user.id}`}>
                            {request.user.name}
                          </a>
                        </td>
                        <td>{request.content_request}</td>
                        <td className="request-status">
                          {request.request_status.toLowerCase() ===
                            'pending' && (
                            <span className="tag is-warning">En attente</span>
                          )}
                          {request.request_status.toLowerCase() ===
                            'rejected' && (
                            <span className="tag is-danger">Rejetée</span>
                          )}
                          {request.request_status.toLowerCase() ===
                            'approved' && (
                            <span className="tag is-success">Validée</span>
                          )}
                        </td>
                        <td className="validator">
                          {request.request_status.toLowerCase() ===
                            'pending' && (
                            <>
                              <button
                                className="button is-small is-success"
                                aria-label="Valider la demande"
                                onClick={() => {
                                  console.log(allFosterlingRequests);
                                  handleConfirm(request.id, 'approved');
                                }}
                              >
                                <Check size={15} />
                              </button>
                              <button
                                className="button is-small is-danger"
                                aria-label="Refuser la demande"
                                onClick={() =>
                                  handleConfirm(request.id, 'rejected')
                                }
                              >
                                <Cross size={15} />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  }
                  return null;
                })}

              {myUser?.fosterlingRequests?.map((item: any, index: number) => (
                <tr key={index}>
                  <td>
                    <MiniatureAnimal
                      animal={requestAnimalDetails[item.animals_id]}
                    />
                    {/* {JSON.stringify(item)} */}
                  </td>
                  <td>
                    <a
                      href={`/animal/${requestAnimalDetails[item.animals_id]?.id}`}
                    >
                      {requestAnimalDetails[item.animals_id]?.name ||
                        'Chargement...'}
                    </a>
                  </td>
                  {connectedUser?.userType === 'association' ? (
                    <td>
                      <a
                        href={`/profil/${requestUserDetails[item.users_id]?.id}`}
                      >
                        {requestUserDetails[item.users_id]?.name ||
                          'Chargement...'}
                      </a>
                    </td>
                  ) : (
                    <>
                      <td>
                        <a
                          href={`/profil/${requestAnimalDetails[item.animals_id]?.creator.id}`}
                        >
                          {requestAnimalDetails[item.animals_id]?.creator.name}
                        </a>
                      </td>
                      <td>{item.content_request}</td>
                    </>
                  )}
                  <td>
                    {item.request_status.toLowerCase() === 'pending' && (
                      <span className="tag is-warning">En attente</span>
                    )}
                    {item.request_status.toLowerCase() === 'rejected' && (
                      <span className="tag is-danger">Rejetée</span>
                    )}
                    {item.request_status.toLowerCase() === 'approved' && (
                      <span className="tag is-success">Validée</span>
                    )}
                  </td>
                  {/*{connectedUser?.userType === 'association' && (
                    <td>
                      <button
                        className="button is-primary"
                        onClick={() => handleConfirm(item.id)}
                      >
                        Valider
                      </button>
                    </td>
                      )}}*/}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default FilterPage;
