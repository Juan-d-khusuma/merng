import { PostModel } from "../../models/Post.model";
import { checkAuth } from "../util/checkAuth";
import { UserInputError, AuthenticationError } from "apollo-server";

export const CommentResolver = {
    Mutation: {
        async createComment(_, { postID, body }, context) {
            const { username } = checkAuth(context);
            if (body.trim() === '') {
                throw new UserInputError("Comment can't be empty", {
                    errors: {
                        body: "Comment must not be empty"
                    }
                });
            } 
            const post = await PostModel.findById(postID);
            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                });
                await post.save();
                return post;
            } else {
                throw new UserInputError("Post not found");
            }
        },
        async deleteComment(_, { postID, commentID }, context) {
            const { username } = checkAuth(context);
            const post = await PostModel.findById(postID);
            if (post) {
                const commentIndex = post.comments.findIndex(c => c.id === commentID);
                if (post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError("Action not allowed");
                }
            } else {
                throw new UserInputError('Post not found');
            }
        }
    }
}