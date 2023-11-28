import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import connectDB from './db/dbConfig';
import userSchema from './schemas/userSchema';
import userResolver from './resolvers/userResolver';

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: userSchema,
    resolvers: userResolver,
  });

  await server.start();
  server.applyMiddleware({ app });

  await connectDB();

  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}

startServer();