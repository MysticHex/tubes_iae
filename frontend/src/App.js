import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import authClient from './apolloClients'; // Import default client untuk Auth
import { AuthProvider, useAuth } from './components/AuthContext';
import Navigation from './components/Navigation';
import LoginPage from './components/LoginPage';
// import Dashboard from './components/Dashboard';
import BukuPage from './components/BukuPage';
import MahasiswaPage from './components/MahasiswaPage';
import PeminjamanPage from './components/PeminjamanPage';
import { createGlobalStyle } from 'styled-components';

// Add AdminRoute component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/buku" />;
  }
  
  return children;
};

const GlobalStyle = createGlobalStyle`
  :root {
    --primary-color: #1a237e;
    --secondary-color: #534bae;
    --success-color: #2e7d32;
    --warning-color: #f57f17;
    --danger-color: #c62828;
  }

  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  }

  .btn-primary {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
  }

  .btn-primary:hover {
    background-color: var(--secondary-color);
    border-color: var(--secondary-color);
  }

  .card {
    border-radius: 8px;
  }

  .card-header {
    border-top-left-radius: 8px !important;
    border-top-right-radius: 8px !important;
  }

  .table th {
    font-weight: 600;
  }
`;

function App() {
  return (
    <ApolloProvider client={authClient}>
      <AuthProvider>
        <BrowserRouter>
          <GlobalStyle />
          <Navigation />
          <div className="container mt-4">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/buku" element={<BukuPage />} />
              {/* Only admin can access mahasiswa page */}
              <Route 
                path="/mahasiswa" 
                element={
                  <AdminRoute>
                    <MahasiswaPage />
                  </AdminRoute>
                } 
              />
              <Route path="/peminjaman" element={<PeminjamanPage />} />
              <Route path="/" element={<LoginPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;