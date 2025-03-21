/**
 * Tool implementation for setting a GitHub thread subscription
 */
import { z } from "zod";
import { githubPut } from "../utils/api.js";
import { formatSubscription, formatError } from "../utils/formatters.js";
import { ThreadSubscription } from "../types/github-api.js";

/**
 * Schema for set-thread-subscription tool input parameters
 */
export const setThreadSubscriptionSchema = z.object({
  thread_id: z.string().describe("The ID of the notification thread to subscribe to"),
  ignored: z.boolean().optional().default(false).describe("If true, notifications will be ignored")
});

/**
 * Tool implementation for setting a thread subscription
 */
export async function setThreadSubscriptionHandler(args: z.infer<typeof setThreadSubscriptionSchema>) {
  try {
    // Prepare request body
    const requestBody = {
      ignored: args.ignored
    };

    // Make request to GitHub API
    const subscription = await githubPut<ThreadSubscription>(
      `/notifications/threads/${args.thread_id}/subscription`, 
      requestBody
    );

    // Format the subscription for better readability
    const formattedSubscription = formatSubscription(subscription);
    const status = args.ignored ? "ignoring" : "subscribing to";

    return {
      content: [{
        type: "text",
        text: `Successfully updated subscription by ${status} thread ${args.thread_id}:\n\n${formattedSubscription}`
      }]
    };
  } catch (error) {
    return {
      isError: true,
      content: [{
        type: "text",
        text: formatError(`Failed to update subscription for thread ${args.thread_id}`, error)
      }]
    };
  }
}

/**
 * Register this tool with the server
 */
export function registerSetThreadSubscriptionTool(server: any) {
  server.tool(
    "set-thread-subscription",
    "Subscribe to a GitHub notification thread",
    setThreadSubscriptionSchema.shape,
    setThreadSubscriptionHandler
  );
}
