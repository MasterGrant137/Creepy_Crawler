import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { login } from '../../store/session';
import LogoutButton from '../auth/LogoutButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faHistory, faUserCog } from '@fortawesome/free-solid-svg-icons';
import '../Main.css';
import './Nav_Bar.css';

const NavBar = ({ style }) => {
  const history = useHistory()
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const navHandler = async (e, dest) => {
    const destination = dest || e.target.dataset.linkDest;
    switch (destination) {
      case '/home': history.push('/'); break;
      case '/history':  
        history.push(`${destination}`);
        window.location.reload();
        break;
      case '/':
        history.push(`${destination}`);
        await dispatch(login('jseed@aa.io', 'password'));
        window.location.reload();
        break;
      default: history.push(`${destination}`); break;
    }
  }

  return (
    <nav>
      <ul style={{ color: style.accent_2 }}>
        <FontAwesomeIcon
          icon={faHome} 
          onClick={(e) => navHandler(e, '/home')}
        >
          Home
        </FontAwesomeIcon>
        {user && 
          <FontAwesomeIcon 
            icon={faHistory}
            onClick={(e) => navHandler(e, '/history')}
          />
        }
        {user &&
          <FontAwesomeIcon
          icon={faUserCog}
          onClick={(e) => navHandler(e, '/settings')}
          />
        }
        {user && <img className='profile-media-small' src={user.profile_media} alt='user profile media' />}
        {!user && <li data-link-dest='/login' onClick={navHandler}>Log In</li>}
        {!user && <li data-link-dest='/sign-up' onClick={navHandler}>Sign Up</li>}
        {!user && <li data-link-dest='/' onClick={navHandler}>Demo Login</li>}
        {user && <LogoutButton style={style} />}
      </ul>
    </nav>
  );
}

export default NavBar;
