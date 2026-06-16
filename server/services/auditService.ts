import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUDIT_LOGS_FILE = path.join(__dirname, '../data/audit_logs.json');

export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  details: string;
  timestamp: string;
}

export class AuditService {
  private logs: AuditLog[] = [];

  constructor() {
    this.loadLogs();
  }

  private loadLogs() {
    try {
      if (fs.existsSync(AUDIT_LOGS_FILE)) {
        const data = fs.readFileSync(AUDIT_LOGS_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          this.logs = parsed;
        }
      }
    } catch (err) {
      console.error('❌ Failed to load audit logs:', err);
    }
  }

  private saveLogs() {
    try {
      // Create data directory if it doesn't exist
      const dataDir = path.dirname(AUDIT_LOGS_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      const data = JSON.stringify(this.logs, null, 2);
      fs.writeFileSync(AUDIT_LOGS_FILE, data, 'utf-8');
    } catch (err) {
      console.error('❌ Failed to save audit logs:', err);
    }
  }

  public logAction(adminId: string, action: string, details: string) {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substring(2, 11),
      adminId,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    
    // Keep only the last 1000 logs to prevent file bloat
    this.logs.unshift(newLog);
    if (this.logs.length > 1000) {
      this.logs.pop();
    }
    
    this.saveLogs();
    return newLog;
  }

  public getLogs(): AuditLog[] {
    return this.logs;
  }
}

export const auditService = new AuditService();
