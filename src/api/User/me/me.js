import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
  	me: async(_, __, { request, isAuthenticated })=> {
			isAuthenticated(request);
			const { user } = request;
			const userProfile = await prisma.user({ id: user.id });
			const posts = await prisma.user({ id: user.id }).posts();
			return {
				user: userProfile,
				posts
			}
		}
  },
  /*
  하나의 필드 User.fullName(computed field)만을 위한 resolver
  먼저 prisma(db)에서 이 필드를 찾으려고 할거고 
  이 필드는 computed field니까 prisma(db)에 없다.
  그럼 서버에서 찾으려고 할거임
  */
  User: {
	fullName: parent => {
		return `${parent.firstName} ${parent.lastName}`;
	}
  }
}