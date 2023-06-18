const STORAGE_KEY = 'liker_land_shopping-cart';

export function saveShoppingCartToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to save shopping cart to local storage', e);
  }
}

export function loadShoppingCartFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to load shopping cart from local storage', e);
    return {};
  }
}
