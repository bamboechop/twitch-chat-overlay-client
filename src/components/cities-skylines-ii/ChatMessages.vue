<template>
  <div class="chat-messages">
    <div class="chat-messages__container">
      <ul class="chat-messages__list">
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
    <div class="chat-messages__twitch">
      <template v-if="loading">
        <Loader />
      </template>
      <template v-if="!loading">
        <TwitchSvg />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import ChatMessage from "./ChatMessage.vue";
// @ts-ignore
import TwitchSvg from '../../assets/twitch.svg?component';
import { IMessage } from "../../common/interfaces/index.interface.ts";
import Loader from "../common/Loader.vue";

const props = defineProps<{ loading: boolean; messages: IMessage[]; }>();
const messages = ref<IMessage[]>([]);

onMounted(async () => {
  window.setInterval(async () => {
    messages.value = messages.value.map(message => {
      // remove already hidden messages
      if(!message.show) {
        return undefined;
      }

      // set stale messages to be hidden
      if(!message.timestamp || Date.now() - message.timestamp >= 70000000) {
        message.show = false;
      }

      return message;
    }).filter(message => !!message) as IMessage[];
  }, 1000);
});

watch(props.messages, () => {
  messages.value = props.messages;
});
</script>

<style scoped lang="scss">
@import '../../styles/variables';

$button-icon-size: 38px;

.chat-messages {
  display: grid;
  gap: 10px;
  grid-template-columns: 480px 1fr;

  &__container {
    display: flex;
    flex-direction: column-reverse;
    height: 100vh;
    overflow-anchor: auto;
    position: relative;
  }

  &__list {
    align-items: start;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: start;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__twitch {
    align-items: center;
    align-self: end;
    background-color: rgba(0,0,0,.6);
    border-radius: 50%;
    display: flex;
    height: $twitch-button-size;
    justify-content: center;
    margin-bottom: $twitch-button-offset;
    width: $twitch-button-size;

    svg {
      height: $button-icon-size;
      margin-top: 5px;
      width: $button-icon-size;
    }
  }
}
</style>
