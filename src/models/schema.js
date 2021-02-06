import { gql } from "apollo-server";

import { PostResolver } from "./resolvers/Post.resolver";
import { UserResolver } from "./resolvers/User.resolver";

// GQL Schema
export const typeDefs = gql`
    type Query {
        getPosts: [Post!]
        getPost(postID: ID!): Post
    }
    type Mutation {
        register(registerInput: RegisterInput!): User!
        login(username: String!, password: String!): User!
        createPost(body: String!): Post!
        deletePost(postID: ID!): String!
    }
    type Post {
        id: ID!
        body: String!
        username: String!
        createdAt: String!
    }
    input RegisterInput {
        username: String!
        email: String!
        password: String!
        confirmPassword: String!
    }
    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }
`;

// GQL Resolvers

// Unite the user and post resolvers
export const resolvers = {
    Query: {
        ...PostResolver.Query
    },
    Mutation: {
        ...UserResolver.Mutation,
        ...PostResolver.Mutation
    }
}
// //