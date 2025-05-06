import { suggestTeamForPokemon } from "./src/pokemon";
import { fetchPikalyticsTeammates } from "./src/pikalytics";

// รายชื่อ tools สำหรับ GPT agent
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
            description: "ชื่อของโปเกมอน เช่น 'Garchomp'",
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
            description: "ชื่อของโปเกมอน เช่น 'Garchomp'",
          },
        },
        required: ["pokemonName"],
      },
    },
  },
];

export const availableTools: Record<string, Function> = {
  suggestTeamForPokemon,
  fetchPikalyticsTeammates,
};
