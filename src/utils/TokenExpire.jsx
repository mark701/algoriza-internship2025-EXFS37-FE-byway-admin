
import { useNavigate } from 'react-router-dom';

export const isTokenExpired = (token) => {
  const navigate = useNavigate();
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;

    if (payload.exp < currentTime) {
      alert("Your session has expired. Please login again.");
      localStorage.removeItem('token');
      navigate('/');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};
