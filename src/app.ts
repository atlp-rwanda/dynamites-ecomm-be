import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swaggerconfig';
import 'reflect-metadata';
import router from './routes/index';
import fs from 'fs';
import path from 'path';
import authRoutes from './routes/auth-routes';
import cookieSession from 'cookie-session';
import passport from 'passport';
import userRouter from './routes/userRoutes';
import searchRoutes from './routes/searchRoutes';
import chatRoutes from './routes/chatbotRoutes';
import serviceRoutes from './routes/serviceRoutes';
// Require Passport midleware
import './middlewares/passport-setup';

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const logStream = fs.createWriteStream(path.join(__dirname, 'output.log'), {
  flags: 'a',
});

//Data Sanitation Against SQL injection

morgan.token('type', function (req: Request) {
  return req.headers['content-type'];
});

app.use(cors());
app.use(morgan('combined', { stream: logStream }));

// set up view engine
app.set('view engine', 'ejs');

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIES_KEY || ''],
  })
);

// register regenerate & save after the cookieSession middleware initialization
interface CallbackFunction {
  (err?: string): void;
}
app.use(function (request: Request, response: Response, next: NextFunction) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb: CallbackFunction) => {
      cb();
    };
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb: CallbackFunction) => {
      cb();
    };
  }
  next();
});

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req: Request, res: Response) => {
  res.render('login');
});

// Route for the index page
app.get('/', (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ message: 'Welcome To The Dynamites backend e-commerce' });
});

// Middleware to handle all endpoint routes
app.use('/api/v1', router);
app.use('/api/v1', userRouter);
app.use('/api/v1', searchRoutes);
app.use('/api/v1', chatRoutes);
app.use('/api/v1', serviceRoutes);
// Endpoints for serving social login
app.use('/auth', authRoutes);

// Endpoint for serving Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
