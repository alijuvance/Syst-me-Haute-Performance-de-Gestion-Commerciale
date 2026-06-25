import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
export declare class StockMovementsService {
    private prisma;
    constructor(prisma: PrismaService);
    registerMovement(dto: CreateStockMovementDto, userId: string): Promise<any>;
    findAll(): Promise<any>;
}
