import { jwtDecode } from 'jwt-decode';

// Get token dari localStorage
export const getToken = () => localStorage.getItem('token');

// Validasi token
export const validateToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp < currentTime) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
};

// Cek apakah user sudah login
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  return validateToken(token) !== null;
};

// Ambil data user dari token
export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;
  
  return validateToken(token);
};

// Cek apakah token valid
export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;
  
  return validateToken(token) !== null;
};
