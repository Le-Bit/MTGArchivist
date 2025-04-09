<template>
  <div>
    <v-select
      v-model="selectedLang"
      label="Lang"
      :items="getLang"
    />
  </div>
</template>

<script setup lang="ts">
import { useCardsStore } from "../stores/cardsStore";
const cardStore = useCardsStore();
const { selectedLang } = toRefs(cardStore);
const { getLang } = cardStore;



</script>



