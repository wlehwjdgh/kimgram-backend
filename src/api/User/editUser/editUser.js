import { prisma } from "../../../../generated/prisma-client"
import { isAuthenticated } from "../../../middlewares"

export default {
  Mutation: {
    editUser: ( _, args, { request }) => {
			isAuthenticated(request);
			const { username, email, firstName, lastName, bio } = args;
			const { user } = request;

			/*
			여기서는 await을 사용하지 않는 이유
			return이 마지막 statement이기 때문에 서버가 자동으로 
			아래 promise가 resolve되어서 브라우저에게 결과를 전달해주길 기다리기 때문이다.

			기존에 했던것처럼 async, await을 사용해도 되긴된다.
			*/
			return prisma.updateUser({
				where:{id: user.id},
				data: { username, email, firstName, lastName, bio }
			});
    }
  }
};