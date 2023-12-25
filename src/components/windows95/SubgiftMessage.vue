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
    ein Stufe {{ subPlanString }} Abonnement geschenkt! Vielen Dank!
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
  display: flex;
  justify-content: start;
  text-align: left;
  width: 100%;

  &__emote {
    max-height: $emote-size;
    max-width: $emote-size;
  }

  &__name {
    text-decoration: underline;
  }
}
</style>
