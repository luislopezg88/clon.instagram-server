const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {ApolloServer} = require ("apollo-server");
const typeDefs = require("./gql/schema");
const resolvers = require("./gql/resolver");
require("dotenv").config({ path: ".env"});

mongoose.connect(
    process.env.BBDD, 
    {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true
    },
 (err, _) => {
    if(err) {
        console.log("error de conexion");
    } else {
        server();
    }
})

function server() {

    const serverApollo = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({req}) => {
            const token = req.headers.authorization;
            if(token){

                try {
                    const user = jwt.verify(
                        token.replace("Bearer ", ""),
                        process.env.SECRET_KEY
                    );
                    return {
                        user,
                    };

                } catch (error) {
                    console.log("### Error ###");
                    console.log(error);
                    throw new Error(" Token Invalido ");
                }

            }
        },
    });

    serverApollo.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {

        console.log("#####################");
        
        console.log(`servidor listo en la url ${url}`);

        console.log("#####################");
    });
}