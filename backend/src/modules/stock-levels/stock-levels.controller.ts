import { Controller, Get, UseGuards } from '@nestjs/common';
import { StockLevelsService } from './stock-levels.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('stock-levels')
@UseGuards(JwtAuthGuard)
export class StockLevelsController {
  constructor(private readonly stockLevelsService: StockLevelsService) {}

  @Get()
  findAll() {
    return this.stockLevelsService.findAll();
  }
}
