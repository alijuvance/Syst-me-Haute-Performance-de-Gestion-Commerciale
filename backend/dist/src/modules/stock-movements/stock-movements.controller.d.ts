import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
export declare class StockMovementsController {
    private readonly stockMovementsService;
    constructor(stockMovementsService: StockMovementsService);
    create(dto: CreateStockMovementDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        type: string;
        depotId: string;
        date: Date;
        reference: string | null;
        quantityChanged: number;
        userId: string;
    }>;
    findAll(): Promise<({
        user: {
            email: string;
            fullName: string;
            roleId: string;
            id: string;
            passwordHash: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        product: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            barcode: string | null;
            description: string | null;
            defaultPrice: number;
            costPrice: number;
            categoryId: string;
        };
        depot: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            location: string | null;
            type: string;
        };
    } & {
        id: string;
        createdAt: Date;
        productId: string;
        type: string;
        depotId: string;
        date: Date;
        reference: string | null;
        quantityChanged: number;
        userId: string;
    })[]>;
}
