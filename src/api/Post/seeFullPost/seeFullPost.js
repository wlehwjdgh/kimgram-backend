import { prisma } from "../../../../generated/prisma-client"

export default {
	Query: {
		seeFullPost: async(_, args) => {
			const { id } = args;

			//fragment를 최대로 이용 vs prisma를 여러번 call 할래 너의 선택
			// 성능적 차이는 어떻게 되
			return await prisma.post({ id });
			/*
			const post = await prisma.post({ id })
			const comments = await prisma.
				post({ id })
				.comments()
				.$fragment(COMMENT_FRAGMENT);
			const files = await prisma.post({id}).files();
			const user = await prisma.post({id}).user();
			return {
				post,
				files,
				comments,
				user
			}
			*/
		}
	}
}