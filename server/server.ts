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
app.use('/api', limiter);

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://your-production-url.com'
    : 'http://localhost:5173',
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

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
