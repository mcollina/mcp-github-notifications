import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Octokit } from "@octokit/rest";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "GitHub Notifications",
  version: "1.0.0"
});

// Store authenticated Octokit instance
let octokit: Octokit | null = null;
let authToken = '';

/**
 * Helper function to ensure we have an authenticated Octokit instance
 */
function getAuthenticatedOctokit(): Octokit {
  if (!octokit) {
    throw new Error('GitHub API not authenticated. Please run set-github-token first.');
  }
  return octokit;
}

/**
 * Tool to set GitHub authentication token
 */
server.tool(
  "set-github-token",
  "Set the GitHub API token for authentication",
  {
    token: z.string().describe("GitHub personal access token")
  },
  async ({ token }) => {
    try {
      // Validate token by making a simple request
      const testOctokit = new Octokit({
        auth: token
      });
      
      // Test the token with a simple user request
      await testOctokit.users.getAuthenticated();
      
      // Store the token and authenticated client
      authToken = token;
      octokit = testOctokit;
      
      return {
        content: [{ 
          type: "text",
          text: "GitHub token successfully set and validated."
        }]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ 
          type: "text",
          text: `Error validating GitHub token: ${errorMessage}`
        }]
      };
    }
  }
);

/**
 * Tool to list unread notifications
 */
server.tool(
  "get-unread-notifications",
  "List unread GitHub notifications",
  {
    all: z.boolean().optional().describe("If true, show notifications from all repositories (default: false)"),
    participating: z.boolean().optional().describe("If true, only shows notifications in which the user is directly participating or mentioned"),
    since: z.string().optional().describe("Only show notifications updated after the given time (ISO 8601 format)"),
    before: z.string().optional().describe("Only show notifications updated before the given time (ISO 8601 format)"),
    perPage: z.number().optional().describe("Number of notifications to return per page (default: 30, max: 100)"),
    page: z.number().optional().describe("Page number of the results to fetch")
  },
  async ({ all, participating, since, before, perPage, page }) => {
    try {
      const client = getAuthenticatedOctokit();
      
      const response = await client.activity.listNotificationsForAuthenticatedUser({
        all: all,
        participating: participating,
        since: since,
        before: before,
        per_page: perPage,
        page: page
      });

      if (response.data.length === 0) {
        return {
          content: [{ 
            type: "text",
            text: "No unread notifications found."
          }]
        };
      }

      // Format notifications
      const formattedNotifications = response.data.map(notification => {
        return {
          id: notification.id,
          unread: notification.unread,
          reason: notification.reason,
          updated_at: notification.updated_at,
          last_read_at: notification.last_read_at,
          subject: {
            title: notification.subject.title,
            type: notification.subject.type,
            url: notification.subject.url
          },
          repository: notification.repository.full_name
        };
      });

      return {
        content: [{ 
          type: "text",
          text: JSON.stringify(formattedNotifications, null, 2)
        }]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ 
          type: "text",
          text: `Error fetching notifications: ${errorMessage}`
        }]
      };
    }
  }
);

/**
 * Tool to list notifications for a specific repository
 */
server.tool(
  "get-repository-notifications",
  "Get notifications for a specific GitHub repository",
  {
    owner: z.string().describe("The account owner of the repository"),
    repo: z.string().describe("The name of the repository"),
    all: z.boolean().optional().describe("If true, show notifications from all repositories (default: false)"),
    participating: z.boolean().optional().describe("If true, only shows notifications in which the user is directly participating or mentioned"),
    since: z.string().optional().describe("Only show notifications updated after the given time (ISO 8601 format)"),
    before: z.string().optional().describe("Only show notifications updated before the given time (ISO 8601 format)"),
    perPage: z.number().optional().describe("Number of notifications to return per page (default: 30, max: 100)"),
    page: z.number().optional().describe("Page number of the results to fetch")
  },
  async ({ owner, repo, all, participating, since, before, perPage, page }) => {
    try {
      const client = getAuthenticatedOctokit();
      
      const response = await client.activity.listNotificationsForRepo({
        owner,
        repo,
        all,
        participating,
        since,
        before,
        per_page: perPage,
        page
      });

      if (response.data.length === 0) {
        return {
          content: [{ 
            type: "text",
            text: `No notifications found for repository ${owner}/${repo}.`
          }]
        };
      }

      // Format notifications
      const formattedNotifications = response.data.map(notification => {
        return {
          id: notification.id,
          unread: notification.unread,
          reason: notification.reason,
          updated_at: notification.updated_at,
          last_read_at: notification.last_read_at,
          subject: {
            title: notification.subject.title,
            type: notification.subject.type,
            url: notification.subject.url
          }
        };
      });

      return {
        content: [{ 
          type: "text",
          text: JSON.stringify(formattedNotifications, null, 2)
        }]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ 
          type: "text",
          text: `Error fetching repository notifications: ${errorMessage}`
        }]
      };
    }
  }
);

/**
 * Tool to mark notification(s) as read
 */
server.tool(
  "mark-notification-read",
  "Mark a notification as read",
  {
    threadId: z.string().describe("The unique identifier of the notification thread")
  },
  async ({ threadId }) => {
    try {
      const client = getAuthenticatedOctokit();
      
      await client.activity.markThreadAsRead({
        thread_id: parseInt(threadId)
      });

      return {
        content: [{ 
          type: "text",
          text: `Notification ${threadId} marked as read.`
        }]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ 
          type: "text",
          text: `Error marking notification as read: ${errorMessage}`
        }]
      };
    }
  }
);

/**
 * Tool to mark all notifications as read
 */
server.tool(
  "mark-all-notifications-read",
  "Mark all notifications as read",
  {
    last_read_at: z.string().optional().describe("Timestamp (ISO 8601 format) marking when notifications were last read")
  },
  async ({ last_read_at }) => {
    try {
      const client = getAuthenticatedOctokit();
      
      await client.activity.markNotificationsAsRead({
        last_read_at: last_read_at
      });

      return {
        content: [{ 
          type: "text",
          text: "All notifications marked as read."
        }]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ 
          type: "text",
          text: `Error marking all notifications as read: ${errorMessage}`
        }]
      };
    }
  }
);

/**
 * Tool to mark all notifications from a repository as read
 */
server.tool(
  "mark-repository-notifications-read",
  "Mark all notifications for a repository as read",
  {
    owner: z.string().describe("The account owner of the repository"),
    repo: z.string().describe("The name of the repository"),
    last_read_at: z.string().optional().describe("Timestamp (ISO 8601 format) marking when notifications were last read")
  },
  async ({ owner, repo, last_read_at }) => {
    try {
      const client = getAuthenticatedOctokit();
      
      await client.activity.markRepoNotificationsAsRead({
        owner,
        repo,
        last_read_at
      });

      return {
        content: [{ 
          type: "text",
          text: `All notifications for ${owner}/${repo} marked as read.`
        }]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ 
          type: "text",
          text: `Error marking repository notifications as read: ${errorMessage}`
        }]
      };
    }
  }
);

/**
 * Tool to get a specific thread
 */
server.tool(
  "get-notification-thread",
  "Get a specific notification thread",
  {
    threadId: z.string().describe("The unique identifier of the notification thread")
  },
  async ({ threadId }) => {
    try {
      const client = getAuthenticatedOctokit();
      
      const response = await client.activity.getThread({
        thread_id: parseInt(threadId)
      });

      return {
        content: [{ 
          type: "text",
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ 
          type: "text",
          text: `Error fetching notification thread: ${errorMessage}`
        }]
      };
    }
  }
);

/**
 * Tool to get notification subscription status
 */
server.tool(
  "get-thread-subscription",
  "Get notification subscription status for a thread",
  {
    threadId: z.string().describe("The unique identifier of the notification thread")
  },
  async ({ threadId }) => {
    try {
      const client = getAuthenticatedOctokit();
      
      const response = await client.