import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from "./docs/swaggerconfig";

const app: Application = express();

app.use(cors());
app.use(morgan("dev"));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get("/", (req: Request, res: Response) => {
  return res.json({ message: "Welcome To The Dynamites backend e-commerce" });
});

const PORT: number = 3000;
app.listen(PORT, () => {
  console.log(`The App is running on ${PORT}`)
});