import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import medicineRoutes from "./routes/medicine.routes";
import partyRoutes from "./routes/party.routes";
import purchaseRoutes from "./routes/purchase.routes";
import saleRoutes from "./routes/sale.routes";
import orderRoutes from "./routes/order.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// Health check -- Render isse verify karta hai ki server zinda hai
app.get("/health", (req, res) => res.json({ success: true, message: "Server chal raha hai" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/medicines", medicineRoutes);
app.use("/api/v1", partyRoutes); // /customers, /suppliers
app.use("/api/v1/purchases", purchaseRoutes);
app.use("/api/v1/sales", saleRoutes);
app.use("/api/v1/orders", orderRoutes);

// 404 -- koi galat URL hit kare to
app.use((req, res) => res.status(404).json({ success: false, message: "Route nahi mila" }));

// Sabse aakhir mein error handler
app.use(errorHandler);

export default app;
