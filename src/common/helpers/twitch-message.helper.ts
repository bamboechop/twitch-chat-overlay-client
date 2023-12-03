import { Badges } from "tmi.js";
import { getEmoteAsUrl, parseEmotesInMessage } from "tmi-utils";

export function parseMessage(emotes: { [emoteid: string]: string[]; }, text: string) {
  const messageParts: Record<string, string | undefined>[] = [];
  for(const messagePart of parseEmotesInMessage(emotes, text)) {
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
