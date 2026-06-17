/**
 * =============================================================================
 * js/inventory.js — Jianghu RPG
 * Inventory Management Module
 * =============================================================================
 *
 * รับผิดชอบ: จัดการคลังไอเทมของผู้เล่น (เพิ่ม ลบ ตรวจสอบ นับ ล้าง)
 *            รองรับไอเทมซ้อน (Stackable) และไม่ซ้อน (Non-Stackable)
 *
 * อ้างอิง: Jianghu RPG — Game Bible v1.0
 *   - Section 13: Data Schema (Player Schema §13.1, Item Schema §13.2)
 *   - Inventory ใน Player Schema คือ Array<ItemRef>
 *
 * ไม่รับผิดชอบ: UI, Battle, Shop, Event, Equipment Logic, Stat Calculation,
 *               Item Generation, Drop Tables
 *
 * หมายเหตุ: โมดูลนี้ mutate player.inventory โดยตรง และอัปเดต
 *            player._updated_at (ถ้ามี) เพื่อให้สอดคล้องกับ player.js
 * =============================================================================
 */

"use strict";

// =============================================================================
// SECTION A: CONSTANTS
// =============================================================================

/**
 * ค่าคงที่สำหรับระบบคลัง
 */
const INVENTORY_CONSTANTS = Object.freeze({
  /** จำนวน Stack สูงสุดเริ่มต้นสำหรับไอเทมที่ซ้อนได้ */
  DEFAULT_MAX_STACK: 99,

  /** จำนวน Stack สูงสุดสำหรับไอเทมที่มีขนาด stack เล็ก (เช่น ยา, วัสดุหายาก) */
  SMALL_MAX_STACK: 20,

  /** จำนวน Stack สูงสุดสำหรับไอเทม Quest (ไม่ซ้อนโดยปกติ) */
  QUEST_MAX_STACK: 1,
});

// =============================================================================
// SECTION B: PRIVATE HELPERS
// =============================================================================

/**
 * ตรวจสอบว่า object เป็น Player ที่ถูกต้องและมี inventory array
 * @param {*} player
 */
function _assertPlayer(player) {
  if (!player || typeof player !== "object") {
    throw new Error("Invalid player object.");
  }
  if (!Array.isArray(player.inventory)) {
    throw new Error("Player object is missing inventory array.");
  }
}

/**
 * สร้าง Instance ID แบบง่ายสำหรับแต่ละ entry ในคลัง
 * (Production ควรใช้ UUID library)
 * @returns {string}
 */
function _generateInstanceId() {
  return (
    "inv_" +
    Date.now().toString(36) +
    "_" +
    Math.random().toString(36).slice(2, 7)
  );
}

/**
 * อัปเดต _updated_at timestamp ของ player (ถ้ามี field นั้น)
 * เพื่อให้สอดคล้องกับ pattern ของ player.js
 * @param {Object} player
 */
function _touch(player) {
  if (player && typeof player === "object" && "_updated_at" in player) {
    player._updated_at = Date.now();
  }
}

/**
 * หา index ของ stack ที่มี itemId เดียวกันและยังไม่เต็ม
 * @param {Object} player
 * @param {string} itemId
 * @param {number} maxStack
 * @returns {number} index หรือ -1 ถ้าไม่พบ
 */
function _findStackableSlot(player, itemId, maxStack) {
  return player.inventory.findIndex(
    (entry) => entry.itemId === itemId && entry.quantity < maxStack
  );
}

/**
 * คำนวณจำนวนรวมของ itemId หนึ่งๆ ในคลังทั้งหมด
 * @param {Object} player
 * @param {string} itemId
 * @returns {number}
 */
function _getTotalQuantity(player, itemId) {
  return player.inventory.reduce((sum, entry) => {
    return entry.itemId === itemId ? sum + (entry.quantity || 1) : sum;
  }, 0);
}

/**
 * สร้าง entry ใหม่สำหรับคลัง
 * @param {string} itemId
 * @param {number} quantity
 * @param {boolean} stackable
 * @returns {Object}
 */
function _createInventoryEntry(itemId, quantity, stackable) {
  return {
    instanceId: _generateInstanceId(),
    itemId: itemId,
    quantity: stackable ? quantity : 1,
    // หมายเหตุ: ไม่เก็บชื่อ, ค่าสเตตัส, รูปภาพ, หรือข้อมูลฝั่ง Client ในนี้
    // ระบบภายนอกจะใช้ itemId อ้างอิงไปยัง Item Database เท่านั้น
  };
}

// =============================================================================
// SECTION C: CORE API — ADD / REMOVE / CHECK / LIST / CLEAR
// =============================================================================

/**
 * เพิ่มไอเทมเข้าคลังผู้เล่น
 *
 * หลักการ:
 *   - ถ้า stackable: พยายามเติมเข้า stack ที่มีอยู่ก่อน ถ้าเต็มหรือไม่มีค่อยสร้างใหม่
 *   - ถ้าไม่ stackable: สร้าง entry ใหม่ทีละอัน (quantity = 1 ต่อ entry)
 *
 * @param {Object} player - Player object
 * @param {string} itemId - รหัสอ้างอิงไอเทมจาก Item Database
 * @param {number} [quantity=1] - จำนวนที่ต้องการเพิ่ม (ต้องเป็นจำนวนเต็มบวก)
 * @param {Object} [options={}] - ตัวเลือกเพิ่มเติม
 * @param {boolean} [options.stackable=false] - ไอเทมซ้อนได้หรือไม่
 * @param {number} [options.maxStack=99] - จำนวนสูงสุดต่อ stack (ถ้า stackable)
 * @returns {Object} ผลลัพธ์ { added: number, entries: Array<entry> }
 */
function addItem(player, itemId, quantity = 1, options = {}) {
  _assertPlayer(player);

  if (!itemId || typeof itemId !== "string") {
    throw new Error("itemId must be a non-empty string.");
  }
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a positive integer.");
  }

  const stackable = options.stackable === true;
  const maxStack = stackable
    ? Number.isInteger(options.maxStack) && options.maxStack > 0
      ? options.maxStack
      : INVENTORY_CONSTANTS.DEFAULT_MAX_STACK
    : 1;

  let remaining = quantity;
  const newEntries = [];

  if (stackable) {
    // พยายามเติมเข้า stack ที่มีอยู่ก่อน แล้วค่อยสร้างใหม่
    while (remaining > 0) {
      const slotIndex = _findStackableSlot(player, itemId, maxStack);

      if (slotIndex === -1) {
        // ไม่มี stack ที่ว่างเหลือ → สร้าง stack ใหม่
        const addQty = Math.min(remaining, maxStack);
        const entry = _createInventoryEntry(itemId, addQty, true);
        player.inventory.push(entry);
        newEntries.push(entry);
        remaining -= addQty;
      } else {
        // เติมเข้า stack ที่มีอยู่
        const slot = player.inventory[slotIndex];
        const space = maxStack - slot.quantity;
        const addQty = Math.min(remaining, space);
        slot.quantity += addQty;
        remaining -= addQty;
      }
    }
  } else {
    // ไม่ stackable: สร้าง entry ใหม่ทีละอัน
    for (let i = 0; i < quantity; i++) {
      const entry = _createInventoryEntry(itemId, 1, false);
      player.inventory.push(entry);
      newEntries.push(entry);
      remaining -= 1;
    }
  }

  _touch(player);

  return {
    added: quantity,
    entries: newEntries,
  };
}

/**
 * ลบไอเทมออกจากคลัง
 *
 * หลักการ:
 *   - ลบจาก stack แรกที่เจอ (FIFO ภายใน itemId เดียวกัน)
 *   - ถ้า stack ไหน quantity ถึง 0 จะถูกกรองออกจาก array
 *   - ถ้าจำนวนไม่พอจะ throw Error
 *
 * @param {Object} player - Player object
 * @param {string} itemId - รหัสไอเทม
 * @param {number} [quantity=1] - จำนวนที่ต้องการลบ
 * @returns {Object} ผลลัพธ์ { removed: number, affectedEntries: Array }
 * @throws {Error} ถ้าจำนวนไอเทมไม่พอให้ลบ
 */
function removeItem(player, itemId, quantity = 1) {
  _assertPlayer(player);

  if (!itemId || typeof itemId !== "string") {
    throw new Error("itemId must be a non-empty string.");
  }
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a positive integer.");
  }

  const available = _getTotalQuantity(player, itemId);
  if (available < quantity) {
    throw new Error(
      `Cannot remove ${quantity} of item "${itemId}". Only ${available} available.`
    );
  }

  let toRemove = quantity;
  const affectedEntries = [];

  // วนลบจากหน้าไปหลัง (FIFO) — เอา stack แรกที่เจอก่อน
  for (let i = 0; i < player.inventory.length && toRemove > 0; i++) {
    const entry = player.inventory[i];
    if (entry.itemId !== itemId) continue;

    const currentQty = entry.quantity || 1;

    if (currentQty <= toRemove) {
      // ลบทั้ง entry นี้
      affectedEntries.push({ ...entry });
      player.inventory.splice(i, 1);
      toRemove -= currentQty;
      i--; // ปรับ index หลัง splice
    } else {
      // ลบแค่บางส่วนจาก stack
      entry.quantity -= toRemove;
      affectedEntries.push({
        instanceId: entry.instanceId,
        itemId: entry.itemId,
        quantity: toRemove,
      });
      toRemove = 0;
    }
  }

  _touch(player);

  return {
    removed: quantity,
    affectedEntries: affectedEntries,
  };
}

/**
 * ตรวจสอบว่าผู้เล่นมีไอเทมจำนวนที่ต้องการหรือไม่
 *
 * @param {Object} player - Player object
 * @param {string} itemId - รหัสไอเทม
 * @param {number} [quantity=1] - จำนวนที่ต้องการตรวจสอบ
 * @returns {boolean}
 */
function hasItem(player, itemId, quantity = 1) {
  _assertPlayer(player);

  if (!itemId || typeof itemId !== "string") return false;
  if (!Number.isInteger(quantity) || quantity <= 0) return false;

  return _getTotalQuantity(player, itemId) >= quantity;
}

/**
 * นับจำนวนไอเทมทั้งหมดของ itemId หนึ่งๆ ในคลัง
 *
 * @param {Object} player - Player object
 * @param {string} itemId - รหัสไอเทม
 * @returns {number}
 */
function getItemCount(player, itemId) {
  _assertPlayer(player);

  if (!itemId || typeof itemId !== "string") return 0;

  return _getTotalQuantity(player, itemId);
}

/**
 * ดึงรายการไอเทมทั้งหมดในคลัง
 * คืนค่าเป็น shallow copy เพื่อป้องกันการ mutate จากภายนอก
 *
 * @param {Object} player - Player object
 * @returns {Array<Object>} สำเนาของ player.inventory
 */
function getInventory(player) {
  _assertPlayer(player);

  return player.inventory.map((entry) => ({ ...entry }));
}

/**
 * ล้างข้อมูลคลังทั้งหมด
 *
 * @param {Object} player - Player object
 * @returns {Array<Object>} รายการไอเทมทั้งหมดที่ถูกล้าง (สำเนา)
 */
function clearInventory(player) {
  _assertPlayer(player);

  const cleared = player.inventory.map((entry) => ({ ...entry }));
  player.inventory.length = 0; // ล้าง array โดยไม่สร้าง reference ใหม่

  _touch(player);

  return cleared;
}

// =============================================================================
// SECTION D: UTILITY API
// =============================================================================

/**
 * ดึงรายละเอียดของ entry ในคลังตาม instanceId
 *
 * @param {Object} player - Player object
 * @param {string} instanceId - รหัส instance ภายในคลัง
 * @returns {Object|null} สำเนาของ entry หรือ null ถ้าไม่พบ
 */
function getItemByInstanceId(player, instanceId) {
  _assertPlayer(player);

  if (!instanceId || typeof instanceId !== "string") return null;

  const entry = player.inventory.find((e) => e.instanceId === instanceId);
  return entry ? { ...entry } : null;
}

/**
 * นับจำนวน slot (entry) ทั้งหมดในคลัง
 * หมายเหตุ: ไม่ใช่จำนวนไอเทมรวม แต่เป็น length ของ array
 *
 * @param {Object} player - Player object
 * @returns {number}
 */
function getInventorySize(player) {
  _assertPlayer(player);
  return player.inventory.length;
}

/**
 * ตรวจสอบว่าคลังว่างเปล่าหรือไม่
 *
 * @param {Object} player - Player object
 * @returns {boolean}
 */
function isInventoryEmpty(player) {
  _assertPlayer(player);
  return player.inventory.length === 0;
}

/**
 * ดึงรายการ itemId ทั้งหมดที่มีในคลัง (ไม่ซ้ำ)
 *
 * @param {Object} player - Player object
 * @returns {Array<string>}
 */
function getUniqueItemIds(player) {
  _assertPlayer(player);

  const ids = new Set();
  for (const entry of player.inventory) {
    if (entry.itemId) ids.add(entry.itemId);
  }
  return Array.from(ids);
}

// =============================================================================
// SECTION E: PUBLIC API EXPORT
// =============================================================================

/**
 * InventoryModule — API สาธารณะสำหรับระบบอื่น
 *
 * ระบบภายนอกเรียกใช้ผ่าน InventoryModule.xxx() เท่านั้น
 * ตัวแปรและ Helper ส่วนตัว (prefix _) ไม่ได้ Expose
 */
const InventoryModule = Object.freeze({
  // Constants (read-only)
  CONSTANTS: INVENTORY_CONSTANTS,

  // Core Operations
  addItem,
  removeItem,
  hasItem,
  getItemCount,
  getInventory,
  clearInventory,

  // Utility
  getItemByInstanceId,
  getInventorySize,
  isInventoryEmpty,
  getUniqueItemIds,
});

// รองรับทั้ง Browser (window) และ Node.js (module.exports)
if (typeof window !== "undefined") {
  window.InventoryModule = InventoryModule;
} else if (typeof module !== "undefined" && module.exports) {
  module.exports = InventoryModule;
}
