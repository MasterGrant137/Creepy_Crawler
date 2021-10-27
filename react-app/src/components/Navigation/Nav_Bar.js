import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { login } from '../../store/session';
import LogoutButton from '../auth/LogoutButton';
import '../Main.css';
import './Nav_Bar.css';

const NavBar = ({ style }) => {
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const demoLogin = async (e) => {
    e.preventDefault();
    await dispatch(login('jseed@aa.io', 'password'));
  }

  return (
    <nav>
      <ul>
        <li><NavLink to='/' exact={true} activeClassName='active'>Home</NavLink></li>
        {user && <li><NavLink to='/history'>History</NavLink></li>}
        {user && <li><NavLink to='/settings'>Settings</NavLink></li>}
        {user && <img src={user.media} alt='user profile media' />}
        {!user && <li><NavLink to='/login' exact={true} activeClassName='active'>Login</NavLink></li>}
        {!user && <li><NavLink to='/sign-up' exact={true} activeClassName='active'>Sign Up</NavLink></li>}
        {!user && <li onClick={demoLogin}><NavLink to='/' exact={true} activeClassName='active'>Demo Login</NavLink></li>}
        <li><LogoutButton /></li>
      </ul>
    </nav>
  );
}

export default NavBar;
