import { gql } from "apollo-server";
export const typeDefs = gql`
    type Query {
        hello: String!
        name: String!
        age: Int
    }
`;

export const resolvers = {
    Query: {
        hello: () => 'world',
        name: () => 'Juan',
        age: () => 15,
    }
}