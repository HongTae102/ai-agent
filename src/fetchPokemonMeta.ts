import fetch from 'node-fetch';
import { PikalyticsAPIResponse } from './pokemon-data';

export async function fetchPikalyticsMeta(pokemonName: string): Promise<string> {
  try {
    const response = await fetch(`https://pikalytics.com/pokedex/gen9vgc2025regi/${pokemonName.toLowerCase()}`);
    const data = await response.json() as PikalyticsAPIResponse;

    const usage = data.usage || "ไม่พบข้อมูล usage";
    const teammates = data.teammates?.slice(0, 10).map((t: any) => t.name).join(", ") || "ไม่พบ teammates";

    return `อัตราการใช้งาน: ${usage}\nTeammates ยอดนิยม: ${teammates}`;
  } catch (error) {
    return "ไม่สามารถดึงข้อมูลจาก Pikalytics ได้";
  }
}
