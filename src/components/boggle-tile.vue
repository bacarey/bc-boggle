<template>
  <v-card
    class="cube"
    elevation="4"
  >
    <v-card-text
      class="text-center text-capitalize font-weight-bold"
      :style="{fontSize, marginTop, lineHeight: fontSize }"
    >
      {{ props.value }}
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: String,
    default: '-',
  },
  size: {
    type: Number,
    default: 100,
  },
});

const fontSize = computed(() => `${props.size / 3}px`);

const marginTop = computed(() => `${props.size / 6}px`);
</script>

<style scoped>
.cube {
  height: 0;
  padding-bottom: 100%;
  position: relative;
}

.cube > * {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
