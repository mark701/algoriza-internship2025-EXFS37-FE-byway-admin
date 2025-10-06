
import { Navigate } from 'react-router-dom';
import { isTokenExpired } from './TokenExpire';
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token'); 
  if (!token || isTokenExpired(token)) {
    return <Navigate to="/" replace />;

  }

  return children;
}
