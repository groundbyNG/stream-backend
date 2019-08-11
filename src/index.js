import express from 'express';
import cors from 'cors';
import {ApolloServer} from 'apollo-server-express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import schema from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import isAuth from './middleware/is-auth';

const app = express();
const db = mongoose.connection;

mongoose.connect('mongodb://localhost:27017/local', {useNewUrlParser: true});
db.on('error', () => {
  console.log('FAILED to connect to mongoose')
});
db.once('open', () => {
  console.log('Connected to mongoose')
});


const server = new ApolloServer(
  {
    context: isAuth,
    typeDefs: schema,
    resolvers,
  });

server.applyMiddleware({app, path: '/graphql'});

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(isAuth);
app.listen({port: 8000}, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});
