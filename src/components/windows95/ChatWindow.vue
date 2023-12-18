<template>
  <div class="chat-window">
    <ProgramTitleBar
        :active="active"
        icon-path="/windows-95/chat.icon.png"
        title="Chat" />
    <ProgramButtonBar />
    <ChatMessages :messages="messages" />
    <EnterMessage />
    <ProgramBottomBar :viewers="viewers" />
  </div>
</template>

<script lang="ts" setup>
import ProgramTitleBar from "./ProgramTitleBar.vue";
import ProgramButtonBar from "./ProgramButtonBar.vue";
import EnterMessage from "./EnterMessage.vue";
import ProgramBottomBar from "./ProgramBottomBar.vue";
import { IMessage } from "../../common/interfaces/index.interface.ts";
import ChatMessages from "./ChatMessages.vue";
import { TRaidMessage } from "../../common/types/index.type.ts";

defineProps<{ active: boolean; messages: (IMessage | TRaidMessage)[]; viewers: number }>();
</script>

<style lang="scss" scoped>
  .chat-window {
    border-bottom: 2px solid #000;
    border-left: 2px solid #efefef;
    border-right: 2px solid #000;
    border-top: 2px solid #efefef;
    display: grid;
    gap: 2px;
    grid-template-rows: 18px 18px 1fr 20px 20px;
    height: 100%;
    padding: 2px;
  }
</style>
