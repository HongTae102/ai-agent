import dotenv from 'dotenv';
dotenv.config(); 

import OpenAI from "openai";
import { PokemonAgent } from "./agents/pokemon-agent";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const run = async () => {
  const agent = new PokemonAgent(client);
  const response = await agent.askQuestion("อยากจัดทีม miraidon สำหรับการแข่งขัน ช่วยแนะนำ ability, item, move และช่วยวิเคราะห์ทีมให้หน่อย");
  console.log(response);
};

run().then(() => {
  console.log("----------------------------------------------------------------");
});
