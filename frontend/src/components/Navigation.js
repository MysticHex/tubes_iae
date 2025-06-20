import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Navigation = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-gradient" style={{ backgroundColor: '#1a237e' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-book me-2"></i>
          <span>Perpustakaan Digital</span>
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {isAuthenticated && (
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/buku') ? 'active fw-bold' : ''}`} 
                  to="/buku"
                >
                  <i className="bi bi-book-half me-1"></i>
                  Buku
                </Link>
              </li>
              {isAdmin && (
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActive('/mahasiswa') ? 'active fw-bold' : ''}`} 
                    to="/mahasiswa"
                  >
                    <i className="bi bi-people me-1"></i>
                    Mahasiswa
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/peminjaman') ? 'active fw-bold' : ''}`} 
                  to="/peminjaman"
                >
                  <i className="bi bi-arrow-left-right me-1"></i>
                  Peminjaman
                </Link>
              </li>
            </ul>
            <button 
              className="btn btn-outline-light d-flex align-items-center"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;