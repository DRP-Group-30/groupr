import { Firestore, doc } from "firebase/firestore";
import {
	Experience,
	GrouprDatabase,
	IRM,
	ProjectOrUser,
	emptyAvailability,
	getUserDocRef,
} from ".";
import { RANDOM } from "../util/firebase";
import { Firebase } from "./firebase";

// const USERS = "users";

const DEFAULT_USER_ID = "uKSLFGA3qTuLmweXlv31";
const DEFAULT_USER = doc(Firebase.db, "users", DEFAULT_USER_ID);

export const defaultDatabase = (): GrouprDatabase => ({
	projects: [
		{
			id: RANDOM,
			fields: {
				name: "Natty B's Battlegrounds",
				creator: getUserDocRef(DEFAULT_USER_ID),
				contactInfo: "natty@b.com",
				overview:
					"Hol' up... is this the largest Battle Royale ever? With over 500 players in a single game?!",
				coverImage: "x0psf22gvk801-cd18.jpg",
				tags: [
					"MULTIPLAYER",
					"BATTLE-ROYALE",
					"UNREAL ENGINE",
					"REALISTIC",
					"SHOOTER",
					"C++",
				],
				irm: emptyIRM(),
				roles: [
					{
						name: "Character Animator",
						skillset: ["Animation"],
						experience: Experience.Intermediate,
						approxPay: { min: 10, max: 15 },
						commitment: { min: 5, max: 10 },
					},
				],
			},
		},
		{
			id: RANDOM,
			fields: {
				name: "Six Nights at Bobs",
				creator: getUserDocRef(DEFAULT_USER_ID),
				contactInfo: "sixnights@gmail.com",
				overview: "SPOOKY",
				coverImage: "0x0.webp",
				tags: ["HORROR", "UNITY", "C#"],
				irm: emptyIRM(),
				roles: [],
			},
		},
		{
			id: RANDOM,
			fields: {
				name: "Overstory",
				creator: getUserDocRef(DEFAULT_USER_ID),
				contactInfo: "bob@overstory.com",
				overview: "It's like my favourite game, Undertale",
				coverImage: "Overstory.png",
				tags: ["RPG", "RETRO", "PIXEL ART", "NARRATIVE DRIVEN", "RPG MAKER"],
				irm: emptyIRM(),
				roles: [],
			},
		},
		{
			id: RANDOM,
			fields: {
				name: "Universe of Battlebuild",
				creator: getUserDocRef(DEFAULT_USER_ID),
				contactInfo: "https://discord.gg/battlebuild",
				overview: "Game where you can go anywhere and do anything!",
				coverImage: "Screenshot 2023-06-15 013346.png",
				tags: [
					"MMO",
					"MULTIPLAYER",
					"FANTASY",
					"SYSTEMS DRIVEN",
					"SANDBOX",
					"ROBLOX",
					"LUA",
				],
				irm: emptyIRM(),
				roles: [],
			},
		},
		{
			id: RANDOM,
			fields: {
				name: "Afterstrife",
				creator: getUserDocRef(DEFAULT_USER_ID),
				contactInfo: "https://afterlifegames.gg/",
				overview:
					"5v5 hero shooter with a large focus on melee combat, inspired by Gigantic",
				coverImage: "image.png",
				tags: [
					"MULTIPLAYER",
					"HERO SHOOTER",
					"MOBA",
					"THIRD PERSON",
					"STYLISED",
					"UNREAL ENGINE",
					"C++",
				],
				irm: emptyIRM(),
				roles: [],
			},
		},
		{
			id: RANDOM,
			fields: {
				name: "Very Far Away Horse",
				creator: getUserDocRef(DEFAULT_USER_ID),
				contactInfo: "Faraway@Horse.carr.ot",
				overview: "Horse is now even farther away",
				coverImage: "SmartSelect_20230612-164646_YouTube.png",
				tags: ["REALISTIC", "OPEN-WORLD", "REMAKE"],
				irm: emptyIRM(),
				roles: [],
			},
		},
	],
	// No Users: Managing firebase auth is more complicated than database
	// (permissions-wise) so we handle users differently.
	users: [],
	globals: [
		{
			id: "globals",
			collections: {},
			fields: {},
		},
	],
});

export default defaultDatabase;

export const emptyIRM = (): IRM => ({ interested: [], rejected: [], matched: [] });
