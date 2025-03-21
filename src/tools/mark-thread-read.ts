/**
 * Tool implementation for marking a GitHub notification thread as read
 */
import { z } from "zod";
import { githubPatch } from "../utils/api.js";
import { formatError } from "../utils/formatters.js";

/**
 * Schema for mark-thread-read tool input parameters
 */
export const markThreadReadSchema = z.object({
  thread_id: z.string().describe("The ID of the notification thread to mark as read")
});

/**
 * Tool implementation for marking a GitHub notification thread as read
 */
export async function markThreadReadHandler(args: z.infer<typeof markThreadReadSchema>) {
  try {
    // Make request to GitHub API
    await githubPatch(`/notifications/threads/${args.thread_id}`);

    return {
      content: [{
        type: "text",
        text: `Successfully marked thread ${args.thread_id} as read.`
      }]
    };
  } catch (error) {
    return {
      isError: true,
      content: [{
        type: "text",
        text: formatError(`Failed to mark thread ${args.thread_id} as read`, error)
      }]
    };
  }
}

/**
 * Register this tool with the server
 */
export function registerMarkThreadReadTool(server: any) {
  server.tool(
    "mark-thread-read",
    "Mark a GitHub notification thread as read",
    markThreadReadSchema.shape,
    markThreadReadHandler
  );
}
