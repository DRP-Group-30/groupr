// Utility functions specifically for interacting with Firebase Firestore

import {
	DocumentData,
	DocumentReference,
	GeoPoint,
	QueryDocumentSnapshot,
	Timestamp,
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { range, safeHead } from "./Util";
import { db } from "./Firebase";

export const updateFields = async (
	d: DocumentReference<DocumentData>,
	fs: [string, (x: any) => any][],
): Promise<void> => {
	const snapshot = await getDoc(d);
	const n = fs.map(([f, _]) => snapshot.get(f));
	await updateDoc(d, Object.fromEntries(fs.map(([f, m], i) => [f, m(n[i])])));
};

export const updateField = <T>(
	d: DocumentReference<DocumentData>,
	f: string,
	m: (x: T) => T,
): Promise<void> =>
	getDoc(d)
		.then(snapshot => snapshot.get(f))
		.then((n: T) => updateDoc(d, { [f]: m(n) }));

export const RANDOM = "random";
type Random = typeof RANDOM;
export type DocId = string | Random;

/**
 * Models the structure of data that can be stored in a Firebase database
 * Not domain-specific
 */
type FireDatabase = FireCollections;
type FireCollections = {
	[name: string]: FireCollection<AbstractFireDoc>;
};

type FireFields = { [name: string]: FireValue };

type AbstractFireDoc = FireDoc<FireCollections, FireFields>;

type FireDoc<C extends FireCollections, F extends FireFields> = {
	id: DocId;
	collections: C;
	fields: F;
};

/**
 * The field corresponding to `FireMap<string, FireValue>` has been inlined to
 * avoid circular reference errors
 */
type FireValue =
	| string
	| number
	| boolean
	| { [key: string]: FireValue } // FireMap<string, FireValue>
	| FireValue[]
	| null
	| Timestamp
	| GeoPoint
	| DocumentReference;

/**
 * More restrictive than Firebase in reality (i.e: each document in a
 * collection can have different structure)
 */
export type FireCollection<D> = D extends FireDoc<infer C, infer F> ? FireDoc<C, F>[] : never;

export const toFireDoc = <F extends FireCollections, C extends FireFields>(
	docSpec: FireDoc<F, C>,
	snapshot: QueryDocumentSnapshot<DocumentData>,
): FireDoc<F, C> => ({
	id: snapshot.id,
	collections: docSpec.collections,
	fields: snapshot.data() as C,
});

/**
 * Delete every document in every collection in the model recursively (Firestore
 * should never be nested enough that stack overflow is a problem)
 */
const deleteAll = async (model: FireDatabase): Promise<void> => {
	const deleteCollections = async (currentPath: string, cs: FireCollections) => {
		for (const n in cs) {
			await deleteCollection(currentPath + n, cs[n]);
		}
	};
	const deleteCollection = async (collectionPath: string, c: FireCollection<AbstractFireDoc>) => {
		const snapshot = await getDocs(collection(db, collectionPath));
		const arbDoc = safeHead(c); // Used to view the structure of the documents
		await Promise.all(snapshot.docs.map(d => deleteFireDoc(arbDoc, d)));
	};
	const deleteFireDoc = async (
		modelDoc: AbstractFireDoc | null,
		snapshot: QueryDocumentSnapshot<DocumentData>,
	) => {
		await deleteDoc(snapshot.ref);
		// Might miss deleting some files if collection is populated on current live
		// database but not on default. Will fix later if I can be bothered
		// enough...
		if (modelDoc === null) return;

		await deleteCollections(snapshot.ref.path + "/", modelDoc.collections);
	};

	await deleteCollections("", model);
};

export const addAll = async (model: FireDatabase): Promise<void> => {
	const addCollections = async (currentPath: string, cs: FireCollections): Promise<void> => {
		for (const n in cs) {
			await addCollection(currentPath + n, cs[n]);
		}
	};
	const addCollection = async (
		collectionPath: string,
		c: FireCollection<AbstractFireDoc>,
	): Promise<unknown> => Promise.all(c.map(d => addFireDoc(collectionPath, d)));

	const addFireDoc = async (pathToDoc: string, { id, collections, fields }: AbstractFireDoc) => {
		if (id === RANDOM) {
			await addDoc(collection(db, pathToDoc), fields);
		} else {
			await setDoc(doc(db, pathToDoc, id), fields);
		}
		addCollections(pathToDoc + "/" + id, collections);
	};

	await addCollections("", model);
};

/**
 * Resets the database, deleting everything in `users`, `documents` and
 * `globals` categories and recreating it
 */
export const resetDatabase = async (model: FireDatabase): Promise<void> => {
	await deleteAll(model);
	await addAll(model);
	window.location.reload();
};

/**
 * We use an interface rather than a direct type alias to avoid errors with
 * circular references
 */
export type FireMap<K extends string, V> = {
	[key in K]: V;
};
