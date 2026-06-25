import { PrismaService } from '../../core/prisma/prisma.service';
import { StockMovementsService } from '../stock-movements/stock-movements.service';
import { CustomersService } from '../customers/customers.service';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class SalesService {
    private prisma;
    private stockMovementsService;
    private customersService;
    constructor(prisma: PrismaService, stockMovementsService: StockMovementsService, customersService: CustomersService);
    createSale(dto: CreateSaleDto, userId: string): Promise<any>;
    findAll(): any;
}
