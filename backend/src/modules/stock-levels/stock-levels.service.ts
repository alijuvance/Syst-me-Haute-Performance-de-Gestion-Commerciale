import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class StockLevelsService {
  constructor(private prisma: PrismaService) {}

  async findAll(depotId?: string) {
    const where = depotId ? { depotId } : {};

    const stockLevels = await this.prisma.stockLevel.findMany({
      where,
      include: {
        product: { include: { category: true } },
        depot: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    // For each stock level, fetch the first and last stock movement dates
    const enriched = await Promise.all(
      stockLevels.map(async (sl) => {
        const [firstMovement, lastMovement] = await Promise.all([
          this.prisma.stockMovement.findFirst({
            where: { productId: sl.productId, depotId: sl.depotId },
            orderBy: { date: 'asc' },
            select: { date: true },
          }),
          this.prisma.stockMovement.findFirst({
            where: { productId: sl.productId, depotId: sl.depotId },
            orderBy: { date: 'desc' },
            select: { date: true },
          }),
        ]);

        return {
          ...sl,
          firstAddedAt: firstMovement?.date || sl.createdAt,
          lastAddedAt: lastMovement?.date || sl.updatedAt,
        };
      })
    );

    return enriched;
  }
}
