// Optional, jika ingin memisahkan routing dari App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import BukuPage from './components/BukuPage';
import MahasiswaPage from './components/MahasiswaPage';
import PeminjamanPage from './components/PeminjamanPage';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/buku" element={<ProtectedRoute><BukuPage /></ProtectedRoute>} />
      <Route path="/mahasiswa" element={<ProtectedRoute role="admin"><MahasiswaPage /></ProtectedRoute>} />
      <Route path="/peminjaman" element={<ProtectedRoute><PeminjamanPage /></ProtectedRoute>} />
    </Routes>
  );
}