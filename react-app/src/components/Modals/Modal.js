import ReactDom from 'react-dom';
import { useModal } from '../context/Modal_Context';
import '../Main.css';
import '../Modal.css';

const Modal = () => {
    const { isOpen, closeModal, modalContent } = useModal();
    if (!isOpen) return null;

    return ReactDom.createPortal(
        <>
            <div onClick={closeModal} className='modal-overlay'></div>
            <div className='modal-styles'>{modalContent}</div>
        </>,
        document.getElementById('portal'),
    );
};

export default Modal;
