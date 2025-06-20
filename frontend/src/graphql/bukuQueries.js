import { gql } from '@apollo/client';

export const GET_ALL_BOOKS = gql`
  query GetAllBuku {
    getAllBuku {
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

export const GET_BOOK_BY_ID = gql`
  query GetBukuById($id: ID!) {
    getBukuById(id: $id) {
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

export const GET_BOOKS_BY_JUDUL = gql`
  query GetBukuByJudul($judul: String!) {
    getBukuByJudul(judul: $judul) {
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

export const GET_AVAILABLE_BOOKS = gql`
  query GetBukuTersedia {
    getBukuTersedia {
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