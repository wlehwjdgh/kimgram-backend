import passport from "passport";
import {Strategy, ExtractJwt } from "passport-jwt";
import { prisma } from " ../../../generated/prisma-client"
const jwtOptions = {
  // Authorization 헤더에서 jwt를 찾는 역할을 함.
  //헤더의 값으로 Bearer TOKEN 이후에 토큰이입력된다(?) {Authorization: 'Bearer TOKEN'}
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

  //토큰을 암호화 하기 위한 문자열 .env파일에 작성되어 있다. 
  //누군가 secret문자열을 알게되면 토큰을 모두 해석할수 있게 되니 보안유지.
  secretOrKey: process.env.JWT_SECRET, //from randomkeygen.com
};


//그 후 해석이 잘되면 해석된 정보를 콜백함수(두번째 파라미터로 정의)로 전달해줌 콜백함수의 인자로는 payload, done이 있다.
const verifyUser = async (payload, done) => {
  try{
    const user = await prisma.user({ id: payload.id });
		//console.log(user);
    if(user !== null){
    //작업이 완료되었고 에러가 없으면 우리가 찾은 user를 전달하겠다.
      return done(null, user);
    }else{
      //prisma에서 요청된 user를 찾지는 못했지만 에러는 없다.
      return done(null, false);
		}
  }catch (error) {
    //에러가 났다
    return done(error, false);
  }
};

/*
미들웨어 함수로써 req, res, next를 인자로 받는다.
passport.authenticate() 펑션의 세번째 인자는 verifyUser (클라이언트로부터 들어온 요청에 포함된 토큰의 해석이 완료되면불려지는 콜백)의 리턴값(done())이다.
세번째 인자를 통해 verifyUser()에서 사용자 정보(두번째 인자)를 받아서 사용자가 존재한다면 req객체에 붙여주는것이다.
express에서는 미들웨어를 지나서 라우트가 실행됨 예를들어
토큰을 받아서 해석하고, 사용자를 찾고, 사용자가 존재한다면 req객체에 사용자를 추가한다. 그 후 graphql 함수를 실행하는 것이다.
로그인이 되어있다면 모든 graphql 요청에 사용자 정보가 추가되어서 요청되는 것이다.

passport.authenticate() 리터값은 펑션이다.
*/
export const authenticateJwt = (req, res, next) => 
  passport.authenticate("jwt", { sessions: false}, (error, user) => {
		//console.log("done()");
		//console.log(user);
		if(user) {
			req.user = user;
		}
		next();
  })(req, res, next);

//jwt는 클라이언트로부터(?) 들어온 요청에서 토큰을 찾아내고, 옵션값을 토대로 토큰을 해석한다.
//그 후 해석이 잘되면 해석된 정보를 콜백함수(두번째 파라미터로 정의)로 전달해줌 콜백함수의 인자로는 payload, done이 있다.
// done은 우리가 사용자를 찾았을때(여기서는 로그인 요청이 오니까 그 사용자가 실제 prisma에 있는지 확인 되었을때) done함수를 호출하는것임
passport.use(new Strategy(jwtOptions, verifyUser));

passport.initialize();