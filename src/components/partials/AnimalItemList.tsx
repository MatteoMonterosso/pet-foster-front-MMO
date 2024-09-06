import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Columns, Image, Button } from 'react-bulma-components';
import { Pencil, Eye } from 'react-flaticons';
import { useModal } from '../../hooks/ModalContext';
import computeAge from '../../utils/computeAge'

// Interface for the creator object
interface Creator {
  id: number;
  type_user: string;
  name: string;
  email: string;
  password: string;
  country: string;
  zip: number;
  city: string;
  longitude: string;
  latitude: string;
  phone: string;
  address: string;
  website?: string;
  created_at: string;
  updated_at: any;
}

// Interface for the animal object
interface Animal {
  id: number;
  name: string;
  date_of_birth: string;
  sexe: string;
  race: string;
  short_story: string;
  long_story: string;
  health: string;
  species_id: number;
  creator_id: number;
  created_at: string;
  updated_at: any;
  creator: Creator;
}

// Interface for the props passed to the component
interface AnimalListItemProps {
  animal: Animal;
}

function AnimalItemList({ animal }: AnimalListItemProps) {
  const { openModal } = useModal();

  return (
    <Box>
      <Columns className="is-vcentered">
        {/* Image container */}
        <Columns.Column narrow textAlign="centered" className="animal-miniature">
          <Image
            size={64}
            src={`/img/animaux/${animal?.id}-${animal?.name}-1.webp`} 
            alt="Animal"
            
          />
        </Columns.Column>

        {/* Text container */}
        <Columns.Column>
          <p className="has-text-weight-bold has-text-left">{animal?.name} </p>
          <Columns>
            <Columns.Column>Espèce: {animal?.species_id}</Columns.Column>
            <Columns.Column>Age: {computeAge(animal?.date_of_birth)}</Columns.Column>
            <Columns.Column>Sexe: {animal?.sexe}</Columns.Column>
          </Columns>
        </Columns.Column>

        {/* Button container */}
        <Columns.Column narrow textAlign="centered">
        <Link to={`/animal/${animal?.id}`}>
            <Eye />
          </Link>
          <Button
            color="primary"
            className="is-ghost is-primary"
            onClick={() => openModal('editAnimalProfile')}
          >
            <Pencil />
          </Button>
        </Columns.Column>
      </Columns>
    </Box>
  );
}

export default AnimalItemList;
