import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useRef,
} from 'react';
import { Link } from 'react-router-dom';
import computeAge from '../../utils/computeAgeTrouverAnimal';
import instanceAxios from '../../../axiosSetup/axiosSetup';
import AnimalItemList from '../partials/AnimalItemList';
import MapComponent from '../partials/MapComponent';
import { useGeolocation } from '../../hooks/GeolocationContext';
import { useAuth } from '../../hooks/AuthContext';
import { User } from 'src/@interfaces/user';
import { Animal } from 'src/@interfaces/animal';
import { Filter, FilterSlash } from 'react-flaticons';
import { FosterlingProfileListItem } from 'src/@interfaces/fosterlingProfileListItem';
import GenderIcon from '../partials/GenderIcon';
import IdToSPecies from '../partials/IdToSpecies';
import UserTypeInfo from '../partials/UserTypeInfo';

type FormData = {
  species: string;
  age: string;
  sexe: string;
  search_area: number;
};

// Correspondance entre species_id et nom d'espèce
const speciesMap: { [key: number]: string } = {
  1: 'Chat',
  2: 'Chien',
  3: 'Cheval',
  4: 'Lapin',
  5: "Cochon d'Inde",
  6: 'Hamster',
  7: 'Furet',
  8: 'Oiseau',
  9: 'Serpent',
  10: 'Lézard',
  11: 'Tortue',
  12: 'Rat',
};

const TrouverAnimal: React.FC = () => {
  const divRef = React.useRef(null);
  const [numChildren, setNumChildren] = useState<number>(0);

  const getNumberOfChildren = () => {
    if (divRef.current) {
      return divRef.current.children.length;
    }
    return 0;
  };

  const { user: connectedUser } = useAuth();
  const { location } = useGeolocation();
  const [formData, setFormData] = useState<FormData>({
    species: '',
    age: '',
    sexe: '',
    search_area: 70,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAnimalFilterSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  const [allUsers, setAllUsers] = useState<User[] | null>(null);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [fetchUsersError, setFetchUsersError] = useState<string | null>(null);
  const [foundUsersAnimals, setFoundUsersAnimals] = useState<Animal[] | null>(
    null
  );
  const [foundUsersFosterlingProfiles, setFoundUsersFosterlingProfiles] =
    useState<FosterlingProfileListItem[] | null>(null);

  // Fetch all user animals and fosterling profiles
  useEffect(() => {
    if (allUsers) {
      setFoundUsersAnimals(
        allUsers.flatMap(
          (user) =>
            user.userAnimals?.map((userAnimal) => userAnimal.animal) || []
        )
      );
      setFoundUsersFosterlingProfiles(
        allUsers.flatMap((user) =>
          (user.fosterlingProfiles || []).map((profile) => ({
            ...profile,
            userName: user.name,
            userType: user.type_user,
          }))
        ) // Flatten fosterlingProfiles
      );
    }
  }, [allUsers]);

  // Fetch users data based on filters
  useEffect(() => {
    if (formData.search_area && location?.lat && location?.lng) {
      const speciesFilter = formData.species
        ? `&species=${formData.species}`
        : '';
      const apiUrl = `/users?perimeter=${formData.search_area}000&latitude=${location?.lat}&longitude=${location?.lng}${speciesFilter}`;

      instanceAxios
        .get(apiUrl)
        .then((response) => {
          setAllUsers(response.data);
          setLoadingUsers(false);
        })
        .catch(() => {
          setFetchUsersError('Error fetching data');
          setLoadingUsers(false);
        });
    }
  }, [formData, location]);
  useEffect(() => {
    if (divRef.current) {
      setNumChildren(divRef.current.children.length);
    }
  }, [foundUsersAnimals, foundUsersFosterlingProfiles]);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const handleFilterOpen = () => {
    setFilterOpen(!filterOpen);
  };

  return (
    <main>
      <div>
        {connectedUser && connectedUser.userType === 'association' ? (
          <h1 className="title">Trouver un foyer pour vos animaux</h1>
        ) : (
          <h1 className="title">Trouver un animal</h1>
        )}
      </div>

      {/* {JSON.stringify(filteredAnimals?.length || '0')} */}
      <div id="animal-filter" className={filterOpen ? 'open' : ''}>
        <button
          onClick={handleFilterOpen}
          className="button is-success"
          title="Filtrer"
        >
          {filterOpen ? <FilterSlash /> : <Filter />}
        </button>

        <form onSubmit={handleAnimalFilterSubmit}>
          <div className="field">
            <label className="label" htmlFor="species-dropdown">
              Espèce
            </label>
            <div className="control">
              <div className="select">
                <select
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                >
                  <option value="">Toutes</option>
                  {Object.values(speciesMap).map((species) => (
                    <option key={species} value={species}>
                      {species}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="age-dropdown">
              Age
            </label>
            <div className="control">
              <div className="select">
                <select name="age" value={formData.age} onChange={handleChange}>
                  <option value="">Peu importe</option>
                  <option value="-1">- de 1 an</option>
                  <option value="1-3">entre 1 et 3 ans</option>
                  <option value="3-5">entre 3 et 5 ans</option>
                  <option value="+5">+ de 5 ans</option>
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="sexe-dropdown">
              Sexe
            </label>
            <div className="control">
              <div className="select">
                <select
                  name="sexe"
                  value={formData.sexe}
                  onChange={handleChange}
                >
                  <option value="">Indifférent</option>
                  <option value="M">Mâle</option>
                  <option value="F">Femelle</option>
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Périmètre</label>
            <div className="control">
              <input
                type="range"
                name="search_area"
                value={formData.search_area}
                onChange={handleChange}
                min="70"
                max="1000"
              />
              <p>Périmètre : {formData.search_area} Km</p>
            </div>
          </div>
        </form>
      </div>

      <div className="map-and-animals">
        <div className="animals-maplist">
          <h2 className="subtitle">
            {connectedUser && connectedUser.userType === 'association'
              ? `${getNumberOfChildren()} possibilité d'accueil dans un périmètre de ${formData.search_area} Km`
              : `${getNumberOfChildren()} animaux trouvés dans un périmètre de ${formData.search_area} Km`}
          </h2>
          {(connectedUser?.userType !== 'association' &&
            getNumberOfChildren() === 0) ||
            (connectedUser?.userType === 'association' &&
              foundUsersFosterlingProfiles?.length === 0 && (
                <p className="notification is-info is-light">
                  Essayez d'agrandir le périmètre de recherche.
                </p>
              ))}

          {!connectedUser || connectedUser.userType !== 'association' ? (
            <div ref={divRef} className="animal-list">
              {foundUsersAnimals &&
                foundUsersAnimals
                  .filter((animal) => {
                    const animalAge = computeAge(animal.date_of_birth);
                    let ageMatches = true;
                    if (formData.age === '-1') {
                      ageMatches = animalAge < 1;
                    } else if (formData.age === '1-3') {
                      ageMatches = animalAge >= 1 && animalAge <= 3;
                    } else if (formData.age === '3-5') {
                      ageMatches = animalAge >= 3 && animalAge <= 5;
                    } else if (formData.age === '+5') {
                      ageMatches = animalAge > 5;
                    }

                    return (
                      ageMatches &&
                      (formData.species === '' ||
                        (animal.species_id &&
                          speciesMap[animal.species_id] ===
                            formData.species)) &&
                      (formData.sexe === '' || animal.sexe === formData.sexe)
                    );
                  })
                  .map((animal, index) => (
                    <AnimalItemList animal={animal} key={index} />
                  ))}
            </div>
          ) : (
            <div ref={divRef} className="animal-list">
              {foundUsersFosterlingProfiles &&
                foundUsersFosterlingProfiles
                  .filter((profile) => {
                    const speciesMatches =
                      profile.species_id &&
                      speciesMap[profile.species_id] === formData.species;
                    const sexeMatches =
                      formData.sexe === '' || profile.sexe === formData.sexe;
                    const ageMatches =
                      formData.age === '' || profile.age === formData.age;

                    return (
                      (!formData.species || speciesMatches) &&
                      sexeMatches &&
                      (!formData.age || ageMatches)
                    );
                  })
                  .map((profile, index) => (
                    <Link to={`/profil/${profile.users_id}`} key={index}>
                      <div className="yellow-card columns card is-vcentered m-4 is-mobile">
                        <div className="column has-text-centered">
                          <strong className="is-size-7">
                            {profile.userName}
                          </strong>
                          <br />
                          <span className="is-size-7">{profile.userType}</span>
                        </div>
                        <div className="column is-narrow">
                          {profile.quantity}
                        </div>
                        <div className="column">
                          <IdToSPecies speciesId={profile.species_id} />
                        </div>
                        <div className="column is-narrow">
                          <GenderIcon gender={profile.sexe} size={15} />
                        </div>
                        <div className="column">
                          {profile.age} an{profile.age === '-1' ? '' : 's'}
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>
          )}
        </div>
        <div className="map-column">
          <MapComponent
            users={allUsers}
            filters={formData}
            showSearchArea={true}
          />
          <UserTypeInfo />
        </div>
      </div>
    </main>
  );
};

export default TrouverAnimal;
