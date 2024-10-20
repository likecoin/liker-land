import jwtDecode from 'jwt-decode';

const AUTH_SESSION_KEY = 'likecoin_nft_book_press_token';

export function checkJwtTokenValidity(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded?.exp && decoded.exp * 1000 > Date.now();
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function loadAuthSession() {
  try {
    if (window.localStorage) {
      const data = window.localStorage.getItem(AUTH_SESSION_KEY);
      if (data) {
        const { wallet, token } = JSON.parse(data);
        return {
          wallet,
          token,
        };
      }
    }
  } catch {}

  return null;
}

export function saveAuthSession({ wallet, token }) {
  try {
    if (!window.localStorage) {
      return;
    }

    window.localStorage.setItem(
      AUTH_SESSION_KEY,
      JSON.stringify({ wallet, token })
    );
  } catch {}
}

export function clearAuthSession() {
  try {
    if (!window.localStorage) {
      return;
    }

    window.localStorage.removeItem(AUTH_SESSION_KEY);
  } catch {}
}
