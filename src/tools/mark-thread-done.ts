/**
 * Tool implementation for marking a GitHub notification thread as done
 */
import { z } from "zod";
import { githubDelete } from "../utils/api.js";
import { formatError } from "../utils/formatters.js";

/**
 * Schema for mark-thread-done tool input parameters
 */
export const markThreadDoneSchema = z.object({
  thread_id: z.string().describe("The ID of the notification thread to mark as done")
});

/**
 * Tool implementation for marking a GitHub notification thread as done
 */
export async function markThreadDoneHandler(args: z.infer<typeof markThreadDoneSchema>) {
  try {
    // Make request to GitHub API
    await githubDelete(`/notifications/threads/${args.thread_id}`);

    return {
      content: [{
        type: "text",
        text: `Successfully marked thread ${args.thread_id} as done.`
      }]
    };
  } catch (error) {
    return {
      isError: true,
      content: [{
        type: "text",
        text: formatError(`Failed to mark thread ${args.thread_id} as done`, error)
      }]
    };
  }
}

/**
 * Register this tool with the server
 */
export function registerMarkThreadDoneTool(server: any) {
  server.tool(
    "mark-thread-done",
    "Mark a GitHub notification thread as done",
    markThreadDoneSchema.shape,
    markThreadDoneHandler
  );
}
