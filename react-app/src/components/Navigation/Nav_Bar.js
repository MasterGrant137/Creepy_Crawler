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

    let isUser;
    if (user && !user.errors) isUser = true;
    else isUser = false;

    const navHandler = async (destination) => {
        switch (destination) {
        case '/user/crawler': history.push('/'); break;
        case '/stranger/crawler':
            await dispatch(login('jseed@aa.io', 'password'));
            history.push('/'); break;
        default: history.push(destination); break;
        }
    };

    return (
        <nav>
            <ul style={{ color: style.accent_2 }}>
                <a
                    href='https://github.com/MasterGrant137/Creepy_Crawler/wiki'
                    target="_blank"
                    rel='noopener noreferrer'
                >
                    <FontAwesomeIcon
                        alt='GitHub'
                        title='GitHub'
                        icon={['fab', 'github']}
                        style={{ color: style.accent_2 }}
                    />
                </a>
                <a
                    href='https://www.linkedin.com/in/alejandro-c-grant'
                    target="_blank"
                    rel='noopener noreferrer'
                >
                    <FontAwesomeIcon
                        alt='LinkedIn'
                        title='LinkedIn'
                        icon={['fab', 'linkedin']}
                        style={{ color: style.accent_2 }}
                    />
                </a>
                {isUser && user.username}
                <FontAwesomeIcon
                    alt='Crawler'
                    title='Crawler'
                    icon='spider'
                    onClick={() => navHandler('/user/crawler')}
                />
                {isUser
                && <FontAwesomeIcon
                    alt='History'
                    title='History'
                    icon='history'
                    onClick={() => navHandler('/api/search/history/')}
                />
                }
                {isUser
                && <FontAwesomeIcon
                    alt='Settings'
                    title='Settings'
                    icon='cogs'
                    onClick={() => navHandler('/api/settings/')}
                />
                }
                {isUser && <img className='profile-media-small' src={user.profile_media} alt='User' title='User' />}
                {!isUser
                && <FontAwesomeIcon
                    alt='Log In'
                    title='Log In'
                    icon='sign-in-alt'
                    data-link-dest='/api/auth/login'
                    onClick={() => navHandler('/api/auth/login')}
                />}
                {!isUser
                && <FontAwesomeIcon
                    alt='Sign Up'
                    title='Sign Up'
                    icon='user-plus'
                    data-link-dest='/api/auth/signup'
                    onClick={() => navHandler('/api/auth/signup')}
                />}
                {!isUser && <li onClick={() => navHandler('/stranger/crawler')}>Demo Login</li>}
                {isUser && <LogoutButton style={style} />}
            </ul>
        </nav>
    );
};

export default NavBar;
