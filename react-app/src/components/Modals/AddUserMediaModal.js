import React from 'react';
import ReactDom from 'react-dom';
import { useModal } from '../context/Modal_Context';
import '../Main.css';
import '../Modal.css';

export const AddUserMediaModal = ({ style }) => {
    const { isOpen, closeModal, modalContent } = useModal();
    if (!isOpen) return null;

    return ReactDom.createPortal (
        <>
            <div onClick={closeModal} className=''></div>
            <div className=''>{modalContent}</div>
        </>,
        document.getElementById('portal')
    )
}