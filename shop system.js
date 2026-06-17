/**
 * =============================================================================
 * js/shop.js — Jianghu RPG
 * Shop System — ซื้อ-ขายไอเทม (Dynamic Inventory from Item Generator)
 * =============================================================================
 *
 * รับผิดชอบ:
 *   - สร้างร้านค้าแบบสุ่มจาก ItemGenerator (ตาม Game Bible §11.3)
 *   - ซื้อไอเทมจากร้าน
 *   - ขายไอเทมให้ร้าน
 *   - Refresh ร้านค้า (จำลองการรีเซ็ต 24 ชม.)
 *
 * อ้างอิง: Game Bible §11 (Economy System)
 *   - General Shop: ขาว-เขียว, Refresh 24 ชม.
 *   - Elite Shop: ฟ้า-ม่วง, ปลดล็อก Lv30, Refresh 72 ชม.
 * =============================================================================
 */

"use strict";

// =============================================================================
// IMPORTS
// =============================================================================

import { PlayerModule } from './player.js';
import { InventoryModule } from './inventory.js';
import { ItemGeneratorModule } from './item_generator.js';

// =============================================================================
// CONSTANTS & CONFIG
// =============================================================================

const SHOP_CONFIG = {
    // General Shop
    general: {
        count: 6, // จำนวนไอเทมในร้าน
        rarityPool: ['white', 'green'],
        rarityWeights: { white: 60, green: 40 },
        types: ['weapon', 'armor', 'accessory'],
        priceMultiplier: 2.5, // §11.4: Shop_Price = Power_Score × 2.5
    },
    // Elite Shop (ปลดล็อก Lv30)
    elite: {
        count: 4,
        rarityPool: ['blue', 'purple'],
        rarityWeights: { blue: 55, purple: 45 },
        types: ['weapon', 'armor', 'accessory'],
        priceMultiplier: 2.5,
    },
};

// =============================================================================
// STATE (จำลองการ Refresh)
// =============================================================================

let _cachedGeneralItems = null;
let _cachedEliteItems = null;
let _lastGeneralRefresh = 0;
let _lastEliteRefresh = 0;
const REFRESH_INTERVAL_GENERAL = 24 * 60 * 60 * 1000; // 24 ชม.
const REFRESH_INTERVAL_ELITE = 72 * 60 * 60 * 1000; // 72 ชม.

// =============================================================================
// HELPERS
// =============================================================================

/**
 * สุ่มเลือกตามน้ำหนัก
 */
function weightedRandomPick(items, weightKey = 'weight') {
    const total = Object.values(items).reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;
    for (const [key, weight] of Object.entries(items)) {
        roll -= weight;
        if (roll <= 0) return key;
    }
    return Object.keys(items)[0];
}

/**
 * คำนวณราคาขาย (Sell Price) ตาม Game Bible §11.5
 */
export function calculateSellPrice(itemData) {
    if (!itemData) return 0;
    // ถ้ามี sell_price ใช้เลย
    if (itemData.sell_price) return itemData.sell_price;
    // คำนวณจาก Power Score
    if (itemData.power_score) {
        return Math.floor(itemData.power_score * 0.3);
    }
    // Fallback
    return 5;
}

/**
 * คำนวณราคาซื้อ (Buy Price) ตาม Game Bible §11.4
 */
function calculateBuyPrice(itemData) {
    if (!itemData) return 10;
    if (itemData.power_score) {
        return Math.floor(itemData.power_score * 2.5);
    }
    return 10;
}

// =============================================================================
// GENERATE SHOP INVENTORY
// =============================================================================

/**
 * สร้างร้านค้าแบบสุ่ม
 * @param {string} shopType - "general" หรือ "elite"
 * @param {number} playerLevel - Level ผู้เล่น (ใช้กำหนด iLv)
 * @param {number} luck - ค่า LUCK ของผู้เล่น (มีผลต่อ Rarity เล็กน้อย)
 * @returns {Array} รายการไอเทมในร้าน { item, price, shopItemId }
 */
export function generateShopInventory(shopType = 'general', playerLevel = 1, luck = 0) {
    const config = SHOP_CONFIG[shopType];
    if (!config) return [];

    const items = [];
    const usedTypes = { weapon: 0, armor: 0, accessory: 0 };

    // ปรับ Rarity ตาม LUCK (เพิ่มโอกาสได้ของดี)
    const luckBonus = Math.min(luck * 0.002, 0.1); // สูงสุด +10%

    for (let i = 0; i < config.count; i++) {
        // 1. สุ่ม Rarity
        const adjustedWeights = { ...config.rarityWeights };
        const rarityKeys = Object.keys(adjustedWeights);
        
        // ถ้ามีหลายระดับ ให้ปรับน้ำหนักไปทางของดีขึ้นตาม LUCK
        if (rarityKeys.length > 1) {
            const highestRarity = rarityKeys[rarityKeys.length - 1];
            const lowestRarity = rarityKeys[0];
            const shift = Math.floor(adjustedWeights[lowestRarity] * luckBonus);
            adjustedWeights[lowestRarity] = Math.max(0, adjustedWeights[lowestRarity] - shift);
            adjustedWeights[highestRarity] = (adjustedWeights[highestRarity] || 0) + shift;
        }

        const rarity = weightedRandomPick(adjustedWeights);

        // 2. สุ่มประเภท (ให้สมดุล)
        let availableTypes = config.types.filter(t => usedTypes[t] < Math.ceil(config.count / 3) + 1);
        if (availableTypes.length === 0) availableTypes = config.types;
        const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        usedTypes[type] = (usedTypes[type] || 0) + 1;

        // 3. กำหนด iLv (ไม่เกิน Player Level + 3 แต่ไม่ต่ำกว่า 1)
        const ilvl = Math.min(Math.max(1, playerLevel + Math.floor(Math.random() * 5) - 2), 90);

        // 4. สร้างไอเทมด้วย ItemGenerator
        const item = ItemGeneratorModule.generateItem(rarity, ilvl, type, luck);

        if (item) {
            // 5. คำนวณราคา
            const price = calculateBuyPrice(item);

            // 6. สร้าง shopItemId สำหรับอ้างอิง
            const shopItemId = `shop_${shopType}_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 5)}`;

            items.push({
                shopItemId: shopItemId,
                item: item,
                price: price,
                rarity: rarity,
                type: type,
            });
        }
    }

    return items;
}

// =============================================================================
// SHOP API
// =============================================================================

/**
 * ดึงรายการสินค้า General Shop (พร้อม Auto-Refresh)
 */
export function getGeneralShopItems(playerLevel = 1, luck = 0) {
    const now = Date.now();
    if (!_cachedGeneralItems || (now - _lastGeneralRefresh) > REFRESH_INTERVAL_GENERAL) {
        _cachedGeneralItems = generateShopInventory('general', playerLevel, luck);
        _lastGeneralRefresh = now;
    }
    return _cachedGeneralItems;
}

/**
 * ดึงรายการสินค้า Elite Shop (พร้อม Auto-Refresh)
 */
export function getEliteShopItems(playerLevel = 1, luck = 0) {
    // ตรวจสอบปลดล็อก
    if (!isEliteShopUnlocked(playerLevel)) {
        return null;
    }

    const now = Date.now();
    if (!_cachedEliteItems || (now - _lastEliteRefresh) > REFRESH_INTERVAL_ELITE) {
        _cachedEliteItems = generateShopInventory('elite', playerLevel, luck);
        _lastEliteRefresh = now;
    }
    return _cachedEliteItems;
}

/**
 * บังคับ Refresh ร้านค้า (ใช้ตอนเปิดร้าน หรือปุ่ม Refresh)
 */
export function refreshShops(playerLevel = 1, luck = 0) {
    _cachedGeneralItems = generateShopInventory('general', playerLevel, luck);
    _lastGeneralRefresh = Date.now();
    
    if (isEliteShopUnlocked(playerLevel)) {
        _cachedEliteItems = generateShopInventory('elite', playerLevel, luck);
        _lastEliteRefresh = Date.now();
    }
    
    return {
        general: _cachedGeneralItems,
        elite: _cachedEliteItems,
    };
}

/**
 * ตรวจสอบว่า Elite Shop ปลดล็อกแล้วหรือยัง
 */
export function isEliteShopUnlocked(playerLevel) {
    return playerLevel >= 30;
}

/**
 * ซื้อไอเทมจากร้าน
 * @param {Object} player - Player object
 * @param {string} shopItemId - shopItemId ที่ได้จาก getShopItems
 * @param {string} shopType - "general" หรือ "elite"
 * @returns {{ success: boolean, message: string, item: Object|null }}
 */
export function buyItem(player, shopItemId, shopType = 'general') {
    if (!player) {
        return { success: false, message: 'ไม่มีข้อมูลผู้เล่น', item: null };
    }

    // หารายการในร้าน
    const inventory = shopType === 'elite' ? _cachedEliteItems : _cachedGeneralItems;
    if (!inventory) {
        return { success: false, message: 'ร้านค้ายังไม่ได้โหลด', item: null };
    }

    const shopEntry = inventory.find(entry => entry.shopItemId === shopItemId);
    if (!shopEntry) {
        return { success: false, message: 'ไม่พบไอเทมในร้าน (อาจ Refresh ไปแล้ว)', item: null };
    }

    const itemData = shopEntry.item;
    const price = shopEntry.price;

    // ตรวจสอบเงิน
    if (player.gold < price) {
        return { success: false, message: `เงินไม่พอ ต้องการ ${price} มี ${player.gold}`, item: null };
    }

    // หักเงิน
    try {
        PlayerModule.updateGold(player, -price);
    } catch (e) {
        return { success: false, message: e.message, item: null };
    }

    // สร้างสำเนาไอเทม (ป้องกันการอ้างอิง)
    const purchasedItem = JSON.parse(JSON.stringify(itemData));
    purchasedItem.id = purchasedItem.id || `item_${Date.now()}`;

    // เพิ่มเข้าคลัง
    try {
        // ไอเทมทั่วไปไม่ stack (อุปกรณ์)
        const isStackable = purchasedItem.is_consumable || false;
        InventoryModule.addItem(player, purchasedItem.id, 1, { 
            stackable: isStackable, 
            maxStack: isStackable ? 99 : 1 
        });

        // เก็บ itemData (สำหรับแสดงผล)
        const entries = player.inventory.filter(e => e.itemId === purchasedItem.id);
        if (entries.length > 0) {
            const lastEntry = entries[entries.length - 1];
            lastEntry.itemData = purchasedItem;
        }
    } catch (e) {
        // คืนเงิน
        try {
            PlayerModule.updateGold(player, price);
        } catch (e2) {}
        return { success: false, message: `ไม่สามารถเพิ่มไอเทมเข้าคลัง: ${e.message}`, item: null };
    }

    // ลบไอเทมออกจากร้าน (ซื้อไปแล้ว 1 ชิ้น)
    // ในเกมจริงอาจจะไม่ลบ แต่ให้ซื้อได้ครั้งละ 1 ชิ้น
    // ผมจะทำการลบออกเพื่อไม่ให้ซื้อซ้ำ (ตามระบบร้านค้าทั่วไป)
    const index = inventory.indexOf(shopEntry);
    if (index !== -1) {
        inventory.splice(index, 1);
    }

    return {
        success: true,
        message: `ซื้อ ${purchasedItem.name || purchasedItem.id} สำเร็จ! (${price} Gold)`,
        item: purchasedItem,
    };
}

/**
 * ขายไอเทมให้ร้าน
 * @param {Object} player - Player object
 * @param {string} instanceId - instanceId ของไอเทมในคลัง
 * @param {number} quantity - จำนวนที่ต้องการขาย (default 1)
 * @returns {{ success: boolean, message: string, gold: number }}
 */
export function sellItem(player, instanceId, quantity = 1) {
    if (!player) {
        return { success: false, message: 'ไม่มีข้อมูลผู้เล่น', gold: 0 };
    }

    // หาไอเทมในคลัง
    let entryIndex = -1;
    let entry = null;

    for (let i = 0; i < player.inventory.length; i++) {
        if (player.inventory[i].instanceId === instanceId) {
            entryIndex = i;
            entry = player.inventory[i];
            break;
        }
    }

    if (!entry) {
        return { success: false, message: 'ไม่พบไอเทมในคลัง', gold: 0 };
    }

    const itemData = entry.itemData;
    const sellPrice = calculateSellPrice(itemData) * quantity;

    // ตรวจสอบจำนวน
    const currentQty = entry.quantity || 1;
    const actualQty = Math.min(quantity, currentQty);

    if (actualQty < quantity) {
        return { success: false, message: `มีเพียง ${currentQty} ชิ้น`, gold: 0 };
    }

    // ลบไอเทม
    try {
        InventoryModule.removeItem(player, entry.itemId, actualQty);
    } catch (e) {
        return { success: false, message: `ไม่สามารถลบไอเทม: ${e.message}`, gold: 0 };
    }

    // เพิ่มเงิน
    try {
        PlayerModule.updateGold(player, sellPrice);
    } catch (e) {
        // คืนไอเทม
        try {
            InventoryModule.addItem(player, entry.itemId, actualQty, { stackable: true });
        } catch (e2) {}
        return { success: false, message: `ไม่สามารถเพิ่มเงิน: ${e.message}`, gold: 0 };
    }

    return {
        success: true,
        message: `ขาย ${entry.itemId} จำนวน ${actualQty} ชิ้น ได้ ${sellPrice} Gold`,
        gold: sellPrice,
    };
}

// =============================================================================
// PUBLIC API
// =============================================================================

export const ShopModule = Object.freeze({
    // Shop Data (Dynamic)
    getGeneralShopItems,
    getEliteShopItems,
    isEliteShopUnlocked,
    refreshShops,

    // Transactions
    buyItem,
    sellItem,
    calculateSellPrice,

    // Helpers
    generateShopInventory,
});

// รองรับทั้ง Browser และ Node.js
if (typeof window !== 'undefined') {
    window.ShopModule = ShopModule;
}

export default ShopModule;