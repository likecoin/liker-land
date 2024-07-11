const STORAGE_KEY = 'liker_land_shopping-cart';

export function saveShoppingCartToStorage(items, type = 'wnft') {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${type}`, JSON.stringify(items));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to save shopping cart to local storage', e);
  }
}

export function loadShoppingCartFromStorage(type = 'wnft') {
  let cart;
  try {
    cart = JSON.parse(localStorage.getItem(`${STORAGE_KEY}_${type}`));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to load shopping cart from local storage', e);
  }
  return cart || {};
}
