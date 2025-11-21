import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import process = require('process');
import connectDB from './config/database';
import cookieParser from 'cookie-parser';
import admin from 'firebase-admin';
import route from './routes';
import { initializeSocket } from './utils/socket';
const app = express();
const http=require("http")

// Middleware
app.use(cookieParser());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});
// ✅ 1. Define allowed origins
const allowedOrigins = [
  process.env.FrontEnd_BaseUrl,
  process.env.FrontEnd_PRODBaseUrl,
  "http://localhost:4200", // optional for local Angular dev
].filter(Boolean); // remove undefined values

// ✅ 2. Use CORS before routes
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`❌ Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);
app.use('/api', route);

const PORT = process.env.PORT || 3000;

const server=http.createServer(app);
initializeSocket(server)
connectDB()
    .then(() => {
        console.log("✅ Connected to DB");
        server.listen(process.env.PORT, () => {
            console.log("🚀 Server started");
        });
    })
    .catch((err: any) => {
        console.error("❌ DB connection failed:", err);
});





// function initializeApp(firebaseConfig: { apiKey: string; authDomain: string; projectId: string; storageBucket: string; messagingSenderId: string; appId: string; measurementId: string; }) {
//     throw new Error('Function not implemented.');
// }

