import puppeteer from 'puppeteer';

export async function fetchPikalyticsTeammates(pokemonName: string): Promise<string[]> {
  try {
    const url = `https://pikalytics.com/pokedex/gen9vgc2025regi/${pokemonName.toLowerCase()}`;
    console.log(`[DEBUG] Navigating to: ${url}`);
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('a.teammate_entry', { timeout: 5000 });
    
    console.log(`[DEBUG] Extracting teammates from page...`);
    const teammates = await page.$$eval('a.teammate_entry', (elements) =>
      elements
        .map((el) => el.getAttribute('data-name'))
        .filter((name): name is string => !!name)
    );

    console.log(`[DEBUG] Raw teammates:`, teammates);
    await browser.close();

    // เติม teammate ให้ครบ 5 ตัว ถ้ายังไม่พอ
    const fallbackTeammates = ["NULL", "NULL", "NULL", "NULL", "NULL"];
    const finalTeammates = [...teammates];

    for (const fallback of fallbackTeammates) {
      if (finalTeammates.length >= 5) break;
      if (!finalTeammates.includes(fallback) && fallback.toLowerCase() !== pokemonName.toLowerCase()) {
        finalTeammates.push(fallback);
      }
    }

    return finalTeammates.slice(0, 5);
  } catch (err) {
    console.error("fetchPikalyticsTeammates error:", err);
    return [];
  }
}
