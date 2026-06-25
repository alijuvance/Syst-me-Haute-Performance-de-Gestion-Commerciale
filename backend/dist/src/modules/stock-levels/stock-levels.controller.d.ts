import { StockLevelsService } from './stock-levels.service';
export declare class StockLevelsController {
    private readonly stockLevelsService;
    constructor(stockLevelsService: StockLevelsService);
    findAll(): Promise<any>;
}
