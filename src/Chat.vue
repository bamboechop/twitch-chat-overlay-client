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
import { TTheme } from "./common/types/index.type.ts";
import { onMounted, ref } from "vue";
import axios from "axios";
import { IMessage, ITwitchBadgeResponse } from "./common/interfaces/index.interface.ts";
import { ChatUserstate, client as tmiClient } from "tmi.js";

const broadcaster = {
  id: import.meta.env.VITE_TWITCH_BROADCASTER_ID,
  name: import.meta.env.VITE_TWITCH_BROADCASTER_NAME,
}
const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
const redirectUri = import.meta.env.VITE_TWITCH_REDIRECT_URI;

const searchParams = new URLSearchParams(window.location.search);
const active = !!searchParams.get('active');
const debug = !!searchParams.get('debug');
const theme: TTheme = searchParams.get('theme') as TTheme ?? import.meta.env.VITE_THEME;

const loading = ref(true);
const messages = ref<IMessage[]>([]);
const viewers = ref(0);

onMounted(async () => {
  try {
    let token = window.localStorage.getItem('twitch-token');

    // TODO check if token is still valid, redirect to oauth page if not
    if(!token) {
      if(window.location.hash) {
        const urlParams = window.location.hash.replace('#', '').split('&');
        const params: Record<string, string> = {};
        for(const param of urlParams) {
          const split = param.split('=');
          params[split[0]] = split[1];
        }
        if(params['access_token']) {
          token = params['access_token'];
          window.localStorage.setItem('twitch-token', token);
        }
      } else {
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

    client.connect();

    client.on('message', async (_channel: string, tags: ChatUserstate, message: string, _self: boolean) => {
      const {
        badges: userBadges,
        color,
        'display-name': displayName,
        emotes,
        id,
        'tmi-sent-ts': timestamp,
        'user-id': userId,
        username: userName,
      } = tags;

      if(!userId) {
        return;
      }

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
      const viewerCount = await getViewerCount();
      messages.value.push({
        availableBadges,
        color,
        displayName,
        emotes,
        id,
        show: true,
        text: message,
        timestamp: timestamp ? parseInt(timestamp, 10) : undefined,
        userBadges,
        userImage: userImage ?? 'https://placekitten.com/35/35',
        userName,
        viewerCount,
      });
    });

    loading.value = false;
  } catch(err) {
    console.error(err);
  }

  window.setInterval(async () => {
    await getViewerCount();
  }, 1000 * 60);
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
