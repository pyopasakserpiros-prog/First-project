/**
 * =============================================================================
 * js/buff_system.js — Jianghu RPG
 * Buff & Debuff System
 * =============================================================================
 *
 * รับผิดชอบ:
 *   - จัดการ Buff/Debuff ทั้งหมดในระบบต่อสู้
 *   - ประเภท: ATK_UP, DEF_UP, AGI_UP, CRIT_UP, DODGE_UP,
 *             ATK_DOWN, DEF_DOWN, AGI_DOWN, POISON, STUN, BURN, BLEED,
 *             SHIELD, IMMUNE, REGEN, SILENCE, TAUNT
 *   - คำนวณผล, ลดระยะเวลา, Stack, ล้าง
 * =============================================================================
 */

"use strict";

// =============================================================================
// BUFF TYPES
// =============================================================================

export const BuffType = Object.freeze({
    // Positive Buffs
    ATK_UP: 'ATK_UP',
    DEF_UP: 'DEF_UP',
    AGI_UP: 'AGI_UP',
    CRIT_UP: 'CRIT_UP',
    CRIT_DMG_UP: 'CRIT_DMG_UP',
    DODGE_UP: 'DODGE_UP',
    ACC_UP: 'ACC_UP',
    REGEN: 'REGEN', // ฟื้น HP ทุกเทิร์น
    SHIELD: 'SHIELD', // โล่ดูดดาเมจ
    IMMUNE: 'IMMUNE', // ภูมิคุ้มกันทุกอย่าง
    BERSERK: 'BERSERK', // +ATK แต่ -DEF

    // Negative Debuffs
    ATK_DOWN: 'ATK_DOWN',
    DEF_DOWN: 'DEF_DOWN',
    AGI_DOWN: 'AGI_DOWN',
    CRIT_DOWN: 'CRIT_DOWN',
    DODGE_DOWN: 'DODGE_DOWN',
    ACC_DOWN: 'ACC_DOWN',
    POISON: 'POISON', // ดาเมจต่อเนื่อง
    BURN: 'BURN', // ดาเมจต่อเนื่อง (แรงกว่า Poison)
    BLEED: 'BLEED', // ดาเมจต่อเนื่อง (แรงกว่า Burn)
    STUN: 'STUN', // ข้ามเทิร์น
    SILENCE: 'SILENCE', // ใช้สกิลไม่ได้
    TAUNT: 'TAUNT', // บังคับโจมตีผู้ใช้
    SLOW: 'SLOW', // ลด AGI
    BLIND: 'BLIND', // ลด ACCURACY
});

// =============================================================================
// BUFF CLASS
// =============================================================================

export class Buff {
    /**
     * @param {string} type - ประเภท Buff (จาก BuffType)
     * @param {number} duration - จำนวนเทิร์นที่คงอยู่
     * @param {number} value - ค่าของ Buff (เช่น +20 ATK, -10 DEF)
     * @param {string} sourceId - id ของผู้สร้าง Buff
     * @param {string} name - ชื่อที่แสดง
     * @param {string} icon - ไอคอน
     */
    constructor(type, duration, value = 0, sourceId = null, name = null, icon = '✨') {
        this.id = `buff_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        this.type = type;
        this.duration = duration;
        this.maxDuration = duration;
        this.value = value;
        this.sourceId = sourceId;
        this.name = name || this.getDefaultName(type);
        this.icon = icon || this.getDefaultIcon(type);
        this.stack = 1;
        this.maxStack = this.getMaxStack(type);
        this._isDebuff = this.isDebuffType(type);
        this.tickDamage = 0; // สำหรับ Poison/Burn/Bleed
        this.tickHeal = 0; // สำหรับ Regen
    }

    getDefaultName(type) {
        const names = {
            [BuffType.ATK_UP]: 'เพิ่มพลังโจมตี',
            [BuffType.DEF_UP]: 'เพิ่มพลังป้องกัน',
            [BuffType.AGI_UP]: 'เพิ่มความว่องไว',
            [BuffType.CRIT_UP]: 'เพิ่มคริติคอล',
            [BuffType.CRIT_DMG_UP]: 'เพิ่มดาเมจคริติคอล',
            [BuffType.DODGE_UP]: 'เพิ่มหลบหลีก',
            [BuffType.ACC_UP]: 'เพิ่มความแม่นยำ',
            [BuffType.REGEN]: 'ฟื้นฟูชีวิต',
            [BuffType.SHIELD]: 'โล่ป้องกัน',
            [BuffType.IMMUNE]: 'ภูมิคุ้มกัน',
            [BuffType.BERSERK]: 'คลั่ง',
            [BuffType.ATK_DOWN]: 'ลดพลังโจมตี',
            [BuffType.DEF_DOWN]: 'ลดพลังป้องกัน',
            [BuffType.AGI_DOWN]: 'ลดความว่องไว',
            [BuffType.CRIT_DOWN]: 'ลดคริติคอล',
            [BuffType.DODGE_DOWN]: 'ลดหลบหลีก',
            [BuffType.ACC_DOWN]: 'ลดความแม่นยำ',
            [BuffType.POISON]: 'พิษ',
            [BuffType.BURN]: 'ไฟไหม้',
            [BuffType.BLEED]: 'เลือดออก',
            [BuffType.STUN]: 'สตัน',
            [BuffType.SILENCE]: 'เงียบ',
            [BuffType.TAUNT]: 'ยั่วโมโห',
            [BuffType.SLOW]: 'ช้าลง',
            [BuffType.BLIND]: 'ตาบอด',
        };
        return names[type] || type;
    }

    getDefaultIcon(type) {
        const icons = {
            [BuffType.ATK_UP]: '⚔️',
            [BuffType.DEF_UP]: '🛡️',
            [BuffType.AGI_UP]: '💨',
            [BuffType.CRIT_UP]: '🎯',
            [BuffType.CRIT_DMG_UP]: '💥',
            [BuffType.DODGE_UP]: '🌀',
            [BuffType.ACC_UP]: '👁️',
            [BuffType.REGEN]: '💚',
            [BuffType.SHIELD]: '🔰',
            [BuffType.IMMUNE]: '⭐',
            [BuffType.BERSERK]: '🔥',
            [BuffType.ATK_DOWN]: '⚔️⬇️',
            [BuffType.DEF_DOWN]: '🛡️⬇️',
            [BuffType.AGI_DOWN]: '💨⬇️',
            [BuffType.CRIT_DOWN]: '🎯⬇️',
            [BuffType.DODGE_DOWN]: '🌀⬇️',
            [BuffType.ACC_DOWN]: '👁️⬇️',
            [BuffType.POISON]: '☠️',
            [BuffType.BURN]: '🔥',
            [BuffType.BLEED]: '🩸',
            [BuffType.STUN]: '💫',
            [BuffType.SILENCE]: '🔇',
            [BuffType.TAUNT]: '😡',
            [BuffType.SLOW]: '🐢',
            [BuffType.BLIND]: '🙈',
        };
        return icons[type] || '✨';
    }

    getMaxStack(type) {
        const maxStacks = {
            [BuffType.POISON]: 5,
            [BuffType.BURN]: 3,
            [BuffType.BLEED]: 3,
            [BuffType.ATK_UP]: 3,
            [BuffType.DEF_UP]: 3,
            [BuffType.AGI_UP]: 3,
            [BuffType.SHIELD]: 1,
            [BuffType.IMMUNE]: 1,
            [BuffType.STUN]: 1,
            [BuffType.SILENCE]: 1,
            [BuffType.TAUNT]: 1,
        };
        return maxStacks[type] || 5;
    }

    isDebuffType(type) {
        const debuffs = [
            BuffType.ATK_DOWN, BuffType.DEF_DOWN, BuffType.AGI_DOWN,
            BuffType.CRIT_DOWN, BuffType.DODGE_DOWN, BuffType.ACC_DOWN,
            BuffType.POISON, BuffType.BURN, BuffType.BLEED,
            BuffType.STUN, BuffType.SILENCE, BuffType.TAUNT,
            BuffType.SLOW, BuffType.BLIND,
        ];
        return debuffs.includes(type);
    }

    /**
     * คำนวณค่าใช้กับ Stat
     * @param {string} statKey - ชื่อ Stat (atk, def, agi, crit, etc.)
     * @param {number} baseValue - ค่าเดิม
     * @returns {number} ค่าใหม่
     */
    applyToStat(statKey, baseValue) {
        let result = baseValue;

        switch (this.type) {
            case BuffType.ATK_UP:
                if (statKey === 'atk') result += this.value * this.stack;
                break;
            case BuffType.DEF_UP:
                if (statKey === 'def') result += this.value * this.stack;
                break;
            case BuffType.AGI_UP:
                if (statKey === 'agi') result += this.value * this.stack;
                break;
            case BuffType.CRIT_UP:
                if (statKey === 'crit') result += this.value * this.stack;
                break;
            case BuffType.CRIT_DMG_UP:
                if (statKey === 'crit_damage') result += this.value * this.stack;
                break;
            case BuffType.DODGE_UP:
                if (statKey === 'dodge') result += this.value * this.stack;
                break;
            case BuffType.ACC_UP:
                if (statKey === 'accuracy') result += this.value * this.stack;
                break;
            case BuffType.ATK_DOWN:
                if (statKey === 'atk') result -= this.value * this.stack;
                break;
            case BuffType.DEF_DOWN:
                if (statKey === 'def') result -= this.value * this.stack;
                break;
            case BuffType.AGI_DOWN:
                if (statKey === 'agi') result -= this.value * this.stack;
                break;
            case BuffType.CRIT_DOWN:
                if (statKey === 'crit') result -= this.value * this.stack;
                break;
            case BuffType.DODGE_DOWN:
                if (statKey === 'dodge') result -= this.value * this.stack;
                break;
            case BuffType.ACC_DOWN:
                if (statKey === 'accuracy') result -= this.value * this.stack;
                break;
            case BuffType.SLOW:
                if (statKey === 'agi') result = Math.floor(result * (1 - this.value / 100));
                break;
            case BuffType.BLIND:
                if (statKey === 'accuracy') result = Math.floor(result * (1 - this.value / 100));
                break;
            case BuffType.BERSERK:
                if (statKey === 'atk') result += this.value * this.stack;
                if (statKey === 'def') result -= this.value * this.stack * 0.5;
                break;
            case BuffType.REGEN:
            case BuffType.POISON:
            case BuffType.BURN:
            case BuffType.BLEED:
            case BuffType.SHIELD:
            case BuffType.IMMUNE:
            case BuffType.STUN:
            case BuffType.SILENCE:
            case BuffType.TAUNT:
                // ไม่มีผลกับ Stat โดยตรง
                break;
        }

        return Math.max(0, result);
    }

    /**
     * คำนวณดาเมจจาก Buff (Poison/Burn/Bleed)
     * @param {number} maxHp - HP สูงสุดของเป้าหมาย
     * @returns {number} ดาเมจที่ทำ
     */
    calculateTickDamage(maxHp) {
        switch (this.type) {
            case BuffType.POISON:
                return Math.floor(maxHp * (0.02 * this.stack)); // 2% ต่อ Stack
            case BuffType.BURN:
                return Math.floor(maxHp * (0.03 * this.stack)); // 3% ต่อ Stack
            case BuffType.BLEED:
                return Math.floor(maxHp * (0.04 * this.stack)); // 4% ต่อ Stack
            default:
                return 0;
        }
    }

    /**
     * คำนวณการรักษาจาก Buff (Regen)
     * @param {number} maxHp - HP สูงสุด
     * @returns {number} HP ที่ฟื้น
     */
    calculateTickHeal(maxHp) {
        if (this.type === BuffType.REGEN) {
            return Math.floor(maxHp * (0.05 * this.stack)); // 5% ต่อ Stack
        }
        return 0;
    }

    /**
     * ลดระยะเวลา 1 เทิร์น
     * @returns {boolean} true = หมดอายุ
     */
    tickDown() {
        this.duration -= 1;
        return this.duration <= 0;
    }

    /**
     * เพิ่ม Stack (ถ้ายังไม่ถึง Max)
     * @returns {boolean} true = เพิ่มสำเร็จ
     */
    addStack() {
        if (this.stack < this.maxStack) {
            this.stack += 1;
            // รีเซ็ต duration เมื่อเพิ่ม Stack (ตาม Game Bible ทั่วไป)
            this.duration = Math.max(this.duration, this.maxDuration);
            return true;
        }
        return false;
    }

    /**
     * ตรวจสอบว่าเป็น Debuff หรือไม่
     */
    isDebuff() {
        return this._isDebuff;
    }

    /**
     * สร้างสำเนาของ Buff
     */
    clone() {
        const buff = new Buff(this.type, this.duration, this.value, this.sourceId, this.name, this.icon);
        buff.stack = this.stack;
        buff.maxStack = this.maxStack;
        buff.tickDamage = this.tickDamage;
        buff.tickHeal = this.tickHeal;
        return buff;
    }
}

// =============================================================================
// BUFF MANAGER
// =============================================================================

export class BuffManager {
    constructor() {
        this.buffs = [];
    }

    /**
     * เพิ่ม Buff
     * @param {Buff} buff
     * @param {boolean} allowStack - อนุญาตให้ Stack หรือไม่
     * @returns {Buff} Buff ที่ถูกเพิ่ม (หรือตัวเดิมที่ถูกอัปเดต)
     */
    addBuff(buff, allowStack = true) {
        // หา Buff ประเภทเดียวกันจาก source เดียวกัน
        const existing = this.buffs.find(b =>
            b.type === buff.type &&
            b.sourceId === buff.sourceId
        );

        if (existing && allowStack) {
            if (existing.addStack()) {
                // ถ้าเพิ่ม Stack สำเร็จ ให้ใช้ตัวเดิม
                return existing;
            }
            // ถ้า Stack เต็มแล้ว ให้รีเฟรช Duration
            existing.duration = Math.max(existing.duration, buff.duration);
            return existing;
        }

        // ถ้าไม่มีตัวเดิม หรือไม่ให้ Stack
        this.buffs.push(buff);
        return buff;
    }

    /**
     * ลบ Buff ตาม id
     */
    removeBuff(id) {
        const index = this.buffs.findIndex(b => b.id === id);
        if (index !== -1) {
            return this.buffs.splice(index, 1)[0];
        }
        return null;
    }

    /**
     * ลบ Buff ตามประเภท
     */
    removeBuffsByType(type) {
        const removed = [];
        this.buffs = this.buffs.filter(b => {
            if (b.type === type) {
                removed.push(b);
                return false;
            }
            return true;
        });
        return removed;
    }

    /**
     * ลบ Debuff ทั้งหมด
     */
    clearDebuffs() {
        const removed = [];
        this.buffs = this.buffs.filter(b => {
            if (b.isDebuff()) {
                removed.push(b);
                return false;
            }
            return true;
        });
        return removed;
    }

    /**
     * ลบ Buff ทั้งหมด (รักษา Shield ไว้? ตัวเลือก)
     */
    clearAll(keepShield = false) {
        if (keepShield) {
            this.buffs = this.buffs.filter(b => b.type === BuffType.SHIELD);
        } else {
            this.buffs = [];
        }
    }

    /**
     * ดึง Buff ตามประเภท
     */
    getBuffsByType(type) {
        return this.buffs.filter(b => b.type === type);
    }

    /**
     * ตรวจสอบว่ามี Buff ประเภทนี้หรือไม่
     */
    hasBuff(type) {
        return this.buffs.some(b => b.type === type);
    }

    /**
     * ดึงค่า Shield ที่เหลือ (รวมทุก Stack)
     */
    getTotalShield() {
        return this.buffs
            .filter(b => b.type === BuffType.SHIELD)
            .reduce((sum, b) => sum + b.value * b.stack, 0);
    }

    /**
     * ลดค่า Shield (ใช้เมื่อโดนโจมตี)
     * @param {number} damage - ดาเมจที่ได้รับ
     * @returns {number} ดาเมจที่เหลือหลังจากกัน Shield
     */
    reduceShield(damage) {
        let remainingDamage = damage;

        const shields = this.buffs.filter(b => b.type === BuffType.SHIELD);
        for (const shield of shields) {
            const shieldTotal = shield.value * shield.stack;
            if (shieldTotal >= remainingDamage) {
                // Shield กันได้หมด
                shield.value = (shieldTotal - remainingDamage) / shield.stack;
                return 0;
            } else {
                // Shield หมด
                remainingDamage -= shieldTotal;
                shield.value = 0;
                shield.stack = 0;
            }
        }

        // ลบ Shield ที่หมดแล้ว
        this.buffs = this.buffs.filter(b => b.type !== BuffType.SHIELD || b.value > 0);

        return remainingDamage;
    }

    /**
     * ลดระยะเวลา Buff ทั้งหมด 1 เทิร์น
     * @param {Array} log - เก็บข้อความ (optional)
     * @returns {Array} Buff ที่หมดอายุ
     */
    tickDown(log = null) {
        const expired = [];

        for (let i = this.buffs.length - 1; i >= 0; i--) {
            const buff = this.buffs[i];
            const isExpired = buff.tickDown();

            if (isExpired) {
                expired.push(this.buffs.splice(i, 1)[0]);
            }
        }

        return expired;
    }

    /**
     * คำนวณผลของ Buff ต่อ Stat
     * @param {string} statKey - ชื่อ Stat
     * @param {number} baseValue - ค่าเดิม
     * @returns {number} ค่าใหม่
     */
    applyToStat(statKey, baseValue) {
        let result = baseValue;

        // เรียงลำดับให้ Buff ก่อน Debuff
        const buffs = this.buffs.filter(b => !b.isDebuff());
        const debuffs = this.buffs.filter(b => b.isDebuff());

        // ใช้ Buff ก่อน
        for (const buff of buffs) {
            result = buff.applyToStat(statKey, result);
        }

        // แล้วใช้ Debuff
        for (const buff of debuffs) {
            result = buff.applyToStat(statKey, result);
        }

        return Math.max(0, result);
    }

    /**
     * ตรวจสอบว่าโดน Stun หรือไม่
     */
    isStunned() {
        return this.hasBuff(BuffType.STUN);
    }

    /**
     * ตรวจสอบว่าโดน Silence หรือไม่
     */
    isSilenced() {
        return this.hasBuff(BuffType.SILENCE);
    }

    /**
     * ตรวจสอบว่าเป็น Immortal หรือไม่
     */
    isImmune() {
        return this.hasBuff(BuffType.IMMUNE);
    }

    /**
     * ดึงค่า Damage Over Time ทั้งหมด
     * @param {number} maxHp - HP สูงสุด
     * @returns {number} ดาเมจรวม
     */
    getTotalTickDamage(maxHp) {
        let total = 0;
        for (const buff of this.buffs) {
            total += buff.calculateTickDamage(maxHp);
        }
        return total;
    }

    /**
     * ดึงค่า Heal Over Time ทั้งหมด
     * @param {number} maxHp - HP สูงสุด
     * @returns {number} HP ที่ฟื้นรวม
     */
    getTotalTickHeal(maxHp) {
        let total = 0;
        for (const buff of this.buffs) {
            total += buff.calculateTickHeal(maxHp);
        }
        return total;
    }

    /**
     * สร้าง Array สำหรับแสดงผล
     */
    toDisplay() {
        return this.buffs.map(b => ({
            name: b.name,
            icon: b.icon,
            duration: b.duration,
            stack: b.stack,
            isDebuff: b.isDebuff(),
            type: b.type,
        }));
    }

    /**
     * คัดลอก BuffManager
     */
    clone() {
        const manager = new BuffManager();
        for (const buff of this.buffs) {
            manager.buffs.push(buff.clone());
        }
        return manager;
    }
}

// =============================================================================
// BUFF FACTORY — สร้าง Buff แบบง่าย
// =============================================================================

export const BuffFactory = {
    /**
     * สร้าง Buff ATK_UP
     */
    atkUp(value = 20, duration = 3, sourceId = null) {
        return new Buff(BuffType.ATK_UP, duration, value, sourceId, 'เพิ่มพลังโจมตี', '⚔️');
    },

    /**
     * สร้าง Buff DEF_UP
     */
    defUp(value = 20, duration = 3, sourceId = null) {
        return new Buff(BuffType.DEF_UP, duration, value, sourceId, 'เพิ่มพลังป้องกัน', '🛡️');
    },

    /**
     * สร้าง Buff AGI_UP
     */
    agiUp(value = 10, duration = 3, sourceId = null) {
        return new Buff(BuffType.AGI_UP, duration, value, sourceId, 'เพิ่มความว่องไว', '💨');
    },

    /**
     * สร้าง Buff CRIT_UP
     */
    critUp(value = 5, duration = 3, sourceId = null) {
        return new Buff(BuffType.CRIT_UP, duration, value, sourceId, 'เพิ่มคริติคอล', '🎯');
    },

    /**
     * สร้าง Buff CRIT_DMG_UP
     */
    critDmgUp(value = 20, duration = 3, sourceId = null) {
        return new Buff(BuffType.CRIT_DMG_UP, duration, value, sourceId, 'เพิ่มดาเมจคริติคอล', '💥');
    },

    /**
     * สร้าง Buff DODGE_UP
     */
    dodgeUp(value = 5, duration = 3, sourceId = null) {
        return new Buff(BuffType.DODGE_UP, duration, value, sourceId, 'เพิ่มหลบหลีก', '🌀');
    },

    /**
     * สร้าง Buff REGEN
     */
    regen(duration = 3, sourceId = null) {
        const buff = new Buff(BuffType.REGEN, duration, 0, sourceId, 'ฟื้นฟูชีวิต', '💚');
        buff.tickHeal = 5; // 5% ต่อเทิร์น
        return buff;
    },

    /**
     * สร้าง Buff SHIELD
     */
    shield(value = 100, duration = 3, sourceId = null) {
        return new Buff(BuffType.SHIELD, duration, value, sourceId, 'โล่ป้องกัน', '🔰');
    },

    /**
     * สร้าง Buff IMMUNE
     */
    immune(duration = 1, sourceId = null) {
        return new Buff(BuffType.IMMUNE, duration, 0, sourceId, 'ภูมิคุ้มกัน', '⭐');
    },

    /**
     * สร้าง Buff BERSERK
     */
    berserk(value = 30, duration = 3, sourceId = null) {
        return new Buff(BuffType.BERSERK, duration, value, sourceId, 'คลั่ง', '🔥');
    },

    /**
     * สร้าง Buff POISON
     */
    poison(duration = 3, sourceId = null) {
        const buff = new Buff(BuffType.POISON, duration, 0, sourceId, 'พิษ', '☠️');
        buff.tickDamage = 2; // 2% ต่อเทิร์น
        return buff;
    },

    /**
     * สร้าง Buff BURN
     */
    burn(duration = 3, sourceId = null) {
        const buff = new Buff(BuffType.BURN, duration, 0, sourceId, 'ไฟไหม้', '🔥');
        buff.tickDamage = 3; // 3% ต่อเทิร์น
        return buff;
    },

    /**
     * สร้าง Buff BLEED
     */
    bleed(duration = 3, sourceId = null) {
        const buff = new Buff(BuffType.BLEED, duration, 0, sourceId, 'เลือดออก', '🩸');
        buff.tickDamage = 4; // 4% ต่อเทิร์น
        return buff;
    },

    /**
     * สร้าง Buff STUN
     */
    stun(duration = 1, sourceId = null) {
        return new Buff(BuffType.STUN, duration, 0, sourceId, 'สตัน', '💫');
    },

    /**
     * สร้าง Buff SILENCE
     */
    silence(duration = 2, sourceId = null) {
        return new Buff(BuffType.SILENCE, duration, 0, sourceId, 'เงียบ', '🔇');
    },

    /**
     * สร้าง Buff TAUNT
     */
    taunt(duration = 2, sourceId = null) {
        return new Buff(BuffType.TAUNT, duration, 0, sourceId, 'ยั่วโมโห', '😡');
    },

    /**
     * สร้าง Buff SLOW
     */
    slow(value = 30, duration = 3, sourceId = null) {
        return new Buff(BuffType.SLOW, duration, value, sourceId, 'ช้าลง', '🐢');
    },

    /**
     * สร้าง Buff BLIND
     */
    blind(value = 30, duration = 3, sourceId = null) {
        return new Buff(BuffType.BLIND, duration, value, sourceId, 'ตาบอด', '🙈');
    },

    /**
     * สร้าง Buff ATK_DOWN
     */
    atkDown(value = 20, duration = 3, sourceId = null) {
        return new Buff(BuffType.ATK_DOWN, duration, value, sourceId, 'ลดพลังโจมตี', '⚔️⬇️');
    },

    /**
     * สร้าง Buff DEF_DOWN
     */
    defDown(value = 20, duration = 3, sourceId = null) {
        return new Buff(BuffType.DEF_DOWN, duration, value, sourceId, 'ลดพลังป้องกัน', '🛡️⬇️');
    },
};

// =============================================================================
// PUBLIC API
// =============================================================================

export const BuffSystem = Object.freeze({
    // Types
    BuffType,
    Buff,
    BuffManager,
    BuffFactory,

    // Helpers
    isDebuffType: (type) => {
        const debuffs = [
            BuffType.ATK_DOWN, BuffType.DEF_DOWN, BuffType.AGI_DOWN,
            BuffType.CRIT_DOWN, BuffType.DODGE_DOWN, BuffType.ACC_DOWN,
            BuffType.POISON, BuffType.BURN, BuffType.BLEED,
            BuffType.STUN, BuffType.SILENCE, BuffType.TAUNT,
            BuffType.SLOW, BuffType.BLIND,
        ];
        return debuffs.includes(type);
    },
});

// รองรับทั้ง Browser และ Node.js
if (typeof window !== 'undefined') {
    window.BuffSystem = BuffSystem;
}

export default BuffSystem;