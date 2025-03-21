# GitHub Notifications MCP Server Implementation Plan

This document outlines the implementation plan for an MCP server that exposes the GitHub Notifications API endpoints as tools. The server will allow users to manage their GitHub notifications through Claude or other MCP-compatible clients.

## 1. Overview

The GitHub Notifications MCP server will be implemented using TypeScript with the Model Context Protocol (MCP) SDK. It will allow users to:

- List and manage their GitHub notifications
- Mark notifications as read or done
- Subscribe/unsubscribe from notification threads
- Work with repository-specific notifications

## 2. Prerequisites

- Node.js and npm
- TypeScript
- GitHub Personal Access Token (classic) with `notifications` or `repo` scope
- MCP SDK (`@modelcontextprotocol/sdk`)

## 3. Project Structure

```
github-notifications-server/
├── src/
│   ├── index.ts                 # Main entry point
│   ├── server.ts                # MCP server configuration
│   ├── tools/                   # Tool implementations
│   │   ├── list-notifications.ts
│   │   ├── mark-as-read.ts
│   │   ├── thread-management.ts
│   │   ├── thread-subscriptions.ts
│   │   └── repo-notifications.ts
│   ├── types/                   # Type definitions
│   │   ├── github-api.ts        # GitHub API response types
│   │   └── tools.ts             # Tool input/output types
│   └── utils/                   # Utility functions
│       ├── api.ts               # GitHub API client
│       └── validation.ts        # Input validation
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # Documentation
```

## 4. API Endpoints & Corresponding Tools

Based on the GitHub Notifications API, the following tools will be implemented:

### 4.1. User Notifications Tools

| Tool Name | GitHub API Endpoint | Description |
|-----------|---------------------|-------------|
| `list-notifications` | `GET /notifications` | List all notifications for the authenticated user |
| `mark-notifications-read` | `PUT /notifications` | Mark all notifications as read |

### 4.2. Thread Management Tools

| Tool Name | GitHub API Endpoint | Description |
|-----------|---------------------|-------------|
| `get-thread` | `GET /notifications/threads/{thread_id}` | Get information about a notification thread |
| `mark-thread-read` | `PATCH /notifications/threads/{thread_id}` | Mark a thread as read |
| `mark-thread-done` | `DELETE /notifications/threads/{thread_id}` | Mark a thread as done |

### 4.3. Thread Subscription Tools

| Tool Name | GitHub API Endpoint | Description |
|-----------|---------------------|-------------|
| `get-thread-subscription` | `GET /notifications/threads/{thread_id}/subscription` | Get thread subscription status |
| `set-thread-subscription` | `PUT /notifications/threads/{thread_id}/subscription` | Subscribe to a thread |
| `delete-thread-subscription` | `DELETE /notifications/threads/{thread_id}/subscription` | Unsubscribe from a thread |

### 4.4. Repository Notifications Tools

| Tool Name | GitHub API Endpoint | Description |
|-----------|---------------------|-------------|
| `list-repo-notifications` | `GET /repos/{owner}/{repo}/notifications` | List repository notifications |
| `mark-repo-notifications-read` | `PUT /repos/{owner}/{repo}/notifications` | Mark repository notifications as read |

## 5. Implementation Details

### 5.1. Tool Implementation Pattern

Each tool will follow a similar pattern:

```typescript
// Example: list-notifications.ts
import { z } from "zod";
import { githubGet } from "../utils/api";

// Input schema with Zod validation
const listNotificationsSchema = z.object({
  all: z.boolean().optional().default(false),
  participating: z.boolean().optional().default(false),
  since: z.string().optional(),
  before: z.string().optional(),
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(50).max(100)
});

// Tool handler function
export async function listNotifications(args: z.infer<typeof listNotificationsSchema>) {
  try {
    // Call GitHub API using fetch
    const notifications = await githubGet("/notifications", {
      params: args
    });
    
    // Return formatted results
    return {
      content: [{
        type: "text",
        text: JSON.stringify(notifications, null, 2)
      }]
    };
  } catch (error) {
    // Handle and return error
    return {
      isError: true,
      content: [{
        type: "text",
        text: `Error fetching notifications: ${error.message}`
      }]
    };
  }
}
```

### 5.2. GitHub API Client

A utility module for making authenticated requests to the GitHub API using fetch:

```typescript
// api.ts
// Using native fetch API

const BASE_URL = "https://api.github.com";
const DEFAULT_HEADERS = {
  "Accept": "application/vnd.github+json",
  "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
  "X-GitHub-Api-Version": "2022-11-28"
};

export async function githubGet<T>(path: string, options = {}) {
  const url = new URL(path, BASE_URL);
  
  // Add query parameters if provided
  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: DEFAULT_HEADERS
  });
  
  // Error handling
  if (!response.ok) {
    throw new Error(`GitHub API error (${response.status}): ${await response.text()}`);
  }
  
  return await response.json() as T;
}

// Similar implementations for PUT, PATCH, DELETE methods
```

### 5.3. Server Configuration

The main server setup:

```typescript
// server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { listNotifications } from "./tools/list-notifications";
import { markNotificationsRead } from "./tools/mark-as-read";
// Import other tools...

export async function startServer() {
  // Create MCP server
  const server = new McpServer({
    name: "github-notifications",
    version: "1.0.0"
  });

  // Register tools
  server.tool(
    "list-notifications",
    "List GitHub notifications for the authenticated user",
    listNotificationsSchema.shape,
    listNotifications
  );
  
  server.tool(
    "mark-notifications-read",
    "Mark notifications as read",
    markNotificationsReadSchema.shape,
    markNotificationsRead
  );
  
  // Register other tools...
  
  // Start server with stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GitHub Notifications MCP Server running on stdio");
}
```

## 6. User Experience

When a user interacts with this server through an MCP client (like Claude Desktop), they will be able to:

1. Check their GitHub notifications
   ```
   Can you show me my unread GitHub notifications?
   ```

2. Manage notification subscriptions
   ```
   Can you unsubscribe me from thread 123456?
   ```

3. Mark notifications as read
   ```
   Mark all my notifications from the acme/rocket-project repository as read.
   ```

## 7. Implementation Plan

### Phase 1: Basic Setup and Core Tools

1. Set up project structure and dependencies
2. Implement GitHub API client with authentication
3. Implement core tools:
   - `list-notifications`
   - `mark-notifications-read`
   - `get-thread`
   - `mark-thread-read`

### Phase 2: Complete Tool Implementation

1. Implement subscription management tools:
   - `get-thread-subscription`
   - `set-thread-subscription` 
   - `delete-thread-subscription`

2. Implement repository-specific tools:
   - `list-repo-notifications`
   - `mark-repo-notifications-read`

3. Implement the remaining tool:
   - `mark-thread-done`

### Phase 3: Testing and Documentation

1. Test all tools with various input parameters
2. Add comprehensive error handling
3. Create detailed documentation with examples
4. Prepare for deployment

## 8. Environment Variables

The server will require the following environment variables:

- `GITHUB_TOKEN`: Personal Access Token with `notifications` or `repo` scope

## 9. Example Usage Configuration

For use with Claude Desktop, add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "github-notifications": {
      "command": "node",
      "args": ["/path/to/github-notifications-server/build/index.js"],
      "env": {
        "GITHUB_TOKEN": "<YOUR_PERSONAL_ACCESS_TOKEN>"
      }
    }
  }
}
```

## 10. Next Steps and Future Improvements

1. Enhanced result formatting for better readability
2. Add support for notification filtering (by reason, repository, etc.)
3. Implement pagination helpers for large result sets
4. Add support for GitHub Enterprise instances
5. Implement caching to reduce API calls
6. Add rate limiting protection

This implementation plan provides a comprehensive approach to creating a GitHub Notifications MCP server that exposes all the relevant API endpoints as tools, making it easy for users to manage their GitHub notifications through Claude or other MCP clients.
