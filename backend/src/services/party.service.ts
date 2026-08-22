import { prisma } from "../config/db";

export async function listCustomers() {
  return prisma.customer.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
}

export async function createCustomer(data: { name: string; phone?: string; customerType?: string; creditLimit?: number }) {
  return prisma.customer.create({ data });
}

export async function listSuppliers() {
  return prisma.supplier.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
}

export async function createSupplier(data: { name: string; phone?: string; address?: string }) {
  return prisma.supplier.create({ data });
}

// Kis customer pe kitna udhaar baaki hai
export async function customerOutstanding() {
  const sales = await prisma.sale.findMany({
    where: { status: { in: ["UNPAID", "PARTIAL"] } },
    include: { customer: true },
  });
  const map: Record<string, { name: string; balance: number }> = {};
  for (const s of sales) {
    const bal = Number(s.total) - Number(s.paid);
    if (!map[s.customerId]) map[s.customerId] = { name: s.customer.name, balance: 0 };
    map[s.customerId].balance += bal;
  }
  return Object.values(map).sort((a, b) => b.balance - a.balance);
}
