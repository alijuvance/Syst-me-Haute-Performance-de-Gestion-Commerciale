import { Module } from '@nestjs/common';
import { StockLevelsController } from './stock-levels.controller';
import { StockLevelsService } from './stock-levels.service';
import { PrismaModule } from '../../core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StockLevelsController],
  providers: [StockLevelsService]
})
export class StockLevelsModule {}
