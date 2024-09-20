import InterlocutorItemList from './InterlocutorItemList';
import Message from '../partials/Message';
import ContactUserMessagerieForm from '../formulaires/ContactUserMessagerieForm';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/AuthContext';
import instanceAxios from '../../../axiosSetup/axiosSetup';

interface MessageType {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: Date;
  is_read: boolean;
  updated_at: Date;
}

function Messagerie() {
  const { user: connectedUser } = useAuth();
  const [interlocutorsLastMessage, setInterlocutorsLastMessage] =
    useState<any>(null); // TODO Typage

  const [currentInterlocutor, setCurrentInterlocutor] = useState<number | null>(
    null
  ); // TODO Typage

  const [currentChat, setCurrentChat] = useState<MessageType[] | null>(null); // TODO Typage

  // Récupération des interlocuteurs et de leurs derniers messages
  useEffect(() => {
    if (connectedUser) {
      async function fetchInterlocutors() {
        try {
          const response = await instanceAxios.get(
            `/connectedUser/${connectedUser?.userId}/messages`
          );

          if (response.status === 200) {
            setInterlocutorsLastMessage(response.data);
          }
        } catch (error) {
          console.log('Error catched : Interlocuteurs introuvables');
        }
      }

      fetchInterlocutors();
    }
  }, [connectedUser]);

  // Récupération des discussions avec un interlocuteur spécifique
  async function fetchDisscussion(
    connectedUserId: number,
    interlocutorId: number
  ) {
    try {
      const response = await instanceAxios.get(
        `/connectedUser/${connectedUserId}/messages/interlocutor/${interlocutorId}`
      );

      if (response.status === 200) {
        setCurrentChat(response.data);
      } else {
        console.log('Discussion introuvable');
      }
    } catch (error) {
      console.log('Error catched : Discussion introuvable');
    }
  }

  // const scrollable = useRef(null);
  // useEffect(() => {
  //   if (scrollable.current) {
  //     scrollable.current.scrollTop = scrollable.current.scrollHeight;
  //   }
  // }, []);

  return (
    <section className="section yellow-line">
      <h2 className="title">Vos messages</h2>
      <div className="columns container">
        {/* Colonne des interlocuteurs */}
        <div className="column is-one-third messenger-item-list">
          {console.log(interlocutorsLastMessage)}
          {interlocutorsLastMessage && interlocutorsLastMessage.length > 0 ? (
            interlocutorsLastMessage.map((item) => (
              <InterlocutorItemList
                interlocutorLastMessage={item}
                key={item.id}
                setCurrentInterlocutor={setCurrentInterlocutor}
                fetchDisscussion={fetchDisscussion}
              />
            ))
          ) : (
            <div></div>
          )}
        </div>

        {/* Fenêtre de discussion */}
        <div className="column">
          <div className="chat-window box is-flex is-flex-direction-column-reverse">
            {interlocutorsLastMessage &&
            interlocutorsLastMessage.length === 0 ? (
              <p>Vous n'avez pas de message</p>
            ) : currentChat ? (
              currentChat.map((item) => (
                <Message message={item} key={item.id} />
              ))
            ) : (
              <p>Sélectionnez une discussion</p>
            )}
          </div>

          {/* Formulaire d'envoi de message */}
          {currentInterlocutor && (
            <div className="box">
              <ContactUserMessagerieForm
                senderId={connectedUser?.userId}
                receiverId={currentInterlocutor}
                fetchDisscussion={fetchDisscussion}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Messagerie;
