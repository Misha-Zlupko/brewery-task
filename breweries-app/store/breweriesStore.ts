import { create } from "zustand";

export interface Brewery {
  id: string;
  name: string;
  city: string;
  state: string;
  street?: string;
  brewery_type?: string;
  phone?: string;
  website_url?: string;
}

interface BreweryStore {
  renderList: Brewery[];
  selected: string[];
  page: number;
  isLoading: boolean;

  visibleCount: number;
  searchName: string;
  searchCity: string;

  fetchInitial: () => Promise<void>;
  fetchMore: (need: number) => Promise<void>;
  expandVisible: () => void;
  filteredList: () => Brewery[];
  toggleSelect: (id: string) => void;
  deleteSelected: () => Promise<void>;
  setSearchName: (text: string) => void;
  setSearchCity: (text: string) => void;
}

export const useBreweryStore = create<BreweryStore>((set, get) => ({
  renderList: [],
  selected: [],
  page: 1,
  isLoading: false,
  visibleCount: 5,

  searchName: "",
  searchCity: "",

  filteredList: () => {
    const { renderList, searchName, searchCity } = get();

    const name = searchName.trim().toLowerCase();
    const city = searchCity.trim().toLowerCase();

    if (!name && !city) return renderList;

    return renderList.filter((e) => {
      const byName = name ? e.name.toLowerCase().includes(name) : true; 
      const byCity = city ? e.city.toLowerCase().includes(city) : true;

      return byName && byCity;
    });
  },

  setSearchName: (text: string) => set({ searchName: text }),
  setSearchCity: (text: string) => set({ searchCity: text }),

  fetchInitial: async () => {
    set({ isLoading: true });

    const res = await fetch(
      "https://api.openbrewerydb.org/v1/breweries?per_page=15&page=1"
    );
    const data: Brewery[] = await res.json();

    set({
      renderList: data,
      visibleCount: 5,
      page: 2,
      isLoading: false,
    });
  },

  fetchMore: async (need: number) => {
    let { page, renderList } = get();
    const collected: Brewery[] = [];

    while (collected.length < need) {
      const res = await fetch(
        `https://api.openbrewerydb.org/v1/breweries?per_page=15&page=${page}`
      );
      const data: Brewery[] = await res.json();

      page += 1;

      if (data.length === 0) break;

      collected.push(...data);
    }

    const result = [...renderList, ...collected].slice(0, 15);

    set({
      renderList: result,
      page,
    });
  },

  expandVisible: () => {
    const { visibleCount } = get();
    if (visibleCount < 15) {
      set({ visibleCount: visibleCount + 5 });
    }
  },

  toggleSelect: (id) => {
    const { selected } = get();
    set({
      selected: selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id],
    });
  },

  deleteSelected: async () => {
    const { renderList, selected } = get();

    const newList = renderList.filter((b) => !selected.includes(b.id));
    const removed = renderList.length - newList.length;

    set({
      renderList: newList,
      selected: [],
    });

    if (removed > 0) {
      await get().fetchMore(removed);
    }
  },
}));
