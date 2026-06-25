import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-purchase-order.dto';
export declare class PurchaseOrdersController {
    private readonly purchaseOrdersService;
    constructor(purchaseOrdersService: PurchaseOrdersService);
    create(createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<any>;
    findAll(): any;
    receive(id: string, receiveDto: ReceivePurchaseOrderDto, req: any): Promise<any>;
}
