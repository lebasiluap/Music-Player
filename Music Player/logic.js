export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  return (
    Math.floor(seconds / 60) +
    ":" +
    String(Math.floor(seconds % 60)).padStart(2, "0")
  );
}
export function nextIndex(
  current,
  length,
  { direction = 1, shuffle = false, repeat = "off", random = Math.random } = {},
) {
  if (length <= 0) return null;
  if (shuffle && length > 1) {
    const r = Math.floor(
      Math.max(0, Math.min(0.999999, random())) * (length - 1),
    );
    return r >= current ? r + 1 : r;
  }
  const next = current + direction;
  if (next >= 0 && next < length) return next;
  if (repeat === "all") return (next + length) % length;
  return null;
}
