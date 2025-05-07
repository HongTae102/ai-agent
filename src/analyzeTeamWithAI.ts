import OpenAI from "openai";
import { fetchPikalyticsTeammates } from "./pikalytics";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeTeamWithAI(
  main: string,
  counterTypes: string[]
): Promise<{ teammates: string[]; reasoning: string }> {
  const typeList = counterTypes.join(", ");
  
  const metaTeammates = await fetchPikalyticsTeammates(main);
  const teammateList = metaTeammates.join(", ");

  const prompt = `
  คุณเป็นผู้เชี่ยวชาญด้านการแข่งขัน Pokémon VGC 2025
  
  โปเกมอนหลักของฉันคือ: ${main}
  ประเภทที่โปเกมอนนี้แพ้ทางคือ: ${typeList}
  
  โปเกมอนที่มีการจับคู่กับ ${main} บ่อยที่สุดจากข้อมูล Pikalytics คือ:
  ${teammateList}
  
  🛑 ข้อจำกัดสำคัญ:
  กรุณาเลือกเพื่อนร่วมทีม 5 ตัว "เฉพาะจากรายชื่อด้านบนเท่านั้น" และไม่จำเป็นต้องเลือกจาก top 5
  แนะนำโปเกมอนที่ไม่ได้อยู่ในลิสต์นี้ ได้ตามความเหมาะสม
  
  🧠 เป้าหมาย:
  - จัดทีมที่สมดุลสำหรับการแข่งขัน VGC (ทีมทั้งหมดมี 6 ตัว รวม ${main})
  - ช่วยปิดจุดอ่อนจาก type ที่แพ้
  - มีการกระจายบทบาทที่ดี เช่น: ตัวโจมตีหลัก, ตัวซัพพอร์ต, ตัวเปลี่ยนสนาม, ตัวป้องกัน เป็นต้น

  กรุณาวิเคราะห์ทีมนี้โดยอธิบาย:
  1. กลยุทธ์หลักของทีมนี้ควรเป็นแบบใด
  2. จุดแข็งของทีมนี้คืออะไร
  3. จุดอ่อนที่อาจต้องระวังคืออะไร
  4. อธิบายบทบาทแต่ละตัว
  5. ความ synergy ระหว่างสมาชิกในทีม
  6. เริ่มเกมมาควรทำยังไงบ้าง
  7. แพ้ทางทีมแบบใด
  8. และเสนอแนะเพิ่มเติมถ้าจำเป็น
  
  🎯 กรุณาตอบกลับในรูปแบบ JSON ดังนี้:
  {
    "teammates": ["ชื่อโปเกมอน1", "ชื่อโปเกมอน2", "..."],
    "reasoning": "คำอธิบายเหตุผลว่าแต่ละตัวช่วยทีมอย่างไร และครอบคลุมจุดอ่อนอย่างไร"
  }
  `;
  

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  const rawText = response.choices[0].message.content ?? "";
  const match = rawText.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI ไม่ได้ตอบกลับในรูปแบบ JSON ที่ถูกต้อง");

  const parsed = JSON.parse(match[0]);
  return {
    teammates: parsed.teammates || [],
    reasoning: parsed.reasoning || "ไม่มีคำอธิบาย",
  };
}