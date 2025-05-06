import { fetchPikalyticsMeta, fetchSmogonMeta } from "./fetchPokemonMeta";
import { fetchPikalyticsTeammates } from "./pikalytics";
import { Pokemon, TeamSuggestionResult } from "./pokemon-data";

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
export async function suggestTeamForPokemon(
  pokemonName: string
): Promise<TeamSuggestionResult> {
  const main = await getPokemon(pokemonName);
  const type = main.types[0]?.type.name;
  const counterTypes = await getCounterTypes(type);

  let teammatesData = await fetchPikalyticsTeammates(pokemonName);

  let teammates;
  if (teammatesData && teammatesData.length > 0) {
    teammates = teammatesData.slice(0, 3).map((name, index) => ({
      name,
      role: getTeamRole(index),
    }));
  } else {
    teammates = await Promise.all(
      counterTypes.map(async (t, index) => ({
        name: await getExamplePokemonByType(t),
        role: getTeamRole(index),
      }))
    );
  }

  const pikalyticsMeta = await fetchPikalyticsMeta(pokemonName);
  const smogonMeta = await fetchSmogonMeta(pokemonName);

  return {
    main: {
      name: main.name,
      types: main.types.map((t) => t.type.name),
    },
    teammates,
    strategy: `ทีมนี้ถูกสร้างโดยอิงจากการเสริมจุดอ่อนของ ${main.name} โดยพิจารณาจากประเภทที่แพ้ (${counterTypes.join(", ")}) และข้อมูลการใช้งานจากเว็บไซต์ต่าง ๆ`,
    references: {
      pikalytics: pikalyticsMeta,
      smogon: smogonMeta,
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

/**
 * ระบุบทบาทในทีมจากตำแหน่ง
 */
function getTeamRole(index: number): string {
  const roles = ["wall", "sweeper", "support", "hazard setter", "tank", "utility"];
  return roles[index % roles.length];
}
