import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env")});

import { GraphQLServer } from "graphql-yoga";
import logger from "morgan";
import schema from "./schemas";
import { sendSecretMail } from "./utils";

//.env파일에서 포트를 읽어온다. 만약 없다면 default 4000
const PORT = process.env.PORT || 4000

const server = new GraphQLServer( {schema } );
server.express.use(logger("dev"));

//port는 .env파일에서 읽어옴, 두번째 파라미터는 콜백함수임.
server.start( {port: PORT}, ()=>
console.log(`Server running on port http://localhost:${PORT}`));