import { useState, useEffect } from 'react';
// import axios from 'axios';
import instanceAxios from '../../../axiosSetup/axiosSetup';

import { Upload } from 'react-flaticons';

interface UploadImageFormProps {
  userId: number | null; // L'ID de l'utilisateur connecté
  fetchUserImages: () => void | null; // Fonction pour recharger les images après upload
  animalId: number | null;
  fetchAnimalData: () => void | null;
}

function UploadImageForm({
  userId,
  fetchUserImages,
  animalId,
  fetchAnimalData,
}: UploadImageFormProps) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  let uploadRoute = '';
  if (animalId) {
    uploadRoute = `/animals/${animalId}/upload-animal-picture`;
  } else {
    uploadRoute = `/profiles/${userId}/upload-profile-picture`;
  }
  // Récupérer le token CSRF
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await instanceAxios.get('/csrf-token');
        setCsrfToken(response.data.csrfToken || response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du token CSRF:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (!image || !userId || !csrfToken) {
    //   alert('Tous les champs doivent être remplis.');
    //   return;
    // }

    const formData = new FormData();
    formData.append('image', image);

    try {
      await instanceAxios.post(uploadRoute, formData, {
        headers: {
          'x-csrf-token': csrfToken,
          // 'Content-Type': 'multipart/form-data',
        },
      });
      alert('Image téléchargée avec succès');
      if (fetchUserImages) {
        fetchUserImages();
      } else {
        fetchAnimalData();
      }

      // fetcAnimalImages()// Recharger les images après l'upload
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image", error);
      alert("Erreur lors du téléchargement de l'image");
    }
  };

  return (
    <form onSubmit={handleUpload} className="picture-uploader">
      <div className="file">
        <label className="file-label">
          <input
            className="file-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            aria-label="Sélectionnez votre image"
          />
          <span className="file-cta">
            <span className="file-icon">
              <Upload />
            </span>
            <span className="file-label">Sélectionnez une image…</span>
          </span>
        </label>
      </div>
      <button type="submit" className="button is-primary is-fullwidth is-small">
        Télécharger
      </button>
    </form>
  );
}

export default UploadImageForm;
