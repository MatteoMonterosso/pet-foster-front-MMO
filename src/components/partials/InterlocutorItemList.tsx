import { useAuth } from '../../hooks/AuthContext';
import dayjs from 'dayjs';

interface InterlocutorLastMessage {
  interlocutorId: number;
  interlocutorName: string;
  sender_id: number;
  created_at: string | Date;
}

interface InterlocutorItemListProps {
  interlocutorLastMessage: InterlocutorLastMessage;
  setCurrentInterlocutor: (id: number) => void;
  fetchDisscussion: (connectedUserId: number, interlocutorId: number) => void;
}
const apiUrl = import.meta.env.VITE_API_URL;
function InterlocutorItemList({
  interlocutorLastMessage,
  setCurrentInterlocutor,
  fetchDisscussion,
}: InterlocutorItemListProps) {
  const { user: connectedUser } = useAuth();


  return (
    <article
      className="box py-2 mb-3"
      onClick={() => {
        fetchDisscussion(
          connectedUser?.userId as number,
          interlocutorLastMessage.interlocutorId
        );
        setCurrentInterlocutor(interlocutorLastMessage.interlocutorId);
      }}
    >
      <div className="is-vcentered is-flex is-align-items-center is-justify-content-space-between">
        <div style={{ gap: '10px' }} className="is-flex is-align-items-center">
          <div className="messagerie-user-miniature is-narrow has-text-centered">
          <img
            src={`${apiUrl}/img/utilisateurs/${interlocutorLastMessage.interlocutorId}-${interlocutorLastMessage.interlocutorName}-1.webp`}
            alt={interlocutorLastMessage.interlocutorName}
            onError={(e) => {
              const imgElement = e.target as HTMLImageElement;
              imgElement.onerror = null;
              imgElement.src = `${apiUrl}/img/utilisateurs/1-Alice Dupont-1.webp`;
            }}
            width="32"
            height="32"
          />
          </div>

          <p className="has-text-weight-bold is-size-6 has-text-left">
            {interlocutorLastMessage.interlocutorName}
          </p>
        </div>

        <p className="is-size-7 ">
          {connectedUser?.userId === interlocutorLastMessage.sender_id
            ? 'Vous'
            : interlocutorLastMessage.interlocutorName}{' '}
          - {dayjs(interlocutorLastMessage.created_at).format(' D MMM. YYYY')}
        </p>
      </div>
    </article>
  );
}

export default InterlocutorItemList;
