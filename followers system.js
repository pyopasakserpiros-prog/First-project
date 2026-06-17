/**
 * =============================================================================
 * js/follower.js — Jianghu RPG
 * Follower System Module
 * =============================================================================
 *
 * รับผิดชอบ:
 *   - สร้างผู้ติดตาม (Generate Follower)
 *   - จ้างผู้ติดตาม (Recruit)
 *   - ปลดผู้ติดตาม (Dismiss)
 *   - คำนวณค่าจ้างรายวัน
 *   - ตรวจสอบว่าสามารถจ้างเพิ่มได้หรือไม่
 *
 * อ้างอิง: Game Bible §8 (Follower System)
 * =============================================================================
 */

"use strict";

// =============================================================================
// IMPORTS
// =============================================================================

import {
    NAME_POOL,
    TITLE_POOL,
    COMBAT_ARCHETYPES,
    TALENT_POOL,
    FOLLOWER_RARITIES,
    GROWTH_QUALITIES,
    GENERATION_CONFIG,
    DAILY_UPKEEP_MULTIPLIERS,
    SPECIAL_FOLLOWERS,
} from './followers database.js';

import { SkillDatabase } from './skill database.js';
import { PlayerModule } from './player.js';

// =============================================================================
// CONSTANTS
// =============================================================================

const FOLLOWER_CONSTANTS = Object.freeze({
    MAX_FOLLOWERS: 3,
    BASE_UPKEEP_PER_LEVEL: 5,
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * สุ่มตัวเลขในช่วง [min, max]
 */
function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * สุ่มเลือกจาก array
 */
function randomPick(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * สุ่มเลือกตามน้ำหนัก
 */
function weightedRandomPick(items, weightKey = 'chance') {
    const total = items.reduce((sum, item) => sum + (item[weightKey] || 0), 0);
    if (total === 0) return randomPick(items);
    let roll = Math.random() * total;
    for (const item of items) {
        roll -= (item[weightKey] || 0);
        if (roll <= 0) return item;
    }
    return items[items.length - 1];
}

// =============================================================================
// FOLLOWER GENERATION
// =============================================================================

/**
 * สุ่มระดับความหายาก (Rarity) ของผู้ติดตาม
 * @param {string} source - แหล่งที่มา: "city_cheap", "city_expensive", "event", "mini_boss", "area_boss"
 * @returns {string} ชื่อ rarity (ขาว, เขียว, ฟ้า, ม่วง, ทอง, แดง)
 */
function rollFollowerRarity(source = 'city_cheap') {
    const rates = GENERATION_CONFIG.rarityDropRates[source] || GENERATION_CONFIG.rarityDropRates['city_cheap'];
    const total = Object.values(rates).reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;

    // แปลง key จาก "ขาว" เป็น "white" เพื่อใช้ในภายหลัง
    const rarityMap = {
        'ขาว': 'white',
        'เขียว': 'green',
        'ฟ้า': 'blue',
        'ม่วง': 'purple',
        'ทอง': 'gold',
        'แดง': 'red',
    };

    const reverseMap = {
        'white': 'ขาว',
        'green': 'เขียว',
        'blue': 'ฟ้า',
        'purple': 'ม่วง',
        'gold': 'ทอง',
        'red': 'แดง',
    };

    for (const [thaiName, weight] of Object.entries(rates)) {
        roll -= weight;
        if (roll <= 0) {
            return reverseMap[thaiName] || thaiName;
        }
    }

    // Fallback
    return 'ขาว';
}

/**
 * สุ่มชื่อผู้ติดตาม
 * @returns {string}
 */
function generateFollowerName() {
    const name = randomPick(NAME_POOL);
    return name ? name.name : 'ผู้ติดตาม';
}

/**
 * สุ่มตำแหน่ง (Title)
 * @returns {string}
 */
function generateFollowerTitle() {
    const title = randomPick(TITLE_POOL);
    return title ? title.title : 'จอมยุทธ์';
}

/**
 * สุ่ม Combat Archetype
 * @returns {Object}
 */
function randomArchetype() {
    return randomPick(COMBAT_ARCHETYPES) || COMBAT_ARCHETYPES[0];
}

/**
 * สุ่มพรสวรรค์ (Talent) ตาม Rarity
 * @param {string} rarity - "ขาว", "เขียว", "ฟ้า", "ม่วง", "ทอง", "แดง"
 * @param {number} count - จำนวนที่ต้องการ
 * @returns {Array} array of talent objects
 */
function rollTalents(rarity, count = 1) {
    const rarityMap = {
        'ขาว': 'Common',
        'เขียว': 'Uncommon',
        'ฟ้า': 'Rare',
        'ม่วง': 'Epic',
        'ทอง': 'Legendary',
        'แดง': 'Mythic',
    };

    const tierMap = {
        'ขาว': ['Common'],
        'เขียว': ['Common', 'Uncommon'],
        'ฟ้า': ['Uncommon', 'Rare'],
        'ม่วง': ['Rare', 'Epic'],
        'ทอง': ['Epic', 'Legendary'],
        'แดง': ['Legendary', 'Mythic'],
    };

    const allowedTiers = tierMap[rarity] || ['Common'];
    const candidates = TALENT_POOL.filter(t => allowedTiers.includes(t.tier));

    if (candidates.length === 0) return [];

    const selected = [];
    const usedIds = new Set();

    for (let i = 0; i < count; i++) {
        // กรองของที่ยังไม่ได้ใช้
        const available = candidates.filter(t => !usedIds.has(t.id));
        if (available.length === 0) break;
        const picked = randomPick(available);
        if (picked) {
            selected.push({ ...picked });
            usedIds.add(picked.id);
        }
    }

    return selected;
}

/**
 * สุ่ม Growth Quality
 * @returns {Object}
 */
function rollGrowthQuality() {
    const weights = GENERATION_CONFIG.growthWeights;
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;
    for (const [name, weight] of Object.entries(weights)) {
        roll -= weight;
        if (roll <= 0) {
            return GROWTH_QUALITIES.find(g => g.name === name) || GROWTH_QUALITIES[0];
        }
    }
    return GROWTH_QUALITIES[0];
}

/**
 * เลือกสกิลให้ผู้ติดตามตาม Archetype และ Rarity
 * @param {Object} archetype
 * @param {string} rarity - "ขาว", "เขียว", "ฟ้า", "ม่วง", "ทอง", "แดง"
 * @returns {Array} array of skill ids
 */
function selectSkillsForFollower(archetype, rarity) {
    const rarityMap = {
        'ขาว': ['white', 'green'],
        'เขียว': ['white', 'green'],
        'ฟ้า': ['green', 'blue'],
        'ม่วง': ['blue', 'purple'],
        'ทอง': ['purple', 'gold'],
        'แดง': ['gold', 'red'],
    };

    const allowedLevels = rarityMap[rarity] || ['white'];

    // หาสกิลที่เข้ากับ Archetype และระดับที่อนุญาต
    const candidates = SkillDatabase.filter(skill => {
        if (skill.type !== 'Active') return false;
        if (!allowedLevels.includes(skill.level?.toLowerCase())) return false;

        const tags = getSkillTags(skill.effect || '');
        const skillWeights = GENERATION_CONFIG.SKILL_WEIGHTS?.[archetype.name] || {};
        // เช็คว่ามี tag ที่ตรงกับที่ Archetype ชอบหรือไม่
        for (const tag of tags) {
            if (skillWeights[tag] && skillWeights[tag] > 0) return true;
        }
        // ถ้าไม่มี tag ที่ตรงกัน ใช้ fallback
        return false;
    });

    // ถ้าไม่มีสกิลที่ตรง ให้ใช้สกิลพื้นฐาน
    if (candidates.length === 0) {
        const fallback = SkillDatabase.filter(s => s.type === 'Active' && allowedLevels.includes(s.level?.toLowerCase()));
        if (fallback.length > 0) {
            return fallback.slice(0, 2).map(s => s.id);
        }
        return [1]; // หมัดทะลวงศิลา
    }

    // สุ่มเลือก 1-2 สกิล (แล้วแต่ Rarity)
    const count = rarity === 'ขาว' ? 1 : rarity === 'เขียว' ? 1 : 2;
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(s => s.id);
}

/**
 * ดึง Tag ของสกิลจาก Effect
 */
function getSkillTags(effectText) {
    const tags = [];
    if (effectText.includes('[Physical]')) tags.push('Physical');
    if (effectText.includes('[Internal]')) tags.push('Internal');
    if (effectText.includes('[Poison]')) tags.push('Poison');
    if (effectText.includes('[Heal]')) tags.push('Heal');
    if (effectText.includes('[Support]')) tags.push('Support');
    if (effectText.includes('[Multi-hit]')) tags.push('Multi-hit');
    return tags;
}

/**
 * สร้างผู้ติดตามใหม่ทั้งหมด
 * @param {string} source - แหล่งที่มา
 * @param {number} playerLevel - Level ของผู้เล่น (สำหรับกำหนด Level สูงสุด)
 * @param {Object} options - { name?, archetype?, rarity? }
 * @returns {Object} Follower object ตาม Schema
 */
export function generateFollower(source = 'city_cheap', playerLevel = 1, options = {}) {
    // 1. กำหนด Rarity
    let rarity = options.rarity || rollFollowerRarity(source);

    // 2. ดึงข้อมูล Rarity
    const rarityData = FOLLOWER_RARITIES.find(r => r.color === rarity) || FOLLOWER_RARITIES[0];
    const rarityName = rarityData.name;
    const rarityColor = rarityData.color;

    // 3. สุ่มชื่อและ Title
    const name = options.name || generateFollowerName();
    const title = generateFollowerTitle();

    // 4. สุ่ม Archetype
    const archetype = options.archetype || randomArchetype();

    // 5. Level (ไม่เกิน Player Level)
    const level = Math.min(randomInRange(Math.max(1, playerLevel - 3), Math.max(1, playerLevel)), playerLevel);

    // 6. Growth Quality
    const growth = rollGrowthQuality();

    // 7. Base Stats (จาก Archetype + Growth)
    const baseStats = {
        STR: 5,
        CON: 5,
        AGI: 5,
        INT: 5,
        LUCK: 5,
    };

    // เพิ่ม Stat Bias จาก Archetype
    const prefStats = archetype.preferredStats?.split(',').map(s => s.trim()) || [];
    for (const stat of prefStats) {
        const key = stat.toUpperCase();
        if (key in baseStats) {
            baseStats[key] += randomInRange(3, 8);
        }
    }

    // เพิ่ม Growth Bonus
    for (const [key, bonus] of Object.entries(growth.statBonuses)) {
        const k = key.toUpperCase();
        if (k in baseStats) {
            baseStats[k] += Math.floor(bonus * randomInRange(1, 3));
        }
    }

    // เพิ่ม Rarity Bonus
    const rarityBonus = rarityData.initialStatBonus || 0;
    const bonusPerStat = Math.floor(rarityBonus / 5);
    for (const key of Object.keys(baseStats)) {
        baseStats[key] += bonusPerStat;
    }

    // 8. รับพรสวรรค์ (Talent)
    const talentConfig = GENERATION_CONFIG.talentCounts[rarityColor] || { count: 1, allowedTiers: ['Common'] };
    const talents = rollTalents(rarityColor, talentConfig.count);

    // 9. เลือกสกิล
    const skillIds = selectSkillsForFollower(archetype, rarityColor);

    // 10. ตรวจสอบ Special Follower
    let special = null;
    if (rarityColor === 'แดง' && Math.random() < 0.3) {
        special = randomPick(SPECIAL_FOLLOWERS);
    }

    // 11. คำนวณ Combat Stats
    const combatStats = calculateFollowerCombatStats(baseStats, level);

    // 12. คำนวณ Daily Upkeep
    const upkeepMultiplier = DAILY_UPKEEP_MULTIPLIERS[rarityColor] || 1.0;
    const dailyUpkeep = Math.floor(level * FOLLOWER_CONSTANTS.BASE_UPKEEP_PER_LEVEL * upkeepMultiplier);

    // 13. สร้าง Follower Object
    const follower = {
        id: `follower_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: name,
        title: title,
        rarity: rarityName,
        rarityColor: rarityColor,
        archetype: archetype.name,
        level: level,
        exp: 0,
        exp_required: calculateFollowerExpRequired(level),
        stats: {
            str: Math.floor(baseStats.STR || 5),
            con: Math.floor(baseStats.CON || 5),
            agi: Math.floor(baseStats.AGI || 5),
            int: Math.floor(baseStats.INT || 5),
            luck: Math.floor(baseStats.LUCK || 5),
        },
        combat_stats: combatStats,
        skills: {
            active: skillIds,
            passive: [],
        },
        talents: talents,
        growth: growth.name,
        daily_upkeep: dailyUpkeep,
        is_active: true,
        special: special ? {
            name: special.name,
            title: special.title,
            mainTalent: special.mainTalent,
            specialty: special.specialty,
        } : null,
        _created_at: Date.now(),
    };

    return follower;
}

/**
 * คำนวณ Combat Stats ของ Follower
 */
function calculateFollowerCombatStats(stats, level) {
    const str = stats.STR || 0;
    const con = stats.CON || 0;
    const agi = stats.AGI || 0;
    const int = stats.INT || 0;
    const luck = stats.LUCK || 0;

    const hp_max = Math.floor(con * 10 + level * 5 + 50);
    const mp_max = Math.floor(int * 8 + level * 3 + 20);
    const atk = Math.floor(str * 2.5 + level * 0.5);
    const def = Math.floor(con * 0.5 + level * 0.3);

    return {
        hp: hp_max,
        hp_max: hp_max,
        mp: mp_max,
        mp_max: mp_max,
        atk: atk,
        def: def,
        crit: Math.min(5 + agi * 0.15 + luck * 0.1, 75),
        crit_damage: 150 + int * 0.2,
        dodge: Math.min(agi * 0.3, 70),
        accuracy: 90 + agi * 0.2,
        armor_pen: 0,
        life_steal: 0,
        mana_steal: 0,
        kill_chance: Math.min(luck * 0.05, 5),
    };
}

/**
 * คำนวณ EXP ที่ต้องใช้สำหรับ Level ถัดไปของ Follower
 */
function calculateFollowerExpRequired(level) {
    return Math.floor(80 * Math.pow(level, 1.7));
}

// =============================================================================
// FOLLOWER MANAGEMENT API
// =============================================================================

/**
 * ตรวจสอบว่าผู้เล่นมีผู้ติดตามครบหรือยัง
 */
export function canRecruitFollower(player) {
    if (!player) return false;
    const activeCount = (player.followers || []).filter(f => f.is_active !== false).length;
    return activeCount < FOLLOWER_CONSTANTS.MAX_FOLLOWERS;
}

/**
 * จ้างผู้ติดตาม
 * @param {Object} player
 * @param {string} source - แหล่งที่มา
 * @param {number} cost - ค่าใช้จ่าย
 * @param {Object} options - ตัวเลือกเพิ่มเติม
 * @returns {{ success: boolean, follower: Object|null, message: string }}
 */
export function recruitFollower(player, source = 'city_cheap', cost = 0, options = {}) {
    if (!player) {
        return { success: false, follower: null, message: 'ไม่มีข้อมูลผู้เล่น' };
    }

    // ตรวจสอบว่ามีที่ว่าง
    if (!canRecruitFollower(player)) {
        return { success: false, follower: null, message: `มีผู้ติดตามครบ ${FOLLOWER_CONSTANTS.MAX_FOLLOWERS} คนแล้ว` };
    }

    // ตรวจสอบเงิน
    if (cost > 0 && player.gold < cost) {
        return { success: false, follower: null, message: `เงินไม่พอ ต้องการ ${cost} มี ${player.gold}` };
    }

    // สร้างผู้ติดตาม
    const follower = generateFollower(source, player.level, options);

    // หักเงิน
    if (cost > 0) {
        try {
            PlayerModule.updateGold(player, -cost);
        } catch (e) {
            return { success: false, follower: null, message: e.message };
        }
    }

    // เพิ่มลงในทีม
    if (!player.followers) player.followers = [];
    player.followers.push(follower);

    // อัปเดต timestamp
    player._updated_at = Date.now();

    return {
        success: true,
        follower: follower,
        message: `จ้าง ${follower.name} (${follower.rarity}) สำเร็จ!`,
    };
}

/**
 * ปลดผู้ติดตาม (ออกจากทีม)
 * @param {Object} player
 * @param {string} followerId
 * @returns {{ success: boolean, message: string }}
 */
export function dismissFollower(player, followerId) {
    if (!player || !player.followers) {
        return { success: false, message: 'ไม่มีผู้ติดตาม' };
    }

    const index = player.followers.findIndex(f => f.id === followerId);
    if (index === -1) {
        return { success: false, message: 'ไม่พบผู้ติดตาม' };
    }

    const follower = player.followers[index];
    player.followers.splice(index, 1);

    player._updated_at = Date.now();

    return {
        success: true,
        message: `ปลด ${follower.name} ออกจากทีมแล้ว`,
        follower: follower,
    };
}

/**
 * เปลี่ยนสถานะผู้ติดตาม (active/inactive)
 */
export function toggleFollowerActive(player, followerId) {
    if (!player || !player.followers) {
        return { success: false, message: 'ไม่มีผู้ติดตาม' };
    }

    const follower = player.followers.find(f => f.id === followerId);
    if (!follower) {
        return { success: false, message: 'ไม่พบผู้ติดตาม' };
    }

    follower.is_active = !follower.is_active;
    player._updated_at = Date.now();

    return {
        success: true,
        message: `${follower.name} ${follower.is_active ? 'ถูกเปิดใช้งาน' : 'ถูกพัก'}`,
        follower: follower,
    };
}

/**
 * เพิ่ม EXP ให้ผู้ติดตาม
 */
export function addFollowerExp(follower, amount) {
    if (!follower) return false;

    follower.exp += amount;

    while (follower.exp >= follower.exp_required) {
        follower.exp -= follower.exp_required;
        follower.level += 1;

        // เพิ่ม Stat (ตาม Archetype)
        const archetype = COMBAT_ARCHETYPES.find(a => a.name === follower.archetype);
        if (archetype) {
            const prefStats = archetype.preferredStats?.split(',').map(s => s.trim()) || [];
            // กระจาย 3 คะแนนให้ Stat ที่ชอบ
            for (let i = 0; i < 3; i++) {
                const statKey = prefStats[i % prefStats.length]?.toLowerCase() || 'str';
                if (statKey in follower.stats) {
                    follower.stats[statKey] += 1;
                }
            }
            // ถ้าไม่มี preferred stats ให้ +1 สุ่ม
            if (prefStats.length === 0) {
                const keys = ['str', 'con', 'agi', 'int', 'luck'];
                for (let i = 0; i < 3; i++) {
                    const key = keys[Math.floor(Math.random() * keys.length)];
                    follower.stats[key] += 1;
                }
            }
        }

        // Recalculate combat stats
        const newStats = calculateFollowerCombatStats(
            {
                STR: follower.stats.str || 0,
                CON: follower.stats.con || 0,
                AGI: follower.stats.agi || 0,
                INT: follower.stats.int || 0,
                LUCK: follower.stats.luck || 0,
            },
            follower.level
        );
        Object.assign(follower.combat_stats, newStats);

        // อัปเดต EXP Required
        follower.exp_required = calculateFollowerExpRequired(follower.level);

        // อัปเดต Daily Upkeep
        const upkeepMultiplier = DAILY_UPKEEP_MULTIPLIERS[follower.rarityColor] || 1.0;
        follower.daily_upkeep = Math.floor(follower.level * FOLLOWER_CONSTANTS.BASE_UPKEEP_PER_LEVEL * upkeepMultiplier);
    }

    return true;
}

/**
 * คำนวณค่าใช้จ่ายรายวันรวมของผู้ติดตามทั้งหมด
 */
export function calculateTotalDailyUpkeep(player) {
    if (!player || !player.followers) return 0;
    return player.followers
        .filter(f => f.is_active !== false)
        .reduce((sum, f) => sum + (f.daily_upkeep || 0), 0);
}

/**
 * หักค่าใช้จ่ายรายวัน (เรียกตอน Login หรือทุกวัน)
 */
export function payDailyUpkeep(player) {
    if (!player) return { success: false, message: 'ไม่มีผู้เล่น' };

    const total = calculateTotalDailyUpkeep(player);
    if (total === 0) {
        return { success: true, message: 'ไม่มีค่าใช้จ่าย' };
    }

    if (player.gold < total) {
        // ถ้าเงินไม่พอ ให้พักผู้ติดตามทั้งหมด
        for (const f of player.followers) {
            f.is_active = false;
        }
        return {
            success: false,
            message: `เงินไม่พอ (ต้องการ ${total}) ผู้ติดตามทั้งหมดถูกพัก`,
        };
    }

    try {
        PlayerModule.updateGold(player, -total);
        return {
            success: true,
            message: `หักค่าจ้าง ${total} Gold สำเร็จ`,
        };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// =============================================================================
// PUBLIC API
// =============================================================================

export const FollowerModule = Object.freeze({
    // Constants
    CONSTANTS: FOLLOWER_CONSTANTS,

    // Generation
    generateFollower,
    rollFollowerRarity,

    // Management
    canRecruitFollower,
    recruitFollower,
    dismissFollower,
    toggleFollowerActive,

    // EXP & Upkeep
    addFollowerExp,
    calculateTotalDailyUpkeep,
    payDailyUpkeep,

    // Helpers
    randomPick,
    randomInRange,
});

// รองรับทั้ง Browser และ Node.js
if (typeof window !== 'undefined') {
    window.FollowerModule = FollowerModule;
}

export default FollowerModule;