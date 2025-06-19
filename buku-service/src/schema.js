const { gql } = require("apollo-server");

module.exports = gql`
  type Buku {
    id: ID!
    isbn: String!
    judul: String!
    pengarang: String!
    penerbit: String!
    tahun_terbit: Int!
    jumlah: Int!
  }

  type Query {
    getAllBuku: [Buku]
    getBukuById(id: ID!): Buku
    getBukuByJudul(judul: String!): [Buku]
    getBukuTersedia: [Buku]
  }

type Mutation {
    addBuku(
        isbn: String!
        judul: String!
        pengarang: String!
        penerbit: String!
        tahun_terbit: Int!
        jumlah: Int!
    ): Buku
    updateStokBuku(id: ID!, jumlah: Int!): Buku
    deleteBuku(id: ID!): Boolean
}
`;
