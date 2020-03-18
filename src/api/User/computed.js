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
    posts: ({ id }) => prisma.user({ id }).posts(),
    following: ({ id }) => prisma.user({ id }).following(),
    followers: ({ id }) => prisma.user({ id }).followers(),
    likes: ({ id }) => prisma.user({ id }).likes(),
    comments: ({ id }) => prisma.user({ id }).comments(),
    rooms: ({ id }) => prisma.user({ id }).rooms(),
    postsCount: ({ id }) =>
      prisma
        .postsConnection({ where: { user: { id } } })
        .aggregate()
        .count(),
    followingCount: ({ id }) =>
      prisma
        .usersConnection({ where: { followers_some: { id } } })
        .aggregate()
        .count(),
    followersCount: ({ id }) =>
      prisma
        .usersConnection({ where: { following_none: { id } } })
        .aggregate()
        .count(),
    fullName: parent => `${parent.firstName} ${parent.lastName}`,
    isFollowing: async (parent, _, { request }) => {
      const { user } = request;
      const { id: parentId } = parent;
      try {
        return prisma.$exists.user({
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
      } catch {
        return false;
      }
    },
    isSelf: (parent, _, { request }) => {
      const { user } = request;
      const { id: parentId } = parent;
      return user.id === parentId;
    }
  }
};