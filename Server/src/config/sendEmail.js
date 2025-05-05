import nodemailer from 'nodemailer'
import { EMAIL_PASS, EMAIL_USER } from '../config.js';

// Configurar el transporte de correo
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    pool: true, // 🔥 Mantener conexiones abiertas
    maxConnections: 5, // 🔥 Hasta 5 conexiones simultáneas
    maxMessages: 100,  // 🔥 Hasta 100 emails antes de cerrar la conexión
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});


const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        const response = await transporter.sendMail({
            from: '"D’RAF SERVICES" <ttestmateo@gmail.com>',
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