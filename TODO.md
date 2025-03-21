# GitHub Notifications MCP Server - TODO List

This document outlines the tasks required to implement the GitHub Notifications MCP server. Tasks are organized by priority and component.

## Initial Setup

- [ ] Create project directory structure
- [ ] Initialize TypeScript project (`npm init -y` & `tsc --init`)
- [ ] Configure TypeScript (`tsconfig.json`)
- [ ] Add dependencies:
  - [ ] `@modelcontextprotocol/sdk` - MCP SDK
  - [ ] `zod` - Schema validation
  - [ ] `dotenv` - Environment variable management
  - [ ] TypeScript dev dependencies
- [ ] Create build and start scripts in `package.json`
- [ ] Set up environment variable handling (`.env` file)

## API Client Implementation

- [ ] Create base API client utility (`src/utils/api.ts`)
  - [ ] Implement `githubGet()` function using fetch API
  - [ ] Implement `githubPut()` function using fetch API
  - [ ] Implement `githubPatch()` function using fetch API
  - [ ] Implement `githubDelete()` function using fetch API
  - [ ] Add error handling and status code processing
  - [ ] Implement rate limit monitoring
- [ ] Create GitHub API type definitions (`src/types/github-api.ts`)
  - [ ] Define `NotificationResponse` interface
  - [ ] Define `ThreadSubscription` interface
  - [ ] Define other necessary types

## Formatting Utilities

- [ ] Create response formatters (`src/utils/formatters.ts`)
  - [ ] Implement `formatNotification()` function
  - [ ] Implement `formatSubscription()` function
  - [ ] Implement `formatError()` function
  - [ ] Add reason code descriptions

## Tool Implementations

### User Notifications Tools
- [ ] Implement `list-notifications` tool
  - [ ] Define input schema with Zod
  - [ ] Implement handler function
  - [ ] Add pagination support
  - [ ] Format response for readability
- [ ] Implement `mark-notifications-read` tool
  - [ ] Define input schema with Zod
  - [ ] Implement handler function
  - [ ] Add validation for parameters

### Thread Management Tools
- [ ] Implement `get-thread` tool
  - [ ] Define input schema with Zod
  - [ ] Implement handler function
  - [ ] Format thread details for readability
- [ ] Implement `mark-thread-read` tool
  - [ ] Define input schema with Zod
  - [ ] Implement handler function
  - [ ] Add response handling
- [ ] Implement `mark-thread-done` tool
  - [ ] Define input schema with Zod
  - [ ] Implement handler function
  - [ ] Add response handling

### Thread Subscription Tools
- [ ] Implement `get-thread-subscription` tool
  - [ ] Define input schema with Zod
  - [ ] Implement handler function
  - [ ] Format subscription information
- [ ] Implement `set-thread-subscription` tool
  - [ ] Define input schema with Zod
  - [ ] Implement handler function
  - [ ] Validate parameters
- [ ] Implement `delete-thread-subscription` tool
  - [ ] Define input schema with Zod
  - [ ] Implement handler function
  - [ ] Add response handling

### Repository Notifications Tools
- [ ] Implement `list-repo-notifications` tool
  - [ ] Define input schema with Zod
  - [ ] Implement handler function
  - [ ] Support pagination
  - [ ] Format response for readability
- [ ] Implement `mark-repo-notifications-read` tool
  - [ ] Define input schema with Zod
  - [ ] Implement handler function
  - [ ] Add validation for parameters

## Server Implementation

- [ ] Create main server setup (`src/server.ts`)
  - [ ] Initialize MCP server with name and version
  - [ ] Register all tools with the server
  - [ ] Configure stdio transport
  - [ ] Add error handling
- [ ] Create entry point (`src/index.ts`)
  - [ ] Handle environment variables with dotenv
  - [ ] Call server startup function
  - [ ] Add proper shutdown handling

## Testing and Quality Assurance

- [ ] Manual testing of each tool
  - [ ] Test with valid inputs
  - [ ] Test with invalid inputs
  - [ ] Test with edge cases
- [ ] Write clear error messages
- [ ] Test with MCP Inspector
- [ ] Configure and test with Claude Desktop

## Documentation

- [ ] Write README.md
  - [ ] Installation instructions
  - [ ] Usage guide
  - [ ] Available tools documentation
  - [ ] Environment setup
- [ ] Add inline code documentation
  - [ ] JSDocs for functions
  - [ ] Comments for complex logic
- [ ] Create example configuration

## Deployment Preparation

- [ ] Create build script for production
- [ ] Verify environment variable handling
- [ ] Test full workflow with Claude Desktop
- [ ] Document Claude Desktop integration
