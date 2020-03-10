import { prisma } from "../../../../generated/prisma-client";


export default {
    Mutation: {
        createAccount: async (_, args) => {
            const { username, email, firstName = "", lastName = "", bio = "" } = args;
            try{
                await prisma.createUser({
                    username,
                    email,
                    firstName,
                    lastName,
                    bio
                 });
                 return true;
            }catch{
                return false;
            }
        }
    }
};