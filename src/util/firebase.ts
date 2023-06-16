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
import { safeHead, ANY, getOrZero, nub, range } from ".";
import { Firebase } from "../backend/firebase";
import { Project } from "../backend";
import { StorageReference, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FirebaseError } from "firebase/app";

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

type AbstractFireDoc = FireDoc<FireFields>;

export type Fields = "fields";

type FireDoc<F extends FireFields> = {
	id: DocId;
	// Sub-collections are removed for now because they aren't really necessary
	// and everything becomes a heck of a lot easier without them
	//collections: C;
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
export type FireCollection<D> = D extends FireDoc<infer F> ? FireDoc<F>[] : never;

export const toFireDoc = <F extends FireFields>(
	snapshot: QueryDocumentSnapshot<DocumentData>,
): FireDoc<F> => ({
	id: snapshot.id,
	fields: snapshot.data() as F,
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

		// await deleteCollections(snapshot.ref.path + "/", modelDoc.collections);
	};

	await deleteCollections("", model);
};

export const addCollections = async (currentPath: string, cs: FireCollections): Promise<void> => {
	for (const n in cs) {
		await addCollection(currentPath + n, cs[n]);
	}
};
export const addCollection = async (
	collectionPath: string,
	c: FireCollection<AbstractFireDoc>,
): Promise<unknown> => Promise.all(c.map(d => addFireDoc(collectionPath, d)));

export const addFireDoc = async (pathToDoc: string, { id, fields }: AbstractFireDoc): Promise<string> => {
	if (id === RANDOM) {
		return (await addDoc(collection(Firebase.db, pathToDoc), fields)).id;
	} else {
		setDoc(doc(Firebase.db, pathToDoc, id), fields);
		return id;
	}
	// addCollections(pathToDoc + "/" + id, collections);
};

export const addAll = async (model: FireDatabase): Promise<void> => {
	await addCollections("", model);
};

export const getAllTags = async (): Promise<string[]> => {
	const projects = await getDocs(collection(Firebase.db, "projects"));
	const allTags = projects.docs.flatMap(d => toFireDoc<Project[Fields]>(d).fields.tags);
	const ranked = new Map<string, number>();
	allTags.forEach(t => ranked.set(t, getOrZero(ranked, t) + 1));
	allTags.sort((t1, t2) => getOrZero(ranked, t2) - getOrZero(ranked, t1));
	return nub(allTags);
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

const IMG_ID_LEN = 20;

/**
 * Generates a random ID vaguely similar to the ones that Firebase can
 * create automatically for documents (intended for images)
 */
const randomId = (): string => {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	return range(0, IMG_ID_LEN)
		.map(() => chars[Math.floor(Math.random() * chars.length)])
		.join("");
};

const mimeExt = (mimeTy: String) => mimeTy.split("/")[1];

export const storeImg = async (img: File): Promise<string> => {
	const ext = mimeExt(img.type);
	let imgRef: StorageReference, imgId: string;
	while (true) {
		imgId = randomId();
		imgRef = ref(Firebase.storage, imgId + "." + ext);
		try {
			await getDownloadURL(imgRef);
		} catch (e: unknown) {
			if (e instanceof FirebaseError && e.code === "storage/object-not-found") break;
			throw e;
		}
	}
	await uploadBytes(imgRef, await img.arrayBuffer());
	return imgRef.fullPath;
};

export const getImg = (path: string): Promise<string> =>
	getDownloadURL(ref(Firebase.storage, path));
