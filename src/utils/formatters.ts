/**
 * Utilities for formatting responses
 */
import { NotificationResponse, ThreadSubscription, NotificationReason } from "../types/github-api.js";

/**
 * Converts a GitHub API URL to its HTML (web UI) equivalent
 */
export function convertApiUrlToHtmlUrl(apiUrl: string): string {
  // Replace API domain with web UI domain
  let htmlUrl = apiUrl.replace("api.github.com/repos", "github.com");
  
  // Fix pull request URLs - change 'pulls' to 'pull' in the URL
  htmlUrl = htmlUrl.replace(/\/pulls\/([0-9]+)(\/?.*)/g, "/pull/$1$2");
  
  // Fix issue URLs - keep plural 'issues' since GitHub uses this in both API and web URLs
  // This is just for completeness, as the API already uses the correct format
  
  return htmlUrl;
}

/**
 * Provides a human-readable description of a notification reason
 */
export function describeReason(reason: NotificationReason): string {
  const descriptions: Record<NotificationReason, string> = {
    approval_requested: "You were requested to review and approve a deployment",
    assign: "You were assigned to the issue",
    author: "You created the thread",
    comment: "You commented on the thread",
    ci_activity: "A GitHub Actions workflow run that you triggered was completed",
    invitation: "You accepted an invitation to contribute to the repository",
    manual: "You subscribed to the thread",
    member_feature_requested: "Organization members have requested to enable a feature",
    mention: "You were @mentioned in the content",
    review_requested: "You were requested to review a pull request",
    security_alert: "GitHub discovered a security vulnerability in your repository",
    security_advisory_credit: "You were credited for contributing to a security advisory",
    state_change: "You changed the thread state",
    subscribed: "You're watching the repository",
    team_mention: "You were on a team that was mentioned",
  };
  
  return descriptions[reason] || "Unknown reason";
}

/**
 * Formats a notification object into a human-readable string
 */
export function formatNotification(notification: NotificationResponse): string {
  const date = new Date(notification.updated_at).toLocaleString();
  const repoName = notification.repository.full_name;
  const reason = describeReason(notification.reason);
  const status = notification.unread ? "Unread" : "Read";
  const type = notification.subject.type;
  
  return `ID: ${notification.id}
Title: ${notification.subject.title}
Repository: ${repoName}
Type: ${type}
Reason: ${notification.reason} (${reason})
Status: ${status}
Updated: ${date}
URL: ${convertApiUrlToHtmlUrl(notification.subject.url)}`;
}

/**
 * Formats a thread subscription into a human-readable string
 */
export function formatSubscription(subscription: ThreadSubscription): string {
  return `Subscription Status: ${subscription.subscribed ? "Subscribed" : "Not Subscribed"}
Ignored: ${subscription.ignored ? "Yes" : "No"}
${subscription.reason ? `Reason: ${subscription.reason}` : ""}
Created: ${new Date(subscription.created_at).toLocaleString()}`;
}

/**
 * Format an error response
 */
export function formatError(message: string, error: unknown): string {
  if (error instanceof Error) {
    return `${message}: ${error.message}`;
  } else if (typeof error === 'string') {
    return `${message}: ${error}`;
  } else {
    return `${message}: Unknown error`;
  }
}
