import { z } from 'zod';
import { githubPut, githubDelete, githubGet } from '../utils/api.js';
import { formatError } from '../utils/formatters.js';

/**
 * Schema for manage-repo-subscription tool input parameters
 */
export const manageRepoSubscriptionSchema = z.object({
    owner: z.string().min(1, 'Repository owner is required')
        .describe('The account owner of the repository. The name is not case sensitive.'),
    repo: z.string().min(1, 'Repository name is required')
        .describe('The name of the repository without the .git extension. The name is not case sensitive.'),
    action: z.enum(['all_activity', 'default', 'ignore', 'get'])
        .describe('The action to perform: all_activity (watch all), default (participating and @mentions only), ignore (mute notifications), or get (view current settings)'),
    options: z.object({
        subscribed: z.boolean().optional()
            .describe('Whether to receive notifications from this repository'),
        ignored: z.boolean().optional()
            .describe('Whether to ignore all notifications from this repository')
    }).optional()
        .describe('Optional settings for custom subscription configuration')
});

export type ManageRepoSubscriptionArgs = z.infer<typeof manageRepoSubscriptionSchema>;

interface SubscriptionResponse {
    subscribed: boolean;
    ignored: boolean;
    reason: string | null;
    created_at: string;
    url: string;
    repository_url: string;
}

/**
 * Tool implementation for managing repository subscriptions
 */
export async function manageRepoSubscriptionHandler(args: ManageRepoSubscriptionArgs) {
    const { owner, repo, action, options } = args;

    try {
        switch (action) {
            case 'get':
                try {
                    const response = await githubGet<SubscriptionResponse>(`/repos/${owner}/${repo}/subscription`);
                    const formattedDate = new Date(response.created_at).toLocaleString();
                    return {
                        content: [{
                            type: 'text',
                            text: `Subscription status for ${owner}/${repo}:
• API Subscription: ${response.subscribed ? 'Watching all activity' : 'Not watching'}
• Notifications: ${response.ignored ? 'Ignored' : 'Active'}
• Created at: ${formattedDate}
• Web Interface: https://github.com/${owner}/${repo}`
                        }]
                    };
                } catch (error: any) {
                    // Special handling for 404 in get action - could be default or custom settings
                    if (error.message?.includes('Resource not found')) {
                        return {
                            content: [{
                                type: 'text',
                                text: `Subscription status for ${owner}/${repo}:
• Default settings (participating and @mentions only)
• or Custom through the GitHub web interface at:
  https://github.com/${owner}/${repo}`
                            }]
                        };
                    }
                    throw error; // Re-throw other errors to be handled by the outer catch
                }

            case 'all_activity':
                await githubPut(`/repos/${owner}/${repo}/subscription`, {
                    subscribed: true,
                    ignored: false
                });
                return {
                    content: [{
                        type: 'text',
                        text: `Successfully set ${owner}/${repo} to watch all activity`
                    }]
                };

            case 'default':
                await githubDelete(`/repos/${owner}/${repo}/subscription`);
                return {
                    content: [{
                        type: 'text',
                        text: `Successfully set ${owner}/${repo} to default settings (participating and @mentions only)`
                    }]
                };

            case 'ignore':
                await githubPut(`/repos/${owner}/${repo}/subscription`, {
                    subscribed: false,
                    ignored: true
                });
                return {
                    content: [{
                        type: 'text',
                        text: `Successfully set ${owner}/${repo} to ignore all notifications`
                    }]
                };
        }
    } catch (error: any) {
        return {
            isError: true,
            content: [{
                type: 'text',
                text: formatError(`Failed to manage repository subscription for ${owner}/${repo}`, error)
            }]
        };
    }
}

/**
 * Register this tool with the server
 */
export function registerManageRepoSubscriptionTool(server: any) {
    server.tool(
        'manage-repo-subscription',
        'Manage repository subscription settings including fine-grained notification preferences',
        manageRepoSubscriptionSchema.shape,
        manageRepoSubscriptionHandler
    );
} 