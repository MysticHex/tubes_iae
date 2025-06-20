import React from 'react';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children, role }) {
  const auth = useAuth();
  if (!auth.token) return <div>Login required</div>;
  if (role && auth.role !== role) return <div>Access denied</div>;
  return children;
}