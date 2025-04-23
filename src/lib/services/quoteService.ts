import { apiService } from "@/lib/services/apiService";

interface Quote {
  a: string;
  c: string;
  h: string;
  q: string;
}

const api_url = "https://zenquotes.io/api/quotes/";

let instance: ReturnType<typeof quoteServiceFactory> | null = null;

const quoteServiceFactory = () => {
  const fetchQuotes = async () => {
    try {
      const data = await apiService.fetchData<Quote[]>(api_url);
      return data;
    } catch (error) {
      throw error;
    }
  };

  return {
    fetchQuotes,
  };
};

export const quoteService = () => {
  if (!instance) {
    instance = quoteServiceFactory();
  }
  return instance;
};
