import { createContext, useContext, useState } from 'react';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const toggleModal = () => {
        setIsOpen(true);
        const body = document.querySelector('body');
        body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsOpen(false);
        const body = document.querySelector('body');
        body.style.overflow = 'auto';
    };

    return (
        <ModalContext.Provider
            value={{
                isOpen,
                setIsOpen,
                toggleModal,
                closeModal,
                modalContent,
                setModalContent,
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);
