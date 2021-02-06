import { PostModel } from "../Post.model";
import { checkAuth } from "../util/checkAuth";
import { AuthenticationError } from "apollo-server";

export const PostResolver = {
    Query: {
        async getPosts() {
            try {
                // Get all post and sort it from latest
                const posts = await PostModel.find().sort({ createdAt: -1 });
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getPost(_, { postID }) {
            try {
                const post = await PostModel.findById(postID);
                if (post) {
                    return post;
                } else {
                    throw new Error('Post not found')
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context) {
            const user = checkAuth(context);
            const newPost = new PostModel({
                body,
                user: user.indexOf,
                username: user.username,
                createdAt: new Date().toISOString,
            });
            const post = await newPost.save();
            return post;
        },
        async deletePost(_, { postID }, context) {
            const user = checkAuth(context);
            try {
                const post = await PostModel.findById(postID);
                if (user.username === post.username) {
                    await post.delete();
                    return "Post deleted successfully";
                } else {
                    throw new AuthenticationError("Action not allowed");
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    }
}