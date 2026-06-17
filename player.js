/**
 * =============================================================================
 * js/player.js — Jianghu RPG
 * Player Model & State Management
 * =============================================================================
 *
 * รับผิดชอบ: โครงสร้างข้อมูลผู้เล่น, การสร้างตัวละครใหม่,
 *            การอ่าน/อัปเดตข้อมูล และการ Expose API สำหรับระบบอื่น
 *
 * อ้างอิง: Jianghu RPG — Game Bible v1.0 (Source of Truth)
 *   - Section 2:  Character System (Level, EXP, Stats, Rank)
 *   - Section 3:  Advancement System (Rank Milestones, Skill Slots)
 *   - Section 5:  Stat Pool System (Combat Stats, Caps)
 *   - Section 6:  Skill System (Slot counts per Level)
 *   - Section 13: Data Schema (Player Schema)
 *
 * ไม่รับผิดชอบ: Battle, Inventory Logic, Shop, Event, Map, UI, Damage Formulas
 * =============================================================================
 */

"use strict";

// =============================================================================
// SECTION A: CONSTANTS (ยึดตาม Game Bible — ห้าม Hard-code ค่านอก Bible)
// =============================================================================

/**
 * ค่าคงที่ Level และ EXP
 * @see Game Bible §2.1
 */
const PLAYER_CONSTANTS = Object.freeze({
  MAX_LEVEL: 90,
  EXP_EXPONENT: 1.8,      // EXP_Required(Lv) = 100 × Lv^1.8
  EXP_BASE: 100,
  STAT_POINTS_PER_LEVEL: 5,
  BONUS_STAT_POINTS_MILESTONE: 10, // ทุก 10 Level
  MILESTONE_INTERVAL: 10,
  MAX_GOLD: 9999999,       // §15.1 [R5] Gold Cap
  MAX_FOLLOWERS: 3,        // §8.1
  MAX_SKILL_SLOTS: 6,      // §6.4 สูงสุดที่ Lv80
});

/**
 * Base Stats ที่ Level 1 ก่อน Allocation
 * @see Game Bible §2.2
 */
const BASE_STATS_LV1 = Object.freeze({
  str:  5,
  con:  5,
  agi:  5,
  int:  5,
  luck: 5,
});

/**
 * Base Combat Stats ที่ไม่มาจาก Primary Stats โดยตรง
 * @see Game Bible §5.1
 */
const BASE_COMBAT_DEFAULTS = Object.freeze({
  crit:         5,    // Base CRIT 5% (§5.1)
  crit_damage:  150,  // Base CRIT_DAMAGE 150% (§5.1)
  accuracy:     90,   // Base ACCURACY 90% (§5.1)
  dodge:        0,    // Base DODGE 0%, มาจาก AGI เท่านั้น (§5.1)
  armor_pen:    0,
  life_steal:   0,
  mana_steal:   0,
  kill_chance:  0,
});

/**
 * ตาราง Advancement: Milestone Level → ข้อมูลขั้น
 * @see Game Bible §2.4, §3.1
 *
 * active_slots / passive_slots = จำนวน Slot หลังได้โบนัส Milestone นี้
 * (ตามตาราง §6.4)
 */
const ADVANCEMENT_TABLE = Object.freeze([
  {
    min_level: 1,
    rank:          "จอมยุทธ์ฝึกหัด",
    active_slots:  2,
    passive_slots: 2,
  },
  {
    min_level: 10,
    rank:          "จอมยุทธ์",
    active_slots:  2,
    passive_slots: 2,
    unlocks: ["follower_system", "zone_level_2"],
  },
  {
    min_level: 20,
    rank:          "ยอดฝีมือ",
    active_slots:  3,
    passive_slots: 2,
    unlocks: ["zone_level_3"],
    crit_damage_bonus: 10, // CRIT_DAMAGE Base +10% (§3.1)
  },
  {
    min_level: 30,
    rank:          "ปรมาจารย์",
    active_slots:  3,
    passive_slots: 3,
    unlocks: ["zone_level_4", "elite_shop"],
    dodge_cap_override: 65, // DODGE Cap เพิ่มเป็น 65% (§3.1)
  },
  {
    min_level: 40,
    rank:          "ราชันยุทธ์",
    active_slots:  4,
    passive_slots: 3,
    unlocks: ["zone_level_5"],
  },
  {
    min_level: 50,
    rank:          "เซียนยุทธ์",
    active_slots:  4,
    passive_slots: 4,
    unlocks: ["zone_level_6"],
    base_stat_multiplier: 1.1, // Base Stats ×1.1 (§3.1)
    kill_chance_cap_override: 8, // KILL_CHANCE Cap เพิ่มเป็น 8% (§3.1)
  },
  {
    min_level: 60,
    rank:          "เทพยุทธ์",
    active_slots:  5,
    passive_slots: 4,
    unlocks: ["zone_level_7"],
    accuracy_cap_override: 110, // ACCURACY Cap 110% (§3.1)
  },
  {
    min_level: 70,
    rank:          "จักรพรรดิยุทธ์",
    active_slots:  5,
    passive_slots: 5,
    unlocks: ["zone_level_8"],
    base_stat_multiplier: 1.2, // ×1.2 (สะสมจาก Lv50) (§3.1)
    life_steal_cap_override: 40, // LIFE_STEAL Cap 40% (§3.1)
  },
  {
    min_level: 80,
    rank:          "มหาเทพยุทธ์",
    active_slots:  6,
    passive_slots: 6,
    unlocks: ["zone_level_9", "zone_level_10"],
    base_stat_multiplier: 1.3, // ×1.3 (สะสม) (§3.1)
    dodge_cap_override: 70, // DODGE Cap สูงสุด 70% (§3.1)
  },
]);

/**
 * Stat Caps ที่ระดับเริ่มต้น (ก่อนปลดล็อก Advancement)
 * @see Game Bible §5.2
 */
const DEFAULT_STAT_CAPS = Object.freeze({
  crit:        75,   // %
  crit_damage: 400,  // %
  dodge:       60,   // % (Lv1 default, เพิ่มได้ผ่าน Advancement)
  accuracy:    100,  // % (เพิ่มเป็น 110% ที่ Lv60+)
  armor_pen:   75,   // %
  life_steal:  30,   // % (เพิ่มเป็น 40% ที่ Lv70+)
  mana_steal:  20,   // %
  kill_chance: 5,    // % (เพิ่มเป็น 8% ที่ Lv50+)
});

// =============================================================================
// SECTION B: HELPER FUNCTIONS — EXP & STATS
// =============================================================================

/**
 * คำนวณ EXP ที่ต้องการเพื่อ Level Up จาก level ปัจจุบัน
 * @see Game Bible §2.1: EXP_Required(Lv) = 100 × Lv^1.8
 * @param {number} level - Level ปัจจุบัน (1–89)
 * @returns {number} EXP ที่ต้องการ (Integer)
 */
function calcExpRequired(level) {
  return Math.floor(
    PLAYER_CONSTANTS.EXP_BASE * Math.pow(level, PLAYER_CONSTANTS.EXP_EXPONENT)
  );
}

/**
 * คำนวณ Max HP จาก CON
 * @see Game Bible §2.3: HP_from_CON = CON × 10
 * @param {number} con
 * @returns {number}
 */
function calcMaxHp(con) {
  return con * 10;
}

/**
 * คำนวณ Max MP จาก INT
 * @see Game Bible §2.3: MP_from_INT = INT × 8
 * @param {number} int_stat
 * @returns {number}
 */
function calcMaxMp(int_stat) {
  return int_stat * 8;
}

/**
 * คำนวณ ATK base จาก STR
 * @see Game Bible §2.3: ATK_from_STR = STR × 2.5
 * @param {number} str
 * @returns {number}
 */
function calcBaseAtk(str) {
  return str * 2.5;
}

/**
 * คำนวณ DEF base จาก CON
 * @see Game Bible §2.3: DEF_from_CON = CON × 0.5
 * @param {number} con
 * @returns {number}
 */
function calcBaseDef(con) {
  return con * 0.5;
}

/**
 * คำนวณ DODGE base จาก AGI (เป็น %)
 * @see Game Bible §2.3: DODGE_from_AGI = AGI × 0.3%
 * @param {number} agi
 * @returns {number}
 */
function calcBaseDodge(agi) {
  return agi * 0.3;
}

/**
 * คำนวณ CRIT จาก AGI + LUCK (เป็น %)
 * @see Game Bible §2.3:
 *   CRIT_from_AGI  = AGI  × 0.15%
 *   CRIT_from_LUCK = LUCK × 0.1%
 * @param {number} agi
 * @param {number} luck
 * @returns {number}
 */
function calcBaseCrit(agi, luck) {
  return BASE_COMBAT_DEFAULTS.crit + (agi * 0.15) + (luck * 0.1);
}

/**
 * คำนวณ ACCURACY base จาก AGI (เป็น %)
 * @see Game Bible §2.3: ACCURACY_from_AGI = AGI × 0.2%
 * @param {number} agi
 * @returns {number}
 */
function calcBaseAccuracy(agi) {
  return BASE_COMBAT_DEFAULTS.accuracy + (agi * 0.2);
}

/**
 * หา Advancement entry ที่ตรงกับ Level ปัจจุบัน
 * @param {number} level
 * @returns {Object} advancement tier object
 */
function getAdvancementTier(level) {
  // วิ่งจากสูงลงต่ำเพื่อหา tier ที่ใหญ่สุดที่ไม่เกิน level
  for (let i = ADVANCEMENT_TABLE.length - 1; i >= 0; i--) {
    if (level >= ADVANCEMENT_TABLE[i].min_level) {
      return ADVANCEMENT_TABLE[i];
    }
  }
  return ADVANCEMENT_TABLE[0];
}

/**
 * คำนวณ Skill Slots ที่ถูกต้องตาม Level
 * @see Game Bible §6.4
 * @param {number} level
 * @returns {{ active: number, passive: number }}
 */
function calcSkillSlots(level) {
  const tier = getAdvancementTier(level);
  return {
    active:  tier.active_slots,
    passive: tier.passive_slots,
  };
}

/**
 * สร้าง Combat Stats ทั้งหมดจาก Primary Stats ที่กำหนด (ไม่รวม Advancement multiplier)
 * ใช้สำหรับ build basic structure
 * @param {Object} stats - { str, con, agi, int, luck }
 * @returns {Object} combat_stats ตาม Player Schema §13.1
 */
function buildCombatStatsFromPrimary(stats) {
  return {
    hp:          calcMaxHp(stats.con),
    hp_max:      calcMaxHp(stats.con),
    mp:          calcMaxMp(stats.int),
    mp_max:      calcMaxMp(stats.int),
    atk:         calcBaseAtk(stats.str),
    def:         calcBaseDef(stats.con),
    crit:        calcBaseCrit(stats.agi, stats.luck),
    crit_damage: BASE_COMBAT_DEFAULTS.crit_damage,
    dodge:       calcBaseDodge(stats.agi),
    accuracy:    calcBaseAccuracy(stats.agi),
    armor_pen:   BASE_COMBAT_DEFAULTS.armor_pen,
    life_steal:  BASE_COMBAT_DEFAULTS.life_steal,
    mana_steal:  BASE_COMBAT_DEFAULTS.mana_steal,
    kill_chance: BASE_COMBAT_DEFAULTS.kill_chance,
  };
}

// =============================================================================
// SECTION C: PLAYER FACTORY — createNewPlayer()
// =============================================================================

/**
 * สร้าง Player object ใหม่สำหรับ New Game
 *
 * ทุกค่าเริ่มต้นยึดตาม Game Bible §2.2, §13.1
 * Equipment / Inventory / Skills / Followers เป็น structure เปล่า
 * รอระบบอื่น (item.js, skill.js, follower.js) มา populate
 *
 * @param {string} name - ชื่อผู้เล่น
 * @param {string} [id] - UUID ถ้าไม่ส่งจะสร้างเอง
 * @returns {Object} Player object ตาม Schema §13.1
 */
function createNewPlayer(name, id = _generateId()) {
  const startLevel = 1;
  const startStats = { ...BASE_STATS_LV1 };

  const tier = getAdvancementTier(startLevel);

  return {
    // ── Identity ─────────────────────────────────────────────────────────────
    id,
    name,

    // ── Level & EXP ──────────────────────────────────────────────────────────
    // @see §2.1
    level:        startLevel,
    exp:          0,
    exp_required: calcExpRequired(startLevel),

    // ── Rank (UI Display) ────────────────────────────────────────────────────
    // @see §2.4 — Rank ไม่ให้โบนัส, โบนัสอยู่ใน Advancement System §3
    rank: tier.rank,

    // ── Primary Stats ────────────────────────────────────────────────────────
    // @see §2.2, §2.3
    stats: {
      str:                  startStats.str,
      con:                  startStats.con,
      agi:                  startStats.agi,
      int:                  startStats.int,
      luck:                 startStats.luck,
      stat_points_available: 0, // Level 1 ไม่มี Points รอ — ได้เมื่อ Level Up
    },

    // ── Combat Stats (คำนวณจาก Primary Stats) ────────────────────────────────
    // @see §5.1, §13.1
    // NOTE: ค่าเหล่านี้คือ "base from primary stats only"
    // ระบบ Equipment และ Skills จะ add/override ค่าเหล่านี้แยกต่างหาก
    combat_stats: buildCombatStatsFromPrimary(startStats),

    // ── Equipment (โครงสร้างเปล่า) ──────────────────────────────────────────
    // @see §4.1, §13.1 — 3 Slots: weapon, armor, accessory
    equipment: {
      weapon:    null, // ItemRef | null
      armor:     null, // ItemRef | null
      accessory: null, // ItemRef | null
    },

    // ── Skills (โครงสร้างเปล่า) ─────────────────────────────────────────────
    // @see §6.1, §6.4, §13.1
    // Slot count ที่ Level 1: Active 2, Passive 2
    skills: {
      active:       [],  // Array<SkillRef>, max = skill_slots.active
      passive:      [],  // Array<SkillRef>, max = skill_slots.passive
      // Slot limits ปัจจุบัน (อัปเดตตาม Level)
      active_slots:  tier.active_slots,
      passive_slots: tier.passive_slots,
    },

    // ── Followers (โครงสร้างเปล่า) ──────────────────────────────────────────
    // @see §8.1, §13.1 — Max 3, ปลดล็อกที่ Lv10
    followers: [], // Array<FollowerRef>, max = PLAYER_CONSTANTS.MAX_FOLLOWERS

    // ── Inventory (โครงสร้างเปล่า) ──────────────────────────────────────────
    // @see §13.1
    inventory: [], // Array<ItemRef>

    // ── Economy ──────────────────────────────────────────────────────────────
    // @see §11.1
    gold: 0,

    // ── World State ──────────────────────────────────────────────────────────
    // @see §9, §13.1
    current_zone:   "zone_1_1",  // Zone เริ่มต้น (รอ Map System กำหนด id จริง)
    unlocked_zones: ["zone_1_1"],

    // ── Action Points ────────────────────────────────────────────────────────
    // @see §13.1 (structure เปล่า, logic regen อยู่ที่ระบบ AP)
    action_points: 0,            // ค่าเริ่มต้น — AP System จะ init
    last_ap_regen: Date.now(),   // timestamp

    // ── Meta (ใช้ภายใน client) ───────────────────────────────────────────────
    _created_at:  Date.now(),
    _updated_at:  Date.now(),
  };
}

// =============================================================================
// SECTION D: PLAYER GETTERS
// =============================================================================

/**
 * ดึงข้อมูล Primary Stat ตัวใดตัวหนึ่ง
 * @param {Object} player
 * @param {"str"|"con"|"agi"|"int"|"luck"} statKey
 * @returns {number}
 */
function getStat(player, statKey) {
  _assertPlayer(player);
  return player.stats[statKey];
}

/**
 * ดึง Combat Stat ตัวใดตัวหนึ่ง
 * @param {Object} player
 * @param {string} combatStatKey - เช่น "hp", "atk", "crit"
 * @returns {number}
 */
function getCombatStat(player, combatStatKey) {
  _assertPlayer(player);
  return player.combat_stats[combatStatKey];
}

/**
 * ตรวจสอบว่าผู้เล่นปลดล็อก Feature หนึ่งๆ แล้วหรือไม่
 * (รวม unlocks จาก Advancement tier ทั้งหมดที่ผ่านมา)
 * @see Game Bible §3.1
 * @param {Object} player
 * @param {string} featureKey - เช่น "follower_system", "elite_shop"
 * @returns {boolean}
 */
function hasUnlocked(player, featureKey) {
  _assertPlayer(player);
  for (const tier of ADVANCEMENT_TABLE) {
    if (tier.min_level > player.level) break;
    if (tier.unlocks && tier.unlocks.includes(featureKey)) return true;
  }
  return false;
}

/**
 * ดึงจำนวน Skill Slots ปัจจุบัน
 * @param {Object} player
 * @returns {{ active: number, passive: number }}
 */
function getSkillSlots(player) {
  _assertPlayer(player);
  return {
    active:  player.skills.active_slots,
    passive: player.skills.passive_slots,
  };
}

/**
 * ดึง Rank ปัจจุบัน
 * @param {Object} player
 * @returns {string}
 */
function getRank(player) {
  _assertPlayer(player);
  return player.rank;
}

// =============================================================================
// SECTION E: PLAYER UPDATERS
// =============================================================================

/**
 * อัปเดตชื่อผู้เล่น
 * @param {Object} player
 * @param {string} newName
 * @returns {Object} player (mutated)
 */
function setPlayerName(player, newName) {
  _assertPlayer(player);
  if (typeof newName !== "string" || newName.trim() === "") {
    throw new Error("Player name must be a non-empty string.");
  }
  player.name = newName.trim();
  _touch(player);
  return player;
}

/**
 * เพิ่ม EXP ให้ผู้เล่น
 * (ฟังก์ชันนี้จัดการเฉพาะการบวก EXP และ Level Up chain — ไม่ทำ side effects อื่น)
 *
 * เมื่อ Level Up:
 *   - level เพิ่ม 1
 *   - stat_points_available เพิ่ม 5 (+ 10 ถ้าเป็น Milestone)
 *   - exp_required อัปเดต
 *   - rank, skill_slots, combat_stats recalculate
 *
 * @see Game Bible §2.1, §2.2, §3.1
 * @param {Object} player
 * @param {number} amount - EXP ที่ได้รับ (ต้องเป็น positive integer)
 * @returns {{ player: Object, leveled_up: boolean, levels_gained: number }}
 */
function addExp(player, amount) {
  _assertPlayer(player);
  if (amount < 0) throw new Error("EXP amount must be non-negative.");

  let leveled_up   = false;
  let levels_gained = 0;

  player.exp += amount;

  // Level Up loop (รองรับ Level หลายครั้งจาก EXP จำนวนมาก)
  while (
    player.level < PLAYER_CONSTANTS.MAX_LEVEL &&
    player.exp >= player.exp_required
  ) {
    player.exp      -= player.exp_required;
    player.level    += 1;
    levels_gained   += 1;
    leveled_up       = true;

    // Stat Points ปกติ
    player.stats.stat_points_available += PLAYER_CONSTANTS.STAT_POINTS_PER_LEVEL;

    // Bonus Stat Points ทุก Milestone (10, 20, 30, ...)
    // @see §2.2, §3.1
    if (player.level % PLAYER_CONSTANTS.MILESTONE_INTERVAL === 0) {
      player.stats.stat_points_available += PLAYER_CONSTANTS.BONUS_STAT_POINTS_MILESTONE;
    }

    // อัปเดต EXP Required สำหรับ Level ใหม่
    player.exp_required = calcExpRequired(player.level);

    // อัปเดต Advancement-derived fields
    _applyAdvancement(player);
  }

  // ถ้าถึง Max Level ล็อก EXP ที่ 0
  if (player.level >= PLAYER_CONSTANTS.MAX_LEVEL) {
    player.exp = 0;
  }

  // หลังจาก level up ต้อง recalculate stats รวมอุปกรณ์อีกครั้ง
  _recalculateCombatStatsWithEquipment(player);

  _touch(player);
  return { player, leveled_up, levels_gained };
}

/**
 * จัดสรร Stat Point ให้ Primary Stat ตัวหนึ่ง
 * @see Game Bible §2.2
 * @param {Object} player
 * @param {"str"|"con"|"agi"|"int"|"luck"} statKey
 * @param {number} points - จำนวน Points ที่จะใส่ (default 1)
 * @returns {Object} player (mutated)
 */
function allocateStat(player, statKey, points = 1) {
  _assertPlayer(player);

  const VALID_STATS = ["str", "con", "agi", "int", "luck"];
  if (!VALID_STATS.includes(statKey)) {
    throw new Error(`Invalid stat key: "${statKey}". Must be one of: ${VALID_STATS.join(", ")}`);
  }
  if (points <= 0 || !Number.isInteger(points)) {
    throw new Error("Points must be a positive integer.");
  }
  if (player.stats.stat_points_available < points) {
    throw new Error(
      `Not enough stat points. Available: ${player.stats.stat_points_available}, requested: ${points}`
    );
  }

  player.stats[statKey]                += points;
  player.stats.stat_points_available   -= points;

  // Recalculate base stats (ไม่รวม equipment) แล้วรวม equipment อีกครั้ง
  _recalculateCombatStatsWithEquipment(player);
  _touch(player);
  return player;
}

/**
 * อัปเดต HP ปัจจุบัน (เช่น รับดาเมจ หรือ รับการรักษา)
 * ค่า hp ถูก clamp ระหว่าง 0 ถึง hp_max
 * @param {Object} player
 * @param {number} delta - ค่าที่เปลี่ยน (ลบ = ดาเมจ, บวก = รักษา)
 * @returns {Object} player (mutated)
 */
function updateHp(player, delta) {
  _assertPlayer(player);
  player.combat_stats.hp = Math.max(
    0,
    Math.min(player.combat_stats.hp_max, player.combat_stats.hp + delta)
  );
  _touch(player);
  return player;
}

/**
 * อัปเดต MP ปัจจุบัน
 * ค่า mp ถูก clamp ระหว่าง 0 ถึง mp_max
 * @param {Object} player
 * @param {number} delta
 * @returns {Object} player (mutated)
 */
function updateMp(player, delta) {
  _assertPlayer(player);
  player.combat_stats.mp = Math.max(
    0,
    Math.min(player.combat_stats.mp_max, player.combat_stats.mp + delta)
  );
  _touch(player);
  return player;
}

/**
 * เพิ่ม/ลด Gold
 * @see Game Bible §11.1, §15.1 [R5] MAX_GOLD = 9,999,999
 * @param {Object} player
 * @param {number} delta - ค่าที่เปลี่ยน (ลบ = ใช้จ่าย)
 * @returns {Object} player (mutated)
 * @throws {Error} ถ้า Gold ไม่พอ (ติดลบ)
 */
function updateGold(player, delta) {
  _assertPlayer(player);
  const newGold = player.gold + delta;
  if (newGold < 0) {
    throw new Error(`Insufficient gold. Has: ${player.gold}, needs: ${Math.abs(delta)}`);
  }
  player.gold = Math.min(newGold, PLAYER_CONSTANTS.MAX_GOLD);
  _touch(player);
  return player;
}

/**
 * ฟื้น HP และ MP เต็ม (ใช้ตอน Respawn หลังแพ้ — HP เหลือ 1 ตาม §12.9)
 * @see Game Bible §12.9: "ผู้เล่นไม่ตาย — HP เหลือ 1"
 * @param {Object} player
 * @param {"full"|"defeat"} mode
 *   - "full"   : ฟื้น HP/MP เต็ม (เช่น ใช้ยา หรือ Rest)
 *   - "defeat" : HP เหลือ 1 (ตามกฎ Defeat §12.9), MP ไม่เปลี่ยน
 * @returns {Object} player (mutated)
 */
function restoreVitals(player, mode = "full") {
  _assertPlayer(player);
  if (mode === "full") {
    player.combat_stats.hp = player.combat_stats.hp_max;
    player.combat_stats.mp = player.combat_stats.mp_max;
  } else if (mode === "defeat") {
    player.combat_stats.hp = 1; // §12.9
  }
  _touch(player);
  return player;
}

/**
 * อัปเดต Zone ปัจจุบันและเพิ่มเข้า unlocked_zones ถ้ายังไม่มี
 * @param {Object} player
 * @param {string} zoneId
 * @returns {Object} player (mutated)
 */
function setCurrentZone(player, zoneId) {
  _assertPlayer(player);
  player.current_zone = zoneId;
  if (!player.unlocked_zones.includes(zoneId)) {
    player.unlocked_zones.push(zoneId);
  }
  _touch(player);
  return player;
}

// =============================================================================
// SECTION F: SERIALIZATION (Save / Load)
// =============================================================================

/**
 * แปลง Player object เป็น JSON string สำหรับบันทึก
 * @param {Object} player
 * @returns {string}
 */
function serializePlayer(player) {
  _assertPlayer(player);
  return JSON.stringify(player);
}

/**
 * โหลด Player จาก JSON string (เช่น จาก localStorage หรือ Server)
 * @param {string} jsonString
 * @returns {Object} player
 */
function deserializePlayer(jsonString) {
  try {
    const player = JSON.parse(jsonString);
    _assertPlayer(player);
    return player;
  } catch (e) {
    throw new Error(`Failed to deserialize player: ${e.message}`);
  }
}

// =============================================================================
// SECTION G: PRIVATE HELPERS (prefix _ = internal use only)
// =============================================================================

/**
 * ตรวจสอบว่า object เป็น Player ที่ถูกต้อง
 * @param {*} player
 */
function _assertPlayer(player) {
  if (!player || typeof player !== "object") {
    throw new Error("Invalid player object.");
  }
  if (!player.id || !player.name || player.level === undefined) {
    throw new Error("Player object is missing required fields (id, name, level).");
  }
}

/**
 * สร้าง ID แบบง่าย (ใช้ชั่วคราว — Production ควรใช้ UUID library)
 * @returns {string}
 */
function _generateId() {
  return "player_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7);
}

/**
 * อัปเดต _updated_at timestamp
 * @param {Object} player
 */
function _touch(player) {
  player._updated_at = Date.now();
}

/**
 * Apply Advancement bonuses เมื่อ Level ถึง milestone ใหม่
 * อัปเดต: rank, skill_slots, (combat stats จะถูกจัดการใน recalculate)
 * @see Game Bible §3.1
 * @param {Object} player
 */
function _applyAdvancement(player) {
  const tier = getAdvancementTier(player.level);

  // อัปเดต Rank
  player.rank = tier.rank;

  // อัปเดต Skill Slots
  player.skills.active_slots  = tier.active_slots;
  player.skills.passive_slots = tier.passive_slots;

  // CRIT_DAMAGE bonus จาก Advancement (เช่น +10% ที่ Lv20)
  let critDmgBonus = 0;
  for (const t of ADVANCEMENT_TABLE) {
    if (t.min_level > player.level) break;
    if (t.crit_damage_bonus) critDmgBonus += t.crit_damage_bonus;
  }
  // Crit damage bonus จะถูกนำไปใช้ใน _recalculateBaseStats ข้างล่าง
  // เราไม่ตั้งค่าโดยตรงเดี๋ยวนี้ เดี๋ยว recalculate จัดการให้
}

/**
 * คำนวณ Base Combat Stats จาก Primary Stats โดยรวม Advancement multiplier (สะสม)
 * และรวม CRIT_DAMAGE bonus จาก Advancement
 * @param {Object} player
 * @returns {Object} base combat stats (ยังไม่รวม equipment)
 */
function _calculateBaseStatsWithAdvancement(player) {
  // หา cumulative multiplier สำหรับ Primary Stats (Lv50: 1.1, Lv70: 1.2, Lv80: 1.3 -> คูณกัน)
  let baseMultiplier = 1.0;
  for (const tier of ADVANCEMENT_TABLE) {
    if (tier.min_level > player.level) break;
    if (tier.base_stat_multiplier) {
      baseMultiplier *= tier.base_stat_multiplier;   // ✅ แก้เป็นสะสม
    }
  }

  const effectiveStats = {
    str:  player.stats.str  * baseMultiplier,
    con:  player.stats.con  * baseMultiplier,
    agi:  player.stats.agi  * baseMultiplier,
    int:  player.stats.int  * baseMultiplier,
    luck: player.stats.luck * baseMultiplier,
  };

  const baseStats = buildCombatStatsFromPrimary(effectiveStats);

  // เพิ่ม CRIT_DAMAGE bonus จาก Advancement (Lv20 +10%)
  let critDmgBonus = 0;
  for (const tier of ADVANCEMENT_TABLE) {
    if (tier.min_level > player.level) break;
    if (tier.crit_damage_bonus) critDmgBonus += tier.crit_damage_bonus;
  }
  baseStats.crit_damage += critDmgBonus;

  return baseStats;
}

/**
 * Recalculate combat stats เฉพาะ base (primary + advancement) โดยไม่แตะ equipment
 * ใช้ภายในก่อนเรียก equipment module
 * @param {Object} player
 * @returns {Object} baseStats
 */
function _recalculateBaseStats(player) {
  const baseStats = _calculateBaseStatsWithAdvancement(player);
  // เก็บ base stats ไว้ใน property ชั่วคราว
  player._base_combat_stats = baseStats;
  return baseStats;
}

/**
 * Recalculate combat stats พร้อมรวมอุปกรณ์ (เรียกหลังจาก base stats เปลี่ยน)
 * วิธีนี้จะ:
 *   1. คำนวณ base stats (primary + advancement) และเก็บใน player._base_combat_stats
 *   2. ถ้ามี EquipmentModule ให้เรียกให้มันรวมโบนัสจากอุปกรณ์
 *   3. ถ้าไม่มี equipment module ก็ fallback ใช้ base stats เฉย ๆ
 * @param {Object} player
 */
function _recalculateCombatStatsWithEquipment(player) {
  // 1. คำนวณ base stats (พร้อม advancement)
  const baseStats = _calculateBaseStatsWithAdvancement(player);
  player._base_combat_stats = baseStats;

  // 2. ถ้ามี equipment module ให้มันรวมโบนัส
  if (typeof EquipmentModule !== 'undefined' && EquipmentModule.recalculateEquipmentStats) {
    EquipmentModule.recalculateEquipmentStats(player);
  } else {
    // fallback: ใช้ base stats เฉย ๆ (ไม่มีการใส่ equipment)
    Object.assign(player.combat_stats, baseStats);
    // ปรับ hp/mp ไม่ให้เกิน max
    player.combat_stats.hp = Math.min(player.com_bat_stats.hp_max, player.combat_stats.hp);
    player.combat_stats.mp = Math.min(player.combat_stats.mp_max, player.combat_stats.mp);
  }

  // 3. ลบ property ชั่วคราว (เผื่อ equipment module ใช้แล้วลบให้ด้วย)
  delete player._base_combat_stats;
}

// =============================================================================
// SECTION H: PUBLIC API EXPORT
// =============================================================================

/**
 * PlayerModule — API สาธารณะสำหรับระบบอื่น
 *
 * ระบบภายนอกเรียกใช้ผ่าน PlayerModule.xxx() เท่านั้น
 * ตัวแปรและ Helper ส่วนตัว (prefix _) ไม่ได้ Expose
 */
const PlayerModule = Object.freeze({
  // Constants (read-only)
  CONSTANTS:     PLAYER_CONSTANTS,
  ADVANCEMENT:   ADVANCEMENT_TABLE,
  STAT_CAPS:     DEFAULT_STAT_CAPS,

  // Factory
  createNewPlayer,

  // Getters
  getStat,
  getCombatStat,
  hasUnlocked,
  getSkillSlots,
  getRank,

  // Updaters
  setPlayerName,
  addExp,
  allocateStat,
  updateHp,
  updateMp,
  updateGold,
  restoreVitals,
  setCurrentZone,

  // Serialization
  serializePlayer,
  deserializePlayer,

  // Pure calculation helpers (ใช้ได้จากภายนอกเพื่อ Preview ค่า)
  calcExpRequired,
  calcMaxHp,
  calcMaxMp,
  calcBaseAtk,
  getAdvancementTier,
  calcSkillSlots,

  // Advanced stat calculation (สำหรับระบบอื่น เช่น equipment)
  calculateBaseCombatStatsWithMultiplier: _calculateBaseStatsWithAdvancement,
});

// รองรับทั้ง Browser (window) และ Node.js (module.exports)
if (typeof window !== "undefined") {
  window.PlayerModule = PlayerModule;
} else if (typeof module !== "undefined" && module.exports) {
  module.exports = PlayerModule;
}
