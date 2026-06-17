/**
 * =============================================================================
 * js/equipment.js — Jianghu RPG
 * Equipment Management Module
 * =============================================================================
 *
 * รับผิดชอบ: จัดการระบบสวมใส่อุปกรณ์ของผู้เล่น
 *            - สวมใส่อุปกรณ์จากคลัง
 *            - ถอดอุปกรณ์กลับเข้าคลัง
 *            - ตรวจสอบความเข้ากันของสล็อต
 *            - ป้องกันการสวมใส่ที่ไม่ถูกต้อง
 *            - คำนวณและปรับใช้สเตตัสจากอุปกรณ์ (ผ่าน recalculateEquipmentStats)
 *
 * อ้างอิง: Jianghu RPG — Game Bible v1.0
 *   - Section 4:  Equipment System (Slots, Types, Stats)
 *   - Section 5:  Stat Pool System (Stat Caps, Combat Stats)
 *   - Section 13: Data Schema (Player Schema §13.1, Item Schema §13.2)
 *
 * ไม่รับผิดชอบ: UI, Item Generation, Drop Tables, Shop, Battle Logic,
 *               Inventory Core Operations (เว้นแต่จำเป็นต้องใช้ instanceId)
 *
 * หมายเหตุ: โมดูลนี้ mutate player.equipment และ player.combat_stats โดยตรง
 *            และอัปเดต player._updated_at (ถ้ามี) เพื่อให้สอดคล้องกับ player.js
 * =============================================================================
 */

"use strict";

// =============================================================================
// SECTION A: CONSTANTS
// =============================================================================

/**
 * ค่าคงที่สำหรับระบบอุปกรณ์
 * ยึดตาม Game Bible §4.1, §5.1
 */
const EQUIPMENT_CONSTANTS = Object.freeze({
  /** สล็อตอุปกรณ์ที่ถูกต้อง */
  VALID_SLOTS: Object.freeze(["weapon", "armor", "accessory"]),

  /** ประเภทไอเทมที่ถูกต้อง */
  VALID_ITEM_TYPES: Object.freeze(["weapon", "armor", "accessory"]),

  /** แมปประเภทไอเทม → สล็อตอุปกรณ์ (1:1 mapping ตาม Game Bible) */
  ITEM_TYPE_TO_SLOT: Object.freeze({
    weapon: "weapon",
    armor: "armor",
    accessory: "accessory",
  }),

  /** สเตตัสโจมตีโดยตรง (Direct Combat Stats) — บวกลบจาก combat_stats ได้เลย */
  DIRECT_COMBAT_STATS: Object.freeze([
    "ATK", "DEF", "HP", "MP", "CRIT", "CRIT_DAMAGE",
    "DODGE", "ACCURACY", "ARMOR_PEN", "LIFE_STEAL",
    "MANA_STEAL", "KILL_CHANCE",
  ]),

  /** สเตตัสหลัก (Primary Stats) — ต้องคำนวณผลทอดก่อนบวกลบ combat_stats */
  PRIMARY_STATS: Object.freeze([
    "STR", "CON", "AGI", "INT", "LUCK",
  ]),

  /** แมป Direct Combat Stat → ฟิลด์ใน player.combat_stats */
  DIRECT_STAT_MAP: Object.freeze({
    ATK: "atk",
    DEF: "def",
    HP: "hp_max",
    MP: "mp_max",
    CRIT: "crit",
    CRIT_DAMAGE: "crit_damage",
    DODGE: "dodge",
    ACCURACY: "accuracy",
    ARMOR_PEN: "armor_pen",
    LIFE_STEAL: "life_steal",
    MANA_STEAL: "mana_steal",
    KILL_CHANCE: "kill_chance",
  }),

  /**
   * อัตราส่วนผลทอดของ Primary Stats → Combat Stats
   * ยึดตาม Game Bible §2.3
   */
  PRIMARY_STAT_MULTIPLIERS: Object.freeze({
    STR: { atk: 2.5 },
    CON: { hp_max: 10, def: 0.5 },
    AGI: { dodge: 0.3, accuracy: 0.2, crit: 0.15 },
    INT: { mp_max: 8, crit_damage: 0.2 },
    LUCK: { crit: 0.1, kill_chance: 0.05 },
  }),
});

// =============================================================================
// SECTION B: PRIVATE HELPERS
// =============================================================================

/**
 * ตรวจสอบว่า object เป็น Player ที่ถูกต้อง
 * @param {*} player
 */
function _assertPlayer(player) {
  if (!player || typeof player !== "object") {
    throw new Error("Invalid player object.");
  }
  if (!player.equipment || typeof player.equipment !== "object") {
    throw new Error("Player object is missing equipment structure.");
  }
  if (!player.combat_stats || typeof player.combat_stats !== "object") {
    throw new Error("Player object is missing combat_stats structure.");
  }
  if (!Array.isArray(player.inventory)) {
    throw new Error("Player object is missing inventory array.");
  }
}

/**
 * ตรวจสอบว่า itemData มีโครงสร้างที่ถูกต้องตาม Item Schema §13.2
 * @param {*} itemData
 */
function _assertItemData(itemData) {
  if (!itemData || typeof itemData !== "object") {
    throw new Error("Invalid item data: must be a non-null object.");
  }
  if (!itemData.id || typeof itemData.id !== "string") {
    throw new Error("Invalid item data: missing or invalid 'id' field.");
  }
  if (!itemData.type || typeof itemData.type !== "string") {
    throw new Error("Invalid item data: missing or invalid 'type' field.");
  }
  if (!EQUIPMENT_CONSTANTS.VALID_ITEM_TYPES.includes(itemData.type)) {
    throw new Error(
      `Invalid item type: "${itemData.type}". Must be one of: ${EQUIPMENT_CONSTANTS.VALID_ITEM_TYPES.join(", ")}`
    );
  }
  if (!Array.isArray(itemData.stats)) {
    throw new Error("Invalid item data: 'stats' must be an array.");
  }
}

/**
 * ตรวจสอบว่าสล็อตเป็นสล็อตที่ถูกต้อง
 * @param {string} slot
 */
function _assertValidSlot(slot) {
  if (!EQUIPMENT_CONSTANTS.VALID_SLOTS.includes(slot)) {
    throw new Error(
      `Invalid equipment slot: "${slot}". Must be one of: ${EQUIPMENT_CONSTANTS.VALID_SLOTS.join(", ")}`
    );
  }
}

/**
 * อัปเดต _updated_at timestamp ของ player (ถ้ามี field นั้น)
 * @param {Object} player
 */
function _touch(player) {
  if (player && typeof player === "object" && "_updated_at" in player) {
    player._updated_at = Date.now();
  }
}

/**
 * หา entry ในคลังตาม instanceId
 * @param {Object} player
 * @param {string} instanceId
 * @returns {{ entry: Object, index: number } | null}
 */
function _findInventoryEntryByInstanceId(player, instanceId) {
  const index = player.inventory.findIndex(
    (entry) => entry.instanceId === instanceId
  );
  if (index === -1) return null;
  return { entry: player.inventory[index], index };
}

/**
 * ลบ entry ออกจากคลังตาม instanceId โดยตรง
 * inventory.js ไม่มี API สำหรับลบตาม instanceId จึงต้องจัดการเอง
 * @param {Object} player
 * @param {string} instanceId
 * @returns {Object|null} entry ที่ถูกลบ หรือ null ถ้าไม่พบ
 */
function _removeInventoryEntryByInstanceId(player, instanceId) {
  const found = _findInventoryEntryByInstanceId(player, instanceId);
  if (!found) return null;

  const { entry, index } = found;
  player.inventory.splice(index, 1);
  return { ...entry };
}

/**
 * คำนวณผลรวมของสเตตัสจากอุปกรณ์หนึ่งชิ้น
 * แยกเป็น: direct combat stats และ primary stat deltas
 *
 * @param {Object} itemData - ข้อมูลไอเทมตาม Item Schema §13.2
 * @returns {{
 *   direct: Object,      // { combatStatKey: deltaValue }
 *   primary: Object      // { combatStatKey: deltaValue }
 * }}
 */
function _calculateItemStatBonuses(itemData) {
  const direct = {};
  const primary = {};

  for (const stat of itemData.stats) {
    const statId = stat.stat_id;
    const value = stat.value;

    if (typeof statId !== "string" || typeof value !== "number") {
      // ข้าม entry ที่ไม่ถูกต้อง ไม่ throw เพื่อความทนทาน
      continue;
    }

    // Direct Combat Stat
    if (EQUIPMENT_CONSTANTS.DIRECT_COMBAT_STATS.includes(statId)) {
      const combatKey = EQUIPMENT_CONSTANTS.DIRECT_STAT_MAP[statId];
      if (combatKey) {
        direct[combatKey] = (direct[combatKey] || 0) + value;
      }
      continue;
    }

    // Primary Stat → คำนวณผลทอด
    if (EQUIPMENT_CONSTANTS.PRIMARY_STATS.includes(statId)) {
      const multipliers = EQUIPMENT_CONSTANTS.PRIMARY_STAT_MULTIPLIERS[statId];
      if (multipliers) {
        for (const [combatKey, multiplier] of Object.entries(multipliers)) {
          primary[combatKey] = (primary[combatKey] || 0) + value * multiplier;
        }
      }
      continue;
    }

    // สเตตัสที่ไม่รู้จัก — ไม่ทำอะไร (อนาคตอาจมีสเตตัสใหม่จาก Expansion)
  }

  return { direct, primary };
}

/**
 * รวมผลโบนัส direct + primary เข้าด้วยกัน
 * @param {{ direct: Object, primary: Object }} bonuses
 * @returns {Object} ผลรวมทุก combat stat key
 */
function _mergeBonuses(bonuses) {
  const merged = {};
  for (const [key, val] of Object.entries(bonuses.direct)) {
    merged[key] = (merged[key] || 0) + val;
  }
  for (const [key, val] of Object.entries(bonuses.primary)) {
    merged[key] = (merged[key] || 0) + val;
  }
  return merged;
}

// =============================================================================
// SECTION C: CORE API — EQUIP / UNEQUIP / SWAP
// =============================================================================

/**
 * สวมใส่อุปกรณ์จากคลังผู้เล่น
 *
 * หลักการ:
 *   1. ตรวจสอบ instanceId มีอยู่ในคลัง
 *   2. ตรวจสอบ itemData ถูกต้องและ type ตรงกับสล็อต
 *   3. ถ้าสล็อตมีอุปกรณ์อยู่แล้ว → ถอดออกก่อน (auto-unequip)
 *   4. ลบไอเทมออกจากคลัง (โดย instanceId)
 *   5. ใส่ไอเทมเข้าสล็อต
 *   6. เรียก recalculateEquipmentStats เพื่อรวมสถิติใหม่ทั้งหมด
 *
 * @param {Object} player - Player object
 * @param {string} instanceId - instanceId ของไอเทมในคลัง
 * @param {Object} itemData - ข้อมูลไอเทมเต็มรูปแบบตาม Item Schema §13.2
 * @returns {{
 *   success: boolean,
 *   slot: string,
 *   previousItem: Object|null,
 *   equippedItem: Object,
 *   bonusesApplied: Object
 * }}
 */
function equipItem(player, instanceId, itemData) {
  _assertPlayer(player);

  if (!instanceId || typeof instanceId !== "string") {
    throw new Error("instanceId must be a non-empty string.");
  }

  _assertItemData(itemData);

  // 1. หาไอเทมในคลังตาม instanceId
  const inventoryEntry = _findInventoryEntryByInstanceId(player, instanceId);
  if (!inventoryEntry) {
    throw new Error(
      `Item with instanceId "${instanceId}" not found in player inventory.`
    );
  }

  // ตรวจสอบว่า itemId ตรงกัน (ป้องกัน mismatch ระหว่าง inventory entry กับ itemData)
  if (inventoryEntry.entry.itemId !== itemData.id) {
    throw new Error(
      `Item ID mismatch: inventory has "${inventoryEntry.entry.itemId}" but itemData has "${itemData.id}".`
    );
  }

  // 2. ตรวจสอบว่า type ตรงกับสล็อตที่ถูกต้อง
  const targetSlot = EQUIPMENT_CONSTANTS.ITEM_TYPE_TO_SLOT[itemData.type];
  if (!targetSlot) {
    throw new Error(
      `Item type "${itemData.type}" does not map to any equipment slot.`
    );
  }

  // 3. ถ้าสล็อตมีอุปกรณ์อยู่แล้ว → ถอดออกก่อน
  let previousItem = null;
  if (player.equipment[targetSlot] !== null) {
    previousItem = unequipItem(player, targetSlot);
  }

  // 4. ลบไอเทมออกจากคลัง (โดย instanceId)
  const removedEntry = _removeInventoryEntryByInstanceId(player, instanceId);
  if (!removedEntry) {
    throw new Error(
      `Failed to remove item with instanceId "${instanceId}" from inventory.`
    );
  }

  // 5. เก็บไอเทมเข้าสล็อต
  player.equipment[targetSlot] = {
    instanceId: removedEntry.instanceId,
    itemId: removedEntry.itemId,
    itemData: itemData,
  };

  // 6. recalculate stats ทั้งหมด (base + equipment)
  recalculateEquipmentStats(player);

  _touch(player);

  return {
    success: true,
    slot: targetSlot,
    previousItem: previousItem,
    equippedItem: player.equipment[targetSlot],
    bonusesApplied: calculateTotalEquipmentBonuses(player).total,
  };
}

/**
 * ถอดอุปกรณ์ออกจากสล็อตและคืนเข้าคลัง
 *
 * หลักการ:
 *   1. ตรวจสอบสล็อตถูกต้อง
 *   2. ตรวจสอบว่ามีอุปกรณ์ในสล็อต
 *   3. คืนไอเทมเข้าคลัง (push ตรงเพื่อ preserve instanceId)
 *   4. เคลียร์สล็อต
 *   5. เรียก recalculateEquipmentStats เพื่ออัปเดตสถิติ
 *
 * @param {Object} player - Player object
 * @param {string} slot - "weapon" | "armor" | "accessory"
 * @returns {{
 *   success: boolean,
 *   slot: string,
 *   returnedItem: Object,
 *   bonusesRemoved: Object
 * }}
 */
function unequipItem(player, slot) {
  _assertPlayer(player);
  _assertValidSlot(slot);

  const equipped = player.equipment[slot];
  if (!equipped) {
    throw new Error(`No item equipped in slot "${slot}".`);
  }

  // คืนไอเทมเข้าคลังโดยตรง (preserve instanceId)
  const returnedEntry = {
    instanceId: equipped.instanceId,
    itemId: equipped.itemId,
    quantity: 1,
  };
  player.inventory.push(returnedEntry);

  // เก็บข้อมูลก่อนลบ
  const result = {
    success: true,
    slot: slot,
    returnedItem: { ...equipped },
    bonusesRemoved: calculateTotalEquipmentBonuses({ ...player, equipment: { [slot]: equipped } }).total,
  };

  // เคลียร์สล็อต
  player.equipment[slot] = null;

  // recalculate stats ทั้งหมด (base + equipment ที่เหลือ)
  recalculateEquipmentStats(player);

  _touch(player);

  return result;
}

/**
 * สลับอุปกรณ์ในสล็อต (ถอดของเก่า + สวมของใหม่ในครั้งเดียว)
 * เป็น Sugar API ที่เรียก unequip + equip ต่อเนื่อง
 *
 * @param {Object} player
 * @param {string} instanceId - instanceId ของไอเทมใหม่ในคลัง
 * @param {Object} itemData - ข้อมูลไอเทมใหม่
 * @returns {{
 *   success: boolean,
 *   slot: string,
 *   unequipped: Object|null,
 *   equipped: Object,
 *   netBonuses: Object
 * }}
 */
function swapItem(player, instanceId, itemData) {
  _assertPlayer(player);
  _assertItemData(itemData);

  const targetSlot = EQUIPMENT_CONSTANTS.ITEM_TYPE_TO_SLOT[itemData.type];
  if (!targetSlot) {
    throw new Error(
      `Item type "${itemData.type}" does not map to any equipment slot.`
    );
  }

  let unequippedResult = null;
  if (player.equipment[targetSlot] !== null) {
    unequippedResult = unequipItem(player, targetSlot);
  }

  const equippedResult = equipItem(player, instanceId, itemData);

  // คำนวณ net bonuses (bonuses ใหม่ - bonuses เก่า)
  const netBonuses = { ...equippedResult.bonusesApplied };
  if (unequippedResult) {
    for (const [key, val] of Object.entries(unequippedResult.bonusesRemoved)) {
      netBonuses[key] = (netBonuses[key] || 0) - val;
    }
  }

  return {
    success: true,
    slot: targetSlot,
    unequipped: unequippedResult,
    equipped: equippedResult.equippedItem,
    netBonuses: netBonuses,
  };
}

// =============================================================================
// SECTION D: QUERY API
// =============================================================================

/**
 * ดึงข้อมูลอุปกรณ์ที่สวมใส่อยู่ในสล็อตหนึ่ง
 * @param {Object} player
 * @param {string} slot - "weapon" | "armor" | "accessory"
 * @returns {Object|null} สำเนาของ equipped item entry หรือ null
 */
function getEquippedItem(player, slot) {
  _assertPlayer(player);
  _assertValidSlot(slot);

  const equipped = player.equipment[slot];
  if (!equipped) return null;

  return {
    instanceId: equipped.instanceId,
    itemId: equipped.itemId,
    itemData: equipped.itemData,
  };
}

/**
 * ดึงข้อมูลอุปกรณ์ทั้งหมดที่สวมใส่อยู่
 * @param {Object} player
 * @returns {{
 *   weapon: Object|null,
 *   armor: Object|null,
 *   accessory: Object|null
 * }}
 */
function getAllEquipped(player) {
  _assertPlayer(player);

  return {
    weapon: getEquippedItem(player, "weapon"),
    armor: getEquippedItem(player, "armor"),
    accessory: getEquippedItem(player, "accessory"),
  };
}

/**
 * ตรวจสอบว่าสล็อตมีอุปกรณ์สวมใส่อยู่หรือไม่
 * @param {Object} player
 * @param {string} slot
 * @returns {boolean}
 */
function isSlotEquipped(player, slot) {
  _assertPlayer(player);
  _assertValidSlot(slot);
  return player.equipment[slot] !== null;
}

// =============================================================================
// SECTION E: STAT CALCULATION API
// =============================================================================

/**
 * คำนวณผลรวมโบนัสจากอุปกรณ์ทั้งหมดที่สวมใส่อยู่
 * ใช้สำหรับระบบภายนอก (เช่น battle.js) ที่ต้องการทราบ total equipment bonuses
 *
 * @param {Object} player
 * @returns {{
 *   direct: Object,
 *   primary: Object,
 *   total: Object
 * }}
 */
function calculateTotalEquipmentBonuses(player) {
  _assertPlayer(player);

  let direct = {};
  let primary = {};

  for (const slot of EQUIPMENT_CONSTANTS.VALID_SLOTS) {
    const equipped = player.equipment[slot];
    if (!equipped || !equipped.itemData) continue;

    const bonuses = _calculateItemStatBonuses(equipped.itemData);

    for (const [key, val] of Object.entries(bonuses.direct)) {
      direct[key] = (direct[key] || 0) + val;
    }
    for (const [key, val] of Object.entries(bonuses.primary)) {
      primary[key] = (primary[key] || 0) + val;
    }
  }

  return {
    direct,
    primary,
    total: _mergeBonuses({ direct, primary }),
  };
}

/**
 * คำนวณ Power Score รวมของอุปกรณ์ที่สวมใส่อยู่
 * @param {Object} player
 * @returns {number}
 */
function calculateTotalPowerScore(player) {
  _assertPlayer(player);

  let total = 0;
  for (const slot of EQUIPMENT_CONSTANTS.VALID_SLOTS) {
    const equipped = player.equipment[slot];
    if (equipped && equipped.itemData && typeof equipped.itemData.power_score === "number") {
      total += equipped.itemData.power_score;
    }
  }
  return total;
}

// =============================================================================
// SECTION F: RECALCULATION API (ใช้สำหรับอัปเดตสถิติรวมหลังจาก base stats เปลี่ยน)
// =============================================================================

/**
 * คำนวณ Base Combat Stats จาก Primary Stats โดยรวม Advancement multiplier
 * ฟังก์ชันนี้ใช้ PlayerModule (ถ้ามี) หรือ fallback ใช้ฟังก์ชันในตัวที่จำลองตาม Game Bible
 *
 * @param {Object} player
 * @returns {Object} base combat stats (ยังไม่รวมอุปกรณ์)
 */
function _getBaseCombatStats(player) {
  // ถ้า player มี property _base_combat_stats ที่ player.js สร้างให้ ให้นำมาใช้เลย
  if (player._base_combat_stats && typeof player._base_combat_stats === 'object') {
    return { ...player._base_combat_stats };
  }

  // ถ้าไม่มี แสดงว่าถูกเรียกจากที่อื่น (เช่น หลัง load game ยังไม่ได้ recalculate)
  // ลองเรียกใช้ PlayerModule ถ้ามี
  if (typeof PlayerModule !== 'undefined' && PlayerModule.calculateBaseCombatStatsWithMultiplier) {
    return PlayerModule.calculateBaseCombatStatsWithMultiplier(player);
  }

  // fallback สูตรตาม Game Bible (อย่างง่าย ไม่รวม advancement multiplier)
  // ใช้สำหรับกรณีที่ไม่มี player.js module จริง ๆ (เช่น test standalone)
  const s = player.stats;
  const str = s.str || 0, con = s.con || 0, agi = s.agi || 0, ints = s.int || 0, luck = s.luck || 0;
  return {
    hp: con * 10, hp_max: con * 10,
    mp: ints * 8, mp_max: ints * 8,
    atk: str * 2.5,
    def: con * 0.5,
    crit: 5 + (agi * 0.15) + (luck * 0.1),
    crit_damage: 150,
    dodge: agi * 0.3,
    accuracy: 90 + (agi * 0.2),
    armor_pen: 0,
    life_steal: 0,
    mana_steal: 0,
    kill_chance: 0,
  };
}

/**
 * คำนวณและปรับ combat_stats ให้ถูกต้องจาก Base Stats + อุปกรณ์ทั้งหมด
 * ฟังก์ชันนี้จะถูกเรียกจาก player.js หลังจาก base stats เปลี่ยน (level up, allocate stat)
 * และเรียกจาก equip/unequip หลังจากเปลี่ยนแปลงอุปกรณ์
 *
 * @param {Object} player
 * @returns {Object} player.combat_stats หลังปรับ
 */
function recalculateEquipmentStats(player) {
  _assertPlayer(player);

  // 1. ดึง base stats (primary + advancement)
  const baseStats = _getBaseCombatStats(player);

  // 2. คำนวณโบนัสจากอุปกรณ์ทั้งหมด
  const equipmentBonuses = calculateTotalEquipmentBonuses(player);

  // 3. รวม base + equipment
  const newCombat = { ...baseStats };
  for (const [key, val] of Object.entries(equipmentBonuses.total)) {
    if (typeof newCombat[key] === 'number') {
      newCombat[key] += val;
    }
  }

  // 4. รักษาค่า hp/mp ปัจจุบันให้อยู่ในช่วง max (แต่อย่าให้เกิน)
  const oldHp = player.combat_stats.hp;
  const oldMp = player.combat_stats.mp;
  newCombat.hp = Math.min(newCombat.hp_max, oldHp);
  newCombat.mp = Math.min(newCombat.mp_max, oldMp);
  // ป้องกันค่าติดลบ
  newCombat.hp = Math.max(0, newCombat.hp);
  newCombat.mp = Math.max(0, newCombat.mp);

  // 5. อัปเดต combat_stats
  Object.assign(player.combat_stats, newCombat);

  // 6. ถ้ามี property _base_combat_stats ให้ลบออก (ไม่ต้องการเก็บไว้นาน เพราะ base อาจเปลี่ยน)
  delete player._base_combat_stats;

  _touch(player);
  return player.combat_stats;
}

// =============================================================================
// SECTION G: VALIDATION API
// =============================================================================

/**
 * ตรวจสอบว่าไอเทมสามารถสวมใส่ในสล็อตที่ระบุได้หรือไม่
 * @param {Object} itemData
 * @param {string} slot
 * @returns {boolean}
 */
function canEquipInSlot(itemData, slot) {
  if (!itemData || !itemData.type) return false;
  if (!EQUIPMENT_CONSTANTS.VALID_SLOTS.includes(slot)) return false;

  return EQUIPMENT_CONSTANTS.ITEM_TYPE_TO_SLOT[itemData.type] === slot;
}

/**
 * ตรวจสอบว่าไอเทมอยู่ในคลังของผู้เล่นหรือไม่ (ตาม instanceId)
 * @param {Object} player
 * @param {string} instanceId
 * @returns {boolean}
 */
function isItemInInventory(player, instanceId) {
  _assertPlayer(player);
  if (!instanceId || typeof instanceId !== "string") return false;

  return _findInventoryEntryByInstanceId(player, instanceId) !== null;
}

// =============================================================================
// SECTION H: PUBLIC API EXPORT
// =============================================================================

/**
 * EquipmentModule — API สาธารณะสำหรับระบบอื่น
 */
const EquipmentModule = Object.freeze({
  // Constants (read-only)
  CONSTANTS: EQUIPMENT_CONSTANTS,

  // Core Operations
  equipItem,
  unequipItem,
  swapItem,

  // Query
  getEquippedItem,
  getAllEquipped,
  isSlotEquipped,

  // Stat Calculation
  calculateTotalEquipmentBonuses,
  calculateTotalPowerScore,
  recalculateEquipmentStats,   // ฟังก์ชันหลักสำหรับรวมสถิติ

  // Validation
  canEquipInSlot,
  isItemInInventory,
});

// รองรับทั้ง Browser (window) และ Node.js (module.exports)
if (typeof window !== "undefined") {
  window.EquipmentModule = EquipmentModule;
} else if (typeof module !== "undefined" && module.exports) {
  module.exports = EquipmentModule;
}
