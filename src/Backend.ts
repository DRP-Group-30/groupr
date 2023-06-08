// Backend data layout and logic

import {} from "./Finder";
import { DocId, FireCollection } from "./FirebaseUtil";
import { enumVals, makeArr } from "./Util";

/**
 * Models the structure of the data stored in Groupr
 * Domain-specific
 */
export type GrouprDatabase = {
  projects: Projects;
  users: Users;
  globals: Globals;
};

enum Day {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sundary,
}

const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = enumVals(Day).length;

enum Availability {
  NotAvailable,
  Available,
}

const USERS = "users";
const PROJECTS = "projects";
const GLOBALS = "globals";

type Projects = FireCollection<Project>;
type Users = FireCollection<User>;
type Globals = [GlobalTable];

/**
 * TODO:
 * - Should `contactInfo`/`collaborators` be more structured?
 */
export type Project = {
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
