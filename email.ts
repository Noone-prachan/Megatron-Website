// @ts-ignore
import nodemailer from 'nodemailer';

interface OrderDetails {
    orderId: string;
    userEmail: string; // You'll need to get the user's email from Discord OAuth
    username: string;
    productTitle: string;
}

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendOrderConfirmationEmail(orderDetails: OrderDetails) {
    const { userEmail, username, productTitle, orderId } = orderDetails;

    if (!userEmail) {
        console.warn(`No email address for user ${username} on order ${orderId}. Skipping email.`);
        return;
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('❌ SMTP environment variables are not set. Cannot send email.');
        return;
    }

    const mailOptions = {
        from: `"Megatron Market" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
        to: userEmail,
        subject: `✅ Your Megatron Market Order is Complete! (#${orderId})`,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Megatron Market Order is Complete!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #121212; font-family: Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #1e1e1e; border-radius: 8px; color: #ffffff; border: 1px solid #333;">
          <!-- Banner Image -->
          <tr>
            <td align="center">
              <!-- IMPORTANT: Replace this placeholder with the public URL of your hosted banner image -->
              <img src="https://your-website.com/images/megatronbanner.png" alt="Megatron Market Banner" width="600" style="display: block; border-top-left-radius: 8px; border-top-right-radius: 8px;">
            </td>
          </tr>
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <!-- Header -->
                <tr>
                  <td style="color: #ffffff; font-size: 24px; font-weight: bold; text-align: center;">
                    ✅ Order Complete!
                  </td>
                </tr>
                <!-- Spacer -->
                <tr><td style="padding: 15px 0;"></td></tr>
                <!-- Greeting -->
                <tr><td style="color: #e0e0e0; font-size: 16px; line-height: 1.6;">Hi ${username},</td></tr>
                <!-- Body Text -->
                <tr><td style="padding: 10px 0; color: #e0e0e0; font-size: 16px; line-height: 1.6;">Thank you for your purchase from Megatron Market! Your order for <strong>"${productTitle}"</strong> has been successfully processed.</td></tr>
                <!-- Order Details Box -->
                <tr><td style="padding: 20px 0;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #2a2a2a; border-radius: 4px; padding: 20px;"><tr><td style="color: #bbbbbb; font-size: 14px;">Order ID</td><td style="color: #ffffff; font-size: 14px; font-weight: bold; text-align: right;">#${orderId}</td></tr></table></td></tr>
                <!-- Instructions -->
                <tr><td style="padding: 10px 0; color: #e0e0e0; font-size: 16px; line-height: 1.6;">The account details have been delivered to you via your private Discord ticket. Please check your Discord channel for the credentials and to complete the handover process.</td></tr>
                <!-- Footer Text -->
                <tr><td style="padding-top: 20px; color: #e0e0e0; font-size: 16px; line-height: 1.6;">Thank you for choosing Megatron Market!<br><br>Best regards,<br>The Megatron Team</td></tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #111111; padding: 20px 30px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #888888; font-size: 12px;">If you have any questions, please join our <a href="https://discord.gg/your-invite-link" style="color: #5865F2; text-decoration: none;">Discord Server</a>.</p>
              <p style="margin: 10px 0 0; color: #888888; font-size: 12px;">&copy; ${new Date().getFullYear()} Megatron Market. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Email queued successfully for ${userEmail}.`);
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`   SMTP Response: ${info.response}`);
    } catch (error) {
        console.error(`❌ Error sending order confirmation email to ${userEmail}. Full error:`, error);
        // For production, you might want to add this to a retry queue
        throw error;
    }
}