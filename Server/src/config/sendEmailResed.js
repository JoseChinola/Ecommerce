import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();


const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmailrResed = async ({ sendTo, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev', // Puedes cambiarlo si verificas tu dominio
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('🚨 Error enviando el correo:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('🚨 Excepción enviando el correo:', error);
        throw error;
    }
};

export default sendEmailrResed;