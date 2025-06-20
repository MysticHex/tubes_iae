import { gql } from '@apollo/client';

export const CREATE_PEMINJAMAN = gql`
  mutation AddPeminjaman(
    $mahasiswa_id: ID!
    $buku_id: ID!
    $tanggal_pinjam: String!
    $status: String!
  ) {
    addPeminjaman(
      mahasiswa_id: $mahasiswa_id
      buku_id: $buku_id
      tanggal_pinjam: $tanggal_pinjam
      status: $status
    ) {
      id
      mahasiswa_id
      buku_id
      tanggal_pinjam
      status
    }
  }
`;

export const UPDATE_PEMINJAMAN_STATUS = gql`
  mutation UpdatePeminjaman($id: ID!, $status: String, $tanggal_kembali: String) {
    updatePeminjaman(
      id: $id
      status: $status
      tanggal_kembali: $tanggal_kembali
    ) {
      id
      mahasiswa_id
      buku_id
      tanggal_pinjam
      tanggal_kembali
      status
    }
  }
`;

export const DELETE_PEMINJAMAN = gql`
  mutation DeletePeminjaman($id: ID!) {
    deletePeminjaman(id: $id)
  }
`;