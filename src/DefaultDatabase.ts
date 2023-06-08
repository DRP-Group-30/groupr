import { doc } from "firebase/firestore";
import { GrouprDatabase, Skill, emptyAvailability } from "./Backend";
import { RANDOM } from "./FirebaseUtil";
import { db } from "./Firebase";

const USERS = "users";

const DEFAULT_USER_ID = "uKSLFGA3qTuLmweXlv31";
const DEFAULT_USER = doc(db, "users", DEFAULT_USER_ID);

export const defaultDatabase = (): GrouprDatabase => ({
	projects: [
		{
			id: RANDOM,
			collections: { boxes: [], roles: [] },
			fields: {
				name: "Natty B's Battlegrounds",
				collaborators: [],
				contactInfo: "",
				overview:
					"Hol' up... is this the largest Battle Royale ever? With over 500 players in a single game?!",
				coverImage: null,
				tags: [
					"Multiplayer",
					"Battle-Royale",
					"Unreal Engine",
					"Realistic",
					"Shooter",
					"C++",
				],
				interested: [],
			},
		},
		{
			id: RANDOM,
			collections: { boxes: [], roles: [] },
			fields: {
				name: "Six Nights at Bobs",
				collaborators: [],
				contactInfo: "",
				overview: "Spooky",
				coverImage: null,
				tags: ["Horror", "Unity", "C#"],
				interested: [DEFAULT_USER],
			},
		},
		{
			id: RANDOM,
			collections: { boxes: [], roles: [] },
			fields: {
				name: "Overstory",
				collaborators: [],
				contactInfo: "",
				overview: "It's like my favourite game, Undertale",
				coverImage: null,
				tags: ["RPG", "Retro", "Pixel Art", "Narrative Driven", "RPGMaker"],
				interested: [DEFAULT_USER],
			},
		},
		{
			id: RANDOM,
			collections: { boxes: [], roles: [] },
			fields: {
				name: "Universe of Battlebuild",
				collaborators: [],
				contactInfo: "",
				overview: "Game where you can go anywhere and do anything!",
				coverImage: null,
				tags: [
					"MMO",
					"Multiplayer",
					"Fantasy",
					"Systems Driven",
					"Sandbox",
					"Roblox",
					"Lua",
				],
				interested: [],
			},
		},
		{
			id: RANDOM,
			collections: { boxes: [], roles: [] },
			fields: {
				name: "Afterstrife",
				collaborators: [],
				contactInfo: "Website: https://afterlifegames.gg/",
				overview:
					"5v5 Hero Shooter with a large focus on Melee combat, inspired by Gigantic",
				coverImage: null,
				tags: [
					"Multiplayer",
					"Hero Shooter",
					"MOBA",
					"Third Person",
					"Stylised",
					"Unreal Engine",
					"C++",
				],
				interested: [],
			},
		},
	],
	users: [
		{
			id: "uKSLFGA3qTuLmweXlv31",
			collections: {},
			fields: {
				username: "Default",
				givenNames: ["Jeff"],
				surname: "Default",
				skillset: {
					[Skill.PROGRAMMING]: 0,
					[Skill.MUSIC_AND_SOUND]: 0,
					[Skill.ART]: 0,
					[Skill.PROJECT_MANAGEMENT]: 0,
				},
				availability: emptyAvailability(),
				interested: [],
				rejected: [],
				matched: [],
			},
		},
		{
			id: RANDOM,
			collections: {},
			fields: {
				username: "LordQuaggan",
				givenNames: ["Nathaniel", "Robert"],
				surname: "Burke",
				skillset: {
					[Skill.PROGRAMMING]: 3,
					[Skill.MUSIC_AND_SOUND]: 0,
					[Skill.ART]: 0,
					[Skill.PROJECT_MANAGEMENT]: 0,
				},
				availability: emptyAvailability(),
				interested: [],
				rejected: [],
				matched: [],
			},
		},
		{
			id: RANDOM,
			collections: {},
			fields: {
				username: "Xx_NoscopeCow_xX",
				givenNames: ["Gary"],
				surname: "Rodriguez",
				skillset: {
					[Skill.PROGRAMMING]: 0,
					[Skill.MUSIC_AND_SOUND]: 2,
					[Skill.ART]: 4,
					[Skill.PROJECT_MANAGEMENT]: 0,
				},
				availability: emptyAvailability(),
				interested: [],
				rejected: [],
				matched: [],
			},
		},
		{
			id: RANDOM,
			collections: {},
			fields: {
				username: "TheCarrot",
				givenNames: ["Mark"],
				surname: "Pintos",
				skillset: {
					[Skill.PROGRAMMING]: 5,
					[Skill.MUSIC_AND_SOUND]: 0,
					[Skill.ART]: 0,
					[Skill.PROJECT_MANAGEMENT]: 5,
				},
				availability: emptyAvailability(),
				interested: [],
				rejected: [],
				matched: [],
			},
		},
	],
	globals: [
		{
			id: "globals",
			collections: {},
			fields: {},
		},
	],
});

export default defaultDatabase;
