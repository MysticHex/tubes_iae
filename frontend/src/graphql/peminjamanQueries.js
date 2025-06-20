// src/graphql/peminjamanQueries.js
import { gql } from '@apollo/client';

export const GET_ALL_PEMINJAMAN = gql`
  query GetAllPeminjaman {
    getAllPeminjaman {
      id
      mahasiswa_id
      buku_id
      tanggal_pinjam
      tanggal_kembali
      status
    }
  }
`;

export const GET_PEMINJAMAN_BY_ID = gql`
  query GetPeminjamanById($id: ID!) {
    getPeminjamanById(id: $id) {
      id
      mahasiswa_id
      buku_id
      tanggal_pinjam
      tanggal_kembali
      status
    }
  }
`;