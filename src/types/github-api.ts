/**
 * Repository owner information
 */
export interface RepositoryOwner {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

/**
 * Repository information
 */
export interface Repository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  owner: RepositoryOwner;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  archive_url: string;
  assignees_url: string;
  blobs_url: string;
  branches_url: string;
  collaborators_url: string;
  comments_url: string;
  commits_url: string;
  compare_url: string;
  contents_url: string;
  contributors_url: string;
  deployments_url: string;
  downloads_url: string;
  events_url: string;
  forks_url: string;
  git_commits_url: string;
  git_refs_url: string;
  git_tags_url: string;
  git_url: string;
  issue_comment_url: string;
  issue_events_url: string;
  issues_url: string;
  keys_url: string;
  labels_url: string;
  languages_url: string;
  merges_url: string;
  milestones_url: string;
  notifications_url: string;
  pulls_url: string;
  releases_url: string;
  ssh_url: string;
  stargazers_url: string;
  statuses_url: string;
  subscribers_url: string;
  subscription_url: string;
  tags_url: string;
  teams_url: string;
  trees_url: string;
  hooks_url: string;
}

/**
 * Subject information of a notification
 */
export interface NotificationSubject {
  title: string;
  url: string;
  latest_comment_url: string;
  type: string;
}

/**
 * Notification reason types
 */
export type NotificationReason = 
  | 'approval_requested'
  | 'assign'
  | 'author'
  | 'comment'
  | 'ci_activity'
  | 'invitation'
  | 'manual'
  | 'member_feature_requested'
  | 'mention'
  | 'review_requested'
  | 'security_alert'
  | 'security_advisory_credit'
  | 'state_change'
  | 'subscribed'
  | 'team_mention';

/**
 * Response type for notifications
 */
export interface NotificationResponse {
  id: string;
  repository: Repository;
  subject: NotificationSubject;
  reason: NotificationReason;
  unread: boolean;
  updated_at: string;
  last_read_at: string | null;
  url: string;
  subscription_url: string;
}

/**
 * Thread subscription information
 */
export interface ThreadSubscription {
  subscribed: boolean;
  ignored: boolean;
  reason: string | null;
  created_at: string;
  url: string;
  thread_url: string;
}

/**
 * Mark notifications as read response
 */
export interface MarkNotificationsReadResponse {
  message?: string;
}

/**
 * Set thread subscription request
 */
export interface SetThreadSubscriptionRequest {
  ignored?: boolean;
}

/**
 * Mark notifications as read request
 */
export interface MarkNotificationsReadRequest {
  last_read_at?: string;
  read?: boolean;
}
