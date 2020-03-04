import { prisma } from "../../../generated/prisma-client";

export default {
	Mutation: {
		sendMessage: async(_,args, { request, isAuthenticated }) => {
			isAuthenticated(request);
			const { user } = request;
			const { roomId, message, toId } = args;
			let room;

			if(roomId === undefined){
				if(toId !== user.id){
					const room = await prisma.createRoom({
						participants:{
							connect:[{id:toId},{id:user.id}]
						}
					});
				}else{
					room = await prisma.room({id: roomId});
				}
				if(!room){
					throw Error("Room not found");
				}

				//not complete yet
				return null;
			}
		}
	}
}