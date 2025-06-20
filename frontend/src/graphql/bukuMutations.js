import { gql } from '@apollo/client';

export const CREATE_BOOK = gql`
  mutation AddBuku(
    $isbn: String!
    $judul: String!
    $pengarang: String!
    $penerbit: String!
    $tahun_terbit: Int!
    $jumlah: Int!
  ) {
    addBuku(
      isbn: $isbn
      judul: $judul
      pengarang: $pengarang
      penerbit: $penerbit
      tahun_terbit: $tahun_terbit
      jumlah: $jumlah
    ) {
      id
      isbn
      judul
      pengarang
      penerbit
      tahun_terbit
      jumlah
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateStokBuku($id: ID!, $jumlah: Int!) {
    updateStokBuku(id: $id, jumlah: $jumlah) {
      id
      isbn
      judul
      pengarang
      penerbit
      tahun_terbit
      jumlah
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBuku($id: ID!) {
    deleteBuku(id: $id)
  }
`;