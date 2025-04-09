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
  //Count	TradelistCount	Name	Edition	Condition	Language	Foil	Tags	LastModified	CollectorNumber	Alter	Proxy	PurchasePrice
  console.log(getSavedCardsWithMetadata.value);
  // const ids = getSavedCardsWithMetadata.value.map((card) => card.card.id);
   const str = 'Count,Name,Foil,Condition,ScryfallID\n';
  const cardList = getSavedCardsWithMetadata.value.map((card) => {
  // const str = 'Count,Name,Edition,Condition,Language,Foil,CollectorNumber,ScryfallID\n';
    // return [
    //   card.quantity,
    //   card.card.name,
    //   card.card.set_name,
    //   'NM',
    //   card.card.lang,
    //   card.foil ? "Foil" : "Non-Foil",
    //   card.card.collector_number,
    //   card.card.id,
    // ].join(",");
    return [
      card.quantity,
      card.card.name,
      card.foil ? "Foil" : "Non-Foil",
      'NM',
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
