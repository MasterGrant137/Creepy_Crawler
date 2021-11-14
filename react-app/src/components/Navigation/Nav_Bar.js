import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { login } from '../../store/session';
import LogoutButton from '../auth/LogoutButton';
import '../Main.css';
import './Nav_Bar.css';

const NavBar = ({ style }) => {
    const history = useHistory();
    const user = useSelector((state) => state.session.user);
    const dispatch = useDispatch();

    const navHandler = async (e, dest) => {
        const destination = dest || e.target.dataset.linkDest;
        switch (destination) {
        case '/home': history.push('/'); break;
        case '/history':
            history.push(destination);
            break;
        case '/':
            await dispatch(login('jseed@aa.io', 'password'));
            history.push(destination);
            break;
        default: history.push(destination); break;
        }
    };

    return (
        <nav>
            <ul style={{ color: style.accent_2 }}>
                <a
                    href='https://github.com/MasterGrant137/Creepy_Crawler/wiki'
                    target="_blank"
                    rel='noopener noreferrer'
                >
                    About
                </a>
                {user && user.username}
                <FontAwesomeIcon
                    icon='home'
                    onClick={(e) => navHandler(e, '/home')}
                >
                    Home
                </FontAwesomeIcon>
                {user
          && <FontAwesomeIcon
              icon='history'
              onClick={(e) => navHandler(e, '/api/history/')}
          />
                }
                {user
          && <FontAwesomeIcon
              icon='user-cog'
              onClick={(e) => navHandler(e, '/api/settings/')}
          />
                }
                {user && <img className='profile-media-small' src={user.profile_media} alt='user profile media' />}
                {!user && <li data-link-dest='/api/auth/login' onClick={navHandler}>Login</li>}
                {!user && <li data-link-dest='/api/auth/signup' onClick={navHandler}>Signup</li>}
                {!user && <li data-link-dest='/' onClick={navHandler}>Demo Login</li>}
                {user && <LogoutButton style={style} />}
            </ul>
        </nav>
    );
};

export default NavBar;
