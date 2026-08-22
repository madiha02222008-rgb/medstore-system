import { prisma } from "../config/db";
import { AppError } from "../middleware/errorHandler";

export async function listMedicines() {
  return prisma.medicine.findMany({
    where: { isActive: true },
    include: { batches: { orderBy: { expiryDate: "asc" } } },
    orderBy: { name: "asc" },
  });
}

export async function createMedicine(data: {
  name: string; category?: string; unit: string; mrp: number; rate: number; lowStockAt?: number;
}) {
  return prisma.medicine.create({ data });
}

export async function updateMedicine(id: string, data: Partial<{
  name: string; category: string; unit: string; mrp: number; rate: number; lowStockAt: number; isActive: boolean;
}>) {
  return prisma.medicine.update({ where: { id }, data });
}

// Naya batch add karna = stock badhana (purchase ke waqt use hota hai)
export async function addBatch(data: {
  medicineId: string; batchNumber: string; expiryDate?: string; purchaseRate: number; mrp: number; quantity: number;
}) {
  const medicine = await prisma.medicine.findUnique({ where: { id: data.medicineId } });
  if (!medicine) throw new AppError("Medicine nahi mili", 404);

  return prisma.$transaction(async (tx) => {
    const batch = await tx.batch.create({
      data: {
        medicineId: data.medicineId,
        batchNumber: data.batchNumber,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        purchaseRate: data.purchaseRate,
        mrp: data.mrp,
        quantity: data.quantity,
      },
    });
    await tx.stockMovement.create({
      data: { batchId: batch.id, change: data.quantity, reason: "PURCHASE" },
    });
    return batch;
  });
}

// FEFO: expiry ke hisaab se sabse pehle khatam hone wala batch nikalta hai
export async function getFefoBatches(medicineId: string) {
  return prisma.batch.findMany({
    where: { medicineId, quantity: { gt: 0 } },
    orderBy: { expiryDate: "asc" },
  });
}

export async function lowStockReport() {
  const medicines = await prisma.medicine.findMany({
    where: { isActive: true },
    include: { batches: true },
  });
  return medicines
    .map((m) => ({ ...m, totalStock: m.batches.reduce((s, b) => s + b.quantity, 0) }))
    .filter((m) => m.totalStock <= m.lowStockAt);
}
