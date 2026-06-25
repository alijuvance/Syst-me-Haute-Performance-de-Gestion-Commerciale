import { PrismaService } from '../../core/prisma/prisma.service';
import { StockMovementsService } from '../stock-movements/stock-movements.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-purchase-order.dto';
export declare class PurchaseOrdersService {
    private prisma;
    private stockMovementsService;
    constructor(prisma: PrismaService, stockMovementsService: StockMovementsService);
    create(dto: CreatePurchaseOrderDto): Promise<any>;
    receive(id: string, dto: ReceivePurchaseOrderDto, userId: string): Promise<any>;
    findAll(): any;
}
