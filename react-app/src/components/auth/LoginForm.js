import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login } from '../../store/session';
import '../Main.css';
import '../Auth.css';

const LoginForm = ({ style }) => {
  const emailInput = useRef(null);
  const passwordInput = useRef(null);

  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginBtn, setLoginBtn] = useState(true);
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const allowable = () => {
    const emailPresent = emailInput.current?.value.length ? true : false;
    const passwordPresent = passwordInput.current?.value.length ? true : false;
    
    const validEmail = emailPresent && emailInput.current.checkValidity();
    const validPassword = passwordPresent && passwordInput.current.checkValidity();
    
    if (validEmail && validPassword) setLoginBtn(true);
    else setLoginBtn(false);
  }

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
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
        style={{ borderColor: style.accent_3 }}
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
            ref={emailInput}
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
            ref={passwordInput}
            name='Password'
            type='password'
            minLength='8'
            maxLength='255'
            placeholder='Password'
            value={password}
            onChange={updatePassword}
          />
          <button  
            type='submit' 
            className={loginBtn ? '' : 'not-allowed'}
            onMouseOver={allowable}
            style={{ color: style.font_color }}
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
