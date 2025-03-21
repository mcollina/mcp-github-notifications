/**
 * Tool implementation for deleting a GitHub thread subscription
 */
import { z } from "zod";
import { githubDelete } from "../utils/api.js";
import { formatError } from "../utils/formatters.js";

/**
 * Schema for delete-thread-subscription tool input parameters
 */
export const deleteThreadSubscriptionSchema = z.object({
  thread_id: z.string().describe("The ID of the notification thread to unsubscribe from")
});

/**
 * Tool implementation for deleting a thread subscription
 */
export async function deleteThreadSubscriptionHandler(args: z.infer<typeof deleteThreadSubscriptionSchema>) {
  try {
    // Make request to GitHub API
    await githubDelete(`/notifications/threads/${args.thread_id}/subscription`);

    return {
      content: [{
        type: "text",
        text: `Successfully unsubscribed from thread ${args.thread_id}.`
      }]
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      return {
        content: [{
          type: "text",
          text: `You were not subscribed to thread ${args.thread_id}.`
        }]
      };
    }
    
    return {
      isError: true,
      content: [{
        type: "text",
        text: formatError(`Failed to unsubscribe from thread ${args.thread_id}`, error)
      }]
    };
  }
}

/**
 * Register this tool with the server
 */
export function registerDeleteThreadSubscriptionTool(server: any) {
  server.tool(
    "delete-thread-subscription",
    "Unsubscribe from a GitHub notification thread",
    deleteThreadSubscriptionSchema.shape,
    deleteThreadSubscriptionHandler
  );
}
