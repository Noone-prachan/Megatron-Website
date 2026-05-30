import express from 'express';
import { sendOrderConfirmationEmail } from '../lib/email';

const router = express.Router();

// This is a placeholder for an authentication middleware that checks for admin privileges.
// In a real implementation, you would verify the JWT and check the user's ID.
const adminAuthMiddleware = (req: any, res: any, next: any) => {
    // The user's previous request mentioned specific admin IDs.
    // This assumes you have a JWT middleware that adds `req.user`.
    const ADMIN_IDS = ['913826949820997654', '570146481663770634', '850383604404322304'];
    if (req.user && ADMIN_IDS.includes(req.user.id)) {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
};

router.use(adminAuthMiddleware);

/**
 * POST /api/admin/orders/:orderId/confirm-sale
 * Marks an order as sold and sends a confirmation email.
 * This is an example endpoint. You'll need a database and order models.
 */
router.post('/orders/:orderId/confirm-sale', async (req, res) => {
    const { orderId } = req.params;

    try {
        // In a real app, you would fetch the order and user from your database.
        // This is a mock object for demonstration.
        // You will need to store the user's email during the OAuth process.
        const mockOrder = {
            id: orderId,
            status: 'pending',
            product: { id: 'prod_123', title: 'Premium MLBB Account' },
            user: { id: 'user_discord_id_123', username: 'TestUser', email: 'testuser@example.com' } // IMPORTANT: You must get and store user email.
        };

        // 1. Update order status in the database (e.g., set to 'sold')
        console.log(`Order ${orderId} would be marked as sold in the database.`);

        // 2. Send confirmation email
        await sendOrderConfirmationEmail({
            orderId: mockOrder.id,
            userEmail: mockOrder.user.email,
            username: mockOrder.user.username,
            productTitle: mockOrder.product.title,
        });

        res.json({ success: true, message: `Order ${orderId} confirmed and email sent.` });

    } catch (error) {
        console.error(`Error confirming sale for order ${orderId}:`, error);
        res.status(500).json({ error: 'Failed to confirm sale' });
    }
});

export default router;