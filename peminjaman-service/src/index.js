const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4003 }).then(({ url }) => {
  console.log(`Peminjaman Service ready at ${url}`);
});