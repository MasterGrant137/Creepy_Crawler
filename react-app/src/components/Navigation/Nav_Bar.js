
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LogoutButton from '../auth/LogoutButton';
import '../Main.css';
import './Nav_Bar.css';

const NavBar = ({ style }) => {
  const user = useSelector(state => state.session.user);

  return (
    <nav>
      <ul>
        <li><NavLink to='/' exact={true} activeClassName='active'>Home</NavLink></li>
        {user && <li><NavLink to='/history'>History</NavLink></li>}
        {user && <li><NavLink to='/settings'>Settings</NavLink></li>}
        {!user && <li><NavLink to='/login' exact={true} activeClassName='active'>Login</NavLink></li>}
        {!user && <li><NavLink to='/sign-up' exact={true} activeClassName='active'>Sign Up</NavLink></li>}
        <li><LogoutButton /></li>
      </ul>
    </nav>
  );
}

export default NavBar;
