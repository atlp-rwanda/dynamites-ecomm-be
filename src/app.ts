import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swaggerconfig';
import 'reflect-metadata';
import route from './router';
import fs from 'fs';
import path from 'path';

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let logStream = fs.createWriteStream(path.join(__dirname, 'output.log'), {
  flags: 'a',
});

morgan.token('type', function (req, res) {
  return req.headers['content-type'];
});

app.use(cors());
app.use(morgan('combined', { stream: logStream }));

// Route for the index page
app.get('/', (req: Request, res: Response) => {
  // Sends a welcome message to the client
  return res
    .status(200)
    .json({ message: 'Welcome To The Dynamites backend e-commerce' });
});

// Middleware to handle all endpoint routes
app.use(process.env.ALL as string, route);

// Endpoint for serving Swagger documentation
app.use(
  process.env.DOCS as string,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

export default app;
