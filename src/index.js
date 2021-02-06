import { ApolloServer } from "apollo-server";
import { typeDefs, resolvers } from "./models/schema";
import { config } from "dotenv";
import mongoose from "mongoose";


const PORT = process.env.PORT || 8000;
const { parsed } = config()

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => { return {req}}
});

// Connect to MongoDB and create a GraphQL Server
mongoose.connect(parsed.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        return server.listen({ port: PORT })
            .then(res => console.log(`🚀 Server running on ${res.url}`))
            .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
// //