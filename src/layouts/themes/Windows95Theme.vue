<template>
  <ChatWindow
    :active="active"
    :messages="messages"
    :viewers="viewers" />
</template>

<script lang="ts" setup>
  import ChatWindow from "../../components/windows95/ChatWindow.vue";
  import { IMessage } from "../../common/interfaces/index.interface.ts";
  import { TRaidMessage } from "../../common/types/index.type.ts";

  defineProps<{ active: boolean; messages: (IMessage | TRaidMessage)[]; viewers: number }>();
</script>
