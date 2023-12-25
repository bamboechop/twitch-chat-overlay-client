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
  msgId?: 'highlighted-message' | 'resub' | 'sub' | 'subgift'; // TODO check screenshots and set accordingly
  msgType?: 'action' | 'chat' | 'raid' | 'resub' | 'sub' | 'subgift' | 'whisper'; // action = /me bla | chat = regular message
  show: boolean;
  subCumulativeMonthsString?: boolean | string; // TODO refactor to always be a number - true => 1, otherwise parse string to number
  subPlanString?: "1000" | "2000" | "3000" | "Prime"; // TODO refactor to always be "Prime" or 1, 2, 3
  text: string;
  timestamp?: number;
  userBadges?: Badges;
  userId?: string;
  userImage: string;
  userName?: string;
  viewerCount: number;
}

export interface ISubgiftMessage extends Pick<IMessage, 'id' | 'msgId' | 'msgType' | 'show' | 'subPlanString' | 'timestamp' | 'viewerCount'> {
  recipient: {
    displayName?: string;
    id: string;
    image: string;
    userName?: string;
  };
  sender: {
    displayName?: string;
    id: string;
    image: string;
    userName?: string;
  };
}
