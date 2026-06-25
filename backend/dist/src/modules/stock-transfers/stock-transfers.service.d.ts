import { PrismaService } from '../../core/prisma/prisma.service';
import { StockMovementsService } from '../stock-movements/stock-movements.service';
import { DispatchTransferDto } from './dto/dispatch-transfer.dto';
export declare class StockTransfersService {
    private prisma;
    private stockMovementsService;
    constructor(prisma: PrismaService, stockMovementsService: StockMovementsService);
    dispatchTransfer(dto: DispatchTransferDto, userId: string): Promise<any>;
    receiveTransfer(transferId: string, userId: string): Promise<any>;
    findAll(): Promise<any>;
}
