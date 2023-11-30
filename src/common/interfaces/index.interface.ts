import { Badges } from "tmi.js";

export interface ITwitchBadgeResponse {
  data: {
    set_id: string;
    versions: {
      click_action: string | null;
      click_url: string | null;
      description: string;
      id: string;
      image_url_1x: string;
      image_url_2x: string;
      image_url_4x: string;
      title: string;
    }[];
  }[];
}

export interface IMessage {
  availableBadges: Record<string, { description: string; id: string; imageUrl: string; title: string }[]>;
  color?: string;
  displayName?: string;
  emotes?: { [emoteid: string]: string[]; };
  id?: string;
  show: boolean;
  text: string;
  timestamp?: number;
  userBadges?: Badges;
  userImage: string;
  userName?: string;
  viewerCount: number;
}