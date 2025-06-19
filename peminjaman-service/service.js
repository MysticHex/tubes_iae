const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mysql = require('mysql2/promise');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

const dbConfig = {
    host: process.env.DB_HOST || 'peminjaman-db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'perpus_db'
};

const typeDefs = gql`
    type Mahasiswa {
        id: ID!
        nim: String!
        nama: String!
        jurusan: String!
    }

    type Buku {
        id: ID!
        judul: String!
        pengarang: String!
    }

    type Peminjaman {
        id: ID!
        mahasiswa_id: ID!
        buku_id: ID!
        tanggal_pinjam: String!
        tanggal_kembali: String
        status: String!
    }

    type PeminjamanDetail {
        id: ID!
        mahasiswa: Mahasiswa!
        buku: Buku!
        tanggal_pinjam: String!
        tanggal_kembali: String
        status: String!
    }

    type Query {
        getAllPeminjaman: [PeminjamanDetail]
        getPeminjamanByMahasiswa(mahasiswa_id: ID!): [PeminjamanDetail]
        getPeminjamanAktif: [PeminjamanDetail]
    }

    type Mutation {
        pinjamBuku(
            mahasiswa_id: ID!
            buku_id: ID!
        ): PeminjamanDetail
        
        kembalikanBuku(
            peminjaman_id: ID!
        ): PeminjamanDetail
    }
`;

const resolvers = {
    PeminjamanDetail: {
        mahasiswa: async (parent) => {
            const response = await fetch(`${process.env.MAHASISWA_SERVICE_URL || 'http://mahasiswa-service:4001'}/graphql`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `query { getMahasiswaById(id: "${parent.mahasiswa_id}") { id nim nama jurusan } }`
                })
            });
            const { data } = await response.json();
            return data.getMahasiswaById;
        },
        buku: async (parent) => {
            const response = await fetch(`${process.env.BUKU_SERVICE_URL || 'http://buku-service:4002'}/graphql`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `query { getBukuById(id: "${parent.buku_id}") { id judul pengarang } }`
                })
            });
            const { data } = await response.json();
            return data.getBukuById;
        }
    },
    
    Query: {
        getAllPeminjaman: async () => {
            const conn = await mysql.createConnection(dbConfig);
            const [rows] = await conn.query('SELECT * FROM peminjaman');
            conn.end();
            return rows;
        },
        
        getPeminjamanByMahasiswa: async (_, { mahasiswa_id }) => {
            const conn = await mysql.createConnection(dbConfig);
            const [rows] = await conn.query(
                'SELECT * FROM peminjaman WHERE mahasiswa_id = ?',
                [mahasiswa_id]
            );
            conn.end();
            return rows;
        },
        
        getPeminjamanAktif: async () => {
            const conn = await mysql.createConnection(dbConfig);
            const [rows] = await conn.query(
                "SELECT * FROM peminjaman WHERE status = 'Dipinjam'"
            );
            conn.end();
            return rows;
        }
    },
    
    Mutation: {
        pinjamBuku: async (_, { mahasiswa_id, buku_id }) => {
            const conn = await mysql.createConnection(dbConfig);
            const [result] = await conn.query(
                `INSERT INTO peminjaman 
                (mahasiswa_id, buku_id, status) 
                VALUES (?, ?, 'Dipinjam')`,
                [mahasiswa_id, buku_id]
            );
            
            const [newPeminjaman] = await conn.query('SELECT * FROM peminjaman WHERE id = ?', [result.insertId]);
            conn.end();
            return newPeminjaman[0];
        },
        
        kembalikanBuku: async (_, { peminjaman_id }) => {
            const conn = await mysql.createConnection(dbConfig);
            await conn.query(
                `UPDATE peminjaman 
                SET status = 'Dikembalikan', tanggal_kembali = NOW() 
                WHERE id = ?`,
                [peminjaman_id]
            );
            
            const [updatedPeminjaman] = await conn.query('SELECT * FROM peminjaman WHERE id = ?', [peminjaman_id]);
            conn.end();
            return updatedPeminjaman[0];
        }
    }
};

const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    introspection: true,
    playground: true
});

// Wrap the server startup in an async function
async function startServer() {
    await server.start();
    server.applyMiddleware({ app });

    const PORT = process.env.PORT || 4003;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Peminjaman Service running on port ${PORT}`);
        console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
    });
}

startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
