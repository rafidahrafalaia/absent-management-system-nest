/** Current date (YYYY-MM-DD) and time (HH:mm:ss) in the given IANA timezone. */
export const nowIn = (timeZone: string, now = new Date()) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}:${parts.second}`,
  };
};

/** First day of the month of a YYYY-MM-DD date. */
export const startOfMonth = (date: string) => `${date.slice(0, 7)}-01`;
