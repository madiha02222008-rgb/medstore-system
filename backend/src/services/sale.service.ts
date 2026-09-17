import { prisma } from "../config/db";
import { AppError } from "../middleware/errorHandler";

interface SaleItemInput {
  medicineId: string;
  quantity: number;
}

// Sale banate waqt: stock check hota hai (expired/khaali batch nahi bikta),
// FEFO order mein batch se stock katta hai, aur sab kuch ek transaction mein hota hai
export async function createSale(data: { customerId: string; items: SaleItemInput[]; createdById: string }) {
  if (data.items.length === 0) throw new AppError("Cart khaali hai", 400);

  return prisma.$transaction(async (tx) => {
    const saleItemsToCreate: { medicineId: string; batchId: string; quantity: number; rate: number }[] = [];
    let total = 0;

    for (const item of data.items) {
      let remaining = item.quantity;
      const today = new Date();

      // Sirf non-expired batches, sabse pehle expire hone wale se pehle nikalte hain (FEFO)
      const batches = await tx.batch.findMany({
        where: {
          medicineId: item.medicineId,
          quantity: { gt: 0 },
          OR: [{ expiryDate: null }, { expiryDate: { gt: today } }],
        },
        orderBy: { expiryDate: "asc" },
      });

      const totalAvailable = batches.reduce((s, b) => s + b.quantity, 0);
      if (totalAvailable < item.quantity) {
        const medicine = await tx.medicine.findUnique({ where: { id: item.medicineId } });
        throw new AppError(`${medicine?.name || "Medicine"} ka stock kam hai (sirf ${totalAvailable} available)`, 400);
      }

      for (const batch of batches) {
        if (remaining <= 0) break;
        const take = Math.min(batch.quantity, remaining);

        await tx.batch.update({ where: { id: batch.id }, data: { quantity: { decrement: take } } });
        await tx.stockMovement.create({
          data: { batchId: batch.id, change: -take, reason: "SALE" },
        });

        saleItemsToCreate.push({ medicineId: item.medicineId, batchId: batch.id, quantity: take, rate: Number(batch.mrp) });
        total += take * Number(batch.mrp);
        remaining -= take;
      }
    }

    const sale = await tx.sale.create({
      data: {
        customerId: data.customerId,
        createdById: data.createdById,
        total,
        status: "UNPAID",
        items: { create: saleItemsToCreate },
      },
      include: { items: true, customer: true },
    });

    return sale;
  });
}

export async function listSales() {
  return prisma.sale.findMany({
    include: { customer: true, items: true, payments: true },
    orderBy: { createdAt: "desc" },
  });
}

// Ledger: sabhi payments ka poora record (kis bill par, kitna, kab)
export async function listAllPayments() {
  return prisma.payment.findMany({
    include: { sale: { include: { customer: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function recordPayment(saleId: string, amount: number, mode: string) {
  return prisma.$transaction(async (tx) => {
    const sale = await tx.sale.findUnique({ where: { id: saleId } });
    if (!sale) throw new AppError("Bill nahi mila", 404);

    const newPaid = Number(sale.paid) + amount;
    const status = newPaid >= Number(sale.total) ? "PAID" : newPaid > 0 ? "PARTIAL" : "UNPAID";

    await tx.payment.create({ data: { saleId, amount, mode } });
    return tx.sale.update({ where: { id: saleId }, data: { paid: newPaid, status } });
  });
}
