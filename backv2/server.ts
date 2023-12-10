import express from "express";
import { ApolloServer } from "apollo-server-express";
import connectDB from "./db/dbConfig";
import registerSchema from "./schemas/Auth/registerSchema";
import registerResolver from "./resolvers/Auth/registerResolver";
import loginResolver from "./resolvers/Auth/loginResolver";
import session from "express-session";
import MongoStore from "connect-mongo";
import loginSchema from "./schemas/Auth/loginSchema";
import cors from "cors";

async function startServer() {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
      methods: "POST", // Allow only POST requests
      allowedHeaders: ["Content-Type", "Authorization"], // Add headers as needed
    })
  );

  app.use(
    session({
      secret: "my-secret",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl:
          "mongodb+srv://development:6BEaPzIzIb2CMSom@cluster0.jhnshdi.mongodb.net/?retryWrites=true&w=majority",
        autoRemove: "native",
        touchAfter: 24 * 3600,
        ttl: 14 * 24 * 60 * 60,
        autoRemoveInterval: 10,
        crypto: {
          secret: "squirrel",
          algorithm: "aes256",
        },
      }),
      cookie: {
        secure: false,
        maxAge: 14 * 24 * 60 * 60 * 1000,
      },
    })
  );

  const server = new ApolloServer({
    typeDefs: [loginSchema, registerSchema],
    resolvers: [loginResolver, registerResolver],
    context: ({ req }) => ({ req }),
  });

  await server.start();
  server.applyMiddleware({ app, cors: false });

  await connectDB();

  app.listen({ port: 4000 }, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
  });
}

startServer();