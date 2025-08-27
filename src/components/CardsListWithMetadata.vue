<template>
  <v-list>
    <v-list-item> 
      <v-list-item-title class="d-flex align-center justify-space-between"> 
        <span> Cards saved: {{ cardsCount }} </span>
        <span> 
          <download-cards-list /> 
          <download-deck-list /> 
        </span> 
      </v-list-item-title>
    </v-list-item>
    <v-list-item v-for="(cardItem, index) in savedCardsWithMetadata" :key="index">
      <v-tooltip location="top">
        <template #activator="{ props }">
          <v-list-item-title v-bind="props">
            <v-row class="d-flex align-center justify-space-between">
              <v-col cols="8">
                <span>
                  {{ cardItem.card.printed_name ?? cardItem.card.name }}
                </span>
              </v-col>
              <v-col cols="1">
                <span>{{ cardItem.lang }}</span>
              </v-col>
              <v-col cols="1">
                <span>{{ cardItem.quantity }}</span>
              </v-col>
              <v-col cols="1">
                <v-number-input v-model="cardItem.quantity" variant="outlined" hide-details hide-input
                  :onchange="onQuantityChange(cardItem.quantity, index)" />
              </v-col>
              <v-col cols="1">
                <v-fab small :icon="cardItem.foil ? 'mdi-star' : 'mdi-star-outline'" :onchange="saveCards()"
                  @click="setFoil(index)" />
              </v-col>
            </v-row>
          </v-list-item-title>
        </template>
 
        <div style="width: 250px; height: auto;">
    <v-img
      :src="cardItem.card?.image_uris?.normal"
      max-width="250"
      max-height="350"
      contain
    />
  </div>
      </v-tooltip>
    </v-list-item>

  </v-list>
</template>

<script setup lang="ts">
import { useCardsStore } from "../stores/cardsStore";

const cardsStore = useCardsStore();
const { savedCardsWithMetadata, cardsCount } = toRefs(cardsStore);
const { initCards, saveCards, onQuantityChange, setFoil } = cardsStore;

onMounted(() => {
  initCards();
});


</script>
