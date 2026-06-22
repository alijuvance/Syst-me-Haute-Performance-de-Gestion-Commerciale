import { Module } from '@nestjs/common';
import { DepotsController } from './depots.controller';
import { DepotsService } from './depots.service';
import { PrismaModule } from '../../core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DepotsController],
  providers: [DepotsService],
  exports: [DepotsService],
})
export class DepotsModule {}
