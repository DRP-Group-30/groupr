export const makeArr = <T>(f: (i: number) => T, size: number) =>
  Array(size).map((_, i) => f(i));

export const range = (min: number, max: number) =>
  makeArr((i) => i + min, max - min);
