<template>
  <ChatWindow />
</template>

<script lang="ts" setup>
  import ChatWindow from "../../components/windows95/ChatWindow.vue";
  import { IMessage } from "../../common/interfaces/index.interface.ts";

  defineProps<{ loading: boolean; messages: IMessage[]; }>();
</script>

<style lang="scss" scoped>

</style>
