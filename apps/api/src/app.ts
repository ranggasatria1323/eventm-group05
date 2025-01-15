import express, { Application, Express, json, NextFunction, Request, Response, urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv"
import AuthRouter from "./routers/auth.router";

dotenv.config()

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

export default class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.configure();
    this.routes()
    this.handleError()
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError():void{
    this.app.use((err:Error, req: Request, res:Response, next:NextFunction) =>{
        console.log("Error : ", err.stack)
        res.status(500).json({
          status: "error",
          message: err.message,
          data: null
        });
    })
  }

  private routes(): void {
    const authRouter = new AuthRouter();

    this.app.use("/api/auth", authRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`Application running on port: ${PORT}`);
    });
  }
}

