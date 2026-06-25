import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
export declare class SuppliersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateSupplierDto): any;
    findAll(): any;
    findOne(id: string): Promise<any>;
    update(id: string, dto: Partial<CreateSupplierDto>): Promise<any>;
    remove(id: string): Promise<any>;
}
