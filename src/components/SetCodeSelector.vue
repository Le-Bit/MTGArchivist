<template>
  <div>
    <v-select
      v-model="selectedSetString"
      label="Set code"
      :items="
        getSets.map((set) => {
          return set.code.toUpperCase() + ' - ' + set.name;
        })
      "
    />
  </div>
</template>

<script setup lang="ts">
import { useSetStore } from "../stores/setStore";
const setStore = useSetStore();
const { selectedSetString } = toRefs(setStore);
const { getSets, initializeSets } = setStore;

onMounted(async () => {
  await initializeSets();
});


</script>



