<template>
  <div class="chat-messages">
    <ul class="chat-messages__list">
      <template
        v-for="message of messages"
        :key="message.id">
        <ChatMessage
          :available-badges="message.availableBadges"
          :display-name="message.displayName"
          :emotes="message.emotes"
          :id="message.id"
          :msg-id="message.msgId"
          :msg-type="message.msgType"
          :text="message.text"
          :user-badges="message.userBadges"
          :user-name="message.userName" />
      </template>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { IMessage } from "../../common/interfaces/index.interface.ts";
import ChatMessage from "./ChatMessage.vue";

defineProps<{ messages: IMessage[]; }>();
</script>

<style lang="scss" scoped>
  .chat-messages {
    border-bottom: 1px solid #fff;
    border-left: 1px solid #7f7f7f;
    border-right: 1px solid #fff;
    border-top: 1px solid #7f7f7f;
    display: flex;
    flex-direction: column-reverse;
    height: 100%;
    overflow-anchor: auto;
    overflow: hidden;
    padding: 4px;
    position: relative;

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
  }
</style>
