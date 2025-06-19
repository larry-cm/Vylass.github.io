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