import nodemailer from 'nodemailer'
import { EMAIL_USER } from '../config.js';

// Configurar el transporte de correo
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: EMAIL_USER,
        pass: "xnti osob kciz kccy",
    },
    tls: {
        rejectUnauthorized: false,
    },
});


const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        const response = await transporter.sendMail({
            from: '"ShopMix" <ttestmateo@gmail.com>',
            to: sendTo,
            subject: subject,
            html: html,
        });
        return response;
    } catch (error) {
        console.error("🚨 Error enviando el correo:", error);
        throw error;
    }
}


export default sendEmail;