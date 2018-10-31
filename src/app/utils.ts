export const fx2 = (n) => {
  const m = Number(n);
  return m < 10 ? `0${m}` : `${m}`;
}

export const dateStr = date =>
  `${date.getFullYear()}-${fx2(date.getMonth()+1)}-${fx2(date.getDate())}`;
