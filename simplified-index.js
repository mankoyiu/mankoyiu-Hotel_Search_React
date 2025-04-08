// simplified-index.js
import Koa from 'koa';
import logger from 'koa-logger';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = new Koa();
const router = new Router({ prefix: '/api/v1' });
const port = 10888;

// Add basic routes
router.get('/', (ctx) => {
  ctx.body = { message: 'API is running' };
});

router.get('/health', (ctx) => {
  ctx.body = { 
    status: 'UP',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
});

// Error handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error('Server error:', err);
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message || 'Internal Server Error'
    };
    ctx.app.emit('error', err, ctx);
  }
});

// Database connection
const initDb = async () => {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DATABASE_NAME;

  if (!uri || !dbName) {
    throw new Error('Missing required environment variables MONGODB_URI or DATABASE_NAME');
  }

  try {
    await mongoose.connect(uri, {
      dbName: dbName,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// Start the server
const startServer = async () => {
  try {
    // Initialize database
    await initDb();
    
    // Setup middleware
    app.use(bodyParser());
    app.use(json());
    app.use(logger());
    
    // Setup routes
    app.use(router.routes());
    
    // Start listening
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
    
    // Handle app errors
    app.on('error', (err) => {
      console.error('Application error:', err);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server
startServer(); 