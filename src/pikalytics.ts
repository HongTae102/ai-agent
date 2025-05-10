import puppeteer from "puppeteer";

export async function fetchPikalyticsTeammates(pokemonName: string): Promise<string[]> {
  try {
    const url = `https://pikalytics.com/pokedex/gen9vgc2025regi/${pokemonName.toLowerCase()}`;
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('a.teammate_entry', { timeout: 30000 });
    
    const teammates = await page.$$eval('a.teammate_entry', (elements) =>
      elements
        .map((el) => el.getAttribute('data-name'))
        .filter((name): name is string => !!name)
    );

    await browser.close();

    // หากไม่ต้องเติม NULL:
    return teammates;

    // หรือหากยังอยากให้มี fallback แต่ไม่ตัดเหลือ 5 ตัว:
    /*
    const fallbackTeammates = ["NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL"];
    const finalTeammates = [...teammates];

    for (const fallback of fallbackTeammates) {
      if (!finalTeammates.includes(fallback) && fallback.toLowerCase() !== pokemonName.toLowerCase()) {
        finalTeammates.push(fallback);
      }
    }

    return finalTeammates;
    */
  } catch (err) {
    console.error("fetchPikalyticsTeammates error:", err);
    return [];
  }
}

export async function fetchPikalyticsTeammatesSingle(pokemonName: string): Promise<string[]> {
  try {
    const url = `https://pikalytics.com/pokedex/homebss/${pokemonName.toLowerCase()}`;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('a.teammate_entry', { timeout: 30000 });

    const teammates = await page.$$eval('a.teammate_entry', (elements) =>
      elements
        .map((el) => el.getAttribute('data-name'))
        .filter((name): name is string => !!name)
    );

    await browser.close();

    return teammates;
    
  } catch (err) {
    console.error("fetchPikalyticsTeammatesSingle error:", err);
    return [];
  }
}

