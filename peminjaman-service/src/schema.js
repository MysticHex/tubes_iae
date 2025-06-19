const { gql } = require('apollo-server');

module.exports = gql`
  type Peminjaman {
    id: ID!
    mahasiswa_id: ID!
    buku_id: ID!
    tanggal_pinjam: String!
    tanggal_kembali: String
    status: String!
  }

  type Query {
    getAllPeminjaman: [Peminjaman]
    getPeminjamanById(id: ID!): Peminjaman
  }

  type Mutation {
    addPeminjaman(
      mahasiswa_id: ID!
      buku_id: ID!
      tanggal_pinjam: String!
      status: String!
    ): Peminjaman
    updatePeminjaman(
      id: ID!
      tanggal_kembali: String
      status: String
    ): Peminjaman
    deletePeminjaman(id: ID!): Boolean
  }
`;