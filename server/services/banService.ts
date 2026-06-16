import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BANNED_IPS_FILE = path.join(__dirname, '../data/banned_ips.json');

export class BanService {
  private bannedIps: Set<string>;

  constructor() {
    this.bannedIps = new Set<string>();
    this.loadBannedIps();
  }

  private loadBannedIps() {
    try {
      if (fs.existsSync(BANNED_IPS_FILE)) {
        const data = fs.readFileSync(BANNED_IPS_FILE, 'utf-8');
        const ips = JSON.parse(data);
        if (Array.isArray(ips)) {
          this.bannedIps = new Set(ips);
        }
      }
    } catch (err) {
      console.error('❌ Failed to load banned IPs:', err);
    }
  }

  private saveBannedIps() {
    try {
      const data = JSON.stringify(Array.from(this.bannedIps), null, 2);
      fs.writeFileSync(BANNED_IPS_FILE, data, 'utf-8');
    } catch (err) {
      console.error('❌ Failed to save banned IPs:', err);
    }
  }

  public isBanned(ip: string): boolean {
    return this.bannedIps.has(ip);
  }

  public banIp(ip: string): boolean {
    if (!this.bannedIps.has(ip)) {
      this.bannedIps.add(ip);
      this.saveBannedIps();
      return true;
    }
    return false;
  }

  public unbanIp(ip: string): boolean {
    if (this.bannedIps.has(ip)) {
      this.bannedIps.delete(ip);
      this.saveBannedIps();
      return true;
    }
    return false;
  }

  public getBannedIps(): string[] {
    return Array.from(this.bannedIps);
  }
}

export const banService = new BanService();
