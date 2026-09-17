import { prisma } from "../config/db";
import { AppError } from "../middleware/errorHandler";
import { createSale } from "./sale.service";

interface OrderItemInput {
  medicineId: string;
  quantity: number;
}

// Retailer ke User account se uska Customer profile dhoondhta hai
export async function getCustomerByUserId(userId: string) {
  const customer = await prisma.customer.findUnique({ where: { userId } });
  if (!customer) {
    throw new AppError("Aapka retailer profile nahi mila, Admin se sampark karein", 404);
  }
  return customer;
}

// Retailer: naya order place karna (abhi stock nahi katta, sirf request jaati hai)
export async function createOrder(customerId: string, items: OrderItemInput[]) {
  if (items.length === 0) throw new AppError("Order khaali hai", 400);

  return prisma.order.create({
    data: {
      customerId,
      status: "PENDING",
      items: { create: items.map((i) => ({ medicineId: i.medicineId, quantity: i.quantity })) },
    },
    include: { items: { include: { medicine: true } }, customer: true },
  });
}

// Retailer: apne khud ke orders (Pending/Converted/Rejected sab)
export async function myOrders(customerId: string) {
  return prisma.order.findMany({
    where: { customerId },
    include: { items: { include: { medicine: true } }, sale: true },
    orderBy: { createdAt: "desc" },
  });
}

// Admin/Staff: sabhi pending orders (jo abhi tak bill ya reject nahi hue)
export async function listPendingOrders() {
  return prisma.order.findMany({
    where: { status: "PENDING" },
    include: { items: { include: { medicine: true } }, customer: true },
    orderBy: { createdAt: "asc" },
  });
}

// Admin/Staff: order ko dekh kar seedha bill (Sale) mein convert karna
export async function convertOrderToSale(orderId: string, createdById: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) throw new AppError("Order nahi mila", 404);
  if (order.status !== "PENDING") throw new AppError("Ye order pehle hi process ho chuka hai", 400);

  const sale = await createSale({
    customerId: order.customerId,
    items: order.items.map((i) => ({ medicineId: i.medicineId, quantity: i.quantity })),
    createdById,
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CONVERTED", saleId: sale.id },
  });

  return sale;
}

// Admin/Staff: order reject karna (stock kam ho, ya galat order ho to)
export async function rejectOrder(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError("Order nahi mila", 404);
  if (order.status !== "PENDING") throw new AppError("Ye order pehle hi process ho chuka hai", 400);

  return prisma.order.update({ where: { id: orderId }, data: { status: "REJECTED" } });
}
