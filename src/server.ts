/**
 * GitHub Notifications MCP Server
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Import tool registrations
import { registerListNotificationsTool } from "./tools/list-notifications.js";
import { registerMarkNotificationsReadTool } from "./tools/mark-notifications-read.js";
import { registerGetThreadTool } from "./tools/get-thread.js";
import { registerMarkThreadReadTool } from "./tools/mark-thread-read.js";
import { registerMarkThreadDoneTool } from "./tools/mark-thread-done.js";
import { registerGetThreadSubscriptionTool } from "./tools/get-thread-subscription.js";
import { registerSetThreadSubscriptionTool } from "./tools/set-thread-subscription.js";
import { registerDeleteThreadSubscriptionTool } from "./tools/delete-thread-subscription.js";
import { registerListRepoNotificationsTool } from "./tools/list-repo-notifications.js";
import { registerMarkRepoNotificationsReadTool } from "./tools/mark-repo-notifications-read.js";

/**
 * Initialize and start the MCP server
 */
export async function startServer() {
  try {
    // Create MCP server
    const server = new McpServer({
      name: "github-notifications",
      version: "1.0.0"
    });
    
    console.error("Initializing GitHub Notifications MCP Server...");
    
    // Register all tools
    registerListNotificationsTool(server);
    registerMarkNotificationsReadTool(server);
    registerGetThreadTool(server);
    registerMarkThreadReadTool(server);
    registerMarkThreadDoneTool(server);
    registerGetThreadSubscriptionTool(server);
    registerSetThreadSubscriptionTool(server);
    registerDeleteThreadSubscriptionTool(server);
    registerListRepoNotificationsTool(server);
    registerMarkRepoNotificationsReadTool(server);
    
    console.error("All tools registered successfully.");
    
    // Connect using stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.error("GitHub Notifications MCP Server running on stdio transport.");
    console.error("Authentication: Using GITHUB_TOKEN environment variable.");
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}
