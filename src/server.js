import "./env";
import { GraphQLServer } from "graphql-yoga";
import logger from "morgan";
import passport from "passport";
import schema from "./schemas";
import "./passport";    // server.js에서는 passport.js파일에서 무언가를 받아서 사용할 필요가 없기때문에 이렇게 import한다.
import { authenticateJwt } from "./passport";

//.env파일에서 포트를 읽어온다. 만약 없다면 default 4000
const PORT = process.env.PORT || 4000

// 모든 resolver에 정보를 전달하기 위해  context를 사용할 수 있다.
//context에는 함수 변수 모두 담을 수 있다.
const server = new GraphQLServer({
	schema, 
	context: ({request}) => ({request}) 
});

server.express.use(logger("dev"));
/*
서버에 전달되는 모든 요청은 passport.js/authenticateJwt()함수를 통과함.

이 함수 안에서는 passport.authenticate("jwt")함수를 실행한다.
이 함수는 우리가 미리 정의한 strategy(passport.js 마지막에서 두번째 라인)를 이용해서 
서버에 전달되는 요청 사이에서 jwt토큰을 추출한다,

토큰이 추출되면 미리 정의한 콜백함수(여기서는 passport.js의 verifyUser()함수)를 payload인자와 함께 실행한다.
payload에는 토큰에서 해석된 id(user)가 있고 verifyUser함수는 이를 이용해 db(prisma)에서 매칭되는 user를 찾는다.
이러한 과정을 거쳐 verifyUser()는 user검색의 결과(유/무/에러)를 인자로 하는 done함수가 리턴한다.

그리고 리턴된 함수는 처음의 authentucateJwt 내의 passport.authenticate("jwt")함수의 리턴값으로서 실행되며 그 함수의 정의는
passport.authenticate()함수의 세번째 인자에 정의되어있다.
*/
server.express.use(authenticateJwt);

//port는 .env파일에서 읽어옴, 두번째 파라미터는 콜백함수임.
server.start( {port: PORT}, ()=>
console.log(`Server running on port http://localhost:${PORT}`));