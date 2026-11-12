const pad = (value) => String(value).padStart(2, "0");

const toDateValue = (value) => {
  if (!value) return null;
  if (value?.toDate) return value.toDate();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const toLocalDateString = (value) => {
  const date = toDateValue(value);
  if (!date) return "";
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-");
};

export const toLocalDateTimeString = (value) => {
  const date = toDateValue(value);
  if (!date) return null;
  return `${toLocalDateString(date)}T${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}:${pad(date.getSeconds())}`;
};
