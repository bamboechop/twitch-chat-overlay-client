<template>
  <li class="subscription-message">
    <span class="subscription-message__name">{{ displayName }}</span>
    <template v-if="displayName?.toLowerCase() !== userName?.toLowerCase()">
      ({{ userName }})
    </template>
    hat soeben ein {{ subPlanString }} Abonnement abgeschlossen! Dankeschön!
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
