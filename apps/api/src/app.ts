import express, { Application, Express, json, NextFunction, Request, Response, urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv"
import AuthRouter from "./routers/auth.router";
import eventRouter from "./routers/event.router"
import profileRouter from "./routers/profile.router"
import path from "path"

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
    this.app.use("/public", express.static(path.join(__dirname, "..", "public")))
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


    this.app.use("/", authRouter.getRouter());
    this.app.use("/", eventRouter)
    this.app.use("/", profileRouter)
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`Application running on port: ${PORT}`);
    });
  }
}

