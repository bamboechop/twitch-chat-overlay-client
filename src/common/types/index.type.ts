import { IAction, IChat, IMessage, IRaid, IResub, ISubGift, ISubscription } from "../interfaces/index.interface.ts";

export type TTheme = 'cities-skylines-ii' | 'windows-95';
export type TMessage = IAction | IChat | IRaid | IResub | ISubGift | ISubscription;
export type TRaidMessage = Pick<IMessage, 'msgType' | 'show' | 'timestamp' | 'userImage' | 'userName' | 'viewerCount'>;
