import { generateSecret, sendSecretMail } from "../../../utils";
import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation: {
        requestSecret: async (_, args, {request}) => {
            console.log(request);   //debugging
            const {email} = args;
            const loginSecret = generateSecret();
            //console.log(loginSecret);
            try {
                await sendSecretMail(email, loginSecret);
                await prisma.updateUser({data:{ loginSecret }, where: { email}});
                return true;
            }catch {
                return false;
            }
        }
    }
}