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
      <div class="chat-message__text">
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
      </div>
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
import { getEmoteAsUrl, parseEmotesInMessage } from 'tmi-utils';
import { onMounted, ref } from "vue";
import HeartSvg from '../assets/heart.svg?component';
import { IMessage } from "../interfaces/index.interface";

  const props = defineProps<IMessage>();

  const audioPlayer = ref<HTMLAudioElement>();
  const heartFilled = Math.random() > .9;
  const humanReadableTimestamp = ref('');
  const interactionCount = ref('0');
  const messageParts = ref<Record<string, any>[]>([]);
  const userBadges = ref<{ description: string; id: string; imageUrl: string; title: string }[]>([]);

  onMounted(() => {
    for(const messagePart of parseEmotesInMessage(props.emotes as Record<string, string[]>, props.text)) {
      messageParts.value.push({
        raw: messagePart.raw,
        type: messagePart.type,
        value: messagePart.type === 'emote' ? getEmoteAsUrl(messagePart.value) : messagePart.value,
      });
    }
    const parsedTimestamp = new Date(props.timestamp ?? Date.now());
    let hours = parsedTimestamp.getHours();
    let minutes = parsedTimestamp.getMinutes();
    humanReadableTimestamp.value = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;

    if(props.userBadges) {
      for(const [key, value] of Object.entries(props.userBadges)) {
        const badge = props.availableBadges[key].find(badge => badge.id === value);
        if(badge) {
          userBadges.value.push(badge);
        }
      }
    }

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
  $avatar-size: 42px;
  $emote-size: 28px;

  $background-color: rgba(189, 190, 190, 0.8);

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
      border-bottom: 20px solid transparent;
      border-left: 30px solid $background-color;
      border-top: 20px solid transparent;
      content: '';
      position: absolute;
      height: 0;
      right: -30px;
      top: 50%;
      transform: translateY(-50%);
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
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      font-size: 19px;
      letter-spacing: -.4px;
      line-height: 27px;
      text-align: left;
      word-break: break-word;
      white-space: pre-wrap;
    }

    &__timestamp {
      font-size: 16px;
      margin: 0 0 2px auto;
    }
  }
</style>