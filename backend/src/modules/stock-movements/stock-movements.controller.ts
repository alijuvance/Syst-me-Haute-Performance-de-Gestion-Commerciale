import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('stock-movements')
@UseGuards(JwtAuthGuard)
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Post()
  registerMovement(@Body() dto: CreateStockMovementDto, @Request() req) {
    return this.stockMovementsService.registerMovement(dto, req.user.id);
  }
}
