<template>
  <li
    class="sub-message"
    :class="[messageTypeClass]">
    <header class="sub-message__header">
      {{ sender.displayName }}
      <template v-if="sender.displayName?.toLowerCase() !== sender.userName?.toLowerCase()">
        ({{ sender.userName }})
      </template>
      hat gerade {{ recipient.displayName }}
      <template v-if="recipient.displayName?.toLowerCase() !== recipient.userName?.toLowerCase()">
        ({{ recipient.userName }})
      </template>
      ein Stufe {{ subPlanString }} Abonnement geschenkt!
    </header>
  </li>
</template>

<script lang="ts" setup>
import { ISubgiftMessage } from "../../common/interfaces/index.interface.ts";
import { computed, toRefs } from "vue";

const props = defineProps<Pick<ISubgiftMessage, 'msgType' | 'recipient' | 'sender' | 'subPlanString'>>();
const { msgType } = toRefs(props);

const messageTypeClass = computed(() => {
  if(!msgType.value) {
    return;
  }
  const classes = [`sub-message--${msgType.value.toLowerCase()}`];
  return classes.join(' ');
});
</script>

<style lang="scss" scoped>
@import '../../styles/variables';

.sub-message {
  display: flex;
  justify-content: start;
  text-align: left;
  width: 100%;

  &:not(.sub-message--subgift) {
    display: grid;
    gap: 4px;
    grid-template-rows: 18px 1fr;
  }
}

.sub-message--sub,
.sub-message--subgift {
  padding-right: calc(2px + #{$highlight-element-size});
  position: relative;

  &::before {
    background-color: #e939ce;
    bottom: 0;
    content: '';
    position: absolute;
    right: 0;
    top: -9px;
    width: $highlight-element-size;
  }
}
</style>
