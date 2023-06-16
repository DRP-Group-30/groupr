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
			fields: {
				name: "Natty B's Battlegrounds",
				collaborators: [],
				contactInfo: "",
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
				interested: [],
				roles: [],
			},
		},
		{
			id: RANDOM,
			fields: {
				name: "Six Nights at Bobs",
				collaborators: [],
				contactInfo: "sixnights@gmail.com",
				overview: "SPOOKY",
				coverImage: "0x0.webp",
				tags: ["HORROR", "UNITY", "C#"],
				interested: [DEFAULT_USER],
				roles: [],
			},
		},
		{
			id: RANDOM,
			fields: {
				name: "Overstory",
				collaborators: [],
				contactInfo: "bob@overstory.com",
				overview: "It's like my favourite game, Undertale",
				coverImage: "Overstory.png",
				tags: ["RPG", "RETRO", "PIXEL ART", "NARRATIVE DRIVEN", "RPG MAKER"],
				interested: [DEFAULT_USER],
				roles: [],
			},
		},
		{
			id: RANDOM,
			fields: {
				name: "Universe of Battlebuild",
				collaborators: [],
				contactInfo: "",
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
				interested: [],
				roles: [],
			},
		},
		{
			id: RANDOM,
			fields: {
				name: "Afterstrife",
				collaborators: [],
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
				interested: [],
				roles: [],
			},
		},
		{
			id: RANDOM,
			fields: {
				name: "Very Far Away Horse",
				collaborators: [],
				contactInfo: "Faraway@Horse.carr.ot",
				overview: "Horse is now even farther away",
				coverImage: "SmartSelect_20230612-164646_YouTube.png",
				tags: ["REALISTIC", "OPEN-WORLD", "REMAKE"],
				interested: [],
				roles: [],
			},
		},
	],
	users: [
		{
			id: "uKSLFGA3qTuLmweXlv31",
			fields: {
				username: "Default",
				givenNames: ["Jeff"],
				surname: "Default",
				skillset: [],
				availability: emptyAvailability(),
				interested: [],
				rejected: [],
				matched: [],
			},
		},
		{
			id: RANDOM,
			fields: {
				username: "LordQuaggan",
				givenNames: ["Nathaniel", "Robert"],
				surname: "Burke",
				skillset: [Skill.PROGRAMMING],
				availability: emptyAvailability(),
				interested: [],
				rejected: [],
				matched: [],
			},
		},
		{
			id: RANDOM,
			fields: {
				username: "Xx_NoscopeCow_xX",
				givenNames: ["Gary"],
				surname: "Rodriguez",
				skillset: [Skill.MUSIC_AND_SOUND, Skill.ART],
				availability: emptyAvailability(),
				interested: [],
				rejected: [],
				matched: [],
			},
		},
		{
			id: RANDOM,
			fields: {
				username: "TheCarrot",
				givenNames: ["Mark"],
				surname: "Pintos",
				skillset: [Skill.PROGRAMMING, Skill.PROJECT_MANAGEMENT],
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
