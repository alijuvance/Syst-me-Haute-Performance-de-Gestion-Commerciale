import { PrismaService } from '../../core/prisma/prisma.service';
export declare class DepotsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    create(data: {
        name: string;
        location?: string;
        type: string;
    }): Promise<any>;
}
