<template>
  <div class="chat-messages">
    <ul class="chat-messages__list">
      <template
        v-for="message of messages"
        :key="message.id">
        <template v-if="message.msgType && ['raid'].includes(message.msgType)">
          <RaidMessage
            :msg-type="(message as TRaidMessage).msgType"
            :show="(message as TRaidMessage).show"
            :timestamp="(message as TRaidMessage).timestamp"
            :user-image="(message as TRaidMessage).userImage"
            :user-name="(message as TRaidMessage).userName"
            :viewer-count="(message as TRaidMessage).viewerCount" />
        </template>
        <template v-if="message.msgType && ['action', 'chat'].includes(message.msgType)">
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
        <template v-if="message.msgType && ['resub', 'sub', 'subgift'].includes(message.msgType)">
          <SubMessage
            :msg-type="(message as ISubgiftMessage).msgType"
            :recipient="(message as ISubgiftMessage).recipient"
            :sender="(message as ISubgiftMessage).sender"
            :sub-plan-string="(message as ISubgiftMessage).subPlanString" />
        </template>
      </template>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { IMessage, ISubgiftMessage } from "../../common/interfaces/index.interface.ts";
import ChatMessage from "./ChatMessage.vue";
import { TRaidMessage } from "../../common/types/index.type.ts";
import RaidMessage from "./RaidMessage.vue";
import SubMessage from "./SubMessage.vue";

defineProps<{ messages: (IMessage | ISubgiftMessage | TRaidMessage)[]; }>();
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
