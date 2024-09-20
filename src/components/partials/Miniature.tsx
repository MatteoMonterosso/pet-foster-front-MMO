import { useState, useEffect } from 'react';
import { Animal } from 'src/@interfaces/animal';
import instanceAxios from '../../../axiosSetup/axiosSetup';

interface IMiniatureAnimlProps {
  animal: Animal | null;
}

interface Picture {
  URL_picture: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

export default function MiniatureAnimal({ animal }: IMiniatureAnimlProps) {
  const [pictures, setPictures] = useState<Picture[] | null>(null);

  // Fetch animal pictures
  useEffect(() => {
    const fetchAnimalData = async () => {
      if (!animal?.id) return;
      try {
        const animalResponse = await instanceAxios.get(`/animals/${animal.id}`);
        setPictures(animalResponse.data.pictures);
      } catch (error: any) {
        console.error(
          "Erreur lors de la récupération des données de l'animal:",
          error
        );
      }
    };

    fetchAnimalData();
  }, [animal?.id]);

  const placeholderImage = '/img/defaults/omnipet-the-mini-destructor.webp';

  return (
    <div className="animal-miniature has-text-centered">
      {pictures && pictures.length > 0 ? (
        <img
          src={`${apiUrl}/img/animaux/img-120/${pictures[0].URL_picture}`}
          alt={animal?.name}
          width="64"
          height="64"
          loading="lazy"
          onError={(e) => {

            (e.target as HTMLImageElement).src = placeholderImage;
          }}
        />
      ) : (
        <img
          src={placeholderImage}
          alt={`Image de ${animal?.name} manquante`}
        />
      )}
    </div>
  );
}
