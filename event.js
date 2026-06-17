/**
 * JIANGHU RPG — EVENT DATABASE v1.0
 * ฐานข้อมูลเหตุการณ์สำรวจ (Exploration Events)
 * เอกสารนี้ถูกออกแบบให้ทำงานร่วมกับ `game_bible_v1.md` และ `map_database.md` โดยตรง ทุก Event อ้างอิงตาม Schema 13.6 ของ Game Bible และถูกแบ่ง Pool ตามระดับแมพ (Map Level 1–10) เพื่อความสมดุลและรองรับระบบ Data-Driven Architecture
 * * 📌 หมายเหตุระบบ: 
 * - อัตราการเกิด Event จะถูกปรับด้วยค่า LUCK ผู้เล่นตามสูตรใน Game Bible Sec. 10.2
 * - ผลลัพธ์จะแสดงผลทันที ไม่มี Delay หรือบทสนทนายาว
 * - Event ร้ายจะไม่ทำให้ HP ถึง 0 โดยตรง
 * - รูปแบบข้อมูลพร้อมสำหรับ Parse ไปยัง JSON/JS Engine ได้ทันที
 */

export const EventDatabase = [
    // 🌲 Map Level 1: หมู่บ้านและป่าชายขอบ (MAP-001 ถึง MAP-006)
    {
        eventId: "EVT-L1-01",
        mapLevel: 1,
        eventName: "สมุนไพรริมทาง",
        mapIdArea: "MAP-001, 002",
        type: "Resource",
        condition: "None",
        description: "พบต้นสมุนไพรหายางงอกอยู่ใต้รากไม้ใหญ่",
        outcomes: "+Gold 10-30, +HP 5%, ได้ Item (สมุนไพร Lv1)",
        chance: "Common"
    },
    {
        eventId: "EVT-L1-02",
        mapLevel: 1,
        eventName: "กับดักนายพราน",
        mapIdArea: "MAP-001, 003",
        type: "Trap",
        condition: "None",
        description: "ก้าวพลาดเหยียบกับดักเหล็กเก่าสนิมเขรอะ",
        outcomes: "-HP 8%, -MP 5%, เสียสถานะเล็กน้อย (Bruised 1 Turn)",
        chance: "Uncommon"
    },
    {
        eventId: "EVT-L1-03",
        mapLevel: 1,
        eventName: "หีบไม้เก่าริมน้ำ",
        mapIdArea: "MAP-002, 004",
        type: "Treasure",
        condition: "None",
        description: "หีบไม้ผุพังลอยมาติดตลิ่ง ล็อกด้วยสนิม",
        outcomes: "เปิดได้: +Gold 50-150, ได้ Item (อุปกรณ์ขาว/เขียว)",
        chance: "Uncommon"
    },
    {
        eventId: "EVT-L1-04",
        mapLevel: 1,
        eventName: "ซากค่ายร้าง",
        mapIdArea: "MAP-005, 006",
        type: "Rest Spot",
        condition: "None",
        description: "เต็นท์เก่าและกองไฟมอดยังพอให้ความอบอุ่น",
        outcomes: "+HP 15%, +MP 10%, ฟื้นพลังเล็กน้อย",
        chance: "Rare"
    },
    {
        eventId: "EVT-L1-05",
        mapLevel: 1,
        eventName: "รอยเท้าลึกลับ",
        mapIdArea: "MAP-001-006",
        type: "Environmental",
        condition: "AGI ≥ 10",
        description: "ติดตามรอยเท้าจางๆ ไปตามพงหญ้า",
        outcomes: "เปิดทางลับ (Secret Path), +EXP 20, +Gold 40",
        chance: "Rare"
    },

    // ⛰️ Map Level 2: เนินเขาและถ้ำหิน (MAP-007 ถึง MAP-012)
    {
        eventId: "EVT-L2-01",
        mapLevel: 2,
        eventName: "แหล่งแร่ดิบ",
        mapIdArea: "MAP-007, 008",
        type: "Resource",
        condition: "STR ≥ 12",
        description: "ขุดพบก้อนแร่ฝังอยู่ตามผนังถ้ำ",
        outcomes: "+Gold 80-200, ได้ Item (แร่ธาตุ/วัสดุ Lv2)",
        chance: "Common"
    },
    {
        eventId: "EVT-L2-02",
        mapLevel: 2,
        eventName: "หินถล่มกะทันหัน",
        mapIdArea: "MAP-009, 010",
        type: "Environmental",
        condition: "None",
        description: "เสียงก้องดังสนั่น หินร่วงลงมาปิดทาง",
        outcomes: "-HP 12%, -MP 8%, เสียเวลาสำรวจ 1 AP",
        chance: "Uncommon"
    },
    {
        eventId: "EVT-L2-03",
        mapLevel: 2,
        eventName: "น้ำพุร้อนใต้ดิน",
        mapIdArea: "MAP-011, 012",
        type: "Rest Spot",
        condition: "None",
        description: "ไอน้ำลอยขึ้นจากแอ่งน้ำใสอุ่น",
        outcomes: "+HP 25%, +MP 20%, ลดสถานะ Exhausted",
        chance: "Rare"
    },
    {
        eventId: "EVT-L2-04",
        mapLevel: 2,
        eventName: "ทางแยกถ้ำมืด",
        mapIdArea: "MAP-007-012",
        type: "Puzzle",
        condition: "INT ≥ 15",
        description: "เลือกทางซ้ายหรือขวาตามสัญลักษณ์โบราณ",
        outcomes: "ถูก: +EXP 50, +Buff (Clarity 2 Turns) / ผิด: -HP 5%, กลับไปจุดเดิม",
        chance: "Uncommon"
    },

    // 🏜️ Map Level 3: ทะเลทรายและที่รกร้าง (MAP-013 ถึง MAP-018)
    {
        eventId: "EVT-L3-01",
        mapLevel: 3,
        eventName: "โอเอซิสลวงตา",
        mapIdArea: "MAP-013, 014",
        type: "Environmental",
        condition: "LUCK ≥ 10",
        description: "เห็นแหล่งน้ำและร่มไม้ แต่ความจริงเป็นภาพลวง",
        outcomes: "+HP 10%, -MP 15%, เสียสถานะ (Dehydration 2 Turns)",
        chance: "Uncommon"
    },
    {
        eventId: "EVT-L3-02",
        mapLevel: 3,
        eventName: "พายุทราย",
        mapIdArea: "MAP-015-018",
        type: "Environmental",
        condition: "None",
        description: "ทรายพัดรุนแรงปิดการมองเห็นและกัดกร่อน",
        outcomes: "-HP 10%, -MP 10%, ลด ACC ชั่วคราว 3 Turn",
        chance: "Common"
    },
    {
        eventId: "EVT-L3-03",
        mapLevel: 3,
        eventName: "โครงกระดูกนักเดินทาง",
        mapIdArea: "MAP-013, 016",
        type: "Treasure",
        condition: "CON ≥ 12",
        description: "พบร่างแห้งและถุงหนังฝังครึ่งทราย",
        outcomes: "+Gold 150-300, ได้ Item (คัมภีร์/อุปกรณ์เก่า)",
        chance: "Uncommon"
    },
    {
        eventId: "EVT-L3-04",
        mapLevel: 3,
        eventName: "ตลาดเร่ลับ",
        mapIdArea: "MAP-017, 018",
        type: "NPC",
        condition: "None",
        description: "ชายคลุมผ้าเปิดขายของหายากใต้เงาทราย",
        outcomes: "ซื้อของลดราคา 15%, หรือแลกเปลี่ยนด้วยสถานะ",
        chance: "Rare"
    },

    // 🪦 Map Level 4: สุสานและบึงพิษ (MAP-019 ถึง MAP-023)
    {
        eventId: "EVT-L4-01",
        mapLevel: 4,
        eventName: "แท่นบูชาวิญญาณ",
        mapIdArea: "MAP-019, 020",
        type: "Puzzle",
        condition: "INT ≥ 18",
        description: "วางดอกไม้หรือเลือดบนแท่นหินสลัก",
        outcomes: "ถูก: +Buff (Spirit Ward 3 Turn) / ผิด: -MP 20%, เกิดเสียงก้อง",
        chance: "Uncommon"
    },
    {
        eventId: "EVT-L4-02",
        mapLevel: 4,
        eventName: "หมอกพิษ",
        mapIdArea: "MAP-021, 022",
        type: "Environmental",
        condition: "None",
        description: "หมอกสีเขียวขุ่นลอยปกคลุมทางเดิน",
        outcomes: "-HP 15%, -MP 10%, ติดสถานะ Poisoned 1 Turn",
        chance: "Common"
    },
    {
        eventId: "EVT-L4-03",
        mapLevel: 4,
        eventName: "หีบฝังศพโบราณ",
        mapIdArea: "MAP-020, 023",
        type: "Treasure",
        condition: "STR ≥ 15",
        description: "เปิดฝาโลงหินที่สลักลวดลายประหลาด",
        outcomes: "+Gold 200-500, ได้ Item (Scroll ม่วง/เขียว)",
        chance: "Rare"
    },
    {
        eventId: "EVT-L4-04",
        mapLevel: 4,
        eventName: "นักบวชเร่ร่อน",
        mapIdArea: "MAP-019-023",
        type: "NPC",
        condition: "None",
        description: "ชายแก่ถือไม้เท้าเดินทวนกระแสหมอก",
        outcomes: "+HP 20% หรือ +EXP 40 (เลือกผลได้ 1 อย่าง)",
        chance: "Uncommon"
    },

    // 🏰 Map Level 5: เมืองปราการและเทือกเขาสูง (MAP-024 ถึง MAP-030)
    {
        eventId: "EVT-L5-01",
        mapLevel: 5,
        eventName: "บ่อน้ำศักดิ์สิทธิ์",
        mapIdArea: "MAP-024, 025",
        type: "Rest Spot",
        condition: "None",
        description: "น้ำในบ่อสะท้อนแสงจันทร์จางๆ",
        outcomes: "+HP 30%, +MP 25%, ฟื้นสถานะผิดปกติทั้งหมด",
        chance: "Rare"
    },
    {
        eventId: "EVT-L5-02",
        mapLevel: 5,
        eventName: "ข่าวลือจากนักบวช",
        mapIdArea: "MAP-026, 027",
        type: "NPC",
        condition: "None",
        description: "ชายในชุดคลุมบอกทางลับและอันตรายข้างหน้า",
        outcomes: "เปิดจุดลับ (Hidden Path), +Buff (Awareness 2 Turn)",
        chance: "Uncommon"
    },
    {
        eventId: "EVT-L5-03",
        mapLevel: 5,
        eventName: "กำแพงร้าว",
        mapIdArea: "MAP-028, 029",
        type: "Environmental",
        condition: "STR ≥ 20",
        description: "ช่องแคบระหว่างหินที่พอจะแทรกตัวผ่านได้",
        outcomes: "+EXP 60, พบ Treasure ซ่อน, เสีย HP 5% จากหินเสียดสี",
        chance: "Common"
    },
    {
        eventId: "EVT-L5-04",
        mapLevel: 5,
        eventName: "ห้องลับในตำหนัก",
        mapIdArea: "MAP-030",
        type: "Puzzle",
        condition: "INT ≥ 22, LUCK ≥ 15",
        description: "แก้ไขกลไกประตูไม้ด้วยลำดับการกดสลับ",
        outcomes: "เปิดทางลับ, +Gold 400-800, ได้ Scroll ทอง",
        chance: "Rare"
    },

    // 🌌 Map Level 6: ดินแดนเสียงสวรรค์ (MAP-031 ถึง MAP-035)
    {
        eventId: "EVT-L6-01",
        mapLevel: 6,
        eventName: "ถ้ำวิญญาณสะท้อนเสียง",
        mapIdArea: "MAP-031, 032",
        type: "Environmental",
        condition: "AGI ≥ 25",
        description: "เสียงก้องจากภายในถ้ำส่งผลต่อสมาธิ",
        outcomes: "-MP 10% หรือ +MP 15% (สุ่มตาม LUCK)",
        chance: "Common"
    },
    {
        eventId: "EVT-L6-02",
        mapLevel: 6,
        eventName: "แสงจันทร์รักษาแผล",
        mapIdArea: "MAP-033, 034",
        type: "Rest Spot",
        condition: "None",
        description: "แสงสีเงินส่องลงมาบนแท่นหินเรียบ",
        outcomes: "+HP 40%, +Buff (Lunar Grace 2 Turn)",
        chance: "Uncommon"
    },
    {
        eventId: "EVT-L6-03",
        mapLevel: 6,
        eventName: "พลังวิญญาณรบกวน",
        mapIdArea: "MAP-031-035",
        type: "Trap",
        condition: "CON < 25",
        description: "คลื่นพลังงานมองไม่เห็นซัดเข้าใส่ร่างกาย",
        outcomes: "-HP 15%, -MP 20%, ติดสถานะ Stunned 1 Turn",
        chance: "Rare"
    },
    {
        eventId: "EVT-L6-04",
        mapLevel: 6,
        eventName: "พ่อค้าวิญญาณ",
        mapIdArea: "MAP-032, 035",
        type: "NPC",
        condition: "None",
        description: "เงาโปร่งแสงเปิดแผงขายของเรืองแสง",
        outcomes: "แลกเปลี่ยน Item ด้วย EXP หรือ MP, ได้ของระดับฟ้า/ม่วง",
        chance: "Uncommon"
    },

    // ❄️ Map Level 7: เทือกเขาน้ำแข็งและหุบเขาหนาว (MAP-036 ถึง MAP-041)
    {
        eventId: "EVT-L7-01",
        mapLevel: 7,
        eventName: "ถ้ำน้ำแข็งลับ",
        mapIdArea: "MAP-036, 037",
        type: "Rest Spot",
        condition: "CON ≥ 28",
        description: "โพรงน้ำแข็งที่อากาศอบอุ่นผิดปกติ",
        outcomes: "+HP 35%, +MP 30%, ลบล้างสถานะ Freeze/Cold",
        chance: "Rare"
    },
    {
        eventId: "EVT-L7-02",
        mapLevel: 7,
        eventName: "พายุหิมะ",
        mapIdArea: "MAP-038-041",
        type: "Environmental",
        condition: "None",
        description: "ลมหนาวพัดกรีดเกราะและผิวหนัง",
        outcomes: "-HP 12%, ลด DODGE ชั่วคราว 2 Turn",
        chance: "Common"
    },
    {
        eventId: "EVT-L7-03",
        mapLevel: 7,
        eventName: "คัมภีร์น้ำแข็งโบราณ",
        mapIdArea: "MAP-039, 040",
        type: "Treasure",
        condition: "INT ≥ 30",
        description: "พบเล่มหนังสือห่อผ้าหนาฝังใต้หิมะ",
        outcomes: "+EXP 100, ได้ Scroll ทอง/ม่วง, +MP 10%",
        chance: "Uncommon"
    },
    {
        eventId: "EVT-L7-04",
        mapLevel: 7,
        eventName: "รอยเท้าสัตว์ลึกลับ",
        mapIdArea: "MAP-036-041",
        type: "Trap",
        condition: "AGI ≥ 32",
        description: "รอยเท้าใหญ่ลากเป็นทางยาวสู่หุบเขาแคบ",
        outcomes: "เปิดทางลับ, +Gold 300-600, -HP 8% จากกับดักน้ำแข็ง",
        chance: "Uncommon"
    },

    // 🔥 Map Level 8: สวรรค์ชั้นเก้าและแดนเพลิง (MAP-042 ถึง MAP-044)
    {
        eventId: "EVT-L8-01",
        mapLevel: 8,
        eventName: "ลาวาใต้ดิน",
        mapIdArea: "MAP-042, 043",
        type: "Environmental",
        condition: "CON ≥ 35",
        description: "พื้นหินร้าวและไอร้อนพุ่งขึ้นสูง",
        outcomes: "-HP 18%, ได้ Item (แร่เพลิง), เสีย AP 1",
        chance: "Common"
    },
    {
        eventId: "EVT-L8-02",
        mapLevel: 8,
        eventName: "แร่ธาตุหายาก",
        mapIdArea: "MAP-042-044",
        type: "Resource",
        condition: "STR ≥ 35",
        description: "ก้อนหินดำแดงเปล่งประกายความร้อน",
        outcomes: "+Gold 500-1000, ได้ Material พิเศษ",
        chance: "Uncommon"
    },
    {
        eventId: "EVT-L8-03",
        mapLevel: 8,
        eventName: "พ่อค้าแร่ธาตุลับ",
        mapIdArea: "MAP-043, 044",
        type: "NPC",
        condition: "None",
        description: "ชายร่างใหญ่ขายของร้อนแรงด้วยมือเปล่า",
        outcomes: "ซื้ออุปกรณ์ทอง/แดง ในราคาพิเศษ หรือแลกเปลี่ยนด้วย HP",
        chance: "Rare"
    },
    {
        eventId: "EVT-L8-04",
        mapLevel: 8,
        eventName: "กับดักเพลิง",
        mapIdArea: "MAP-042-044",
        type: "Trap",
        condition: "None",
        description: "พื้นไม้และน้ำมันเก่าติดไฟง่ายเมื่อสัมผัส",
        outcomes: "-HP 20%, -MP 15%, ติดสถานะ Burn 2 Turn",
        chance: "Uncommon"
    },

    // 🌑 Map Level 9: ดินแดนมารและหุบเขาลับ (MAP-045 ถึง MAP-049)
    {
        eventId: "EVT-L9-01",
        mapLevel: 9,
        eventName: "ห้องลับในตำหนักมาร",
        mapIdArea: "MAP-045, 046",
        type: "Puzzle",
        condition: "INT ≥ 40, LUCK ≥ 20",
        description: "ประตูสลักอักษรโบราณเรียงลำดับผิด",
        outcomes: "ถูก: +Buff (Dark Resonance 3 Turn), +Scroll แดง",
        chance: "Rare"
    },
    {
        eventId: "EVT-L9-02",
        mapLevel: 9,
        eventName: "เลือดมาร",
        mapIdArea: "MAP-047, 048",
        type: "Trap",
        condition: "None",
        description: "แอ่งเลือดแดงสดบนพื้นหินส่งกลิ่นคาว",
        outcomes: "-HP 25%, -MP 20%, ติดสถานะ Bloodlust 2 Turn (เพิ่ม ATK แต่ลด DEF)",
        chance: "Uncommon"
    },
    {
        eventId: "EVT-L9-03",
        mapLevel: 9,
        eventName: "คัมภีร์มารโบราณ",
        mapIdArea: "MAP-045-049",
        type: "Treasure",
        condition: "None",
        description: "ม้วนหนังสัตว์เก่าเก็บในกล่องไม้ดำ",
        outcomes: "+EXP 150, ได้ Scroll แดง/ทอง, -MP 5% จากพลังรบกวน",
        chance: "Rare"
    },
    {
        eventId: "EVT-L9-04",
        mapLevel: 9,
        eventName: "ศิษย์ลัทธิลอบโจมตี",
        mapIdArea: "MAP-046, 049",
        type: "Environmental",
        condition: "AGI ≥ 42",
        description: "เงาดำพุ่งเข้าใส่จากมุมมืดก่อนจะหายวับ",
        outcomes: "-HP 15%, เปิดทางลับ, +Gold 800-1500",
        chance: "Common"
    },

    // 🌠 Map Level 10: ประตูสวรรค์และจุดจบ (MAP-050 ถึง MAP-052)
    {
        eventId: "EVT-L10-01",
        mapLevel: 10,
        eventName: "วังเทพลับ",
        mapIdArea: "MAP-050, 051",
        type: "Treasure",
        condition: "STR ≥ 50, INT ≥ 50",
        description: "ประตูแสงเปิดออกเมื่อผู้เดินทางมีความสมดุล",
        outcomes: "+Gold 1000-2500, ได้ Item แดง, +EXP 200",
        chance: "Rare"
    },
    {
        eventId: "EVT-L10-02",
        mapLevel: 10,
        eventName: "แสงเทพ",
        mapIdArea: "MAP-050-052",
        type: "Environmental",
        condition: "None",
        description: "แสงจ้าส่องลงมาจากฟากฟ้าไร้เมฆ",
        outcomes: "+HP 50%, +MP 50%, +Buff (Divine Shield 3 Turn)",
        chance: "Uncommon"
    },
    {
        eventId: "EVT-L10-03",
        mapLevel: 10,
        eventName: "คัมภีร์เทพโบราณ",
        mapIdArea: "MAP-051, 052",
        type: "Treasure",
        condition: "LUCK ≥ 35",
        description: "ม้วนแสงลอยอยู่กลางอากาศ จับต้องได้ยาก",
        outcomes: "+EXP 300, ได้ Scroll แดง (แน่นอน), +MP 20%",
        chance: "Rare"
    },
    {
        eventId: "EVT-L10-04",
        mapLevel: 10,
        eventName: "พ่อค้าเทพลับ",
        mapIdArea: "MAP-050, 052",
        type: "NPC",
        condition: "None",
        description: "เงาโปร่งแสงระดับตำนานเปิดแผงขายของสุดท้าย",
        outcomes: "ซื้ออุปกรณ์ระดับแดง/Mythic, หรือแลกเปลี่ยน Title/EXP",
        chance: "Uncommon"
    },
    {
        eventId: "EVT-L10-05",
        mapLevel: 10,
        eventName: "บันไดสู่นิรันดร์",
        mapIdArea: "MAP-052",
        type: "Rest Spot",
        condition: "ชนะ Area Boss MAP-051",
        description: "จุดพักสุดท้ายก่อนเผชิญหน้าจุดจบของจักรวาล",
        outcomes: "+HP/MP 100%, ล้างสถานะทั้งหมด, +Buff (Final Stand)",
        chance: "Unique"
    }
];

/**
 * ⚙️ IMPLEMENTATION NOTES (สำหรับ AI/Dev)
 * 1. Event Pool Selection: ทุกการสำรวจ 1 ครั้ง ให้สุ่มจาก Event Pool ของ map_level นั้นๆ อัตราการเกิดอ้างอิงจาก Chance ในตาราง
 * 2. LUCK Adjustment: 
 * - Positive (Resource, Rest Spot, Treasure NPC): 45% + (LUCK × 0.15%)
 * - Negative (Trap, Environmental ร้าย): 20% - (LUCK × 0.1%)
 * - ปรับค่า Neutral ให้ผลรวมเป็น 100% เสมอ
 * 3. Condition Check: หากผู้เล่นไม่ผ่าน Condition ให้ข้าม Event หรือแสดงผล Fallback (เช่น +HP 5% แทน +HP 20%)
 * 4. Outcome Processing: ผลลัพธ์ต้องอัปเดตสถานะผู้เล่นทันทีตาม Schema EventResult ใน Game Bible Sec 13.6
 * 5. Non-Stacking: Event ประเภท Rest Spot และ Buff จาก Event จะไม่ Stack หากเกิดซ้ำภายใน 3 Turn
 * 6. Data Format: ตารางด้านบนสามารถ Parse เป็น JSON Array ได้โดยตรง โดย Map Key คือ EventID, MapLevel, Type, Text, Outcome, Chance
 * * 📜 JIANGHU RPG — EVENT DATABASE v1.0 | Compatible with Game Bible v1.0, Map Database, & Item Database
 */
