import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from "./docs/swaggerconfig";
import "reflect-metadata";
import { connect } from './database';
import route from './router';

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("dev"));
app.use('/api/v1', route);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req: Request, res: Response) =>
  res.json({ message: 'Welcome To The Dynamites backend e-commerce' })
);

const PORT: number = 3000;
(async () => {
  await connect();

  app.listen(PORT, () => console.log(`App is up and listening to ${PORT}`));
})();
