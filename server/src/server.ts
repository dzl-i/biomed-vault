// Server imports
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import errorHandler from 'middleware-http-errors';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import { Server } from 'http';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Database client
// const prisma = new PrismaClient()

// Set up web app using JSON
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
const httpServer = new Server(app);


// Use middleware that allows for access from other domains
app.use(cors({
  origin: ["http://localhost:3000", "https://bebetter.denzeliskandar.com"],
  credentials: true
}));


const PORT: number = parseInt(process.env.PORT || '3030');
const isProduction: boolean = process.env.NODE_ENV === "production";


///////////////////////// ROUTES /////////////////////////


// HEALTH CHECK ROUTE
app.get('/', (req: Request, res: Response) => {
  console.log("Health check")
  return res.status(200).json({
    message: "Server is up!"
  });
});



///////////////////////// SERVER /////////////////////////


// Logging errors
app.use(morgan('dev'));

app.use(errorHandler());

// Start server
const server = httpServer.listen(PORT, () => {
  console.log(`⚡️ Server listening on port ${PORT}`);
});

// For coverage, handle Ctrl+C
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server.'));
});
