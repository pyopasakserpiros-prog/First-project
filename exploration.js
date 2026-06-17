/**
 * =============================================================================
 * js/exploration.js — Jianghu RPG
 * Exploration & Action Points System
 * =============================================================================
 *
 * รับผิดชอบ:
 *   - จัดการ Action Points (AP) — รีเจน, ใช้, เช็ค
 *   - ดำเนินการสำรวจ (ลาดตระเวน, ฝึกฝน, ค้นหา)
 *   - สุ่มศัตรูตามโซน (จาก EnemyDatabase)
 *   - สุ่ม Event (จาก EventDatabase)
 *   - สุ่ม Treasure
 *   - ปลดล็อกโซนใหม่ตามเงื่อนไข
 *   - เทเลพอร์ตกลับบ้าน
 *
 * อ้างอิง: Game Bible Sec 9 (Map System), Sec 10 (Event System)
 * =============================================================================
 */

"use strict";

import { EnemyDatabase } from './enemy.js';
import { BossDatabase } from './boss database.js';
import miniBossDatabase from './mini_boss.js';
import { EventDatabase } from './event.js';
import { MapDatabase } from './map.js';
import { PlayerModule } from './player.js';
import { InventoryModule } from './inventory.js';
import { EquipmentModule } from './equipment edit.js';
import { SaveModule } from './save.js';

// =============================================================================
// CONSTANTS
// =============================================================================

const EXPLORATION_CONSTANTS = Object.freeze({
    // AP System (Sec 9.4)
    MAX_AP: 20,
    AP_REGEN_INTERVAL: 5 * 60 * 1000, // 5 นาที (มิลลิวินาที)
    AP_COST_EXPLORE: 1,
    AP_COST_TRAIN: 1,
    AP_COST_SEARCH: 1,

    // Exploration Rates (Sec 9.5)
    RATES: Object.freeze({
        explore: {
            normal_enemy: 55,
            elite: 10,
            event: 25,
            treasure: 10,
        },
    }),

    // Zone Unlock (Sec 9.3)
    START_ZONE: 'MAP-001',

    // Home Zone (for teleport when defeated)
    HOME_ZONE: 'MAP-001',
});

// =============================================================================
// STATE (per session)
// =============================================================================

let _lastApRegen = Date.now();

// =============================================================================
// AP MANAGEMENT
// =============================================================================

/**
 * คำนวณ AP ปัจจุบัน (รวมการรีเจนตามเวลา)
 * @param {Object} player
 * @returns {number} AP ปัจจุบัน (0 - MAX_AP)
 */
function getAP(player) {
    if (!player) return 0;
    const now = Date.now();
    const elapsed = now - (player.last_ap_regen || _lastApRegen);
    const regenCount = Math.floor(elapsed / EXPLORATION_CONSTANTS.AP_REGEN_INTERVAL);
    let ap = (player.action_points || 0) + regenCount;
    if (ap > EXPLORATION_CONSTANTS.MAX_AP) ap = EXPLORATION_CONSTANTS.MAX_AP;
    return ap;
}

/**
 * อัปเดต AP หลังจากรีเจน (sync กับเวลา)
 * @param {Object} player
 * @returns {number} AP ใหม่
 */
function refreshAP(player) {
    if (!player) return 0;
    const now = Date.now();
    const elapsed = now - (player.last_ap_regen || _lastApRegen);
    const regenCount = Math.floor(elapsed / EXPLORATION_CONSTANTS.AP_REGEN_INTERVAL);
    let ap = (player.action_points || 0) + regenCount;
    if (ap > EXPLORATION_CONSTANTS.MAX_AP) ap = EXPLORATION_CONSTANTS.MAX_AP;
    player.action_points = ap;
    player.last_ap_regen = now - (elapsed % EXPLORATION_CONSTANTS.AP_REGEN_INTERVAL);
    _lastApRegen = player.last_ap_regen;
    return ap;
}

/**
 * ใช้ AP (ลดลง) หลังจากตรวจสอบว่ามีพอ
 * @param {Object} player
 * @param {number} amount
 * @returns {boolean} สำเร็จหรือไม่
 */
function useAP(player, amount = 1) {
    if (!player) return false;
    const current = getAP(player);
    if (current < amount) return false;
    player.action_points = current - amount;
    player.last_ap_regen = Date.now();
    _lastApRegen = player.last_ap_regen;
    return true;
}

/**
 * รีเซ็ต AP (ใช้ตอน login ครั้งแรกของวัน)
 * @param {Object} player
 */
function resetAP(player) {
    if (!player) return;
    player.action_points = EXPLORATION_CONSTANTS.MAX_AP;
    player.last_ap_regen = Date.now();
    _lastApRegen = player.last_ap_regen;
}

// =============================================================================
// ZONE HELPERS
// =============================================================================

/**
 * หาข้อมูลโซนจาก MapDatabase
 * @param {string} zoneId
 * @returns {Object|null}
 */
function getZoneData(zoneId) {
    return MapDatabase.find(m => m.Map_ID === zoneId) || null;
}

/**
 * หา enemies ในโซน (จาก EnemyDatabase)
 * @param {string} zoneId
 * @returns {Array}
 */
function getEnemiesInZone(zoneId) {
    return EnemyDatabase.filter(e => e["Map ID"] === zoneId);
}

/**
 * หา Boss ในโซน (จาก BossDatabase)
 * @param {string} zoneId
 * @returns {Object|null}
 */
function getBossInZone(zoneId) {
    return BossDatabase.find(b => b.mapId === zoneId) || null;
}

/**
 * หา Mini-Boss ในโซน (จาก miniBossDatabase)
 * @param {string} zoneId
 * @returns {Object|null}
 */
function getMiniBossInZone(zoneId) {
    return miniBossDatabase.find(b => b.mapId === zoneId) || null;
}

/**
 * ตรวจสอบว่าผู้เล่นปลดล็อกโซนนี้แล้วหรือยัง
 * @param {Object} player
 * @param {string} zoneId
 * @returns {boolean}
 */
function isZoneUnlocked(player, zoneId) {
    return player.unlocked_zones && player.unlocked_zones.includes(zoneId);
}

/**
 * ปลดล็อกโซนใหม่ (ถ้าเงื่อนไขผ่าน)
 * @param {Object} player
 * @param {string} zoneId
 * @returns {boolean} สำเร็จหรือไม่
 */
function unlockZone(player, zoneId) {
    if (!player) return false;
    if (isZoneUnlocked(player, zoneId)) return true; // ปลดล็อกแล้ว

    // หาเงื่อนไขจาก MapDatabase
    const zone = getZoneData(zoneId);
    if (!zone) return false;

    // เงื่อนไขจาก "เงื่อนไขปลดล็อก" (อาจมีหลายรูปแบบ)
    const condition = zone["เงื่อนไขปลดล็อก"] || '';
    if (condition) {
        // ตรวจสอบเงื่อนไข
        const levelMatch = condition.match(/Player Level\s*[>=]+\s*(\d+)/i);
        if (levelMatch) {
            const requiredLevel = parseInt(levelMatch[1], 10);
            if (player.level < requiredLevel) return false;
        }
        // ตรวจสอบการปราบบอส
        const bossMatch = condition.match(/ชนะ Area Boss ของ\s*([A-Z0-9-]+)/i);
        if (bossMatch) {
            const requiredBossZone = bossMatch[1];
            // สมมติว่ามี flag ใน player ว่า defeated_bosses: []
            if (!player.defeated_bosses || !player.defeated_bosses.includes(requiredBossZone)) {
                return false;
            }
        }
        // ตรวจสอบ Mini-Boss
        const miniBossMatch = condition.match(/ชนะ Mini-Boss ของ\s*([A-Z0-9-]+)/i);
        if (miniBossMatch) {
            const requiredMiniBossZone = miniBossMatch[1];
            if (!player.defeated_mini_bosses || !player.defeated_mini_bosses.includes(requiredMiniBossZone)) {
                return false;
            }
        }
    }

    // ผ่านเงื่อนไข ปลดล็อก
    if (!player.unlocked_zones) player.unlocked_zones = [];
    if (!player.unlocked_zones.includes(zoneId)) {
        player.unlocked_zones.push(zoneId);
    }
    return true;
}

/**
 * เทเลพอร์ตกลับบ้าน
 * @param {Object} player
 */
function teleportHome(player) {
    if (!player) return;
    player.current_zone = EXPLORATION_CONSTANTS.HOME_ZONE;
    // ฟื้นฟู HP/MP บ้างเล็กน้อย (Sec 12.9)
    if (player.combat_stats) {
        player.combat_stats.hp = Math.max(1, player.combat_stats.hp);
    }
}

// =============================================================================
// CORE EXPLORATION ACTIONS
// =============================================================================

/**
 * สุ่มศัตรูจากโซน (โดยคำนึงถึง Elite และ Normal)
 * @param {string} zoneId
 * @param {number} playerLevel
 * @returns {Object|null} enemy data หรือ null
 */
function rollEnemy(zoneId, playerLevel) {
    const enemies = getEnemiesInZone(zoneId);
    if (enemies.length === 0) return null;

    // แยก Normal และ Elite
    const normals = enemies.filter(e => e["ประเภท"] === "Normal" || !e["ประเภท"]);
    const elites = enemies.filter(e => e["ประเภท"] === "Elite");

    // ใช้ Rate จาก Sec 9.5
    const normalRate = EXPLORATION_CONSTANTS.RATES.explore.normal_enemy;
    const eliteRate = EXPLORATION_CONSTANTS.RATES.explore.elite;

    const roll = Math.random() * 100;
    let pool = [];
    if (roll < eliteRate && elites.length > 0) {
        pool = elites;
    } else if (roll < normalRate + eliteRate && normals.length > 0) {
        pool = normals;
    } else {
        // Fallback
        pool = normals.length > 0 ? normals : enemies;
    }

    // สุ่มตัวจาก pool
    return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * สุ่ม Event จาก EventDatabase (ตาม mapLevel)
 * @param {number} mapLevel
 * @param {number} playerLuck
 * @returns {Object|null}
 */
function rollEvent(mapLevel, playerLuck = 0) {
    const pool = EventDatabase.filter(e => e.mapLevel === mapLevel || e.mapLevel === 0);
    if (pool.length === 0) return null;

    // ใช้ LUCK ปรับอัตรา (Sec 10.2)
    // Positive: 45% + LUCK*0.15%, Negative: 20% - LUCK*0.1%, Neutral: ที่เหลือ
    // เราจะสุ่มตาม type ก่อน
    const luckBonus = playerLuck * 0.0015; // 0.15% ต่อ LUCK

    // ฟังก์ชันสุ่มตาม type
    const types = pool.map(e => e.type).filter(t => t);
    const typeWeights = {
        positive: 45 + luckBonus * 100,
        neutral: 35,
        negative: 20 - luckBonus * 100,
    };
    // ปรับ neutral ให้ผลรวม 100
    const total = typeWeights.positive + typeWeights.neutral + typeWeights.negative;
    let roll = Math.random() * total;
    let selectedType = 'neutral';
    if (roll < typeWeights.positive) selectedType = 'positive';
    else if (roll < typeWeights.positive + typeWeights.neutral) selectedType = 'neutral';
    else selectedType = 'negative';

    // กรองตาม type
    const candidates = pool.filter(e => e.type === selectedType);
    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * สุ่ม Treasure (ของรางวัล)
 * @param {string} zoneId
 * @param {number} playerLevel
 * @returns {Object} { gold, itemName?, exp? }
 */
function rollTreasure(zoneId, playerLevel) {
    const goldMin = 10 + playerLevel * 2;
    const goldMax = 30 + playerLevel * 5;
    const gold = Math.floor(Math.random() * (goldMax - goldMin + 1)) + goldMin;
    const exp = Math.floor(Math.random() * (10 + playerLevel * 1.5)) + 5;
    const hasItem = Math.random() < 0.3;
    return {
        gold,
        exp,
        itemName: hasItem ? `สมบัติลับระดับ ${Math.floor(playerLevel/10)+1}` : null,
    };
}

// =============================================================================
// MAIN EXPLORATION FUNCTION
// =============================================================================

/**
 * ดำเนินการสำรวจ (ลาดตระเวน, ฝึกฝน, ค้นหา)
 * @param {Object} player
 * @param {string} action - "explore" | "train" | "search"
 * @returns {Object} ผลลัพธ์ { type, data, ap_used }
 */
function performAction(player, action) {
    if (!player) return { type: 'error', message: 'ไม่มีผู้เล่น' };

    // ตรวจสอบ AP
    if (!useAP(player, 1)) {
        return { type: 'error', message: 'AP ไม่เพียงพอ' };
    }

    const zoneId = player.current_zone || EXPLORATION_CONSTANTS.START_ZONE;
    const level = player.level || 1;
    const luck = player.stats?.luck || 0;

    switch (action) {
        case 'explore': {
            // 1. สุ่มศัตรู (55% Normal, 10% Elite)
            const enemy = rollEnemy(zoneId, level);
            if (enemy) {
                const enemyType = enemy["ประเภท"] || "Normal";
                return {
                    type: 'battle',
                    data: { enemy, enemyType },
                    ap_used: 1,
                };
            }
            // 2. ถ้าไม่มีศัตรู สุ่ม Event หรือ Treasure
            const event = rollEvent(Math.floor((level+9)/10), luck);
            if (event) {
                return {
                    type: 'event',
                    data: { event },
                    ap_used: 1,
                };
            }
            // 3. Treasure
            const treasure = rollTreasure(zoneId, level);
            return {
                type: 'treasure',
                data: treasure,
                ap_used: 1,
            };
        }

        case 'train': {
            // ฝึกฝน: ได้ EXP เล็กน้อย (80% ของปกติ) ไม่มี Drop
            const baseExp = 10 + level * 2;
            const expGain = Math.floor(baseExp * 0.8);
            PlayerModule.addExp(player, expGain);
            // ฟื้น HP/MP เล็กน้อย
            if (player.combat_stats) {
                const hpRegen = Math.floor(player.combat_stats.hp_max * 0.05);
                const mpRegen = Math.floor(player.combat_stats.mp_max * 0.05);
                player.combat_stats.hp = Math.min(player.combat_stats.hp_max, player.combat_stats.hp + hpRegen);
                player.combat_stats.mp = Math.min(player.combat_stats.mp_max, player.combat_stats.mp + mpRegen);
            }
            return {
                type: 'train',
                data: { exp: expGain, hpRegen, mpRegen },
                ap_used: 1,
            };
        }

        case 'search': {
            // ค้นหา: โอกาสเจอของดีขึ้น 30% แต่เจอศัตรูบ่อยขึ้น 20%
            // เราให้โอกาสเจอ Treasure 40% (จากปกติ 10%) และ Event 35% (จาก 25%)
            // ศัตรูเพิ่มเป็น 25% (จาก 55%)
            const roll = Math.random() * 100;
            if (roll < 40) {
                // Treasure
                const treasure = rollTreasure(zoneId, level);
                // เพิ่มโบนัสจากการค้นหา
                treasure.gold = Math.floor(treasure.gold * 1.3);
                treasure.exp = Math.floor(treasure.exp * 1.3);
                return {
                    type: 'treasure',
                    data: treasure,
                    ap_used: 1,
                };
            } else if (roll < 75) {
                // Event
                const event = rollEvent(Math.floor((level+9)/10), luck);
                if (event) {
                    return {
                        type: 'event',
                        data: { event },
                        ap_used: 1,
                    };
                }
            } else {
                // Enemy (พบศัตรู)
                const enemy = rollEnemy(zoneId, level);
                if (enemy) {
                    const enemyType = enemy["ประเภท"] || "Normal";
                    return {
                        type: 'battle',
                        data: { enemy, enemyType },
                        ap_used: 1,
                    };
                }
            }
            // ถ้าไม่มีอะไร เจอของเปล่า
            return {
                type: 'nothing',
                data: { message: 'ค้นหาไม่พบอะไร' },
                ap_used: 1,
            };
        }

        default:
            return { type: 'error', message: 'Action ไม่ถูกต้อง' };
    }
}

// =============================================================================
// BOSS ENCOUNTER
// =============================================================================

/**
 * เริ่มการต่อสู้กับ Boss (Area Boss หรือ Mini-Boss)
 * @param {Object} player
 * @param {string} type - "area" หรือ "mini"
 * @returns {Object} { type, data, ap_used? }
 */
function startBossFight(player, type = 'area') {
    if (!player) return { type: 'error', message: 'ไม่มีผู้เล่น' };
    const zoneId = player.current_zone || EXPLORATION_CONSTANTS.START_ZONE;

    let boss = null;
    let bossType = '';
    if (type === 'area') {
        boss = getBossInZone(zoneId);
        bossType = 'area_boss';
    } else if (type === 'mini') {
        boss = getMiniBossInZone(zoneId);
        bossType = 'mini_boss';
    }

    if (!boss) {
        return { type: 'error', message: `ไม่มี ${type === 'area' ? 'Area Boss' : 'Mini-Boss'} ในโซนนี้` };
    }

    // ตรวจสอบว่าเคยปราบแล้วหรือยัง (สำหรับ Mini-Boss รีเซ็ตรายวัน, Area Boss รายสัปดาห์)
    // เก็บ timestamp ไว้ใน player.defeated_bosses_timestamps
    const now = Date.now();
    const key = type === 'area' ? boss.id : boss.bossId;
    const lastDefeat = player._boss_timestamps?.[key] || 0;
    const resetPeriod = type === 'area' ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 7 days / 1 day
    if (lastDefeat && (now - lastDefeat) < resetPeriod) {
        const remaining = Math.ceil((resetPeriod - (now - lastDefeat)) / (60 * 60 * 1000));
        return {
            type: 'error',
            message: `Boss ยังไม่รีเซ็ต (เหลือ ${remaining} ชั่วโมง)`,
        };
    }

    // ใช้ AP 1 ครั้งสำหรับการปราบบอส
    if (!useAP(player, 1)) {
        return { type: 'error', message: 'AP ไม่เพียงพอ' };
    }

    return {
        type: 'boss_battle',
        data: { boss, bossType, bossId: key },
        ap_used: 1,
    };
}

// =============================================================================
// POST-BATTLE PROCESSING (เรียกหลังจาก battle.js จบ)
// =============================================================================

/**
 * บันทึกผลการปราบบอส (เมื่อชนะ)
 * @param {Object} player
 * @param {string} bossId
 * @param {string} bossType - "area_boss" หรือ "mini_boss"
 */
function recordBossDefeat(player, bossId, bossType) {
    if (!player) return;
    if (!player._boss_timestamps) player._boss_timestamps = {};
    player._boss_timestamps[bossId] = Date.now();

    // เก็บว่าเคยปราบแล้ว (สำหรับการปลดล็อก)
    if (bossType === 'area_boss') {
        if (!player.defeated_bosses) player.defeated_bosses = [];
        if (!player.defeated_bosses.includes(bossId)) {
            player.defeated_bosses.push(bossId);
        }
    } else if (bossType === 'mini_boss') {
        if (!player.defeated_mini_bosses) player.defeated_mini_bosses = [];
        if (!player.defeated_mini_bosses.includes(bossId)) {
            player.defeated_mini_bosses.push(bossId);
        }
    }
}

// =============================================================================
// PUBLIC API
// =============================================================================

export const ExplorationModule = Object.freeze({
    // AP
    getAP,
    refreshAP,
    useAP,
    resetAP,

    // Zone
    getZoneData,
    getEnemiesInZone,
    getBossInZone,
    getMiniBossInZone,
    isZoneUnlocked,
    unlockZone,
    teleportHome,

    // Core Actions
    performAction,
    startBossFight,
    rollEnemy,
    rollEvent,
    rollTreasure,

    // Post-battle
    recordBossDefeat,

    // Constants
    CONSTANTS: EXPLORATION_CONSTANTS,
});

// รองรับทั้ง Browser และ Node.js
if (typeof window !== 'undefined') {
    window.ExplorationModule = ExplorationModule;
}
export default ExplorationModule;