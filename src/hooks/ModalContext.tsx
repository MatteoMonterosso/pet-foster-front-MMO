import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from 'src/@interfaces/user';


interface ModalContextType {
  modalContent: string | null;
  setModalContent: (content: string | null) => void;
  isActive: boolean;
  openModal: (content: string, senderId?: number, receiverId?: number, id?: number, fullUser?: User | null) => void;
  closeModal: () => void;
  senderId: number | null;
  receiverId: number | null;
  animalId: number | null;
  fullUser: User | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [senderId, setSenderId] = useState<number | null>(null);
  const [receiverId, setReceiverId] = useState<number | null>(null);
  const [animalId, setAnimalId] = useState<number | null>(null);
  const [fullUser, setFullUser] = useState<User | null>(null); 

  const openModal = (content: string, senderId?: number, receiverId?: number, id?: number, fullUser?: User | null) => {
    setModalContent(content);
    if (senderId !== null) setSenderId(senderId);
    if (receiverId !== null) setReceiverId(receiverId);
    if (id !== null) setAnimalId(id);
    if (fullUser !== null) setFullUser(fullUser);
    setIsActive(true);
  };

  const closeModal = () => {
    setIsActive(false);
    setModalContent(null);
    setSenderId(null);
    setReceiverId(null);
    setAnimalId(null);
    setFullUser(null);
  };

  return (
    <ModalContext.Provider value={{ isActive, openModal, closeModal, modalContent, setModalContent, senderId, receiverId, animalId, fullUser }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal(): ModalContextType {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
