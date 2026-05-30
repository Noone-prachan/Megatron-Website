import express from 'express';
import { sendOrderConfirmationEmail, transporter } from '../../email';

const router = express.Router();

/**
 * GET /api/test/send-email
 * Sends a test email to a predefined address.
 * NOTE: This is for development/testing only and should be removed in production.
 */
router.get('/send-email', async (req, res) => {
    // ===================================================================================
    // IMPORTANT: Change this to your personal email address to receive the test email.
    // ===================================================================================
    const testRecipientEmail = 'prachansubedi4@gmail.com';

    if (testRecipientEmail.includes('your-email-for-testing')) {
        return res.status(400).json({
            error: 'Please edit server/routes/test.ts and set `testRecipientEmail` to your own email address.'
        });
    }

    console.log(`🚀 Received request to send a test email to ${testRecipientEmail}`);

    try {
        const mockOrderDetails = {
            orderId: 'MOCK-9876',
            userEmail: testRecipientEmail,
            username: 'Test User',
            productTitle: 'Awesome Mock Product',
        };

        await sendOrderConfirmationEmail(mockOrderDetails);

        res.json({ success: true, message: `Test email sent to ${testRecipientEmail}. Please check your inbox.` });

    } catch (error) {
        console.error('❌ Failed to send test email from API endpoint:', error);
        res.status(500).json({ error: 'Failed to send test email. Check server logs for details.' });
    }
});

/**
 * GET /api/test/verify-smtp
 * Verifies the SMTP connection and credentials.
 */
router.get('/verify-smtp', async (req, res) => {
    console.log('🔬 Verifying SMTP connection...');
    try {
        await transporter.verify();
        console.log('✅ SMTP connection successful.');
        res.json({ success: true, message: 'SMTP connection is valid and ready to send emails.' });
    } catch (error) {
        console.error('❌ SMTP connection verification failed:', error);
        res.status(500).json({ success: false, message: 'SMTP connection failed. Check server logs for details.', error: (error as Error).message });
    }
});

export default router;