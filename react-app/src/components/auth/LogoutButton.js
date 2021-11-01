import { useDispatch } from 'react-redux';
import { logout } from '../../store/session';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../Main.css';
import '../Auth.css';

const LogoutButton = ({ style }) => {
  const dispatch = useDispatch()
  const onLogout = async (e) => {
    await dispatch(logout());
  };

  return <FontAwesomeIcon
            icon={faSignOutAlt}
            onClick={onLogout} 
            style={{ color: style.accent_2 }}>
              Log Out
         </FontAwesomeIcon>;
};

export default LogoutButton;
