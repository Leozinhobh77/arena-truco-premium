// ============================================================
// normalize — Normalização de strings para busca case-insensitive
// Remove acentos, espaços extras, converte pra minúscula
// ============================================================

export function normalizeNick(nick: string): string {
  return nick
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, ''); // Remove diacríticos
}

// Exemplo:
// normalizeNick('Léo BH') → 'leo bh'
// normalizeNick('JOÃO Silva') → 'joao silva'
// normalizeNick('  Café  ') → 'cafe'
