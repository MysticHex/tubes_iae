import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { authClient } from '../apolloClients';

// Query untuk mendapatkan semua mahasiswa
const GET_ALL_MAHASISWA = gql`
  query GetAllMahasiswa {
    getAllMahasiswa {
      id
      nim
      nama
      angkatan
      email
    }
  }
`;

export default function MahasiswaPage() {
  const { loading, error, data } = useQuery(GET_ALL_MAHASISWA, {
    client: authClient,
    fetchPolicy: 'network-only'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mt-4">
      <h2>Daftar Mahasiswa</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>NIM</th>
              <th>Nama</th>
              <th>Angkatan</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {data?.getAllMahasiswa?.map(m => (
              <tr key={m.id}>
                <td>{m.nim}</td>
                <td>{m.nama}</td>
                <td>{m.angkatan}</td>
                <td>{m.email}</td>
              </tr>
            ))}
            {(!data?.getAllMahasiswa || data.getAllMahasiswa.length === 0) && (
              <tr>
                <td colSpan="4" className="text-center">
                  Tidak ada data mahasiswa
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}