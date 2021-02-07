import { PostModel } from "../Post.model";
import { checkAuth } from "../util/checkAuth";
import { AuthenticationError, UserInputError } from "apollo-server";

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
            context.pubSub.publish('NEW_POST', { newPost: post });
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
        },
        async likePost(_, { postID }, context) {
            const { username } =  checkAuth(context);
            const post = await PostModel.findById(postID);
            if (post) {
                if (post.likes.find(like => like.username === username)) {
                    // Post already liked, unlike it
                    post.likes = post.likes.filter(like => like.username !== username)
                        await post.save();
                } else {
                    // Post not liked, like post
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save();
                return post
            } else {
                throw new UserInputError("Post not found");
            }
        }
    },
    Subscription: {
        newPost: {
            subscribe: (_, __, { req, pubSub }) => pubSub.asyncIterator('NEW_POST')
        }
    }
}