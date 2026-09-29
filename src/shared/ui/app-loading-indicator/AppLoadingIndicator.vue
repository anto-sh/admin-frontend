<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  to?: string
  fullscreen?: boolean
  shouldCatchFocus?: boolean
  isShow: boolean
}>()

const indicatorClasses = computed(() => ({
  'app-loading-indicator--fullscreen': props.fullscreen,
}))
</script>

<template>
  <teleport :to="props.to" :disabled="!props.to">
    <Transition name="fade">
      <div v-show="props.isShow" class="app-loading-indicator" :class="indicatorClasses">
        <div tabindex="0" class="app-loading-indicator__overlay" />
        <div class="app-loading-indicator__icon" />
      </div>
    </Transition>
  </teleport>
</template>

<style lang="scss">
.app-loading-indicator {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  width: 100%;
  height: 100%;

  &:focus {
    outline: none;
  }

  &__icon {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    width: 40px;
    height: 40px;
    background-repeat: no-repeat;
    background-size: contain;
    animation: spinnerAnimation 0.6s infinite linear;
    background-image: url('./spinner-icon.svg');
    filter: invert(1);
  }

  &__overlay {
    width: 100%;
    height: 100%;
    background-color: var(--p-surface-700);
    opacity: 0.7;
  }

  &--fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
}

@keyframes spinnerAnimation {
  0% {
    transform: translate(-50%, -50%) rotate(0);
  }

  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
