<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <v-select
          v-model="selectedSet"
          label="SET CODE"
          :items="setsName"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="collectorNumber"
          label="Search"
          outlined
          clearable
          append-icon="mdi-magnify"
          @keyup.enter="onSearch"
          @click:append="onSearch"
        />
      </v-col>
    </v-row>
    <v-row
      align="center"
      justify="center"
      class="ma-4"
    >
      <v-list>
        <v-list-item
          v-for="(cardItem, index) in cards"
          :key="index"
        >
          {{ cardItem.name }}
        </v-list-item>
      </v-list>
      <v-col v-if="showImage">
        <v-container
          max-width="300"
          style="position: relative;"
          @click="addToCards()"
        >
          <v-img
            align="center"
            justify="center"
            :src="card.image_uris?.normal"
            :alt="card.name"
          />
          <v-progress-linear
            :model-value="progress"
            height="4"
            max-width="300"
            color="blue"
          />
        </v-container>
      </v-col>
    </v-row>
    <v-fab
      color="primary"
      icon="$vuetify"
      @click="downloadList()"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Sets, type Set, Cards, type Card } from "scryfall-api";

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
});


const collectorNumber = ref('3' as unknown as number);
const sets = ref([] as unknown as Set[]);
const selectedSet = ref('FDN' as string);

const setsName = ref([] as string[]);
const card = ref('' as unknown as Card);
const cards = ref([] as unknown as Card[]);
const showImage = ref(false);
const progress = ref(0);
const TIME_OUT = 5000;
const INTERVAL_VALUE = 100;
const PROGRESS_INTERVAL = TIME_OUT / 100
const searchBar = ref({} as unknown as HTMLElement);
let interval: number = 0;

Sets.all()
  .then((response) => {
    console.log("Response:", response);
    sets.value = response;
    setsName.value = response.map((set) => set.code.toUpperCase());
  })
  .catch((error) => {
    console.error("Error fetching sets:", error);
  });

function handleGlobalKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && showImage.value === true) {
    addToCards();
    setTimeout(() => searchBar.value.focus(), 100);
    collectorNumber.value =  '' as unknown as number;
  }
  if (event.key === 'Backspace' && showImage.value === true) {
    showImage.value = false;
    progress.value = 0;
    clearInterval(interval);
    setTimeout(() => searchBar.value.focus(), 100);
    collectorNumber.value =  '' as unknown as number;
  }
}

function addToCards() {
  showImage.value = false;
  progress.value = 0;
  clearInterval(interval);
  cards.value.push(card.value);
}

function downloadList() {
const ids = cards.value.map((card) => card.id);

  const blob = new Blob(['ScryfallIds,\n' + ids.join(',\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cards.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function onSearch() {
  searchBar.value = document.activeElement as HTMLElement;
  if (searchBar.value) {
    searchBar.value.blur();
  }

  Cards.bySet(selectedSet.value, collectorNumber.value)
    .then((response) => {
      if (response === undefined) {
        return;
      }
      card.value = response;
      console.log("showing 1 b")
      showImage.value = true;
      console.log("showing 1 a")
      progress.value = TIME_OUT / PROGRESS_INTERVAL;
      const length = cards.value.length
      interval = setInterval(() => {
        if (cards.value.length > length) {
          clearInterval(interval);
          progress.value = 0;
          showImage.value = false;
          return;
        }
        progress.value -= INTERVAL_VALUE / PROGRESS_INTERVAL;
        if (progress.value <= 0) {
          clearInterval(interval);
          if (showImage.value === true) {
            addToCards();
          }
        }
      }, INTERVAL_VALUE);
    })
    .catch((error) => {
      console.error("Error fetching search results:", error);
    });
}
</script>