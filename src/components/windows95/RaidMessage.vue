<template>
  <li class="raid-message">
    <span class="raid-message__name">{{ userName }}</span> is raiding with {{ viewerCount }} viewers!
  </li>
</template>

<script lang="ts" setup>
import { TRaidMessage } from "../../common/types/index.type.ts";

defineProps<TRaidMessage>();
</script>

<style lang="scss" scoped>
@import '../../styles/variables';

.raid-message {
  line-height: 1;
  padding: 0 calc(2px + #{$highlight-element-size}) 7px 0;
  position: relative;
  text-align: left;
  width: 100%;

  &:not(:last-of-type) {
    border-bottom: 1px solid #868a8e;
    box-shadow: 0 1px 0 #fff;
  }

  &::before {
    background-color: #9ab800;
    bottom: 0;
    content: '';
    position: absolute;
    right: 0;
    top: -9px;
    width: $highlight-element-size;
  }

  &__name {
    position: relative;

    &::before {
      background-color: #000;
      bottom: -2px;
      content: '';
      height: 1px;
      position: absolute;
      width: 100%;
    }
  }
}
</style>
