<template>
  <div class="list">
    <ul>
      <template
          v-for="message of messages"
          :key="message.id">
        <Transition appear>
          <ChatMessage
              v-show="message.show"
              :available-badges="message.availableBadges"
              :color="message.color"
              :display-name="message.displayName"
              :emotes="message.emotes"
              :id="message.id"
              :show="message.show"
              :text="message.text"
              :timestamp="message.timestamp"
              :user-image="message.userImage"
              :user-name="message.userName"
              :user-badges="message.userBadges"
              :viewer-count="message.viewerCount" />
        </Transition>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import {ChatUserstate, client as tmiClient} from 'tmi.js';
import {onMounted, ref} from 'vue';
import ChatMessage from "./ChatMessage.vue";
import {IMessage, ITwitchBadgeResponse} from "../interfaces/index.interface";

const messages = ref<IMessage[]>([]);

onMounted(async () => {
  let token = window.localStorage.getItem('twitch-token');

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
      window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=332bgpg7ue15dq44gqpkvuophguqgw&redirect_uri=http://localhost:5173&response_type=token&scope=`;
      return;
    }
  }

  document.scrollingElement?.scroll(0, 1);

  const [chatBadgesResponse, globalChatBadgesResponse] = await Promise.all([
      axios.get<ITwitchBadgeResponse>('https://api.twitch.tv/helix/chat/badges?broadcaster_id=37084588', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Client-Id': '332bgpg7ue15dq44gqpkvuophguqgw',
        },
      }),
      axios.get<ITwitchBadgeResponse>('https://api.twitch.tv/helix/chat/badges/global',{
        headers: {
          Authorization: `Bearer ${token}`,
          'Client-Id': '332bgpg7ue15dq44gqpkvuophguqgw',
        },
      }),
  ]);

  const availableBadges: Record<string, { description: string; id: string; imageUrl: string; title: string }[]> = {};
  for(const set of globalChatBadgesResponse.data.data) {
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
  for(const set of chatBadgesResponse.data.data) {
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

  const client = new tmiClient({
    channels: ['bambbot'],
    options: { debug: true },
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
    console.log(tags);

    if(!userId) {
      return;
    }

    let cachedImages: string | { [userId: string]: string } | null = window.sessionStorage.getItem('user-avatars');
    const storedImages: { [userId: string]: string } = cachedImages ? JSON.parse(cachedImages) : {};

    let userImage = storedImages?.[userId];
    if(!userImage) {
      const response = await axios.get(`https://api.twitch.tv/helix/users?id=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Client-Id': '332bgpg7ue15dq44gqpkvuophguqgw',
        },
      });
      storedImages[userId] = response.data?.data?.[0]?.['profile_image_url'] ?? undefined;
      if(storedImages[userId]) {
        userImage = storedImages[userId];
        window.sessionStorage.setItem('user-avatars', JSON.stringify(storedImages));
      }
    }
    const streamsResponse = await axios.get('https://api.twitch.tv/helix/streams?user_id=22552479', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Client-Id': '332bgpg7ue15dq44gqpkvuophguqgw',
      },
    });
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
      viewerCount: streamsResponse.data?.data?.[0]?.['viewer_count'] ?? 0,
    });
  });

  window.setInterval(async () => {
    messages.value = messages.value.map(message => {
      // remove already hidden messages
      if(!message.show) {
        return undefined;
      }

      // set stale messages to be hidden
      if(!message.timestamp || Date.now() - message.timestamp >= 7000) {
        message.show = false;
      }

      return message;
    }).filter(message => !!message) as IMessage[];
  }, 1000);
});
</script>

<style scoped lang="scss">
.list {
  display: flex;
  flex-direction: column-reverse;
  height: 100vh;
  overflow-anchor: auto;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;

  align-items: start;
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 10px;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
