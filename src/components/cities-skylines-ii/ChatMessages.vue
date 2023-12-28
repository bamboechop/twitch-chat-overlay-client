<template>
  <div class="chat-messages">
    <div class="chat-messages__container">
      <ul class="chat-messages__list">
        <template
            v-for="message of messages"
            :key="message.id">
          <template v-if="message.msgType === 'action'">
            <Transition appear>
              <ActionMessage v-bind="message" />
            </Transition>
          </template>
          <template v-if="message.msgType === 'chat'">
            <Transition appear>
              chat message
            </Transition>
          </template>
          <template v-if="message.msgType === 'raid'">
            <Transition appear>
              <RaidMessage v-bind="message" />
            </Transition>
          </template>
          <template v-if="message.msgType === 'resub'">
            <Transition appear>
              resub message
            </Transition>
          </template>
          <template v-if="message.msgType === 'subgift'">
            <Transition appear>
              subgift message
            </Transition>
          </template>
          <template v-if="message.msgType === 'subscription'">
            <Transition appear>
              subscription message
            </Transition>
          </template>
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
import { onMounted, ref, toRefs, watch } from 'vue';
import ChatMessage from "./ChatMessage.vue";
// @ts-ignore
import TwitchSvg from '../../assets/twitch.svg?component';
import { IMessage } from "../../common/interfaces/index.interface.ts";
import Loader from "../common/Loader.vue";
import { TMessage } from "../../common/types/index.type.ts";
import RaidMessage from "./RaidMessage.vue";
import ActionMessage from "./ActionMessage.vue";

const props = defineProps<{ loading: boolean; messages: TMessage[]; }>();
const { messages } = toRefs(props);

const internalMessages = ref<TMessage[]>([]);

onMounted(async () => {
  window.setInterval(async () => {
    internalMessages.value = internalMessages.value.map(message => {
      // remove already hidden messages
      if(!message.show) {
        return undefined;
      }

      // set stale messages to be hidden
      if(!message.timestamp || Date.now() - message.timestamp >= 7000) {
        message.show = false;
      }

      return message;
    }).filter(message => !!message) as TMessage[];
  }, 1000);
});

watch(messages.value, () => {
  internalMessages.value = props.messages;
});
</script>

<style scoped lang="scss">
@import '../../styles/cities-skylines-ii.variables';

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
