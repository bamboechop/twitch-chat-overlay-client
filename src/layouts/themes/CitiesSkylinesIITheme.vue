<template>
  <ChatMessages
    :loading="loading"
    :messages="messages" />
</template>

<script lang="ts" setup>
  import ChatMessages from "../../components/cities-skylines-ii/ChatMessages.vue";
  import { IMessage } from "../../common/interfaces/index.interface.ts";

  defineProps<{ loading: boolean; messages: IMessage[]; }>();
</script>
