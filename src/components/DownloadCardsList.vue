<template>
  <v-container>
    <v-btn
      color="primary"
      @click="downloadList()"
    >
      DOWNLOAD
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { useCardsStore } from "../stores/cardsStore";

const cardsStore = useCardsStore();
const {getSavedCardsWithMetadata, resetCardsWithMetadata} = cardsStore;


function downloadList() {
  console.log(getSavedCardsWithMetadata.value);
  const str = 'Count,lang,foil,ScryfallID\n';
  const cardList = getSavedCardsWithMetadata.value.map((card) => {
    return [
      card.quantity,
      card.lang,
      card.foil ? "Foil" : "Non-Foil",
      card.card.id,
    ].join(",");
  });
  const blob = new Blob([str + cardList.join(",\n")], {
    type: "text/plain",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cards.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  resetCardsWithMetadata()
}

</script>
