export type resSQL = {
  username: string;
  postDate: string;
  content: string;
  title: string;
  postUrl: string;
  postId?: number;
  userUrl?: string
  userId?: string;
};
// 1. Tipo de cuenta externa
export type ExternalAccount = {
  externalId: string;
  username: string | null;
  provider: 'oauth_github' | 'oauth_discord' | 'oauth_linkedin_oidc';
};

// 2. Tipo del resultado final
export type SocialLinks = {
  githubLink: string | null;
  discordLink: string | null;
  linkedinLink: string | null;
};