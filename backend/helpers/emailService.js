import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

console.log('🔐 Verificando credenciales de email:');
console.log('  EMAIL_USER:', process.env.EMAIL_USER);
console.log('  EMAIL_PASS existe:', !!process.env.EMAIL_PASS);
console.log('  EMAIL_PASS length:', process.env.EMAIL_PASS?.length);
console.log('  EMAIL_PASS (primeros 4 chars):', process.env.EMAIL_PASS?.substring(0, 4));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});export const sendConfirmationEmail = async (email, token) => {
  const API_URL = process.env.API_URL || 'http://localhost:3000';
  const link = `${API_URL}/appointments/confirmar-cita/${token}`;
  
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
    console.log(`🚀 Enviando email a ${email}...`);
    console.log(`📧 Desde: ${process.env.EMAIL_USER}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado exitosamente!`);
    console.log(`📨 Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ ERROR COMPLETO al enviar email:`, error);
    console.error(`   Código de error:`, error.code);
    console.error(`   Comando:`, error.command);
    console.error(`   Response:`, error.response);
    throw error;
  }
};
