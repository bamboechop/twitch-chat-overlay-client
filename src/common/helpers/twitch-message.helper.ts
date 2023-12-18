import axios from "axios";
import { Badges } from "tmi.js";
import { getEmoteAsUrl, parseEmotesInMessage } from "tmi-utils";

export async function getUserIdByUserName(username: string): Promise<string | undefined> {
  return (await axios.get(`https://api.twitch.tv/helix/users?login=${username}`))?.data?.data?.[0]?.id;
}

export async function getUserImageByUserId(userId: string): Promise<string> {
  let cachedImages: string | { [userId: string]: string } | null = window.sessionStorage.getItem('user-avatars');
  const storedImages: { [userId: string]: string } = cachedImages ? JSON.parse(cachedImages) : {};

  let userImage = storedImages?.[userId];
  if(!userImage) {
    const response = await axios.get(`https://api.twitch.tv/helix/users?id=${userId}`);
    storedImages[userId] = response.data?.data?.[0]?.['profile_image_url'] ?? undefined;
    if(storedImages[userId]) {
      userImage = storedImages[userId];
      window.sessionStorage.setItem('user-avatars', JSON.stringify(storedImages));
    }
  }
  return userImage ?? 'https://placekitten.com/35/35';
}

export function parseMessage(emotes: { [emoteid: string]: string[]; } | undefined, text: string) {
  const messageParts: Record<string, string | undefined>[] = [];
  for(const messagePart of parseEmotesInMessage(emotes as Record<string, string[]>, text)) {
    messageParts.push({
      raw: messagePart.raw,
      type: messagePart.type,
      value: messagePart.type === 'emote' ? getEmoteAsUrl(messagePart.value) : messagePart.value,
    });
  }
  return messageParts;
}

export function parseUserBadges(userBadges: Badges, availableBadges: Record<string, { description: string; id: string; imageUrl: string; title: string }[]>): { description: string; id: string; imageUrl: string; title: string }[] {
  const badges: { description: string; id: string; imageUrl: string; title: string }[] = [];
  for(const [key, value] of Object.entries(userBadges)) {
    const badge = availableBadges[key].find(badge => badge.id === value);
    if(badge) {
      badges.push(badge);
    }
  }
  return badges;
}
