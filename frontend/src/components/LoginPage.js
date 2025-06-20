import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LOGIN_MUTATION } from '../graphql/mutations';
import { useAuth } from './AuthContext';
import { authClient } from '../apolloClients';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';
const LoginPage = () => {
  const [formData, setFormData] = useState({
    nim: '',
    email: ''
  });
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
    client: authClient, 
    onError: (err) => {
      console.error('Login error:', err);
      setError('Login gagal: ' + err.message);
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginMutation({ 
        variables: formData
      });
      
      if (result.data?.login) {
        login({ token: result.data.login.token });
        navigate('/dashboard');
      }
    } catch (e) {
      // Error ditangani oleh onError di atas
    }
  };
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error.message} />;
  
  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white text-center">
              <h3 className="my-2">Login</h3>
            </div>
            <div className="card-body p-4">
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nim" className="form-label">NIM</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nim"
                    name="nim"
                    value={formData.nim}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Login'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;