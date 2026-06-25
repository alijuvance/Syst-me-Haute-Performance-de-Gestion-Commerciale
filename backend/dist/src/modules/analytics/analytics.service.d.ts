import { PrismaService } from '../../core/prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getKPIs(): Promise<{
        totalRevenue: any;
        totalReceivables: any;
        commercialMargin: number;
        totalCogs: number;
    }>;
    getSalesChart(): Promise<{
        date: string;
        amount: any;
    }[]>;
    getDebts(): Promise<any>;
}
