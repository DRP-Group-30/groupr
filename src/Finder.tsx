import {
  DocumentReference,
  DocumentData,
  getDoc,
  updateDoc,
  Timestamp,
  GeoPoint,
} from "firebase/firestore";
import "./App.css";
import Card from "./Card";
import { Link } from "react-router-dom";
import { DEFAULT_USER, USER_CARD_CATEGORIES } from "./Card";
import { storage } from "./Firebase";
import { makeArr, range } from "./Util";
import { FirebaseApp } from "firebase/app";

const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;

export const RANDOM = "Random";
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

const updateFields = (
  d: DocumentReference<DocumentData>,
  fs: [string, (x: any) => any][]
): Promise<void> =>
  getDoc(d)
    .then((snapshot) => fs.map(([f, _]) => snapshot.get(f)))
    .then((n) =>
      updateDoc(d, Object.fromEntries(fs.map(([f, m], i) => [f, m(n[i])])))
    );

export default Finder;

// Resets the database completely
// Danger: Will erase ALL changes!
function resetDatabase() {}

/**
 * Models the structure of data that can be stored in a Firebase database
 * Not domain-specific
 */
type FireDatabase = { [name: string]: FireCollection<FireDoc> };
/**
 * More restrictive than Firebase in reality (i.e: each document in a
 * collection can have different structure)
 */
type FireCollection<D extends FireDoc> = D[];
interface FireDoc {
  id: DocId;
  collections: { [name: string]: FireCollection<FireDoc> };
  fields: { [name: string]: FireValue };
}
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
function randomId(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return range(0, DOC_ID_LENGTH)
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join();
}
