import { prisma } from '../utils/db.js';

export type SellerAccount = {
  id: string;
  name: string;
  category: string;
  dedicatedId: string | null;
  phone: string | null;
  discordId: string | null;
  discordUsername: string | null;
  discordAvatar: string | null;
  notes: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export class SellerAccountService {
  public async getAll(): Promise<SellerAccount[]> {
    return prisma.sellerAccount.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  public async getById(id: string): Promise<SellerAccount | null> {
    return prisma.sellerAccount.findUnique({ where: { id } });
  }

  public async search(query: string): Promise<SellerAccount[]> {
    const q = query.toLowerCase();
    return prisma.sellerAccount.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { category: { contains: q } },
          { phone: { contains: q } },
          { notes: { contains: q } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  public async getByDateRange(from?: string, to?: string): Promise<SellerAccount[]> {
    const where: any = {};
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) {
        const endDate = new Date(to);
        endDate.setHours(23, 59, 59, 999);
        where.createdAt.lte = endDate;
      }
    }
    return prisma.sellerAccount.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  public async getByCategory(category: string): Promise<SellerAccount[]> {
    return prisma.sellerAccount.findMany({
      where: { category },
      orderBy: { createdAt: 'desc' }
    });
  }

  public async getCategories(): Promise<string[]> {
    const accounts = await prisma.sellerAccount.findMany({
      select: { category: true },
      distinct: ['category']
    });
    return accounts.map((a: any) => a.category).sort();
  }

  public async create(account: Omit<SellerAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<SellerAccount> {
    return prisma.sellerAccount.create({
      data: account
    });
  }

  public async update(id: string, updates: Partial<SellerAccount>): Promise<SellerAccount | null> {
    try {
      return await prisma.sellerAccount.update({
        where: { id },
        data: updates
      });
    } catch {
      return null;
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await prisma.sellerAccount.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  public async exportCSV(): Promise<string> {
    const accounts = await this.getAll();
    const headers = ['ID', 'Name', 'Category', 'Discord UID', 'Discord Username', 'Phone', 'Notes', 'Status', 'Created At', 'Updated At'];
    const rows = accounts.map((a: any) => [
      a.id,
      `"${(a.name || '').replace(/"/g, '""')}"`,
      `"${(a.category || '').replace(/"/g, '""')}"`,
      a.discordId || '',
      a.discordUsername || '',
      a.phone ? `"${a.phone.replace(/"/g, '""')}"` : '',
      a.notes ? `"${a.notes.replace(/"/g, '""')}"` : '',
      a.status,
      a.createdAt.toISOString(),
      a.updatedAt.toISOString(),
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}

export const sellerAccountService = new SellerAccountService();
