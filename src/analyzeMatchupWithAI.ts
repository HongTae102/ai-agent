import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function analyzeMatchupWithAI(myTeam: string[], enemyTeam: string[]) {
  const prompt = `
คุณคือโค้ช Pokémon ผู้เชี่ยวชาญระดับโลก

**ทีมของเรา:**
${myTeam.join(", ")}

**ทีมคู่ต่อสู้:**
${enemyTeam.join(", ")}

🎯 วิเคราะห์ทีม:
1. คู่ต่อสู้มีตัวไหนน่ากลัวที่สุด?
2. ตัวไหนของเราที่รับมือได้ดี?
3. ควรเลือกตัวไหนเป็น Lead?
4. ตัวไหนควรหลีกเลี่ยงไม่ใช้งานในเกมนี้?
5. กลยุทธ์การเล่นควรเป็นเชิงรุกหรือรับ?

🎓 โปรดใช้ความรู้จาก Competitive Meta ล่าสุด (Single Battle, VCG) เช่นจาก Pikalytics, Smogon

ตอบกลับในรูปแบบ JSON ที่ประกอบด้วย:
{
  "lead": "ชื่อโปเกมอน",
  "threats": ["..."],
  "safeOptions": ["..."],
  "strategy": "อธิบายกลยุทธ์โดยรวม"
}
ห้ามใส่คำอธิบายอื่นนอกเหนือจาก JSON
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.5,
    messages: [{ role: "user", content: prompt }],
  });

  const text = res.choices[0].message.content || "";

  // หาจุดเริ่มต้นและสิ้นสุดของ JSON อย่างระมัดระวัง
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("ไม่พบ JSON ในผลลัพธ์");
  }

  const jsonText = text.slice(jsonStart, jsonEnd + 1);

  try {
    return JSON.parse(jsonText);
  } catch (e) {
    console.error("⚠️ JSON parse error:", jsonText);
    throw e;
  }
}
