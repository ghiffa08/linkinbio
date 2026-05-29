export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Ganti spasi dengan -
    .replace(/[^\w-]+/g, '')     // Hapus semua karakter non-word
    .replace(/--+/g, '-');       // Ganti multiple - dengan single -
}
