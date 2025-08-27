import { defineStore } from "pinia";
import { Sets, type Set } from "scryfall-api";

export const useSetStore = defineStore("set", () => {
  const selectedSetString = ref("");
  const sets = ref<Set[]>([]);

  async function initializeSets() {
    console.log("Initializing sets...");
    try {
      sets.value = await Sets.all();
    } catch (error) {
      console.error("Error fetching sets:", error);
      sets.value = [];
    }
  }

  const selectedSet = computed(() => {
    const code = selectedSetString.value.split(" - ")[0];
    const selected = sets.value.find((s) => s.code.toUpperCase() === code);
    console.log("Getting selected set...", selected);
    if (selected === undefined) {
      return {} as Set;
    }
    return selected;
  });

  const getSets = computed(() => {
    return sets.value.map((set) => {
      return {
        title: set.code.toUpperCase(),
        name: set.name,
        img: set.icon_svg_uri,
      }
    });
  });

  const getSelectedSet = computed(() => {
    console.log("Getting selected set...", selectedSet.value);
    return selectedSet;
  });

  return {
    initializeSets,
    getSets,
    getSelectedSet,
    selectedSetString,
  };
});
