<template>
  <li class="subscription-message">
    <span class="subscription-message__name">{{ displayName }}</span>
    <template v-if="displayName?.toLowerCase() !== userName?.toLowerCase()">
      ({{ userName }})
    </template>
    hat soeben ein Stufe {{ plan }} Abonnement abgeschlossen! Dankeschön!
    <img
      alt="bamboe1LOVE"
      class="subscription-message__emote"
      src="/bamboe1LOVE.png" />
  </li>
</template>

<script lang="ts" setup>
import { ISubscription } from "../../common/interfaces/index.interface.ts";

defineProps<ISubscription>();
</script>

<style lang="scss" scoped>
@import '../../styles/variables';

.subscription-message {
  color: #000;
  padding-right: calc(2px + #{$highlight-element-size});
  position: relative;
  text-align: left;
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
