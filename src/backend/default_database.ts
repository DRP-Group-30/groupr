import { doc } from "firebase/firestore";
import { GrouprDatabase, Skill, emptyAvailability } from ".";
import { RANDOM } from "../util/firebase";
import { Firebase } from "./firebase";

// const USERS = "users";

const DEFAULT_USER_ID = "uKSLFGA3qTuLmweXlv31";
const DEFAULT_USER = doc(Firebase.db, "users", DEFAULT_USER_ID);

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
					"MULTIPLAYER",
					"BATTLE-ROYALE",
					"UNREAL ENGINE",
					"REALISTIC",
					"SHOOTER",
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
				contactInfo: "sixnights@gmail.com",
				overview: "SPOOKY",
				coverImage: null,
				tags: ["HORROR", "UNITY", "C#"],
				interested: [DEFAULT_USER],
			},
		},
		{
			id: RANDOM,
			collections: { boxes: [], roles: [] },
			fields: {
				name: "Overstory",
				collaborators: [],
				contactInfo: "bob@overstory.com",
				overview: "It's like my favourite game, Undertale",
				coverImage: null,
				tags: ["RPG", "RETRO", "PIXEL ART", "NARRATIVE DRIVEN", "RPG MAKER"],
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
					"MULTIPLAYER",
					"FANTASY",
					"SYSTEMS DRIVEN",
					"SANDBOX",
					"ROBLOX",
					"LUA",
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
					"MULTIPLAYER",
					"HERO SHOOTER",
					"MOBA",
					"THIRD PERSON",
					"STYLISED",
					"UNREAL ENGINE",
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
