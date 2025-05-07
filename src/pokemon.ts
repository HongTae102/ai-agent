import { Pokemon, TeamSuggestionResult } from "./pokemon-data";
import { analyzeTeamWithAI } from "./analyzeTeamWithAI";

/**
 * ดึงข้อมูล Pokémon จาก PokeAPI
 */
export async function getPokemon(name: string): Promise<Pokemon> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
  if (!response.ok) throw new Error(`ไม่พบโปเกมอนชื่อ "${name}"`);
  return response.json();
}

/**
 * ฟังก์ชันสำหรับแนะนำทีม Pokémon
 * รับชื่อ Pokémon ตัวหลัก แล้วคืนค่าทีมที่น่าจะเหมาะสมสำหรับแข่งขัน
 */
export async function suggestTeamForPokemon(pokemonName: string): Promise<TeamSuggestionResult> {
  const main = await getPokemon(pokemonName);
  const type = main.types[0]?.type.name;
  const counterTypes = await getCounterTypes(type);

  const aiResult = await analyzeTeamWithAI(main.name, counterTypes);

  const teammates = aiResult.teammates.map((name) => ({ name }));
  const strategy = aiResult.reasoning;

  return {
    main: {
      name: main.name,
      types: main.types.map((t) => t.type.name),
    },
    teammates,
    strategy,
    references: {
      pikalytics: "-", // อาจไม่จำเป็นถ้าใช้ AI ทั้งหมด
    },
  };
}

/**
 * คืนค่าประเภทที่อาจแพ้ทาง เพื่อใช้ประกอบ logic การเลือกทีม
 */
export async function getCounterTypes(type: string): Promise<string[]> {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${type.toLowerCase()}`);
      if (!res.ok) throw new Error(`ไม่พบข้อมูลประเภท ${type}`);
      const data = await res.json();
  
      const counters = data.damage_relations.double_damage_from.map((entry: any) => entry.name);
      return counters.length > 0 ? counters : ["normal", "fighting"];
    } catch (err) {
      console.error("Error fetching counter types:", err);
      return ["normal", "fighting"]; // fallback
    }
  }

/**
 * คืนชื่อโปเกมอนสำหรับแต่ละประเภท
 */
export async function getExamplePokemonByType(type: string): Promise<string> {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${type.toLowerCase()}`);
      if (!res.ok) throw new Error(`ไม่สามารถโหลดข้อมูลประเภท ${type}`);
      const data = await res.json();
  
      const allPokemon = data.pokemon.map((p: any) => p.pokemon.name);
      if (allPokemon.length === 0) return "pikachu";
  
      const randomIndex = Math.floor(Math.random() * allPokemon.length);
      return allPokemon[randomIndex];
    } catch (err) {
      console.error("Error fetching example Pokémon:", err);
      return "pikachu"; // fallback
    }
  }