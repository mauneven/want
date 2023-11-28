import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import connectDB from './db/dbConfig';
import registerSchema from './schemas/Auth/registerSchema';
import registerResolver from './resolvers/Auth/registerResolver';

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: registerSchema,
    resolvers: registerResolver,
  });

  await server.start();
  server.applyMiddleware({ app });

  await connectDB();

  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}

startServer();