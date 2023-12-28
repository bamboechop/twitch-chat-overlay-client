<template>
  <li
    class="chat-message"
    :class="[messageTypeClass]">
    <div class="chat-message__images">
      <img
          :alt="displayName"
          class="chat-message__avatar"
          :src="userImage" />
      <template v-for="badge of userBadges">
        <img
            :alt="badge.description"
            class="chat-message__badge"
            :src="badge.imageUrl" />
      </template>
    </div>
    <div class="chat-message__content-grid">
      <header class="chat-message__header">
        <span class="chat-message__name">
          {{ displayName }}
          <template v-if="displayName?.toLowerCase() !== userName?.toLowerCase()">
            ({{ userName }})
          </template>
        </span>
        <span class="chat-message__timestamp">{{ humanReadableTimestamp }}</span>
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
      <MessageInteraction :viewer-count="viewerCount" />
    </div>
    <audio
      ref="audioPlayer"
      src="chirper.mp3"
      style="display: none"></audio>
  </li>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref, toRefs } from "vue";
  import { IMessage } from "../../common/interfaces/index.interface.ts";
  import { parseMessage, parseUserBadges } from "../../common/helpers/twitch-message.helper.ts";
  import MessageInteraction from "./MessageInteraction.vue";

  const props = defineProps<IMessage>();
  const { msgId, msgType } = toRefs(props);

  const audioPlayer = ref<HTMLAudioElement>();
  const humanReadableTimestamp = ref('');
  const isMeMessage = ref(false);
  const messageParts = ref<Record<string, any>[]>([]);
  const userBadges = ref<{ description: string; id: string; imageUrl: string; title: string }[]>([]);

  const messageTypeClass = computed(() => {
    if(!msgType.value) {
      return;
    }
    const classes = [`chat-message--${msgType.value.toLowerCase()}`];
    if(isMeMessage.value) {
      classes.push(`chat-message--me`);
    }
    if(msgId.value === 'highlighted-message') {
      classes.push(`chat-message--highlighted`);
    }
    return classes.join(' ');
  });

  onMounted(() => {
    messageParts.value = parseMessage(props.emotes, props.text);

    if(props.userBadges) {
      userBadges.value = parseUserBadges(props.userBadges, props.availableBadges);
    }

    if(props.userName) {
      isMeMessage.value = !(['pokemoncommunitygame'].includes(props.userName.toLowerCase()));
    }

    const parsedTimestamp = new Date(props.timestamp ?? Date.now());
    let hours = parsedTimestamp.getHours();
    let minutes = parsedTimestamp.getMinutes();
    humanReadableTimestamp.value = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;

    audioPlayer.value?.play();
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/cities-skylines-ii.variables';

  .chat-message {
    background-color: $background-color;
    border-radius: 5px;
    column-gap: 15px;
    display: grid;
    grid-template-columns: $avatar-size 1fr;
    margin: 0;
    padding: 13px 14px 15px 14px;
    position: relative;
    width: calc(450px - 14px - 14px); // desired width minus 2*padding

    &:last-of-type::after {
      border-bottom: $triangle-short-side solid transparent;
      border-left: $triangle-long-size solid $background-color;
      border-top: $triangle-short-side solid transparent;
      bottom: calc($twitch-button-offset + calc(#{$triangle-short-side} / 2));
      content: '';
      position: absolute;
      height: 0;
      right: -$triangle-long-size;
      width: 0;
    }

    &__avatar {
      border-radius: 50%;
      height: $avatar-size;
      width: $avatar-size;
    }

    &__content-grid {
      color: #47515c;
      display: grid;
      grid-template-rows: repeat(3, min-content);
      row-gap: 12px;
    }

    &__emote {
      max-height: $emote-size;
      max-width: $emote-size;
    }

    &__header {
      align-items: center;
      display: flex;
      justify-content: flex-start;
      margin-top: 5px;
      width: 100%;
    }

    &__images {
      align-items: center;
      display: flex;
      flex-direction: column;
      gap: 5px;
      z-index: 1;
    }

    &__name {
      color: #196a89;
      font-size: 20px;
      font-weight: 500;
      text-align: left;
    }

    &__text {
      font-size: 19px;
      letter-spacing: -.4px;
      line-height: 27px;
      text-align: left;
    }

    &__timestamp {
      font-size: 16px;
      margin: 0 0 2px auto;
    }
  }

  .chat-message--action {
    &:not(.chat-message--me) {
      // TODO figure out how to highlight regular action messages (if highlighting at all)
    }

    &.chat-message--me::before {
      content: '';
      position: absolute;
      border-width: 70px 0 0 70px;
      border-color: transparent transparent transparent #ff4532;
      bottom: 0;
      border-style: solid;
      left: 0;
      border-bottom-left-radius: 5px;
    }
  }

  .chat-message--highlighted {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      border-width: 70px 0 0 70px;
      border-color: transparent transparent transparent #755ebc;
      bottom: 0;
      border-style: solid;
      left: 0;
      border-bottom-left-radius: 5px;
    }
  }
</style>
