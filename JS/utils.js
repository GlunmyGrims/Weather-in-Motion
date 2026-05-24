export function todayDate() {
  const today = new Date();
  const options = { weekday: "long", month: "short", day: "numeric" };
  const date = new Intl.DateTimeFormat("en-US", options).format(today);

  return date;
}
