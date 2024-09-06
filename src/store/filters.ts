import { atom } from 'jotai';

// Utility function to get initial value from localStorage
const getFromLocalStorage = (key: string, defaultValue: any) => {
  const saved = localStorage.getItem(key);
  try {
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

// Atom for sort criteria
export const sortCriteriaAtom = atom(
  getFromLocalStorage('sortCriteria', null) // Default value: 'name'
);

// Atom for selected categories
export const selectedCategoriesAtom = atom(
  getFromLocalStorage('selectedCategories', []) // Default value: empty array
);

// Atom for sort order
export const sortOrderAtom = atom(
  getFromLocalStorage('sortOrder', null) // Default value: 'asc'
);

// Side-effect to persist `sortCriteria` in localStorage
export const sortCriteriaWithPersistence = atom(
  (get) => get(sortCriteriaAtom),
  (get, set, newValue) => {
    set(sortCriteriaAtom, newValue);
    localStorage.setItem('sortCriteria', JSON.stringify(newValue));
  }
);

// Side-effect to persist `selectedCategories` in localStorage
export const selectedCategoriesWithPersistence = atom(
  (get) => get(selectedCategoriesAtom),
  (get, set, newValue) => {
    console.log('SAVING selectedCategoriesAtom');
    console.log(JSON.stringify(newValue));
    set(selectedCategoriesAtom, newValue);
    localStorage.setItem('selectedCategories', JSON.stringify(newValue));
  }
);

// Side-effect to persist `sortOrder` in localStorage
export const sortOrderWithPersistence = atom(
  (get) => get(sortOrderAtom),
  (get, set, newValue) => {
    set(sortOrderAtom, newValue);
    localStorage.setItem('sortOrder', JSON.stringify(newValue));
  }
);
