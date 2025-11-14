import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.SMTP_EMAIL,
        pass:process.env.SMTP_PASS,
    },
});

export default transporter;