import { suggestTeamForPokemon, suggestTeamForPokemonSingle } from "./src/pokemon";
import { fetchPikalyticsTeammates } from "./src/pikalytics";
import { analyzeTeamWithAI } from "./src/analyzeTeamWithAI";
import { analyzeMatchupWithAI } from "./src/analyzeMatchupWithAI";

export const tools = [
  {
    type: "function",
    function: {
      name: "suggestTeamForPokemon",
      description: "แนะนำทีมที่เหมาะกับโปเกมอนหนึ่งตัว",
      parameters: {
        type: "object",
        properties: {
          pokemonName: {
            type: "string",
            description: "ชื่อของโปเกมอน",
          },
        },
        required: ["pokemonName"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "fetchPikalyticsTeammates",
      description: "ดึง teammate ยอดนิยมของโปเกมอนจาก Pikalytics",
      parameters: {
        type: "object",
        properties: {
          pokemonName: {
            type: "string",
            description: "ชื่อของโปเกมอน",
          },
        },
        required: ["pokemonName"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "analyzeTeamWithAI",
      description: "แนะนำทีมที่เหมาะกับโปเกมอนหนึ่งตัว วิเคราะห์ทีม Pokémon ที่สร้างขึ้น",
      parameters: {
        type: "object",
        properties: {
          main: {
            type: "string",
            description: "ชื่อโปเกมอนหลักในทีม",
          },
          teammates: {
            type: "array",
            items: { type: "string" },
            description: "รายชื่อ teammate ที่ใช้ในทีม",
          },
          counterTypes: {
            type: "array",
            items: { type: "string" },
            description: "ประเภทที่โปเกมอนหลักแพ้ทาง",
          },
        },
        required: ["main", "teammates", "counterTypes"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "suggestTeamForPokemonSingle",
      description: "แนะนำทีมที่เหมาะกับโปเกมอนหนึ่งตัวในโหมด Single Battle (BSS)",
      parameters: {
        type: "object",
        properties: {
          pokemonName: {
            type: "string",
            description: "ชื่อของโปเกมอน",
          },
        },
        required: ["pokemonName"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "analyzeMatchupWithAI",
      description: "วิเคราะห์ matchup ระหว่างทีมเราและทีมศัตรู",
      parameters: {
        type: "object",
        properties: {
          myTeam: {
            type: "array",
            items: { type: "string" },
            description: "ชื่อโปเกมอนของเราทั้ง 6 ตัว",
          },
          enemyTeam: {
            type: "array",
            items: { type: "string" },
            description: "ชื่อโปเกมอนของฝ่ายตรงข้ามทั้ง 6 ตัว",
          },
        },
        required: ["myTeam", "enemyTeam"],
      },
    },
  }
];

export const availableTools: Record<string, Function> = {
  suggestTeamForPokemon,
  fetchPikalyticsTeammates,
  analyzeTeamWithAI,
  suggestTeamForPokemonSingle,
  analyzeMatchupWithAI,
};
