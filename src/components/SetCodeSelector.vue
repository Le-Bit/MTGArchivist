<template>
  <div>
        <v-select
  v-model="selectedSetString"
  label="Set code"
  :items="getSets"
>
  <template #item="{ item, props }">
    <v-list-item v-bind="props">
      <template #title>
        <span>
          {{ item.raw.title + ' - ' + item.raw.name }}
          <img :src="item.raw.img" height="32" />
        </span>
      </template>
    </v-list-item>
  </template>
</v-select>
  </div>
</template>

<script setup lang="ts">
import { useSetStore } from "../stores/setStore";
const setStore = useSetStore();
const { selectedSetString , getSets} = toRefs(setStore);
const { initializeSets } = setStore;

onMounted(async () => {
  await initializeSets();
});


</script>

<style scoped>
img {
   -webkit-filter: invert(1);
   filter: invert(1);
   }
</style>


