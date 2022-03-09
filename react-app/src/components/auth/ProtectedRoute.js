import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import '../Main.css';
import '../Auth.css';

const ProtectedRoute = (props) => {
  const user = useSelector((state) => state.session.user);
  const isUser = user && !user.errors;

  return isUser ? props.children : <Navigate to='/auth/login' />;
};

export default ProtectedRoute;
