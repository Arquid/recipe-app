export function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function truncate(text = '', max = 130) {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + '...';
}