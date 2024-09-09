import {MailtrapClient} from 'mailtrap';
import dotenv from 'dotenv';

dotenv.config();



export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAPTOKEN,
});

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "yashod",
};


