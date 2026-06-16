import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const WHITELIST_FILE = path.join(DATA_DIR, 'whitelisted_admins.json');

// Ensure the initial file exists with the default admins
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(WHITELIST_FILE)) {
  const initialAdmins = ['913826949820997654', '570146481663770634', '850383604404322304'];
  fs.writeFileSync(WHITELIST_FILE, JSON.stringify(initialAdmins, null, 2));
}

class AdminWhitelistService {
  private getAdminsList(): string[] {
    try {
      const data = fs.readFileSync(WHITELIST_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to read admin whitelist:', error);
      return ['913826949820997654', '570146481663770634', '850383604404322304'];
    }
  }

  private saveAdminsList(admins: string[]): void {
    try {
      fs.writeFileSync(WHITELIST_FILE, JSON.stringify(admins, null, 2));
    } catch (error) {
      console.error('Failed to save admin whitelist:', error);
    }
  }

  public isAdmin(discordId: string): boolean {
    const admins = this.getAdminsList();
    return admins.includes(discordId);
  }

  public getAdmins(): string[] {
    return this.getAdminsList();
  }

  public addAdmin(discordId: string): boolean {
    const admins = this.getAdminsList();
    if (!admins.includes(discordId)) {
      admins.push(discordId);
      this.saveAdminsList(admins);
      return true;
    }
    return false;
  }

  public removeAdmin(discordId: string): boolean {
    let admins = this.getAdminsList();
    // Prevent removing the original founder to avoid complete lockout if mistake is made
    if (discordId === '913826949820997654') {
      console.warn("Attempted to remove primary founder admin.");
      return false;
    }
    
    if (admins.includes(discordId)) {
      admins = admins.filter(id => id !== discordId);
      this.saveAdminsList(admins);
      return true;
    }
    return false;
  }
}

export const adminWhitelistService = new AdminWhitelistService();
