import { gql } from "apollo-server";

import { PostResolver } from "./resolvers/Post.resolver";
import { UserResolver } from "./resolvers/User.resolver";
import { CommentResolver } from "./resolvers/Comment.resolver";

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
        createComment(postID: ID!, body: String!): Post!
        deleteComment(postID: ID!, commentID: ID!): Post!
        likePost(postID: ID!): Post!
    }
    type Comment {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
    }
    type Like {
        id: ID!
        createdAt: String!
        username: String!
    }
    type Post {
        id: ID!
        body: String!
        username: String!
        createdAt: String!
        comments: [Comment]!
        likes: [Like]!
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
        ...PostResolver.Mutation,
        ...CommentResolver.Mutation,
    }
}
// //