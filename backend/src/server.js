import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";
import { env } from "./config/env.js";
import { routes } from "./routes/index.js";
import { errorHandler } from "./middleware/error.js";
import { registerSockets } from "./sockets/index.js";
import { startCleanupJob } from "./jobs/cleanup.js";
import path from "path";

const app = express();
const __dirname = path.resolve();

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Trust proxy for secure cookies (if using reverse proxy)
app.set("trust proxy", 1);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// API routes
app.use("/api", routes);

// Development utility endpoints
if (process.env.NODE_ENV === "development") {
  app.get("/api/dev/reset-competitions", async (req, res) => {
    try {
      const { prisma } = await import("./prisma.js");
      await prisma.competitionPlayer.deleteMany();
      await prisma.competition.deleteMany();
      res.json({ message: "All competitions reset" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/dev/seed-games", async (req, res) => {
    try {
      const { prisma } = await import("./prisma.js");
      const games = [
        { name: "Snake", minEntryFee: 100 },
        { name: "Tetris", minEntryFee: 150 },
        { name: "Pac-Man", minEntryFee: 200 },
        { name: "Space Invaders", minEntryFee: 100 },
        { name: "Breakout", minEntryFee: 100 },
      ];

      for (const game of games) {
        await prisma.game.upsert({
          where: { name: game.name },
          update: {},
          create: game,
        });
      }

      res.json({ message: "Games seeded successfully", games });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Catch-all route for SPA
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "NOT_FOUND",
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Register sockets
registerSockets(io);

// Make socket.io accessible to controllers
app.set("io", io);
app.set("userSockets", io.userSockets);

// Graceful shutdown
const shutdown = async () => {
  console.log("Shutting down gracefully...");

  server.close(() => console.log("HTTP server closed"));
  io.close(() => console.log("Socket.io closed"));

  try {
    const { prisma } = await import("./prisma.js");
    await prisma.$disconnect();
    console.log("Database disconnected");
  } catch (error) {
    console.error("Error closing database connection:", error);
  }

  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    const { prisma } = await import("./prisma.js");
    await prisma.$connect();
    console.log("Database connected successfully");

    server.listen(env.port, () => {
      console.log(`🚀 Server running on http://localhost:${env.port}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);

      startCleanupJob(io);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
