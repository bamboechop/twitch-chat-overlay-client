<template>
  <li class="subgift-message">
    <span class="subgift-message__name">{{ sender.displayName }}</span>
    <template v-if="sender.displayName?.toLowerCase() !== sender.userName?.toLowerCase()">
      ({{ sender.userName }})
    </template>
    hat gerade
    <span class="subgift-message__name">{{ recipient.displayName }}</span>
    <template v-if="recipient.displayName?.toLowerCase() !== recipient.userName?.toLowerCase()">
      ({{ recipient.userName }})
    </template>
    ein Stufe {{ plan }} Abonnement geschenkt! Vielen Dank!
    <img
      alt="bamboe1LOVE"
      class="subgift-message__emote"
      src="/bamboe1LOVE.png" />
  </li>
</template>

<script lang="ts" setup>
import { ISubGift } from "../../common/interfaces/index.interface.ts";

defineProps<ISubGift>();
</script>

<style lang="scss" scoped>
@import '../../styles/variables';

.subgift-message {
  color: #000;
  text-align: left;
  padding-right: calc(2px + #{$highlight-element-size});
  position: relative;
  width: 100%;

  &::before {
    background-color: #ffac12;
    bottom: 0;
    content: '';
    position: absolute;
    right: 0;
    top: -9px;
    width: $highlight-element-size;
  }

  &:not(:last-of-type) {
    border-bottom: 1px solid #868a8e;
    box-shadow: 0 1px 0 #fff;
  }

  &__emote {
    max-height: $emote-size;
    max-width: $emote-size;
  }

  &__name {
    text-decoration: underline;
  }
}
</style>
