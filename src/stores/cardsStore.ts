import { defineStore } from "pinia";
import { Cards, type Card } from "scryfall-api";

export const useCardsStore = defineStore("cards", () => {
  const showingCard = ref<Card | undefined>(undefined);
  const savedCardsWithMetadata = ref<
    {
      card: Card;
      quantity: number;
      foil: boolean;
      lang: string;
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

  const cardsCount = computed(() =>
    savedCardsWithMetadata.value.reduce((acc, curr) => {
      return acc + curr.quantity;
    }, 0)
  );

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
    console.log("pushed");
    const savedCardIndex = savedCardsWithMetadata.value.findIndex(
      (card) =>
        card.card.id === showingCard.value?.id &&
        card.lang === selectedLang.value
    );
    if (savedCardIndex !== -1) {
      savedCardsWithMetadata.value[savedCardIndex].quantity++;
      console.log("incremented");
    } else {
      savedCardsWithMetadata.value.push({
        card: showingCard.value,
        quantity: 1,
        foil: false,
        lang: selectedLang.value,
      });
    }
    console.log("Saved card:", savedCardsWithMetadata.value);
    showingCard.value = undefined;
    collectorNumber.value = undefined;
    saveCards();
  }

  function saveCards() {
    localStorage.setItem("cards", JSON.stringify(savedCardsWithMetadata.value));
  }

  function onQuantityChange(quantity: number, index: number) {
    const card = savedCardsWithMetadata.value[index];
    card.quantity = quantity;
    if (quantity === 0) {
      savedCardsWithMetadata.value.splice(index, 1);
    }
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
  function setFoil(index: number) {
    const card = savedCardsWithMetadata.value[index];
    const cardAlreadySaved = savedCardsWithMetadata.value.find((c) => c.card.id === card.card.id && c.foil === !card.foil);

    if (card.quantity === 1 && !cardAlreadySaved) {
      card.foil = !card.foil;
    }
    else if (card.quantity === 1 && cardAlreadySaved) {
      savedCardsWithMetadata.value.splice(index, 1);
      const cardToRemove = savedCardsWithMetadata.value.find((c) => c.card.id === card.card.id && c.foil === !card.foil);
      if (cardToRemove) {
        cardToRemove.quantity++;
      }
    }
    else {
      const cardAlreadySaved = savedCardsWithMetadata.value.find((c) => c.card.id === card.card.id && c.foil === !card.foil);
      card.quantity--;
      if (cardAlreadySaved) {
        cardAlreadySaved.quantity++;
      }
      else{
      savedCardsWithMetadata.value.push({ ...card, foil: !card.foil , quantity: 1});
      }
    }
  }

  async function saveCard(
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

    const cardLocalized =
      selectedLang.value !== "en"
        ? await Cards.bySet(
            getSelectedSet.value.code,
            collectorNumber.value,
            selectedLang.value
          )
        : undefined;

    const scryfallCard = await Cards.bySet(
      getSelectedSet.value.code,
      collectorNumber.value,
      "en"
    );

    if (scryfallCard === undefined) {
      return;
    }

    setShowingCard({
      ...scryfallCard,
      printed_name: cardLocalized?.printed_name ?? scryfallCard.name,
    });
    progress.value = TIME_OUT / PROGRESS_INTERVAL;
    const length = cardsCount.value;
    interval.value = setInterval(() => {
      if (cardsCount.value > length) {
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
  }

  return {
    addToSavedCards,
    saveCard,
    getProgress,
    getShowingCard,
    getSavedCardsWithMetadata,
    savedCardsWithMetadata,
    dismissCards,
    collectorNumber,
    initCards,
    resetCardsWithMetadata,
    saveCards,
    selectedLang,
    getLang,
    onQuantityChange,
    cardsCount,
    setFoil
  };
});
