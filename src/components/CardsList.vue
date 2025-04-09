<template>
  <v-list>
    <v-list-item
      v-for="(cardItem, index) in getSavedCards"
      :key="index"
    >
      <v-tooltip
        location="top"
        origin="auto"
        no-click-animation
      >
        <template #activator="{ props }">
          <v-list-item-title v-bind="props">
            {{ cardItem.name }}
          </v-list-item-title>
        </template>

        <div>
          <v-img
            align="center"
            justify="center"
            :src="cardItem.image_uris?.normal"
            :alt="cardItem.name"
            min-width="200"
          />
        </div>
      </v-tooltip>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { useCardsStore } from "../stores/cardsStore";

const cardsStore = useCardsStore();
const {getSavedCards} = cardsStore;

</script>
