<template>
  <v-container>
    <v-btn
      color="primary"
      @click="downloadList()"
    >
      DOWNLOAD DECK LIST
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { useCardsStore } from "../stores/cardsStore";

const cardsStore = useCardsStore();
const {getSavedCardsWithMetadata, resetCardsWithMetadata} = cardsStore;


function downloadList() {
  const cardList = getSavedCardsWithMetadata.value.map((card) => {
    return `${card.quantity} ${card.card.name} (${card.card.set}) ${card.card.collector_number}`
  });
  const blob = new Blob([cardList.join("\n")], {
    type: "text/plain",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "decklist.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  resetCardsWithMetadata()
}

</script>
