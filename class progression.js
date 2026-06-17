export const classProgressionMilestones = [
  {
    level: 1,
    name: "จอมยุทธ์ฝึกหัด",
    title: "ผู้เยาว์ที่ก้าวเข้าสู่ยุทธภพ",
    titleEn: "Novice of the Jianghu",
    stats: { str: 0, con: 0, agi: 0, int: 0, luck: 0 },
    hp: 0,
    mp: 0,
    multiplier: 1.0,
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
    multiplier: 1.0,
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
    multiplier: 1.0,
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
    multiplier: 1.0,
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
    multiplier: 1.1,
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
    multiplier: 1.2,
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
    multiplier: 1.2,
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
    multiplier: 1.3,
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
    multiplier: 1.3,
    breakthroughGold: 200000,
    breakthroughConditions: [
      "ผ่าน Area Boss ของ Map Level ก่อนหน้า (หากมี)",
      "มีสกิลระดับ ทอง อย่างน้อย 2 สกิล และมี Follower ระดับ ม่วง ขึ้นไป อย่างน้อย 1 คน"
    ]
  }
];