import { prisma } from "../config/db";
import { AppError } from "../middleware/errorHandler";

interface PurchaseItemInput {
  medicineId: string;
  batchNumber: string;
  expiryDate?: string;
  quantity: number;
  rate: number;
  mrp: number;
}

// Ek purchase mein: naya batch banta hai, stock badhta hai, aur purchase record
// -- sab EK SAATH (transaction) hota hai. Agar beech mein kuch fail ho to sab wapas ho jata hai.
export async function createPurchase(data: {
  supplierId: string; invoiceNo?: string; items: PurchaseItemInput[]; createdById: string;
}) {
  if (data.items.length === 0) throw new AppError("Kam se kam ek item chahiye", 400);
  const total = data.items.reduce((s, it) => s + it.quantity * it.rate, 0);

  return prisma.$transaction(async (tx) => {
    const purchase = await tx.purchase.create({
      data: {
        supplierId: data.supplierId,
        invoiceNo: data.invoiceNo,
        total,
        createdById: data.createdById,
        status: "RECEIVED",
      },
    });

    for (const item of data.items) {
      const batch = await tx.batch.create({
        data: {
          medicineId: item.medicineId,
          batchNumber: item.batchNumber,
          expiryDate: item.expiryDate ? new Date(item.expiryDate) : null,
          purchaseRate: item.rate,
          mrp: item.mrp,
          quantity: item.quantity,
        },
      });
      await tx.purchaseItem.create({
        data: {
          purchaseId: purchase.id,
          medicineId: item.medicineId,
          batchId: batch.id,
          quantity: item.quantity,
          rate: item.rate,
        },
      });
      await tx.stockMovement.create({
        data: { batchId: batch.id, change: item.quantity, reason: "PURCHASE", refId: purchase.id },
      });
    }

    return tx.purchase.findUnique({ where: { id: purchase.id }, include: { items: true, supplier: true } });
  });
}

export async function listPurchases() {
  return prisma.purchase.findMany({
    include: { supplier: true, items: true },
    orderBy: { createdAt: "desc" },
  });
}
