import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createProductDto: CreateProductDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<any>;
    remove(id: string): Promise<any>;
}
