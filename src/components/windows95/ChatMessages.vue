<template>
  <div class="chat-messages">
    <ul class="chat-messages__list">
      <template
        v-for="message of messages"
        :key="message.id">
        <template v-if="message.msgType === 'action'">
          <ActionMessage v-bind="message" />
        </template>
        <template v-if="message.msgType === 'chat'">
          <ChatMessage v-bind="message" />
        </template>
        <template v-if="message.msgType === 'raid'">
          <RaidMessage v-bind="message" />
        </template>
        <template v-if="message.msgType === 'resub'">
          <ResubMessage v-bind="message" />
        </template>
        <template v-if="message.msgType === 'subgift'">
          <SubgiftMessage v-bind="message" />
        </template>
        <template v-if="message.msgType === 'subscription'">
          <SubscriptionMessage v-bind="message" />
        </template>
      </template>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import ChatMessage from "./ChatMessage.vue";
import { TMessage } from "../../common/types/index.type.ts";
import RaidMessage from "./RaidMessage.vue";
import ActionMessage from "./ActionMessage.vue";
import ResubMessage from "./ResubMessage.vue";
import SubgiftMessage from "./SubgiftMessage.vue";
import SubscriptionMessage from "./SubscriptionMessage.vue";

defineProps<{ messages: TMessage[]; }>();
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
