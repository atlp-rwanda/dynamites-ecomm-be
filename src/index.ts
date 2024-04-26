import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from "./docs/swaggerconfig";
import "reflect-metadata";
import { connect } from './database';
import route from './router';
import fs from "fs"
import path from "path"

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(process.env.ALL as string, route);
app.use(process.env.DOCS as string, swaggerUi.serve, swaggerUi.setup(swaggerSpec));


let logStream = fs.createWriteStream(path.join(__dirname,'output.log'), {
  flags: 'a'
})

morgan.token('type', function (req,res){
return req.headers['content-type']
})

app.use(cors());
app.use(morgan("combined",{ stream: logStream}));

 
app.use('/api/v1', route);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req: Request, res: Response) =>
  res.json({ message: 'Welcome To The Dynamites backend e-commerce' })
);

const PORT = process.env.APP_PORT;
(async () => {
  await connect();

  app.listen(PORT, () => console.log(`App is up and listening to ${PORT}`));
})();
