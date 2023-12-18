<template>
  <div class="chat-messages">
    <ul class="chat-messages__list">
      <template
        v-for="message of messages"
        :key="message.id">
        <template v-if="message.msgType === 'raid'">
          <RaidMessage
            :msg-type="message.msgType"
            :show="message.show"
            :timestamp="message.timestamp"
            :user-image="message.userImage"
            :user-name="message.userName"
            :viewer-count="message.viewerCount" />
        </template>
        <template v-if="message.msgType !== 'raid'">
          <ChatMessage
              :available-badges="(message as IMessage).availableBadges"
              :display-name="(message as IMessage).displayName"
              :emotes="(message as IMessage).emotes"
              :id="(message as IMessage).id"
              :msg-id="(message as IMessage).msgId"
              :msg-type="(message as IMessage).msgType"
              :text="(message as IMessage).text"
              :user-badges="(message as IMessage).userBadges"
              :user-name="(message as IMessage).userName" />
        </template>
      </template>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { IMessage } from "../../common/interfaces/index.interface.ts";
import ChatMessage from "./ChatMessage.vue";
import { TRaidMessage } from "../../common/types/index.type.ts";
import RaidMessage from "./RaidMessage.vue";

defineProps<{ messages: (IMessage | TRaidMessage)[]; }>();
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
