import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { login } from '../../store/session';
import LogoutButton from '../auth/LogoutButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog } from '@fortawesome/free-solid-svg-icons';
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
        <li data-link-dest='/home' onClick={navHandler}>Home</li>
        {user && <li data-link-dest='/history' onClick={navHandler}>History</li>}
        {user &&
            <FontAwesomeIcon
            icon={faUserCog}
            onClick={(e) => navHandler(e, '/settings')}
            />
          }
        {user && <img className='profile-media-small' src={user.profile_media} alt='user profile media' />}
        {!user && <li data-link-dest='/login' onClick={navHandler}>Login</li>}
        {!user && <li data-link-dest='/sign-up' onClick={navHandler}>Sign Up</li>}
        {!user && <li data-link-dest='/' onClick={navHandler}>Demo Login</li>}
        {!user && <li><LogoutButton /></li>}
      </ul>
    </nav>
  );
}

export default NavBar;
