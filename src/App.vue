<template>
  <v-app id="inspire">
    <v-app-bar flat>
      <v-container class="fill-height d-flex align-center">
        <v-avatar
          class="me-10 ms-4"
          color="grey-darken-1"
          size="32"
        />

        <v-btn variant="text" @click="shake">
          Random Matrix
        </v-btn>
        <v-btn variant="text" @click="solve">
          Solve
        </v-btn>

        <v-spacer />
      </v-container>
    </v-app-bar>

    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>
          <v-col>
            <v-sheet
              max-width="450px"
              rounded="lg"
            >
              <boggle-matrix :matrix="boggle.matrix" />
            </v-sheet>
          </v-col>

          <v-col>
            <v-sheet rounded="lg">
              <v-sheet v-if="boggle.solving" class="pa-4">
                <v-label class="mr-8">Solving ...</v-label>
                <v-progress-circular
                  v-if="boggle.solving"
                  indeterminate
                  color="primary" />
              </v-sheet>

              <v-list rounded="lg" v-else>
                <v-list-subheader>Solutions</v-list-subheader>
                <v-list-item
                  v-for="word in boggle.solutions"
                  :key="word"
                >
                  <v-list-item-title>
                    {{ word }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import BoggleMatrix from './components/boggle-matrix.vue';

import { injectStrict } from './utils/injected-type';
import { AxiosKey } from './plugins/symbols';

const api = injectStrict(AxiosKey);

// const matrix = [
//   ['t', 'w', 'y', 'r'],
//   ['e', 'n', 'p', 'h'],
//   ['g', 's', 'c', 'r'],
//   ['o', 'n', 's', 'e'],
// ];
// let matrix = [
//   ['-', '-', '-', '-'],
//   ['-', '-', '-', '-'],
//   ['-', '-', '-', '-'],
//   ['-', '-', '-', '-'],
// ];

const boggle = reactive(
  {
    matrix: [
      ['-', '-', '-', '-'],
      ['-', '-', '-', '-'],
      ['-', '-', '-', '-'],
      ['-', '-', '-', '-'],
    ],
    solutions: [],
    solving: false,
  },
);

const shake = async () => {
  try {
    boggle.solutions = [];
    const response = await api.get('/matrix');
    boggle.matrix = response.data;
  } catch (err) {
    console.error(err);
  }
};

const solve = async () => {
  try {
    boggle.solving = true;
    boggle.solutions = [];
    console.log('solving ...');
    const response = await api.post('/solve', boggle.matrix);
    // BoggleMatrix.getSolutions() will include duplicates if the same word is achievable more than
    // one way. We don't really want to see them in the UI, probably, so I only keep unique values.
    boggle.solutions = Array.from(new Set(response.data));
  } catch (err) {
    console.error(err);
  } finally {
    boggle.solving = false;
  }
};

onMounted(() => {
  shake();
});

</script>
