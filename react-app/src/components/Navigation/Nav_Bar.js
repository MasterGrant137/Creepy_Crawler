import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { login } from '../../store/session';
import LogoutButton from '../auth/LogoutButton';
import '../Main.css';
import './Nav_Bar.css';

const NavBar = ({ style }) => {
    const history = useHistory();
    const user = useSelector((state) => state.session.user);
    const dispatch = useDispatch();

    const navHandler = async (e, dest) => {
        const destination = dest || e.target.dataset.linkDest;
        switch (destination) {
        case '/home': history.push('/'); break;
        case '/history':
            history.push(destination);
            break;
        case '/':
            await dispatch(login('jseed@aa.io', 'password'));
            history.push(destination);
            break;
        default: history.push(destination); break;
        }
    };

    return (
        <nav>
            <ul style={{ color: style.accent_2 }}>
                {!user
                && <a
                    href='https://github.com/MasterGrant137/Creepy_Crawler/wiki/Spider-Lair'
                    target="_blank"
                    rel='noopener noreferrer'
                >
                    <FontAwesomeIcon
                        alt='About'
                        title='About'
                        icon='book-open'
                        style={{ color: style.accent_2 }}
                    />
                </a>
                }
                {user && user.username}
                <FontAwesomeIcon
                    alt='Home'
                    title='Home'
                    icon='home'
                    onClick={(e) => navHandler(e, '/home')}
                />
                {user
                && <FontAwesomeIcon
                    alt='History'
                    title='History'
                    icon='history'
                    onClick={(e) => navHandler(e, '/api/history/')}
                />
                }
                {user
                && <FontAwesomeIcon
                    alt='Settings'
                    title='Settings'
                    icon='cogs'
                    onClick={(e) => navHandler(e, '/api/settings/')}
                />
                }
                {user && <img className='profile-media-small' src={user.profile_media} alt='User' title='User' />}
                {!user
                && <FontAwesomeIcon
                    alt='Log In'
                    title='Log In'
                    icon='sign-in-alt'
                    data-link-dest='/api/auth/login'
                    onClick={(e) => navHandler(e, '/api/auth/login')}
                />}
                {!user
                && <FontAwesomeIcon
                    alt='Sign Up'
                    title='Sign Up'
                    icon='user-plus'
                    data-link-dest='/api/auth/signup'
                    onClick={(e) => navHandler(e, '/api/auth/signup')}
                />}
                {!user && <li data-link-dest='/' onClick={navHandler}>Demo Login</li>}
                {user && <LogoutButton style={style} />}
            </ul>
        </nav>
    );
};

export default NavBar;
