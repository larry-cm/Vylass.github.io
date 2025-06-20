import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";
import { turso } from "./utils/configTurso";
import { providerConfig } from "./utils/Formats";
import type { ExternalAccount, SocialLinks } from "./types/type";


const isProtectedRute = createRouteMatcher([
  '/comunidad(.*)', '/api(.*)'
])

export const onRequest = clerkMiddleware((auth, context, next) => {
  const { userId, redirectToSignIn } = auth()
  const acceptLanguage = context.request.headers.get('Accept-Language')
  const [x] = acceptLanguage?.split(',') || []
  const [lang] = x.split('-')
  // user?.externalAccounts
  if (isProtectedRute(context.request) && !userId) return redirectToSignIn()
  context.locals.lang = lang
  if (context.url.pathname.includes('/comunidad')) {
    try {
      (async () => {
        const user = await context.locals.currentUser()
        if (!user) return redirectToSignIn()
        const usesMedia = user?.externalAccounts
          .filter(
            (providers) =>
              providers.provider.match("github") ||
              providers.provider.match("linkedin") ||
              providers.provider.match("discord"),
          )
          .map(({ externalId, username, provider }) => ({
            externalId,
            username,
            provider,
          }));

        const socialLinks = Object.values(providerConfig).reduce<SocialLinks>(
          (acc, { key, build }) => {
            const account = usesMedia?.find(
              (a) =>
                providerConfig[a.provider as keyof typeof providerConfig]
                  .key === key,
            );
            acc[key] = account ? build(account as ExternalAccount) : null;
            return acc;
          },
          {
            githubLink: null,
            discordLink: null,
            linkedinLink: null,
          },
        );
        const queryMedia = {
          sql: 'insert or ignore into social_media (social_media_id,linkedind,discord,github) values(?,?,?,?); ',
          args: [userId, socialLinks.linkedinLink, socialLinks.discordLink, socialLinks.githubLink]
        }

        const { firstName = '', lastName = '', primaryEmailAddress, hasImage, imageUrl, username = '' } = user
        const queryUser = {
          sql: 'insert or ignore into users (user_id,user_name,user_email,user_url,user_username,social_media_id) values(?,?,?,?,?,?) ',
          args: [
            userId,
            `${firstName} ${lastName ?? ''}`,
            primaryEmailAddress?.emailAddress || "",
            hasImage ? imageUrl : import.meta.env.PUBLIC_IMG_DEFAULT,
            username,
            userId
          ]
        }

        //tirando query
        // await turso.execute(queryUser)
        // await turso.execute(queryMedia)

      })()
    } catch (error) {
      console.error('error al insertar datos en la tabla de social media')
    }
    next()
  }

})