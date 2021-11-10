import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from '../../store/session';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../Main.css';
import '../Auth.css';

const LogoutButton = ({ style }) => {
  const history = useHistory();
  const dispatch = useDispatch()
  const onLogout = async (e) => {
    await dispatch(logout());
    history.push('/api/auth/login');
  };

  return <FontAwesomeIcon
            icon='sign-out-alt'
            onClick={onLogout} 
            style={{ color: style.accent_2 }}>
              Log Out
         </FontAwesomeIcon>;
};

export default LogoutButton;
