// Backend data layout and logic

import { DocumentReference, addDoc } from "@firebase/firestore";
import { DocId, Fields, FireCollection, FireMap, RANDOM, addFireDoc } from "../util/firebase";
import { enumVals, makeArr } from "../util";
import { doc } from "firebase/firestore";
import { Firebase } from "./firebase";

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

export enum Availability {
	NotAvailable,
	Available,
}
export enum ProjectOrUser {
	Project,
	User,
}

export type ProjectOrUserDict = {
	[ProjectOrUser.Project]: Project["fields"];
	[ProjectOrUser.User]: User["fields"];
};

export type ProjectOrUserData<T extends ProjectOrUser> = {
	type: T;
	fields: T extends ProjectOrUser.Project
		? Project["fields"]
		: T extends ProjectOrUser.User
		? User["fields"]
		: never;
};

/**
 * Discriminate on the tag to execute the continuation on the fields of the
 * project or the user.
 */
export const discriminate = <T extends ProjectOrUser, R>(
	e: ProjectOrUserData<T>,
	cont1: (p: Project["fields"]) => R,
	cont2: (u: User["fields"]) => R,
): R =>
	e.type === ProjectOrUser.Project
		? cont1(e.fields as Project["fields"])
		: cont2(e.fields as User["fields"]);

type Projects = FireCollection<Project>;
type Users = FireCollection<User>;
type Globals = [GlobalTable];

/**
 * TODO:
 * - Should `contactInfo`/`collaborators` be more structured?
 */
export type Project = {
	id: DocId;
	fields: {
		name: string;
		creator: DocumentReference;
		contactInfo: string;
		overview: string;
		coverImage: string | null;
		tags: string[];
		irm: IRM;
		roles: Role[];
	};
};

/**
 * TODO: What type should experience be?
 */
export type Role = {
	name: string;
	skillset: Skillset;
	experience: string;
	approxPay: number;
	commitment: number;
};

/**
 * TODO: Lots of potential for additional fields here
 */
export type User = {
	id: DocId;
	fields: {
		profileImage: string | null;
		firstName: string;
		lastName: string;
		email: string;
		bio: string;
		pronouns: string;
		availability: AvailSchedule;
		skills: string[];
		ownProjects: DocumentReference[];
		irm: IRM;
	};
};

export const userName = (u: User["fields"]) => u.firstName + " " + u.lastName;

export type IRM = {
	interested: DocumentReference[];
	rejected: DocumentReference[];
	matched: DocumentReference[];
};

type GlobalTable = { id: DocId; collections: {}; fields: {} };

export const emptyAvailability = (): AvailSchedule =>
	makeArr(() => Availability.NotAvailable, HOURS_PER_DAY * DAYS_PER_WEEK);

type AvailSchedule = Availability[];

type Hour = number;

type Time = { hour: Hour; day: Day };

export const setAvail = (s: AvailSchedule, { hour, day }: Time, a: Availability) => {
	s[day * HOURS_PER_DAY + hour] = a;
};

export const getAvail = (s: AvailSchedule, { hour, day }: Time) => s[day * HOURS_PER_DAY + hour];

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
	IMAGE = "image",
	TEXT = "text",
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

export type Skillset = Skill[];

export const DEFAULT_SKILL_SET: Skillset = [];

/**
 * Written as a getter rather than a constant to try and reduce potential
 * aliasing errors
 */
export const getDefaultRole = (i: number = 1): Role => ({
	name: `Role ${i}`,
	skillset: [],
	experience: "",
	approxPay: 0,
	commitment: 0,
});

export const addProject = async (fields: Project[Fields]): Promise<string> => {
	return addFireDoc("projects", { id: RANDOM, fields });
};

export const updateProject = (id: string, fields: Project[Fields]) =>
	addFireDoc("projects", { id, fields });

export const addUser = (fields: User[Fields]) => addFireDoc("users", { id: RANDOM, fields });

export const updateUser = (id: string, fields: User[Fields]) => addFireDoc("users", { id, fields });

export const getUserDocRef = (id: string) => doc(Firebase.db, "users", id);

export const getProjectDocRef = (id: string) => doc(Firebase.db, "projects", id);
