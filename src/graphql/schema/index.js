import { gql } from 'apollo-server-express';

const schema = gql`
  type Query {
    hello: String
    login(email: String!, password: String!): AuthData!
  }
  type Mutation {
    createUser(userInput: UserInput): User
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  input UserInput {
    email: String!
    password: String!
  }
  
  type User {
    _id: ID!
    email: String!
    password: String
  }
`;

export default schema;