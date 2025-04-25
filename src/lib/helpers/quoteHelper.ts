import { quotes } from "@/utils/quotes";
import { getRandomItem } from "@/lib/helpers/";
import { getDOMElements } from "@/utils/domElements";

export const quoteHelper = {
  setQuote: () => {
    const { quoteDOM } = getDOMElements();
    const randomQuote = getRandomItem(quotes);
    quoteDOM.innerText = `"${randomQuote.q}" - ${randomQuote.a}`;
  },
};
