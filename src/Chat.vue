<template>
  <div class="chat">
    <template v-if="theme === 'cities-skylines-ii'">
      <CitiesSkylinesIITheme
        :loading="loading"
        :messages="messages" />
    </template>
    <template v-if="theme === 'windows-95'">
      <Windows95Theme
        :active="active"
        :messages="messages"
        :viewers="viewers" />
    </template>
  </div>
</template>

<script setup lang="ts">
import CitiesSkylinesIITheme from "./layouts/themes/CitiesSkylinesIITheme.vue";
import Windows95Theme from "./layouts/themes/Windows95Theme.vue";
import { TMessage, TTheme } from "./common/types/index.type.ts";
import { onMounted, ref } from "vue";
import axios from "axios";
import {
  IAction,
  IChat,
  IRaid,
  IResub,
  ISubGift,
  ISubscription,
  ITwitchBadgeResponse
} from "./common/interfaces/index.interface.ts";
import {
  AnonSubMysteryGiftUserstate,
  ChatUserstate,
  client as tmiClient,
  DeleteUserstate,
  SubGiftUpgradeUserstate,
  SubGiftUserstate,
  SubMethods,
  SubMysteryGiftUserstate,
  SubUserstate,
  TimeoutUserstate
} from "tmi.js";
import { getUserIdByUserName, getUserImageByUserId, parsePlan } from "./common/helpers/twitch-message.helper.ts";
import { resubDummy } from "../data/resub.data.ts";
import { subscriptionDummy } from "../data/subscription.data.ts";
import { subgiftDummy } from "../data/subgift.data.ts";
import { actionDummy } from "../data/action.data.ts";
import { chatDummy } from "../data/chat.data.ts";
import { raidDummy } from "../data/raid.data.ts";

const broadcaster = {
  id: import.meta.env.VITE_TWITCH_BROADCASTER_ID,
  name: import.meta.env.VITE_TWITCH_BROADCASTER_NAME,
}
const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
const redirectUri = import.meta.env.VITE_TWITCH_REDIRECT_URI;

const searchParams = new URLSearchParams(window.location.search);
const active = searchParams.get('active') === 'true';
const debug = searchParams.get('debug') === 'true';
const messageDebug = searchParams.get('message-debug') === 'true';
const theme: TTheme = searchParams.get('theme') as TTheme ?? import.meta.env.VITE_THEME;

const loading = ref(true);
const messages = ref<TMessage[]>([]);
const viewers = ref(0);

let userImage = 'https://placekitten.com/35/35';

onMounted(async () => {
  try {
    let token = window.localStorage.getItem('twitch-token');

    if(!token) {
      if(window.location.hash) {
        const queryParams = new URLSearchParams(window.location.hash.split('#')[1]);
        if(queryParams.get('access_token')) {
          token = queryParams.get('access_token');
          window.localStorage.setItem('twitch-token', token as string);
        }
      } else {
        // TODO generate a random string and use it as state param to prevent CSRF
        // https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#implicit-grant-flow
        window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=`;
        return;
      }
    }

    document.body.dataset.theme = theme;

    axios.defaults.headers.common = {
      'Authorization': `Bearer ${token}`,
      'Client-ID': clientId,
    };

    const [chatBadgesResponse, globalChatBadgesResponse] = await Promise.all([
      axios.get<ITwitchBadgeResponse>(`https://api.twitch.tv/helix/chat/badges?broadcaster_id=${broadcaster.id}`),
      axios.get<ITwitchBadgeResponse>('https://api.twitch.tv/helix/chat/badges/global'),
    ]);

    const availableBadges: Record<string, { description: string; id: string; imageUrl: string; title: string }[]> = {};
    for(const set of [...globalChatBadgesResponse.data.data, ...chatBadgesResponse.data.data]) {
      availableBadges[set.set_id] = [];
      for(const version of set.versions) {
        availableBadges[set.set_id].push({
          description: version.description,
          id: version.id,
          imageUrl: version.image_url_1x,
          title: version.title,
        });
      }
    }

    const channels = [broadcaster.name];
    if(debug) {
      channels.push(import.meta.env.VITE_TWITCH_DEBUG_CHANNEL);
    }
    const client = new tmiClient({
      channels,
      options: { debug },
    });

    if(!client) {
      console.warn('No client!');
      return;
    }

    await client.connect();

    client.on('action', async (_channel: string, userstate: ChatUserstate, message: string, self: boolean) => {
      if(self) {
        return;
      }
      const {
        badges: userBadges,
        color,
        'display-name': displayName,
        emotes,
        id,
        'msg-id': msgId,
        'tmi-sent-ts': timestamp,
        'user-id': userId,
        username: userName,
      } = userstate;

      if(!userId) {
        return;
      }

      if(theme === 'cities-skylines-ii') {
        userImage = await getUserImageByUserId(userId);
      }

      messages.value.push({
        availableBadges,
        color,
        displayName,
        emotes,
        id,
        msgId,
        msgType: 'action',
        show: true,
        text: message,
        timestamp: timestamp ? parseInt(timestamp, 10) : undefined,
        userBadges,
        userId,
        userImage,
        userName,
        viewerCount: viewers.value,
      } as IAction);
    });

    client.on('anonsubmysterygift', (_channel: string, numbOfSubs: number, methods: SubMethods, userstate: AnonSubMysteryGiftUserstate) => {
      console.log('anonsubmysterygift', { _channel, numbOfSubs, methods, userstate });
    });

    // test with stesi
    client.on('cheer', async (_channel: string, userstate: ChatUserstate, message: string) => {
      console.log('cheer', { _channel, userstate, message });
    });

    client.on('chat', async (_channel: string, userstate: ChatUserstate, message: string, self: boolean) => {
      if(self) {
        return;
      }
      const {
        badges: userBadges,
        color,
        'display-name': displayName,
        emotes,
        id,
        'tmi-sent-ts': timestamp,
        'user-id': userId,
        username: userName,
      } = userstate;

      if(!userId) {
        return;
      }

      if(theme === 'cities-skylines-ii') {
        userImage = await getUserImageByUserId(userId);
      }

      messages.value.push({
        availableBadges,
        color,
        displayName,
        emotes,
        id,
        msgType: 'chat',
        show: true,
        text: message,
        timestamp: timestamp ? parseInt(timestamp, 10) : undefined,
        userBadges,
        userId,
        userImage,
        userName,
        viewerCount: viewers.value,
      } as IChat);
    });

    client.on('clearchat', (_channel: string) => {
      messages.value = [];
    });

    client.on('disconnected', (reason: string) => {
      console.log('disconnected', { reason });
      // TODO implement reconnect
      // maybe show a short message in visual chat as well
      // how about a little "connected to chat" text in the bottom left box of the Windows 95 theme?
    });

    client.on('giftpaidupgrade', (_channel: string, username: string, sender: string, userstate: SubGiftUpgradeUserstate) => {
      console.log('giftpaidupgrade', { _channel, username, sender, userstate });
    });

    client.on('messagedeleted', (_channel: string, _username:  string, _deletedMessage: string, userstate: DeleteUserstate) => {
      messages.value = messages.value.filter(message => {
        if(!('id' in message)) {
          return message;
        }
        return message.id !== userstate["target-msg-id"];
      });
    });

    client.on('raided', async (_channel: string, username: string, viewers: number) => {
      const userId = await getUserIdByUserName(username);
      if(theme === 'cities-skylines-ii') {
        if(userId) {
          userImage = await getUserImageByUserId(userId);
        }
      }

      messages.value.push({
        msgType: 'raid',
        show: true,
        timestamp: Date.now(),
        userId,
        userImage,
        userName: username,
        viewerCount: viewers,
      } as IRaid);
    });

    client.on('resub', async (_channel: string, _username: string, months: number, message: string, userstate: SubUserstate, _methods: SubMethods) => {
      const {
        color,
        'display-name': displayName,
        emotes,
        id,
        'msg-id': msgId,
        'msg-param-cumulative-months': subCumulativeMonthsString,
        'msg-param-sub-plan': subPlanString,
        'tmi-sent-ts': timestamp,
        'user-id': userId,
        username: userName,
      } = userstate;

      if(!userId) {
        return;
      }

      if(theme === 'cities-skylines-ii') {
        userImage = await getUserImageByUserId(userId);
      }

      messages.value.push({
        color,
        cumulativeMonths: parseInt(subCumulativeMonthsString as string, 10),
        displayName,
        emotes,
        id,
        months,
        msgId,
        msgType: 'resub',
        plan: parsePlan(subPlanString),
        show: true,
        text: message,
        timestamp: timestamp ? parseInt(timestamp, 10) : undefined,
        userId,
        userImage,
        userName,
        viewerCount: viewers.value,
      } as IResub);
    });

    client.on('subgift', async (_channel: string, _username: string, _streakMonths: number, _recipient: string, _methods: SubMethods, userstate: SubGiftUserstate) => {
      const {
        'display-name': senderDisplayName,
        id,
        'login': senderUserName,
        'msg-id': msgId,
        'msg-param-sub-plan': subPlanString,
        'msg-param-recipient-display-name': recipientDisplayName,
        'msg-param-recipient-id': recipientId,
        'msg-param-recipient-user-name': recipientUserName,
        'tmi-sent-ts': timestamp,
        'user-id': senderId,
      } = userstate;

      if(!recipientId || !senderId) {
        return;
      }

      let recipientImage, senderImage;
      if(theme === 'cities-skylines-ii') {
        [recipientImage, senderImage] = await Promise.all([
          getUserImageByUserId(recipientId),
          getUserImageByUserId(senderId),
        ]);
      }

      messages.value.push({
        id,
        msgId,
        msgType: 'subgift',
        recipient: {
          displayName: recipientDisplayName,
          id: recipientId,
          image: recipientImage ?? userImage,
          userName: recipientUserName,
        },
        sender: {
          displayName: senderDisplayName,
          id: senderId,
          image: senderImage ?? userImage,
          userName: senderUserName,
        },
        show: true,
        plan: parsePlan(subPlanString),
        timestamp: timestamp ? parseInt(timestamp, 10) : undefined,
        viewerCount: viewers.value,
      } as ISubGift);
    });

    client.on('submysterygift', (_channel: string, username: string, numbOfSubs: number, methods: SubMethods, userstate: SubMysteryGiftUserstate) => {
      console.log('submysterygift', { _channel, username, numbOfSubs, userstate, methods });
      /*
       * userstate["msg-param-sender-count"]: Boolean or String - The total numbers of giftsubs username has given in channel
       */
    });

    client.on('subscription', async (_channel: string, _username: string, _methods: SubMethods, _message: string, userstate: SubUserstate) => {
      const {
        color,
        'display-name': displayName,
        emotes,
        id,
        'msg-id': msgId,
        'msg-param-cumulative-months': subCumulativeMonthsString,
        'msg-param-sub-plan': subPlanString,
        'tmi-sent-ts': timestamp,
        'user-id': userId,
        username: userName,
      } = userstate;

      if(!userId) {
        return;
      }

      if(theme === 'cities-skylines-ii') {
        userImage = await getUserImageByUserId(userId);
      }

      messages.value.push({
        color,
        displayName,
        emotes,
        id,
        msgId,
        msgType: 'subscription',
        show: true,
        subCumulativeMonthsString,
        plan: parsePlan(subPlanString),
        timestamp: timestamp ? parseInt(timestamp, 10) : undefined,
        userId,
        userImage,
        userName,
        viewerCount: viewers.value,
      } as ISubscription);
    });

    client.on('timeout', (_channel: string, _username: string, _reason: string, _duration: number, userstate: TimeoutUserstate) => {
      messages.value = messages.value.filter(message => {
        if(!('userId' in message)) {
          return message;
        }
        return message.userId !== userstate['target-user-id'];
      })
    });

    loading.value = false;

    await client.say('#channel', 'submysterygift --count 20 --username zebiniasis')
  } catch(err) {
    console.error(err);
  }

  if(messageDebug) {
    messages.value.push(resubDummy, subscriptionDummy, subgiftDummy, ...actionDummy, chatDummy, raidDummy);
  }

  window.setInterval(async () => {
    await getViewerCount();
  }, 1000 * 60);
  await getViewerCount();
});

async function getViewerCount(): Promise<number> {
  const streamsResponse = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${broadcaster.name}`);
  viewers.value = streamsResponse.data?.data?.[0]?.['viewer_count'] ?? 0;
  return viewers.value;
}
</script>

<style lang="scss" scoped>
  .chat {
    height: 100%;
  }
</style>
