/**
 * Entry point for GitHub Notifications MCP Server
 */
import * as dotenv from 'dotenv';
import { startServer } from './server.js';

// Load environment variables from .env file
dotenv.config();

// Verify required environment variables
if (!process.env.GITHUB_TOKEN) {
  console.error("Error: GITHUB_TOKEN environment variable is required");
  console.error("Please create a GitHub Personal Access Token with 'notifications' or 'repo' scope");
  console.error("and set it in the environment or .env file");
  process.exit(1);
}

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer().catch(error => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
