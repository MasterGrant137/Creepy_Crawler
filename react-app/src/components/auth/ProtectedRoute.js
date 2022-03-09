import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import '../Main.css';
import '../Auth.css';

const ProtectedRoute = (props) => {
  const user = useSelector((state) => state.session.user);
  let isUser;
  if (user && !user.errors) isUser = true;
  else isUser = false;

  return isUser ? props.children : <Navigate to='/auth/login' />;
};

export default ProtectedRoute;
