/**
 * API client for GitHub API requests using fetch
 */

// Check for required environment variable
if (!process.env.GITHUB_TOKEN) {
  console.error("Error: GITHUB_TOKEN environment variable is required");
  process.exit(1);
}

const BASE_URL = "https://api.github.com";
const DEFAULT_HEADERS = {
  "Accept": "application/vnd.github+json",
  "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "GitHub-Notifications-MCP-Server/1.0.0"
};

/**
 * Interface for request options
 */
export interface RequestOptions {
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

/**
 * Helper function to handle GitHub API responses
 */
async function handleResponse<T>(response: Response): Promise<T> {
  // Log rate limit information for debugging
  const rateLimit = {
    limit: response.headers.get('x-ratelimit-limit'),
    remaining: response.headers.get('x-ratelimit-remaining'),
    reset: response.headers.get('x-ratelimit-reset'),
    used: response.headers.get('x-ratelimit-used')
  };
  
  console.error(`GitHub API call: ${response.url} [Rate limit: ${rateLimit.remaining}/${rateLimit.limit}]`);
  
  // Handle error responses
  if (!response.ok) {
    const statusCode = response.status;
    let errorData;
    
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: "Unknown error" };
    }
    
    // Handle specific status codes
    switch (statusCode) {
      case 401:
        throw new Error("Authentication failed. Please check your GitHub token.");
      case 403:
        // Handle rate limiting
        if (rateLimit.remaining === '0') {
          const resetTime = new Date(parseInt(rateLimit.reset || '0') * 1000);
          throw new Error(`GitHub API rate limit exceeded. Resets at ${resetTime.toLocaleTimeString()}`);
        }
        throw new Error(`Access forbidden: ${errorData.message}`);
      case 404:
        throw new Error(`Resource not found: ${errorData.message}`);
      case 422:
        throw new Error(`Validation failed: ${errorData.message} ${errorData.errors ? JSON.stringify(errorData.errors) : ''}`);
      default:
        throw new Error(`GitHub API error (${statusCode}): ${errorData.message}`);
    }
  }
  
  // For 204 No Content responses, return empty object
  if (response.status === 204) {
    return {} as T;
  }
  
  // Parse JSON response
  return await response.json() as T;
}

/**
 * Builds a URL with query parameters
 */
function buildUrl(path: string, params?: Record<string, any>): string {
  const url = new URL(path, BASE_URL);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
}

/**
 * Makes a GET request to the GitHub API
 * 
 * @param path API endpoint path
 * @param options Request options
 * @returns Promise with the API response
 */
export async function githubGet<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, options.params);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...DEFAULT_HEADERS,
      ...options.headers
    }
  });
  
  return handleResponse<T>(response);
}

/**
 * Makes a PUT request to the GitHub API
 * 
 * @param path API endpoint path
 * @param data Request body data
 * @param options Request options
 * @returns Promise with the API response
 */
export async function githubPut<T = any>(path: string, data?: any, options: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, options.params);
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      ...DEFAULT_HEADERS,
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: data ? JSON.stringify(data) : undefined
  });
  
  return handleResponse<T>(response);
}

/**
 * Makes a PATCH request to the GitHub API
 * 
 * @param path API endpoint path
 * @param data Request body data
 * @param options Request options
 * @returns Promise with the API response
 */
export async function githubPatch<T = any>(path: string, data?: any, options: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, options.params);
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      ...DEFAULT_HEADERS,
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: data ? JSON.stringify(data) : undefined
  });
  
  return handleResponse<T>(response);
}

/**
 * Makes a DELETE request to the GitHub API
 * 
 * @param path API endpoint path
 * @param options Request options
 * @returns Promise with the API response
 */
export async function githubDelete<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, options.params);
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...DEFAULT_HEADERS,
      ...options.headers
    }
  });
  
  return handleResponse<T>(response);
}
