import ReactDom from 'react-dom';
import { useModal } from '../context/Modal_Context';
import '../Main.css';
import '../Modal.css';

const Modal = () => {
    const { isOpen, closeModal, modalContent } = useModal();
    if (!isOpen) return null;

    return ReactDom.createPortal(
        <>
            <div onClick={closeModal} className=''></div>
            <div className=''>{modalContent}</div>
        </>,
        document.getElementById('portal'),
    );
};

export default Modal;
