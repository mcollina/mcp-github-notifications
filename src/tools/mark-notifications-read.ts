/**
 * Tool implementation for marking GitHub notifications as read
 */
import { z } from "zod";
import { githubPut } from "../utils/api.js";
import { formatError } from "../utils/formatters.js";
import { MarkNotificationsReadResponse } from "../types/github-api.js";

/**
 * Schema for mark-notifications-read tool input parameters
 */
export const markNotificationsReadSchema = z.object({
  last_read_at: z.string().optional().describe(
    "ISO 8601 timestamp - marks notifications updated at or before this time as read. Default is current time."
  ),
  read: z.boolean().optional().default(true).describe(
    "Whether to mark notifications as read or unread"
  )
});

/**
 * Tool implementation for marking GitHub notifications as read
 */
export async function markNotificationsReadHandler(args: z.infer<typeof markNotificationsReadSchema>) {
  try {
    // Prepare request body
    const requestBody = {
      last_read_at: args.last_read_at,
      read: args.read
    };

    // Make request to GitHub API
    const response = await githubPut<MarkNotificationsReadResponse>("/notifications", requestBody);

    // Check if notifications are processed asynchronously
    if (response.message) {
      return {
        content: [{
          type: "text",
          text: `${response.message}`
        }]
      };
    }

    // Default success message
    return {
      content: [{
        type: "text",
        text: `Successfully marked notifications as ${args.read ? 'read' : 'unread'}.${
          args.last_read_at 
            ? ` Notifications updated on or before ${new Date(args.last_read_at).toLocaleString()} were affected.` 
            : ''
        }`
      }]
    };
  } catch (error) {
    return {
      isError: true,
      content: [{
        type: "text",
        text: formatError("Failed to mark notifications as read", error)
      }]
    };
  }
}

/**
 * Register this tool with the server
 */
export function registerMarkNotificationsReadTool(server: any) {
  server.tool(
    "mark-notifications-read",
    "Mark GitHub notifications as read",
    markNotificationsReadSchema.shape,
    markNotificationsReadHandler
  );
}
