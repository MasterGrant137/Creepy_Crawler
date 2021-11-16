import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { logout } from '../../store/session';
import '../Main.css';
import '../Auth.css';

const LogoutButton = ({ style }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const onLogout = async () => {
        await dispatch(logout());
        history.push('/api/auth/login');
    };

    return <FontAwesomeIcon
        alt='Log Out'
        title='Log Out'
        icon='sign-out-alt'
        onClick={onLogout}
        style={{ color: style.accent_2 }}>
        Log Out
    </FontAwesomeIcon>;
};

export default LogoutButton;
