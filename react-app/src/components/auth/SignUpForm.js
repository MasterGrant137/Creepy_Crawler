import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { signUp } from '../../store/session';
import '../Main.css';
import '../Auth.css';

const SignUpForm = ({ style }) => {
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      const data = await dispatch(signUp(username, email, password));
      if (data) {
        setErrors(data);
      }
    } else {
      setErrors(['Password fields do not match.']);
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <div className='sign-up-form-container'>
      <form 
        className='sign-up-form' 
        onSubmit={onSignUp}
        style={{ border: `3px solid ${style.accent_3}` }}
      >
        <div>
          {errors.map((error, ind) => (
            <div key={ind}>{error}</div>
          ))}
        </div>
        <div>
          <label htmlFor='sign-up-username'>Username</label>
          <input
            id='sign-up-username'
            name='Username'
            type='text'
            placeholder='Username'
            onChange={updateUsername}
            value={username}
          ></input>
        </div>
        <div>
          <label htmlFor='sign-up-email'>Email</label>
          <input
            id='sign-up-email'
            name='Email'
            type='email'
            placeholder='Email'
            onChange={updateEmail}
            value={email}
          ></input>
        </div>
        <div>
          <label htmlFor='sign-up-password'>Password</label>
          <input
            id='sign-up-password'
            name='Password'
            type='password'
            placeholder='Password'
            onChange={updatePassword}
            value={password}
          ></input>
        </div>
        <div>
          <label htmlFor='sign-up-repeat-password'>Repeat Password</label>
          <input
            id='sign-up-repeat-password'
            name='Repeat Password'
            type='password'
            placeholder='Repeat Password'
            onChange={updateRepeatPassword}
            value={repeatPassword}
            required
          ></input>
        </div>
        <button style={{ color: style.font_color }} type='submit'>Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
