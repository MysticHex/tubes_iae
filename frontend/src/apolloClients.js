import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Fungsi untuk membuat authentication link
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

// Client untuk layanan Auth (port 4001)
export const authClient = new ApolloClient({
  link: createAuthLink().concat(
    createHttpLink({ uri: 'http://localhost:4001/graphql' })
  ),
  cache: new InMemoryCache()
});

// Client untuk layanan Buku (port 4002)
export const bukuClient = new ApolloClient({
  link: createAuthLink().concat(
    createHttpLink({ uri: 'http://localhost:4002/graphql' })
  ),
  cache: new InMemoryCache()
});

// Client untuk layanan Peminjaman (port 4003)
export const peminjamanClient = new ApolloClient({
  link: createAuthLink().concat(
    createHttpLink({ uri: 'http://localhost:4003/graphql' })
  ),
  cache: new InMemoryCache()
});

// Export default client untuk Auth
export default authClient;