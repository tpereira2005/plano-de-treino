// Preferências do visitante (apenas o tema), guardadas localmente no browser.
// Se o armazenamento estiver bloqueado, o site funciona na mesma sem guardar.

const PREFIX = 'plano-treino:pref:';

export const prefs = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* ignorar */
    }
  },
};
