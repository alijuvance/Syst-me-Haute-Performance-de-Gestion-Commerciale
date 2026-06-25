import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
export declare class SuppliersController {
    private readonly suppliersService;
    constructor(suppliersService: SuppliersService);
    create(createSupplierDto: CreateSupplierDto): any;
    findAll(): any;
    findOne(id: string): Promise<any>;
    update(id: string, updateDto: Partial<CreateSupplierDto>): Promise<any>;
    remove(id: string): Promise<any>;
}
