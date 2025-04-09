<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <SetCodeSelector />
      </v-col>
      <v-col>
        <CollectorNumberSelector />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <CardsList />
      </v-col>
      <v-col cols="4">
        <CardDisplay />
      </v-col>
      <v-col cols="4">
        <DownloadCardsList />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useCardsStore } from "../stores/cardsStore";
const cardsStore = useCardsStore();
const {addToSavedCards, dismissCards, getShowingCard } = cardsStore;
let collectorNumberSelector = null

onMounted(() => {
  window.addEventListener("keydown", handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleGlobalKeydown);
});


function handleGlobalKeydown(event: KeyboardEvent) {
  collectorNumberSelector = document.activeElement;
    if (collectorNumberSelector && (collectorNumberSelector.tagName === "INPUT" || collectorNumberSelector.tagName === "TEXTAREA")) {
     return; 
    }
  if (event.key === "Enter" && !!getShowingCard) {
    addToSavedCards(); 
  }
  if (event.key === "Backspace" && !!getShowingCard) {
    dismissCards();
  }
}

</script>
