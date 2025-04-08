// basic-server.ts
import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = new Koa();
const router = new Router();
const port = 10889; // Use a different port

// Simple route
router.get('/', (ctx) => {
  ctx.body = { message: 'Basic server is running' };
});

// Error handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err: any) {
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || 'Internal Server Error'
    };
    console.error('Error:', err);
  }
});

// Connect to database
async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI not found in environment variables');
  }
  
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Start server
async function start() {
  try {
    await connectDB();
    
    app.use(logger());
    app.use(router.routes());
    
    app.listen(port, () => {
      console.log(`Basic server running on port ${port}`);
    });
  } catch (error) {
    console.error('Server start error:', error);
    process.exit(1);
  }
}

// Global error handlers
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
start(); 