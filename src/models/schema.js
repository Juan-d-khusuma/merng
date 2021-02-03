import { gql } from "apollo-server";

import { PostModel } from "./Post.model";
import { UserModel } from "./User.model";

export const typeDefs = gql`
    type Query {
        getPosts: [Post!]!
    }
    type Post {
        id: ID!
        body: String!
        username: String!
        createdAt: String!
    }
`;

export const resolvers = {
    Query: {
        getPosts: async () => {
            try {
                const posts = await PostModel.find();
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        }
    }
}