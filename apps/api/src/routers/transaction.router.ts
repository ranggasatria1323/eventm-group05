import express from "express";
import TransactionController from "../controllers/transaction.controller";
import { verifyCustomer } from "../middlewares/auth.middleware"; // Middleware untuk membatasi akses hanya customer

const router = express.Router();
const transactionController = new TransactionController();

router.post("/transactions", verifyCustomer, transactionController.createTransaction);

export default router;
