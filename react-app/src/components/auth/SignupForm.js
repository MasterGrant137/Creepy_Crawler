import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signUp } from '../../store/session';
import '../Main.css';
import '../Auth.css';

const SignupForm = ({ style }) => {
    const usernameInput = useRef(null);
    const emailInput = useRef(null);
    const passwordInput = useRef(null);
    const repeatPasswordInput = useRef(null);

    const [errors, setErrors] = useState([]);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRequired, setPasswordRequired] = useState(false);
    const [repeatPassword, setRepeatPassword] = useState('');
    const [signupBtn, setSignupBtn] = useState(false);
    const user = useSelector((state) => state.session.user);
    const dispatch = useDispatch();

    const allowable = () => {
        setPasswordRequired(true);

        const usernamePresent = !!usernameInput.current?.value.length;
        const emailPresent = !!emailInput.current?.value.length;
        const passwordPresent = !!passwordInput.current?.value.length;
        const repeatPasswordPresent = !!repeatPasswordInput.current?.value.length;

        const validUsername = usernamePresent && usernameInput.current.checkValidity();
        const validEmail = emailPresent && emailInput.current.checkValidity();
        const validPassword = passwordPresent && passwordInput.current.checkValidity();
        const validRepPass = repeatPasswordPresent && repeatPasswordInput.current.checkValidity();

        if (validUsername
            && validEmail
            && validPassword
            && validRepPass) {
            setSignupBtn(true);
        } else {
            setSignupBtn(false);
        }
    };

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
        <div className='signup-form-container'>
            <form
                className='signup-form'
                onSubmit={onSignUp}
                style={{ borderColor: style.accent_3 }}
            >
                <div className='auth-errors-container'>
                    {errors.map((error, ind) => (
                        <p key={ind}>{error}</p>
                    ))}
                </div>
                <div>
                    <label htmlFor='signup-username'>Username</label>
                    <input
                        id='signup-username'
                        ref={usernameInput}
                        name='Username'
                        type='text'
                        placeholder='Mr. Appleseed'
                        aria-placeholder='Mr. Appleseed'
                        onChange={updateUsername}
                        value={username}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='signup-email'>Email</label>
                    <input
                        id='signup-email'
                        ref={emailInput}
                        name='Email'
                        type='email'
                        placeholder='jappleseed@email.com'
                        aria-placeholder='jappleseed@email.com'
                        onChange={updateEmail}
                        value={email}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='signup-password'>Password</label>
                    <input
                        id='signup-password'
                        ref={passwordInput}
                        name='Password'
                        type='password'
                        minLength='8'
                        maxLength='255'
                        placeholder='a1%Bp9!U'
                        aria-placeholder='a1%Bp9!U'
                        onChange={updatePassword}
                        value={password}
                        required={passwordRequired}
                    />
                </div>
                <div>
                    <label htmlFor='signup-repeat-password'>Repeat Password</label>
                    <input
                        id='signup-repeat-password'
                        ref={repeatPasswordInput}
                        name='Repeat Password'
                        type='password'
                        minLength='8'
                        maxLength='255'
                        placeholder='a1%Bp9!U'
                        aria-placeholder='a1%Bp9!U'
                        onChange={updateRepeatPassword}
                        value={repeatPassword}
                        required={!!passwordInput.current?.value.length}
                    />
                </div>
                <button
                    type='submit'
                    className={signupBtn ? '' : 'not-allowed'}
                    onMouseOver={allowable}
                    style={{ color: style.font_color }}
                >
                    <FontAwesomeIcon
                        alt='Sign Up'
                        title='Sign Up'
                        icon='user-plus'
                    />
                </button>
            </form>
        </div>
    );
};

export default SignupForm;
