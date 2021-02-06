import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { AuthenticationError } from "apollo-server";

const { parsed } = config();

export const checkAuth = (context) => {
    const authHeader = context.req?.headers.authorization || '';
    if (authHeader) {
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try {
                console.log(parsed.SECRET_KEY);
                const user = jwt.verify(token, parsed.SECRET_KEY);
                return user
            } catch (err) {
                throw new AuthenticationError('Invalid/Expired Token');
            }
        }
        throw new Error('Authentication token must be \'Bearer [token]\'')
    }
    throw new Error('Auth Header must be provided');
}