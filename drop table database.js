export const DropTable = [
  {
    id: "forest_t1_normal",
    enemyType: "Normal",
    goldMin: 3,
    goldMax: 12,
    equipmentDropChance: 20,
    rarityWeights: {
      white: 50,
      green: 30,
      blue: 15,
      purple: 4,
      gold: 1,
      red: 0
    },
    materialDrops: [
      { name: "หนังสัตว์", chance: 25 },
      { name: "เขี้ยวสัตว์", chance: 20 },
      { name: "กิ่งไม้", chance: 30 },
      { name: "สมุนไพรป่า", chance: 15 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูเล็กน้อย", chance: 10 }
    ]
  },
  {
    id: "forest_t1_elite",
    enemyType: "Elite",
    goldMin: 15,
    goldMax: 30,
    equipmentDropChance: 60,
    rarityWeights: {
      white: 10,
      green: 30,
      blue: 35,
      purple: 20,
      gold: 5,
      red: 0
    },
    materialDrops: [
      { name: "หนังสัตว์", chance: 50 },
      { name: "เขี้ยวสัตว์", chance: 40 },
      { name: "กิ่งไม้วิเศษ", chance: 20 },
      { name: "สมุนไพรหายาก", chance: 15 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูเล็กน้อย", chance: 20 },
      { name: "ยาพลังภายในเล็กน้อย", chance: 10 }
    ]
  },
  {
    id: "forest_t2_normal",
    enemyType: "Normal",
    goldMin: 20,
    goldMax: 50,
    equipmentDropChance: 22,
    rarityWeights: {
      white: 30,
      green: 35,
      blue: 25,
      purple: 8,
      gold: 2,
      red: 0
    },
    materialDrops: [
      { name: "หนังสัตว์", chance: 30 },
      { name: "เขี้ยวสัตว์", chance: 25 },
      { name: "ไม้หอม", chance: 20 },
      { name: "สมุนไพรป่า", chance: 20 },
      { name: "ขนนก", chance: 15 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดกลาง", chance: 15 },
      { name: "ยาพลังภายในขนาดกลาง", chance: 10 }
    ]
  },
  {
    id: "forest_t2_elite",
    enemyType: "Elite",
    goldMin: 50,
    goldMax: 120,
    equipmentDropChance: 65,
    rarityWeights: {
      white: 5,
      green: 20,
      blue: 35,
      purple: 30,
      gold: 10,
      red: 0
    },
    materialDrops: [
      { name: "หนังสัตว์", chance: 50 },
      { name: "เขี้ยวสัตว์", chance: 40 },
      { name: "ไม้หอมวิเศษ", chance: 25 },
      { name: "สมุนไพรหายาก", chance: 20 },
      { name: "ขนนกเงือก", chance: 15 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดกลาง", chance: 25 },
      { name: "ยาพลังภายในขนาดกลาง", chance: 15 },
      { name: "ยาเร่งพลัง", chance: 5 }
    ]
  },
  {
    id: "forest_t3_normal",
    enemyType: "Normal",
    goldMin: 80,
    goldMax: 180,
    equipmentDropChance: 20,
    rarityWeights: {
      white: 10,
      green: 25,
      blue: 35,
      purple: 20,
      gold: 8,
      red: 2
    },
    materialDrops: [
      { name: "หนังสัตว์", chance: 35 },
      { name: "เขี้ยวสัตว์", chance: 30 },
      { name: "ไม้ทนทาน", chance: 25 },
      { name: "สมุนไพรชั้นสูง", chance: 20 },
      { name: "เกล็ดสัตว์", chance: 15 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดกลาง", chance: 20 },
      { name: "ยาพลังภายในขนาดกลาง", chance: 15 },
      { name: "ยาแก้พิษ", chance: 10 }
    ]
  },
  {
    id: "forest_t3_elite",
    enemyType: "Elite",
    goldMin: 150,
    goldMax: 350,
    equipmentDropChance: 60,
    rarityWeights: {
      white: 0,
      green: 10,
      blue: 30,
      purple: 40,
      gold: 15,
      red: 5
    },
    materialDrops: [
      { name: "หนังสัตว์", chance: 50 },
      { name: "เขี้ยวสัตว์", chance: 40 },
      { name: "ไม้ทนทานวิเศษ", chance: 30 },
      { name: "สมุนไพรชั้นสูง", chance: 25 },
      { name: "เกล็ดมังกร", chance: 5 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดใหญ่", chance: 20 },
      { name: "ยาพลังภายในขนาดใหญ่", chance: 15 },
      { name: "ยาเร่งพลัง", chance: 10 },
      { name: "ยาอมตะชั่วคราว", chance: 3 }
    ]
  },
  {
    id: "mountain_t1_normal",
    enemyType: "Normal",
    goldMin: 4,
    goldMax: 14,
    equipmentDropChance: 20,
    rarityWeights: {
      white: 50,
      green: 30,
      blue: 15,
      purple: 4,
      gold: 1,
      red: 0
    },
    materialDrops: [
      { name: "แร่เหล็ก", chance: 25 },
      { name: "หินก้อน", chance: 30 },
      { name: "ขนนกอินทรี", chance: 15 },
      { name: "หนังสัตว์", chance: 20 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูเล็กน้อย", chance: 10 }
    ]
  },
  {
    id: "mountain_t1_elite",
    enemyType: "Elite",
    goldMin: 18,
    goldMax: 35,
    equipmentDropChance: 60,
    rarityWeights: {
      white: 10,
      green: 30,
      blue: 35,
      purple: 20,
      gold: 5,
      red: 0
    },
    materialDrops: [
      { name: "แร่เหล็ก", chance: 50 },
      { name: "หินก้อน", chance: 40 },
      { name: "ขนนกอินทรี", chance: 25 },
      { name: "หนังสัตว์", chance: 30 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูเล็กน้อย", chance: 20 },
      { name: "ยาพลังภายในเล็กน้อย", chance: 10 }
    ]
  },
  {
    id: "mountain_t2_normal",
    enemyType: "Normal",
    goldMin: 25,
    goldMax: 60,
    equipmentDropChance: 22,
    rarityWeights: {
      white: 30,
      green: 35,
      blue: 25,
      purple: 8,
      gold: 2,
      red: 0
    },
    materialDrops: [
      { name: "แร่เหล็ก", chance: 30 },
      { name: "หินก้อน", chance: 25 },
      { name: "แร่เงิน", chance: 20 },
      { name: "หนังสัตว์", chance: 20 },
      { name: "ขนนกยักษ์", chance: 15 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดกลาง", chance: 15 },
      { name: "ยาพลังภายในขนาดกลาง", chance: 10 }
    ]
  },
  {
    id: "mountain_t2_elite",
    enemyType: "Elite",
    goldMin: 60,
    goldMax: 150,
    equipmentDropChance: 65,
    rarityWeights: {
      white: 5,
      green: 20,
      blue: 35,
      purple: 30,
      gold: 10,
      red: 0
    },
    materialDrops: [
      { name: "แร่เหล็ก", chance: 50 },
      { name: "หินก้อน", chance: 40 },
      { name: "แร่เงิน", chance: 30 },
      { name: "หนังสัตว์", chance: 35 },
      { name: "ขนนกอินทรีทอง", chance: 10 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดกลาง", chance: 25 },
      { name: "ยาพลังภายในขนาดกลาง", chance: 15 },
      { name: "ยาเพิ่มพลังโจมตี", chance: 5 }
    ]
  },
  {
    id: "desert_t1_normal",
    enemyType: "Normal",
    goldMin: 3,
    goldMax: 12,
    equipmentDropChance: 20,
    rarityWeights: {
      white: 50,
      green: 30,
      blue: 15,
      purple: 4,
      gold: 1,
      red: 0
    },
    materialDrops: [
      { name: "หนังอูฐ", chance: 20 },
      { name: "เขี้ยวแมงป่อง", chance: 15 },
      { name: "ทรายวิเศษ", chance: 25 },
      { name: "กระดูกสัตว์", chance: 20 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูเล็กน้อย", chance: 10 },
      { name: "น้ำดื่ม", chance: 15 }
    ]
  },
  {
    id: "desert_t1_elite",
    enemyType: "Elite",
    goldMin: 15,
    goldMax: 30,
    equipmentDropChance: 60,
    rarityWeights: {
      white: 10,
      green: 30,
      blue: 35,
      purple: 20,
      gold: 5,
      red: 0
    },
    materialDrops: [
      { name: "หนังอูฐ", chance: 40 },
      { name: "เขี้ยวแมงป่อง", chance: 30 },
      { name: "ทรายวิเศษ", chance: 35 },
      { name: "กระดูกสัตว์", chance: 30 },
      { name: "แร่ทะเลทราย", chance: 10 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูเล็กน้อย", chance: 20 },
      { name: "ยาพลังภายในเล็กน้อย", chance: 10 }
    ]
  },
  {
    id: "desert_t2_normal",
    enemyType: "Normal",
    goldMin: 20,
    goldMax: 50,
    equipmentDropChance: 22,
    rarityWeights: {
      white: 30,
      green: 35,
      blue: 25,
      purple: 8,
      gold: 2,
      red: 0
    },
    materialDrops: [
      { name: "หนังอูฐ", chance: 25 },
      { name: "เขี้ยวแมงป่อง", chance: 20 },
      { name: "ทรายวิเศษ", chance: 30 },
      { name: "แร่ทองแดง", chance: 20 },
      { name: "ไข่มุกทะเลทราย", chance: 5 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดกลาง", chance: 15 },
      { name: "ยาพลังภายในขนาดกลาง", chance: 10 }
    ]
  },
  {
    id: "swamp_t1_normal",
    enemyType: "Normal",
    goldMin: 4,
    goldMax: 13,
    equipmentDropChance: 20,
    rarityWeights: {
      white: 50,
      green: 30,
      blue: 15,
      purple: 4,
      gold: 1,
      red: 0
    },
    materialDrops: [
      { name: "หนังกบ", chance: 20 },
      { name: "ต่อมพิษ", chance: 25 },
      { name: "สาหร่ายพิษ", chance: 20 },
      { name: "ไม้ผุ", chance: 15 }
    ],
    consumables: [
      { name: "ยาแก้พิษ", chance: 10 },
      { name: "ยาฟื้นฟูเล็กน้อย", chance: 10 }
    ]
  },
  {
    id: "swamp_t1_elite",
    enemyType: "Elite",
    goldMin: 18,
    goldMax: 35,
    equipmentDropChance: 60,
    rarityWeights: {
      white: 10,
      green: 30,
      blue: 35,
      purple: 20,
      gold: 5,
      red: 0
    },
    materialDrops: [
      { name: "หนังกบ", chance: 40 },
      { name: "ต่อมพิษ", chance: 35 },
      { name: "สาหร่ายพิษ", chance: 30 },
      { name: "ไม้ผุ", chance: 25 },
      { name: "คริสตัลพิษ", chance: 10 }
    ],
    consumables: [
      { name: "ยาแก้พิษ", chance: 20 },
      { name: "ยาฟื้นฟูเล็กน้อย", chance: 20 }
    ]
  },
  {
    id: "swamp_t2_normal",
    enemyType: "Normal",
    goldMin: 25,
    goldMax: 60,
    equipmentDropChance: 22,
    rarityWeights: {
      white: 30,
      green: 35,
      blue: 25,
      purple: 8,
      gold: 2,
      red: 0
    },
    materialDrops: [
      { name: "หนังกบ", chance: 25 },
      { name: "ต่อมพิษ", chance: 30 },
      { name: "สาหร่ายพิษ", chance: 25 },
      { name: "ไม้พิษ", chance: 20 },
      { name: "น้ำค้างพิษ", chance: 10 }
    ],
    consumables: [
      { name: "ยาแก้พิษ", chance: 20 },
      { name: "ยาฟื้นฟูขนาดกลาง", chance: 15 },
      { name: "ยากำจัดพิษ", chance: 5 }
    ]
  },
  {
    id: "river_t1_normal",
    enemyType: "Normal",
    goldMin: 3,
    goldMax: 11,
    equipmentDropChance: 20,
    rarityWeights: {
      white: 50,
      green: 30,
      blue: 15,
      purple: 4,
      gold: 1,
      red: 0
    },
    materialDrops: [
      { name: "เกล็ดปลา", chance: 25 },
      { name: "ก้างปลา", chance: 20 },
      { name: "ไข่มุกน้ำจืด", chance: 5 },
      { name: "สาหร่ายน้ำ", chance: 20 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูเล็กน้อย", chance: 10 }
    ]
  },
  {
    id: "river_t1_elite",
    enemyType: "Elite",
    goldMin: 15,
    goldMax: 30,
    equipmentDropChance: 60,
    rarityWeights: {
      white: 10,
      green: 30,
      blue: 35,
      purple: 20,
      gold: 5,
      red: 0
    },
    materialDrops: [
      { name: "เกล็ดปลา", chance: 40 },
      { name: "ก้างปลา", chance: 30 },
      { name: "ไข่มุกน้ำจืด", chance: 15 },
      { name: "สาหร่ายน้ำ", chance: 30 },
      { name: "หนวดปลาดุก", chance: 10 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูเล็กน้อย", chance: 20 },
      { name: "ยาพลังภายในเล็กน้อย", chance: 10 }
    ]
  },
  {
    id: "cave_t1_normal",
    enemyType: "Normal",
    goldMin: 5,
    goldMax: 15,
    equipmentDropChance: 20,
    rarityWeights: {
      white: 50,
      green: 30,
      blue: 15,
      purple: 4,
      gold: 1,
      red: 0
    },
    materialDrops: [
      { name: "แร่เหล็ก", chance: 25 },
      { name: "หินก้อน", chance: 30 },
      { name: "ตะไคร่น้ำ", chance: 20 },
      { name: "ขนค้างคาว", chance: 15 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูเล็กน้อย", chance: 10 }
    ]
  },
  {
    id: "cave_t1_elite",
    enemyType: "Elite",
    goldMin: 20,
    goldMax: 40,
    equipmentDropChance: 60,
    rarityWeights: {
      white: 10,
      green: 30,
      blue: 35,
      purple: 20,
      gold: 5,
      red: 0
    },
    materialDrops: [
      { name: "แร่เหล็ก", chance: 40 },
      { name: "หินก้อน", chance: 35 },
      { name: "ตะไคร่น้ำ", chance: 25 },
      { name: "ขนค้างคาว", chance: 20 },
      { name: "คริสตัลถ้ำ", chance: 10 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูเล็กน้อย", chance: 20 },
      { name: "ยาพลังภายในเล็กน้อย", chance: 10 }
    ]
  },
  {
    id: "cave_t2_normal",
    enemyType: "Normal",
    goldMin: 30,
    goldMax: 70,
    equipmentDropChance: 22,
    rarityWeights: {
      white: 30,
      green: 35,
      blue: 25,
      purple: 8,
      gold: 2,
      red: 0
    },
    materialDrops: [
      { name: "แร่เหล็ก", chance: 25 },
      { name: "หินก้อน", chance: 20 },
      { name: "แร่เงิน", chance: 20 },
      { name: "คริสตัลถ้ำ", chance: 15 },
      { name: "หนังค้างคาว", chance: 15 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดกลาง", chance: 15 },
      { name: "ยาพลังภายในขนาดกลาง", chance: 10 }
    ]
  },
  {
    id: "volcano_t2_normal",
    enemyType: "Normal",
    goldMin: 35,
    goldMax: 80,
    equipmentDropChance: 22,
    rarityWeights: {
      white: 30,
      green: 35,
      blue: 25,
      purple: 8,
      gold: 2,
      red: 0
    },
    materialDrops: [
      { name: "เถ้าถ่าน", chance: 25 },
      { name: "หินลาวา", chance: 20 },
      { name: "แร่ทองแดง", chance: 20 },
      { name: "ไข่มังกรเพลิง", chance: 5 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดกลาง", chance: 15 },
      { name: "ยากันไฟ", chance: 10 }
    ]
  },
  {
    id: "volcano_t2_elite",
    enemyType: "Elite",
    goldMin: 80,
    goldMax: 200,
    equipmentDropChance: 65,
    rarityWeights: {
      white: 5,
      green: 20,
      blue: 35,
      purple: 30,
      gold: 10,
      red: 0
    },
    materialDrops: [
      { name: "เถ้าถ่าน", chance: 40 },
      { name: "หินลาวา", chance: 35 },
      { name: "แร่ทองแดง", chance: 30 },
      { name: "ไข่มังกรเพลิง", chance: 15 },
      { name: "คริสตัลเพลิง", chance: 10 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดกลาง", chance: 25 },
      { name: "ยาพลังภายในขนาดกลาง", chance: 15 },
      { name: "ยากันไฟ", chance: 20 },
      { name: "ยาเร่งพลังเพลิง", chance: 5 }
    ]
  },
  {
    id: "ice_t2_normal",
    enemyType: "Normal",
    goldMin: 30,
    goldMax: 70,
    equipmentDropChance: 22,
    rarityWeights: {
      white: 30,
      green: 35,
      blue: 25,
      purple: 8,
      gold: 2,
      red: 0
    },
    materialDrops: [
      { name: "เศษน้ำแข็ง", chance: 25 },
      { name: "ขนหิมะ", chance: 20 },
      { name: "เกล็ดน้ำแข็ง", chance: 15 },
      { name: "แร่เงิน", chance: 20 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดกลาง", chance: 15 },
      { name: "ยากันหนาว", chance: 10 }
    ]
  },
  {
    id: "ice_t2_elite",
    enemyType: "Elite",
    goldMin: 70,
    goldMax: 180,
    equipmentDropChance: 65,
    rarityWeights: {
      white: 5,
      green: 20,
      blue: 35,
      purple: 30,
      gold: 10,
      red: 0
    },
    materialDrops: [
      { name: "เศษน้ำแข็ง", chance: 40 },
      { name: "ขนหิมะ", chance: 35 },
      { name: "เกล็ดน้ำแข็ง", chance: 30 },
      { name: "แร่เงิน", chance: 30 },
      { name: "คริสตัลน้ำแข็ง", chance: 15 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดกลาง", chance: 25 },
      { name: "ยาพลังภายในขนาดกลาง", chance: 15 },
      { name: "ยากันหนาว", chance: 20 },
      { name: "ยาน้ำแข็ง", chance: 5 }
    ]
  },
  {
    id: "undead_t2_normal",
    enemyType: "Normal",
    goldMin: 25,
    goldMax: 60,
    equipmentDropChance: 22,
    rarityWeights: {
      white: 30,
      green: 35,
      blue: 25,
      purple: 8,
      gold: 2,
      red: 0
    },
    materialDrops: [
      { name: "กระดูก", chance: 25 },
      { name: "เศษผ้าห่อศพ", chance: 20 },
      { name: "วิญญาณสลาย", chance: 15 },
      { name: "โลงศพเศษ", chance: 10 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดกลาง", chance: 15 },
      { name: "น้ำมันเรืองแสง", chance: 10 }
    ]
  },
  {
    id: "undead_t2_elite",
    enemyType: "Elite",
    goldMin: 60,
    goldMax: 150,
    equipmentDropChance: 65,
    rarityWeights: {
      white: 5,
      green: 20,
      blue: 35,
      purple: 30,
      gold: 10,
      red: 0
    },
    materialDrops: [
      { name: "กระดูก", chance: 40 },
      { name: "เศษผ้าห่อศพ", chance: 35 },
      { name: "วิญญาณสลาย", chance: 25 },
      { name: "โลงศพเศษ", chance: 20 },
      { name: "ดวงวิญญาณ", chance: 10 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดกลาง", chance: 25 },
      { name: "ยาพลังภายในขนาดกลาง", chance: 15 },
      { name: "ยาขับไล่วิญญาณ", chance: 10 }
    ]
  },
  {
    id: "undead_t3_normal",
    enemyType: "Normal",
    goldMin: 100,
    goldMax: 220,
    equipmentDropChance: 20,
    rarityWeights: {
      white: 10,
      green: 25,
      blue: 35,
      purple: 20,
      gold: 8,
      red: 2
    },
    materialDrops: [
      { name: "กระดูกโบราณ", chance: 30 },
      { name: "เศษผ้าห่อศพ", chance: 25 },
      { name: "วิญญาณสลาย", chance: 25 },
      { name: "คริสตัลความตาย", chance: 10 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดใหญ่", chance: 20 },
      { name: "ยาพลังภายในขนาดใหญ่", chance: 15 },
      { name: "ยาขับไล่วิญญาณ", chance: 15 }
    ]
  },
  {
    id: "undead_t3_elite",
    enemyType: "Elite",
    goldMin: 200,
    goldMax: 450,
    equipmentDropChance: 60,
    rarityWeights: {
      white: 0,
      green: 10,
      blue: 30,
      purple: 40,
      gold: 15,
      red: 5
    },
    materialDrops: [
      { name: "กระดูกโบราณ", chance: 40 },
      { name: "เศษผ้าห่อศพ", chance: 35 },
      { name: "วิญญาณสลาย", chance: 35 },
      { name: "คริสตัลความตาย", chance: 20 },
      { name: "หัวใจผีดิบ", chance: 5 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดใหญ่", chance: 25 },
      { name: "ยาพลังภายในขนาดใหญ่", chance: 20 },
      { name: "ยาขับไล่วิญญาณ", chance: 20 },
      { name: "ยาพิษสลาย", chance: 5 }
    ]
  },
  {
    id: "demon_t2_normal",
    enemyType: "Normal",
    goldMin: 30,
    goldMax: 70,
    equipmentDropChance: 22,
    rarityWeights: {
      white: 30,
      green: 35,
      blue: 25,
      purple: 8,
      gold: 2,
      red: 0
    },
    materialDrops: [
      { name: "เขี้ยวมาร", chance: 20 },
      { name: "เล็บมาร", chance: 20 },
      { name: "หนังมาร", chance: 15 },
      { name: "เลือดมาร", chance: 10 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดกลาง", chance: 15 },
      { name: "ยาพลังภายในขนาดกลาง", chance: 10 }
    ]
  },
  {
    id: "demon_t2_elite",
    enemyType: "Elite",
    goldMin: 80,
    goldMax: 200,
    equipmentDropChance: 65,
    rarityWeights: {
      white: 5,
      green: 20,
      blue: 35,
      purple: 30,
      gold: 10,
      red: 0
    },
    materialDrops: [
      { name: "เขี้ยวมาร", chance: 40 },
      { name: "เล็บมาร", chance: 35 },
      { name: "หนังมาร", chance: 30 },
      { name: "เลือดมาร", chance: 25 },
      { name: "คริสตัลมาร", chance: 10 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดกลาง", chance: 25 },
      { name: "ยาพลังภายในขนาดกลาง", chance: 15 },
      { name: "ยากันมาร", chance: 10 }
    ]
  },
  {
    id: "demon_t3_normal",
    enemyType: "Normal",
    goldMin: 120,
    goldMax: 250,
    equipmentDropChance: 20,
    rarityWeights: {
      white: 10,
      green: 25,
      blue: 35,
      purple: 20,
      gold: 8,
      red: 2
    },
    materialDrops: [
      { name: "เขี้ยวมาร", chance: 30 },
      { name: "เล็บมาร", chance: 25 },
      { name: "หนังมาร", chance: 25 },
      { name: "เลือดมาร", chance: 20 },
      { name: "คริสตัลมาร", chance: 15 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดใหญ่", chance: 20 },
      { name: "ยาพลังภายในขนาดใหญ่", chance: 15 },
      { name: "ยากันมาร", chance: 15 }
    ]
  },
  {
    id: "demon_t3_elite",
    enemyType: "Elite",
    goldMin: 250,
    goldMax: 550,
    equipmentDropChance: 60,
    rarityWeights: {
      white: 0,
      green: 10,
      blue: 30,
      purple: 40,
      gold: 15,
      red: 5
    },
    materialDrops: [
      { name: "เขี้ยวมาร", chance: 40 },
      { name: "เล็บมาร", chance: 35 },
      { name: "หนังมาร", chance: 35 },
      { name: "เลือดมาร", chance: 30 },
      { name: "คริสตัลมาร", chance: 25 },
      { name: "หัวใจมาร", chance: 5 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดใหญ่", chance: 25 },
      { name: "ยาพลังภายในขนาดใหญ่", chance: 20 },
      { name: "ยากันมาร", chance: 20 },
      { name: "ยาควบคุมมาร", chance: 5 }
    ]
  },
  {
    id: "celestial_t3_normal",
    enemyType: "Normal",
    goldMin: 150,
    goldMax: 300,
    equipmentDropChance: 20,
    rarityWeights: {
      white: 10,
      green: 25,
      blue: 35,
      purple: 20,
      gold: 8,
      red: 2
    },
    materialDrops: [
      { name: "ขนนกเซียน", chance: 25 },
      { name: "สายใยสวรรค์", chance: 20 },
      { name: "น้ำอมฤตหยด", chance: 15 },
      { name: "เศษหยกสวรรค์", chance: 10 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูสวรรค์", chance: 20 },
      { name: "ยาพลังภายในสวรรค์", chance: 15 },
      { name: "ยาล้างบาป", chance: 10 }
    ]
  },
  {
    id: "celestial_t3_elite",
    enemyType: "Elite",
    goldMin: 300,
    goldMax: 700,
    equipmentDropChance: 60,
    rarityWeights: {
      white: 0,
      green: 10,
      blue: 30,
      purple: 40,
      gold: 15,
      red: 5
    },
    materialDrops: [
      { name: "ขนนกเซียน", chance: 40 },
      { name: "สายใยสวรรค์", chance: 35 },
      { name: "น้ำอมฤตหยด", chance: 30 },
      { name: "เศษหยกสวรรค์", chance: 25 },
      { name: "ดอกไม้เซียน", chance: 10 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูสวรรค์", chance: 30 },
      { name: "ยาพลังภายในสวรรค์", chance: 25 },
      { name: "ยาล้างบาป", chance: 20 },
      { name: "ยาเซียน", chance: 5 }
    ]
  },
  {
    id: "celestial_t4_normal",
    enemyType: "Normal",
    goldMin: 300,
    goldMax: 600,
    equipmentDropChance: 20,
    rarityWeights: {
      white: 0,
      green: 15,
      blue: 35,
      purple: 30,
      gold: 15,
      red: 5
    },
    materialDrops: [
      { name: "ขนนกเซียน", chance: 30 },
      { name: "สายใยสวรรค์", chance: 25 },
      { name: "น้ำอมฤตหยด", chance: 25 },
      { name: "เศษหยกสวรรค์", chance: 20 },
      { name: "แสงธรรม", chance: 10 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูสวรรค์", chance: 25 },
      { name: "ยาพลังภายในสวรรค์", chance: 20 },
      { name: "ยาล้างบาป", chance: 15 },
      { name: "ยาเซียน", chance: 10 }
    ]
  },
  {
    id: "celestial_t4_elite",
    enemyType: "Elite",
    goldMin: 500,
    goldMax: 1200,
    equipmentDropChance: 60,
    rarityWeights: {
      white: 0,
      green: 0,
      blue: 20,
      purple: 45,
      gold: 25,
      red: 10
    },
    materialDrops: [
      { name: "ขนนกเซียน", chance: 45 },
      { name: "สายใยสวรรค์", chance: 40 },
      { name: "น้ำอมฤตหยด", chance: 40 },
      { name: "เศษหยกสวรรค์", chance: 35 },
      { name: "ดอกไม้เซียน", chance: 20 },
      { name: "แสงธรรม", chance: 15 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูสวรรค์", chance: 35 },
      { name: "ยาพลังภายในสวรรค์", chance: 30 },
      { name: "ยาล้างบาป", chance: 25 },
      { name: "ยาเซียน", chance: 15 }
    ]
  },
  {
    id: "sect_t1_normal",
    enemyType: "Normal",
    goldMin: 5,
    goldMax: 15,
    equipmentDropChance: 20,
    rarityWeights: {
      white: 50,
      green: 30,
      blue: 15,
      purple: 4,
      gold: 1,
      red: 0
    },
    materialDrops: [
      { name: "ม้วนคัมภีร์เก่า", chance: 20 },
      { name: "กระดาษชำระ", chance: 25 },
      { name: "หมึกจีน", chance: 15 },
      { name: "ผ้าไหม", chance: 10 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูเล็กน้อย", chance: 10 }
    ]
  },
  {
    id: "sect_t1_elite",
    enemyType: "Elite",
    goldMin: 20,
    goldMax: 40,
    equipmentDropChance: 60,
    rarityWeights: {
      white: 10,
      green: 30,
      blue: 35,
      purple: 20,
      gold: 5,
      red: 0
    },
    materialDrops: [
      { name: "ม้วนคัมภีร์เก่า", chance: 35 },
      { name: "กระดาษชำระ", chance: 30 },
      { name: "หมึกจีน", chance: 25 },
      { name: "ผ้าไหม", chance: 20 },
      { name: "ยันต์คุ้มภัย", chance: 10 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูเล็กน้อย", chance: 20 },
      { name: "ยาพลังภายในเล็กน้อย", chance: 10 }
    ]
  },
  {
    id: "sect_t2_normal",
    enemyType: "Normal",
    goldMin: 30,
    goldMax: 70,
    equipmentDropChance: 22,
    rarityWeights: {
      white: 30,
      green: 35,
      blue: 25,
      purple: 8,
      gold: 2,
      red: 0
    },
    materialDrops: [
      { name: "ม้วนคัมภีร์เก่า", chance: 25 },
      { name: "กระดาษชำระ", chance: 20 },
      { name: "หมึกจีน", chance: 20 },
      { name: "ผ้าไหม", chance: 20 },
      { name: "ยันต์คุ้มภัย", chance: 10 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดกลาง", chance: 15 },
      { name: "ยาพลังภายในขนาดกลาง", chance: 10 }
    ]
  },
  {
    id: "sect_t2_elite",
    enemyType: "Elite",
    goldMin: 80,
    goldMax: 200,
    equipmentDropChance: 65,
    rarityWeights: {
      white: 5,
      green: 20,
      blue: 35,
      purple: 30,
      gold: 10,
      red: 0
    },
    materialDrops: [
      { name: "ม้วนคัมภีร์เก่า", chance: 40 },
      { name: "กระดาษชำระ", chance: 35 },
      { name: "หมึกจีน", chance: 30 },
      { name: "ผ้าไหม", chance: 30 },
      { name: "ยันต์คุ้มภัย", chance: 20 },
      { name: "คัมภีร์ลับ", chance: 5 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดกลาง", chance: 25 },
      { name: "ยาพลังภายในขนาดกลาง", chance: 15 },
      { name: "ยาเร่งพลัง", chance: 10 }
    ]
  },
  {
    id: "bandit_t1_normal",
    enemyType: "Normal",
    goldMin: 6,
    goldMax: 20,
    equipmentDropChance: 20,
    rarityWeights: {
      white: 50,
      green: 30,
      blue: 15,
      purple: 4,
      gold: 1,
      red: 0
    },
    materialDrops: [
      { name: "ขวดเหล้า", chance: 25 },
      { name: "เหรียญทองแดง", chance: 30 },
      { name: "ผ้าขี้ริ้ว", chance: 20 },
      { name: "กระดาษโน้ต", chance: 10 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูเล็กน้อย", chance: 10 }
    ]
  },
  {
    id: "bandit_t1_elite",
    enemyType: "Elite",
    goldMin: 25,
    goldMax: 60,
    equipmentDropChance: 60,
    rarityWeights: {
      white: 10,
      green: 30,
      blue: 35,
      purple: 20,
      gold: 5,
      red: 0
    },
    materialDrops: [
      { name: "ขวดเหล้า", chance: 40 },
      { name: "เหรียญทองแดง", chance: 50 },
      { name: "ผ้าขี้ริ้ว", chance: 30 },
      { name: "กระดาษโน้ต", chance: 20 },
      { name: "กุญแจโจร", chance: 5 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูเล็กน้อย", chance: 20 },
      { name: "ยาพลังภายในเล็กน้อย", chance: 10 }
    ]
  },
  {
    id: "bandit_t2_normal",
    enemyType: "Normal",
    goldMin: 30,
    goldMax: 80,
    equipmentDropChance: 22,
    rarityWeights: {
      white: 30,
      green: 35,
      blue: 25,
      purple: 8,
      gold: 2,
      red: 0
    },
    materialDrops: [
      { name: "ขวดเหล้า", chance: 25 },
      { name: "เหรียญเงิน", chance: 30 },
      { name: "ผ้าขี้ริ้ว", chance: 20 },
      { name: "กระดาษโน้ต", chance: 15 },
      { name: "แผนที่ขุมทรัพย์ปลอม", chance: 5 }
    ],
    consumables: [
      { name: "ยาฟื้นฟูขนาดกลาง", chance: 15 },
      { name: "ยาพลังภายในขนาดกลาง", chance: 10 }
    ]
  }
];