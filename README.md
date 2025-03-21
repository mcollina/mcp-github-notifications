# GitHub Notifications MCP Server

An MCP (Model Context Protocol) server that provides tools for managing GitHub notifications. This server allows AI assistants like Claude to help you manage your GitHub notifications through natural language commands.

## Features

- List and filter your GitHub notifications
- Mark notifications as read
- View notification thread details
- Subscribe or unsubscribe from notification threads
- Mark threads as done
- Manage repository-specific notifications

## Prerequisites

- Node.js 18 or higher
- GitHub Personal Access Token (classic) with `notifications` or `repo` scope

## Installation

1. Clone this repository
   ```
   git clone https://github.com/yourusername/github-notifications-mcp-server.git
   cd github-notifications-mcp-server
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Build the project
   ```
   npm run build
   ```

4. Create a `.env` file with your GitHub token
   ```
   GITHUB_TOKEN=your_github_personal_access_token_here
   ```

## Usage

### Running the server directly

```
npm start
```

### Using with Claude Desktop

Add the server to your `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "github-notifications": {
      "command": "node",
      "args": ["/absolute/path/to/github-notifications-mcp-server/build/index.js"],
      "env": {
        "GITHUB_TOKEN": "your_github_personal_access_token_here"
      }
    }
  }
}
```

## Available Tools

| Tool Name | Description |
|-----------|-------------|
| `list-notifications` | List all GitHub notifications for the authenticated user |
| `mark-notifications-read` | Mark all notifications as read |
| `get-thread` | Get information about a notification thread |
| `mark-thread-read` | Mark a specific thread as read |
| `mark-thread-done` | Mark a thread as done |
| `get-thread-subscription` | Get subscription status for a thread |
| `set-thread-subscription` | Subscribe to a thread |
| `delete-thread-subscription` | Unsubscribe from a thread |
| `list-repo-notifications` | List notifications for a specific repository |
| `mark-repo-notifications-read` | Mark notifications for a repository as read |

## Example Prompts

Here are some example prompts you can use with Claude Desktop once the server is connected:

- "Can you check my GitHub notifications?"
- "Show me my unread notifications from the last 24 hours."
- "Mark all my notifications as read."
- "Can you tell me about notification thread 12345?"
- "Unsubscribe me from thread 12345."
- "What notifications do I have for the octocat/Hello-World repository?"
- "Mark all notifications from the octocat/Hello-World repository as read."

## Development

### URL Handling

This server automatically converts GitHub API URLs to their corresponding web UI URLs. For example:

- API URL: `https://api.github.com/repos/nodejs/node/pulls/57557`
- Converted to: `https://github.com/nodejs/node/pull/57557`

The conversion handles:
- Domain conversion from `api.github.com/repos` to `github.com`
- Path correction for pull requests (changing `pulls` to `pull`)
- Preservation of additional path segments

### Project Structure

```
github-notifications-mcp-server/
├── src/                    # Source code
│   ├── tools/              # Tool implementations
│   ├── types/              # Type definitions
│   ├── utils/              # Utility functions
│   ├── index.ts            # Entry point
│   └── server.ts           # Server configuration
├── build/                  # Compiled JavaScript
├── .env                    # Environment variables
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript configuration
└── README.md               # Documentation
```

### Building

```
npm run build
```

### Testing

Run the automated tests:

```
npm test
```

Test URL conversion manually:

```
npm run test:url
```

## License

MIT
