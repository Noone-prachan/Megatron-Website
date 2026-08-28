import 'dotenv/config';
import express from 'express'; // triggered reload
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
// @ts-ignore
import xss from 'xss-clean';
import authRoutes from './routes/auth';
import ticketRoutes from './routes/tickets';
import reviewsRoutes from './routes/reviews';
import chatRoutes from './routes/chat';
import analyticsRoutes from './routes/analytics';
import adminRoutes from './routes/admin';
import gameRoutes from './routes/game';
import userRoutes from './routes/users';
import seoRoutes from './routes/seo';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
import { banService } from './services/banService';

app.use((req, res, next) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
  if (clientIp && banService.isBanned(clientIp as string)) {
    return res.status(403).json({ error: 'Access Denied: Your IP has been banned from accessing Megatron.' });
  }
  next();
});

app.use(helmet());
app.use(xss());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

// Apply rate limiter to /api, but skip auth routes (they handle their own limiting if needed)
app.use('/api', (req, res, next) => {
  // Skip rate limiting for auth endpoints
  if (req.path.startsWith('/auth')) {
    return next();
  }
  limiter(req, res, next);
});

app.use(cors({
  origin: (origin, callback) => {
    // Allow any origin in development (LAN clients, tunnels, etc.)
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    const allowed = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'https://witty-bears-dress.loca.lt',
      'https://social-dogs-swim.loca.lt',
      'https://old-socks-tie.loca.lt',
      'https://common-bees-travel.loca.lt',
    ];
    if (!origin || allowed.includes(origin) || origin.endsWith('.loca.lt')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/users', userRoutes);
app.use('/api/seo', seoRoutes);

// Add test routes for development mode
if (process.env.NODE_ENV !== 'production') {
  console.log('🛠️  Registering test routes for development mode.');
  import('./routes/test').then(testRoutes => {
    app.use('/api/test', testRoutes.default);
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MLBB Market API is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
