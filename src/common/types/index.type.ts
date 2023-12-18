import { IMessage } from "../interfaces/index.interface.ts";

export type TTheme = 'cities-skylines-ii' | 'windows-95';
export type TRaidMessage = Pick<IMessage, 'msgType' | 'show' | 'timestamp' | 'userImage' | 'userName' | 'viewerCount'>;
