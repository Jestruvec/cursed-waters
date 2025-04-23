const fetchData = async <T>(url: string): Promise<T> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data = await response.json();
    return data as T;
  } catch (error) {
    throw error;
  }
};

export const apiService = {
  fetchData,
};
