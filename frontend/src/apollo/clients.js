// src/apollo/clients.js
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Fungsi untuk membuat auth link (sama untuk semua service)
const createAuthLink = () => {
  return setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    };
  });
};

// Client untuk Mahasiswa Service (auth)
export const mahasiswaClient = new ApolloClient({
  link: createAuthLink().concat(
    createHttpLink({ uri: 'http://localhost:4001/graphql' })
  ),
  cache: new InMemoryCache()
});

// Client untuk Buku Service
export const bukuClient = new ApolloClient({
  link: createAuthLink().concat(
    createHttpLink({ uri: 'http://localhost:4002/graphql' })
  ),
  cache: new InMemoryCache()
});

// Client untuk Peminjaman Service
export const peminjamanClient = new ApolloClient({
  link: createAuthLink().concat(
    createHttpLink({ uri: 'http://localhost:4003/graphql' })
  ),
  cache: new InMemoryCache()
});

// Default client (untuk convenience)
export default mahasiswaClient;