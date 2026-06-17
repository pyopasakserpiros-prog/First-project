/**
 * =============================================================================
 * js/save.js — Jianghu RPG
 * Save & Load System using localStorage
 * =============================================================================
 *
 * หน้าที่:
 *   - บันทึกข้อมูลผู้เล่นลง localStorage
 *   - โหลดข้อมูลผู้เล่นจาก localStorage
 *   - ลบข้อมูลเซฟ
 *   - ตรวจสอบว่ามีเซฟอยู่หรือไม่
 *
 * ข้อกำหนด:
 *   - รับและคืนค่า Player Object ตาม Schema ใน Game Bible (player.js)
 *   - ไม่แก้ไข player.js
 *   - ไม่สร้าง UI
 *   - รองรับทั้ง Browser และ Node.js (export)
 *
 * @dependency localStorage (Browser API)
 * =============================================================================
 */

"use strict";

// คีย์ที่ใช้เก็บข้อมูลใน localStorage
const SAVE_KEY = "jianghu_save";

/**
 * บันทึกข้อมูลผู้เล่นลง localStorage
 * @param {Object} player - Player object จาก PlayerModule.createNewPlayer หรือที่โหลดมา
 * @returns {boolean} true หากบันทึกสำเร็จ, false หากเกิดข้อผิดพลาด
 */
function saveGame(player) {
    // ตรวจสอบว่า player object มีความถูกต้องคร่าวๆ (ไม่ใช่ null/undefined)
    if (!player || typeof player !== "object") {
        console.error("[SaveSystem] saveGame: Invalid player object");
        return false;
    }

    // ตรวจสอบว่า localStorage พร้อมใช้งานหรือไม่ (อยู่ใน Browser)
    if (typeof localStorage === "undefined") {
        console.error("[SaveSystem] saveGame: localStorage is not available");
        return false;
    }

    try {
        const jsonString = JSON.stringify(player);
        localStorage.setItem(SAVE_KEY, jsonString);
        return true;
    } catch (error) {
        console.error("[SaveSystem] saveGame: Failed to save", error);
        return false;
    }
}

/**
 * โหลดข้อมูลผู้เล่นจาก localStorage
 * @returns {Object|null} Player object หากมีเซฟและพาร์สสำเร็จ, null หากไม่มีเซฟหรือเกิดข้อผิดพลาด
 */
function loadGame() {
    if (typeof localStorage === "undefined") {
        console.error("[SaveSystem] loadGame: localStorage is not available");
        return null;
    }

    try {
        const rawData = localStorage.getItem(SAVE_KEY);
        if (!rawData) {
            return null; // ไม่มีเซฟ
        }

        const player = JSON.parse(rawData);
        // ตรวจสอบคร่าวๆ ว่ามีฟิลด์สำคัญ (id, name, level) ตาม Schema หรือไม่
        if (!player.id || !player.name || player.level === undefined) {
            console.warn("[SaveSystem] loadGame: Loaded data does not look like a valid player object");
            return null;
        }

        return player;
    } catch (error) {
        console.error("[SaveSystem] loadGame: Failed to load or parse", error);
        return null;
    }
}

/**
 * ลบข้อมูลเซฟออกจาก localStorage
 * @returns {boolean} true หากลบสำเร็จหรือไม่มีเซฟ, false หากเกิดข้อผิดพลาด
 */
function deleteSave() {
    if (typeof localStorage === "undefined") {
        console.error("[SaveSystem] deleteSave: localStorage is not available");
        return false;
    }

    try {
        localStorage.removeItem(SAVE_KEY);
        return true;
    } catch (error) {
        console.error("[SaveSystem] deleteSave: Failed to delete", error);
        return false;
    }
}

/**
 * ตรวจสอบว่ามีเซฟอยู่ใน localStorage หรือไม่
 * @returns {boolean} true หากมีเซฟ, false หากไม่มีหรือ localStorage ใช้ไม่ได้
 */
function hasSave() {
    if (typeof localStorage === "undefined") {
        return false;
    }

    try {
        const saved = localStorage.getItem(SAVE_KEY);
        return saved !== null;
    } catch (error) {
        console.error("[SaveSystem] hasSave: Failed to check", error);
        return false;
    }
}

// =============================================================================
// EXPORT (รองรับทั้ง Browser และ Node.js)
// =============================================================================

const SaveModule = Object.freeze({
    saveGame,
    loadGame,
    deleteSave,
    hasSave,
    SAVE_KEY, // เผื่อระบบอื่นต้องการทราบคีย์ที่ใช้
});

if (typeof window !== "undefined") {
    window.SaveModule = SaveModule;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = SaveModule;
}
