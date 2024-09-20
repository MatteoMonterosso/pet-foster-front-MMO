import { Link } from 'react-router-dom';
import { Pencil, Eye, Home } from 'react-flaticons';
import { useModal } from '../../hooks/ModalContext';
import { Animal } from 'src/@interfaces/animal';
import { useAuth } from '../../hooks/AuthContext';
// import axios from 'axios';
// import { useToast } from '../../hooks/ToastContext';

// Utilitaire pour calculer l'âge de l'animal
import computeAge from '../../utils/computeAge';
// import { useState, useEffect } from 'react';
import MiniatureAnimal from './Miniature';
import IdToSPecies from './IdToSpecies';
import GenderIcon from './GenderIcon';

// Interface pour définir les propriétés passées au composant
interface AnimalListItemProps {
  animal: Animal;
}

function AnimalItemList({ animal }: AnimalListItemProps) {
  // const { showErrorToast } = useToast();
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
  // const [animalDetail, setAnimalDetail] = useState<Animal | null>(null)

  // fecth plus de détail sur l'animal
  // useEffect(() => {
  //   const fetchAnimalData = async () => {
  //     try {
  //       const animalResponse = await axios.get(`http://localhost:3000/api/animals/${animal.id}`);
  //       setAnimalDetail(animalResponse.data);
  //     } catch (error) {
  //       showErrorToast("Erreur réseau");
  //     }
  //     // finally {
  //     //   setLoading(false);
  //     // }
  //   };

  //   fetchAnimalData();
  // }, [animal.id, showErrorToast]);
  return (
    <article className="box animal-item">
      <div className="columns is-vcentered is-mobile is-multiline">
        <div className="column columns is-vcentered is-half-mobile is-mobile is-half-tablet is-3-desktop is-multiline">
          <MiniatureAnimal animal={animal} />
          <div>
            <p className="has-text-weight-bold has-text-left">{animal.name} </p>
            <IdToSPecies speciesId={animal.species_id} />
          </div>
        </div>
        <div className="column is-half-mobile is-half-tablet is-narrow-desktop">
          <GenderIcon gender={animal.sexe} size={20} />{' '}
          {computeAge(animal.date_of_birth)}
        </div>
        <div className="column has-text-right">
          {/* edit, see, fosterer */}
          {connectedUser && connectedUser.userId === animal.creator?.id && (
            <>
              {animal &&
                animal.animalOwners &&
                animal.animalOwners.length > 0 && (
                  <Link
                    to={`/profil/${animal?.animalOwners[0]?.user?.id}`}
                    className="has-text-info button is-extra-small"
                    title={animal?.animalOwners[0]?.user?.name}
                  >
                    <Home />
                  </Link>
                )}

              <button
                className="has-text-success button is-extra-small"
                onClick={() =>
                  openModal('editAnimalProfile', null, null, animal.id)
                }
                title="éditer l'animal"
              >
                <Pencil />
              </button>
            </>
          )}

          {/* Lien pour voir le profil détaillé de l'animal */}
          <Link
            to={`/animal/${animal.id}`}
            className="button has-text-info is-extra-small"
          >
            <Eye />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default AnimalItemList;
