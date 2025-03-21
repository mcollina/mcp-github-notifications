# GitHub Notifications MCP Server - TODO List

This document outlines the tasks required to implement the GitHub Notifications MCP server. Tasks are organized by priority and component.

## Initial Setup

- [x] Create project directory structure
- [x] Initialize TypeScript project (`npm init -y` & `tsc --init`)
- [x] Configure TypeScript (`tsconfig.json`)
- [x] Add dependencies:
  - [x] `@modelcontextprotocol/sdk` - MCP SDK
  - [x] `zod` - Schema validation
  - [x] `dotenv` - Environment variable management
  - [x] TypeScript dev dependencies
- [x] Create build and start scripts in `package.json`
- [x] Set up environment variable handling (`.env` file)

## API Client Implementation

- [x] Create base API client utility (`src/utils/api.ts`)
  - [x] Implement `githubGet()` function using fetch API
  - [x] Implement `githubPut()` function using fetch API
  - [x] Implement `githubPatch()` function using fetch API
  - [x] Implement `githubDelete()` function using fetch API
  - [x] Add error handling and status code processing
  - [x] Implement rate limit monitoring
- [x] Create GitHub API type definitions (`src/types/github-api.ts`)
  - [x] Define `NotificationResponse` interface
  - [x] Define `ThreadSubscription` interface
  - [x] Define other necessary types

## Formatting Utilities

- [x] Create response formatters (`src/utils/formatters.ts`)
  - [x] Implement `formatNotification()` function
  - [x] Implement `formatSubscription()` function
  - [x] Implement `formatError()` function
  - [x] Add reason code descriptions

## Tool Implementations

### User Notifications Tools
- [x] Implement `list-notifications` tool
  - [x] Define input schema with Zod
  - [x] Implement handler function
  - [x] Add pagination support
  - [x] Format response for readability
- [x] Implement `mark-notifications-read` tool
  - [x] Define input schema with Zod
  - [x] Implement handler function
  - [x] Add validation for parameters

### Thread Management Tools
- [x] Implement `get-thread` tool
  - [x] Define input schema with Zod
  - [x] Implement handler function
  - [x] Format thread details for readability
- [x] Implement `mark-thread-read` tool
  - [x] Define input schema with Zod
  - [x] Implement handler function
  - [x] Add response handling
- [x] Implement `mark-thread-done` tool
  - [x] Define input schema with Zod
  - [x] Implement handler function
  - [x] Add response handling

### Thread Subscription Tools
- [x] Implement `get-thread-subscription` tool
  - [x] Define input schema with Zod
  - [x] Implement handler function
  - [x] Format subscription information
- [x] Implement `set-thread-subscription` tool
  - [x] Define input schema with Zod
  - [x] Implement handler function
  - [x] Validate parameters
- [x] Implement `delete-thread-subscription` tool
  - [x] Define input schema with Zod
  - [x] Implement handler function
  - [x] Add response handling

### Repository Notifications Tools
- [x] Implement `list-repo-notifications` tool
  - [x] Define input schema with Zod
  - [x] Implement handler function
  - [x] Support pagination
  - [x] Format response for readability
- [x] Implement `mark-repo-notifications-read` tool
  - [x] Define input schema with Zod
  - [x] Implement handler function
  - [x] Add validation for parameters

## Server Implementation

- [x] Create main server setup (`src/server.ts`)
  - [x] Initialize MCP server with name and version
  - [x] Register all tools with the server
  - [x] Configure stdio transport
  - [x] Add error handling
- [x] Create entry point (`src/index.ts`)
  - [x] Handle environment variables with dotenv
  - [x] Call server startup function
  - [x] Add proper shutdown handling

## Testing and Quality Assurance

- [ ] Manual testing of each tool
  - [ ] Test with valid inputs
  - [ ] Test with invalid inputs
  - [ ] Test with edge cases
- [x] Write clear error messages
- [ ] Test with MCP Inspector
- [ ] Configure and test with Claude Desktop

## Documentation

- [x] Write README.md
  - [x] Installation instructions
  - [x] Usage guide
  - [x] Available tools documentation
  - [x] Environment setup
- [x] Add inline code documentation
  - [x] JSDocs for functions
  - [x] Comments for complex logic
- [x] Create example configuration

## Deployment Preparation

- [x] Create build script for production
- [x] Verify environment variable handling
- [ ] Test full workflow with Claude Desktop
- [x] Document Claude Desktop integration
