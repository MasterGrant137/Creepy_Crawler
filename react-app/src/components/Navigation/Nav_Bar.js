import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
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
    console.log(e.target, dest);
    const destination = dest || e.target.dataset.linkDest;
    history.push(`${destination}`);
    if (destination === '/history') window.location.reload();
    else if (destination === '/') {
      await dispatch(login('jseed@aa.io', 'password'));
      window.location.reload();
    }
  }

  return (
    <nav>
      <ul style={{ color: style.accent_2 }}>
        <li onClick={navHandler}>Home</li>
        {user && <li data-link-dest='/history' onClick={navHandler}>History</li>}
        {user && <img className='profile-media-small' src={user.profile_media} alt='user profile media' />}
        {user &&
            <FontAwesomeIcon
              icon={faUserCog}
              onClick={(e) => navHandler(e, '/settings')}
            />
        }
        {!user && <li data-link-dest='/login' onClick={navHandler}>Login</li>}
        {!user && <li data-link-dest='/sign-up' onClick={navHandler}>Sign Up</li>}
        {!user && <li data-link-dest='/' onClick={navHandler}>Demo Login</li>}
        {!user && <li><LogoutButton /></li>}
      </ul>
    </nav>
  );
}

export default NavBar;
