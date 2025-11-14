import transporter from "../config/email.js";
import dotenv from 'dotenv'

dotenv.config();

export const sendEmail = async(to,subject,html)=>{
    try{
        await transporter.sendMail({
            from:`Auth <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            html,
        });
        console.log("Email sent");
    }catch(err){
        console.error("Error",err);
    }
};