<template>
  <v-container>
    <v-fab
      color="primary"
      icon="$vuetify"
      @click="downloadList()"
    />
  </v-container>
</template>

<script setup lang="ts">
import { useCardsStore } from "../stores/cardsStore";

const cardsStore = useCardsStore();
const {getSavedCards} = cardsStore;


function downloadList() {
  //Count	TradelistCount	Name	Edition	Condition	Language	Foil	Tags	LastModified	CollectorNumber	Alter	Proxy	PurchasePrice
  const ids = getSavedCards.value.map((card) => card.id);
  const blob = new Blob(["ScryfallIds,\n" + ids.join(",\n")], {
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
}

</script>
