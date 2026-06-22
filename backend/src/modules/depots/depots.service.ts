import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class DepotsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.depot.findMany();
  }

  async create(data: { name: string; location?: string; type: string }) {
    return this.prisma.depot.create({ data });
  }
}
