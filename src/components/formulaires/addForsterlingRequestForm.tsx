import { useState, useEffect } from 'react';
import { useToast } from '../../hooks/ToastContext';
import { useModal } from '../../hooks/ModalContext';
import instanceAxios from '../../../axiosSetup/axiosSetup';

interface AddFosterlingRequestFormProps {
  senderId: number | null; // ID de l'expéditeur
  animalId: number | null; // ID de l'animal
}

function AddFosterlingRequestForm({
  senderId,
  animalId,
}: AddFosterlingRequestFormProps) {
  console.log('animalId:', animalId);
  // Récupérer le token CSRF pour la requête sécurisée
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

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

  const [formData, setFormData] = useState({
    content_request: '',
    users_id: senderId || null,
    animals_id: animalId || null,
    request_status: 'pending',
  });

  // Gestion des changements dans le champ texte
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await instanceAxios.post('/requests', formData, {
        headers: {
          'x-xsrf-token': csrfToken || '', // Inclure le token CSRF dans les headers
        },
      });
      showSuccessToast('Message envoyé avec succès!');
      closeModal(); // Fermer la modal après succès
    } catch (error) {
      console.error("Erreur lors de l'envoi du message", error);
      showErrorToast("Erreur lors de l'envoi du message.");
      console.log(formData);
    }
  };

  // Toasts de submit
  const { showSuccessToast, showErrorToast } = useToast();
  const { closeModal } = useModal();

  return (
    <form onSubmit={handleSubmit}>
      {/* <h3 className='title'>Demander à accueillir l'animal</h3> */}
      {/* <p>Demandeur : {senderId}</p>
      <p>Animal : {animalId}</p> */}
      <textarea
        name="content_request"
        id="content_request"
        value={formData.content_request}
        onChange={handleChange}
        placeholder="Tapez votre message"
        className="textarea"
      />
      {/* Champs cachés pour l'expéditeur et le destinataire */}
      <input
        type="hidden"
        value={senderId || ''}
        name="users_id"
        id="users_id"
      />
      <input
        type="hidden"
        value={animalId || ''}
        name="animals_id"
        id="animals_id"
      />
      <button type="submit" className="button is-primary is-fullwidth">
        Envoyer le message
      </button>
    </form>
  );
}

export default AddFosterlingRequestForm;
