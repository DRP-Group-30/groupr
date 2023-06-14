/**
 * A utility file containting functions for interacting with the Firebase database
 *
 */

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
import { safeHead, unsafeNew } from ".";
import { Firebase } from "../backend/firebase";
import { Project } from "../backend";

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
	snapshot: QueryDocumentSnapshot<DocumentData>,
	docSpec: FireDoc<F, C>,
): FireDoc<F, C> => ({
	id: snapshot.id,
	// Unsafe!! Current modelling of `collections` as parts of ordinary
	// `FireDoc`s breaks down pretty quick...
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
		const snapshot = await getDocs(collection(Firebase.db, collectionPath));
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
			await addDoc(collection(Firebase.db, pathToDoc), fields);
		} else {
			await setDoc(doc(Firebase.db, pathToDoc, id), fields);
		}
		addCollections(pathToDoc + "/" + id, collections);
	};

	await addCollections("", model);
};

export const allTags = async (): Promise<Map<string, number>> => {
	const projects = await getDocs(collection(Firebase.db, "projects"));
	const allTags = projects.docs.flatMap(d => toFireDoc(d, unsafeNew<Project>()).fields.tags);
	const ranked = new Map<string, number>();
	for (const tag in allTags) ranked.set(tag, (ranked.get(tag) ?? 0) + 1);
	return ranked;
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

export type FireMap<K extends string, V> = {
	[key in K]: V;
};
