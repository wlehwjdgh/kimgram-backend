import { prisma } from "../../../generated/prisma-client";

export default {
	Post: {
		isLiked: (parent, _, { request }) => {
			const { id } = parent;
			const { user } = request;

			try{
				return prisma.$exists.like({
					AND: [
						{
							user: {
								id: user.id
							}
						},
						{
							post: {
								id
						}}
					]
				});
			}catch(error){
				return false;
			}
		},
		likeCount: (parent) => 
			prisma
			.likesConnection({
				where: { post: { id:parent.id }}
			})
			.aggregate()
			.count()
	}
}