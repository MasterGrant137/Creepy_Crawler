import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login } from '../../store/session';
import '../Main.css';
import '../Auth.css';

const LoginForm = ({ style }) => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginBtn, setLoginBtn] = useState(true);
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const updateEmail = (e) => {
    const inputValid = e.target.checkValidity();
    setEmail(e.target.value);
    setLoginBtn(inputValid);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <div className='login-form-container'>
      <form 
        className='login-form' 
        onSubmit={onLogin}
        style={{ border: `3px solid ${style.accent_3}` }}
      >
        <div>
          {errors.map((error, ind) => (
            <div key={ind}>{error}</div>
          ))}
        </div>
        <div>
          <label htmlFor='login-email'>Email</label>
          <input
            id='login-email'
            name='Email'
            type='email'
            placeholder='Email'
            value={email}
            onChange={updateEmail}
          />
        </div>
        <div>
          <label htmlFor='login-password'>Password</label>
          <input
            id='login-password'
            name='Password'
            type='password'
            placeholder='Password'
            value={password}
            onChange={updatePassword}
          />
          <button  
            type='submit' 
            data-logger={loginBtn}
            disabled={loginBtn ? false : true}
            style={{ color: style.font_color }}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
