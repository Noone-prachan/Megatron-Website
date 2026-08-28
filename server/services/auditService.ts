import { prisma } from '../utils/db.js';

export type AuditLog = {
  id: string;
  action: string;
  details: string;
  adminUser: string;
  timestamp: Date;
};

export class AuditService {
  public async logAction(adminUser: string, action: string, details: string): Promise<AuditLog> {
    const newLog = await prisma.auditLog.create({
      data: {
        adminUser,
        action,
        details,
        timestamp: new Date()
      }
    });
    
    // Optionally keep only the last 1000 logs
    const count = await prisma.auditLog.count();
    if (count > 1000) {
      const oldest = await prisma.auditLog.findMany({
        orderBy: { timestamp: 'asc' },
        take: count - 1000,
        select: { id: true }
      });
      await prisma.auditLog.deleteMany({
        where: {
          id: { in: oldest.map((o: any) => o.id) }
        }
      });
    }
    
    return newLog;
  }

  public async getLogs(): Promise<AuditLog[]> {
    return prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' }
    });
  }
}

export const auditService = new AuditService();
