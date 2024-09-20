import { Link } from 'react-router-dom';
import { Pencil, Eye } from 'react-flaticons';
import { useModal } from '../../hooks/ModalContext';
import { Animal } from 'src/@interfaces/animal';
import { useAuth } from '../../hooks/AuthContext';
import instanceAxios from '../../../axiosSetup/axiosSetup';
import { useToast } from '../../hooks/ToastContext';

// Utilitaire pour calculer l'âge de l'animal
import computeAge from '../../utils/computeAge';
import { useState, useEffect } from 'react';
import MiniatureAnimal from './Miniature';
import IdToSPecies from './IdToSpecies';

// Interface pour définir les propriétés passées au composant
interface AnimalListItemProps {
  animal: Animal;
}

function AnimalItemList({ animal }: AnimalListItemProps) {
  const { showErrorToast } = useToast();
  // On récupère l'utilisateur connecté via le contexte Auth
  const { user: connectedUser } = useAuth();
  // On récupère la fonction openModal via le contexte Modal
  const { openModal } = useModal();

  // Vérification si l'objet animal ou animal.creator est indéfini
  // if (!animal || !animal.creator) {
  //   // Si animal ou creator est absent, on ne retourne rien (ou on peut afficher un indicateur de chargement)
  //   return null;
  // }
  // const [csrfToken, setCsrfToken] = useState<string | null>(null);
  // useEffect(() => {
  //   const fetchCsrfToken = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:3000/api/csrf-token', {});
  //       setCsrfToken(response.data);
  //     } catch (error) {
  //       console.error('Erreur lors de la récupération du token CSRF:', error);
  //     }
  //   };
  //   fetchCsrfToken();
  // }, []);
  const [animalDetail, setAnimalDetail] = useState<Animal | null>(null);

  // fecth plus de détail sur l'animal
  useEffect(() => {
    const fetchAnimalData = async () => {
      try {
        const animalResponse = await instanceAxios.get(`/animals/${animal.id}`);
        setAnimalDetail(animalResponse.data);
      } catch (error) {
        showErrorToast('Erreur réseau');
      }
      // finally {
      //   setLoading(false);
      // }
    };

    fetchAnimalData();
  }, [animal.id, showErrorToast]);
  return (
    <article className="box">
      <div className="columns is-vcentered ">
        {/* Affichage de l'image miniature de l'animal */}

        <MiniatureAnimal animal={animal} />

        {/* Conteneur du texte avec les informations de l'animal */}
        <div className="column is-two-thirds-mobile">
          <div className="columns">
            {/* Espèce de l'animal */}
            <div className="column">
              {' '}
              <p className="has-text-weight-bold has-text-left">
                {animal.name}{' '}
              </p>
              <IdToSPecies speciesId={animal.species_id} />
            </div>
            {/* Calcul et affichage de l'âge de l'animal */}
            <div className="column">
              Age: {computeAge(animal.date_of_birth)}
            </div>
            {/* Sexe de l'animal */}
            <div className="column">
              {animal.sexe === 'F' ? (
                <img
                  src="/img/vector/femelle.svg"
                  width="25"
                  height="25"
                  alt="Female"
                />
              ) : (
                <img
                  src="/img/vector/male.svg"
                  width="25"
                  height="25"
                  alt="Male"
                />
              )}
            </div>
          </div>
        </div>

        <div className="column is-narrow is-size-7">
          {/* {JSON.stringify(animal?.animalOwners[0]?.user.name)} */}
          {animal && animal.animalOwners && animal.animalOwners.length && (
            <Link to={`/profil/${animal?.animalOwners[0].user.id}`}>
              {animal?.animalOwners[0]?.user.name}
            </Link>
          )}
        </div>

        {/* Colonne avec les boutons d'actions (édition et visualisation) */}
        <div className="column is-narrow has-text-centered">
          {/* Bouton d'édition visible uniquement si l'utilisateur connecté est le créateur de l'animal */}
          {connectedUser && connectedUser.userId === animal.creator?.id && (
            <button
              className="has-text-success button"
              onClick={() =>
                openModal('editAnimalProfile', null, null, animal.id)
              }
              aria-label="éditer cet animal"
            >
              <Pencil />
            </button>
          )}

          {/* Lien pour voir le profil détaillé de l'animal */}
          <Link to={`/animal/${animal.id}`} className="button has-text-info">
            <Eye />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default AnimalItemList;
