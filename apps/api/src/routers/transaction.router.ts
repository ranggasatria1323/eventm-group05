import express from 'express';
import TransactionController from '../controllers/transaction.controller';
import {
  authMiddleware,
  verifyCustomer,
  verifyEventOrganizer,
} from '../middlewares/auth.middleware'; // Middleware untuk membatasi akses hanya customer

const router = express.Router();
const transactionController = new TransactionController();

router.post(
  '/transactions',
  verifyCustomer,
  transactionController.createTransaction,
);
router.get('/transactions',authMiddleware, transactionController.getTransactionStatsByEO);

router.get('/transactions/all', transactionController.getAllTransactions);

export default router;
