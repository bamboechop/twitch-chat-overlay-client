<template>
  <li class="subgift-message">
    <div class="subgift-message__images">
      <img
        :alt="sender.displayName"
        class="subgift-message__avatar"
        :src="sender.image" />
      <GiftSvg class="subgift-message__gift" />
      <CornerDownRightSvg class="subgift-message__corner-down-right" />
      <img
        :alt="recipient.displayName"
        class="subgift-message__avatar"
        :src="recipient.image" />
    </div>
    <div class="subgift-message__content-grid">
      <header class="subgift-message__header">
        <div class="subgift-message__names">
          <span class="subgift-message__name">
            {{ sender.displayName }}
            <template v-if="sender.displayName?.toLowerCase() !== sender.userName?.toLowerCase()">
              <span class="subgift-message__name subgift-message__name--readable">({{ sender.userName }})</span>
            </template>
          </span>
        </div>
        <span class="subgift-message__timestamp">{{ humanReadableTimestamp }}</span>
      </header>
      <main class="subgift-message__text">
        hat gerade
        <span class="subgift-message__name">
            {{ recipient.displayName }}
            <template v-if="recipient.displayName?.toLowerCase() !== recipient.userName?.toLowerCase()">
              <span class="subgift-message__name subgift-message__name--readable">({{ recipient.userName }})</span>
            </template>
          </span>
        ein Stufe {{ plan }} Abonnement geschenkt! Vielen Dank!
        <img
            alt="bamboe1LOVE"
            class="subgift-message__emote"
            src="/bamboe1LOVE.png" />
      </main>
      <MessageInteraction :viewer-count="viewerCount" />
    </div>
    <audio
      ref="audioPlayer"
      src="/chirper.mp3"
      style="display: none"></audio>
  </li>
</template>

<script lang="ts" setup>
import { ISubGift } from "../../common/interfaces/index.interface.ts";
import MessageInteraction from "./MessageInteraction.vue";
// @ts-ignore
import GiftSvg from '../../assets/gift.svg?component';
// @ts-ignore
import CornerDownRightSvg from '../../assets/corner-down-right.svg?component';
import { onMounted, ref } from "vue";

const props = defineProps<ISubGift>();

const audioPlayer = ref<HTMLAudioElement>();
const humanReadableTimestamp = ref('');

onMounted(() => {
  const parsedTimestamp = new Date(props.timestamp ?? Date.now());
  let hours = parsedTimestamp.getHours();
  let minutes = parsedTimestamp.getMinutes();
  humanReadableTimestamp.value = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;

  audioPlayer.value?.play();
});
</script>

<style lang="scss" scoped>
@import '../../styles/cities-skylines-ii.variables';

.subgift-message {
  background-color: $background-color;
  border-radius: 5px;
  column-gap: 15px;
  display: grid;
  grid-template-columns: 90px 1fr;
  margin: 0;
  padding: 13px 14px 15px 14px;
  position: relative;
  width: calc(450px - 14px - 14px); // desired width minus 2*padding

  &::before {
    content: '';
    position: absolute;
    border-width: 70px 0 0 70px;
    border-color: transparent transparent transparent #ffac12;
    bottom: 0;
    border-style: solid;
    left: 0;
    border-bottom-left-radius: 5px;
  }

  &__avatar {
    border-radius: 50%;
    height: $avatar-size;
    width: $avatar-size;
  }

  &__avatar:last-of-type {
    margin-left: 48px;
  }

  &__content-grid {
    color: #47515c;
    display: grid;
    grid-template-rows: repeat(3, min-content);
    row-gap: 12px;
  }

  &__corner-down-right {
    height: 32px;
    left: 14px;
    position: absolute;
    top: $avatar-size + 12px;
    width: 32px;
  }

  &__emote {
    max-height: $emote-size;
    max-width: $emote-size;
  }

  &__gift {
    height: 20px;
    left: 22px;
    position: absolute;
    top: $avatar-size + 2px;
    width: 20px;
  }

  &__header {
    align-items: center;
    display: flex;
    justify-content: flex-start;
    margin-top: 5px;
    width: 100%;
  }

  &__images {
    color: #000;
    display: flex;
    flex-direction: column;
    gap: 11px;
    position: relative;
  }

  &__name {
    color: #196a89;
    font-size: 20px;
    font-weight: 500;
    line-height: 1.1;
    text-align: left;
  }

  &__name--readable {
    font-size: 16px;
  }

  &__names {
    text-align: left;
  }

  &__text {
    font-size: 19px;
    letter-spacing: -.4px;
    line-height: 27px;
    margin-top: -12px;
    text-align: left;
  }

  &__timestamp {
    align-self: start;
    font-size: 16px;
    margin: 0 0 2px auto;
  }
}
</style>
