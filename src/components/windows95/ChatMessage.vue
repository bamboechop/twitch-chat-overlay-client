<template>
  <li
    class="chat-message"
    :class="[messageTypeClass]">
    <header class="chat-message__header">
      <div
        v-if="userBadges.length > 0"
        class="chat-message__images">
        <template v-for="badge of userBadges">
          <img
              :alt="badge.description"
              class="chat-message__badge"
              :src="badge.imageUrl" />
        </template>
      </div>
      <span class="chat-message__name">
        {{ displayName }}
        <template v-if="displayName?.toLowerCase() !== userName?.toLowerCase()">
          ({{ userName }})
        </template>
      </span>
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
  </li>
</template>

<script lang="ts" setup>
  import { IMessage } from "../../common/interfaces/index.interface.ts";
  import { computed, onMounted, ref, toRefs } from "vue";
  import { parseMessage, parseUserBadges } from "../../common/helpers/twitch-message.helper.ts";

  const props = defineProps<Pick<IMessage, 'availableBadges' | 'displayName' | 'emotes' | 'msgId' | 'msgType' | 'text' | 'userBadges' | 'userName'>>();
  const { msgId, msgType } = toRefs(props);
  const isMeMessage = ref(false);

  const messageParts = ref<Record<string, string | undefined>[]>([]);
  const userBadges = ref<{ description: string; id: string; imageUrl: string; title: string }[]>([]);

  const messageTypeClass = computed(() => {
    if(!msgType.value) {
      return;
    }
    const classes = [`chat-message--${msgType.value.toLowerCase()}`];
    if(isMeMessage.value) {
      classes.push(`chat-message--me`);
    }
    if(msgId.value === 'highlighted-message') {
      classes.push(`chat-message--highlighted`);
    }
    return classes.join(' ');
  });

  onMounted(() => {
    messageParts.value = parseMessage(props.emotes, props.text);

    if(props.userName) {
      isMeMessage.value = !(['pokemoncommunitygame'].includes(props.userName.toLowerCase()));
    }

    if(props.userBadges) {
      userBadges.value = parseUserBadges(props.userBadges, props.availableBadges);
    }
  });
</script>

<style lang="scss" scoped>
  $emote-size: 24px;

  .chat-message {
    color: #000;
    display: grid;
    gap: 4px;
    grid-template-rows: 18px 1fr;
    justify-content: start;
    width: 100%;

    &:not(:last-of-type) {
      border-bottom: 1px solid #868a8e;
      box-shadow: 0 1px 0 #fff;
    }

    &__emote {
      max-height: $emote-size;
      max-width: $emote-size;
    }

    &__header {
      align-items: center;
      display: flex;
      gap: 5px;
    }

    &__images {
      display: flex;
      gap: 2px;
    }

    &__text {
      text-align: left;
    }
  }

  .chat-message--action {
    &:not(.chat-message--me) {
      // TODO figure out how to highlight regular action messages (if highlighting at all)
    }

    &.chat-message--me {
      padding-left: 32px;
      position: relative;
      .chat-message__text::before {
        content: '/me';
        font-size: 18px;
        left: 0;
        opacity: .5;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  .chat-message--highlighted {
    $highlight-element-size: 16px;

    position: relative;

    &::before {
      background-color: #755ebc;
      bottom: 0;
      content: '';
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      width: $highlight-element-size;
    }

    .chat-message__text {
      padding-right: calc(2px + #{$highlight-element-size});
    }
  }
</style>
