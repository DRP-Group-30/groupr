import {
  DocumentReference,
  DocumentData,
  getDoc,
  updateDoc,
  Timestamp,
  GeoPoint,
  getDocs,
  collection,
  deleteDoc,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import "./App.css";
import Card from "./Card";
import { Link } from "react-router-dom";
import { DEFAULT_USER, USER_CARD_CATEGORIES } from "./Card";
import { db, storage } from "./Firebase";
import { makeArr, range, safeHead } from "./Util";
import { FirebaseApp } from "firebase/app";

const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;

const USERS = "users";
const PROJECTS = "projects";
const GLOBALS = "globals";

export const RANDOM = "random";
type Random = typeof RANDOM;
export type DocId = string | Random;

enum Day {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sundary,
}

enum Availability {
  NotAvailable,
  Available,
}

const Finder = () => {
  async function resetLists() {
    updateFields(
      DEFAULT_USER,
      USER_CARD_CATEGORIES.map((c) => [c, () => []])
    ).then(() => window.location.reload());
  }

  return (
    <div className="App">
      <Link to="/dashboard">Dashboard</Link>
      <Card></Card>
      <button onClick={resetLists}>Reset</button>
    </div>
  );
};

const updateFields = async (
  d: DocumentReference<DocumentData>,
  fs: [string, (x: any) => any][]
): Promise<void> => {
  const snapshot = await getDoc(d);
  const n = fs.map(([f, _]) => snapshot.get(f));
  await updateDoc(d, Object.fromEntries(fs.map(([f, m], i) => [f, m(n[i])])));
};

export default Finder;

/**
 * Delete every document in every collection in the model recursively (Firestore
 * should never be nested enough that stack overflow is a problem)
 */
const deleteAll = async (model: FireDatabase): Promise<void> => {
  const deleteCollections = async (
    currentPath: string,
    cs: FireCollections
  ) => {
    for (const n in cs) {
      await deleteCollection(currentPath + n, cs[n]);
    }
  };
  const deleteCollection = async <D extends AbstractFireDoc>(
    collectionPath: string,
    c: FireCollection<D>
  ) => {
    const snapshot = await getDocs(collection(db, collectionPath));
    const arbDoc = safeHead(c); // Used to view the structure of the documents
    await Promise.all(snapshot.docs.map((d) => deleteFullDoc(arbDoc, d)));
  };
  const deleteFullDoc = async (
    modelDoc: AbstractFireDoc | null,
    snapshot: QueryDocumentSnapshot<DocumentData>
  ) => {
    await deleteDoc(snapshot.ref);
    // Might miss deleting some files if collection is populated on current live
    // database but not on default. Will fix later if I can be bothered
    // enough...
    if (modelDoc === null) return;

    await deleteCollections(snapshot.ref.path + "/", modelDoc.collections);
  };

  deleteCollections("", model);
};

/**
 * Resets the database, deleting everything in `users`, `documents` and
 * `globals` categories and recreating it
 */

const resetDatabase = async (model: FireDatabase): Promise<void> => {
  await deleteAll(model);
};

/**
 * Models the structure of data that can be stored in a Firebase database
 * Not domain-specific
 */
type FireDatabase = FireCollections;
type FireCollections = {
  [name: string]: FireCollection<AbstractFireDoc>;
};
/**
 * More restrictive than Firebase in reality (i.e: each document in a
 * collection can have different structure)
 */
type FireCollection<D> = D extends FireDoc<infer C, infer F>
  ? FireDoc<C, F>[]
  : never;

const toFireDoc = <F extends FireCollections, C extends FireFields>(
  docSpec: FireDoc<F, C>,
  snapshot: QueryDocumentSnapshot<DocumentData>
): FireDoc<F, C> => ({
  id: snapshot.id,
  collections: docSpec.collections,
  fields: snapshot.data() as C,
});

/**
  const tmp: FireDoc = {
    id: snapshot.id,
    collections: {},
    fields: snapshot.data(),
  };
  return tmp as T;
 */

type FireFields = { [name: string]: FireValue };

type AbstractFireDoc = FireDoc<FireCollections, FireFields>;

type FireDoc<C extends FireCollections, F extends FireFields> = {
  id: DocId;
  collections: C;
  fields: F;
};
type FireValue =
  | string
  | number
  | boolean
  | Map<string, FireValue>
  | FireValue[]
  | null
  | Timestamp
  | GeoPoint
  | DocumentReference;

/**
 * Models the structure of the data stored in Groupr
 * Domain-specific
 */
export type GrouprDatabase = {
  projects: Projects;
  users: Users;
  globals: Globals;
};
type Projects = FireCollection<Project>;
type Users = FireCollection<User>;
type Globals = [GlobalTable];

/**
 * TODO:
 * - Should `contactInfo`/`collaborators` be more structured?
 */
type Project = {
  id: DocId;
  collections: { boxes: Box<BoxType>[]; roles: Role[] };
  fields: {
    name: string;
    collaborators: string[];
    contactInfo: string;
    overview: string;
    coverImage: string | null;
  };
};
/**
 * TODO: What type should experience be?
 */
type Role = {
  id: DocId;
  collections: {};
  fields: {
    skillset: Skillset;
    experience: string;
    approxPay: number;
    commitment: number;
  };
};

/**
 * TODO: Lots of potential for additional fields here
 */
type User = {
  id: DocId;
  collections: {};
  fields: {
    username: string;
    givenNames: string[];
    surname: string;
    skillset: Skillset;
    availability: AvailSchedule;
  };
};
type GlobalTable = { id: DocId; collections: {}; fields: {} };

export const emptyAvailability = (): AvailSchedule =>
  makeArr(
    () => makeArr(() => Availability.NotAvailable, HOURS_PER_DAY),
    DAYS_PER_WEEK
  );

type AvailSchedule = Availability[][];

type Hour = number;

type Time = { hour: Hour; day: Day };

const setAvail = (s: AvailSchedule, { hour, day }: Time, a: Availability) => {
  s[day][hour] = a;
};

const getAvail = (s: AvailSchedule, { hour, day }: Time) => s[day][hour];

/**
 * Project pages can be built out of boxes
 * Perhaps user pages could also be built out of boxes - TODO
 */
type Box<T extends BoxType> = {
  id: DocId;
  type: T;
  collections: {};
  fields: T extends BoxType.IMAGE ? ImageContents : TextContents;
};
enum BoxType {
  IMAGE = "Image",
  TEXT = "Text",
}

type ImageContents = { path: string };
type TextContents = { title: string; body: string };

/**
 * Could be more fine-grained
 * Perhaps hierarchical? i.e: `PROGRAMMING` comprised of `GAMEPLAY_SCRIPTING`,
 * `ENGINE_PROGRAMMING`, `SHADERS`, `PHYSICS`, `NETWORKING` etc...
 */
export enum Skill {
  PROGRAMMING = "Programming",
  ART = "Art",
  MUSIC_AND_SOUND = "Music and Sound",
  PROJECT_MANAGEMENT = "Project Management",
}

/**
 * If we want to make this range larger, perhaps would be a good idea to use:
 * https://stackoverflow.com/questions/39494689/is-it-possible-to-restrict-number-to-a-certain-range
 */
export type Rating = 0 | 1 | 2 | 3 | 4 | 5;

type Skillset = Map<Skill, Rating>;

const DOC_ID_LENGTH = 20;

/**
 * Generates a random document ID vaguely similar to the ones that Firebase can
 * create automatically
 */
const randomId = (): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return range(0, DOC_ID_LENGTH)
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join();
};
