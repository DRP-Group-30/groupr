import { T } from "@chakra-ui/toast/dist/toast.types-f226a101";

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

/**
 * Something of type `any` created from thin air (otherwise known as `null`)
 * Obviously unsafe
 */
export const ANY: any = null as any;

export const getOrZero = <K>(m: Map<K, number>, k: K) => getOrDefault(m, k, 0);

export const getOrDefault = <K, V>(m: Map<K, V>, k: K, d: V) => m.get(k) ?? d;

export const upperFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const upperWords = (s: string) => s.split(" ").map(upperFirst).join(" ");

export const nubBy = <T>(l: T[], p: (x: T, y: T) => boolean): T[] =>
	l.filter((x, i, s) => i === s.findIndex(y => p(x, y)));

/**
 * Could optimise with Schwartzian transform
 */
export const nubWith = <T, U>(l: T[], f: (x: T) => U): T[] => nubBy(l, (x, y) => f(x) === f(y));

export const nub = <T>(l: T[]) => nubWith(l, x => x);

/**
 * Note: I believe swapping the other way around is impossible (would need to
 * wait for the Promise to finish to know whether it returns null or not)
 */
export const swapPromiseNull = async <T>(p: Promise<T> | null): Promise<T | null> => p;
