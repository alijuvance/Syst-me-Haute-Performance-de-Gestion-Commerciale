"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockLevelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let StockLevelsService = class StockLevelsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(depotId) {
        const where = depotId ? { depotId } : {};
        const stockLevels = await this.prisma.stockLevel.findMany({
            where,
            include: {
                product: { include: { category: true } },
                depot: true,
            },
            orderBy: { updatedAt: 'desc' },
        });
        const enriched = await Promise.all(stockLevels.map(async (sl) => {
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
        }));
        return enriched;
    }
};
exports.StockLevelsService = StockLevelsService;
exports.StockLevelsService = StockLevelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StockLevelsService);
//# sourceMappingURL=stock-levels.service.js.map