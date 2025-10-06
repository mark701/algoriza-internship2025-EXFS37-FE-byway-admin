import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {
  const token = localStorage.getItem('token'); 
  
  if (token ) {
    debugger
    return <Navigate to="/dashboard"  />; 
  }
  return children;
}
