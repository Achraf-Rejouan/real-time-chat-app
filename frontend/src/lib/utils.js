export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatSeenTime(date) {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  // If today, show only time. If not, show date and time (like Instagram)
  if (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  ) {
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } else {
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }) +
    ", " +
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
}
