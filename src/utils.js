import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env")});

import { adjectives, nouns } from "./words";
import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
import jwt from "jsonwebtoken";

export const generateSecret = () => {
    const randomNumber = Math.floor(Math.random()*adjectives.length);
    return `${adjectives[randomNumber]} ${nouns[randomNumber]}`
};

//파라미터 email을 email 주소 뿐만 아니라 필요한 모든것이 담긴 변수이다. 
const sendMail = email => {
    const options = {
        auth: {
            api_user: process.env.SENDGRID_USERNAME,
            api_key: process.env.SENDGRID_PASSWORD
        }
    };
    const client = nodemailer.createTransport(sgTransport(options));
    return client.sendMail(email);

};

export const sendSecretMail = (adress, secret) => {
    const email = {
        from: "kimstagram_admin@kimstagram.com",
        to: adress,
        subject: "Login Sercret for Kimstagram",
        html: `Hello! your login secret is <strong>${secret}</strong>.<br>
                Copy&paste on the web/App to login`
    }
    return sendMail(email);
};

//jsonwebtoken jwt를 생성하는 작업을 하는중이다.
export const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET )