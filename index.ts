import dotenv from 'dotenv';
dotenv.config(); 

import OpenAI from "openai";
import { PokemonAgent } from "./agents/pokemon-agent";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const run = async () => {
  const agent = new PokemonAgent(client);
  const response = await agent.askQuestion("อยากจัดทีม Pelipper");
  // const response = await agent.askQuestion("ถ้าทีมเรามี Garchomp, Rotom-Wash, Togekiss, snorlax, charizard, iron-hand เจอ Flutter Mane, Iron Bundle, Kingambit, raichu, tyranitar, miraidon ควรเล่นยังไง?");
  console.log(response);
};

run().then(() => {
  console.log("----------------------------------------------------------------");
});
