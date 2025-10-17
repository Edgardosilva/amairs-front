import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
export const sendConfirmationEmail = async (email, token) => {
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';
  const link = `${FRONTEND_URL}/confirmar-cita/${token}`;
  
  console.log(`📧 Preparando email para: ${email}`);
  console.log(`🔗 Link de confirmación: ${link}`);
  console.log(`📤 Configuración SMTP: smtp.gmail.com:587`);
  
  const mailOptions = {
    from: `"Amaris Estética" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Confirma tu cita',
    html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px; text-align: center; color: #333;">
          <div style="background: white; padding: 20px; border-radius: 8px; display: inline-block; max-width: 500px;">
            <h2 style="color: #333;">¡Gracias por agendar tu cita!</h2>
            <p style="font-size: 16px; margin-bottom: 30px;">Por favor confirma tu asistencia haciendo clic en el botón a continuación:</p>
            <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #FBBD2E; color: #000; text-decoration: none; font-weight: bold; border-radius: 5px;">Confirmar Cita</a>
            <p style="font-size: 14px; margin-top: 20px; color: #666;">Si no agendaste esta cita, puedes ignorar este mensaje.</p>
          </div>
        </div>
      `
  };

  try {
    console.log(`🚀 Enviando email...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado exitosamente!`);
    console.log(`📨 Message ID: ${info.messageId}`);
    console.log(`📬 Response: ${info.response}`);
    return info;
  } catch (error) {
    console.error(`❌ ERROR al enviar email:`, {
      code: error.code,
      command: error.command,
      response: error.response,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};
