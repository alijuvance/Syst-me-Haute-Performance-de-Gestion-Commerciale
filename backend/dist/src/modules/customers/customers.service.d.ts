import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateCustomerDto): Promise<any>;
    findAll(): any;
    findOne(id: string): Promise<any>;
    update(id: string, dto: Partial<CreateCustomerDto>): Promise<any>;
    remove(id: string): Promise<any>;
    getOrCreateGenericPosCustomer(): Promise<any>;
}
