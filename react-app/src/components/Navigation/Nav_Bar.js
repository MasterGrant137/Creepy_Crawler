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

  const historyNavHandler = () => {
    
    history.push('/history');
    window.location.reload();
  }

  return (
    <nav>
      <ul>
        <li><NavLink to='/' exact={true} activeClassName='active'>Home</NavLink></li>
        {user && <li data-link-name='history' onClick={historyNavHandler}>History</li>}
        {user && <li data-link-name='settings'><NavLink to='/settings'>Settings</NavLink></li>}
        {user && <img className='profile-media-small' src={user.profile_media} alt='user profile media' />}
        {!user && <li  data-link-name='login'><NavLink to='/login' exact={true} activeClassName='active'>Login</NavLink></li>}
        {!user && <li  data-link-name='settings'><NavLink to='/sign-up' exact={true} activeClassName='active'>Sign Up</NavLink></li>}
        {!user && <li onClick={demoLogin}><NavLink to='/' exact={true} activeClassName='active'>Demo Login</NavLink></li>}
        <li><LogoutButton /></li>
      </ul>
    </nav>
  );
}

export default NavBar;
