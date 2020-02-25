import path from "path";
import { makeExecutableSchema } from "graphql-tools";
import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";

//api 폴더 밑의 모든 폴더에 속해있으며 .graphql로 끝나는 모든 파일들을 가져온다
//api 폴더 밑의 모든 폴더에 속해있으며 .js로 끝나는 모든 파일들을 가져온다
//***/src/api/ 밑에는 resolver가 아닌 js파일을 두면 안된다.***﻿
const allTypes = fileLoader(path.join(__dirname, "/api/**/*.graphql"));
const allResolvers= fileLoader(path.join(__dirname, "/api/**/*.js"));

const schema = makeExecutableSchema({
    typeDefs: mergeTypes(allTypes),
    resolvers: mergeResolvers(allResolvers)
});

export default schema;

