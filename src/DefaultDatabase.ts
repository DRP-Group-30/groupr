import { GrouprDatabase, RANDOM, Skill, emptyAvailability } from "./Finder";

const defaultDatabase: GrouprDatabase = {
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
      id: RANDOM,
      collections: {},
      fields: {
        username: "LordQuaggan",
        givenNames: ["Nathaniel", "Robert"],
        surname: "Burke",
        skillset: new Map([[Skill.PROGRAMMING, 3]]),
        availability: emptyAvailability(),
      },
    },
    {
      id: RANDOM,
      collections: {},
      fields: {
        username: "Xx_NoscopeCow_xX",
        givenNames: ["Gary"],
        surname: "Rodriguez",
        skillset: new Map([
          [Skill.MUSIC_AND_SOUND, 2],
          [Skill.ART, 5],
        ]),
        availability: emptyAvailability(),
      },
    },
    {
      id: RANDOM,
      collections: {},
      fields: {
        username: "TheCarrot",
        givenNames: ["Mark"],
        surname: "Pintos",
        skillset: new Map([
          [Skill.PROJECT_MANAGEMENT, 4],
          [Skill.PROGRAMMING, 5],
        ]),
        availability: emptyAvailability(),
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
