# MLBB Market Backend

Node.js backend server for the MLBB account marketplace with Discord integration and Nepal payment gateway support.

## Features

- **Discord OAuth Authentication**: Secure login via Discord
- **Discord Bot Integration**: Automated ticket creation for purchases
- **Payment Gateway Support**: 
  - eSewa
  - Khalti
  - IME Pay
  - Bank Transfer
- **JWT Authentication**: Secure API endpoints
- **RESTful API**: Clean and organized routes

## Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

### 3. Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and create a bot
4. Copy the bot token to `DISCORD_BOT_TOKEN` in `.env`
5. Enable "Message Content Intent" under Privileged Gateway Intents
6. Go to "OAuth2" section:
   - Add redirect URI: `http://localhost:5173/auth/discord/callback`
   - Copy Client ID and Client Secret to `.env`
7. Invite the bot to your Discord server with permissions:
   - Manage Channels
   - Send Messages
   - Embed Links
   - Read Message History

### 4. Discord Server Setup

1. Create a Discord server for your marketplace
2. Create a category called "TICKETS"
3. Copy the server ID to `DISCORD_GUILD_ID`
4. Copy the tickets category ID to `DISCORD_TICKET_CHANNEL_ID`

### 5. Payment Gateway Setup

#### eSewa
1. Register at [eSewa Merchant Portal](https://merchant.esewa.com.np/)
2. Get your Merchant ID and Secret Key
3. Add to `.env`

#### Khalti
1. Register at [Khalti Business](https://khalti.com/business/)
2. Get your Secret Key from dashboard
3. Add to `.env`

#### IME Pay
1. Contact IME Pay for merchant registration
2. Get Merchant Code and Secret Key
3. Add to `.env`

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will run on `http://localhost:3001`

## API Endpoints

### Authentication
- `GET /api/auth/discord` - Initiate Discord OAuth
- `GET /api/auth/discord/callback` - OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Tickets
- `POST /api/tickets/create` - Create purchase ticket
- `POST /api/tickets/close` - Close ticket

### Payments
- `POST /api/payments/esewa/verify` - Verify eSewa payment
- `POST /api/payments/khalti/verify` - Verify Khalti payment
- `POST /api/payments/imepay/verify` - Verify IME Pay payment
- `POST /api/payments/webhook` - Payment webhook
- `GET /api/payments/methods` - Get available payment methods

## Integration with Frontend

Update the frontend to call these API endpoints:

```javascript
// Login with Discord
window.location.href = 'http://localhost:3001/api/auth/discord';

// Create purchase ticket
const response = await fetch('http://localhost:3001/api/tickets/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    productId: '1',
    productTitle: 'HYPER BASED PREMIUM ACCOUNT',
    userId: 'discord-user-id',
    username: 'discord-username'
  })
});
```

## Security Notes

- Never commit `.env` file
- Use HTTPS in production
- Implement rate limiting
- Validate all inputs
- Use prepared statements for database queries
- Keep dependencies updated

## Payment Flow

1. User clicks "Purchase" on product
2. Frontend creates Discord ticket via API
3. Support team contacts user in Discord ticket
4. User chooses payment method
5. User completes payment
6. Payment webhook notifies backend
7. Backend verifies payment
8. Account details delivered via Discord ticket

## Database (Optional)

For production, you should add a database to store:
- Orders
- Users
- Transactions
- Account inventory

Recommended: PostgreSQL or MongoDB

## Deployment

### Railway / Render / Heroku
1. Connect your GitHub repository
2. Set environment variables
3. Deploy!

### VPS (DigitalOcean, AWS, etc.)
1. Install Node.js
2. Clone repository
3. Install dependencies
4. Set up environment variables
5. Use PM2 for process management
6. Set up nginx as reverse proxy

## Support

For issues or questions, contact the development team via Discord.
