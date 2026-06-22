import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class StockLevelsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.stockLevel.findMany({
      include: {
        product: true,
        depot: true,
      },
    });
  }
}
