import dotenv from 'dotenv';
import OpenAI from "openai";
import { PokemonAgent } from "./agents/pokemon-agent";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const run = async () => {
  const agent = new PokemonAgent(client);
  const response = await agent.askQuestion("อยากจัดทีมรอบ charizard สำหรับการแข่งขัน และแนะนำ item, ability, move ให้ด้วย");
  console.log(response);
};

run().then(() => {
  console.log("----------------------------------------------------------------");
});
