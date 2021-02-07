import { model, Schema } from "mongoose";

const UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String,
});

export const UserModel = model('User', UserSchema);