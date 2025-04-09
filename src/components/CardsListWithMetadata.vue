<template>
  <v-list>
    <v-list-item>
      <v-list-item-title class="d-flex align-center justify-space-between">
        <span>
          Cards saved
        </span>
        <span>
          <download-cards-list />
        </span>
      </v-list-item-title>
    </v-list-item>
    <v-list-item
      v-for="(cardItem, index) in savedCardsWithMetadata"
      :key="index"
    >
      <v-list-item-title>
        <v-row class="d-flex align-center justify-space-between">
          <v-col cols="9">
            <span>
              {{ cardItem.card.printed_name ?? cardItem.card.name }}               
            </span>
          </v-col>
          <v-col cols="1">
            <span>
              {{ cardItem.quantity }}
            </span>
          </v-col>
          <v-col cols="1">
            <span>
              <v-number-input
                v-model="cardItem.quantity"
                variant="outlined"
                hide-details
                hide-input
                :onchange="onQuantityChange(cardItem.quantity, index)"
              />
            </span>
          </v-col>
          <v-col cols="1">
            <span>
              <v-fab
                small
                :icon="cardItem.foil ? 'mdi-star' : 'mdi-star-outline'"
                :onchange="saveCards()"
                @click="cardItem.foil = !cardItem.foil"
              />
            </span>
          </v-col>
        </v-row>
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { useCardsStore } from "../stores/cardsStore";

const cardsStore = useCardsStore();
const {savedCardsWithMetadata} = toRefs(cardsStore);
const {initCards, saveCards , onQuantityChange} = cardsStore;

onMounted(() => {
  initCards();
});


</script>
