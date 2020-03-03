import { prisma } from "../../../generated/prisma-client";

export default {
/*
  먼저 prisma(db)에서 이 필드를 찾으려고 할거고 
  이 필드는 computed field니까 prisma(db)에 없다.
  그럼 서버에서 찾으려고 할거임
  우리가 schema.js파일에서 모든 typeDefs와 resolvers를 통합했기 때문에
  모든 query, mutation에서 동작 가능
*/
  User: {
		fullName: parent => {
			return `${parent.firstName} ${parent.lastName}`;
    },
    isFollowing: (parent, _, { request }) => {
      const { user } = request;
      // parent에서 id를 빼내어 parentId변수에 넣는 문법
      const { id:parentId } = parent;

      /*
      지금 보고있는 프로필의 유저가 나를 팔로우하는지 확인하는 코드
      */
      try{
        return  prisma.$exists.user({
          AND: [
            { 
              id: user.id
            },
            { 
              following_some: { 
                id: parentId
              }
            }
          ]
        });
      }catch(error){
        return false;
      }
    },
    isSelf:(parent, _, { request }) =>{
      const { user } = request;
      const {id: parentId } = parent;
      return user.id === parentId;
    }
	},
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
			
		}
	}
}