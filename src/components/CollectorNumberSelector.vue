<template>
  <div>
    <v-number-input
      v-model="collectorNumber"
      label="Collector number"
      @keyup.enter="onSearch"
      @click:append="onSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { useSetStore } from "../stores/setStore";
import { useCardsStore } from "../stores/cardsStore";

const setStore = useSetStore();
const cardsStore = useCardsStore();
const {collectorNumber} = toRefs(cardsStore);
const {saveCard} = cardsStore;
const {getSelectedSet} = setStore;


function onSearch() {
  saveCard(document.activeElement, collectorNumber, getSelectedSet)
}
</script>
