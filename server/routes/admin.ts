import { Router } from 'express';
import { auditService } from '../services/auditService';
import { banService } from '../services/banService';
import { adminWhitelistService } from '../services/adminWhitelistService';
import jwt from 'jsonwebtoken';

const router = Router();

// Middleware to check if user is admin
const adminAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Token required.' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const discordId = decoded.id;
    
    if (!adminWhitelistService.isAdmin(discordId)) {
      return res.status(401).json({ success: false, error: 'Unauthorized. Admin access required.' });
    }
    
    req.adminId = discordId;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }
};

router.use(adminAuth);

// Get all audit logs
router.get('/audit', (req, res) => {
  try {
    const logs = auditService.getLogs();
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch audit logs' });
  }
});

// Get all banned IPs
router.get('/bans', (req, res) => {
  try {
    const ips = banService.getBannedIps();
    res.json({ success: true, ips });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch banned IPs' });
  }
});

// Unban an IP
router.post('/bans/unban', (req: any, res) => {
  try {
    const { ip } = req.body;
    if (!ip) {
      return res.status(400).json({ success: false, error: 'IP address required' });
    }
    
    const success = banService.unbanIp(ip);
    if (success) {
      auditService.logAction(req.adminId, 'IP_UNBAN', `Unbanned IP via Web: ${ip}`);
    }
    
    res.json({ success, message: success ? 'IP unbanned' : 'IP not found in ban list' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to unban IP' });
  }
});

// Ban an IP
router.post('/bans/ban', (req: any, res) => {
  try {
    const { ip } = req.body;
    if (!ip) {
      return res.status(400).json({ success: false, error: 'IP address required' });
    }
    
    const success = banService.banIp(ip);
    if (success) {
      auditService.logAction(req.adminId, 'IP_BAN', `Banned IP via Web: ${ip}`);
    }
    
    res.json({ success, message: success ? 'IP banned' : 'IP is already banned' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to ban IP' });
  }
});

// Admin Whitelist endpoints
router.get('/whitelist', (req, res) => {
  try {
    const admins = adminWhitelistService.getAdmins();
    res.json({ success: true, admins });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch whitelist' });
  }
});

router.post('/whitelist/add', (req: any, res) => {
  try {
    const { discordId } = req.body;
    if (!discordId) {
      return res.status(400).json({ success: false, error: 'Discord ID required' });
    }
    const success = adminWhitelistService.addAdmin(discordId);
    if (success) {
      auditService.logAction(req.adminId, 'ADMIN_ADD', `Added Discord ID to admin whitelist: ${discordId}`);
    }
    res.json({ success, message: success ? 'Admin added' : 'Admin already in whitelist' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add admin' });
  }
});

router.post('/whitelist/remove', (req: any, res) => {
  try {
    const { discordId } = req.body;
    if (!discordId) {
      return res.status(400).json({ success: false, error: 'Discord ID required' });
    }
    const success = adminWhitelistService.removeAdmin(discordId);
    if (success) {
      auditService.logAction(req.adminId, 'ADMIN_REMOVE', `Removed Discord ID from admin whitelist: ${discordId}`);
    } else {
      return res.status(400).json({ success: false, error: 'Cannot remove this admin or admin not found' });
    }
    res.json({ success, message: 'Admin removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to remove admin' });
  }
});

export default router;
