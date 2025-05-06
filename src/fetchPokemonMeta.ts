import fetch from 'node-fetch';
import { PikalyticsAPIResponse } from './pokemon-data';

export async function fetchPikalyticsMeta(pokemonName: string): Promise<string> {
  try {
    const response = await fetch(`https://pikalytics.com/api/sv/ou/${pokemonName.toLowerCase()}`);
    const data = await response.json() as PikalyticsAPIResponse;

    const usage = data.usage || "ไม่พบข้อมูล usage";
    const teammates = data.teammates?.slice(0, 3).map((t: any) => t.name).join(", ") || "ไม่พบ teammates";

    return `อัตราการใช้งาน: ${usage}\nTeammates ยอดนิยม: ${teammates}`;
  } catch (error) {
    return "ไม่สามารถดึงข้อมูลจาก Pikalytics ได้";
  }
}

export async function fetchSmogonMeta(pokemonName: string): Promise<string> {
  try {
    const res = await fetch(`https://www.smogon.com/dex/sv/pokemon/${pokemonName.toLowerCase()}/`);
    const html = await res.text();

    const overviewMatch = html.match(/<p>(.*?)<\/p>/i);
    const overview = overviewMatch ? overviewMatch[1].replace(/<[^>]*>/g, '') : "ไม่มีข้อมูลจาก Smogon";

    return `Smogon Overview: ${overview}`;
  } catch (error) {
    return "ไม่สามารถดึงข้อมูลจาก Smogon ได้";
  }
}
