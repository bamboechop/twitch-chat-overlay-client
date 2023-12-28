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

export interface IBadge {
  description: string;
  id: string;
  imageUrl: string;
  title: string;
}

export interface IAction {
  availableBadges: Record<string, IBadge[]>;
  color?: string;
  displayName?: string;
  emotes?: { [emoteid: string]: string[]; };
  id?: string,
  msgId?: 'highlighted-message';
  msgType: 'action';
  show: boolean;
  text: string;
  timestamp?: number;
  userBadges?: Badges;
  userImage: string;
  userName?: string;
  viewerCount: number;
}

export interface IChat {
  availableBadges: Record<string, IBadge[]>;
  color?: string;
  displayName?: string;
  emotes?: { [emoteid: string]: string[]; };
  id?: string,
  msgType: 'chat';
  show: boolean;
  text: string;
  timestamp?: number;
  userBadges?: Badges;
  userImage: string;
  userName?: string;
  viewerCount: number;
}

export interface IRaid {
  msgType: 'raid';
  show: boolean;
  timestamp: number;
  userId: string;
  userImage: string;
  userName: string;
  viewerCount: number;
}

export interface IResub {
  color?: string;
  cumulativeMonths?: number;
  displayName?: string;
  emotes?: { [emoteid: string]: string[]; };
  id?: string;
  months: number;
  msgId?: 'resub';
  msgType: 'resub';
  plan?: 1 | 2 | 3 | 'Prime';
  show: boolean;
  text: string;
  timestamp?: number;
  userId?: string;
  userImage: string;
  userName?: string;
  viewerCount: number;
}

interface ISubGiftUser {
  displayName?: string;
  id: string;
  image: string;
  userName?: string;
};

export interface ISubGift {
  id?: string;
  loveEmotePath: string;
  msgId?: 'subgift';
  msgType: 'subgift';
  recipient: ISubGiftUser;
  sender: ISubGiftUser;
  show: boolean;
  subPlanString?: "1000" | "2000" | "3000" | "Prime"; // TODO refactor to always be "Prime" or 1, 2, 3
  timestamp?: number;
  viewerCount: number;
}

export interface ISubscription {
  color?: string;
  displayName?: string;
  emotes?: { [emoteid: string]: string[]; };
  id?: string;
  msgId?: 'sub';
  msgType: 'subscription';
  plan?: 1 | 2 | 3 | 'Prime';
  show: boolean;
  timestamp?: number;
  userId?: string;
  userImage: string;
  userName?: string;
  viewerCount: number;
}

export interface IMessage {
  availableBadges: Record<string, IBadge[]>;
  color?: string;
  displayName?: string;
  emotes?: { [emoteid: string]: string[]; };
  id?: string;
  msgId?: 'highlighted-message' | 'resub' | 'sub' | 'subgift'; // TODO check screenshots and set accordingly
  msgType: 'action' | 'chat' | 'raid' | 'resub' | 'sub' | 'subgift' | 'whisper'; // action = /me bla | chat = regular message
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
