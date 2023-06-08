export const range = (min: number, max: number) =>
	Array.from(Array(max - min).keys()).map(x => x + min);

export const makeArr = <T>(f: (i: number) => T, size: number) => range(0, size).map(f);

export const fst = <T>([f, _]: [T, unknown]): T => f;

export const snd = <T>([_, s]: [unknown, T]): T => s;

/**
 * Could call this "map nullable" but it will be used so commonly that I think
 * a short name is helpful
 */
export const map = <T, U>(x: T | null, f: (x: T) => U): U | null => (x === null ? null : f(x));

export const nullToList = <T>(x: T | null): T[] => (x === null ? [] : [x]);

export const safeUncons = <T>(x: T[]): [T, T[]] | null =>
	x.length === 0 ? null : [x[0], x.slice(1)];

export const safeHead = <T>(x: T[]): T | null => map(safeUncons(x), fst);

export const catNulls = <T>(l: (T | null)[]): T[] => {
	const p = safeUncons(l);
	if (p === null) return [];
	const [h, t] = p;
	return nullToList(h).concat(catNulls(t));
};

export const takeIf = <T>(x: T, p: (x: T) => boolean): T | null => (p(x) ? x : null);

export const enumVals = <E>(x: { [e: string]: E | string }): E[] =>
	catNulls(Object.values(x).map(s => (typeof s === "string" ? null : s)));

export const inlineLog = <T>(x: T): T => {
	console.log(x);
	return x;
};
