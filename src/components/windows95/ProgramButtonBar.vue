<template>
  <div class="program-button-bar">
    <template v-for="button of buttons">
      <button
        class="program-button-bar__button"
        :style="`--keyboard-shortcut-width: ${button.keyboardShortcutWidth}`"
        type="button">
        {{ button.title }}
      </button>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const buttons = ref([{ keyboardShortcutWidth: '6px', title: 'File' }, { keyboardShortcutWidth: '7px', title: 'Edit' }, { keyboardShortcutWidth: '8px', title: 'View' }, { keyboardShortcutWidth: '8px', title: 'Help' }]);
</script>

<style lang="scss" scoped>
  .program-button-bar {
    display: flex;
    justify-self: start;

    &__button {
      appearance: none;
      background-color: transparent;
      border: 0;
      color: #000;
      font-family: inherit;
      font-size: inherit;
      height: 18px;
      position: relative;

      &::before {
        background-color: #000;
        bottom: 3px;
        content: '';
        height: 1px;
        position: absolute;
        width: var(--keyboard-shortcut-width);
      }
    }
  }
</style>