import OpenAI from "openai";
import { availableTools, tools } from "../tool";

/**
 * Represents a Pokémon agent that suggests competitive teams.
 */
export class PokemonAgent {
    private client: OpenAI;

    private messages = [
        {
            role: 'system',
            content: `
                คุณคือผู้เชี่ยวชาญโปเกมอนสายแข่งขันที่ให้คำแนะนำในการจัดทีม

                🎯 เป้าหมายของคุณ:
                - ช่วยผู้ใช้เลือกโปเกมอนที่เหมาะสมสำหรับจัดทีมแข่งขัน (competitive team)
                - วิเคราะห์จากโปเกมอนที่ผู้ใช้ให้มา 1 ตัว และแนะนำตัวอื่น ๆ ให้ครบทีม ทีมมีทั้งหมด 6 ตัว
                - คำนึงถึงบทบาท (role), type synergy, และความครอบคลุมในการต่อสู้
                - ใช้ทั้งความรู้ที่คุณมี + ข้อมูล usage ปัจจุบันจากเว็บ Pikalytics

                🛠 ข้อจำกัด:
                - คุณมีฟังก์ชัน suggestTeamForPokemon(name) เพียงฟังก์ชันเดียวสำหรับแนะนำทีม
                - คุณไม่มีฟังก์ชันสร้างทีมเองจากศูนย์ ต้องใช้ฟังก์ชันนี้ในการคำนวณทีม
                - suggestTeamForPokemon(name) → แนะนำทีมแบบอิงจากข้อมูลเดิม
                - getPikalyticsUsage(name) → ดึงข้อมูลโปเกมอนยอดนิยมจากเว็บ

                🎯 วิธีใช้:
                - เริ่มจากเรียกใช้ getPikalyticsUsage เพื่อดูว่าโปเกมอนตัวไหนจับคู่บ่อย
                - วิเคราะห์ข้อมูลนั้นร่วมกับความรู้เรื่อง synergy และ role balance
                - ตอบให้เหมือนโค้ช พร้อมเหตุผลประกอบแต่ละตัวเลือก

                🗣 รูปแบบการตอบ:
                - ตอบเหมือนโค้ชที่ให้คำปรึกษาเรื่องการแข่งขัน (จริงจังแต่เป็นกันเอง)
                - อธิบายเหตุผลสั้น ๆ ว่าทำไมเลือกแต่ละตัว เช่น เสริม coverage, รับจุดอ่อนของตัวหลัก
                - หลีกเลี่ยง JSON หรือข้อความที่ดูเป็นโค้ดเกินไป
                - หากมีแหล่งอ้างอิงที่น่าเชื่อถือ เช่น Smogon หรือ Bulbapedia ให้แทรกลิงก์ประกอบคำแนะนำด้วย

                📋 ตัวอย่างคำตอบที่เหมาะสม:

                ทีมที่เหมาะกับ Garchomp:
                - 🛡️ Gholdengo - ช่วยรับ Ice กับ Fairy ที่ Garchomp แพ้ + ยังสามารถเสริม Special-Attack ที่ Gachomp ขาดได้
                - 💖 Murkrow - สามารถ set up Tailwind เพื่อเพิ่ม Speed ให้ Garchomp
                - 🌿 Flutter Mane - สำหรับการแก้ทางโปเกมอนตัวอื่นๆ ที่มีความเร็วกว่า Gachomp
                - ⚡ Rotom-Wash - ครอบคลุมน้ำ-บิน + Trick ได้ด้วย + ต้านน้ำ
                - 🔥 Hydreigon - เสริม offensive core ตีพวก Psychic/Ghost + Levitate ทำให้ยืนคู่กันได้ดี

                แบบนี้จะได้ทีมสมดุล มีทั้งบุก-รับ-utility พร้อมลุยได้เลย!

                ดูข้อมูลเพิ่มเติม: https://www.smogon.com/dex/sv/pokemon/garchomp
            `
        }
    ];

    /**
     * Creates a new instance of the PokemonAgent.
     * @param client - An instance of the OpenAI client used for processing Pokémon-related queries.
     */
    constructor(client: OpenAI) {
        this.client = client;
    }

    /**
     * Processes a Pokémon-related question and provides a competitive team suggestion.
     * @param message - The Pokémon-related question or query from the user.
     * @returns A Promise that resolves to a string containing the response.
     */
    askQuestion = async (message: string): Promise<string> => {
        this.messages.push({ role: 'user', content: message });

        const MAX_ITERATIONS = 5;
        let iterations = 0;

        while (iterations < MAX_ITERATIONS) {
            console.log(`Iteration: ${iterations}`);

            const response = await this.client.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: this.messages as any,
                temperature: 0.5,
                tools: tools as any,
            });

            const { finish_reason, message } = response.choices[0];

            if (finish_reason === 'stop') {
                this.messages.push(message as any);
                return message.content ?? "ไม่สามารถตอบได้ในตอนนี้ครับ";
            }

            if (finish_reason === 'tool_calls') {
                const call = message.tool_calls![0];
                const func = availableTools[call.function.name];
                console.log(call.function.name);
                const args = JSON.parse(call.function.arguments);
                const result = await func(...Object.values(args));

                this.messages.push({
                    role: 'function',
                    name: call.function.name,
                    content: typeof result === "string" ? result : JSON.stringify(result),
                } as any);
            }

            iterations++;
        }

        return "ลองใหม่อีกครั้งพร้อมคำถามที่เฉพาะเจาะจงมากขึ้นนะครับ";
    };
}
