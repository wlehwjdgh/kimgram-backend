import { prisma } from "../../../../generated/prisma-client"

export default {
	Subscription: {
		newMessage: {
			subscribe: (_,args) => {
				const { chatId } = args;
				return prisma.$subscribe.message({
					AND:[
						{ mutation_in: "CREATED" },
						{
							node :{
								room: { id: chatId }
							}
						}
					]
				})
				.node();
			},
			//이 코드를 작성하지 않으면 동작하지 않는다 근데 정확히 어떤 의미인지 모르겠다 ㅠㅠ
			resolve: payload => payload 
		}
	}
};