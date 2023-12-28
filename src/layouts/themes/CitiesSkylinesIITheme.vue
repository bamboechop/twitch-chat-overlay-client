<template>
  <ChatMessages
    :loading="loading"
    :messages="messages" />
</template>

<script lang="ts" setup>
  import ChatMessages from "../../components/cities-skylines-ii/ChatMessages.vue";
  import { TMessage } from "../../common/types/index.type.ts";

  defineProps<{ loading: boolean; messages: TMessage[]; }>();
</script>

<style lang="scss">
  body[data-theme="cities-skylines-ii"] #chat {
    max-width: calc(480px + 62px + 10px + 13px); /* 480px chat message, 62px twitch button, 10px gap between message and button, 13px spacing to right edge */
  }
</style>
