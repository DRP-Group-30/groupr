import { GrouprDatabase, Skill, emptyAvailability } from "./Backend";
import { RANDOM } from "./FirebaseUtil";

export const defaultDatabase: GrouprDatabase = {
	projects: [
		{
			id: RANDOM,
			collections: { boxes: [], roles: [] },
			fields: {
				name: "Six Nights at Bobs",
				collaborators: [],
				contactInfo: "",
				overview: "Spooky",
				coverImage: null,
			},
		},
		{
			id: RANDOM,
			collections: { boxes: [], roles: [] },
			fields: {
				name: "Gremlins",
				collaborators: [],
				contactInfo: "",
				overview: "Spooky",
				coverImage: null,
			},
		},
		{
			id: RANDOM,
			collections: { boxes: [], roles: [] },
			fields: {
				name: "Natty B's Battlegrounds",
				collaborators: [],
				contactInfo: "",
				overview: "Hol' up...",
				coverImage: null,
			},
		},
		{
			id: RANDOM,
			collections: { boxes: [], roles: [] },
			fields: {
				name: "Call of Work",
				collaborators: [],
				contactInfo: "",
				overview: "DRP",
				coverImage: null,
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
				skillset: {},
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
				skillset: { [Skill.PROGRAMMING]: 3 },
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
				skillset: { [Skill.MUSIC_AND_SOUND]: 2, [Skill.ART]: 4 },
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
				skillset: { [Skill.PROJECT_MANAGEMENT]: 5, [Skill.PROGRAMMING]: 5 },
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
};

export default defaultDatabase;
