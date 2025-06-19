const { gql } = require('apollo-server');

module.exports = gql`
  type Mahasiswa {
    id: ID!
    nim: String!
    nama: String!
    jurusan: String!
    angkatan: Int!
    email: String!
  }

  type Query {
    getAllMahasiswa: [Mahasiswa]
    getMahasiswaById(id: ID!): Mahasiswa
    getMahasiswaByNim(nim: String!): Mahasiswa
  }

  type Mutation {
    addMahasiswa(
      nim: String!
      nama: String!
      jurusan: String!
      angkatan: Int!
      email: String!
    ): Mahasiswa
    updateMahasiswa(
      id: ID!
      nama: String
      jurusan: String
      angkatan: Int
      email: String
    ): Mahasiswa
    deleteMahasiswa(id: ID!): Boolean
  }
`;