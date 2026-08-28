import { prisma } from '../utils/db.js';

class AdminWhitelistService {
  private adminsCache: Set<string> | null = null;
  private readonly defaultAdmins = ['913826949820997654', '570146481663770634', '850383604404322304'];

  constructor() {
    this.refreshCache();
  }

  private async refreshCache() {
    try {
      const records = await prisma.adminWhitelist.findMany({ select: { discordId: true } });
      if (records.length === 0) {
        // Seed default admins on first run
        await Promise.all(this.defaultAdmins.map(id => 
          prisma.adminWhitelist.create({ data: { discordId: id, addedBy: 'system' } }).catch(() => {})
        ));
        this.adminsCache = new Set(this.defaultAdmins);
      } else {
        this.adminsCache = new Set(records.map((r: any) => r.discordId));
      }
    } catch (error) {
      console.error('Failed to read admin whitelist from DB:', error);
      if (!this.adminsCache) {
        this.adminsCache = new Set(this.defaultAdmins);
      }
    }
  }

  public async isAdmin(discordId: string): Promise<boolean> {
    if (!this.adminsCache) {
      await this.refreshCache();
    }
    return this.adminsCache!.has(discordId);
  }

  public async getAdmins(): Promise<string[]> {
    if (!this.adminsCache) {
      await this.refreshCache();
    }
    return Array.from(this.adminsCache!);
  }

  public async addAdmin(discordId: string, addedBy: string = 'system'): Promise<boolean> {
    if (!this.adminsCache) await this.refreshCache();
    
    if (!this.adminsCache!.has(discordId)) {
      this.adminsCache!.add(discordId);
      try {
        await prisma.adminWhitelist.create({ data: { discordId, addedBy } });
        return true;
      } catch (error) {
        console.error('Failed to add admin to DB:', error);
        return false;
      }
    }
    return false;
  }

  public async removeAdmin(discordId: string): Promise<boolean> {
    if (!this.adminsCache) await this.refreshCache();

    // Prevent removing the original founder to avoid complete lockout if mistake is made
    if (discordId === '913826949820997654') {
      console.warn("Attempted to remove primary founder admin.");
      return false;
    }
    
    if (this.adminsCache!.has(discordId)) {
      this.adminsCache!.delete(discordId);
      try {
        await prisma.adminWhitelist.delete({ where: { discordId } });
        return true;
      } catch (error) {
        console.error('Failed to remove admin from DB:', error);
        return false;
      }
    }
    return false;
  }
}

export const adminWhitelistService = new AdminWhitelistService();
