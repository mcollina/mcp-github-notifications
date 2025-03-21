/**
 * Tool implementation for getting a GitHub thread subscription status
 */
import { z } from "zod";
import { githubGet } from "../utils/api.js";
import { formatSubscription, formatError } from "../utils/formatters.js";
import { ThreadSubscription } from "../types/github-api.js";

/**
 * Schema for get-thread-subscription tool input parameters
 */
export const getThreadSubscriptionSchema = z.object({
  thread_id: z.string().describe("The ID of the notification thread to check subscription status")
});

/**
 * Tool implementation for getting a thread subscription
 */
export async function getThreadSubscriptionHandler(args: z.infer<typeof getThreadSubscriptionSchema>) {
  try {
    // Make request to GitHub API
    const subscription = await githubGet<ThreadSubscription>(`/notifications/threads/${args.thread_id}/subscription`);

    // Format the subscription for better readability
    const formattedSubscription = formatSubscription(subscription);

    return {
      content: [{
        type: "text",
        text: `Subscription status for thread ${args.thread_id}:\n\n${formattedSubscription}`
      }]
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      return {
        content: [{
          type: "text",
          text: `You are not subscribed to thread ${args.thread_id}.`
        }]
      };
    }
    
    return {
      isError: true,
      content: [{
        type: "text",
        text: formatError(`Failed to fetch subscription for thread ${args.thread_id}`, error)
      }]
    };
  }
}

/**
 * Register this tool with the server
 */
export function registerGetThreadSubscriptionTool(server: any) {
  server.tool(
    "get-thread-subscription",
    "Get subscription status for a GitHub notification thread",
    getThreadSubscriptionSchema.shape,
    getThreadSubscriptionHandler
  );
}
