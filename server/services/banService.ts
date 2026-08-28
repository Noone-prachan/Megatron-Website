import { prisma } from '../utils/db.js';

export class BanService {
  private bannedIps: Set<string>;

  constructor() {
    this.bannedIps = new Set<string>();
    this.loadBannedIps();
  }

  private async loadBannedIps() {
    try {
      const ips = await prisma.bannedIp.findMany({
        select: { ipAddress: true }
      });
      this.bannedIps = new Set(ips.map((ip: any) => ip.ipAddress));
    } catch (err) {
      console.error('❌ Failed to load banned IPs from DB:', err);
    }
  }

  public isBanned(ip: string): boolean {
    return this.bannedIps.has(ip);
  }

  public async banIp(ip: string): Promise<boolean> {
    if (!this.bannedIps.has(ip)) {
      this.bannedIps.add(ip);
      try {
        await prisma.bannedIp.create({
          data: { ipAddress: ip }
        });
        return true;
      } catch (err) {
        console.error('Failed to save ban to DB:', err);
        return false;
      }
    }
    return false;
  }

  public async unbanIp(ip: string): Promise<boolean> {
    if (this.bannedIps.has(ip)) {
      this.bannedIps.delete(ip);
      try {
        await prisma.bannedIp.delete({
          where: { ipAddress: ip }
        });
        return true;
      } catch (err) {
        console.error('Failed to delete ban from DB:', err);
        return false;
      }
    }
    return false;
  }

  public getBannedIps(): string[] {
    return Array.from(this.bannedIps);
  }
}

export const banService = new BanService();
