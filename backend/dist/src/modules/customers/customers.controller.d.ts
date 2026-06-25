import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: CreateCustomerDto): Promise<any>;
    findAll(): any;
    findOne(id: string): Promise<any>;
    update(id: string, updateDto: Partial<CreateCustomerDto>): Promise<any>;
    remove(id: string): Promise<any>;
}
