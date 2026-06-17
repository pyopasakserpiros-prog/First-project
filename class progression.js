export const classProgressionMilestones = [
  {
    level: 1,
    name: "จอมยุทธ์ฝึกหัด",
    title: "ผู้เยาว์ที่ก้าวเข้าสู่ยุทธภพ",
    titleEn: "Novice of the Jianghu",
    stats: { str: 0, con: 0, agi: 0, int: 0, luck: 0 },
    hp: 0,
    mp: 0,
    specialBonus: "ไม่มี",
    cultivationBonus: "ไม่มี",
    multiplier: 1.00,
    breakthroughGold: 0,
    breakthroughConditions: []
  },
  {
    level: 10,
    name: "จอมยุทธ์",
    title: "ดาวรุ่งแห่งยุทธภพ",
    titleEn: "Rising Star",
    stats: { str: 3, con: 3, agi: 3, int: 3, luck: 2 },
    hp: 100,
    mp: 80,
    specialBonus: "Armor Penetration +5% — การโจมตีทุกประเภทจะเจาะเกราะศัตรูเพิ่มขึ้น 5%",
    cultivationBonus: "ฟื้นฟู HP 2% ของ Max HP ทุกครั้งที่เริ่มเทิร์นของตนเอง",
    multiplier: 1.15,
    breakthroughGold: 500,
    breakthroughConditions: [
      "ผ่าน Area Boss ของ Map Level ก่อนหน้า (หากมี)"
    ]
  },
  {
    level: 20,
    name: "ยอดฝีมือ",
    title: "ผู้เดินบนเส้นทางยุทธ",
    titleEn: "Path Walker",
    stats: { str: 6, con: 6, agi: 6, int: 6, luck: 4 },
    hp: 250,
    mp: 200,
    specialBonus: "Cooldown Reduction +1 — Cooldown ของ Active Skill ทั้งหมดลดลง 1 เทิร์น (ขั้นต่ำ 1)",
    cultivationBonus: "เมื่อใช้สกิล [Physical] จะมีโอกาส 15% ที่จะไม่ติด Cooldown",
    multiplier: 1.35,
    breakthroughGold: 2000,
    breakthroughConditions: [
      "ผ่าน Area Boss ของ Map Level ก่อนหน้า (หากมี)",
      "มีอุปกรณ์อย่างน้อย 1 ชิ้นระดับ ฟ้า ขึ้นไป"
    ]
  },
  {
    level: 30,
    name: "ปรมาจารย์",
    title: "ผู้สั่นสะเทือนยุทธภพ",
    titleEn: "Realm Shaker",
    stats: { str: 10, con: 10, agi: 10, int: 10, luck: 6 },
    hp: 450,
    mp: 350,
    specialBonus: "Debuff Resistance +20% — โอกาสต้านทาน Debuff ทุกชนิดเพิ่มขึ้น 20%",
    cultivationBonus: "เมื่อถูกโจมตีและได้รับความเสียหายมากกว่า 30% ของ Max HP ในครั้งเดียว จะปล่อยคลื่นกระแทกทำดาเมจ [Internal] 100% INT แก่ศัตรูทั้งหมด (Trigger ได้ 1 ครั้งต่อการต่อสู้)",
    multiplier: 1.60,
    breakthroughGold: 5000,
    breakthroughConditions: [
      "ผ่าน Area Boss ของ Map Level ก่อนหน้า (หากมี)",
      "มี Follower อย่างน้อย 1 คน"
    ]
  },
  {
    level: 40,
    name: "ราชันยุทธ์",
    title: "เจ้าสำนักผู้เกรียงไกร",
    titleEn: "Grand Sect Master",
    stats: { str: 15, con: 15, agi: 15, int: 15, luck: 9 },
    hp: 700,
    mp: 550,
    specialBonus: "Lifesteal Overheal Conversion +30% — การดูดเลือดที่เกิน Max HP จะเปลี่ยนเป็นโล่ (Shield) คิดเป็น 30% ของส่วนที่เกิน",
    cultivationBonus: "ทุกครั้งที่โจมตีคริติคอล จะเพิ่ม ACCURACY ของตนเอง 5% เป็นเวลา 2 เทิร์น (ซ้อนทับได้สูงสุด 3 ชั้น)",
    multiplier: 1.90,
    breakthroughGold: 12000,
    breakthroughConditions: [
      "ผ่าน Area Boss ของ Map Level ก่อนหน้า (หากมี)",
      "STAT รวม (STR+CON+AGI+INT+LUCK) ≥ 200"
    ]
  },
  {
    level: 50,
    name: "เซียนยุทธ์",
    title: "ผู้ล่วงรู้สัจธรรมแห่งยุทธ์",
    titleEn: "Truth Seeker",
    stats: { str: 21, con: 21, agi: 21, int: 21, luck: 13 },
    hp: 1000,
    mp: 800,
    specialBonus: "First Strike Advantage — ในทุกการต่อสู้ จะโจมตีก่อนเสมอในเทิร์นแรก (ข้ามการคำนวณ AGI)",
    cultivationBonus: "เมื่อใช้สกิล [Internal] จะฟื้นฟู MP 5% ของ Max MP ทันที",
    multiplier: 2.30,
    breakthroughGold: 25000,
    breakthroughConditions: [
      "ผ่าน Area Boss ของ Map Level ก่อนหน้า (หากมี)",
      "มีสกิลระดับ ม่วง อย่างน้อย 1 สกิล"
    ]
  },
  {
    level: 60,
    name: "เทพยุทธ์",
    title: "จอมยุทธ์เหนือมนุษย์",
    titleEn: "Transcendent Warrior",
    stats: { str: 28, con: 28, agi: 28, int: 28, luck: 18 },
    hp: 1400,
    mp: 1100,
    specialBonus: "Damage Reflection +15% — สะท้อนความเสียหาย 15% ที่ได้รับกลับไปยังผู้โจมตี (คำนวณก่อนการลด damage)",
    cultivationBonus: "เมื่อ HP ต่ำกว่า 40% การโจมตีทุกครั้งจะฟื้นฟู HP เท่ากับ 10% ของความเสียหายที่ทำได้",
    multiplier: 2.80,
    breakthroughGold: 50000,
    breakthroughConditions: [
      "ผ่าน Area Boss ของ Map Level ก่อนหน้า (หากมี)",
      "ผ่าน Mini-Boss อย่างน้อย 3 ตัวที่ต่างพื้นที่"
    ]
  },
  {
    level: 70,
    name: "จักรพรรดิยุทธ์",
    title: "ผู้ครองยุทธภพใต้หล้า",
    titleEn: "Martial Emperor",
    stats: { str: 36, con: 36, agi: 36, int: 36, luck: 24 },
    hp: 1900,
    mp: 1500,
    specialBonus: "Mana Steal Efficiency +50% — การดูด MP (MANA_STEAL) มีประสิทธิภาพเพิ่มขึ้น 50%",
    cultivationBonus: "ทุกครั้งที่สังหารศัตรู จะได้รับ Action เพิ่ม 1 ครั้งในเทิร์นนั้น (สูงสุด 1 ครั้งต่อเทิร์น)",
    multiplier: 3.50,
    breakthroughGold: 100000,
    breakthroughConditions: [
      "ผ่าน Area Boss ของ Map Level ก่อนหน้า (หากมี)",
      "มีอุปกรณ์ระดับ ทอง ครบทุกสล็อต (อาวุธ, เสื้อเกราะ, เครื่องประดับ)"
    ]
  },
  {
    level: 80,
    name: "มหาเทพยุทธ์",
    title: "ผู้ก้าวพ้นขีดจำกัดมนุษย์",
    titleEn: "Limit Breaker",
    stats: { str: 45, con: 45, agi: 45, int: 45, luck: 30 },
    hp: 2500,
    mp: 2000,
    specialBonus: "Mystic Resistance — ภูมิคุ้มกันต่อสถานะ Stun, Silence, และ Petrify (หิน)",
    cultivationBonus: "เมื่อใช้สกิลระดับ Epic (ม่วง) ขึ้นไป จะลด MP Cost ของสกิลนั้นลง 50%",
    multiplier: 4.50,
    breakthroughGold: 200000,
    breakthroughConditions: [
      "ผ่าน Area Boss ของ Map Level ก่อนหน้า (หากมี)",
      "มีสกิลระดับ ทอง อย่างน้อย 2 สกิล และมี Follower ระดับ ม่วง ขึ้นไป อย่างน้อย 1 คน"
    ]
  }
];