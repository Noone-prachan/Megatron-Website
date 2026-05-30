# MLBB Market - Mobile Legends Account Marketplace

A professional marketplace for buying and selling Mobile Legends: Bang Bang accounts with Discord integration and Nepal payment gateway support.

![MLBB Market](https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop)

## Features

### 🎮 User Features
- **Browse Premium Accounts**: High-quality MLBB accounts with detailed stats
- **Discord Authentication**: Secure login via Discord OAuth
- **Discord Ticket System**: Automated purchase flow through Discord tickets
- **Nepal Payment Methods**: eSewa, Khalti, IME Pay, and Bank Transfer
- **Product Pages**: Detailed account information with images and stats
- **Customer Reviews**: Verified customer testimonials
- **Responsive Design**: Works perfectly on desktop and mobile

### 🔐 Security Features
- JWT-based authentication
- Secure Discord OAuth integration
- Manual payment verification
- Private ticket channels for transactions

### 🎨 Design Features
- Dark gaming aesthetic inspired by modern marketplaces
- Smooth animations with Framer Motion
- Gradient effects and glassmorphism
- Professional UI components from Radix UI
- Fully responsive design with Tailwind CSS

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router** - Multi-page navigation
- **Tailwind CSS v4** - Styling
- **Framer Motion** - Animations
- **Radix UI** - Accessible components
- **Lucide React** - Icons
- **Vite** - Build tool

### Backend (Node.js)
- **Express** - Web framework
- **TypeScript** - Type safety
- **Discord.js** - Discord bot integration
- **JWT** - Authentication
- **Axios** - HTTP client

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Discord Application (for OAuth and bot)
- Nepal Payment Gateway accounts (eSewa, Khalti, IME Pay)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd mlbb-market
```

2. **Install frontend dependencies**
```bash
pnpm install
```

3. **Install backend dependencies**
```bash
cd server
pnpm install
cd ..
```

4. **Configure environment variables**

Frontend (.env):
```bash
cp .env.example .env
# Edit .env with your configuration
```

Backend (server/.env):
```bash
cp server/.env.example server/.env
# Edit server/.env with your Discord and payment credentials
```

### Discord Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Create a bot under the "Bot" section
4. Enable "Message Content Intent"
5. Add OAuth2 redirect: `http://localhost:5173/auth/discord/callback`
6. Copy credentials to `server/.env`:
   - DISCORD_CLIENT_ID
   - DISCORD_CLIENT_SECRET
   - DISCORD_BOT_TOKEN
7. Create a Discord server and copy:
   - DISCORD_GUILD_ID
   - DISCORD_TICKET_CHANNEL_ID (create a "TICKETS" category)
8. Invite bot with permissions: Manage Channels, Send Messages, Embed Links

### Running the Application

**Development mode:**

Terminal 1 - Frontend:
```bash
pnpm run dev
# Or: npm run dev
```

Terminal 2 - Backend:
```bash
cd server
pnpm run dev
# Or: npm run dev
```

The frontend will run on `http://localhost:5173`
The backend API will run on `http://localhost:3001`

**Production build:**
```bash
# Frontend
pnpm run build

# Backend
cd server
pnpm run build
pnpm start
```

## Project Structure

```
mlbb-market/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── pages/
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Products.tsx
│   │   │   │   ├── ProductDetail.tsx
│   │   │   │   ├── Reviews.tsx
│   │   │   │   ├── Team.tsx
│   │   │   │   └── NotFound.tsx
│   │   │   ├── products/
│   │   │   │   └── ProductCard.tsx
│   │   │   ├── reviews/
│   │   │   │   └── ReviewCard.tsx
│   │   │   └── Root.tsx
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── lib/
│   │   ├── api.ts          # API client
│   │   └── types.ts        # TypeScript types
│   └── styles/
│       ├── fonts.css
│       └── theme.css
├── server/
│   ├── routes/
│   │   ├── auth.ts         # Discord OAuth
│   │   ├── tickets.ts      # Discord tickets
│   │   └── payments.ts     # Payment verification
│   ├── server.ts           # Express server
│   └── package.json
├── package.json
└── README.md
```

## Payment Integration

### eSewa
1. Register at [eSewa Merchant Portal](https://merchant.esewa.com.np/)
2. Get Merchant ID and Secret Key
3. Add to `server/.env`

### Khalti
1. Register at [Khalti Business](https://khalti.com/business/)
2. Get Secret Key from dashboard
3. Add to `server/.env`

### IME Pay
1. Contact IME Pay for merchant registration
2. Get Merchant Code and Secret Key
3. Add to `server/.env`

## How It Works

1. **User browses accounts** on the marketplace
2. **User logs in** via Discord OAuth
3. **User clicks "Purchase"** on a product
4. **Discord ticket is created** automatically
5. **Support team contacts user** in the private ticket channel
6. **User chooses payment method** (eSewa/Khalti/IME Pay/Bank Transfer)
7. **User completes payment** via chosen method
8. **Payment is verified** by backend webhooks
9. **Account details delivered** to user via Discord ticket

## Deployment

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `pnpm run build`
3. Set output directory: `dist`
4. Add environment variables

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Select `server` directory
3. Set environment variables
4. Deploy!

### VPS (DigitalOcean/AWS)
1. Install Node.js 18+
2. Clone repository
3. Install dependencies
4. Set up environment variables
5. Use PM2 for process management
6. Set up Nginx as reverse proxy
7. Configure SSL with Let's Encrypt

## Customization

### Colors & Theme
Edit `src/styles/theme.css` to customize the color scheme.

### Adding New Payment Methods
1. Create payment route in `server/routes/payments.ts`
2. Add verification logic
3. Update payment methods list

### Adding New Pages
1. Create component in `src/app/components/pages/`
2. Add route in `src/app/routes.tsx`
3. Add navigation link in `Header.tsx`

## Security Considerations

- Never commit `.env` files
- Use HTTPS in production
- Implement rate limiting on API
- Validate all user inputs
- Use prepared statements for database queries
- Keep dependencies updated
- Implement proper error handling
- Add CSRF protection for forms

## Support

For issues or questions:
- Open an issue on GitHub
- Contact via Discord
- Email: support@mlbbmarket.com

## License

MIT License - feel free to use this for your own projects!

## Credits

- Built with ❤️ using React, Tailwind CSS, and Node.js
- Icons by [Lucide](https://lucide.dev/)
- Images from [Unsplash](https://unsplash.com/)

---

**Note**: This is a marketplace template. Make sure to comply with all relevant laws and regulations when running a real marketplace, including:
- Terms of Service
- Privacy Policy
- Payment processing regulations
- Consumer protection laws
- Data protection (GDPR, etc.)
