
<template>
  <v-container>
    <v-col
      v-if="!!getShowingCard"
    >
      <v-container
        max-width="300"
        style="position: relative"
        @click="addToSavedCards()"
      >
        <v-img
          align="center"
          justify="center"
          :src="getShowingCard?.image_uris?.normal ?? getShowingCard.card_faces?.['0'].image_uris?.normal"
          :alt="getShowingCard?.name"
        />
        <v-progress-linear
          :model-value="getProgress"
          height="4"
          max-width="300"
          color="blue"
        />
      </v-container>
    </v-col>
    <v-col
      v-if="!getShowingCard"
    >
      <v-container
        max-width="300"
        style="position: relative"
        @click="addToSavedCards()"
      >
        <v-img
          align="center"
          justify="center"
          src="https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg"
          alt="back of a magic card"
        />
      </v-container>
    </v-col>
  </v-container>
</template>

<script setup lang="ts">
import { useCardsStore } from "../stores/cardsStore";
const cardsStore = useCardsStore();
const {addToSavedCards, getProgress, getShowingCard} = cardsStore;
</script>
