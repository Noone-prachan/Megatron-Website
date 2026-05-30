# Quick Setup Guide

Follow these steps to get the MLBB marketplace running locally.

## 1. Install Dependencies

```bash
# Frontend
pnpm install

# Backend
cd server
pnpm install
cd ..
```

## 2. Set Up Discord Application

### Create Discord Application
1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Name it "MLBB Market" (or your preferred name)

### Configure OAuth2
1. Go to "OAuth2" → "General"
2. Add redirect URL: `http://localhost:5173/auth/discord/callback`
3. Copy "Client ID" and "Client Secret"

### Create Discord Bot
1. Go to "Bot" section
2. Click "Add Bot"
3. Enable "Message Content Intent" under "Privileged Gateway Intents"
4. Click "Reset Token" and copy the bot token

### Set Up Discord Server
1. Create a new Discord server (or use existing)
2. Create a category called "TICKETS"
3. Right-click the server icon → Copy Server ID (enable Developer Mode in Discord settings first)
4. Right-click the TICKETS category → Copy Category ID

### Invite Bot to Server
1. Go to "OAuth2" → "URL Generator"
2. Select scopes: `bot`, `applications.commands`
3. Select bot permissions:
   - Manage Channels
   - Send Messages
   - Embed Links
   - Read Message History
4. Copy the generated URL and open in browser
5. Select your server and authorize

## 3. Configure Environment Variables

### Frontend (.env)
```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:3001/api
```

### Backend (server/.env)
```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```
PORT=3001
NODE_ENV=development

# Discord (from step 2)
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
DISCORD_REDIRECT_URI=http://localhost:5173/auth/discord/callback
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_GUILD_ID=your_server_id_here
DISCORD_TICKET_CHANNEL_ID=your_tickets_category_id_here

# JWT (generate a random secret)
JWT_SECRET=your_random_secret_key_here

# Payment Gateways (optional for testing)
ESEWA_MERCHANT_ID=
ESEWA_SECRET_KEY=
KHALTI_SECRET_KEY=
IMEPAY_MERCHANT_CODE=
IMEPAY_SECRET_KEY=
```

To generate a random JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 4. Run the Application

Open two terminal windows:

**Terminal 1 - Frontend:**
```bash
pnpm run dev
```
Runs on: http://localhost:5173

**Terminal 2 - Backend:**
```bash
cd server
pnpm run dev
```
Runs on: http://localhost:3001

## 5. Test the Setup

1. Open http://localhost:5173 in your browser
2. Click "Login with Discord" in the header
3. Authorize the application
4. You should be redirected back and logged in
5. Try clicking "Purchase" on any product
6. Check your Discord server - a ticket channel should be created

## 6. Payment Gateway Setup (Optional)

### eSewa
1. Visit: https://merchant.esewa.com.np/
2. Register for merchant account
3. Add credentials to `server/.env`

### Khalti
1. Visit: https://khalti.com/business/
2. Register for business account
3. Get API keys from dashboard
4. Add to `server/.env`

### IME Pay
1. Contact IME Pay for merchant registration
2. Get merchant credentials
3. Add to `server/.env`

## Troubleshooting

### Discord Bot Not Working
- Check if bot is online in Discord server
- Verify bot token is correct
- Make sure "Message Content Intent" is enabled
- Check if bot has proper permissions

### OAuth Redirect Error
- Verify redirect URI matches exactly in Discord app settings
- Check DISCORD_REDIRECT_URI in server/.env
- Make sure both servers are running

### Ticket Creation Fails
- Verify DISCORD_GUILD_ID is correct
- Verify DISCORD_TICKET_CHANNEL_ID is correct (should be category ID)
- Check bot permissions in the server
- Look at server logs for error messages

### Port Already in Use
```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

## Next Steps

Once everything is working:

1. **Customize the design** - Edit `src/styles/theme.css`
2. **Add real product data** - Replace mock data in components
3. **Set up database** - Add PostgreSQL or MongoDB for storing orders
4. **Configure payments** - Integrate real payment gateways
5. **Deploy** - Use Vercel for frontend, Railway/Render for backend

## Need Help?

- Check the main README.md for detailed documentation
- Review server logs for error messages
- Check Discord Developer Portal for webhook/bot logs
- Open an issue on GitHub
