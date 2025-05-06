import { suggestTeamForPokemon } from "./src/pokemon";
import { fetchPikalyticsTeammates } from "./src/pikalytics";
import { analyzeTeamWithAI } from "./src/analyzeTeamWithAI";

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
      description: "วิเคราะห์ทีม Pokémon ที่สร้างขึ้น",
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
];

export const availableTools: Record<string, Function> = {
  suggestTeamForPokemon,
  fetchPikalyticsTeammates,
  analyzeTeamWithAI,
};
