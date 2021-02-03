import { UserModel } from "../User.model";
import { UserInputError } from "apollo-server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

import { validateRegisterInput, validateLoginInput } from "../util/validate";

const { parsed } = config();
function createJWT(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    parsed.SECRET_KEY,
    { expiresIn: "1h" }
  )
};

export const UserResolver = {
    Mutation: {
        async register(_, { registerInput: { username, email, password, confirmPassword } }) {
          // Check if the data sent is valid
          const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
          if (!valid) {
            throw new UserInputError('Errors', { errors });
          }
          // //
          
          // Check if a user already exist
          const user = await UserModel.findOne({ username });
          if (user) {
            throw new UserInputError(
              "A user with this username already exists",
              {
                error: {
                  username: "This username is taken",
                },
              }
            );
          }
          // //

          // Create new User if user didn't exist
        
          password = await bcrypt.hash(password, 12);
          const newUser = new UserModel({
            email,
            password,
            username,
            createdAt: new Date().toISOString(),
          });
          const res = await newUser.save();
          const token = createJWT(res);
        
          // //
          return {
            ...res._doc,
            id: res._id,
            token,
          };
        },
      async login(_, { username, password }) {
        const { errors, valid } = validateLoginInput(username, password);
        const user = await UserModel.findOne({ username });

        if (!valid) {
          throw new UserInputError('Errors', { errors });
        }

        if (!user) {
          errors.general = "User not found";
          throw new UserInputError("User not found", { errors });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          errors.general = "Wrong Credential";
          throw new UserInputError("Wrong Credential", { errors });
        }

        const token = createJWT(user);
        return {
          ...user._doc,
          id: user._id,
          token
        }
      }
    }
}