import { Router } from 'express';
import { auditService } from '../services/auditService';
import { banService } from '../services/banService';
import { adminWhitelistService } from '../services/adminWhitelistService';
import { sellerAccountService, type SellerAccount } from '../services/sellerAccountService';
import jwt from 'jsonwebtoken';

const router = Router();

// Middleware to check if user is admin
const adminAuth = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Token required.' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const discordId = decoded.id;
    
    if (!await adminWhitelistService.isAdmin(discordId)) {
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
router.get('/audit', async (req, res) => {
  try {
    const logs = await auditService.getLogs();
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
router.post('/bans/unban', async (req: any, res: any) => {
  try {
    const { ip } = req.body;
    if (!ip) {
      return res.status(400).json({ success: false, error: 'IP address required' });
    }
    
    const success = await banService.unbanIp(ip);
    if (success) {
      await auditService.logAction(req.adminId, 'IP_UNBAN', `Unbanned IP via Web: ${ip}`);
    }
    
    res.json({ success, message: success ? 'IP unbanned' : 'IP not found in ban list' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to unban IP' });
  }
});

// Ban an IP
router.post('/bans/ban', async (req: any, res: any) => {
  try {
    const { ip } = req.body;
    if (!ip) {
      return res.status(400).json({ success: false, error: 'IP address required' });
    }
    
    const success = await banService.banIp(ip);
    if (success) {
      await auditService.logAction(req.adminId, 'IP_BAN', `Banned IP via Web: ${ip}`);
    }
    
    res.json({ success, message: success ? 'IP banned' : 'IP is already banned' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to ban IP' });
  }
});

// Admin Whitelist endpoints
router.get('/whitelist', async (req, res) => {
  try {
    const admins = await adminWhitelistService.getAdmins();
    res.json({ success: true, admins });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch whitelist' });
  }
});

router.post('/whitelist/add', async (req: any, res) => {
  try {
    const { discordId } = req.body;
    if (!discordId) {
      return res.status(400).json({ success: false, error: 'Discord ID required' });
    }
    const success = await adminWhitelistService.addAdmin(discordId);
    if (success) {
      await auditService.logAction(req.adminId, 'ADMIN_ADD', `Added Discord ID to admin whitelist: ${discordId}`);
    }
    res.json({ success, message: success ? 'Admin added' : 'Admin already in whitelist' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add admin' });
  }
});

router.post('/whitelist/remove', async (req: any, res) => {
  try {
    const { discordId } = req.body;
    if (!discordId) {
      return res.status(400).json({ success: false, error: 'Discord ID required' });
    }
    const success = await adminWhitelistService.removeAdmin(discordId);
    if (success) {
      await auditService.logAction(req.adminId, 'ADMIN_REMOVE', `Removed Discord ID from admin whitelist: ${discordId}`);
    } else {
      return res.status(400).json({ success: false, error: 'Cannot remove this admin or admin not found' });
    }
    res.json({ success: true, message: 'Admin removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to remove admin' });
  }
});

// Seller Accounts CRUD
router.get('/seller-accounts', async (req, res) => {
  try {
    const { category, search, from, to } = req.query as any;
    let accounts: SellerAccount[] = await sellerAccountService.getAll();

    if (search) {
      accounts = await sellerAccountService.search(search);
    } else if (category && category !== 'all') {
      accounts = await sellerAccountService.getByCategory(category);
    }

    if (from || to) {
      accounts = accounts.filter(a => {
        const created = new Date(a.createdAt);
        if (from && created < new Date(from)) return false;
        if (to) {
          const end = new Date(to);
          end.setHours(23, 59, 59, 999);
          if (created > end) return false;
        }
        return true;
      });
    }

    res.json({ success: true, accounts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch seller accounts' });
  }
});

router.get('/seller-accounts/categories', async (req, res) => {
  try {
    const categories = await sellerAccountService.getCategories();
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

router.get('/seller-accounts/:id', async (req, res) => {
  try {
    const account = await sellerAccountService.getById(req.params.id);
    if (!account) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }
    res.json({ success: true, account });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch account' });
  }
});

router.post('/seller-accounts', async (req: any, res: any) => {
  try {
    const { name, category, dedicatedId, phone, discordId, discordUsername, discordAvatar, notes, status } = req.body;
    if (!name || !category) {
      return res.status(400).json({ success: false, error: 'Name and category are required' });
    }

    const account = await sellerAccountService.create({
      name,
      category,
      dedicatedId,
      phone,
      discordId,
      discordUsername,
      discordAvatar,
      notes,
      status: status || 'active',
    });

    await auditService.logAction(req.adminId, 'SELLER_ACCOUNT_CREATE', `Created seller account: ${name} (${category})`);
    res.json({ success: true, account });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create seller account' });
  }
});

router.put('/seller-accounts/:id', async (req: any, res: any) => {
  try {
    const { name, category, dedicatedId, phone, discordId, discordUsername, discordAvatar, notes, status } = req.body;

    const account = await sellerAccountService.update(req.params.id, {
      name,
      category,
      dedicatedId,
      phone,
      discordId,
      discordUsername,
      discordAvatar,
      notes,
      status,
    });

    if (!account) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }

    await auditService.logAction(req.adminId, 'SELLER_ACCOUNT_UPDATE', `Updated seller account: ${account.name}`);
    res.json({ success: true, account });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update seller account' });
  }
});

router.delete('/seller-accounts/:id', async (req: any, res: any) => {
  try {
    const existing = await sellerAccountService.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }

    const success = await sellerAccountService.delete(req.params.id);
    if (success) {
      await auditService.logAction(req.adminId, 'SELLER_ACCOUNT_DELETE', `Deleted seller account: ${existing.name}`);
    }
    res.json({ success, message: success ? 'Account deleted' : 'Failed to delete' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete seller account' });
  }
});

router.get('/seller-accounts/export/csv', async (req, res) => {
  try {
    const csv = await sellerAccountService.exportCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="seller-accounts.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to export CSV' });
  }
});

export default router;
