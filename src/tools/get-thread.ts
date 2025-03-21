/**
 * Tool implementation for getting a GitHub notification thread
 */
import { z } from "zod";
import { githubGet } from "../utils/api.js";
import { formatNotification, formatError } from "../utils/formatters.js";
import { NotificationResponse } from "../types/github-api.js";

/**
 * Schema for get-thread tool input parameters
 */
export const getThreadSchema = z.object({
  thread_id: z.string().describe("The ID of the notification thread to retrieve")
});

/**
 * Tool implementation for getting a GitHub notification thread
 */
export async function getThreadHandler(args: z.infer<typeof getThreadSchema>) {
  try {
    // Make request to GitHub API
    const thread = await githubGet<NotificationResponse>(`/notifications/threads/${args.thread_id}`);

    // Format the thread for better readability
    const formattedThread = formatNotification(thread);

    return {
      content: [{
        type: "text",
        text: `Thread details:\n\n${formattedThread}`
      }]
    };
  } catch (error) {
    return {
      isError: true,
      content: [{
        type: "text",
        text: formatError(`Failed to fetch thread ${args.thread_id}`, error)
      }]
    };
  }
}

/**
 * Register this tool with the server
 */
export function registerGetThreadTool(server: any) {
  server.tool(
    "get-thread",
    "Get information about a GitHub notification thread",
    getThreadSchema.shape,
    getThreadHandler
  );
}
