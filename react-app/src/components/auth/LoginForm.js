import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { login } from '../../store/session';
import '../Main.css';
import '../Auth.css';

const LoginForm = ({ style }) => {
    const history = useHistory();
    const emailInput = useRef(null);
    const passwordInput = useRef(null);

    const [errors, setErrors] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRequired, setPasswordRequired] = useState(false);
    const [loginBtn, setLoginBtn] = useState(true);
    const user = useSelector((state) => state.session.user);
    const dispatch = useDispatch();

    window.onbeforeunload = (e) => {
        e.returnValue = '';
        sessionStorage.setItem('refresh', 'true');
    };
    if (sessionStorage.refresh === 'true') {
        history.push('/api/auth/signup');
        sessionStorage.refresh = 'false';
    }

    let isUser;
    if (user && !user.errors) isUser = true;
    else isUser = false;

    const allowable = () => {
        setPasswordRequired(true);

        const emailPresent = !!emailInput.current?.value.length;
        const passwordPresent = !!passwordInput.current?.value.length;

        const validEmail = emailPresent && emailInput.current.checkValidity();
        const validPassword = passwordPresent && passwordInput.current.checkValidity();

        if (validEmail && validPassword) setLoginBtn(true);
        else setLoginBtn(false);
    };

    const onLogin = async (e) => {
        e.preventDefault();
        const data = await dispatch(login(email, password));
        if (data) setErrors(data);
    };

    const updateEmail = (e) => {
        setEmail(e.target.value);
    };

    const updatePassword = (e) => {
        setPassword(e.target.value);
    };

    if (isUser) return <Redirect to='/' />;

    return (
        <div className='login-form-container'>
            <form
                className='login-form'
                onSubmit={onLogin}
                style={{ borderColor: style.accent_3 }}
            >
                <div className='auth-errors-container'>
                    {errors.map((error, ind) => (
                        <p key={ind}>{error}</p>
                    ))}
                </div>
                <div>
                    <label htmlFor='login-email'>Email</label>
                    <input
                        id='login-email'
                        ref={emailInput}
                        name='Email'
                        type='email'
                        placeholder='jappleseed@email.com'
                        aria-placeholder='jappleseed@email.com'
                        value={email}
                        onChange={updateEmail}
                        required
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
                        placeholder='a1%Bp9!U'
                        aria-placeholder='a1%Bp9!U'
                        value={password}
                        onChange={updatePassword}
                        required={passwordRequired}
                    />
                    <button
                        type='submit'
                        className={loginBtn ? '' : 'not-allowed'}
                        onMouseOver={allowable}
                        style={{ color: style.font_color }}
                    >
                        <FontAwesomeIcon
                            alt='Log In'
                            title='Log In'
                            icon='sign-in-alt'
                        />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
