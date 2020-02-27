import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env")});

import passport from "passport";
import JwtStrategy from "passport-jwt";

const jwtOptions = {
    jwtFromRequest: JwtStrategy
                    .ExtractJwt
                    .fromAuthHeaderAsBearerToken(),
    secret: process.env.JWT_SECRET, //from randomkeygen.com
};

const verifyUser = (payload, done) => {
    try{
        const user = await prisma.user({ id: payload.id });
        if(user !== null){
            return done(null, user);
        }else{
            return done(null, false);
        }
    }catch (error) {
        return done(error, false);
    }
};

passport.use(new JwtStrategy(jwtOptions, verifyUser));