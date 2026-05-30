import express from 'express';

const router = express.Router();

/**
 * POST /api/payments/esewa/verify
 * Verify eSewa payment
 */
router.post('/esewa/verify', async (req, res) => {
  const { oid, amt, refId } = req.body;

  // eSewa verification logic
  // In production, you would verify with eSewa API
  try {
    // Mock verification for now
    const isValid = true; // Replace with actual eSewa API call

    if (isValid) {
      // Update order status in database
      res.json({
        success: true,
        message: 'Payment verified successfully',
        orderId: oid,
        amount: amt,
        reference: refId,
      });
    } else {
      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('eSewa verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

/**
 * POST /api/payments/khalti/verify
 * Verify Khalti payment
 */
router.post('/khalti/verify', async (req, res) => {
  const { token, amount } = req.body;

  try {
    // In production, verify with Khalti API
    // https://docs.khalti.com/checkout/web/

    const response = await fetch('https://khalti.com/api/v2/payment/verify/', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, amount }),
    });

    const data = await response.json();

    if (data.idx) {
      res.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: data.idx,
        amount: data.amount,
      });
    } else {
      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Khalti verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

/**
 * POST /api/payments/imepay/verify
 * Verify IME Pay payment
 */
router.post('/imepay/verify', async (req, res) => {
  const { transactionId, amount } = req.body;

  try {
    // In production, verify with IME Pay API
    // Documentation: https://www.imepay.com.np/

    const isValid = true; // Replace with actual IME Pay verification

    if (isValid) {
      res.json({
        success: true,
        message: 'Payment verified successfully',
        transactionId,
        amount,
      });
    } else {
      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('IME Pay verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

/**
 * POST /api/payments/webhook
 * Generic webhook endpoint for payment notifications
 */
router.post('/webhook', async (req, res) => {
  const { provider, ...paymentData } = req.body;

  console.log(`Payment webhook received from ${provider}:`, paymentData);

  // Verify webhook signature (implement based on provider)
  // Update order status
  // Notify user via Discord

  res.json({ received: true });
});

/**
 * GET /api/payments/methods
 * Get available payment methods
 */
router.get('/methods', (req, res) => {
  res.json({
    methods: [
      {
        id: 'esewa',
        name: 'eSewa',
        logo: '/assets/esewa-logo.png',
        enabled: !!process.env.ESEWA_MERCHANT_ID,
      },
      {
        id: 'khalti',
        name: 'Khalti',
        logo: '/assets/khalti-logo.png',
        enabled: !!process.env.KHALTI_SECRET_KEY,
      },
      {
        id: 'imepay',
        name: 'IME Pay',
        logo: '/assets/imepay-logo.png',
        enabled: !!process.env.IMEPAY_MERCHANT_CODE,
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        logo: '/assets/bank-logo.png',
        enabled: true,
      },
    ],
  });
});

export default router;
