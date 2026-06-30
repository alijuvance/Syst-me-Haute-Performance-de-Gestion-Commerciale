import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getKPIs() {
    // 1. Chiffre d'Affaires total (Toutes les ventes payées ou partielles)
    const sales = await this.prisma.invoice.findMany({
      where: { status: { in: ['PAID', 'PARTIAL'] } }
    });
    const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);

    // 2. Créances (Ce que les clients nous doivent : Total - amountPaid)
    const debtsFromCustomers = await this.prisma.invoice.findMany({
      where: { status: { in: ['PARTIAL', 'PENDING'] } }
    });
    const totalReceivables = debtsFromCustomers.reduce((acc, s) => acc + (s.totalAmount - s.amountPaid), 0);

    // 3. Marge Commerciale
    const invoiceLines = await this.prisma.invoiceLine.findMany({
      include: { product: true, invoice: true }
    });
    
    let totalCogs = 0;
    invoiceLines.forEach(line => {
      if (line.invoice.status !== 'CANCELLED' && line.invoice.status !== 'DRAFT') {
        totalCogs += line.quantity * line.product.costPrice;
      }
    });

    const commercialMargin = totalRevenue - totalCogs;

    return {
      totalRevenue,
      totalReceivables,
      commercialMargin,
      totalCogs
    };
  }

  async getSalesChart() {
    const invoices = await this.prisma.invoice.findMany({
      where: { status: { in: ['PAID', 'PARTIAL'] } },
      orderBy: { date: 'asc' }
    });

    const chartData: any = {};
    invoices.forEach(inv => {
      const date = inv.date.toISOString().split('T')[0];
      if (!chartData[date]) chartData[date] = 0;
      chartData[date] += inv.totalAmount;
    });

    return Object.keys(chartData).map(date => ({
      date,
      amount: chartData[date]
    }));
  }

  async getDebts() {
    return this.prisma.invoice.findMany({
      where: { status: { in: ['PARTIAL', 'PENDING'] } },
      include: { customer: true }
    });
  }

  async getFinanceKPIs() {
    // 1. Total Cash (Trésorerie Actuelle = Total Ventes encaissées - Total Achats décaissés)
    const sales = await this.prisma.invoice.findMany();
    const totalSalesPaid = sales.reduce((acc, s) => acc + s.amountPaid, 0);

    const purchases = await this.prisma.purchaseOrder.findMany();
    const totalPurchasesPaid = purchases.reduce((acc, p) => acc + p.amountPaid, 0);

    const netCash = totalSalesPaid - totalPurchasesPaid;

    // 2. Créances Clients (Total facturé - Total encaissé)
    const totalReceivables = sales.reduce((acc, s) => acc + (s.totalAmount - s.amountPaid), 0);

    // 3. Dettes Fournisseurs (Total commandé - Total décaissé)
    const totalPayables = purchases.reduce((acc, p) => acc + (p.totalAmount - p.amountPaid), 0);

    // 4. Marge (même calcul qu'avant)
    const invoiceLines = await this.prisma.invoiceLine.findMany({
      include: { product: true, invoice: true }
    });
    
    let totalRevenue = 0;
    let totalCogs = 0;
    invoiceLines.forEach(line => {
      if (line.invoice.status !== 'CANCELLED' && line.invoice.status !== 'DRAFT') {
        totalRevenue += line.quantity * line.unitPrice;
        totalCogs += line.quantity * line.product.costPrice;
      }
    });

    return {
      netCash,
      totalReceivables,
      totalPayables,
      commercialMargin: totalRevenue - totalCogs
    };
  }

  async getCashflowChart() {
    const invoices = await this.prisma.invoice.findMany({
      where: { status: { notIn: ['CANCELLED', 'DRAFT'] } }
    });
    const purchases = await this.prisma.purchaseOrder.findMany({
      where: { status: { notIn: ['CANCELLED', 'DRAFT'] } }
    });

    const chartMap: Record<string, { inflows: number; outflows: number }> = {};

    invoices.forEach(inv => {
      const date = inv.date.toISOString().split('T')[0];
      if (!chartMap[date]) chartMap[date] = { inflows: 0, outflows: 0 };
      chartMap[date].inflows += inv.amountPaid; // Assuming amountPaid is recorded at invoice date for simplicity
    });

    purchases.forEach(p => {
      const date = p.date.toISOString().split('T')[0];
      if (!chartMap[date]) chartMap[date] = { inflows: 0, outflows: 0 };
      chartMap[date].outflows += p.amountPaid;
    });

    return Object.keys(chartMap).sort().map(date => ({
      date,
      inflows: chartMap[date].inflows,
      outflows: chartMap[date].outflows
    }));
  }

  async getPayables() {
    const purchases = await this.prisma.purchaseOrder.findMany({
      include: { supplier: true }
    });
    
    // Filtre sur ceux qui ont un reste à payer
    return purchases.filter(p => (p.totalAmount - p.amountPaid) > 0);
  }
}
