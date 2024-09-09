import { mailtrapClient,sender } from "./MailTrap.config.js";
import {VERIFICATION_EMAIL_TEMPLATE} from './emailTemplates.js'


    export const sendVerificationEmail= async(email,verificationToken)=>{
        const recipient=[{email}];

        try{
            const response= await  mailtrapClient.send({
                from:sender,
                to:recipient,
                subject:"verify your email",
                html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
                category:"Email Verification"
            })

            console.log(" email sent succusfully",response);
        }catch(error)
        {
            console.error(`Error sending verification `.error);
            throw new Error(`Error sending  verfiacation  email :${error}`);


        }

    };


