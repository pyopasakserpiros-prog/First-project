export const SkillDatabase = [
  {
    id: 1,
    name: "หมัดทะลวงศิลา",
    level: "ขาว",
    type: "Active",
    description: "หมัดพื้นฐานที่ชาวยุทธ์ทุกคนต้องฝึก เน้นกำลังภายนอก",
    effect: "[Physical] โจมตีเป้าหมายเดี่ยว สร้างความเสียหาย 120% ของ ATK (MP Cost: 5, CD: 0)",
    condition: "Drop จาก Normal Enemy (Lv 1-9)"
  },
  {
    id: 2,
    name: "บาทาวายุเบื้องต้น",
    level: "ขาว",
    type: "Active",
    description: "เตะกวาดอย่างรวดเร็วเพื่อหยั่งเชิงศัตรู",
    effect: "[Physical] โจมตีเป้าหมายเดี่ยว 110% ของ ATK (MP Cost: 3, CD: 0)",
    condition: "Drop จาก Normal Enemy"
  },
  {
    id: 3,
    name: "ดาบผ่าฟืน",
    level: "ขาว",
    type: "Active",
    description: "เพลงดาบที่ดัดแปลงจากการตัดไม้",
    effect: "[Physical] โจมตีเดี่ยว 130% ของ ATK (MP Cost: 8, CD: 0)",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 4,
    name: "กระบี่พริ้วไหว",
    level: "ขาว",
    type: "Active",
    description: "การแทงกระบี่ที่เน้นความคล่องตัว",
    effect: "[Physical] โจมตีเดี่ยว 100% ของ ATK เพิ่มแม่นยำให้ตนเอง 5% 1 เทิร์น (MP Cost: 5, CD: 0)",
    condition: "Drop จาก Normal Enemy"
  },
  {
    id: 5,
    name: "ลมปราณรวมศูนย์",
    level: "ขาว",
    type: "Active",
    description: "เดินลมปราณเบื้องต้นเพื่อฟื้นฟูพลัง",
    effect: "[Internal] ฟื้นฟู MP 10% (MP Cost: 0, CD: 2)",
    condition: "เริ่มต้นเกม"
  },
  {
    id: 6,
    name: "ฝ่ามือผลักเขา",
    level: "ขาว",
    type: "Active",
    description: "ใช้กำลังภายในส่งผ่านฝ่ามือกระแทกศัตรู",
    effect: "[Internal] โจมตีเดี่ยว 110% ของ INT (MP Cost: 10, CD: 0)",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 7,
    name: "หอกทะลวงเกราะ",
    level: "ขาว",
    type: "Active",
    description: "แทงหอกตรงจุดตายเพื่อลดการป้องกัน",
    effect: "[Physical] โจมตีเดี่ยว 115% ของ ATK เจาะเกราะ (ARMOR_PEN) 5% (MP Cost: 8, CD: 0)",
    condition: "Drop จาก Normal Enemy"
  },
  {
    id: 8,
    name: "พลองกวาดลาน",
    level: "ขาว",
    type: "Active",
    description: "ควงพลองเป็นวงกว้างโจมตีศัตรูทั้งหมด",
    effect: "[Physical] โจมตีหมู่ศัตรูทั้งหมด 60% ของ ATK (MP Cost: 15, CD: 1)",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 9,
    name: "เข็มพิษหางนก",
    level: "ขาว",
    type: "Active",
    description: "ซัดอาวุธลับอาบพิษอ่อนๆ",
    effect: "[Poison] โจมตีเดี่ยว 50% ของ ATK ติดสถานะพิษลด HP 2% 2 เทิร์น (MP Cost: 10, CD: 1)",
    condition: "Drop จาก Normal Enemy"
  },
  {
    id: 10,
    name: "รักษาบาดแผล",
    level: "ขาว",
    type: "Active",
    description: "ปฐมพยาบาลเบื้องต้น",
    effect: "[Heal] ฟื้นฟู HP เป้าหมายเดี่ยว 150% ของ INT (MP Cost: 15, CD: 2)",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 11,
    name: "กำลังช้างสาร",
    level: "ขาว",
    type: "Passive",
    description: "ฝึกฝนร่างกายให้มีแรงมหาศาล",
    effect: "เพิ่ม STR +5",
    condition: "เริ่มต้นเกม"
  },
  {
    id: 12,
    name: "กายาทองแดง",
    level: "ขาว",
    type: "Passive",
    description: "ผิวหนังทนทานต่อการโจมตี",
    effect: "เพิ่ม CON +5",
    condition: "Drop จาก Normal Enemy"
  },
  {
    id: 13,
    name: "วิชาตัวเบาขั้นต้น",
    level: "ขาว",
    type: "Passive",
    description: "เคลื่อนไหวรวดเร็วกว่าคนทั่วไป",
    effect: "เพิ่ม AGI +5",
    condition: "Drop จาก Normal Enemy"
  },
  {
    id: 14,
    name: "ปัญญาแจ่มใส",
    level: "ขาว",
    type: "Passive",
    description: "สมาธิดีเลิศ เดินปราณราบรื่น",
    effect: "เพิ่ม INT +5",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 15,
    name: "โชคดีมีชัย",
    level: "ขาว",
    type: "Passive",
    description: "คนคำนวณมิสู้ฟ้าลิขิต",
    effect: "เพิ่ม LUCK +5",
    condition: "Drop จาก Normal Enemy"
  },
  {
    id: 16,
    name: "เล็งจุดตาย",
    level: "ขาว",
    type: "Passive",
    description: "สายตาแหลมคม หาจุดอ่อนศัตรู",
    effect: "เพิ่ม CRIT +2% (ห้ามเกิน 15%)",
    condition: "Drop จาก Normal Enemy"
  },
  {
    id: 17,
    name: "หลบหลีกใบไม้",
    level: "ขาว",
    type: "Passive",
    description: "สัญชาตญาณหลบหลีกพื้นฐาน",
    effect: "เพิ่ม DODGE +2% (ห้ามเกิน 15%)",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 18,
    name: "หมัดเหล็ก",
    level: "ขาว",
    type: "Passive",
    description: "กำปั้นแข็งดั่งเหล็กกล้า",
    effect: "เพิ่ม ATK +10",
    condition: "Drop จาก Normal Enemy"
  },
  {
    id: 19,
    name: "เสื้อเกราะหวาย",
    level: "ขาว",
    type: "Passive",
    description: "สวมเสื้อเกราะบางๆ ใต้ชุด",
    effect: "เพิ่ม DEF +10",
    condition: "Drop จาก Normal Enemy"
  },
  {
    id: 20,
    name: "ลมหายใจยืนยง",
    level: "ขาว",
    type: "Passive",
    description: "สูดลมหายใจลึก เพิ่มความทนทาน",
    effect: "เพิ่ม Max HP +50",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 21,
    name: "แหล่งน้ำซ่อนเร้น",
    level: "ขาว",
    type: "Passive",
    description: "กักเก็บพลังภายในได้มากขึ้น",
    effect: "เพิ่ม Max MP +40",
    condition: "Drop จาก Normal Enemy"
  },
  {
    id: 22,
    name: "มีดสั้นทะลวง",
    level: "ขาว",
    type: "Active",
    description: "แทงมีดสั้นเข้าที่ช่องโหว่",
    effect: "[Physical] โจมตีเดี่ยว 110% ATK มีโอกาส 10% ติดคริติคอลแน่นอน (MP Cost: 8, CD: 1)",
    condition: "Drop จาก Normal Enemy"
  },
  {
    id: 23,
    name: "แส้ปัดรังควาน",
    level: "ขาว",
    type: "Active",
    description: "ตวัดแส้รบกวนศัตรู",
    effect: "[Physical] โจมตีเดี่ยว 90% ATK ลด ACCURACY ศัตรู 5% 1 เทิร์น (MP Cost: 10, CD: 2)",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 24,
    name: "หมัดพยัคฆ์คำราม",
    level: "ขาว",
    type: "Active",
    description: "ตะโกนก้องพร้อมปล่อยหมัด",
    effect: "[Physical] โจมตีเดี่ยว 125% ATK (MP Cost: 12, CD: 1)",
    condition: "Drop จาก Normal Enemy"
  },
  {
    id: 25,
    name: "ทวนแทงทะลุ",
    level: "ขาว",
    type: "Active",
    description: "พุ่งทะยานแทงทวนไปข้างหน้า",
    effect: "[Physical] โจมตีเดี่ยว 140% ATK (MP Cost: 15, CD: 2)",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 26,
    name: "ฝ่ามือดูดกลืน",
    level: "ขาว",
    type: "Active",
    description: "ฝ่ามือที่แฝงพลังดูดซับเล็กน้อย",
    effect: "[Internal] โจมตีเดี่ยว 100% INT และฟื้น HP ตนเอง 10% ของดาเมจที่ทำได้ (MP Cost: 15, CD: 2)",
    condition: "Drop จาก Normal Enemy"
  },
  {
    id: 27,
    name: "ปราณคุ้มกาย",
    level: "ขาว",
    type: "Active",
    description: "สร้างชั้นปราณบางๆ ป้องกันตัว",
    effect: "[Support] เพิ่ม DEF ให้ตนเอง 15% เป็นเวลา 2 เทิร์น (MP Cost: 10, CD: 3)",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 28,
    name: "กระบี่หิมะโปรย",
    level: "ขาว",
    type: "Active",
    description: "ฟาดฟันกระบี่อย่างต่อเนื่อง",
    effect: "[Physical] โจมตีเดี่ยว 2 ครั้ง ครั้งละ 60% ATK (MP Cost: 12, CD: 1)",
    condition: "Drop จาก Normal Enemy"
  },
  {
    id: 29,
    name: "กรงเล็บเหยี่ยว",
    level: "ขาว",
    type: "Active",
    description: "คว้าจับศัตรูอย่างรุนแรง",
    effect: "[Physical] โจมตีเดี่ยว 120% ATK เพิ่ม ARMOR_PEN 10% สำหรับการโจมตีนี้ (MP Cost: 15, CD: 2)",
    condition: "Drop จาก Normal Enemy"
  },
  {
    id: 30,
    name: "พลังแฝงเร้น",
    level: "ขาว",
    type: "Passive",
    description: "ดึงพลังที่ซ่อนอยู่ออกมาใช้ยามคับขัน",
    effect: "เมื่อ HP ต่ำกว่า 20% เพิ่ม ATK +5%",
    condition: "Event พิเศษระดับ 1-2"
  },
  {
    id: 31,
    name: "สานสายใย",
    level: "ขาว",
    type: "Active",
    description: "แบ่งปันพลังให้ผู้ติดตาม",
    effect: "[Support] ฟื้น HP ให้ Follower เดี่ยว 100% INT (MP Cost: 20, CD: 2)",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 32,
    name: "เพ่งสมาธิ",
    level: "ขาว",
    type: "Passive",
    description: "จดจ่อกับการโจมตี",
    effect: "เพิ่ม ACCURACY +3%",
    condition: "Drop จาก Normal Enemy"
  },
  {
    id: 33,
    name: "ต้านทานพิษเบื้องต้น",
    level: "ขาว",
    type: "Passive",
    description: "ร่างกายคุ้นชินกับพิษอ่อนๆ",
    effect: "ลดความเสียหายจากสถานะ [Poison] ลง 10%",
    condition: "Drop จากศัตรูประเภทสัตว์มีพิษ"
  },
  {
    id: 34,
    name: "ก้าวพริบตา",
    level: "ขาว",
    type: "Active",
    description: "เคลื่อนที่อย่างรวดเร็วเพื่อหลบหลีก",
    effect: "[Support] เพิ่ม DODGE ให้ตนเอง 10% 1 เทิร์น (MP Cost: 15, CD: 3)",
    condition: "Drop จาก Normal Enemy"
  },
  {
    id: 35,
    name: "ดาบศิลาคลั่ง",
    level: "เขียว",
    type: "Active",
    description: "ฟาดดาบอย่างหนักหน่วงจนพื้นสะเทือน",
    effect: "[Physical] โจมตีเดี่ยว 140% ATK มีโอกาส 20% ทำให้ศัตรูติด Stun 1 เทิร์น (MP Cost: 20, CD: 3)",
    condition: "Drop จาก Elite Enemy"
  },
  {
    id: 36,
    name: "กระบี่สายน้ำไหล",
    level: "เขียว",
    type: "Active",
    description: "เพลงกระบี่ต่อเนื่องดั่งสายน้ำ",
    effect: "[Physical] โจมตีเดี่ยว 3 ครั้ง ครั้งละ 50% ATK (MP Cost: 25, CD: 2)",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 37,
    name: "ฝ่ามือรอยประทับ",
    level: "เขียว",
    type: "Active",
    description: "ตบฝ่ามือทิ้งรอยปราณไว้บนร่างศัตรู",
    effect: "[Internal] โจมตีเดี่ยว 130% INT ลด DEF ศัตรู 10% 2 เทิร์น (MP Cost: 30, CD: 3)",
    condition: "Drop จาก Elite Enemy"
  },
  {
    id: 38,
    name: "พิษคางคก",
    level: "เขียว",
    type: "Active",
    description: "พ่นพิษคางคกใส่หน้าศัตรู",
    effect: "[Poison] โจมตีเดี่ยว 80% INT ติดสถานะพิษลด HP 4% 3 เทิร์น (สะสมทับได้) (MP Cost: 25, CD: 2)",
    condition: "Drop จาก Elite Enemy"
  },
  {
    id: 39,
    name: "ลมปราณเยียวยา",
    level: "เขียว",
    type: "Active",
    description: "เดินลมปราณเพื่อฟื้นฟูบาดแผลอย่างรวดเร็ว",
    effect: "[Heal] ฟื้นฟู HP ให้เป้าหมายเดี่ยว 250% INT และฟื้นฟูต่อเนื่อง 20% INT 2 เทิร์น (MP Cost: 35, CD: 4)",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 40,
    name: "พลองสะบัดก้อนเมฆ",
    level: "เขียว",
    type: "Active",
    description: "หมุนพลองสร้างกระแสลมกระแทก",
    effect: "[Physical] โจมตีหมู่ศัตรูทั้งหมด 80% ATK ลด ACCURACY ศัตรู 10% 1 เทิร์น (MP Cost: 40, CD: 3)",
    condition: "Drop จาก Elite Enemy"
  },
  {
    id: 41,
    name: "โล่ปราณเหล็กกล้า",
    level: "เขียว",
    type: "Active",
    description: "สร้างโล่ลมปราณคุ้มกันพรรคพวก",
    effect: "[Support] สร้างโล่ซับดาเมจ 200% INT ให้เป้าหมายเดี่ยว (MP Cost: 30, CD: 4)",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 42,
    name: "เสียงคำรามราชสีห์",
    level: "เขียว",
    type: "Active",
    description: "เปล่งเสียงคำรามข่มขวัญศัตรู",
    effect: "[Internal] โจมตีหมู่ศัตรูทั้งหมด 70% INT มีโอกาส 15% ขัดจังหวะสกิลศัตรู (MP Cost: 35, CD: 3)",
    condition: "Drop จาก Elite Enemy"
  },
  {
    id: 43,
    name: "กรงเล็บฉีกวิญญาณ",
    level: "เขียว",
    type: "Active",
    description: "โจมตีจุดตายอย่างเหี้ยมโหด",
    effect: "[Physical] โจมตีเดี่ยว 150% ATK ดูดเลือด (LIFE_STEAL) +10% สำหรับการโจมตีนี้ (MP Cost: 25, CD: 2)",
    condition: "Drop จาก Elite Enemy"
  },
  {
    id: 44,
    name: "ดรรชนีสกัดจุด",
    level: "เขียว",
    type: "Active",
    description: "จิ้มสกัดจุดชีพจรศัตรู",
    effect: "[Internal] โจมตีเดี่ยว 100% INT ลด AGI ศัตรู 20% 2 เทิร์น (MP Cost: 20, CD: 3)",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 45,
    name: "กล้ามเนื้อดั่งหินผา",
    level: "เขียว",
    type: "Passive",
    description: "ฝึกฝนร่างกายจนแข็งแกร่งเกินมนุษย์",
    effect: "เพิ่ม STR +10 และ Max HP +100",
    condition: "Drop จาก Elite Enemy"
  },
  {
    id: 46,
    name: "กายาไร้รูป",
    level: "เขียว",
    type: "Passive",
    description: "ร่างกายยืดหยุ่น หลบหลีกพริ้วไหว",
    effect: "เพิ่ม AGI +10 และ DODGE +4% (ห้ามเกิน 15%)",
    condition: "Drop จาก Elite Enemy"
  },
  {
    id: 47,
    name: "จิตใจทะลุปรุโปร่ง",
    level: "เขียว",
    type: "Passive",
    description: "สมาธิแน่วแน่ มองเห็นจุดตายชัดเจน",
    effect: "เพิ่ม INT +10 และ CRIT +4% (ห้ามเกิน 15%)",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 48,
    name: "เส้นเอ็นเหล็ก",
    level: "เขียว",
    type: "Passive",
    description: "ทนทานต่อการบาดเจ็บรุนแรง",
    effect: "เพิ่ม CON +10 และลด CRIT_DAMAGE ที่ได้รับ 10%",
    condition: "Drop จาก Elite Enemy"
  },
  {
    id: 49,
    name: "โชคแห่งยุทธภพ",
    level: "เขียว",
    type: "Passive",
    description: "รอดตายปาฏิหาริย์บ่อยครั้ง",
    effect: "เพิ่ม LUCK +10 และเพิ่มโอกาส Drop Item +2%",
    condition: "Event พิเศษระดับ 3-5"
  },
  {
    id: 50,
    name: "ดาบสะบั้นโลหิต",
    level: "เขียว",
    type: "Active",
    description: "ยิ่งเจ็บยิ่งฟันแรง",
    effect: "[Physical] โจมตีเดี่ยว 120% ATK (ดาเมจเพิ่มขึ้น 1% ทุกๆ 1% HP ของตนเองที่หายไป) (MP Cost: 30, CD: 3)",
    condition: "Drop จาก Elite Enemy"
  },
  {
    id: 51,
    name: "กระบี่ทะลวงปราณ",
    level: "เขียว",
    type: "Active",
    description: "แทงกระบี่แฝงกำลังภายในทำลายเกราะ",
    effect: "[Internal] โจมตีเดี่ยว 140% INT เพิกเฉยต่อ DEF 20% (MP Cost: 35, CD: 3)",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 52,
    name: "แส้อสรพิษ",
    level: "เขียว",
    type: "Active",
    description: "ฟาดแส้ที่อาบด้วยพิษงู",
    effect: "[Poison] โจมตีหมู่ 60% ATK ศัตรูทั้งหมดติดพิษลด HP 2% 2 เทิร์น (MP Cost: 40, CD: 4)",
    condition: "Drop จาก Elite Enemy"
  },
  {
    id: 53,
    name: "ฝ่ามือทวงวิญญาณ",
    level: "เขียว",
    type: "Active",
    description: "กระแทกฝ่ามือดึงดูดพลังชีวิต",
    effect: "[Internal] โจมตีเดี่ยว 120% INT ฟื้นฟู MP ให้ตนเอง 15% ของดาเมจที่ทำได้ (MANA_STEAL) (MP Cost: 20, CD: 2)",
    condition: "Drop จาก Elite Enemy"
  },
  {
    id: 54,
    name: "ลมปราณรวมศูนย์ขั้นกลาง",
    level: "เขียว",
    type: "Active",
    description: "ฟื้นฟูพลังภายในอย่างมีประสิทธิภาพ",
    effect: "[Internal] ฟื้นฟู MP ตนเอง 25% (MP Cost: 0, CD: 4)",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 55,
    name: "มีดบินไร้เงา",
    level: "เขียว",
    type: "Active",
    description: "ซัดมีดบินด้วยความเร็วสูง",
    effect: "[Physical] โจมตีเดี่ยว 150% ATK ไม่สามารถถูกหลบหลีกได้ (ACCURACY 100% เสมอ) (MP Cost: 30, CD: 3)",
    condition: "Drop จาก Elite Enemy"
  },
  {
    id: 56,
    name: "จิตแห่งดาบ",
    level: "เขียว",
    type: "Passive",
    description: "เข้าใจวิถีแห่งดาบ",
    effect: "เพิ่ม ARMOR_PEN +5%",
    condition: "Drop จาก Elite Enemy"
  },
  {
    id: 57,
    name: "ปราณรักษาซ่อนเร้น",
    level: "เขียว",
    type: "Passive",
    description: "ร่างกายฟื้นฟูตัวเองทีละน้อย",
    effect: "ฟื้นฟู HP 2% ทุกๆ เทิร์นของตนเอง",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 58,
    name: "กระบี่สายฟ้าแลบ",
    level: "เขียว",
    type: "Active",
    description: "ฟันด้วยความเร็วสูงชั่วพริบตา",
    effect: "[Physical] โจมตีเดี่ยว 110% ATK (สกิลนี้จะถูกใช้งานก่อนเสมอ ไม่สน AGI) (MP Cost: 25, CD: 3)",
    condition: "Drop จาก Elite Enemy"
  },
  {
    id: 59,
    name: "ผงพรางตา",
    level: "เขียว",
    type: "Active",
    description: "สาดผงฝุ่นเพื่อหลบหนีหรือสวนกลับ",
    effect: "[Support] ลด ACCURACY ศัตรูทั้งหมด 15% 2 เทิร์น (MP Cost: 30, CD: 4)",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 60,
    name: "พลังกายเดือด",
    level: "เขียว",
    type: "Passive",
    description: "เมื่อต่อสู้ยืดเยื้อ พลังยิ่งเพิ่ม",
    effect: "เพิ่ม ATK 2% ทุกเทิร์นที่ผ่านไป (สูงสุด 10%)",
    condition: "Drop จาก Elite Enemy"
  },
  {
    id: 61,
    name: "สลัดพิษ",
    level: "เขียว",
    type: "Active",
    description: "เดินปราณขับพิษออกจากร่าง",
    effect: "[Support] ลบสถานะ Debuff ทั้งหมดจากตนเอง 1 อย่าง (MP Cost: 25, CD: 3)",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 62,
    name: "รังสีอำมหิต",
    level: "เขียว",
    type: "Passive",
    description: "แผ่รังสีข่มขวัญศัตรู",
    effect: "ลด ATK ศัตรูทั้งหมดลง 5% อัตโนมัติเมื่อเริ่มการต่อสู้",
    condition: "Drop จาก Elite Enemy"
  },
  {
    id: 63,
    name: "ฝ่ามือสกัดกั้น",
    level: "เขียว",
    type: "Active",
    description: "ตบอาวุธศัตรูให้เบี่ยงเบน",
    effect: "[Physical] โจมตีเดี่ยว 100% ATK ลด CRIT ศัตรูลง 15% 2 เทิร์น (MP Cost: 20, CD: 2)",
    condition: "Drop จาก Elite Enemy"
  },
  {
    id: 64,
    name: "ลมปราณคุ้มครองพรรคพวก",
    level: "เขียว",
    type: "Active",
    description: "แผ่ปราณป้องกันผู้ติดตาม",
    effect: "[Support] เพิ่ม DEF 20% ให้ Followers ทั้งหมด 2 เทิร์น (MP Cost: 40, CD: 4)",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 65,
    name: "ทวนพิฆาตม้า",
    level: "เขียว",
    type: "Active",
    description: "กวาดทวนตัดขาศัตรู",
    effect: "[Physical] โจมตีเดี่ยว 160% ATK ถ้าเป้าหมายมี AGI สูงกว่า จะสร้างดาเมจเพิ่มอีก 20% (MP Cost: 35, CD: 3)",
    condition: "Drop จาก Elite Enemy"
  },
  {
    id: 66,
    name: "เลือดลมสูบฉีด",
    level: "เขียว",
    type: "Passive",
    description: "ฟื้นตัวเมื่อโจมตีคริติคอล",
    effect: "ทุกครั้งที่ทำ Critical Hit ฟื้นฟู HP 5% ของ Max HP",
    condition: "Event พิเศษ"
  },
  {
    id: 67,
    name: "คัมภีร์หมอเทวดาขั้นต้น",
    level: "เขียว",
    type: "Passive",
    description: "เพิ่มประสิทธิภาพการรักษา",
    effect: "สกิล [Heal] ทั้งหมดมีผลแรงขึ้น 15%",
    condition: "ซื้อจาก General Shop"
  },
  {
    id: 68,
    name: "กระบี่เมฆาคล้อย",
    level: "ฟ้า",
    type: "Active",
    description: "เพลงกระบี่ที่พลิ้วไหวดั่งเมฆ ยากจะคาดเดา",
    effect: "[Physical] โจมตีเดี่ยว 180% ATK เพิ่ม DODGE ให้ตนเอง 20% 2 เทิร์น (MP Cost: 40, CD: 3)",
    condition: "Drop จาก Mini-Boss (Lv 10-29)"
  },
  {
    id: 69,
    name: "ฝ่ามือดอกบัวบาน",
    level: "ฟ้า",
    type: "Active",
    description: "ฝ่ามือที่ปล่อยปราณออกรอบทิศ",
    effect: "[Internal] โจมตีหมู่ศัตรูทั้งหมด 120% INT และลบ Buff 1 อย่างของศัตรูแต่ละตัว (MP Cost: 60, CD: 4)",
    condition: "ซื้อจาก Elite Shop"
  },
  {
    id: 70,
    name: "ดาบแยกเงา",
    level: "ฟ้า",
    type: "Active",
    description: "ฟันดาบด้วยความเร็วสูงจนเกิดภาพติดตา",
    effect: "[Physical] โจมตีเป้าหมายแบบสุ่ม 4 ครั้ง ครั้งละ 60% ATK (MP Cost: 50, CD: 3)",
    condition: "Drop จาก Mini-Boss"
  },
  {
    id: 71,
    name: "ลมปราณน้ำแข็ง",
    level: "ฟ้า",
    type: "Active",
    description: "ปล่อยไอเย็นยะเยือกแช่แข็งศัตรู",
    effect: "[Internal] โจมตีเดี่ยว 150% INT ลด AGI ศัตรู 40% 2 เทิร์น (MP Cost: 45, CD: 3)",
    condition: "Drop จาก Mini-Boss"
  },
  {
    id: 72,
    name: "เข็มหมื่นพิษ",
    level: "ฟ้า",
    type: "Active",
    description: "ซัดเข็มพิษจำนวนมากกระจายทั่วพื้นที่",
    effect: "[Poison] โจมตีหมู่ 80% ATK ศัตรูทั้งหมดติดสถานะพิษลด HP 5% 3 เทิร์น (Stack ได้สูงสุด 3 ชั้น) (MP Cost: 55, CD: 4)",
    condition: "ซื้อจาก Elite Shop"
  },
  {
    id: 73,
    name: "บทสวดชำระล้าง",
    level: "ฟ้า",
    type: "Active",
    description: "สวดมนต์เดินปราณเพื่อล้างมลทิน",
    effect: "[Support] ลบ Debuff ทั้งหมดจากฝ่ายตนเองทั้งหมด และฟื้นฟู HP 100% INT (MP Cost: 60, CD: 5)",
    condition: "ซื้อจาก Elite Shop"
  },
  {
    id: 74,
    name: "หมัดระเบิดเพลิง",
    level: "ฟ้า",
    type: "Active",
    description: "รวบรวมลมปราณธาตุไฟไว้ที่หมัด",
    effect: "[Physical] โจมตีเดี่ยว 200% ATK หากติด Critical ดาเมจจะกระจายไปโดนศัตรูตัวอื่น 30% (MP Cost: 45, CD: 3)",
    condition: "Drop จาก Mini-Boss"
  },
  {
    id: 75,
    name: "ทวนทลายทัพ",
    level: "ฟ้า",
    type: "Active",
    description: "ควงทวนพุ่งชนทำลายแนวป้องกัน",
    effect: "[Physical] โจมตีหมู่ 100% ATK เจาะเกราะ (ARMOR_PEN) 30% สำหรับการโจมตีนี้ (MP Cost: 55, CD: 3)",
    condition: "Drop จาก Mini-Boss"
  },
  {
    id: 76,
    name: "กรงเล็บกระชากวิญญาณ",
    level: "ฟ้า",
    type: "Active",
    description: "โจมตีจุดตายเพื่อขโมยพลังชีวิต",
    effect: "[Physical] โจมตีเดี่ยว 170% ATK ดูดเลือด 30% ของดาเมจ (MP Cost: 40, CD: 3)",
    condition: "ซื้อจาก Elite Shop"
  },
  {
    id: 77,
    name: "ค่ายกลแปดทิศ",
    level: "ฟ้า",
    type: "Active",
    description: "สร้างค่ายกลลวงตาเพื่อป้องกัน",
    effect: "[Support] เพิ่ม DODGE ให้ทีมทั้งหมด 15% และลดดาเมจที่ได้รับ 10% 2 เทิร์น (MP Cost: 50, CD: 5)",
    condition: "Drop จาก Mini-Boss"
  },
  {
    id: 78,
    name: "กายาเหล็กไหล",
    level: "ฟ้า",
    type: "Passive",
    description: "ร่างกายแข็งแกร่งฟันแทงไม่เข้า",
    effect: "เพิ่ม CON +25 และลดดาเมจจาก [Physical] ลง 15%",
    condition: "Drop จาก Mini-Boss"
  },
  {
    id: 79,
    name: "ตาเหยี่ยว",
    level: "ฟ้า",
    type: "Passive",
    description: "มองเห็นจุดอ่อนทุกสรรพสิ่ง",
    effect: "เพิ่ม ACCURACY +15% และ ARMOR_PEN +15%",
    condition: "ซื้อจาก Elite Shop"
  },
  {
    id: 80,
    name: "หัวใจมังกร",
    level: "ฟ้า",
    type: "Passive",
    description: "เลือดลมสูบฉีดมหาศาล",
    effect: "เพิ่ม Max HP +500 และ STR +20",
    condition: "Drop จาก Mini-Boss"
  },
  {
    id: 81,
    name: "ทะเลปราณไร้ขอบเขต",
    level: "ฟ้า",
    type: "Passive",
    description: "กักเก็บลมปราณได้ดั่งมหาสมุทร",
    effect: "เพิ่ม Max MP +400 และ INT +20",
    condition: "ซื้อจาก Elite Shop"
  },
  {
    id: 82,
    name: "ก้าวท่องคลื่น",
    level: "ฟ้า",
    type: "Passive",
    description: "วิชาตัวเบาที่รวดเร็วดั่งเหยียบเกลียวคลื่น",
    effect: "เพิ่ม AGI +25 และเพิ่ม Speed_Order เสมอหาก AGI เท่ากับศัตรู",
    condition: "Drop จาก Mini-Boss"
  },
  {
    id: 83,
    name: "จุดชีพจรสังหาร",
    level: "ฟ้า",
    type: "Passive",
    description: "รู้จุดชีพจรที่ทำให้ตายได้ในครั้งเดียว",
    effect: "เพิ่ม CRIT_DAMAGE +50%",
    condition: "ซื้อจาก Elite Shop"
  },
  {
    id: 84,
    name: "ดาบดื่มเลือด",
    level: "ฟ้า",
    type: "Passive",
    description: "อาวุธกระหายเลือด ฟื้นฟูยามสังหาร",
    effect: "เมื่อ Kill ศัตรูสำเร็จ ฟื้นฟู HP 15% ของ Max HP",
    condition: "Drop จาก Mini-Boss"
  },
  {
    id: 85,
    name: "จิตสมาธิไร้กังวล",
    level: "ฟ้า",
    type: "Passive",
    description: "ลดการใช้พลังภายใน",
    effect: "สกิลทั้งหมดใช้ MP ลดลง 15%",
    condition: "ซื้อจาก Elite Shop"
  },
  {
    id: 86,
    name: "ฝ่ามือสลายกระดูก",
    level: "ฟ้า",
    type: "Active",
    description: "พลังปราณที่แทรกซึมทำลายจากภายใน",
    effect: "[Internal] โจมตีเดี่ยว 160% INT มีโอกาส 30% ติดสถานะ Stun 1 เทิร์น (MP Cost: 50, CD: 3)",
    condition: "Drop จาก Mini-Boss"
  },
  {
    id: 87,
    name: "หอกมังกรทะยาน",
    level: "ฟ้า",
    type: "Active",
    description: "กระโดดแทงจากกลางอากาศ",
    effect: "[Physical] โจมตีเดี่ยว 220% ATK (MP Cost: 45, CD: 4)",
    condition: "ซื้อจาก Elite Shop"
  },
  {
    id: 88,
    name: "กระบี่ดาวตก",
    level: "ฟ้า",
    type: "Active",
    description: "แทงกระบี่รัวดั่งดาวตก",
    effect: "[Physical] โจมตีเดี่ยว 5 ครั้ง ครั้งละ 40% ATK (MP Cost: 55, CD: 3)",
    condition: "Drop จาก Mini-Boss"
  },
  {
    id: 89,
    name: "พิษสลายวิญญาณ",
    level: "ฟ้า",
    type: "Active",
    description: "อาบอาวุธด้วยพิษร้ายแรง",
    effect: "[Support] การโจมตีปกติครั้งต่อไปของทุกคนในทีมจะแถมสถานะ [Poison] ลด HP 3% 3 เทิร์น (MP Cost: 40, CD: 4)",
    condition: "Drop จาก Mini-Boss"
  },
  {
    id: 90,
    name: "ลมปราณสะท้อนกลับ",
    level: "ฟ้า",
    type: "Active",
    description: "สร้างบาเรียสะท้อนการโจมตี",
    effect: "[Support] สะท้อนความเสียหาย 30% ของ Physical Damage ที่ได้รับกลับไปหาผู้โจมตี 2 เทิร์น (MP Cost: 60, CD: 5)",
    condition: "ซื้อจาก Elite Shop"
  },
  {
    id: 91,
    name: "หมอเทวดาคืนชีพ",
    level: "ฟ้า",
    type: "Active",
    description: "การรักษาขั้นสูง",
    effect: "[Heal] ฟื้นฟู HP ให้ทีมทั้งหมด 150% INT (MP Cost: 80, CD: 4)",
    condition: "Drop จาก Mini-Boss"
  },
  {
    id: 92,
    name: "เสียงขลุ่ยครวญ",
    level: "ฟ้า",
    type: "Active",
    description: "เป่าขลุ่ยป่วนประสาทศัตรู",
    effect: "[Internal] โจมตีหมู่ 100% INT ลด CRIT และ CRIT_DAMAGE ศัตรูทั้งหมด 20% 2 เทิร์น (MP Cost: 50, CD: 3)",
    condition: "ซื้อจาก Elite Shop"
  },
  {
    id: 93,
    name: "พลองตลบหลัง",
    level: "ฟ้า",
    type: "Active",
    description: "หลอกล่อแล้วตีจุดตาย",
    effect: "[Physical] โจมตีเดี่ยว 150% ATK ถ้าศัตรูติด Debuff อยู่ ดาเมจจะเพิ่มเป็น 220% (MP Cost: 45, CD: 3)",
    condition: "Drop จาก Mini-Boss"
  },
  {
    id: 94,
    name: "ซัดเหรียญทอง",
    level: "ฟ้า",
    type: "Active",
    description: "ใช้วิชาลับซัดเงินตราเป็นอาวุธ (ต้องใช้ Gold)",
    effect: "[Physical] โจมตีเดี่ยว 300% ATK (หักเงิน 100 Gold ทุกครั้งที่ใช้) (MP Cost: 10, CD: 2)",
    condition: "Black Market Event"
  },
  {
    id: 95,
    name: "จิตมุ่งมั่น",
    level: "ฟ้า",
    type: "Passive",
    description: "ไม่ยอมแพ้แม้อาการสาหัส",
    effect: "เมื่อ HP ต่ำกว่า 30% เพิ่ม DEF และ DODGE +20%",
    condition: "Drop จาก Mini-Boss"
  },
  {
    id: 96,
    name: "กลิ่นอายเทพยุทธ์",
    level: "ฟ้า",
    type: "Passive",
    description: "แผ่บารมีคุ้มครองผู้ติดตาม",
    effect: "Followers ทุกคนได้รับ ATK และ DEF +10%",
    condition: "ซื้อจาก Elite Shop"
  },
  {
    id: 97,
    name: "พิษซึมลึก",
    level: "ฟ้า",
    type: "Passive",
    description: "ทำให้พิษรุนแรงขึ้น",
    effect: "ความเสียหายจากสถานะ [Poison] ที่คุณสร้างแรงขึ้น 50%",
    condition: "Drop จาก Mini-Boss"
  },
  {
    id: 98,
    name: "ฝ่ามือทะลวงใจ",
    level: "ฟ้า",
    type: "Active",
    description: "กระแทกปราณทะลุหัวใจ",
    effect: "[Internal] โจมตีเดี่ยว 180% INT มีโอกาส 5% ที่จะติด KILL_CHANCE ทันที (ไม่ส่งผลกับ Boss) (MP Cost: 60, CD: 4)",
    condition: "ซื้อจาก Elite Shop"
  },
  {
    id: 99,
    name: "ดาบปัดเป่า",
    level: "ฟ้า",
    type: "Active",
    description: "ปัดป้องการโจมตีพร้อมสวนกลับ",
    effect: "[Physical] โจมตีเดี่ยว 140% ATK และเพิ่ม Block Chance (หลบหลีก 100% สำหรับ Hit ถัดไป) (MP Cost: 55, CD: 4)",
    condition: "Drop จาก Mini-Boss"
  },
  {
    id: 100,
    name: "พลังปราณบริสุทธิ์",
    level: "ฟ้า",
    type: "Passive",
    description: "ต้านทานสิ่งชั่วร้าย",
    effect: "เพิ่มโอกาส 30% ที่จะต้านทาน Debuff ทุกชนิด",
    condition: "ซื้อจาก Elite Shop"
  },
  {
    id: 101,
    name: "มังกรคำรามฟ้า",
    level: "ม่วง",
    type: "Active",
    description: "ปล่อยปราณรูปมังกรเข้าบดขยี้ศัตรูทั้งหมด",
    effect: "[Internal] โจมตีหมู่ศัตรูทั้งหมด 200% INT และลด ATK ของศัตรู 30% 2 เทิร์น (MP Cost: 100, CD: 4)",
    condition: "Drop จาก Area Boss (Lv 30+)"
  },
  {
    id: 102,
    name: "เพลงกระบี่เก้าสวรรค์",
    level: "ม่วง",
    type: "Active",
    description: "กระบี่ร่ายรำดั่งเทพเซียน ฟัน 9 รวด",
    effect: "[Physical] โจมตีเป้าหมายแบบสุ่ม 9 ครั้ง ครั้งละ 45% ATK (รวม 405%) (MP Cost: 120, CD: 4)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 103,
    name: "ฝ่ามือสลายโลหิต",
    level: "ม่วง",
    type: "Active",
    description: "ฝ่ามือสุดอำมหิต ดูดกลืนเลือดเนื้อศัตรู",
    effect: "[Internal] โจมตีเดี่ยว 250% INT ฟื้นฟู HP 50% ของดาเมจที่ทำได้ (LIFE_STEAL พิเศษ) (MP Cost: 90, CD: 3)",
    condition: "Black Market Event"
  },
  {
    id: 104,
    name: "ดาบผ่าทิวา",
    level: "ม่วง",
    type: "Active",
    description: "ฟาดดาบยักษ์ตัดแหวกอากาศ",
    effect: "[Physical] โจมตีหมู่ศัตรูทั้งหมด 180% ATK เจาะเกราะ (ARMOR_PEN) 40% (MP Cost: 110, CD: 4)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 105,
    name: "ค่ายกลดาวดับ",
    level: "ม่วง",
    type: "Active",
    description: "วางค่ายกลกักขังศัตรูให้ไร้ทางสู้",
    effect: "[Support] ศัตรูทั้งหมดติดสถานะ Stun 1 เทิร์น และโดนดาเมจ [Internal] 80% INT (MP Cost: 150, CD: 5)",
    condition: "Black Market Event"
  },
  {
    id: 106,
    name: "เข็มปลิดชีพหมื่นลี้",
    level: "ม่วง",
    type: "Active",
    description: "ซัดเข็มที่อาบพิษร้ายแรงที่สุด โดนจุดตาย",
    effect: "[Poison] โจมตีเดี่ยว 100% ATK ติดพิษลด HP 10% 2 เทิร์น และเพิ่ม KILL_CHANCE +3% สำหรับสกิลนี้ (MP Cost: 80, CD: 3)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 107,
    name: "บัวหิมะชุบชีวิต",
    level: "ม่วง",
    type: "Active",
    description: "ใช้วิชาแพทย์ขั้นสูงสุดดึงคนกลับจากความตาย",
    effect: "[Heal] ชุบชีวิต Follower ที่ตาย 1 คนให้มี HP 50% หรือฟื้นฟู HP 300% INT ให้เป้าหมายที่มีชีวิต (MP Cost: 200, CD: 6)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 108,
    name: "ระฆังทองคลุมร่าง",
    level: "ม่วง",
    type: "Active",
    description: "สร้างระฆังปราณคุ้มกายไร้เทียมทาน",
    effect: "[Support] ตนเองเป็นอมตะ (Immune ดาเมจและ Debuff ทุกชนิด) เป็นเวลา 1 เทิร์น (MP Cost: 180, CD: 6)",
    condition: "Black Market Event"
  },
  {
    id: 109,
    name: "กายาเทวะ",
    level: "ม่วง",
    type: "Passive",
    description: "ร่างกายวิวัฒนาการเกินขีดจำกัดมนุษย์",
    effect: "เพิ่ม Base Stats ทั้งหมด (STR, CON, AGI, INT, LUCK) +15",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 110,
    name: "จิตกระบี่ไร้พ่าย",
    level: "ม่วง",
    type: "Passive",
    description: "กระบี่รวมเป็นหนึ่งกับจิตใจ",
    effect: "เพิ่ม CRIT_DAMAGE +80% และ ATK +10%",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 111,
    name: "เงามายาซ้อนเร้น",
    level: "ม่วง",
    type: "Passive",
    description: "ร่างกายเคลื่อนไหวดุจภาพลวงตา",
    effect: "เพิ่ม DODGE +12% และหากหลบหลีกสำเร็จ จะสะท้อนดาเมจ 50% ของ ATK ตนเองกลับไป",
    condition: "Black Market Event"
  },
  {
    id: 112,
    name: "ลมปราณกลืนสวรรค์",
    level: "ม่วง",
    type: "Passive",
    description: "ดูดซับพลังงานธรรมชาติมาฟื้นฟูตนเอง",
    effect: "ฟื้นฟู MP 10% และ HP 5% ทุกๆ จบเทิร์นของตนเอง",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 113,
    name: "พลังแฝงจักรพรรดิ",
    level: "ม่วง",
    type: "Passive",
    description: "ยิ่งศัตรูแกร่ง ยิ่งแสดงพลัง",
    effect: "หากสู้กับ Boss เพิ่ม ATK และ DEF ตนเอง 30% ตลอดการต่อสู้",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 114,
    name: "หมัดทลายภูผา",
    level: "ม่วง",
    type: "Active",
    description: "หมัดหนักหน่วงจนภูเขายังแหลก",
    effect: "[Physical] โจมตีเดี่ยว 350% ATK ข้ามการคำนวณ DODGE ของศัตรู (ตีโดน 100%) (MP Cost: 130, CD: 4)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 115,
    name: "ทวนกวาดพสุธา",
    level: "ม่วง",
    type: "Active",
    description: "กวาดทวนด้วยพลังทำลายล้างวงกว้าง",
    effect: "[Physical] โจมตีหมู่ศัตรูทั้งหมด 160% ATK หากศัตรูตัวใดตายจากสกิลนี้ จะได้ Action เพิ่ม 1 ครั้งทันที (MP Cost: 120, CD: 4)",
    condition: "Black Market Event"
  },
  {
    id: 116,
    name: "ดนตรีสยบมาร",
    level: "ม่วง",
    type: "Active",
    description: "ดีดพิณบรรเลงเพลงสังหาร",
    effect: "[Internal] โจมตีหมู่ 180% INT ศัตรูทั้งหมดติดสถานะ \"ห้ามใช้ Active Skill\" 1 เทิร์น (Silence) (MP Cost: 140, CD: 5)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 117,
    name: "กงจักรตัดตะวัน",
    level: "ม่วง",
    type: "Active",
    description: "ขว้างกงจักรหมุนวนฟันศัตรูต่อเนื่อง",
    effect: "[Physical] โจมตีเป้าหมายแบบสุ่ม 6 ครั้ง ครั้งละ 55% ATK และทำให้ติดสถานะเลือดออก (ลด HP 2% 2 เทิร์น) ทุกๆ ฮิตที่โดน (MP Cost: 110, CD: 3)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 118,
    name: "ปราณน้ำแข็งพันปี",
    level: "ม่วง",
    type: "Active",
    description: "แช่แข็งเลือดในกายศัตรู",
    effect: "[Internal] โจมตีเดี่ยว 220% INT ลด AGI ศัตรูลง 70% 3 เทิร์น (MP Cost: 100, CD: 4)",
    condition: "Black Market Event"
  },
  {
    id: 119,
    name: "ฝ่ามือสยบมังกร",
    level: "ม่วง",
    type: "Active",
    description: "ฝ่ามือที่ปะทะได้แม้แต่มังกร",
    effect: "[Physical] โจมตีเดี่ยว 300% ATK หากเป้าหมายเป็น Boss ดาเมจจะเพิ่มขึ้นอีก 50% (MP Cost: 150, CD: 4)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 120,
    name: "แส้ฟ้าคำรณ",
    level: "ม่วง",
    type: "Active",
    description: "ฟาดแส้เสียงดังสนั่นดั่งฟ้าผ่า",
    effect: "[Physical] โจมตีหมู่ 150% ATK มีโอกาส 40% ทำให้ศัตรูติดสถานะอัมพาต (ข้ามเทิร์น) 1 เทิร์น (MP Cost: 130, CD: 4)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 121,
    name: "สัมผัสที่หก",
    level: "ม่วง",
    type: "Passive",
    description: "หยั่งรู้การโจมตีก่อนล่วงหน้า",
    effect: "เพิ่ม DODGE +10% และ ACCURACY +20%",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 122,
    name: "โลหิตเดือดพล่าน",
    level: "ม่วง",
    type: "Passive",
    description: "เปลี่ยนความเจ็บปวดเป็นพลังโจมตีวิกฤต",
    effect: "ทุกครั้งที่ HP ลดลง 10% จะเพิ่ม CRIT +2% (รวมสูงสุด 15%) และ CRIT_DAMAGE +15%",
    condition: "Black Market Event"
  },
  {
    id: 123,
    name: "พิษผลาญกระดูก",
    level: "ม่วง",
    type: "Passive",
    description: "พิษร้ายแรงกัดกร่อนเกราะศัตรู",
    effect: "ศัตรูที่ติดสถานะ [Poison] จากคุณ จะถูกลด DEF ลง 30% ระหว่างที่ติดพิษ",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 124,
    name: "ดวงตาราชันย์",
    level: "ม่วง",
    type: "Passive",
    description: "มองข้ามการป้องกันที่อ่อนแอ",
    effect: "เพิ่ม ARMOR_PEN +35% ตลอดเวลา",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 125,
    name: "จิตประสานผู้ติดตาม",
    level: "ม่วง",
    type: "Passive",
    description: "ผนึกกำลังกับผู้ติดตาม",
    effect: "เพิ่ม ATK ของตนเอง 10% ต่อจำนวน Follower ที่มีชีวิตอยู่ในทีม (สูงสุด 30%)",
    condition: "Black Market Event"
  },
  {
    id: 126,
    name: "ฝ่ามือเงาจันทร์",
    level: "ม่วง",
    type: "Active",
    description: "ลอบโจมตีในเงามืด",
    effect: "[Internal] โจมตีเดี่ยว 280% INT หากโจมตีจากสถานะที่มี AGI สูงกว่าศัตรู จะได้ Life Steal 20% ด้วย (MP Cost: 110, CD: 3)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 127,
    name: "กระบี่แสงอรุณ",
    level: "ม่วง",
    type: "Active",
    description: "แสงกระบี่สาดส่องรักษาพวกพ้อง",
    effect: "[Physical] โจมตีเดี่ยว 200% ATK และเปลี่ยน 50% ของดาเมจที่ทำได้ เป็น Heal กระจายให้ทีมทั้งหมด (MP Cost: 140, CD: 4)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 128,
    name: "พลองกวนสมุทร",
    level: "ม่วง",
    type: "Active",
    description: "ฟาดพลองสร้างคลื่นกระแทกขนาดใหญ่",
    effect: "[Physical] โจมตีหมู่ 170% ATK และผลักศัตรูทั้งหมดให้ Speed_Order ไปอยู่ท้ายสุดในเทิร์นถัดไป (MP Cost: 130, CD: 4)",
    condition: "Black Market Event"
  },
  {
    id: 129,
    name: "ผงสลายวิญญาณ",
    level: "ม่วง",
    type: "Active",
    description: "สาดผงพิษร้ายแรงทำลายปราณ",
    effect: "[Poison] โจมตีหมู่ 120% INT เผาผลาญ MP ของศัตรู 20% และทำให้ติดสถานะ \"ฟื้นฟูไม่ได้\" 2 เทิร์น (MP Cost: 150, CD: 5)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 130,
    name: "ลมปราณพยัคฆ์ขาว",
    level: "ม่วง",
    type: "Active",
    description: "กระตุ้นพลังก้าวร้าวในตัว",
    effect: "[Support] เพิ่ม ATK และ CRIT_DAMAGE 40% ให้ทีมทั้งหมด 3 เทิร์น (MP Cost: 160, CD: 6)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 131,
    name: "สละชีพเพื่อธรรม",
    level: "ม่วง",
    type: "Active",
    description: "ระเบิดพลังเฮือกสุดท้ายแลกชีวิต (ใช้ได้เมื่อ HP < 50%)",
    effect: "[Physical] ลด HP ตนเองเหลือ 1 โจมตีเดี่ยว 800% ATK (MP Cost: 0, CD: 99)",
    condition: "Black Market Event"
  },
  {
    id: 132,
    name: "กายาไม่เสื่อมสลาย",
    level: "ม่วง",
    type: "Passive",
    description: "ร่างกายมีระบบต่อต้านสิ่งผิดปกติ",
    effect: "ภูมิคุ้มกันสถานะ [Poison] และลดระยะเวลาของ Debuff ทุกชนิดลง 1 เทิร์นเสมอ (ขั้นต่ำ 1 เทิร์น)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 133,
    name: "โชคชะตาพลิกผัน",
    level: "ม่วง",
    type: "Passive",
    description: "เปลี่ยนเรื่องร้ายกลายเป็นดี",
    effect: "เมื่อถูกโจมตีถึงตาย จะรอดชีวิตโดยเหลือ HP 1 (ทำงาน 1 ครั้งต่อการต่อสู้)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 134,
    name: "ปราณมรณะ",
    level: "ม่วง",
    type: "Passive",
    description: "แฝงพลังสังหารในทุกการโจมตี",
    effect: "เพิ่ม KILL_CHANCE +3% (ห้ามเกิน Cap 8%) และดาเมจทั้งหมดแรงขึ้น 10%",
    condition: "Black Market Event"
  },
  {
    id: 135,
    name: "คัมภีร์เปลี่ยนเส้นเอ็น",
    level: "ทอง",
    type: "Passive",
    description: "วิทยายุทธ์สุดยอดแห่งเส้าหลิน เปลี่ยนโครงสร้างร่างกายใหม่",
    effect: "ทุก Base Stat (STR, CON, AGI, INT, LUCK) +30 และ Max HP +2000",
    condition: "Drop จาก Area Boss (Lv 50+)"
  },
  {
    id: 136,
    name: "ลมปราณเก้าตะวัน",
    level: "ทอง",
    type: "Passive",
    description: "ลมปราณหยางสุดขั้ว เผาผลาญความชั่วร้าย",
    effect: "สะท้อน Debuff ทั้งหมดกลับไปหาผู้ร่าย 100% และฟื้นฟู HP 10% ของ Max HP ทุกเทิร์น",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 137,
    name: "ดรรชนีหกชีพจร",
    level: "ทอง",
    type: "Active",
    description: "ยิงปราณออกจากนิ้วทั้งหก พลังเจาะทะลวงเหนือจินตนาการ",
    effect: "[Internal] โจมตีเป้าหมายแบบสุ่ม 6 ครั้ง ครั้งละ 100% INT เพิกเฉยต่อ DEF 100% (True Damage) (MP Cost: 250, CD: 5)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 138,
    name: "เพลงกระบี่เดียวดาย",
    level: "ทอง",
    type: "Active",
    description: "กระบี่ไร้กระบวนท่า มองทะลุทุกสิ่ง",
    effect: "[Physical] โจมตีเดี่ยว 400% ATK ไม่สามารถถูกหลบได้ ไม่สามารถถูกบล็อคได้ และจะ Critical เสมอ (MP Cost: 200, CD: 4)",
    condition: "Black Market Event"
  },
  {
    id: 139,
    name: "ค่ายกลดาวไถ",
    level: "ทอง",
    type: "Active",
    description: "อัญเชิญพลังแห่งดวงดาวกดทับศัตรู",
    effect: "[Support] ศัตรูทั้งหมดถูกลด Base Stats ทุกอย่างลง 50% เป็นเวลา 3 เทิร์น (MP Cost: 300, CD: 6)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 140,
    name: "เคล็ดวิชาเคลื่อนย้ายจักรวาล",
    level: "ทอง",
    type: "Active",
    description: "ยืมพลังศัตรูตีศัตรู",
    effect: "[Support] ดูดซับดาเมจทั้งหมดที่ได้รับใน 2 เทิร์นถัดไป และปลดปล่อยกลับเป็นดาเมจ [Internal] แบบหมู่ใส่ศัตรูในเทิร์นที่ 3 (MP Cost: 250, CD: 6)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 141,
    name: "ฝ่ามือสยบทศทิศ",
    level: "ทอง",
    type: "Active",
    description: "ฝ่ามือใหญ่ยักษ์กดทับลงมาจากฟ้า",
    effect: "[Physical] โจมตีหมู่ศัตรูทั้งหมด 300% ATK ศัตรูที่รอดชีวิตจะติด Stun 1 เทิร์นแน่นอน (MP Cost: 350, CD: 5)",
    condition: "Black Market Event"
  },
  {
    id: 142,
    name: "บัวหิมะเก้าใบ",
    level: "ทอง",
    type: "Active",
    description: "การแพทย์แห่งทวยเทพ",
    effect: "[Heal] ฟื้นฟู HP และ MP ให้ทีมทั้งหมด 100% (เต็มหลอด) พร้อมลบ Debuff ทุกชนิด (MP Cost: 400, CD: 8)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 143,
    name: "พิษสลายฟ้าดิน",
    level: "ทอง",
    type: "Active",
    description: "พิษที่ไร้ทางแก้ กัดกร่อนสรรพสิ่ง",
    effect: "[Poison] โจมตีหมู่ 200% INT ศัตรูติดพิษพิเศษลด HP 10% ของ Max HP ทุกเทิร์น เป็นเวลา 3 เทิร์น (พิษนี้ลบไม่ได้) (MP Cost: 280, CD: 6)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 144,
    name: "ดาบกลืนโลหิต",
    level: "ทอง",
    type: "Passive",
    description: "ดาบมารที่ต้องการเลือดเนื้ออยู่เสมอ",
    effect: "เพิ่ม LIFE_STEAL +20% และทุกครั้งที่ดูดเลือด Overheal (เกิน Max HP) ส่วนที่เกินจะกลายเป็นโล่ (Shield)",
    condition: "Black Market Event"
  },
  {
    id: 145,
    name: "จิตวิญญาณแห่งเซียน",
    level: "ทอง",
    type: "Passive",
    description: "บรรลุสัจธรรมแห่งยุทธภพ",
    effect: "สกิล Active ทุกชนิดมี Cooldown ลดลง 1 เทิร์น (ขั้นต่ำคือ 1) และลดการใช้ MP ลง 30%",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 146,
    name: "ก้าวไร้รอย",
    level: "ทอง",
    type: "Passive",
    description: "เคลื่อนไหวรวดเร็วจนไม่มีใครสัมผัสได้",
    effect: "เพิ่ม DODGE +15% และต้านทานดาเมจหมู่ (AoE Damage) 100%",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 147,
    name: "เทพพิทักษ์",
    level: "ทอง",
    type: "Passive",
    description: "พลังคุ้มครองจากสวรรค์",
    effect: "เมื่อ Follower ในทีมถูกโจมตีถึงตาย ตนเองจะรับดาเมจแทนโดยอัตโนมัติ (และลดดาเมจนั้นลง 50%)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 148,
    name: "พลังมารคลั่ง",
    level: "ทอง",
    type: "Passive",
    description: "เข้าสู่วิถีมาร แลกการป้องกันกับพลังทำลายมหาศาล",
    effect: "ลด DEF ตนเองลง 50% แต่เพิ่ม ATK, INT และ CRIT_DAMAGE +100%",
    condition: "Black Market Event"
  },
  {
    id: 149,
    name: "หอกมังกรผงาด",
    level: "ทอง",
    type: "Active",
    description: "พุ่งหอกเป็นรูปมังกรทองทะลุศัตรูทั้งสนาม",
    effect: "[Physical] โจมตีหมู่ 250% ATK หากมีศัตรูตายจากสกิลนี้ จะร่ายสกิลนี้ซ้ำอีกครั้งแบบฟรีๆ โดยไม่ใช้ MP หรือ CD (ร่ายซ้ำได้เรื่อยๆ ถ้ามีคนตาย) (MP Cost: 300, CD: 5)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 150,
    name: "มีดบินสังหารเทพ",
    level: "ทอง",
    type: "Active",
    description: "มีดบินที่ไม่เคยพลาดเป้า และไม่เคยมีใครรอด",
    effect: "[Physical] โจมตีเดี่ยว 500% ATK เพิ่ม KILL_CHANCE สำหรับสกิลนี้เป็น 20% (ข้อยกเว้นพิเศษ ไม่ทำงานกับ Boss) (MP Cost: 200, CD: 5)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 151,
    name: "สร้อยคำรามฟ้า",
    level: "ทอง",
    type: "Active",
    description: "ปล่อยคลื่นเสียงทำลายล้างขั้นสุดยอด",
    effect: "[Internal] โจมตีหมู่ 220% INT ทำลายโล่ (Shield) ทุกชนิดของศัตรูทิ้งก่อนคำนวณดาเมจ (MP Cost: 250, CD: 5)",
    condition: "Black Market Event"
  },
  {
    id: 152,
    name: "เพลงเตะเงาพายุ",
    level: "ทอง",
    type: "Active",
    description: "เตะรัวจนเกิดพายุหมุน",
    effect: "[Physical] โจมตีเดี่ยว 10 ครั้ง ครั้งละ 40% ATK (รวม 400%) แต่ละฮิตมีโอกาส 10% ขโมย (Steal) Buff ของศัตรูมาเป็นของตน (MP Cost: 220, CD: 4)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 153,
    name: "พลังปราณหมุนวน",
    level: "ทอง",
    type: "Passive",
    description: "ลมปราณหมุนเวียนไม่มีวันหมด",
    effect: "การโจมตีปกติ (Auto Attack) จะฟื้นฟู MP 5% เสมอ",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 154,
    name: "จิตราชันย์",
    level: "ทอง",
    type: "Passive",
    description: "บารมีผู้นำสูงสุด",
    effect: "เพิ่มสเตตัสทุกอย่างของ Followers 30%",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 155,
    name: "สกัดจุดวิญญาณ",
    level: "ทอง",
    type: "Active",
    description: "จิ้มสกัดจุดที่ทำให้ศัตรูสูญเสียพลังทั้งหมด",
    effect: "[Internal] โจมตีเดี่ยว 200% INT ลด MP ศัตรูจนเหลือ 0 ทันที (MP Cost: 180, CD: 6)",
    condition: "Black Market Event"
  },
  {
    id: 156,
    name: "ฝ่ามือยูไล",
    level: "ทอง",
    type: "Active",
    description: "ฝ่ามือศักดิ์สิทธิ์ขนาดมหึมา",
    effect: "[Internal] โจมตีหมู่ 400% INT ดาเมจจะหารเฉลี่ยตามจำนวนศัตรูที่เหลืออยู่ (ถ้ายิ่งเหลือน้อย ยิ่งโดนแรง) (MP Cost: 300, CD: 5)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 157,
    name: "โลหิตเซียน",
    level: "ทอง",
    type: "Passive",
    description: "เลือดบริสุทธิ์เหนือมนุษย์",
    effect: "ทุกครั้งที่โดนโจมตี จะฟื้นฟู HP ตัวเอง 5% ของ Max HP ทันที",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 158,
    name: "กระบี่ผ่ามิติ",
    level: "ทอง",
    type: "Active",
    description: "ฟันทะลุมิติ ตัดผ่านทุกการป้องกัน",
    effect: "[Physical] โจมตีเดี่ยว 350% ATK เป็น True Damage และลด Max HP ศัตรูลง 10% ถาวรในการต่อสู้นั้น (MP Cost: 250, CD: 6)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 159,
    name: "ดวงตาแห่งความจริง",
    level: "ทอง",
    type: "Passive",
    description: "มองเห็นทุกสรรพสิ่งตามความเป็นจริง",
    effect: "ACCURACY เป็น 110% เสมอ และหลบหลีกการโจมตีที่เป็นสถานะผิดปกติ 100%",
    condition: "Black Market Event"
  },
  {
    id: 160,
    name: "พลองค้ำฟ้า",
    level: "ทอง",
    type: "Active",
    description: "ขยายพลองให้ใหญ่ยักษ์ฟาดลงมา",
    effect: "[Physical] โจมตีหมู่ 280% ATK มีโอกาส 50% ทำให้ศัตรูติด Stun 1 เทิร์น (MP Cost: 280, CD: 5)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 161,
    name: "สุราดับทุกข์",
    level: "ทอง",
    type: "Active",
    description: "ดื่มสุราวิเศษเพื่อลืมความเจ็บปวด",
    effect: "[Support] ฟื้นฟู HP ตัวเอง 100% ลบ Debuff ทั้งหมด และเพิ่ม AGI 50% 3 เทิร์น (MP Cost: 200, CD: 6)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 162,
    name: "พิษบุปผาดับสูญ",
    level: "ทอง",
    type: "Active",
    description: "ปลูกดอกไม้พิษในร่างศัตรู",
    effect: "[Poison] โจมตีเดี่ยว 100% INT ศัตรูติดพิษสะสม หากศัตรูใช้ Active Skill จะโดนดาเมจ 50% ของ Max HP ตัวมันเอง (MP Cost: 300, CD: 6)",
    condition: "Black Market Event"
  },
  {
    id: 163,
    name: "ดาบกลืนวิญญาณ",
    level: "ทอง",
    type: "Active",
    description: "ดาบที่ดึงวิญญาณศัตรูมาเป็นพลัง",
    effect: "[Physical] โจมตีเดี่ยว 300% ATK ฟื้นฟู MP ให้ตัวเองเท่ากับดาเมจที่ทำได้ (MANA_STEAL 100%) (MP Cost: 100, CD: 4)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 164,
    name: "ลมปราณเต่าดำ",
    level: "ทอง",
    type: "Passive",
    description: "การป้องกันระดับสูงสุดแห่งสี่สัตว์เทพ",
    effect: "เพิ่ม DEF +100% แต่ลด AGI ลง 20%",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 165,
    name: "จิตสัมผัสฟ้าดิน",
    level: "ทอง",
    type: "Passive",
    description: "ควบคุมพลังธรรมชาติมาหนุนเสริม",
    effect: "เมื่อเริ่มต่อสู้ จะได้รับโล่ (Shield) เท่ากับ 100% ของ Max MP ตัวเอง",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 166,
    name: "กระบี่ทะลวงสวรรค์",
    level: "ทอง",
    type: "Active",
    description: "รวบรวมพลังทั้งหมดแทงกระบี่เดียว",
    effect: "[Physical] โจมตีเดี่ยว 600% ATK หากศัตรูไม่ตาย ตนเองจะติดสถานะ Stun 1 เทิร์น (MP Cost: 400, CD: 7)",
    condition: "Black Market Event"
  },
  {
    id: 167,
    name: "ฝ่ามือคืนสวรรค์",
    level: "ทอง",
    type: "Active",
    description: "ส่งพลังชีวิตคืนสู่ธรรมชาติ",
    effect: "[Support] เสียสละ HP ตัวเอง 50% เพื่อชุบชีวิต Followers ทุกคนที่ตายให้ฟื้นขึ้นมา HP เต็ม และบัฟล้างสถานะทั้งหมด (MP Cost: 300, CD: 8)",
    condition: "Drop จาก Area Boss"
  },
  {
    id: 168,
    name: "คัมภีร์เทพสยบฟ้า",
    level: "แดง",
    type: "Passive",
    description: "คัมภีร์ลับสุดยอดที่รวมหลักการของทุกวิชาในใต้หล้า",
    effect: "หาก HP < 30% จะเข้าสู่โหมด \"เทพสยบฟ้า\" (เพิ่ม Base Stats ทุกตัว x2, ต้านทาน Debuff ทุกชนิด, และดูดเลือด 30%) จนกว่าจบการต่อสู้",
    condition: "Drop จาก Final Boss (Lv 90)"
  },
  {
    id: 169,
    name: "กระบี่หักมิติเวลา",
    level: "แดง",
    type: "Active",
    description: "เพลงกระบี่ที่ฟันทะลุเวลา หยุดยั้งทุกสรรพสิ่ง",
    effect: "[Physical] โจมตีหมู่ 400% ATK และหยุดเวลา (ศัตรูทั้งหมดเสียเทิร์น 2 เทิร์นเต็ม โดยไม่สามารถหลบหรือป้องกันได้) (MP Cost: 800, CD: 10)",
    condition: "Drop จาก Final Boss"
  },
  {
    id: 170,
    name: "ลมปราณวัฏสงสาร",
    level: "แดง",
    type: "Passive",
    description: "ผู้ฝึกวิชานี้อยู่นอกเหนือความตาย",
    effect: "เมื่อตาย จะฟื้นคืนชีพทันทีพร้อม HP 100%, MP 100% และสะท้อนความเสียหาย 1000% ของดาเมจที่ทำให้ตาย กลับไปหาผู้โจมตี (ทำงาน 1 ครั้งต่อสัปดาห์ / Daily Reset)",
    condition: "Drop จาก Final Boss"
  },
  {
    id: 171,
    name: "ดรรชนีดับดารา",
    level: "แดง",
    type: "Active",
    description: "รวมพลังดวงดาวไว้ที่ปลายนิ้ว ทำลายเป้าหมายจากระดับวิญญาณ",
    effect: "[Internal] โจมตีเดี่ยว 800% INT ขจัด Buff, Shield, และความเป็นอมตะทุกชนิดของศัตรูก่อนทำดาเมจ หากเป้าหมายตาย จะระเบิดทำดาเมจครึ่งหนึ่งใส่ศัตรูที่เหลือ (MP Cost: 500, CD: 6)",
    condition: "Drop จาก Area Boss (Lv 80+)"
  },
  {
    id: 172,
    name: "พิษหมื่นกลืนภพ",
    level: "แดง",
    type: "Active",
    description: "หมอกพิษที่กลืนกินแม้แต่ปราณของเซียน",
    effect: "[Poison] โจมตีหมู่ 300% INT เปลี่ยน HP สูงสุด (Max HP) ของศัตรูทั้งหมดลดลง 20% ทุกเทิร์น เป็นเวลา 3 เทิร์น (ผลรวมลด 60%) (MP Cost: 600, CD: 7)",
    condition: "Drop จาก Area Boss (Lv 80+)"
  },
  {
    id: 173,
    name: "ฝ่ามือมหาสุญญตา",
    level: "แดง",
    type: "Active",
    description: "ฝ่ามือแห่งความว่างเปล่า เปลี่ยนทุกสิ่งให้เป็นศูนย์",
    effect: "[Internal] โจมตีหมู่ 500% INT รีเซ็ต Cooldown สกิลทั้งหมดของศัตรูให้กลับไปเป็นค่าสูงสุด และลด MP ศัตรูเหลือ 0 (MP Cost: 750, CD: 8)",
    condition: "Drop จาก Final Boss"
  },
  {
    id: 174,
    name: "ดาบราชันย์พิชิตหล้า",
    level: "แดง",
    type: "Passive",
    description: "รังสีของราชันย์ผู้พิชิต ทำให้ผู้ด้อยกว่ายอมจำนน",
    effect: "เมื่อเริ่มต่อสู้ ศัตรูทุกตัวที่มี Level น้อยกว่าตนเอง จะตายทันที 100% (Instant Kill ข้ามกฎ KILL_CHANCE แต่ไม่ทำงานกับ Boss)",
    condition: "Drop จาก Final Boss"
  },
  {
    id: 175,
    name: "จิตแห่งเต๋า",
    level: "แดง",
    type: "Passive",
    description: "กลมกลืนกับธรรมชาติ ไร้ตัวตน ไร้รูปร่าง",
    effect: "เพิ่ม DODGE +15% และตราบใดที่ HP > 50% ดาเมจทุกชนิดที่ได้รับจะถูกลดทอนลง 80% ทันที",
    condition: "Drop จาก Area Boss (Lv 80+)"
  },
  {
    id: 176,
    name: "ค่ายกลค่ายฟ้าล่ม",
    level: "แดง",
    type: "Active",
    description: "ดึงฟ้าลงมาทับดิน ค่ายกลที่ไม่มีใครรอดไปได้",
    effect: "[Support] พื้นที่ต่อสู้จะทำดาเมจ 10% ของ Max HP แก่ศัตรูทุกคนทุกเทิร์น (เพิกเฉยต่อ DEF/Shield) และห้ามศัตรูใช้สกิลฟื้นฟู HP อย่างเด็ดขาด (MP Cost: 800, CD: 10)",
    condition: "Drop จาก Final Boss"
  },
  {
    id: 177,
    name: "เนตรสวรรค์เบิกมรรค",
    level: "แดง",
    type: "Active",
    description: "เปิดดวงตาที่สาม มองเห็นอนาคตและการเคลี่อนไหวทั้งหมด",
    effect: "[Support] ตนเองและ Followers ทั้งหมดได้รับ ACCURACY 200%, CRIT 100% และ ARMOR_PEN 100% เป็นเวลา 3 เทิร์น (MP Cost: 500, CD: 7)",
    condition: "Drop จาก Area Boss (Lv 80+)"
  },
  {
    id: 178,
    name: "พลองตลบสวรรค์",
    level: "แดง",
    type: "Active",
    description: "พลองที่สั่นคลอนสวรรค์ ฟาดครั้งเดียวสะเทือนเก้าชั้นฟ้า",
    effect: "[Physical] โจมตีหมู่ 600% ATK ศัตรูทั้งหมดถูกสุ่มนำไปไว้ตำแหน่ง Speed_Order ท้ายสุด 3 เทิร์นซ้อน และติด Stun 1 เทิร์น (MP Cost: 600, CD: 6)",
    condition: "Drop จาก Final Boss"
  },
  {
    id: 179,
    name: "กายาศักดิ์สิทธิ์",
    level: "แดง",
    type: "Passive",
    description: "ร่างกายวิวัฒนาการถึงจุดสูงสุดแห่งเซียน",
    effect: "ทุกเทิร์นที่ผ่านไป เพิ่ม Max HP, ATK, DEF ของตนเองขึ้น 10% (สะสมไปเรื่อยๆ จนจบการต่อสู้ ไม่มีขีดจำกัด)",
    condition: "Drop จาก Area Boss (Lv 80+)"
  },
  {
    id: 180,
    name: "เพลงกระบี่หมื่นกระบี่รวมใจ",
    level: "แดง",
    type: "Active",
    description: "เรียกกระบี่หมื่นเล่มพุ่งทะลวงเป้าหมายเดียว",
    effect: "[Physical] โจมตีเดี่ยว 15 ครั้ง ครั้งละ 100% ATK (รวม 1500%) หากศัตรูมีดาเมจลดทอน (Damage Reduction) สกิลนี้จะทะลุการลดทอนนั้น 100% (MP Cost: 900, CD: 8)",
    condition: "Drop จาก Final Boss"
  },
  {
    id: 181,
    name: "ลมปราณหลอมรวมโลก",
    level: "แดง",
    type: "Active",
    description: "ดูดซับพลังของพรรคพวกและศัตรูมาเป็นของตน",
    effect: "[Internal] ดูด HP และ MP 20% จากทุกคนในสนาม (ยกเว้นตนเอง) มาเพิ่มให้ตัวเอง และบัฟพลังโจมตีตนเอง 50% เป็นเวลา 5 เทิร์น (MP Cost: 400, CD: 6)",
    condition: "Drop จาก Area Boss (Lv 80+)"
  },
  {
    id: 182,
    name: "แส้พันธนาการเทพ",
    level: "แดง",
    type: "Active",
    description: "แส้ที่รัดแม้แต่เทพเจ้าก็ดิ้นไม่หลุด",
    effect: "[Physical] โจมตีเดี่ยว 400% ATK ขโมย Buff ทั้งหมดของเป้าหมายมาเป็นของตน และขังเป้าหมายไม่ให้ทำ Action ใดๆ 2 เทิร์น (ไม่สามารถล้างสถานะนี้ได้) (MP Cost: 550, CD: 7)",
    condition: "Drop จาก Final Boss"
  },
  {
    id: 183,
    name: "จิตแห่งมารฟ้า",
    level: "แดง",
    type: "Passive",
    description: "จิตใจที่หลอมรวมกับความมืดมิด",
    effect: "เมื่อตนเองทำการฆ่า (Kill) ศัตรูสำเร็จ จะรีเซ็ต Cooldown ของสกิล Active ทั้งหมดเป็น 0 ทันที และได้ Action โจมตีเพิ่มอีก 1 ครั้ง",
    condition: "Drop จาก Final Boss"
  },
  {
    id: 184,
    name: "คัมภีร์หมอเทวดาโอสถสวรรค์",
    level: "แดง",
    type: "Passive",
    description: "วิชาแพทย์ที่ฝืนลิขิตสวรรค์",
    effect: "สกิล [Heal] ทั้งหมดจะแสดงผล x3 และเมื่อชุบชีวิต หรือฮีลจนเต็ม จะมอบโล่อมตะ (Immune) 1 ฮิต ให้กับเป้าหมายเสมอ",
    condition: "Drop จาก Area Boss (Lv 80+)"
  },
  {
    id: 185,
    name: "ดาบผ่าพิภพ",
    level: "แดง",
    type: "Active",
    description: "ตวัดดาบที่ตัดแบ่งโลกออกเป็นสองซีก",
    effect: "[Physical] โจมตีหมู่ 700% ATK เพิกเฉยต่อ DEF และโล่ทั้งหมด ศัตรูที่รอดจะโดนสถานะ \"บาดแผลลึก\" (โดนดาเมจเพิ่มขึ้น 50% จากทุกแหล่ง) 3 เทิร์น (MP Cost: 800, CD: 8)",
    condition: "Drop จาก Final Boss"
  },
  {
    id: 186,
    name: "มนตราบงการวิญญาณ",
    level: "แดง",
    type: "Active",
    description: "แทรกแซงจิตวิญญาณ ควบคุมศัตรู",
    effect: "[Internal] บังคับให้ศัตรู 1 ตัว (รวมถึง Boss บางประเภท) โจมตีฝ่ายเดียวกันเองด้วยสกิลที่แรงที่สุดของมันในเทิร์นถัดไป (MP Cost: 700, CD: 7)",
    condition: "Drop จาก Area Boss (Lv 80+)"
  },
  {
    id: 187,
    name: "ฝ่ามือบรรพกาล",
    level: "แดง",
    type: "Active",
    description: "ฝ่ามือของเทพผู้สร้างโลก",
    effect: "[Internal] โจมตีเดี่ยว 1000% INT หากเป้าหมายคือ Area Boss จะลด HP ลงทันที 20% ของ Max HP (MP Cost: 999, CD: 10)",
    condition: "Drop จาก Final Boss"
  },
  {
    id: 188,
    name: "พลังกายเหนืออนันต์",
    level: "แดง",
    type: "Passive",
    description: "ร่างกายที่ไม่มีข้อจำกัดใดๆ",
    effect: "ปลดล็อค Stat Cap ชั่วคราวในการต่อสู้ เพิ่มเพดาน CRIT, DODGE, ARMOR_PEN เป็น 100% ตลอดเวลาที่ใส่สกิลนี้",
    condition: "Drop จาก Final Boss"
  },
  {
    id: 189,
    name: "หอกสะท้านภพ",
    level: "แดง",
    type: "Active",
    description: "หอกที่เจาะทะลวงถึงแกนกลางดวงดาว",
    effect: "[Physical] โจมตีเดี่ยว 800% ATK เปลี่ยนดาเมจที่ทำได้ 100% เป็นเกราะโล่ (Shield) ให้กับทั้งทีม (MP Cost: 650, CD: 6)",
    condition: "Drop จาก Area Boss (Lv 80+)"
  },
  {
    id: 190,
    name: "มีดบินทะลุมิติ",
    level: "แดง",
    type: "Active",
    description: "มีดบินที่ปรากฏขึ้นที่จุดตายของศัตรูทันที",
    effect: "[Physical] โจมตีหมู่ 500% ATK เป็นการโจมตีก่อนเสมอ (First Strike เหนือกว่า AGI ทุกอย่าง) และทำให้ศัตรูติดสถานะตาบอด (ACCURACY = 0%) 2 เทิร์น (MP Cost: 750, CD: 7)",
    condition: "Drop จาก Final Boss"
  },
  {
    id: 191,
    name: "สุราเซียนหมื่นปี",
    level: "แดง",
    type: "Active",
    description: "ดื่มสุราที่บ่มมาหมื่นปี พลังปราณพลุ่งพล่านทะลุขีดจำกัด",
    effect: "[Support] ฟื้น MP 100% ให้ทั้งทีม และทำให้สกิล Active ถัดไปของทุกคน ไม่มี Cooldown และไม่เสีย MP (MP Cost: 0, CD: 9)",
    condition: "Drop จาก Final Boss"
  },
  {
    id: 192,
    name: "พิษสลายจักรวาล",
    level: "แดง",
    type: "Passive",
    description: "พิษที่เปลี่ยนพื้นที่ทั้งหมดเป็นแดนมรณะ",
    effect: "ทุกครั้งที่ศัตรูติดสถานะ [Poison] ดาเมจพิษจะกระจายไปหาศัตรูตัวอื่นแบบทวีคูณ (x2 ทุกครั้งที่กระจาย) และทำให้พิษเพิกเฉยต่อความต้านทานทุกชนิด",
    condition: "Drop จาก Area Boss (Lv 80+)"
  },
  {
    id: 193,
    name: "เงาอสูรจำแลง",
    level: "แดง",
    type: "Active",
    description: "แยกร่างเงาอสูรออกมาช่วยสู้",
    effect: "[Support] สร้างร่างโคลนของตนเอง 1 ร่าง (มี Stat 80% ของตัวจริง) มาช่วยสู้เป็นระยะเวลา 3 เทิร์น (ร่างโคลนใช้ Auto Attack เท่านั้น) (MP Cost: 800, CD: 8)",
    condition: "Drop จาก Final Boss"
  },
  {
    id: 194,
    name: "เพลงเตะทลายสวรรค์",
    level: "แดง",
    type: "Active",
    description: "เตะเสยศัตรูลอยขึ้นฟ้าและอัดกระแทกลงมา",
    effect: "[Physical] โจมตีเดี่ยว 700% ATK ถอดอุปกรณ์ (Equipment) ของศัตรูที่เป็นมนุษย์ (ทำให้สเตตัสจากไอเทมหายไปชั่วคราว 2 เทิร์น) (MP Cost: 600, CD: 6)",
    condition: "Drop จาก Area Boss (Lv 80+)"
  },
  {
    id: 195,
    name: "จิตสยบสรรพสิ่ง",
    level: "แดง",
    type: "Passive",
    description: "บารมีระดับมหาเทพยุทธ์",
    effect: "ลดค่าสเตตัสทุกอย่างของศัตรูทั้งหมด 20% ทันทีที่เข้าสู่ฉากต่อสู้ และป้องกันไม่ให้ศัตรูบัฟตัวเองได้เลย",
    condition: "Drop จาก Final Boss"
  },
  {
    id: 196,
    name: "ลมปราณกำเนิดใหม่",
    level: "แดง",
    type: "Passive",
    description: "ร่างกายสามารถสร้างอวัยวะใหม่ได้ในพริบตา",
    effect: "เปลี่ยน 50% ของดาเมจทุกอย่างที่ได้รับ ให้กลายเป็นการฟื้นฟู (Heal) HP ทันที",
    condition: "Drop จาก Area Boss (Lv 80+)"
  },
  {
    id: 197,
    name: "ขลุ่ยเรียกวิญญาณเทพ",
    level: "แดง",
    type: "Active",
    description: "บรรเลงเพลงเรียกวิญญาณเทพเจ้ามาปัดเป่าภัยทุพภิกขภัย",
    effect: "[Internal] โจมตีหมู่ 450% INT เปลี่ยนศัตรูที่ตายจากสกิลนี้ให้กลายเป็น Follower ชั่วคราว (สเตตัส 50%) ช่วยสู้จนจบเทิร์นนั้น (MP Cost: 850, CD: 7)",
    condition: "Drop จาก Final Boss"
  },
  {
    id: 198,
    name: "กระบี่เหนือสัจธรรม",
    level: "แดง",
    type: "Active",
    description: "กระบี่ที่ฟันกติกาของโลกทิ้งไป",
    effect: "[Physical] โจมตีเดี่ยว 900% ATK ไม่สนเงื่อนไขอมตะ ไม่สนโล่ ไม่สนหลบหลีก และล็อคให้ศัตรูตัวนั้นไม่สามารถใช้สกิลระดับ ทอง หรือ แดง ได้ 3 เทิร์น (MP Cost: 1000, CD: 10)",
    condition: "Drop จาก Final Boss"
  },
  {
    id: 199,
    name: "โลหิตเทพมังกร",
    level: "แดง",
    type: "Passive",
    description: "สายเลือดมังกรแท้จริงไหลเวียน",
    effect: "ทุกเทิร์น ปลดปล่อยคลื่นกระแทกทำดาเมจ 50% ของ Max HP ตนเอง ใส่ศัตรูทั้งหมดแบบ True Damage โดยไม่ต้องใช้ Action Point",
    condition: "Drop จาก Final Boss"
  },
  {
    id: 200,
    name: "วิถีเซียนไร้ขอบเขต",
    level: "แดง",
    type: "Active",
    description: "ก้าวข้ามความเป็นมนุษย์ หลอมรวมกับเอกภพ",
    effect: "[Support] บัพให้ตนเองและ Followers ให้อยู่ในสถานะ \"เซียน\" (สเตตัสทั้งหมด x3, สกิล Active ทุกสกิล CD เหลือ 1, และดูดเลือด 50%) เป็นเวลา 3 เทิร์น เมื่อหมดเวลา HP จะเหลือ 1 (MP Cost: 1500, CD: 15)",
    condition: "รางวัลพิเศษจากการพิชิต Final Boss เคลียร์เกม"
  }
];