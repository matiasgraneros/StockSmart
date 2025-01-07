export function transformDate(date: Date) {
  const newDate = new Date(date);
  return newDate.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
