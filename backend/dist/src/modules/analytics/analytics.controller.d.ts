import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
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
