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
  renderList: Brewery[];     // всегда максимум 15
  bufferList: Brewery[];     // запас
  selected: string[];
  page: number;
  isLoading: boolean;
  visibleCount: number;      // показываем: 5 → 10 → 15

  fetchInitial: () => Promise<void>;
  fetchMore: (need: number) => Promise<void>;
  expandVisible: () => void;
  toggleSelect: (id: string) => void;
  deleteSelected: () => Promise<void>;
}

export const useBreweryStore = create<BreweryStore>((set, get) => ({
  renderList: [],
  bufferList: [],
  selected: [],
  page: 1,
  isLoading: false,
  visibleCount: 5,

  // -------------------------
  // 1) Первая загрузка
  // -------------------------
  fetchInitial: async () => {
    set({ isLoading: true });

    const res = await fetch(
      "https://api.openbrewerydb.org/v1/breweries?per_page=15&page=1"
    );
    const data: Brewery[] = await res.json();

    set({
      renderList: data.slice(0, 15),
      bufferList: data.slice(15),
      page: 2,
      visibleCount: 5,
      isLoading: false,
    });
  },

  // -------------------------
  // 2) Увеличиваем видимую часть (len 5→10→15)
  // -------------------------
  expandVisible: () => {
    const { visibleCount } = get();
    if (visibleCount < 15) {
      set({ visibleCount: visibleCount + 5 });
    }
  },

  // -------------------------
  // 3) Догружаем N элементов
  // -------------------------
  fetchMore: async (need: number) => {
    let { bufferList, page, renderList } = get();
    const collected: Brewery[] = [];

    // 1. Сначала из bufferList
    if (bufferList.length > 0) {
      const take = bufferList.slice(0, need);
      collected.push(...take);
      bufferList = bufferList.slice(need);
      need -= take.length;
    }

    // 2. Если не хватило — грузим новые страницы
    while (need > 0) {
      const res = await fetch(
        `https://api.openbrewerydb.org/v1/breweries?per_page=15&page=${page}`
      );
      const data: Brewery[] = await res.json();

      page += 1;

      if (data.length === 0) break;

      const take = data.slice(0, need);
      const rest = data.slice(need);

      collected.push(...take);
      bufferList.push(...rest);

      need -= take.length;
    }

    // 3. Добавляем в renderList до 15 элементов
    const newRender = [...renderList, ...collected].slice(0, 15);

    set({
      renderList: newRender,
      bufferList,
      page,
    });
  },

  // -------------------------
  // 4) Выделение
  // -------------------------
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

    // Добавляем столько же, сколько удалили
    if (removed > 0) {
      await get().fetchMore(removed);
    }
  },
}));
