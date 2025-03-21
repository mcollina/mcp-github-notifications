/**
 * Tool implementation for listing GitHub notifications
 */
import { z } from "zod";
import { githubGet } from "../utils/api.js";
import { formatNotification, formatError } from "../utils/formatters.js";
import { NotificationResponse } from "../types/github-api.js";

/**
 * Schema for list-notifications tool input parameters
 */
export const listNotificationsSchema = z.object({
  all: z.boolean().optional().describe("If true, show notifications marked as read"),
  participating: z.boolean().optional().describe("If true, only shows notifications where user is directly participating"),
  since: z.string().optional().describe("ISO 8601 timestamp - only show notifications updated after this time"),
  before: z.string().optional().describe("ISO 8601 timestamp - only show notifications updated before this time"),
  page: z.number().optional().describe("Page number for pagination"),
  per_page: z.number().optional().max(100).describe("Number of results per page (max 100)")
});

/**
 * Tool implementation for listing GitHub notifications
 */
export async function listNotificationsHandler(args: z.infer<typeof listNotificationsSchema>) {
  try {
    // Make request to GitHub API
    const notifications = await githubGet<NotificationResponse[]>("/notifications", {
      params: {
        all: args.all,
        participating: args.participating,
        since: args.since,
        before: args.before,
        page: args.page || 1,
        per_page: args.per_page || 50,
      }
    });

    // If no notifications, return simple message
    if (notifications.length === 0) {
      return {
        content: [{
          type: "text",
          text: "No notifications found with the given criteria."
        }]
      };
    }

    // Format the notifications for better readability
    const formattedNotifications = notifications.map(formatNotification).join("\n\n");
    
    // Check for pagination - simplified approach without headers
    let paginationInfo = "";
    
    if (notifications.length === (args.per_page || 50)) {
      paginationInfo = "\n\nMore notifications may be available. You can view the next page by specifying 'page: " + 
        ((args.page || 1) + 1) + "' in the request.";
    }

    return {
      content: [{
        type: "text",
        text: `${notifications.length} notifications found:

${formattedNotifications}${paginationInfo}`
      }]
    };
  } catch (error) {
    return {
      isError: true,
      content: [{
        type: "text",
        text: formatError("Failed to fetch notifications", error)
      }]
    };
  }
}

/**
 * Register this tool with the server
 */
export function registerListNotificationsTool(server: any) {
  server.tool(
    "list-notifications",
    "List GitHub notifications for the authenticated user",
    listNotificationsSchema.shape,
    listNotificationsHandler
  );
}
