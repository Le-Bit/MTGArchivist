<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="6">
        <CardsListWithMetadata />
      </v-col>
      <v-col cols="2">
        <LangSelector />
      </v-col>
      <v-col cols="2">
        <SetCodeSelector />
      </v-col>
      <v-col cols="2">
        <CollectorNumberSelector />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
      </v-col>
      <v-col cols="6">
        <CardDisplay />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import LangSelector from "../components/LangSelector.vue";
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
