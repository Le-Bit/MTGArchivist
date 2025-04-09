import { defineStore } from "pinia";
import { Cards, type Card } from "scryfall-api";

export const useCardsStore = defineStore("cards", () => {
  const showingCard = ref<Card | undefined>(undefined);
  const savedCards = ref<Card[]>([]);
  const savedCardsWithMetadata = ref<
    {
      card: Card;
      quantity: number;
      foil: boolean;
    }[]
  >([]);
  const dismissedCards = ref<Card[]>([]);
  const progress = ref(0);
  const TIME_OUT = 5000;
  const INTERVAL_VALUE = 100;
  const PROGRESS_INTERVAL = TIME_OUT / 100;
  const interval = ref(0);
  const searchBar = ref({} as HTMLElement | null);
  const selectedLang = ref("en");
  const collectorNumber = ref(undefined as number | undefined);

  const getProgress = computed(() => {
    return progress;
  });

  const getLang = computed(() => {
    return ["en", "fr"];
  });

  const getSavedCards = computed(() => {
    return savedCards;
  });

  const getSavedCardsWithMetadata = computed(() => {
    return savedCardsWithMetadata;
  });

  const getShowingCard = computed(() => {
    return showingCard;
  });

  function initCards() {
    const cards = localStorage.getItem("cards");
    if (cards) {
      savedCardsWithMetadata.value = JSON.parse(cards);
    }
  }

  function resetCardsWithMetadata() {
    console.log("resetting");
    savedCardsWithMetadata.value = [];
    localStorage.setItem("cards", JSON.stringify([]));
    console.log("resetted");
  }

  function addToSavedCards() {
    setTimeout(() => searchBar.value?.focus(), 100);
    if (showingCard.value === undefined) {
      console.error("No card to save");
      return;
    }
    savedCards.value.push(showingCard.value);
    console.log("pushed");
    const savedCardIndex = savedCardsWithMetadata.value.findIndex(
      (card) => card.card.id === showingCard.value?.id
    );
    if (savedCardIndex !== -1) {
      savedCardsWithMetadata.value[savedCardIndex].quantity++;
      console.log("incremented");
    } else {
      savedCardsWithMetadata.value.push({
        card: showingCard.value,
        quantity: 1,
        foil: false,
      });
    }
    console.log("Saved card:", savedCards.value);
    showingCard.value = undefined;
    collectorNumber.value = undefined;
    saveCards();
  }

  function saveCards() {
    savedCardsWithMetadata.value = savedCardsWithMetadata.value.filter(
      (card) => card.quantity > 0
    );
    localStorage.setItem("cards", JSON.stringify(savedCardsWithMetadata.value));
  }

  function dismissCards() {
    setTimeout(() => searchBar.value?.focus(), 100);
    if (showingCard.value === undefined) {
      console.error("No card to dismiss");
      return;
    }
    dismissedCards.value.push(showingCard.value);
    showingCard.value = undefined;
    progress.value = 0;
    clearInterval(interval.value);
    collectorNumber.value = undefined;
    console.log("Dismiss card:", dismissedCards.value);
  }

  function setShowingCard(card: Card) {
    console.log("Setting showing card...", card);
    showingCard.value = card;
  }

  function setSearchBar(element: Element | null) {
    searchBar.value = element as HTMLElement;
  }

  function saveCard(
    searchBarRef: Element | null,
    collectorNumber: Ref<number | undefined>,
    getSelectedSet: Ref<{ code: string }>
  ) {
    setSearchBar(searchBarRef);

    if (searchBar.value) {
      searchBar.value.blur();
    }

    if (collectorNumber.value === undefined) {
      return;
    }

    Cards.bySet(
      getSelectedSet.value.code,
      collectorNumber.value,
      selectedLang.value
    )
      .then((response) => {
        if (response === undefined) {
          return;
        }
        setShowingCard(response);
        progress.value = TIME_OUT / PROGRESS_INTERVAL;
        const length = savedCards.value.length;
        interval.value = setInterval(() => {
          if (savedCards.value.length > length) {
            clearInterval(interval.value);
            progress.value = 0;
            showingCard.value = undefined;
            return;
          }
          console.log(progress.value);
          progress.value -= INTERVAL_VALUE / PROGRESS_INTERVAL;
          if (progress.value <= 0) {
            clearInterval(interval.value);
            if (showingCard.value !== undefined) {
              addToSavedCards();
            }
          }
        }, INTERVAL_VALUE);
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
      });
  }

  return {
    addToSavedCards,
    saveCard,
    getProgress,
    getShowingCard,
    getSavedCards,
    getSavedCardsWithMetadata,
    savedCardsWithMetadata,
    dismissCards,
    collectorNumber,
    initCards,
    resetCardsWithMetadata,
    saveCards,
    selectedLang,
    getLang,
  };
});
