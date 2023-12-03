<template>
  <li class="chat-message">
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
      <div class="chat-message__interactions">
        {{ interactionCount }}
        <HeartSvg
          class="chat-message__heart"
          :class="{ 'chat-message__heart--filled': heartFilled }" />
      </div>
    </div>
    <audio
      ref="audioPlayer"
      src="chirper.mp3"
      style="display: none"></audio>
  </li>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from "vue";
  // @ts-ignore
  import HeartSvg from '../../assets/heart.svg?component';
  import { IMessage } from "../../common/interfaces/index.interface.ts";
  import { parseMessage, parseUserBadges } from "../../common/helpers/twitch-message.helper.ts";

  const props = defineProps<IMessage>();

  const audioPlayer = ref<HTMLAudioElement>();
  const heartFilled = Math.random() > .9;
  const humanReadableTimestamp = ref('');
  const interactionCount = ref('0');
  const messageParts = ref<Record<string, any>[]>([]);
  const userBadges = ref<{ description: string; id: string; imageUrl: string; title: string }[]>([]);

  onMounted(() => {
    messageParts.value = parseMessage(props.emotes, props.text);

    if(props.userBadges) {
      userBadges.value = parseUserBadges(props.userBadges, props.availableBadges);
    }

    const parsedTimestamp = new Date(props.timestamp ?? Date.now());
    let hours = parsedTimestamp.getHours();
    let minutes = parsedTimestamp.getMinutes();
    humanReadableTimestamp.value = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;

    const count = Math.floor(Math.random() * (props.viewerCount + 1));
    // noinspection TypeScriptValidateTypes - WebStorm seems to not be up2date for NumberFormat
    interactionCount.value = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 1,
      notation: 'compact',
    }).format(heartFilled ? count + 1 : count);

    audioPlayer.value?.play();
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/variables';

  $avatar-size: 42px;
  $background-color: rgba(225, 225, 225, 0.85);
  $emote-size: 28px;
  $triangle-long-size: 30px;
  $triangle-short-side: 20px;

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

    &:last-of-type::before {
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

    &__heart {
      height: 19px;
    }

    &__heart--filled {
      color: #ff4646;
      fill: #ff4646;
    }

    &__images {
      align-items: center;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    &__interactions {
      align-items: center;
      color: #6f7984;
      display: flex;
      font-size: 16px;
      gap: 4px;
      justify-content: flex-end;
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
</style>