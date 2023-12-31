<template>
  <li class="chat-message">
    <header class="chat-message__header">
      <div
        v-if="userBadges.length > 0"
        class="chat-message__images">
        <template v-for="badge of userBadges">
          <img
            :alt="badge.description"
            class="chat-message__badge"
            :src="badge.imageUrl" />
        </template>
      </div>
      <span class="chat-message__name">
        {{ displayName }}
        <template v-if="displayName?.toLowerCase() !== userName?.toLowerCase()">
          ({{ userName }})
        </template>
      </span>
    </header>
    <main class="chat-message__text">
      <template v-for="part of messageParts">
        <template v-if="part.type === 'text'">
          <span>{{ part.value }}</span>
        </template>
        <template v-if="part.type === 'emote'">
          <img
            :alt="part.raw"
            class="chat-message__emote"
            :src="part.value" />
        </template>
      </template>
    </main>
  </li>
</template>

<script lang="ts" setup>
  import { IChat } from "../../common/interfaces/index.interface.ts";
  import { onMounted, ref } from "vue";
  import { parseMessage, parseUserBadges } from "../../common/helpers/twitch-message.helper.ts";

  const props = defineProps<IChat>();

  const messageParts = ref<Record<string, string | undefined>[]>([]);
  const userBadges = ref<{ description: string; id: string; imageUrl: string; title: string }[]>([]);

  onMounted(() => {
    messageParts.value = parseMessage(props.emotes, props.text);

    if(props.userBadges) {
      userBadges.value = parseUserBadges(props.userBadges, props.availableBadges);
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/windows95.variables';

  .chat-message {
    color: #000;
    display: grid;
    gap: 4px;
    grid-template-rows: 18px 1fr;
    justify-content: start;
    width: 100%;

    &:not(:last-of-type) {
      border-bottom: 1px solid #868a8e;
      box-shadow: 0 1px 0 #fff;
    }

    &__emote {
      max-height: $emote-size;
      max-width: $emote-size;
    }

    &__header {
      align-items: center;
      display: flex;
      gap: 5px;
    }

    &__images {
      display: flex;
      gap: 2px;
    }

    &__text {
      text-align: left;
    }
  }
</style>
