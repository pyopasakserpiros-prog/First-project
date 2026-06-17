# JIANGHU RPG — GAME BIBLE v1.0

### Master Design Document | Source of Truth

---

## บทนำ

เอกสารนี้คือ Game Bible ฉบับสมบูรณ์ของ Jianghu RPG ทุกกฎ สูตร และมาตรฐานในเอกสารนี้ถือเป็น Source of Truth ห้าม AI ระบบอื่นตีความนอกเหนือจากที่กำหนดไว้ หากพบข้อขัดแย้งระหว่างระบบย่อยกับเอกสารนี้ ให้ยึดเอกสารนี้เป็นหลักเสมอ

---

## 1. CORE DESIGN PHILOSOPHY

### 1.1 ประเภทของเกม

Jianghu RPG เป็น Text-Based RPG ที่รันบน Web Browser โดยไม่ต้องติดตั้งโปรแกรม ผู้เล่นโต้ตอบผ่านปุ่มและข้อความ ไม่มีกราฟิก 3D หรือ Animation ซับซ้อน ความลึกของเกมอยู่ที่ระบบตัวเลข การตัดสินใจ และการสะสม

### 1.2 ความรู้สึกที่ผู้เล่นต้องได้รับ

**ความรู้สึกเติบโต** — ผู้เล่นต้องรู้สึกได้ชัดเจนว่าตัวละครของตนแข็งแกร่งขึ้นทุกเซสชั่น ไม่ว่าจะเล่นนานหรือสั้น

**ความรู้สึกค้นพบ** — ทุกการเปิดอุปกรณ์ใหม่หรือได้สกิลใหม่ต้องสร้างความตื่นเต้น ระบบสีต้องสื่อสารคุณค่าได้ทันที

**ความรู้สึกเป็นจอมยุทธ์** — บรรยากาศ ชื่อสกิล ชื่อขั้น และข้อความในเกมต้องถ่ายทอดบรรยากาศยุทธภพจีนโบราณ

**ความรู้สึกควบคุมได้** — ผู้เล่นต้องเข้าใจว่าทำไมตนถึงแพ้หรือชนะ ระบบต้องโปร่งใสและยุติธรรม

### 1.3 เป้าหมายระยะสั้น (Session Goals — ภายใน 30 นาที)

- ออก Quest หรือสำรวจพื้นที่หนึ่ง
- ได้รับ EXP และ Level Up อย่างน้อย 1 ครั้ง
- ได้อุปกรณ์ใหม่อย่างน้อย 1 ชิ้น
- ได้เงินพอซื้อของได้อย่างน้อย 1 อย่าง

### 1.4 เป้าหมายระยะกลาง (Mid-Game Goals — สัปดาห์แรก)

- ไปถึง Level 20 และเป็น "จอมยุทธ์" อย่างเต็มตัว
- ปลดล็อกพื้นที่ใหม่ได้อย่างน้อย 3 แมพ
- สร้างทีมผู้ติดตามครบ 3 คน
- มีอุปกรณ์ระดับ ม่วง หรือสูงกว่าครบทุกสล็อต

### 1.5 เป้าหมายระยะยาว (End-Game Goals)

- เข้าถึง Level 90 และขั้น "มหาเทพยุทธ์"
- สะสมสกิลระดับ ทอง และ แดง
- พิชิต Boss ระดับสูงสุดทุกตัว
- Build ตัวละครตามสไตล์เฉพาะของตน (STR Build, AGI Build, INT Build ฯลฯ)

---

## 2. CHARACTER SYSTEM

### 2.1 Level และ EXP

**Max Level:** 90

**สูตร EXP ที่ต้องการต่อ Level:**

```
EXP_Required(Lv) = 100 × Lv^1.8
```

ตัวอย่าง:
- Lv 1→2: 100 EXP
- Lv 9→10: 5,832 EXP
- Lv 49→50: 278,145 EXP
- Lv 89→90: 1,923,418 EXP

**หลักการ:** EXP ที่ต้องการเพิ่มขึ้นแบบ Polynomial ไม่ใช่ Exponential เพื่อไม่ให้ Endgame รู้สึกเป็นไปไม่ได้

### 2.2 Stat Points

ทุก Level Up ผู้เล่นได้รับ **5 Stat Points** เพื่อกระจายอิสระ

ทุก 10 Level (10, 20, 30...) ได้รับ **Bonus 10 Stat Points** เพิ่มเติม

ค่า Base Stats ของตัวละครเริ่มต้นทุกตัวที่ Level 1:

| Stat | Base Value |
|------|-----------|
| STR | 5 |
| CON | 5 |
| AGI | 5 |
| INT | 5 |
| LUCK | 5 |

### 2.3 ค่าสถานะหลัก (Primary Stats)

**STR — กำลังภายนอก**
- เพิ่ม ATK โดยตรง: ATK_from_STR = STR × 2.5
- เพิ่มพลังสกิลประเภทร่างกาย (Physical Skill) ×0.5% ต่อ 1 STR
- เพิ่ม Carry Weight (จำนวนอุปกรณ์ที่ถือได้ในกระเป๋าเพิ่มไม่มีผลต่อ Combat)

**CON — ความทนทาน**
- เพิ่ม Max HP: HP_from_CON = CON × 10
- เพิ่ม DEF โดยอ้อม: DEF_from_CON = CON × 0.5
- ลดโอกาสถูก Status Effect: -0.5% ต่อ 1 CON (สูงสุด -50%)

**AGI — ความว่องไว**
- เพิ่ม DODGE: DODGE_from_AGI = AGI × 0.3% (สูงสุด 60%)
- เพิ่ม ACCURACY: ACCURACY_from_AGI = AGI × 0.2%
- กำหนดลำดับการโจมตีในการต่อสู้ (Speed Order): ค่า AGI สูงกว่าโจมตีก่อน
- เพิ่ม CRIT: CRIT_from_AGI = AGI × 0.15%

**INT — สติปัญญา / กำลังภายใน**
- เพิ่ม Max MP: MP_from_INT = INT × 8
- เพิ่มพลังสกิลประเภทภายใน (Internal Skill) ×0.6% ต่อ 1 INT
- เพิ่ม CRIT_DAMAGE โดยอ้อม: CRIT_DAMAGE_from_INT = INT × 0.2%
- ลดต้นทุน MP ของสกิล: -0.3% ต่อ 1 INT (สูงสุด -30%)

**LUCK — โชคลาภ**
- เพิ่มโอกาส Drop อุปกรณ์: +0.2% ต่อ 1 LUCK
- เพิ่มโอกาส Drop สีสูงขึ้น: +0.1% ต่อ 1 LUCK
- เพิ่ม CRIT: CRIT_from_LUCK = LUCK × 0.1%
- เพิ่มโอกาส Event ดี: +0.15% ต่อ 1 LUCK
- เพิ่ม KILL_CHANCE: KILL_CHANCE_from_LUCK = LUCK × 0.05% (สูงสุด 5%)

### 2.4 Character Rank

Rank แสดงในชื่อ UI เหนือ Level เป็นตัวบ่งบอกสถานะในยุทธภพ ไม่ได้ให้โบนัสเพิ่มเติม (โบนัสอยู่ใน Advancement System หัวข้อ 3)

---

## 3. ADVANCEMENT SYSTEM

ระบบ Advancement คือ Milestone Bonus ที่ผู้เล่นได้รับทุกครั้งที่ข้ามขั้น ไม่ใช่ Class Change โครงสร้าง Build ยังคงอิสระ

### 3.1 ตารางขั้นและโบนัส

**Lv 1–9 | จอมยุทธ์ฝึกหัด**
- ไม่มีโบนัสพิเศษ นี่คือช่วง Tutorial
- ศัตรูในโซนนี้ไม่มี Elite และ Boss ระดับสูง
- อุปกรณ์ที่ Drop ได้สูงสุดระดับ เขียว

**Lv 10 | เลื่อนขั้น → จอมยุทธ์**
- โบนัส +10 Stat Points (นอกเหนือจาก Stat Points ปกติ)
- ปลดล็อกระบบ Follower (รับผู้ติดตามได้)
- ปลดล็อกพื้นที่ระดับ 2
- อุปกรณ์ Drop สูงสุดระดับ ฟ้า

**Lv 20 | เลื่อนขั้น → ยอดฝีมือ**
- โบนัส +10 Stat Points
- ปลดล็อก Active Skill Slot เพิ่ม 1 (รวม 3 Slots)
- ปลดล็อกพื้นที่ระดับ 3
- CRIT_DAMAGE Base เพิ่ม +10%
- อุปกรณ์ Drop สูงสุดระดับ ม่วง

**Lv 30 | เลื่อนขั้น → ปรมาจารย์**
- โบนัส +10 Stat Points
- ปลดล็อก Passive Skill Slot เพิ่ม 1 (รวม 3 Slots)
- ปลดล็อกพื้นที่ระดับ 4
- DODGE Cap เพิ่มจาก 60% → 65%
- ร้านค้าระดับ Elite ปลดล็อก

**Lv 40 | เลื่อนขั้น → ราชันยุทธ์**
- โบนัส +10 Stat Points
- ปลดล็อก Active Skill Slot เพิ่ม 1 (รวม 4 Slots)
- ปลดล็อกพื้นที่ระดับ 5
- อุปกรณ์ Drop สูงสุดระดับ ทอง
- Follower สามารถ Level Up เร็วขึ้น 20%

**Lv 50 | เลื่อนขั้น → เซียนยุทธ์**
- โบนัส +10 Stat Points
- ปลดล็อก Passive Skill Slot เพิ่ม 1 (รวม 4 Slots)
- ปลดล็อกพื้นที่ระดับ 6
- ค่า Base Stats ทั้งหมด ×1.1 (Multiplier ถาวร)
- KILL_CHANCE Cap เพิ่มจาก 5% → 8%

**Lv 60 | เลื่อนขั้น → เทพยุทธ์**
- โบนัส +10 Stat Points
- ปลดล็อก Active Skill Slot เพิ่ม 1 (รวม 5 Slots)
- ปลดล็อกพื้นที่ระดับ 7
- อุปกรณ์ Drop สูงสุดระดับ แดง
- ACCURACY Cap เพิ่มจาก 100% → 110% (เพื่อต่อต้าน DODGE สูงของศัตรู Endgame)

**Lv 70 | เลื่อนขั้น → จักรพรรดิยุทธ์**
- โบนัส +10 Stat Points
- ปลดล็อก Passive Skill Slot เพิ่ม 1 (รวม 5 Slots)
- ปลดล็อกพื้นที่ระดับ 8
- ค่า Base Stats ทั้งหมด ×1.2 (Multiplier ถาวร สะสมจาก Lv50)
- LIFE_STEAL Cap เพิ่มจาก 30% → 40%

**Lv 80 | เลื่อนขั้น → มหาเทพยุทธ์**
- โบนัส +10 Stat Points
- ปลดล็อก Active Skill Slot เพิ่ม 1 (รวม 6 Slots)
- ปลดล็อกพื้นที่ระดับ 9
- ปลดล็อก Passive Skill Slot เพิ่ม 1 (รวม 6 Slots)
- ปลดล็อกพื้นที่ระดับ 10 (Final Area)
- ค่า Base Stats ทั้งหมด ×1.3 (Multiplier ถาวร สะสม)
- DODGE Cap เพิ่มจาก 65% → 70%

---

## 4. EQUIPMENT SYSTEM

### 4.1 ประเภทอุปกรณ์

มี 3 Slot:
1. **อาวุธ (Weapon)** — เน้น ATK และ CRIT
2. **เสื้อเกราะ (Armor)** — เน้น DEF, HP, CON
3. **เครื่องประดับ (Accessory)** — เน้น Stats พิเศษและ Utility

แต่ละ Slot ไม่มีข้อจำกัดว่า Stat ใดจะปรากฏ เป็นเพียงค่า Default Bias ไม่ใช่การล็อก

### 4.2 ระดับความหายาก (Rarity)

| ระดับ | สี | จำนวน Stats | ค่า Multiplier |
|------|-----|------------|---------------|
| Common | ขาว | 1 stat | ×1.0 |
| Uncommon | เขียว | 2 stats | ×1.3 |
| Rare | ฟ้า | 3 stats | ×1.8 |
| Epic | ม่วง | 4 stats | ×2.5 |
| Legendary | ทอง | 5 stats | ×3.5 |
| Mythic | แดง | 6 stats + 1 Special Effect | ×5.0 |

### 4.3 Item Level และค่า Base

อุปกรณ์ทุกชิ้นมี Item Level (iLv) ตั้งแต่ 1–90

ค่า Base ของ Stat แต่ละตัวบนอุปกรณ์:

```
Base_Stat_Value = iLv × Stat_Weight × Rarity_Multiplier × Random(0.85, 1.15)
```

**Stat_Weight** กำหนดตามความสำคัญของ Stat:
- ATK, DEF, HP: Weight = 3.0
- STR, CON, AGI, INT: Weight = 2.0
- CRIT, CRIT_DAMAGE, DODGE, ACCURACY: Weight = 1.5
- LUCK, ARMOR_PEN, LIFE_STEAL, MANA_STEAL: Weight = 1.2
- KILL_CHANCE: Weight = 0.5

**Random(0.85, 1.15)** คือ Roll สุ่มระหว่าง 85%–115% ของค่า Base แต่ละครั้งที่ Drop

### 4.4 Special Effect ของระดับ แดง

อุปกรณ์ระดับ แดง มี Special Effect 1 รายการ เพิ่มเติมจาก 6 Stats ปกติ

Special Effect คือ Effect ที่ไม่ใช่ตัวเลข เช่น:
- "เมื่อ HP ต่ำกว่า 30% ATK เพิ่ม 50%"
- "โจมตีทุก 3 ครั้ง ครั้งที่ 3 ดูดเลือด 10% ของดาเมจ"
- "เมื่อ Kill ศัตรู ฟื้น MP 5%"

Special Effect ต้องถูก List ไว้ใน Item Database อย่างชัดเจน ห้ามสุ่มแบบ Dynamic เพราะอาจทำให้ Balance พัง

### 4.5 Item Power Score

ค่า Power Score ใช้เปรียบเทียบความแข็งแกร่งของอุปกรณ์โดยรวม:

```
Power_Score = Σ(Stat_Value × Stat_Weight) × Rarity_Multiplier
```

แสดงผลในหน้า Item เพื่อช่วยผู้เล่นตัดสินใจ

---

## 5. STAT POOL SYSTEM

### 5.1 รายการ Stats ทั้งหมดและความหมาย

**ATK — พลังโจมตี**
- ใช้ในสูตรคำนวณ Damage โดยตรง
- เพดาน: ไม่มีเพดาน
- ความหายาก: Common (ปรากฏได้ในทุก Rarity)

**DEF — พลังป้องกัน**

- ลดความเสียหายที่รับ
- เพดาน: ไม่มีเพดาน
- ความหายาก: Common

**HP — พลังชีวิตสูงสุด (เพิ่มแบบ Flat)**
- เพิ่ม Max HP โดยตรง
- เพดาน: ไม่มีเพดาน
- ความหายาก: Common

**MP — พลังภายในสูงสุด (เพิ่มแบบ Flat)**
- เพิ่ม Max MP โดยตรง
- เพดาน: ไม่มีเพดาน
- ความหายาก: Common

**STR, CON, AGI, INT, LUCK — Primary Stats**
- เพิ่ม Primary Stat ซึ่งส่งผลทอดต่อระบบอื่น
- เพดานค่าจาก Equipment: รวมกันไม่เกิน +500 ต่อ Stat ต่อตัวละคร
- ความหายาก: Uncommon ขึ้นไป

**CRIT — โอกาสโจมตีวิกฤต (%)**
- เพดาน: 75% (รวมทุกแหล่ง)
- Base CRIT เริ่มต้น: 5%
- ความหายาก: Uncommon ขึ้นไป

**CRIT_DAMAGE — ค่าดาเมจเมื่อ Critical (%)**
- เพิ่มในรูปแบบ % เพิ่มเติมจาก Base 150%
- เพดาน: 400% (รวมทุกแหล่ง)
- ความหายาก: Rare ขึ้นไป

**DODGE — โอกาสหลบหลีก (%)**
- เพดาน: 70% (ยึดตาม Level สูงสุด)
- Base DODGE: 0% (มาจาก AGI เท่านั้น)
- ความหายาก: Uncommon ขึ้นไป

**ACCURACY — ความแม่นยำ (%)**
- Base ACCURACY: 90% ทุกตัวละคร
- เพดาน: 110% (สำหรับตัวละคร Lv60+)
- ความหายาก: Uncommon ขึ้นไป

**ARMOR_PEN — การเจาะเกราะ (%)**
- ลด DEF ของเป้าหมายเป็น % เมื่อคำนวณ Damage
- ARMOR_PEN 30% หมายความว่า DEF ของเป้าหมายถูกนับเพียง 70%
- เพดาน: 75%
- ความหายาก: Rare ขึ้นไป

**LIFE_STEAL — ดูดชีวิต (%)**
- ฟื้น HP เท่ากับ % ของ Physical Damage ที่ทำได้
- เพดาน: 40% (สำหรับตัวละคร Lv70+)
- เพดานเริ่มต้น: 30%
- ความหายาก: Rare ขึ้นไป

**MANA_STEAL — ดูด MP (%)**
- ฟื้น MP เท่ากับ % ของ Skill Damage ที่ทำได้
- เพดาน: 20%
- ความหายาก: Epic ขึ้นไป

**KILL_CHANCE — โอกาสสังหารทันที (%)**
- โอกาสทำให้ศัตรูตาย Instant โดยไม่คำนึงถึง HP ที่เหลือ
- ไม่ทำงานกับ Boss ทุกประเภท
- เพดาน: 8% (สำหรับตัวละคร Lv50+)
- เพดานเริ่มต้น: 5%
- ความหายาก: Epic ขึ้นไป

### 5.2 Stat Cap Summary Table

| Stat | เพดาน | หมายเหตุ |
|------|-------|---------|
| ATK | ไม่มี | |
| DEF | ไม่มี | |
| HP | ไม่มี | |
| MP | ไม่มี | |
| CRIT | 75% | รวมทุกแหล่ง |
| CRIT_DAMAGE | 400% | รวมทุกแหล่ง |
| DODGE | 70% | Lv80+ เท่านั้น |
| ACCURACY | 110% | Lv60+ เท่านั้น |
| ARMOR_PEN | 75% | รวมทุกแหล่ง |
| LIFE_STEAL | 40% | Lv70+ เท่านั้น |
| MANA_STEAL | 20% | รวมทุกแหล่ง |
| KILL_CHANCE | 8% | Lv50+, ไม่ทำงานกับ Boss |

---

## 6. SKILL SYSTEM

### 6.1 ประเภทสกิล

**Active Skill**
- ใช้งานโดยผู้เล่นเลือกในการต่อสู้
- ใช้ MP
- มี Cooldown (นับเป็น Turns)
- มี Slot จำกัด (เริ่มต้น 2 Slots, เพิ่มตาม Advancement)

**Passive Skill**
- ทำงานอัตโนมัติตลอดเวลา
- ไม่ใช้ MP
- ไม่มี Cooldown
- มี Slot จำกัด (เริ่มต้น 2 Slots, เพิ่มตาม Advancement)

### 6.2 ระดับความหายากของสกิล (เหมือนกับอุปกรณ์)

| ระดับ | สี | ลักษณะ |
|------|-----|-------|
| Common | ขาว | สกิลพื้นฐาน ดาเมจน้อย effect เรียบง่าย |
| Uncommon | เขียว | มี secondary effect เล็กน้อย |
| Rare | ฟ้า | Secondary effect ชัดเจน หรือ Cooldown สั้น |
| Epic | ม่วง | Effect ทรงพลัง อาจมี Multi-Hit หรือ AoE |
| Legendary | ทอง | Effect พิเศษ เปลี่ยน mechanic การต่อสู้ |
| Mythic | แดง | สกิลสูงสุด Effect ไม่ซ้ำกัน เปลี่ยน flow การต่อสู้ |

### 6.3 วิธีได้รับสกิล

สกิลได้รับจาก 3 ช่องทาง:

1. **Drop จากศัตรู** — ศัตรูบางประเภทมีโอกาส Drop Skill Scroll (ม้วนสกิล) อัตรา Drop ขึ้นอยู่กับ Rarity ของสกิล
2. **ซื้อจากร้านค้า** — ร้านค้าพิเศษบางแห่งขาย Skill Scroll ระดับ ขาว ถึง ฟ้า
3. **รับจาก Event** — Event พิเศษอาจให้ Skill Scroll ระดับสูง

### 6.4 จำนวน Skill Slots (สรุป)

| Level | Active Slots | Passive Slots |
|-------|-------------|--------------|
| Lv 1 | 2 | 2 |
| Lv 20 | 3 | 2 |
| Lv 30 | 3 | 3 |
| Lv 40 | 4 | 3 |
| Lv 50 | 4 | 4 |
| Lv 60 | 5 | 4 |
| Lv 70 | 5 | 5 |
| Lv 80 | 6 | 6 |

### 6.5 หลักการออกแบบสกิล

**Active Skill Design Rules:**
- ทุก Active Skill ต้องระบุ: ชื่อ, Rarity, MP Cost, Cooldown (Turns), Target Type, Damage Formula, Secondary Effect
- ดาเมจของ Active Skill เพิ่มตาม Stat ที่เกี่ยวข้อง (Physical Skill → STR, Internal Skill → INT)
- Cooldown ต้องสัมพันธ์กับความทรงพลัง: ยิ่ง Effect ทรงพลัง Cooldown ยิ่งสูง
- Active Skill ระดับ แดง Cooldown ขั้นต่ำ 5 Turns

**Passive Skill Design Rules:**
- ทุก Passive Skill ต้องระบุ: ชื่อ, Rarity, Trigger Condition, Effect
- ห้าม Passive Skill ให้ DODGE หรือ CRIT เกิน +15% ต่อสกิล
- Passive ระดับ แดง สามารถมี Conditional Effect (เช่น "เมื่อ HP < 20% ให้ AGI ×2")

### 6.6 Skill Compatibility

สกิลบางตัวมี Tag กำหนดความเข้ากัน:
- **[Physical]** — Bonus จาก STR
- **[Internal]** — Bonus จาก INT
- **[Poison]** — Stack ได้
- **[Heal]** — ใช้ INT ในการคำนวณ
- **[Support]** — ใช้ได้กับ Follower

---

## 7. ENEMY SYSTEM

### 7.1 ประเภทศัตรู

**Normal Enemy**
- ศัตรูทั่วไปในพื้นที่
- ไม่มี Special Mechanic
- Drop: อุปกรณ์ระดับ ขาว–ฟ้า, เงิน, Skill Scroll ระดับต่ำ

**Elite Enemy**
- ศัตรูพิเศษ มีเครื่องหมาย [精英] แสดงในชื่อ
- HP สูงกว่า Normal ×3, ATK สูงกว่า ×2
- มีสกิลอย่างน้อย 1 ตัว
- Drop: อุปกรณ์ระดับ ฟ้า–ม่วง, โอกาส Drop ทอง 5%
- ปรากฏทุก 10 การต่อสู้ในพื้นที่นั้น (หรือ Trigger จาก Event)

**Mini-Boss**
- ปรากฏที่จุด Checkpoint ของแต่ละพื้นที่
- HP สูงกว่า Normal ×8, ATK สูงกว่า ×3
- มีสกิล 2–3 ตัว รวมถึงอย่างน้อย 1 Active Skill
- Drop: อุปกรณ์ระดับ ม่วง–ทอง, โอกาส Drop แดง 2%
- ต่อสู้ได้ 1 ครั้งต่อวัน (Daily Reset)

**Area Boss**
- ปรากฏ 1 ตัวต่อพื้นที่
- HP สูงกว่า Normal ×20, ATK สูงกว่า ×5
- มีสกิล 4–6 ตัว, มี Special Phase (เมื่อ HP ต่ำกว่า 50% เข้า Phase 2)
- ภูมิคุ้มกัน KILL_CHANCE ทั้งหมด
- Drop: อุปกรณ์ระดับ ทอง–แดง, Skill Scroll ระดับสูง, เงินจำนวนมาก
- ต่อสู้ได้ 1 ครั้งต่อสัปดาห์ (Weekly Reset)

### 7.2 Enemy Level Scaling

ศัตรูในแต่ละพื้นที่มีช่วง Level กำหนดไว้ในแมพ (ดูหัวข้อ 9)

Level ของศัตรูที่ Spawn:
```
Enemy_Level = Random(Map_Min_Level, Map_Max_Level)
```

ค่า Stat ของศัตรูคำนวณจาก Level:
```
Enemy_HP = Enemy_Level × 50 × Type_Multiplier
Enemy_ATK = Enemy_Level × 8 × Type_Multiplier
Enemy_DEF = Enemy_Level × 4 × Type_Multiplier
```

Type_Multiplier:
- Normal: 1.0
- Elite: 3.0 (HP), 2.0 (ATK/DEF)
- Mini-Boss: 8.0 (HP), 3.0 (ATK/DEF)
- Area Boss: 20.0 (HP), 5.0 (ATK/DEF)

### 7.3 Enemy Skill Assignment

- Normal Enemy: 0–1 สกิล (สุ่มจาก Skill Pool ของประเภทนั้น)
- Elite Enemy: 1–2 สกิล
- Mini-Boss: 2–3 สกิล
- Area Boss: 4–6 สกิล (กำหนดตาย ไม่ใช่สุ่ม เพื่อ Balance)

### 7.4 Enemy Drop Rules

อัตรา Drop อุปกรณ์:
```
Drop_Chance = Base_Drop_Rate × (1 + Player_LUCK × 0.002)
```

Base_Drop_Rate:
- Normal Enemy: 20%
- Elite Enemy: 60%
- Mini-Boss: 90%
- Area Boss: 100% (Drop แน่นอน)

เมื่อ Drop เกิดขึ้น ให้ Roll Rarity:
| Rarity | Normal | Elite | Mini-Boss | Area Boss |
|--------|--------|-------|-----------|-----------|
| ขาว | 50% | 10% | 0% | 0% |
| เขียว | 30% | 30% | 5% | 0% |
| ฟ้า | 15% | 35% | 30% | 5% |
| ม่วง | 4% | 20% | 40% | 30% |
| ทอง | 1% | 5% | 23% | 50% |
| แดง | 0% | 0% | 2% | 15% |

โดยค่า LUCK ของผู้เล่นปรับ % ในแต่ละ Tier ขึ้นไปโดยอ้อม (ผ่านสูตรที่กำหนดแยกใน Item System)

---

## 8. FOLLOWER SYSTEM

### 8.1 กฎพื้นฐาน

- ผู้เล่นมี Follower ได้สูงสุด **3 คน**
- Follower ไม่ได้รับ Control จากผู้เล่นโดยตรงในการต่อสู้ — ทำงานตาม AI อัตโนมัติ
- Follower มี Level เป็นของตัวเอง โดย Level ของ Follower ไม่เกิน Level ของผู้เล่น

### 8.2 Follower Rarity

Follower มีระดับ Rarity เหมือนกับ Equipment:

| Rarity | สี | จำนวน Base Stats | โบนัสพิเศษ |
|--------|-----|----------------|-----------|
| Common | ขาว | 2 | ไม่มี |
| Uncommon | เขียว | 3 | ไม่มี |
| Rare | ฟ้า | 4 | Passive Skill 1 |
| Epic | ม่วง | 5 | Passive Skill 1, Active Skill 1 |
| Legendary | ทอง | 6 | Passive 2, Active 1 |
| Mythic | แดง | 7 + Special | Passive 2, Active 2, Special Ability 1 |

### 8.3 วิธีรับ Follower

1. **จ้างในเมือง** — ในแต่ละพื้นที่มีตัวละคร NPC ที่ว่าจ้างได้ เสียเงิน (Gold) ตามระดับ Rarity
2. **Event สุ่ม** — Event ในการสำรวจอาจพบ Follower ที่เข้าร่วมได้
3. **รางวัล Boss** — Area Boss บางตัว Drop Follower Recruitment Token

### 8.4 วิธีสุ่ม Follower

เมื่อพบ Follower ให้ Roll ในลำดับ:
1. Roll Rarity (ตาม Drop Table ของแหล่งที่มา)
2. Roll ประเภทหลัก (STR-Type, CON-Type, AGI-Type, INT-Type) — กำหนด Stat Bias
3. Roll ค่า Base Stats แต่ละตัว โดยใช้สูตรเดียวกับ Equipment แต่ Follower Level แทน iLv

### 8.5 การเติบโตของ Follower

**EXP Sharing:** ทุกการต่อสู้ที่ชนะ Follower ทั้งหมดได้ EXP 60% ของที่ผู้เล่นได้

**Level Up Bonus:** ทุก Level ขึ้น Follower ได้ 3 Stat Points (กระจายอัตโนมัติตาม Type ของ Follower)

**Max Level:** Follower Level สูงสุดไม่เกิน Player Level และไม่เกิน 90

### 8.6 ค่าใช้จ่าย Follower

ผู้เล่นต้องจ่าย **ค่าจ้างรายวัน** (Daily Upkeep) ต่อ Follower:
```
Daily_Upkeep = Follower_Level × 5 Gold × Rarity_Cost_Multiplier
```

Rarity_Cost_Multiplier:
- ขาว: 1.0
- เขียว: 1.5
- ฟ้า: 2.0
- ม่วง: 3.0
- ทอง: 5.0
- แดง: 8.0

หากผู้เล่นไม่มีเงินพอ Follower จะ Leave (ออกจากทีม) โดยไม่สูญเสียข้อมูล — สามารถ Rehire ได้ที่ราคาเดิม

---

## 9. MAP SYSTEM

### 9.1 โครงสร้างแมพ

แมพแบ่งเป็น **10 ระดับ** แต่ละระดับมีหลายพื้นที่ (Zone)

**โครงสร้าง:**
```
World
└── Level 1–10 (ระดับความยาก)
    └── Zone (พื้นที่ย่อย 2–5 แห่งต่อระดับ)
        └── Location (จุดสำรวจ/ต่อสู้ภายใน Zone)
```

### 9.2 ตารางแมพและช่วงเลเวล

| Map Level | ช่วง Player Level | ช่วง Enemy Level | ประเภทศัตรูสูงสุด |
|-----------|-----------------|-----------------|-----------------|
| 1 | 1–9 | 1–12 | Elite |
| 2 | 10–19 | 10–22 | Mini-Boss |
| 3 | 20–29 | 20–32 | Mini-Boss |
| 4 | 30–39 | 30–42 | Area Boss |
| 5 | 40–49 | 40–52 | Area Boss |
| 6 | 50–59 | 50–62 | Area Boss |
| 7 | 60–69 | 60–72 | Area Boss |
| 8 | 70–79 | 70–82 | Area Boss |
| 9 | 80–89 | 80–90 | Area Boss |
| 10 | 90 | 88–90 | Final Boss |

### 9.3 การปลดล็อกแมพ

การปลดล็อก Zone ใหม่ต้องเป็นไปตาม **ทั้งหมด** ของเงื่อนไขต่อไปนี้:
1. ผู้เล่นถึง Level ขั้นต่ำของ Map Level นั้น
2. ผู้เล่นชนะ Area Boss ของ Zone ก่อนหน้า (ยกเว้น Zone แรก)

ไม่มีระบบ Key ไม่มี Questline บังคับ — ปลดล็อกด้วย Level + Boss Kill เท่านั้น (เรียบง่ายและชัดเจน)

### 9.4 ระบบสำรวจ (Exploration)

ในแต่ละ Zone ผู้เล่นเลือก Action:
- **[ลาดตระเวน]** — เดินหน้า มีโอกาส พบศัตรู / พบ Event / พบ Treasure
- **[ฝึกฝน]** — รับ EXP เล็กน้อยโดยไม่ต่อสู้ (80% ของ EXP ปกติ, ไม่มี Drop)
- **[ค้นหา]** — เน้นค้นหา Treasure และ Event โอกาสพบสูงขึ้น 30% แต่ก็พบศัตรูบ่อยขึ้น 20% ด้วย

แต่ละ Action ใช้ **1 Action Point (AP)**

**AP System:**
- AP Max: 20
- AP ฟื้น: 1 ต่อ 5 นาทีในเวลาจริง
- AP ฟื้น 100% เมื่อ Login ครั้งแรกของวัน (Daily Bonus)

### 9.5 Exploration Rate

สัดส่วนเหตุการณ์ในการ [ลาดตระเวน]:

- พบศัตรูปกติ: 55%
- พบ Elite: 10%
- พบ Event: 25%
- พบ Treasure: 10%

---

## 10. EVENT SYSTEM

### 10.1 ประเภทอีเวนท์

**อีเวนท์ดี (Positive Events)**
- ให้ผลประโยชน์โดยตรงหรือทางเลือกที่มีความเสี่ยงต่ำ
- ตัวอย่าง: พบสมุนไพร, พบพ่อค้าลึกลับ, ได้รับสกิลจากปรมาจารย์เร่ร่อน

**อีเวนท์กลาง (Neutral Events)**
- ต้องตัดสินใจ มีทั้งผลดีและผลเสียขึ้นอยู่กับทางเลือก
- ตัวอย่าง: พบศิษย์เก่าที่ขอความช่วยเหลือ, ได้ยินข่าวสารในตลาด

**อีเวนท์ร้าย (Negative Events)**
- ส่งผลเสียโดยตรง หรือมีทางเลือกที่เสี่ยงทุกทาง
- ตัวอย่าง: โดนโจรดักปล้น, ถูกกับดัก, อาวุธเสื่อมสภาพ

### 10.2 อัตราการเกิด

| Event Type | % ใน Event Pool |
|-----------|----------------|
| Positive | 45% |
| Neutral | 35% |
| Negative | 20% |

ค่า LUCK ของผู้เล่นปรับอัตราเล็กน้อย:
```
Adjusted_Positive% = 45% + (LUCK × 0.15%)
Adjusted_Negative% = 20% - (LUCK × 0.1%)
```

(ผลรวมต้องคง 100% โดยปรับ Neutral แทน)

### 10.3 หลักการออกแบบ Event

1. **ทุก Event ต้องมีข้อความที่สั้น กระชับ อ่านได้ใน 3–5 วินาที** — ไม่เขียนนิยาย
2. **Event ที่มีทางเลือกต้องมี 2–4 ตัวเลือก** ไม่มากกว่านี้
3. **ผลของ Event ต้องแสดงทันที** ไม่มี Delay
4. **Event ร้ายต้องไม่ทำให้เกมจบทันที** (ผู้เล่นต้องไม่ตายจาก Event โดยตรง — ลด HP ได้แต่ไม่ถึง 0)
5. **Event สุ่มจาก Pool ของแต่ละ Map Level** ไม่ใช่ Global Pool (เพื่อให้ Flavor เข้ากับพื้นที่)

### 10.4 โครงสร้าง Event Data

```
Event {
  id: string
  name: string
  map_level: int (1-10 หรือ 0 = All Maps)
  type: "positive" | "neutral" | "negative"
  text: string (ข้อความที่แสดง)
  choices: [
    {
      label: string
      condition: string | null (เช่น "STR >= 20")
      result: EventResult
    }
  ]
  auto_result: EventResult | null (ถ้าไม่มีทางเลือก)
}

EventResult {
  text: string
  gold: int (+ หรือ -)
  exp: int (+ หรือ -)
  hp_change: int (+ หรือ -)
  mp_change: int (+ หรือ -)
  item_reward: ItemRef | null
  skill_reward: SkillRef | null
  follower_reward: FollowerRef | null
  trigger_battle: EnemyRef | null
}
```

---

## 11. ECONOMY SYSTEM

### 11.1 สกุลเงิน

**Gold (两 — แท่งทอง)** — สกุลเงินหลัก ใช้ซื้อขายทุกอย่าง มีเพียงสกุลเดียวในเกม

ไม่มีระบบ Premium Currency ไม่มีการแบ่งสกุลเงินซับซ้อน

### 11.2 แหล่งที่มาของ Gold

| แหล่ง | ปริมาณโดยประมาณ |
|------|--------------|
| ตกจากศัตรูปกติ | Enemy_Level × 3–8 Gold |
| ตกจาก Elite | Enemy_Level × 15–25 Gold |
| ตกจาก Mini-Boss | Enemy_Level × 50–80 Gold |
| ตกจาก Area Boss | Enemy_Level × 200–500 Gold |
| ขายอุปกรณ์ | Item_Power_Score × 0.3 Gold |
| Event | 0–500 Gold (ขึ้นอยู่กับ Event) |

### 11.3 ร้านค้า

**General Shop (มีทุก Zone)**
- ขายอุปกรณ์ระดับ ขาว–เขียว ของ Map Level นั้น
- ขาย Skill Scroll ระดับ ขาว–เขียว
- ขายยา (ฟื้น HP/MP)
- Refresh ของขายทุก 24 ชั่วโมง

**Elite Shop (ปลดล็อกที่ Lv30)**
- ขายอุปกรณ์ระดับ ฟ้า–ม่วง
- ขาย Skill Scroll ระดับ ฟ้า
- ราคาสูงกว่า General Shop ×3–5 เท่า
- Refresh ทุก 72 ชั่วโมง

**Black Market (สุ่ม Event)**
- ขายอุปกรณ์ระดับ ม่วง–แดง (สุ่ม 3 ชิ้น)
- ราคาสูงมาก แต่ไม่มี Refresh — ซื้อแล้วหมด

### 11.4 ราคาอุปกรณ์ในร้าน

```
Shop_Price = Item_Power_Score × 2.5 Gold
```

### 11.5 การขายอุปกรณ์

ขายอุปกรณ์ที่ร้านได้:
```
Sell_Price = Item_Power_Score × 0.3 Gold
```

กฎ: ราคาซื้อกลับสูงกว่าราคาขายเสมอ ป้องกันการ Loop ซื้อ-ขาย

### 11.6 ค่าจ้าง Follower (ดูหัวข้อ 8.6)

Gold ไหลออกหลักของเกมคือค่าจ้าง Follower และการซื้อของในร้าน Gold ไหลเข้าหลักคือการต่อสู้และ Event

---

## 12. BATTLE SYSTEM

### 12.1 โครงสร้างการต่อสู้

การต่อสู้เป็น **Turn-Based** แบบ Sequential

ฝ่ายผู้เล่น: Player + Followers (สูงสุด 3)
ฝ่ายศัตรู: 1–3 ตัว (ขึ้นกับ Zone และ Enemy Type)

### 12.2 ลำดับการโจมตี (Speed Order)

ลำดับโจมตีกำหนดโดย AGI รวม (รวม Equipment + Skills):
```
Speed_Score = AGI_total
```

ผู้ที่มี Speed_Score สูงกว่าโจมตีก่อน

หากเท่ากัน: Player Side ได้ก่อนเสมอ (Player Advantage Rule)

### 12.3 สูตรคำนวณ Hit

```
Hit_Roll = Random(1, 100)
Hit_Threshold = 100 - Attacker_ACCURACY + Defender_DODGE
```
- ถ้า Hit_Roll > Hit_Threshold → **Hit**
- ถ้า Hit_Roll ≤ Hit_Threshold → **Miss**

กฎพิเศษ: ACCURACY ต่ำกว่า 0 ไม่ได้ (มีโอกาส Hit ขั้นต่ำ 10% เสมอ)

### 12.4 สูตรคำนวณ Critical

```
Crit_Roll = Random(1, 100)
```
- ถ้า Crit_Roll ≤ Attacker_CRIT → **Critical Hit**
- Critical Hit ให้ Damage × (CRIT_DAMAGE / 100)

### 12.5 สูตรคำนวณ Damage

**Physical Damage (ATK-Based):**
```
Raw_Damage = Attacker_ATK × (1 + STR × 0.005)
Effective_DEF = Defender_DEF × (1 - Attacker_ARMOR_PEN)
Final_Damage = Max(1, Raw_Damage - Effective_DEF)
```

**Internal/Skill Damage (INT-Based):**
```
Raw_Skill_Damage = Skill_Base_Value × (1 + INT × 0.006)
Final_Skill_Damage = Max(1, Raw_Skill_Damage - Effective_DEF × 0.5)
```

(Internal Skill ทะลุ DEF บางส่วน)

**เมื่อ Critical:**
```
Crit_Final_Damage = Final_Damage × (CRIT_DAMAGE / 100)
```

### 12.6 LIFE_STEAL และ MANA_STEAL

```
HP_Restored = Final_Damage × LIFE_STEAL
MP_Restored = Final_Skill_Damage × MANA_STEAL
```
ฟื้น HP/MP ทันทีหลังโจมตีครั้งนั้น

### 12.7 KILL_CHANCE

```
Kill_Roll = Random(1, 100)
```
ถ้า Kill_Roll ≤ Player_KILL_CHANCE → ศัตรูตายทันที (ไม่ทำงานกับ Boss ทุกประเภท)

### 12.8 Follower AI ในการต่อสู้

Follower ใช้ Active Skill เมื่อ:
- มี MP พอ
- Cooldown = 0
- Target มี HP > 20% (ถ้า Target HP ≤ 20% Follower ใช้ Auto Attack เพื่อ Kill)

ลำดับ Priority: Active Skill (ระดับสูงกว่าก่อน) → Auto Attack

### 12.9 เงื่อนไขจบการต่อสู้

- **ชนะ:** ศัตรูทุกตัว HP = 0
- **แพ้:** Player HP = 0 (Follower ทั้งหมด HP = 0 ก็ถือว่าแพ้ถ้า Player HP = 0 ด้วย)
- **หนี:** ผู้เล่นเลือก Retreat — ไม่ได้ EXP ไม่ได้ Drop ไม่เสีย HP

**เมื่อแพ้:**
- ผู้เล่นไม่ตาย — HP เหลือ 1
- ถูก Teleport กลับ Town ของ Zone นั้น
- ไม่เสียอุปกรณ์ ไม่เสีย Gold

---

## 13. DATA SCHEMA

### 13.1 Player Schema

```
Player {
  id: string
  name: string
  level: int (1-90)
  exp: int
  exp_required: int
  rank: string (ชื่อขั้น)
  stats: {
    str: int
    con: int
    agi: int
    int: int
    luck: int
    stat_points_available: int
  }
  combat_stats: {
    hp: int
    hp_max: int
    mp: int
    mp_max: int
    atk: int
    def: int
    crit: float
    crit_damage: float
    dodge: float
    accuracy: float
    armor_pen: float
    life_steal: float
    mana_steal: float
    kill_chance: float
  }
  equipment: {
    weapon: ItemRef | null
    armor: ItemRef | null
    accessory: ItemRef | null
  }
  skills: {
    active: [SkillRef] (max 6)
    passive: [SkillRef] (max 6)
  }
  followers: [FollowerRef] (max 3)
  inventory: [ItemRef]
  gold: int
  current_zone: string
  unlocked_zones: [string]
  action_points: int
  last_ap_regen: timestamp
}
```

### 13.2 Item Schema

```
Item {
  id: string
  name: string
  type: "weapon" | "armor" | "accessory"
  rarity: "white" | "green" | "blue" | "purple" | "gold" | "red"
  item_level: int (1-90)
  stats: [
    {
      stat_id: string
      value: float
    }
  ]
  special_effect: SpecialEffectRef | null (แดงเท่านั้น)
  power_score: float
  sell_price: int
}
```

### 13.3 Skill Schema

```
Skill {
  id: string
  name: string
  type: "active" | "passive"
  rarity: "white" | "green" | "blue" | "purple" | "gold" | "red"
  tags: [string] (เช่น ["Physical", "Poison"])
  description: string
  active_data: {
    mp_cost: int
    cooldown_turns: int
    target: "single" | "all" | "self"
    damage_formula: string
    secondary_effect: string | null
  } | null
  passive_data: {
    trigger: string
    effect: string
  } | null
}
```

### 13.4 Enemy Schema

```
Enemy {
  id: string
  name: string
  type: "normal" | "elite" | "mini_boss" | "area_boss"
  map_level: int
  level_range: { min: int, max: int }
  base_stats: {
    hp_formula: string
    atk_formula: string
    def_formula: string
  }
  skill_pool: [SkillRef]
  skill_count: { min: int, max: int }
  drop_table: {
    gold_min: int
    gold_max: int
    item_drop_chance: float
    rarity_weights: { white, green, blue, purple, gold, red }
    skill_scroll_chance: float
  }
  special_phase: PhaseData | null (Boss เท่านั้น)
  immune_to_kill_chance: bool
}
```

### 13.5 Follower Schema

```
Follower {
  id: string
  name: string
  rarity: "white" | "green" | "blue" | "purple" | "gold" | "red"
  type: "str" | "con" | "agi" | "int" (Stat Bias)
  level: int
  exp: int
  stats: { str, con, agi, int, luck }
  combat_stats: { hp, hp_max, mp, mp_max, atk, def, ... }
  skills: {
    active: [SkillRef]
    passive: [SkillRef]
  }
  special_ability: SpecialAbilityRef | null (แดงเท่านั้น)
  daily_upkeep: int
  is_active: bool
}
```

### 13.6 Event Schema

```
Event {
  id: string
  name: string
  map_level: int | 0
  type: "positive" | "neutral" | "negative"
  text: string
  choices: [
    {
      id: string
      label: string
      condition: string | null
      result: {
        text: string
        gold: int
        exp: int
        hp_change: int
        mp_change: int
        item_reward: ItemRef | null
        skill_reward: SkillRef | null
        follower_reward: FollowerRef | null
        trigger_battle: EnemyRef | null
      }
    }
  ]
  auto_result: ResultRef | null
}
```

### 13.7 Zone/Map Schema

```
Zone {
  id: string
  name: string
  map_level: int (1-10)
  level_range: { min: int, max: int }
  enemy_level_range: { min: int, max: int }
  unlock_condition: {
    player_level: int
    required_boss_kill: string | null
  }
  exploration_rates: {
    normal_enemy: float
    elite: float
    event: float
    treasure: float
  }
  enemy_pool: [EnemyRef]
  event_pool: [EventRef]
  area_boss: EnemyRef | null
  mini_boss: EnemyRef | null
  has_general_shop: bool
  has_elite_shop: bool
}
```

---

## 14. EXPANSION RULES

### 14.1 หลักการออกแบบเพื่อ Expansion

ระบบทั้งหมดออกแบบให้รองรับการเพิ่มเติมโดยไม่แก้ Core System:

**การเพิ่มแมพ:** สร้าง Zone ใหม่ด้วย Schema 13.7 กำหนด map_level และ unlock_condition เพิ่มเข้า Zone Database ไม่แตะ Battle Engine หรือ Character System

**การเพิ่มสกิล:** สร้าง Skill ใหม่ด้วย Schema 13.3 เพิ่มเข้า Skill Database กำหนด Tag และ Rarity เพิ่มเข้า Skill Pool ของ Enemy หรือ Shop ที่ต้องการ

**การเพิ่มศัตรู:** สร้าง Enemy ใหม่ด้วย Schema 13.4 กำหนด map_level เพิ่มเข้า Zone's enemy_pool ไม่แตะสูตรคำนวณหลัก

**การเพิ่มผู้ติดตาม:** สร้าง Follower Template ด้วย Schema 13.5 กำหนด Rarity และ Type เพิ่มเข้า Follower Pool ของ Zone หรือ Event

**การเพิ่มอีเวนท์:** สร้าง Event ด้วย Schema 13.6 กำหนด map_level เพิ่มเข้า Zone's event_pool

### 14.2 กฎ No-Break Expansion

1. **ห้ามแก้ Schema หลัก** โดยไม่อัปเดต Game Bible — การเพิ่ม Field ใหม่ใน Schema ต้องอัปเดตเอกสารนี้ก่อน
2. **สูตรคำนวณหลักใน Section 12 ไม่สามารถเปลี่ยนได้** หากต้องการ Balance ให้เปลี่ยนค่าตัวแปร (เช่น Multiplier) ไม่ใช่สูตร
3. **Stat Cap ทุกตัวถูก Lock** ห้ามอุปกรณ์หรือสกิลใหม่ Break Cap ที่กำหนดในหัวข้อ 5
4. **ทุก Content ใหม่ต้อง Fit ใน Rarity System เดิม** ห้ามสร้าง Rarity ระดับที่ 7 หรือสูงกว่า แดง
5. **ทุก Skill ใหม่ต้องมี Tag** เพื่อให้ Compatibility System ทำงานได้

---

## 15. BALANCE REVIEW

### 15.1 จุดเสี่ยง และวิธีแก้

**[R1] DODGE Build โกงเกมได้**

ความเสี่ยง: ผู้เล่น Stack AGI + DODGE จาก Equipment ทำให้ Miss Rate ของศัตรูสูงมาก

วิธีแก้ที่กำหนดไว้แล้ว:
- DODGE Cap 70% (ไม่สามารถ Miss 100%)
- ศัตรู Endgame มี ACCURACY สูงพิเศษ
- Boss มี Base ACCURACY 120% ทำให้ DODGE มีประสิทธิภาพน้อยลงใน Late Game

**[R2] CRIT Build One-Shot ทุกอย่าง**

ความเสี่ยง: CRIT 75% + CRIT_DAMAGE 400% ทำดาเมจสูงเกินไป

วิธีแก้:
- CRIT Cap 75% (ไม่ใช่ 100%)
- CRIT_DAMAGE Cap 400% ควบคุม Ceiling
- Boss มี Passive ลด CRIT_DAMAGE รับ -30% (กำหนดใน Boss Template)

**[R3] KILL_CHANCE ทำให้เกมไม่มีความหมาย**

ความเสี่ยง: 8% อาจดูน้อย แต่ถ้า Stack กับ Passive Skill บาง Passive อาจ Trigger บ่อย

วิธีแก้:
- KILL_CHANCE ไม่ทำงานกับ Boss และ Mini-Boss (กฎชัดเจน)
- เพดาน 8% ต่ำพอที่จะไม่เปลี่ยน Loop การเล่น แต่ให้ความรู้สึก Lucky ได้บ้าง

**[R4] Follower ทำให้เกมง่ายเกินไป**

ความเสี่ยง: Follower 3 คนรวมกับ Player ทำให้ศัตรูไม่มีทางชนะเลย

วิธีแก้:
- Follower Level ไม่เกิน Player Level — ป้องกันการ Power Spike
- ค่าใช้จ่ายรายวัน — ผู้เล่นที่ไม่ Farm จะจ่ายค่าจ้างไม่ได้
- ศัตรูในเกม Balance โดยคิด DPS รวมของ Player + 3 Followers

**[R5] Economy Inflation**

ความเสี่ยง: ผู้เล่นได้ Gold เร็วเกินไป Endgame ไม่มีอะไรซื้อ

วิธีแก้:
- Gold Sink หลัก: ค่าจ้าง Follower รายวัน
- Gold Sink รอง: ราคา Shop ที่ Scale ตาม Level
- Gold Cap แนะนำ: 9,999,999 Gold (UI Limit)

**[R6] ผู้เล่นไม่เคย Miss ใน Late Game**

ความเสี่ยง: ACCURACY สูง DODGE ของศัตรูต่ำ → ไม่มี Challenge

วิธีแก้:
- ศัตรู Endgame (Lv80–90) มี DODGE Base สูงขึ้น
- Area Boss ระดับ 9–10 มี DODGE สูงสุด 50%
- ระบบ Phase 2 ของ Boss เพิ่ม DODGE ชั่วคราว

**[R7] Skill Slot เยอะเกินจนไม่มีการตัดสินใจ**

ความเสี่ยง: Lv80 มี 6 Active + 6 Passive = 12 Slots — อาจ Fill ทุกอย่างที่ดี

วิธีแก้:
- Slot จำนวนมากเป็น Feature ของ Endgame ให้รู้สึกทรงพลัง ไม่ใช่ Bug
- แต่ต้องให้สกิลระดับสูงมีสกิลที่ขัดแย้งกัน (เช่น สกิล Poison ระดับ แดง บาง Effect ไม่ Stack กับ Physical Build) เพื่อบังคับการตัดสินใจ

**[R8] Free Loss → Town Teleport ทำให้ไม่กลัวแพ้**

ความเสี่ยง: ไม่มีบทลงโทษจากการแพ้ทำให้ผู้เล่นไม่ระวัง

วิธีแก้:
- เมื่อแพ้จะสูญเสีย AP ทั้งหมดที่ใช้ไประหว่าง Dungeon นั้น
- Follower ทั้งหมดต้องการเวลา "พักฟื้น" 30 นาทีจริง ก่อนใช้ได้อีกครั้ง
- ไม่เสียอุปกรณ์หรือ Gold — บทลงโทษต้องเจ็บแต่ไม่ Devastating

**[R9] Stat Points ไม่มีทิศทาง — ผู้เล่นกระจาย Stat ไม่เป็น**

ความเสี่ยง: ผู้เล่นใหม่อาจ Spread Stats ไม่มีจุดเน้น ทำให้เกมยาก

วิธีแก้:
- UI แสดง "Suggested Builds" ให้เลือก 3 สไตล์ (STR/AGI/INT) เมื่อเริ่มเกม
- การเลือกเป็นเพียง Suggestion ไม่ใช่ Lock
- Stat Reset: ผู้เล่นสามารถ Reset Stats ได้ 1 ครั้งต่อ Character ฟรี และซื้อเพิ่มได้ด้วย Gold จำนวนมาก

**[R10] Equipment iLv ต่ำกว่า Player Level ทำให้ไร้ประโยชน์**

ความเสี่ยง: ถ้าอุปกรณ์ Drop ที่ iLv ต่ำกว่า Player Level มากจะไม่มีใครใช้

วิธีแก้:
- Drop ในแต่ละ Zone จำกัด iLv ต่ำสุดที่ Player Level - 5
- ทำให้ทุก Drop ยังมีประโยชน์อยู่บ้าง
- อุปกรณ์ขาว/เขียว ระดับต่ำ Sell ได้เสมอ ทำให้ Drop ไม่ Useless

---

## บทสรุป

Game Bible ฉบับนี้กำหนดระบบทั้งหมดของ Jianghu RPG ครอบคลุม 15 หัวข้อหลัก ตั้งแต่ Core Philosophy จนถึง Data Schema และ Balance Review

**หลักการสำคัญที่ AI ทุกระบบต้องยึดถือ:**

1. **Schema กลางในหัวข้อ 13 คือมาตรฐาน** ห้ามสร้าง Field นอก Schema โดยไม่อัปเดตเอกสารนี้
2. **Stat Cap ทุกตัวในหัวข้อ 5 คือ Hard Limit** ห้าม Break ด้วยอุปกรณ์หรือสกิลใด
3. **สูตรใน Battle System หัวข้อ 12 คือสูตรเดียว** ห้ามระบบอื่นคำนวณ Damage ด้วยวิธีอื่น
4. **Rarity 6 ระดับ ขาว–แดง เป็น Framework ทั้งอุปกรณ์ สกิล และ Follower**
5. **ทุก Content ใหม่เพิ่มผ่าน Database ไม่ใช่ Code** — ออกแบบมาเพื่อ Data-Driven Architecture

---

*Jianghu RPG Game Bible v1.0 — ห้ามแก้ไขโดยไม่ได้รับอนุมัติจาก Lead Designer*
