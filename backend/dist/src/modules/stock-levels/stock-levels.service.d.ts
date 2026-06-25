import { PrismaService } from '../../core/prisma/prisma.service';
export declare class StockLevelsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
}
