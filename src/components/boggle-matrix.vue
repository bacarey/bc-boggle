<template>
  <v-container
    ref="outerContainer"
    fill-height
    class="bg-blue-grey"
  >
    <v-row class="justify-center align-center">
      <v-col
        v-for="(cube, index) in cubeValues "
        :key="index"
        cols="3"
        class="ma-0 pa-1"
      >
        <boggle-tile
          :value="cube"
          :size="cubeHeight"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {
  computed, ref, reactive, onMounted, onUnmounted,
} from 'vue';
import BoggleTile from './boggle-tile.vue';

const outerContainer = ref(null);

const props = defineProps({
  // eslint-disable-next-line vue/require-default-prop
  matrix: {
    type: Array,
  },
});

const cubeValues = computed(() => {
  const vals = [];
  props.matrix.forEach((row) => {
    row.forEach((col) => {
      vals.push(col);
    });
  });
  return vals;
});

const matrixWidth = reactive({
  value: outerContainer?.value?.$el.clientWidth || 400,
});

const recalc = () => {
  matrixWidth.value = outerContainer?.value?.$el.clientWidth || 400;
};

const cubeHeight = computed(() => matrixWidth.value / 4);

onMounted(() => {
  recalc();
});

onMounted(() => {
  window.addEventListener('resize', recalc);
});

onUnmounted(() => {
  window.removeEventListener('resize', recalc);
});

</script>

<style scoped>

</style>
