import type { Admin } from "@/types/auth";

export interface StoredAuthSession {
  admin: Admin | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface StoredPasswordResetState {
  email: string;
  resetToken: string | null;
}

const AUTH_SESSION_KEY = "jhirash-admin-session";
const PASSWORD_RESET_KEY = "jhirash-admin-password-reset";

const emptySession: StoredAuthSession = {
  admin: null,
  accessToken: null,
  refreshToken: null,
};

const emptyPasswordResetState: StoredPasswordResetState = {
  email: "",
  resetToken: null,
};

const isBrowser = () => typeof window !== "undefined";

const readFromStorage = <T>(key: string, fallback: T): T => {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const storedValue = window.localStorage.getItem(key);

    if (!storedValue) {
      return fallback;
    }

    return JSON.parse(storedValue) as T;
  } catch {
    return fallback;
  }
};

const writeToStorage = <T>(key: string, value: T) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

export const readAuthSession = () =>
  readFromStorage<StoredAuthSession>(AUTH_SESSION_KEY, emptySession);

export const writeAuthSession = (session: StoredAuthSession) => {
  writeToStorage(AUTH_SESSION_KEY, session);
};

export const clearAuthSession = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_KEY);
};

export const readPasswordResetState = () =>
  readFromStorage<StoredPasswordResetState>(
    PASSWORD_RESET_KEY,
    emptyPasswordResetState
  );

export const writePasswordResetState = (
  state: StoredPasswordResetState
) => {
  writeToStorage(PASSWORD_RESET_KEY, state);
};

export const clearPasswordResetState = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(PASSWORD_RESET_KEY);
};
