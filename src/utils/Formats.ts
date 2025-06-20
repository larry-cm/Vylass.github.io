import type { ExternalAccount, SocialLinks } from "@/types/type";

export const formatId = ({
  name,
  postId
}: {
  name: string | undefined;
  postId?: number;
}) => `${name?.toLowerCase().trim().replaceAll(" ", "_")}${postId ? `-${postId}` : ''}`;

export const dateUserFormat = ({
  timeString,
  lang,
}: {
  timeString: string;
  lang: string;
}) =>
  new Date(timeString).toLocaleTimeString(lang, {
    year: "numeric",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    hour12: true,
  });

export const providerConfig: Record<
  ExternalAccount['provider'],
  {
    key: keyof SocialLinks;
    build: (account: ExternalAccount) => string | null;
  }
> = {
  oauth_github: {
    key: 'githubLink',
    build: ({ username }) =>
      username ? `https://github.com/${username}` : null,
  },
  oauth_discord: {
    key: 'discordLink',
    build: ({ externalId }) =>
      externalId ? `https://discord.com/users/${externalId}` : null,
  },
  oauth_linkedin_oidc: {
    key: 'linkedinLink',
    build: ({ externalId }) =>
      externalId ? `https://www.linkedin.com/in/${externalId}` : null,
  },
};