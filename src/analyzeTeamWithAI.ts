import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeTeamWithAI(
    main: string,
    teammates: string[],
    types: string[]
  ): Promise<string> {
    const teamList = [main, ...teammates].join(", ");
    const typeList = types.join(", ");
  
    const prompt = `
  คุณคือผู้เชี่ยวชาญด้าน Pokémon VGC 2025
  
  ทีมนี้ประกอบด้วย: ${teamList}
  โปเกมอนตัวหลักคือ: ${main}
  ประเภทที่แพ้ทางของโปเกมอนหลักคือ: ${typeList}
  
  กรุณาวิเคราะห์ทีมนี้โดยอธิบาย:
  1. กลยุทธ์หลักของทีมนี้ควรเป็นแบบใด
  2. จุดแข็งของทีมนี้คืออะไร
  3. จุดอ่อนที่อาจต้องระวังคืออะไร
  4. อธิบายบทบาทแต่ละตัว
  5. ความ synergy ระหว่างสมาชิกในทีม
  6. เริ่มเกมมาควรทำยังไงบ้าง
  7. แพ้ทางทีมแบบใด
  8. และเสนอแนะเพิ่มเติมถ้าจำเป็น
  
  ตอบเป็นภาษาไทย
  `;
  
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });
  
    return response.choices[0].message.content ?? "ไม่สามารถวิเคราะห์ทีมได้";
  }
