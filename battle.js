/**
 * =============================================================================
 * js/battle.js — Jianghu RPG
 * Battle System Module — Version 2.0
 * =============================================================================
 *
 * รับผิดชอบ: จัดการการต่อสู้ทั้งหมด
 *   - Turn-based พร้อม Buff/Debuff System
 *   - Follower AI แยบยลตาม Archetype
 *   - Enemy AI ฉลาดขึ้น
 *   - Boss Phase 2 สมบูรณ์
 *   - คำนวณดาเมจ, Critical, Hit, Kill Chance
 *
 * อ้างอิง: Game Bible §12 (Battle System)
 * =============================================================================
 */

"use strict";

// =============================================================================
// IMPORTS
// =============================================================================

import { PlayerModule } from './player.js';
import { InventoryModule } from './inventory.js';
import { EquipmentModule } from './equipment edit.js';
import { SkillDatabase } from './skill database.js';
import { EnemyDatabase } from './enemy.js';
import { BossDatabase } from './boss database.js';
import miniBossDatabase from './mini_boss.js';
import { DropTable } from './drop table.js';
import { BuffSystem } from './buff_system.js';

const { BuffType, Buff, BuffManager, BuffFactory } = BuffSystem;

// =============================================================================
// CONSTANTS
// =============================================================================

const BATTLE_CONSTANTS = Object.freeze({
    MIN_HIT_CHANCE: 10,
    STAT_CAPS: Object.freeze({
        crit: 75,
        crit_damage: 400,
        dodge: 70,
        accuracy: 110,
        armor_pen: 75,
        life_steal: 40,
        mana_steal: 20,
        kill_chance: 8,
    }),
    EXP_BASE: 100,
    EXP_EXPONENT: 1.8,
    EXP_MULTIPLIERS: Object.freeze({
        Normal: 5,
        Elite: 15,
        'Mini-Boss': 50,
        'Area Boss': 200,
    }),
    GOLD_MULTIPLIERS: Object.freeze({
        Normal: { min: 3, max: 8 },
        Elite: { min: 15, max: 25 },
        'Mini-Boss': { min: 50, max: 80 },
        'Area Boss': { min: 200, max: 500 },
    }),
});

// =============================================================================
// UTILITY HELPERS
// =============================================================================

function parseRangeToAverage(str) {
    if (typeof str !== 'string') return Number(str) || 0;
    const cleaned = str.replace(/–/g, '-').replace(/,/g, '');
    const parts = cleaned.split('-').map(s => parseFloat(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return Math.floor((parts[0] + parts[1]) / 2);
    }
    return parseFloat(cleaned) || 0;
}

function parseRangeToMinMax(str) {
    if (typeof str !== 'string') {
        const num = Number(str) || 0;
        return { min: num, max: num };
    }
    const cleaned = str.replace(/–/g, '-').replace(/,/g, '');
    const parts = cleaned.split('-').map(s => parseFloat(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return { min: parts[0], max: parts[1] };
    }
    const num = parseFloat(cleaned) || 0;
    return { min: num, max: num };
}

function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getEnemyStat(enemy, key) {
    const val = enemy[key];
    if (typeof val === 'string' && val.includes('–')) {
        return parseRangeToAverage(val);
    }
    return Number(val) || 0;
}

function parseGoldReward(goldStr) {
    const { min, max } = parseRangeToMinMax(goldStr);
    return randomInRange(min, max);
}

// =============================================================================
// SKILL PARSING
// =============================================================================

function parseSkillMeta(effectText) {
    let mpCost = 0;
    let cooldown = 0;
    let damagePercent = 0;
    let statType = 'ATK';

    const mpMatch = effectText.match(/MP Cost:\s*(\d+)/i);
    if (mpMatch) mpCost = parseInt(mpMatch[1], 10);

    const cdMatch = effectText.match(/CD:\s*(\d+)/i);
    if (cdMatch) cooldown = parseInt(cdMatch[1], 10);

    const dmgMatch = effectText.match(/(\d+)%\s*ของ\s*(ATK|INT)/i);
    if (dmgMatch) {
        damagePercent = parseInt(dmgMatch[1], 10);
        statType = dmgMatch[2].toUpperCase();
    }

    return { mpCost, cooldown, damagePercent, statType };
}

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

function getSkillTarget(effectText) {
    if (effectText.includes('หมู่') || effectText.includes('ทั้งหมด')) return 'all';
    if (effectText.includes('ตัวเอง') || effectText.includes('ตนเอง')) return 'self';
    return 'single';
}

// =============================================================================
// COMBATANT FACTORY (พร้อม Buff System)
// =============================================================================

function createCombatant(type, source, options = {}) {
    const base = {
        id: source.id || `combatant_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: source.name || 'Unknown',
        type: type,
        isPlayer: type === 'player' || type === 'follower',
        isEnemy: type === 'enemy' || type === 'boss' || type === 'mini_boss',
        isBoss: type === 'boss' || type === 'mini_boss',

        // Stats
        level: source.level || 1,
        hp: 0,
        hp_max: 0,
        mp: 0,
        mp_max: 0,
        atk: 0,
        def: 0,
        agi: 0,
        str: 0,
        con: 0,
        int: 0,
        luck: 0,
        crit: 0,
        crit_damage: 0,
        dodge: 0,
        accuracy: 0,
        armor_pen: 0,
        life_steal: 0,
        mana_steal: 0,
        kill_chance: 0,

        // Skills
        skills: { active: [], passive: [] },

        // Status
        isAlive: true,
        cooldowns: {},
        buffs: new BuffManager(), // ✅ ใช้ BuffManager

        // Reference
        sourceRef: source,

        // Combat Style
        combatStyle: options.combatStyle || 'Melee',

        // Special
        isBoss: type === 'boss' || type === 'mini_boss',
        immuneToKillChance: options.immuneToKillChance || false,
        specialPhase: options.specialPhase || null,
        phaseTriggered: false,

        // Drop
        dropTableId: options.dropTableId || null,
        goldReward: options.goldReward || null,
        uniqueDrops: options.uniqueDrops || [],
    };

    // Populate stats based on source type
    if (type === 'player') {
        const cs = source.combat_stats;
        const st = source.stats;
        base.hp = cs.hp;
        base.hp_max = cs.hp_max;
        base.mp = cs.mp;
        base.mp_max = cs.mp_max;
        base.atk = cs.atk || 0;
        base.def = cs.def || 0;
        base.agi = cs.agi || st.agi || 0;
        base.str = st.str || 0;
        base.con = st.con || 0;
        base.int = st.int || 0;
        base.luck = st.luck || 0;
        base.crit = cs.crit || 0;
        base.crit_damage = cs.crit_damage || 150;
        base.dodge = cs.dodge || 0;
        base.accuracy = cs.accuracy || 90;
        base.armor_pen = cs.armor_pen || 0;
        base.life_steal = cs.life_steal || 0;
        base.mana_steal = cs.mana_steal || 0;
        base.kill_chance = cs.kill_chance || 0;

        if (source.skills) {
            base.skills.active = (source.skills.active || []).map(id => SkillDatabase.find(s => s.id === id)).filter(Boolean);
            base.skills.passive = (source.skills.passive || []).map(id => SkillDatabase.find(s => s.id === id)).filter(Boolean);
        }
        base.combatStyle = 'Player';
    }

    if (type === 'follower') {
        const st = source.stats || {};
        base.level = source.level || 1;
        base.str = st.str || 5;
        base.con = st.con || 5;
        base.agi = st.agi || 5;
        base.int = st.int || 5;
        base.luck = st.luck || 5;

        base.hp_max = source.combat_stats?.hp_max || (base.con * 10 + base.level * 5);
        base.mp_max = source.combat_stats?.mp_max || (base.int * 8 + base.level * 3);
        base.hp = source.combat_stats?.hp || base.hp_max;
        base.mp = source.combat_stats?.mp || base.mp_max;
        base.atk = source.combat_stats?.atk || (base.str * 2.5);
        base.def = source.combat_stats?.def || (base.con * 0.5);
        base.agi = source.combat_stats?.agi || base.agi;
        base.crit = source.combat_stats?.crit || (5 + base.agi * 0.15 + base.luck * 0.1);
        base.crit_damage = source.combat_stats?.crit_damage || 150;
        base.dodge = source.combat_stats?.dodge || (base.agi * 0.3);
        base.accuracy = source.combat_stats?.accuracy || (90 + base.agi * 0.2);
        base.armor_pen = source.combat_stats?.armor_pen || 0;
        base.life_steal = source.combat_stats?.life_steal || 0;
        base.mana_steal = source.combat_stats?.mana_steal || 0;
        base.kill_chance = source.combat_stats?.kill_chance || 0;

        if (source.skills) {
            base.skills.active = (source.skills.active || []).map(id => SkillDatabase.find(s => s.id === id)).filter(Boolean);
            base.skills.passive = (source.skills.passive || []).map(id => SkillDatabase.find(s => s.id === id)).filter(Boolean);
        }
        base.combatStyle = 'Follower';
        // เก็บ Archetype สำหรับ AI
        base.archetype = source.archetype || 'นักรบ';
    }

    if (type === 'enemy' || type === 'boss' || type === 'mini_boss') {
        base.level = Number(source.level) || 1;
        base.hp_max = getEnemyStat(source, 'hp');
        base.hp = base.hp_max;
        base.mp_max = getEnemyStat(source, 'mp') || 0;
        base.mp = base.mp_max;
        base.atk = getEnemyStat(source, 'atk');
        base.def = getEnemyStat(source, 'def');
        base.agi = getEnemyStat(source, 'agi');
        base.str = 0;
        base.con = 0;
        base.int = 0;
        base.luck = 0;
        base.crit = 5;
        base.crit_damage = 150;
        base.dodge = 0;
        base.accuracy = 90;
        base.armor_pen = 0;
        base.life_steal = 0;
        base.mana_steal = 0;
        base.kill_chance = 0;

        base.combatStyle = source.combatStyle || source.style || 'Melee';

        if (type === 'boss') {
            base.immuneToKillChance = source.immunity ? source.immunity.includes('KILL_CHANCE') : true;
            base.specialPhase = source.specialPhase || null;
            base.goldReward = source.goldReward || null;
            base.uniqueDrops = source.uniqueDrops || [];
            base.dropTableId = null;
        }
        if (type === 'mini_boss') {
            base.immuneToKillChance = true;
            base.specialPhase = null;
            base.goldReward = source.goldReward || null;
            base.uniqueDrops = source.uniqueDrops || [];
            base.dropTableId = null;
        }

        if (!source.skills) {
            base.skills.active = selectSkillsForCombatStyle(base.combatStyle, base.level);
            base.skills.passive = [];
        } else {
            base.skills.active = (source.skills || []).map(id => SkillDatabase.find(s => s.id === id)).filter(Boolean);
            base.skills.passive = [];
        }

        if (type === 'enemy') {
            base.dropTableId = source["Drop Table"] || null;
            base.goldReward = null;
        }
    }

    applyPassiveSkills(base);
    return base;
}

// =============================================================================
// SKILL SELECTION FOR ENEMIES
// =============================================================================

function selectSkillsForCombatStyle(style, level) {
    const styleMap = {
        'Melee': ['Physical'],
        'Fire': ['Internal', 'ไฟ', 'เพลิง', 'ลาวา'],
        'Ice': ['Internal', 'น้ำแข็ง', 'เหมันต์', 'หิมะ'],
        'Lightning': ['Internal', 'สายฟ้า', 'ฟ้าผ่า', 'อัสนี'],
        'Poison': ['Poison', 'พิษ'],
        'Dark': ['Internal', 'มาร', 'วิญญาณ', 'โลหิต', 'เงา'],
        'Holy': ['Internal', 'เทพ', 'สวรรค์', 'ศักดิ์สิทธิ์'],
        'Magic': ['Internal'],
        'Support': ['Support', 'Heal'],
    };

    const keywords = styleMap[style] || ['Physical'];
    const candidates = SkillDatabase.filter(skill => {
        if (skill.type !== 'Active') return false;
        const text = skill.effect + skill.name;
        return keywords.some(kw => text.includes(kw));
    });

    const rarityOrder = { 'ขาว': 0, 'เขียว': 1, 'ฟ้า': 2, 'ม่วง': 3, 'ทอง': 4, 'แดง': 5 };
    candidates.sort((a, b) => (rarityOrder[b.level] || 0) - (rarityOrder[a.level] || 0));

    const maxLevel = Math.min(level, 60);
    const selected = [];
    for (const skill of candidates) {
        if (selected.length >= 3) break;
        const skillLevel = parseInt(skill.id) % 10 || 1;
        if (skillLevel <= maxLevel + 10) {
            selected.push(skill);
        }
    }

    if (selected.length === 0) {
        const defaultSkill = SkillDatabase.find(s => s.id === 1);
        if (defaultSkill) selected.push(defaultSkill);
    }

    return selected;
}

// =============================================================================
// PASSIVE SKILLS
// =============================================================================

function applyPassiveSkills(combatant) {
    if (!combatant.skills || !combatant.skills.passive) return;

    for (const skill of combatant.skills.passive) {
        if (!skill || skill.type !== 'Passive') continue;
        const effect = skill.effect;

        const statMatches = effect.match(/เพิ่ม\s*(\w+)\s*([+-]?\d+)/g);
        if (statMatches) {
            for (const match of statMatches) {
                const parts = match.match(/เพิ่ม\s*(\w+)\s*([+-]?\d+)/);
                if (!parts) continue;
                const statName = parts[1];
                const value = parseInt(parts[2], 10);
                if (isNaN(value)) continue;

                const statMap = {
                    'STR': 'str', 'CON': 'con', 'AGI': 'agi', 'INT': 'int', 'LUCK': 'luck',
                    'ATK': 'atk', 'DEF': 'def', 'HP': 'hp_max', 'MP': 'mp_max',
                    'CRIT': 'crit', 'CRIT_DAMAGE': 'crit_damage',
                    'DODGE': 'dodge', 'ACCURACY': 'accuracy',
                    'ARMOR_PEN': 'armor_pen', 'LIFE_STEAL': 'life_steal',
                    'MANA_STEAL': 'mana_steal', 'KILL_CHANCE': 'kill_chance',
                };
                const targetKey = statMap[statName];
                if (targetKey && typeof combatant[targetKey] === 'number') {
                    combatant[targetKey] += value;
                }
            }
        }

        const percentMatches = effect.match(/เพิ่ม\s*(\w+)\s*([+-]?\d+)%/g);
        if (percentMatches) {
            for (const match of percentMatches) {
                const parts = match.match(/เพิ่ม\s*(\w+)\s*([+-]?\d+)%/);
                if (!parts) continue;
                const statName = parts[1];
                const value = parseInt(parts[2], 10);
                if (isNaN(value)) continue;
                const statMap = {
                    'CRIT': 'crit', 'DODGE': 'dodge', 'ACCURACY': 'accuracy',
                    'LIFE_STEAL': 'life_steal', 'MANA_STEAL': 'mana_steal',
                    'KILL_CHANCE': 'kill_chance', 'ARMOR_PEN': 'armor_pen',
                    'CRIT_DAMAGE': 'crit_damage',
                };
                const targetKey = statMap[statName];
                if (targetKey && typeof combatant[targetKey] === 'number') {
                    combatant[targetKey] += value;
                }
            }
        }
    }

    const caps = BATTLE_CONSTANTS.STAT_CAPS;
    combatant.crit = Math.min(combatant.crit || 0, caps.crit);
    combatant.crit_damage = Math.min(combatant.crit_damage || 0, caps.crit_damage);
    combatant.dodge = Math.min(combatant.dodge || 0, caps.dodge);
    combatant.accuracy = Math.min(combatant.accuracy || 0, caps.accuracy);
    combatant.armor_pen = Math.min(combatant.armor_pen || 0, caps.armor_pen);
    combatant.life_steal = Math.min(combatant.life_steal || 0, caps.life_steal);
    combatant.mana_steal = Math.min(combatant.mana_steal || 0, caps.mana_steal);
    combatant.kill_chance = Math.min(combatant.kill_chance || 0, caps.kill_chance);
}

// =============================================================================
// HIT / CRIT / DAMAGE
// =============================================================================

function checkHit(attacker, defender) {
    const threshold = 100 - attacker.accuracy + defender.dodge;
    const roll = Math.random() * 100;
    return roll > Math.min(threshold, 90);
}

function checkCrit(attacker) {
    const critChance = Math.min(attacker.crit || 0, BATTLE_CONSTANTS.STAT_CAPS.crit);
    return Math.random() * 100 <= critChance;
}

function checkKillChance(attacker, defender) {
    if (defender.immuneToKillChance) return false;
    const killChance = Math.min(attacker.kill_chance || 0, BATTLE_CONSTANTS.STAT_CAPS.kill_chance);
    return Math.random() * 100 <= killChance;
}

function calculateDamage(attacker, defender, skill = null) {
    let raw = 0;
    let isPhysical = true;

    // ใช้ Stat ที่ถูกปรับด้วย Buff แล้ว
    const atk = attacker.buffs.applyToStat('atk', attacker.atk);
    const def = defender.buffs.applyToStat('def', defender.def);
    const str = attacker.buffs.applyToStat('str', attacker.str);
    const int = attacker.buffs.applyToStat('int', attacker.int);
    const armorPen = Math.min(attacker.armor_pen || 0, BATTLE_CONSTANTS.STAT_CAPS.armor_pen);

    if (skill) {
        const tags = getSkillTags(skill.effect);
        isPhysical = tags.includes('Physical');
        const meta = parseSkillMeta(skill.effect);
        const percent = meta.damagePercent || 100;
        const statType = meta.statType || 'ATK';

        if (isPhysical) {
            const baseAtk = atk;
            const strBonus = str * 0.005;
            raw = baseAtk * (1 + strBonus) * (percent / 100);
        } else {
            const baseInt = int;
            const intBonus = baseInt * 0.006;
            raw = (percent / 100) * baseInt * (1 + intBonus);
        }
    } else {
        isPhysical = true;
        const baseAtk = atk;
        const strBonus = str * 0.005;
        raw = baseAtk * (1 + strBonus);
    }

    const effectiveDef = def * (1 - armorPen / 100);

    let finalDamage = 0;
    if (isPhysical) {
        finalDamage = Math.max(1, raw - effectiveDef);
    } else {
        finalDamage = Math.max(1, raw - effectiveDef * 0.5);
    }

    // Critical
    let isCrit = false;
    if (checkCrit(attacker)) {
        isCrit = true;
        const critDmg = Math.min(attacker.crit_damage || 150, BATTLE_CONSTANTS.STAT_CAPS.crit_damage);
        finalDamage = finalDamage * (critDmg / 100);
    }

    return Math.floor(finalDamage);
}

// =============================================================================
// EXECUTE ACTIONS (พร้อม Buff)
// =============================================================================

function executeAutoAttack(state, attacker, defender, logPrefix = '') {
    const log = state.logs;

    // Hit check
    if (!checkHit(attacker, defender)) {
        log.push(`${attacker.name} ${logPrefix}โจมตี ${defender.name} แต่พลาด!`);
        return;
    }

    // Kill Chance
    if (checkKillChance(attacker, defender)) {
        defender.hp = 0;
        defender.isAlive = false;
        log.push(`💀 ${attacker.name} ${logPrefix}ใช้พลังสังหารทันที! ${defender.name} ถูกกำจัด!`);
        return;
    }

    // Shield check
    let damage = calculateDamage(attacker, defender, null);

    // Shield
    if (defender.buffs.getTotalShield() > 0) {
        const shieldDamage = defender.buffs.reduceShield(damage);
        if (shieldDamage < damage) {
            log.push(`🛡️ ${defender.name} กัน Shield ได้ ${damage - shieldDamage} ดาเมจ`);
        }
        damage = shieldDamage;
    }

    if (damage <= 0) {
        log.push(`🛡️ ${defender.name} กันดาเมจได้ทั้งหมด!`);
        return;
    }

    // Apply damage
    defender.hp = Math.max(0, defender.hp - damage);
    if (defender.hp <= 0) {
        defender.isAlive = false;
        log.push(`💥 ${attacker.name} ${logPrefix}โจมตี ${defender.name} สร้าง ${damage} ดาเมจ และสังหารสำเร็จ!`);
    } else {
        log.push(`💥 ${attacker.name} ${logPrefix}โจมตี ${defender.name} สร้าง ${damage} ดาเมจ (HP ${defender.hp}/${defender.hp_max})`);
    }

    // Life Steal
    if (attacker.life_steal > 0 && damage > 0) {
        const steal = Math.floor(damage * (attacker.life_steal / 100));
        if (steal > 0) {
            attacker.hp = Math.min(attacker.hp_max, attacker.hp + steal);
            log.push(`💚 ${attacker.name} ดูดเลือด ${steal} HP (${attacker.hp}/${attacker.hp_max})`);
        }
    }

    // Mana Steal
    if (attacker.mana_steal > 0 && damage > 0) {
        const steal = Math.floor(damage * (attacker.mana_steal / 100));
        if (steal > 0) {
            attacker.mp = Math.min(attacker.mp_max, attacker.mp + steal);
            log.push(`💎 ${attacker.name} ดูดพลัง ${steal} MP (${attacker.mp}/${attacker.mp_max})`);
        }
    }
}

function executeSkill(state, attacker, defender, skill, logPrefix = '') {
    const log = state.logs;

    if (!skill) return false;

    const meta = parseSkillMeta(skill.effect);
    const tags = getSkillTags(skill.effect);
    const targetType = getSkillTarget(skill.effect);

    // Check Silence
    if (attacker.buffs.isSilenced()) {
        log.push(`🔇 ${attacker.name} ถูก Silence! ใช้สกิลไม่ได้!`);
        return false;
    }

    // Check MP
    if (attacker.mp < meta.mpCost) {
        log.push(`${attacker.name} MP ไม่พอใช้ ${skill.name} (ต้องการ ${meta.mpCost}, มี ${attacker.mp})`);
        return false;
    }

    // Check Cooldown
    const cdKey = skill.id;
    if (attacker.cooldowns[cdKey] && attacker.cooldowns[cdKey] > 0) {
        log.push(`${attacker.name} ${skill.name} ยังอยู่ในคูลดาวน์ (${attacker.cooldowns[cdKey]} เทิร์น)`);
        return false;
    }

    // Deduct MP
    attacker.mp -= meta.mpCost;

    // Set Cooldown
    if (meta.cooldown > 0) {
        attacker.cooldowns[cdKey] = meta.cooldown;
    }

    // Hit check
    if (!checkHit(attacker, defender)) {
        log.push(`${attacker.name} ${logPrefix}ใช้ ${skill.name} แต่พลาด!`);
        return true;
    }

    // Kill Chance
    if (checkKillChance(attacker, defender)) {
        defender.hp = 0;
        defender.isAlive = false;
        log.push(`💀 ${attacker.name} ${logPrefix}ใช้ ${skill.name} สังหาร ${defender.name} ทันที!`);
        return true;
    }

    // Calculate damage
    let damage = calculateDamage(attacker, defender, skill);

    // Shield
    if (defender.buffs.getTotalShield() > 0) {
        const shieldDamage = defender.buffs.reduceShield(damage);
        if (shieldDamage < damage) {
            log.push(`🛡️ ${defender.name} กัน Shield ได้ ${damage - shieldDamage} ดาเมจ`);
        }
        damage = shieldDamage;
    }

    if (damage <= 0) {
        log.push(`🛡️ ${defender.name} กันดาเมจได้ทั้งหมด!`);
        return true;
    }

    // Apply damage
    defender.hp = Math.max(0, defender.hp - damage);
    if (defender.hp <= 0) {
        defender.isAlive = false;
        log.push(`💥 ${attacker.name} ${logPrefix}ใช้ ${skill.name} สร้าง ${damage} ดาเมจ และสังหาร ${defender.name} สำเร็จ!`);
    } else {
        log.push(`💥 ${attacker.name} ${logPrefix}ใช้ ${skill.name} สร้าง ${damage} ดาเมจ (${defender.name} HP ${defender.hp}/${defender.hp_max})`);
    }

    // Life Steal
    if (attacker.life_steal > 0 && damage > 0) {
        const steal = Math.floor(damage * (attacker.life_steal / 100));
        if (steal > 0) {
            attacker.hp = Math.min(attacker.hp_max, attacker.hp + steal);
            log.push(`💚 ${attacker.name} ดูดเลือด ${steal} HP (${attacker.hp}/${attacker.hp_max})`);
        }
    }

    // Mana Steal
    if (attacker.mana_steal > 0 && damage > 0) {
        const steal = Math.floor(damage * (attacker.mana_steal / 100));
        if (steal > 0) {
            attacker.mp = Math.min(attacker.mp_max, attacker.mp + steal);
            log.push(`💎 ${attacker.name} ดูดพลัง ${steal} MP (${attacker.mp}/${attacker.mp_max})`);
        }
    }

    return true;
}

// =============================================================================
// ENEMY AI — ฉลาดขึ้น!
// =============================================================================

function enemyAI(state, enemy, playerSide) {
    const aliveTargets = playerSide.filter(p => p.isAlive);
    if (aliveTargets.length === 0) return null;

    // หาเป้าหมายที่เหมาะสม (ถ้ามี Taunt)
    let target = aliveTargets.find(p => p.buffs.hasBuff(BuffType.TAUNT));
    if (!target) {
        // เลือกผู้เล่นก่อน ตามด้วย Follower
        target = aliveTargets.find(p => p.isPlayer) || aliveTargets[0];
    }

    // ตรวจสอบสกิลที่มี
    const availableSkills = (enemy.skills.active || []).filter(skill => {
        if (!skill) return false;
        const cdKey = skill.id;
        const cooldown = enemy.cooldowns[cdKey] || 0;
        if (cooldown > 0) return false;
        const meta = parseSkillMeta(skill.effect);
        if (enemy.mp < meta.mpCost) return false;
        return true;
    });

    // AI Logic ตาม Combat Style
    const style = enemy.combatStyle || 'Melee';

    // ถ้าเป็น Boss และ HP < 30% มีโอกาสใช้สกิลแรงขึ้น
    const isBoss = enemy.isBoss || false;
    const hpRatio = enemy.hp / enemy.hp_max;

    let skillChance = 0.3;
    if (isBoss && hpRatio < 0.3) {
        skillChance = 0.6; // Boss ใช้สกิลบ่อยขึ้นเมื่อใกล้ตาย
    }

    if (availableSkills.length > 0 && Math.random() < skillChance) {
        // เลือกสกิลที่แรงที่สุด (ดูจากดาเมจ%)
        const sortedSkills = [...availableSkills].sort((a, b) => {
            const metaA = parseSkillMeta(a.effect);
            const metaB = parseSkillMeta(b.effect);
            return (metaB.damagePercent || 0) - (metaA.damagePercent || 0);
        });
        const skill = sortedSkills[0];

        // เช็คว่าเป็นสกิล Support (Heal/Buff) และถ้าใช้ได้
        const tags = getSkillTags(skill.effect);
        if (tags.includes('Heal') && enemy.hp / enemy.hp_max < 0.5) {
            // ใช้ Heal เมื่อ HP ต่ำ
            return { type: 'skill', target: enemy, skill };
        }
        if (tags.includes('Support') && enemy.buffs.getBuffsByType(BuffType.ATK_UP).length === 0) {
            // ใช้ Buff ถ้ายังไม่มี
            return { type: 'skill', target: enemy, skill };
        }

        return { type: 'skill', target, skill };
    }

    return { type: 'attack', target };
}

// =============================================================================
// FOLLOWER AI — ฉลาดตาม Archetype
// =============================================================================

function followerAI(state, follower, playerSide, enemySide) {
    const aliveEnemies = enemySide.filter(e => e.isAlive);
    if (aliveEnemies.length === 0) return null;

    const target = aliveEnemies[0];
    const archetype = follower.archetype || 'นักรบ';

    // ตรวจสอบสกิลที่มี
    const availableSkills = (follower.skills.active || []).filter(skill => {
        if (!skill) return false;
        const cdKey = skill.id;
        const cooldown = follower.cooldowns[cdKey] || 0;
        if (cooldown > 0) return false;
        const meta = parseSkillMeta(skill.effect);
        if (follower.mp < meta.mpCost) return false;
        return true;
    });

    // จำแนกตาม Archetype
    const tags = {
        'Heal': [],
        'Support': [],
        'Physical': [],
        'Internal': [],
        'Poison': [],
    };

    for (const skill of availableSkills) {
        const skillTags = getSkillTags(skill.effect);
        for (const tag of skillTags) {
            if (tags[tag]) tags[tag].push(skill);
        }
    }

    // ---- Archetype Logic ----
    switch (archetype) {
        case 'หมอเทวดา':
        case 'โล่ชีวิต':
            // หมอ: ถ้า HP ผู้เล่นต่ำกว่า 50% ให้รักษา
            const playerLow = playerSide.filter(p => p.isPlayer && p.hp / p.hp_max < 0.5);
            if (playerLow.length > 0 && tags.Heal.length > 0) {
                const healSkill = tags.Heal[0];
                return { type: 'skill', target: playerLow[0], skill: healSkill };
            }
            // ถ้าไม่มีใครต้องรักษา ให้โจมตี
            break;

        case 'นักพิษ':
            // ใช้ Poison ถ้ามี
            if (tags.Poison.length > 0 && Math.random() < 0.4) {
                const poisonSkill = tags.Poison[0];
                // ตรวจสอบว่าศัตรูติด Poison อยู่หรือยัง
                const hasPoison = target.buffs.hasBuff(BuffType.POISON);
                if (!hasPoison || Math.random() < 0.3) {
                    return { type: 'skill', target, skill: poisonSkill };
                }
            }
            break;

        case 'จอมปราณ':
        case 'จ้าวเวทย์':
            // ใช้ Internal ถ้ามี
            if (tags.Internal.length > 0 && Math.random() < 0.5) {
                const skill = tags.Internal[Math.floor(Math.random() * tags.Internal.length)];
                return { type: 'skill', target, skill };
            }
            break;

        case 'เกราะเหล็ก':
        case 'แทงค์':
            // ถ้า HP ต่ำกว่า 40% และมี Support ให้ใช้ป้องกันตัวเอง
            if (follower.hp / follower.hp_max < 0.4 && tags.Support.length > 0) {
                const skill = tags.Support[0];
                return { type: 'skill', target: follower, skill };
            }
            break;

        default:
            // นักรบทั่วไป
            if (tags.Physical.length > 0 && Math.random() < 0.3) {
                const skill = tags.Physical[Math.floor(Math.random() * tags.Physical.length)];
                return { type: 'skill', target, skill };
            }
            break;
    }

    // Fallback: ใช้สกิลแรกที่มี (ถ้าไม่มีก็ Auto Attack)
    if (availableSkills.length > 0 && Math.random() < 0.3) {
        const skill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
        return { type: 'skill', target, skill };
    }

    return { type: 'attack', target };
}

// =============================================================================
// BATTLE STATE
// =============================================================================

function createBattleState(player, enemySource, enemyType) {
    const playerCombatant = createCombatant('player', player);

    const followers = (player.followers || [])
        .filter(f => f.is_active !== false)
        .map(f => createCombatant('follower', f));

    const isBoss = enemyType === 'area_boss' || enemyType === 'mini_boss';
    const typeMap = {
        'normal': 'enemy',
        'elite': 'enemy',
        'mini_boss': 'mini_boss',
        'area_boss': 'boss',
    };
    const combatType = typeMap[enemyType] || 'enemy';

    let enemyCombatant;
    if (combatType === 'boss' || combatType === 'mini_boss') {
        enemyCombatant = createCombatant(combatType, enemySource, {
            combatStyle: enemySource.combatStyle || enemySource.style || 'Melee',
            immuneToKillChance: enemySource.immunity ? enemySource.immunity.includes('KILL_CHANCE') : true,
            specialPhase: enemySource.specialPhase || null,
            goldReward: enemySource.goldReward || null,
            uniqueDrops: enemySource.uniqueDrops || [],
            dropTableId: null,
        });
    } else {
        enemyCombatant = createCombatant('enemy', enemySource, {
            combatStyle: enemySource.combatStyle || 'Melee',
            dropTableId: enemySource["Drop Table"] || null,
        });
    }

    const playerSide = [playerCombatant, ...followers];
    const enemySide = [enemyCombatant];
    const allCombatants = [...playerSide, ...enemySide];
    allCombatants.sort((a, b) => {
        if (a.agi === b.agi) return a.isPlayer ? -1 : 1;
        return b.agi - a.agi;
    });

    return {
        player: playerCombatant,
        followers: followers,
        enemies: enemySide,
        allCombatants: allCombatants,
        turnOrder: allCombatants.map(c => c.id),
        turnIndex: 0,
        logs: [],
        state: 'ongoing',
        turn: 0,
        rewards: { exp: 0, gold: 0, drops: [] },
        playerRef: player,
        enemySource: enemySource,
        enemyType: enemyType,
    };
}

// =============================================================================
// PROCESS TURN
// =============================================================================

function processTurn(state, onPlayerAction = null) {
    if (state.state !== 'ongoing') return state;
    state.turn += 1;

    const log = state.logs;
    log.push(`--- ⚔️ เทิร์นที่ ${state.turn} ---`);

    // ลด Cooldown
    for (const combatant of state.allCombatants) {
        for (const key in combatant.cooldowns) {
            if (combatant.cooldowns[key] > 0) {
                combatant.cooldowns[key] -= 1;
            }
        }
    }

    // --- Tick Buffs ก่อน Action ---
    for (const combatant of state.allCombatants) {
        if (!combatant.isAlive) continue;

        // Damage Over Time (Poison, Burn, Bleed)
        const tickDamage = combatant.buffs.getTotalTickDamage(combatant.hp_max);
        if (tickDamage > 0) {
            const actualDamage = Math.min(tickDamage, combatant.hp - 1);
            combatant.hp = Math.max(1, combatant.hp - actualDamage);
            log.push(`☠️ ${combatant.name} โดนดาเมจต่อเนื่อง ${actualDamage} (HP ${combatant.hp}/${combatant.hp_max})`);

            if (combatant.hp <= 0) {
                combatant.isAlive = false;
                log.push(`💀 ${combatant.name} ตายจากดาเมจต่อเนื่อง!`);
            }
        }

        // Heal Over Time (Regen)
        const tickHeal = combatant.buffs.getTotalTickHeal(combatant.hp_max);
        if (tickHeal > 0 && combatant.isAlive) {
            const actualHeal = Math.min(tickHeal, combatant.hp_max - combatant.hp);
            if (actualHeal > 0) {
                combatant.hp += actualHeal;
                log.push(`💚 ${combatant.name} ฟื้นฟู ${actualHeal} HP (${combatant.hp}/${combatant.hp_max})`);
            }
        }

        // ลดระยะเวลา Buff
        const expired = combatant.buffs.tickDown(log);
        for (const buff of expired) {
            log.push(`⏳ ${buff.name} ของ ${combatant.name} หมดอายุ`);
        }
    }

    // Check if anyone died from DOT
    const playerAlive = state.player.isAlive;
    const enemiesAlive = state.enemies.some(e => e.isAlive);
    if (!playerAlive) {
        state.state = 'defeat';
        state.player.hp = 1;
        log.push(`💀 ${state.player.name} ถูกสังหาร! แพ้!`);
        return state;
    }
    if (!enemiesAlive) {
        state.state = 'victory';
        log.push(`🎉 ชนะ! ศัตรูทั้งหมดถูกกำจัด!`);
        return state;
    }

    // Build alive order
    const aliveOrder = state.turnOrder
        .map(id => state.allCombatants.find(c => c.id === id))
        .filter(c => c && c.isAlive);

    if (aliveOrder.length === 0) {
        state.state = 'defeat';
        return state;
    }

    // Turn Loop
    for (const combatant of aliveOrder) {
        if (state.state !== 'ongoing') break;
        if (!combatant.isAlive) continue;

        // ตรวจสอบ Stun
        if (combatant.buffs.isStunned()) {
            log.push(`💫 ${combatant.name} ถูก Stun! ข้ามเทิร์น!`);
            // ลบ Stun ออก (ใช้ไปแล้ว)
            combatant.buffs.removeBuffsByType(BuffType.STUN);
            continue;
        }

        const isPlayerSide = combatant.isPlayer;
        let defenders;
        if (isPlayerSide) {
            defenders = state.enemies.filter(e => e.isAlive);
        } else {
            defenders = [state.player, ...state.followers].filter(e => e.isAlive);
        }

        if (defenders.length === 0) {
            state.state = isPlayerSide ? 'victory' : 'defeat';
            break;
        }

        // Player Turn
        if (combatant.isPlayer && combatant.type === 'player') {
            // Wait for player action (handled in UI)
            if (onPlayerAction) {
                const action = onPlayerAction(state, combatant, defenders);
                if (action) {
                    if (action.type === 'attack') {
                        executeAutoAttack(state, combatant, defenders[0], '');
                    } else if (action.type === 'skill') {
                        const skill = action.skill;
                        if (skill) {
                            executeSkill(state, combatant, defenders[0], skill, '');
                        } else {
                            executeAutoAttack(state, combatant, defenders[0], '');
                        }
                    } else if (action.type === 'retreat') {
                        state.state = 'defeat';
                        log.push('🏃 หนีสำเร็จ!');
                        break;
                    }
                } else {
                    executeAutoAttack(state, combatant, defenders[0], '');
                }
            } else {
                // Auto-play for testing
                executeAutoAttack(state, combatant, defenders[0], '');
            }
            continue;
        }

        // Follower AI
        if (combatant.isPlayer && combatant.type === 'follower') {
            const action = followerAI(state, combatant, state.followers.filter(f => f.isAlive), state.enemies);
            if (action) {
                if (action.type === 'attack') {
                    executeAutoAttack(state, combatant, action.target, `[${combatant.archetype || 'ผู้ติดตาม'}] `);
                } else if (action.type === 'skill') {
                    executeSkill(state, combatant, action.target, action.skill, `[${combatant.archetype || 'ผู้ติดตาม'}] `);
                }
            } else {
                executeAutoAttack(state, combatant, defenders[0], `[${combatant.archetype || 'ผู้ติดตาม'}] `);
            }
            continue;
        }

        // Enemy AI
        if (!combatant.isPlayer) {
            const action = enemyAI(state, combatant, defenders);
            if (action) {
                if (action.type === 'attack') {
                    executeAutoAttack(state, combatant, action.target, '[ศัตรู] ');
                } else if (action.type === 'skill') {
                    // ถ้าสกิลเป็น Heal/Buff เป้าหมายอาจจะเป็นตัวเอง
                    const target = action.target || combatant;
                    executeSkill(state, combatant, target, action.skill, '[ศัตรู] ');
                }
            } else {
                executeAutoAttack(state, combatant, defenders[0], '[ศัตรู] ');
            }
            continue;
        }
    }

    // Boss Phase 2 Check
    for (const enemy of state.enemies) {
        if (enemy.isBoss && enemy.specialPhase && !enemy.phaseTriggered) {
            if (enemy.hp / enemy.hp_max < 0.5) {
                enemy.phaseTriggered = true;
                log.push(`⚠️ ${enemy.name} เข้าสู่ Phase 2! เพิ่มพลังโจมตีและป้องกัน!`);
                enemy.atk = Math.floor(enemy.atk * 1.5);
                enemy.def = Math.floor(enemy.def * 1.3);
                // เพิ่ม Buff ให้ Boss
                enemy.buffs.addBuff(BuffFactory.atkUp(30, 3, enemy.id));
                enemy.buffs.addBuff(BuffFactory.defUp(20, 3, enemy.id));
            }
        }
    }

    // Check victory/defeat again
    const playerAlive2 = state.player.isAlive;
    const enemiesAlive2 = state.enemies.some(e => e.isAlive);

    if (!playerAlive2) {
        state.state = 'defeat';
        state.player.hp = 1;
        log.push(`💀 ${state.player.name} ถูกสังหาร! แพ้!`);
    } else if (!enemiesAlive2) {
        state.state = 'victory';
        log.push(`🎉 ชนะ! ศัตรูทั้งหมดถูกกำจัด!`);
    }

    return state;
}

// =============================================================================
// REWARDS
// =============================================================================

function calculateExpReward(enemy, enemyType) {
    const typeMultiplier = BATTLE_CONSTANTS.EXP_MULTIPLIERS[enemyType] || 5;
    const level = enemy.level || 1;
    const baseExp = Math.floor(100 * Math.pow(level, BATTLE_CONSTANTS.EXP_EXPONENT) / 20);
    return Math.floor(baseExp * typeMultiplier / 10) + 10;
}

function calculateGoldReward(enemy, enemyType, player) {
    if (enemy.goldReward) {
        return parseGoldReward(enemy.goldReward);
    }

    const multipliers = BATTLE_CONSTANTS.GOLD_MULTIPLIERS[enemyType] || { min: 3, max: 8 };
    const level = enemy.level || 1;
    const baseGold = level * randomInRange(multipliers.min, multipliers.max);
    const luck = player.stats ? player.stats.luck || 0 : 0;
    const luckBonus = Math.floor(baseGold * (luck * 0.002));
    return baseGold + luckBonus;
}

function processDrops(enemy, enemyType, player) {
    const drops = [];

    if (enemy.uniqueDrops && enemy.uniqueDrops.length > 0) {
        const dropCount = Math.min(enemy.uniqueDrops.length, randomInRange(1, 2));
        const shuffled = [...enemy.uniqueDrops].sort(() => Math.random() - 0.5);
        for (let i = 0; i < dropCount; i++) {
            if (shuffled[i]) {
                drops.push({
                    name: shuffled[i],
                    type: 'unique',
                    rarity: 'gold',
                });
            }
        }
        return drops;
    }

    const dropTableId = enemy.dropTableId;
    if (!dropTableId) return drops;

    const dropTable = DropTable.find(dt => dt.id === dropTableId);
    if (!dropTable) return drops;

    const luck = player.stats ? player.stats.luck || 0 : 0;
    const dropChance = dropTable.equipmentDropChance * (1 + luck * 0.002);

    if (Math.random() * 100 <= dropChance) {
        const weights = dropTable.rarityWeights;
        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
        let roll = Math.random() * totalWeight;
        let selectedRarity = 'white';
        for (const [rarity, weight] of Object.entries(weights)) {
            roll -= weight;
            if (roll <= 0) {
                selectedRarity = rarity;
                break;
            }
        }
        drops.push({
            type: 'equipment',
            rarity: selectedRarity,
            source: dropTableId,
        });
    }

    if (dropTable.materialDrops) {
        for (const mat of dropTable.materialDrops) {
            if (Math.random() * 100 <= mat.chance) {
                drops.push({
                    type: 'material',
                    name: mat.name,
                });
            }
        }
    }

    if (dropTable.consumables) {
        for (const con of dropTable.consumables) {
            if (Math.random() * 100 <= con.chance) {
                drops.push({
                    type: 'consumable',
                    name: con.name,
                });
            }
        }
    }

    return drops;
}

// =============================================================================
// PUBLIC API
// =============================================================================

export const BattleModule = Object.freeze({
    // Create
    createCombatant,
    createBattleState,

    // Actions
    executeAutoAttack,
    executeSkill,
    processTurn,

    // AI
    enemyAI,
    followerAI,

    // Rewards
    calculateExpReward,
    calculateGoldReward,
    processDrops,

    // Helpers
    calculateDamage,
    checkHit,
    checkCrit,
    checkKillChance,
    parseSkillMeta,
    parseGoldReward,

    // Constants
    CONSTANTS: BATTLE_CONSTANTS,
});

if (typeof window !== 'undefined') {
    window.BattleModule = BattleModule;
}

export default BattleModule;