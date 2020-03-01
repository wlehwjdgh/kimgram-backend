import { isAuthenticated } from "../../../middlewares";
import { prisma } from "../../../../generated/prisma-client";

export default {
	Mutation: {
		toggleLike: async ( _, args, { request })=>{
			isAuthenticated(request);
			const  {postId } = args;
			const { user } = request;
			try {
				/*
				prisma db에 like라는 query가 있다.
				like query의 멤버중에 user와 post가 있는데
				인자로 받은 user와 postId로 기존 like query가 존재하는지 검사하는 루틴.
				*/
				const existingLike = await prisma.$exists.like({
					AND:[
						{
							user: {
								id: user.id
							}
						},
						{
							post: {
								id: postId
							}
						}
					]
				});
				if(existingLike){
					// TODO
				}else{
					/*
					기존에 like가 없었다면 새로운 like를 생성하는 작업.
					단, user같은 경우에는 connect/create조건이 있는데 여기서는 connect로 한다.
					*/
					const newLike = await prisma.createLike({
						user: {
							connect: {
								id: user.id
							}
						},
						post: {
							connect: {
								id: postId
							}
						}
					});
				}
				return true;
			}catch {
				return false;
			}
		}
	}
} 