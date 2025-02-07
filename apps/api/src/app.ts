import express, {
  Application,
  Express,
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import AuthRouter from './routers/auth.router';
import eventRouter from './routers/event.router';
import profileRouter from './routers/profile.router';
import discountRouter from './routers/discount.router';
import reviewRouter from './routers/review.router';
import transactionRouter from './routers/transaction.router';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

export default class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(express.static('public'));
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.log('Error : ', err.stack);
        res.status(500).json({
          status: 'error',
          message: err.message,
          data: null,
        });
      },
    );
  }

  private routes(): void {
    const authRouter = new AuthRouter();

    this.app.use('/', authRouter.getRouter());
    this.app.use('/', eventRouter);
    this.app.use('/', profileRouter);
    this.app.use('/', discountRouter);
    this.app.use('/', reviewRouter);
    this.app.use('/', transactionRouter);
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`Application running on port: ${PORT}`);
    });
  }
}
