<template>
  <ChatWindow
    :messages="messages"
    :viewers="viewers" />
</template>

<script lang="ts" setup>
  import ChatWindow from "../../components/windows95/ChatWindow.vue";
  import { IMessage } from "../../common/interfaces/index.interface.ts";

  defineProps<{ loading: boolean; messages: IMessage[]; viewers: number }>();
</script>

<style lang="scss" scoped>

</style>
