<template>
  <ChatWindow
    :active="active"
    :messages="messages"
    :viewers="viewers" />
</template>

<script lang="ts" setup>
  import ChatWindow from "../../components/windows95/ChatWindow.vue";
  import { TMessage } from "../../common/types/index.type.ts";

  defineProps<{ active: boolean; messages: TMessage[]; viewers: number }>();
</script>
