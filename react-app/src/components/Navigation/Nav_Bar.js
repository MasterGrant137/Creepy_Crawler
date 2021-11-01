import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { login } from '../../store/session';
import LogoutButton from '../auth/LogoutButton';
import '../Main.css';
import './Nav_Bar.css';

const NavBar = ({ style }) => {
  const history = useHistory()
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const demoLogin = async (e) => {
    e.preventDefault();
    await dispatch(login('jseed@aa.io', 'password'));
  }

  const navHandler = (e) => {
    const destination = e.target.dataset.linkDest;
    history.push(`${destination}`);
    if (destination === '/history') window.location.reload();
  }

  return (
    <nav>
      <ul>
        <li><NavLink to='/' exact={true} activeClassName='active'>Home</NavLink></li>
        {user && <li data-link-dest='/history' onClick={navHandler}>History</li>}
        {user && <li data-link-dest='/settings' onClick={navHandler}>Settings</li>}
        {user && <img className='profile-media-small' src={user.profile_media} alt='user profile media' />}
        {!user && <li data-link-dest='/login' onClick={navHandler}>Login</li>}
        {!user && <li data-link-dest='/sign-up' onClick={navHandler}>Sign Up</li>}
        {!user && <li data-link-dest='/' onClick={demoLogin}>Demo Login</li>}
        <li><LogoutButton /></li>
      </ul>
    </nav>
  );
}

export default NavBar;
