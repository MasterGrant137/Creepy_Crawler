import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import '../Main.css';
import '../Auth.css';

const ProtectedRoute = (props) => {
    const user = useSelector((state) => state.session.user);
    let isUser;
    if (user && !user.errors) isUser = true;
    else isUser = false;

    return (
        <Route {...props}>
            {(isUser) ? props.children : <Redirect to='/auth/login' />}
        </Route>
    );
};

export default ProtectedRoute;
