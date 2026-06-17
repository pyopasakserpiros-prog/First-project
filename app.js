/**
 * =============================================================================
 * app.js — Jianghu RPG
 * UI Controller — จัดการทุกอย่างที่เกี่ยวกับ UI และการโต้ตอบ
 * =============================================================================
 */

// ============================================================
// IMPORTS
// ============================================================
import { PlayerModule } from './js/player.js';
import { InventoryModule } from './js/inventory.js';
import { EquipmentModule } from './js/equipment edit.js';
import { SaveModule } from './js/save.js';
import { SkillDatabase } from './js/skill database.js';
import { EnemyDatabase } from './js/enemy.js';
import { BossDatabase } from './js/boss database.js';
import miniBossDatabase from './js/mini_boss.js';
import { DropTable } from './js/drop table.js';
import { BattleModule } from './js/battle.js';
import { ExplorationModule } from './js/exploration.js';
import { ItemGeneratorModule } from './js/item_generator.js';
import { FollowerModule } from './js/followers system.js';
import { ShopModule } from './js/shop system.js';

// ============================================================
// STATE
// ============================================================
let player = null;
let currentPanel = 'battle';
let battleState = null;
let isInBattle = false;
let battleResolve = null;
let currentShopType = 'general';
let currentEventData = null;

// ============================================================
// DOM HELPERS
// ============================================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ============================================================
// INIT
// ============================================================
export function init() {
    // Try load save
    const saved = SaveModule.loadGame();
    if (saved) {
        player = saved;
        // Ensure player has all required fields
        if (!player.skills) player.skills = { active: [], passive: [] };
        if (!player.followers) player.followers = [];
        if (!player.unlocked_zones) player.unlocked_zones = ['MAP-001'];
        if (!player.current_zone) player.current_zone = 'MAP-001';
        if (!player.action_points && player.action_points !== 0) player.action_points = 20;
        if (!player.last_ap_regen) player.last_ap_regen = Date.now();
        if (!player._boss_timestamps) player._boss_timestamps = {};
        if (!player.defeated_bosses) player.defeated_bosses = [];
        if (!player.defeated_mini_bosses) player.defeated_mini_bosses = [];

        // Recalculate stats with equipment
        if (EquipmentModule && EquipmentModule.recalculateEquipmentStats) {
            EquipmentModule.recalculateEquipmentStats(player);
        }
        updateUI();
        addLog('ระบบ', 'โหลดข้อมูลเซฟสำเร็จ', 'system');
    } else {
        // Create new player
        player = PlayerModule.createNewPlayer('จอมยุทธ์พเนจร');
        // Give some starter gold
        player.gold = 100;
        // Give starter skills (id 1 and 11)
        if (player.skills) {
            const starterSkills = [1, 11];
            for (const sid of starterSkills) {
                const skill = SkillDatabase.find(s => s.id === sid);
                if (skill) {
                    if (skill.type === 'Active' && player.skills.active.length < player.skills.active_slots) {
                        player.skills.active.push(sid);
                    } else if (skill.type === 'Passive' && player.skills.passive.length < player.skills.passive_slots) {
                        player.skills.passive.push(sid);
                    }
                }
            }
        }
        // AP
        player.action_points = 20;
        player.last_ap_regen = Date.now();
        player._boss_timestamps = {};
        player.defeated_bosses = [];
        player.defeated_mini_bosses = [];
        // Recalculate stats
        if (EquipmentModule && EquipmentModule.recalculateEquipmentStats) {
            EquipmentModule.recalculateEquipmentStats(player);
        }
        SaveModule.saveGame(player);
        addLog('ระบบ', 'เริ่มเกมใหม่ ยินดีต้อนรับสู่ยุทธภพ!', 'system');
    }

    // Setup UI
    setupNavigation();
    setupBattle();
    setupStats();
    setupInventory();
    setupEquipment();
    setupSkills();
    setupMap();
    setupFollowers();
    setupShop();
    setupEvents();
    setupSaveButtons();

    // Initial render
    updateUI();
    renderBattleUI();
    renderAP();
    addLog('ระบบ', 'พร้อมใช้งานแล้ว', 'system');
}

// ============================================================
// NAVIGATION
// ============================================================
function setupNavigation() {
    $$('#sidebar .nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const panelId = btn.dataset.panel;
            showPanel(panelId);
        });
    });
}

export function showPanel(panelId) {
    currentPanel = panelId;
    // Update nav
    $$('#sidebar .nav-btn').forEach(b => b.classList.remove('active'));
    const navBtn = document.querySelector(`#sidebar .nav-btn[data-panel="${panelId}"]`);
    if (navBtn) navBtn.classList.add('active');

    // Update panels
    $$('.panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(`${panelId}-panel`);
    if (panel) panel.classList.add('active');

    // Refresh content
    switch (panelId) {
        case 'battle': renderBattleUI(); break;
        case 'stats': renderStats(); break;
        case 'inventory': renderInventory(); break;
        case 'equipment': renderEquipment(); break;
        case 'skills': renderSkills(); break;
        case 'map': renderMap(); renderAP(); break;
        case 'followers': renderFollowers(); break;
        case 'shop': renderShop(); break;
        case 'events': renderEvents(); break;
    }
}

// ============================================================
// UI UPDATE
// ============================================================
export function updateUI() {
    if (!player) return;
    updateMiniStats();
    updateFooterStatus();
    renderAP();
    // Update other panels if visible
    const panelId = currentPanel;
    switch (panelId) {
        case 'stats': renderStats(); break;
        case 'inventory': renderInventory(); break;
        case 'equipment': renderEquipment(); break;
        case 'skills': renderSkills(); break;
        case 'map': renderMap(); break;
        case 'followers': renderFollowers(); break;
        case 'shop': renderShop(); break;
        case 'events': renderEvents(); break;
        case 'battle':
        default: renderBattleUI(); break;
    }
}

function updateMiniStats() {
    const el = document.getElementById('miniStats');
    if (!player) return;
    const cs = player.combat_stats || {};
    el.innerHTML = `
        <span class="stat-item">
            <span class="label">👤</span>
            <span class="value">Lv.${player.level}</span>
        </span>
        <span class="stat-item">
            <span class="label">❤️</span>
            <span class="value hp">${Math.floor(cs.hp||0)}/${cs.hp_max||0}</span>
        </span>
        <span class="stat-item">
            <span class="label">💎</span>
            <span class="value mp">${Math.floor(cs.mp||0)}/${cs.mp_max||0}</span>
        </span>
        <span class="stat-item">
            <span class="label">⭐</span>
            <span class="value">${player.exp||0}/${player.exp_required||100}</span>
        </span>
        <span class="stat-item">
            <span class="label">💰</span>
            <span class="value gold">${player.gold||0}</span>
        </span>
        <span class="stat-item" style="font-size:0.6rem;color:var(--text-muted);">
            ${player.rank||'จอมยุทธ์ฝึกหัด'}
        </span>
    `;
}

function updateFooterStatus() {
    const el = document.getElementById('footerStatus');
    if (!player) return;
    const cs = player.combat_stats || {};
    const hpPct = cs.hp_max > 0 ? Math.round((cs.hp/cs.hp_max)*100) : 0;
    const status = hpPct < 20 ? '🔴 ใกล้ตาย' :
                   hpPct < 50 ? '🟡 บาดเจ็บ' :
                   '🟢 สมบูรณ์';
    el.textContent = `❤️ ${hpPct}% • ${status} • ${player.current_zone||'MAP-001'}`;
}

// ============================================================
// BATTLE LOG
// ============================================================
export function addLog(speaker, message, type = 'normal') {
    const log = document.getElementById('battleLog');
    if (!log) return;
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    const cls = type === 'system' ? 'system' :
               type === 'damage' ? 'damage' :
               type === 'heal' ? 'heal' : '';
    entry.innerHTML = `<span class="${cls}">${speaker}:</span> ${message}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

// ============================================================
// SAVE / LOAD
// ============================================================
function setupSaveButtons() {
    document.getElementById('btnSave').addEventListener('click', () => {
        if (SaveModule.saveGame(player)) {
            addLog('ระบบ', 'บันทึกเกมสำเร็จ!', 'system');
        } else {
            addLog('ระบบ', '❌ บันทึกเกมล้มเหลว', 'system');
        }
    });

    document.getElementById('btnLoad').addEventListener('click', () => {
        const saved = SaveModule.loadGame();
        if (saved) {
            player = saved;
            if (!player.skills) player.skills = { active: [], passive: [] };
            if (!player.followers) player.followers = [];
            if (!player.unlocked_zones) player.unlocked_zones = ['MAP-001'];
            if (!player.current_zone) player.current_zone = 'MAP-001';
            if (!player.action_points && player.action_points !== 0) player.action_points = 20;
            if (!player.last_ap_regen) player.last_ap_regen = Date.now();
            if (!player._boss_timestamps) player._boss_timestamps = {};
            if (!player.defeated_bosses) player.defeated_bosses = [];
            if (!player.defeated_mini_bosses) player.defeated_mini_bosses = [];
            if (EquipmentModule && EquipmentModule.recalculateEquipmentStats) {
                EquipmentModule.recalculateEquipmentStats(player);
            }
            updateUI();
            addLog('ระบบ', 'โหลดเกมสำเร็จ!', 'system');
        } else {
            addLog('ระบบ', '❌ ไม่พบข้อมูลเซฟ', 'system');
        }
    });

    document.getElementById('btnReset').addEventListener('click', () => {
        if (confirm('⚠️ เริ่มเกมใหม่จะล้างข้อมูลเซฟทั้งหมด ดำเนินการต่อ?')) {
            SaveModule.deleteSave();
            location.reload();
        }
    });
}

// ============================================================
// AP DISPLAY
// ============================================================
function renderAP() {
    const ap = ExplorationModule.getAP(player);
    document.getElementById('apValue').textContent = Math.floor(ap);
    document.getElementById('apMax').textContent = ExplorationModule.CONSTANTS.MAX_AP;
}

// ============================================================
// BATTLE UI
// ============================================================
function setupBattle() {
    document.getElementById('btnStartBattle').addEventListener('click', startBattle);
    document.getElementById('btnAttack').addEventListener('click', () => {
        if (isInBattle && battleState && battleResolve) {
            battleResolve({ type: 'attack' });
        }
    });
    document.getElementById('btnRetreat').addEventListener('click', () => {
        if (isInBattle && battleState && battleResolve) {
            battleResolve({ type: 'retreat' });
        }
    });
}

export function renderBattleUI() {
    if (!player) return;
    const cs = player.combat_stats || {};

    // Player stats
    document.getElementById('playerName').innerHTML =
        `ผู้เล่น ${player.name||''} <span class="tag">Lv.${player.level}</span>`;

    document.getElementById('playerHpFill').style.width =
        cs.hp_max > 0 ? `${(cs.hp/cs.hp_max)*100}%` : '0%';
    document.getElementById('playerHpLabel').textContent =
        `${Math.floor(cs.hp||0)}/${cs.hp_max||0}`;

    document.getElementById('playerMpFill').style.width =
        cs.mp_max > 0 ? `${(cs.mp/cs.mp_max)*100}%` : '0%';
    document.getElementById('playerMpLabel').textContent =
        `${Math.floor(cs.mp||0)}/${cs.mp_max||0}`;

    document.getElementById('playerAtk').textContent = Math.floor(cs.atk||0);
    document.getElementById('playerDef').textContent = Math.floor(cs.def||0);

    // Enemy stats (if battle is active)
    if (battleState && battleState.enemies && battleState.enemies.length > 0) {
        const enemy = battleState.enemies[0];
        document.getElementById('enemyName').innerHTML =
            `${enemy.name||'ศัตรู'} <span class="tag">Lv.${enemy.level||1}</span>`;

        document.getElementById('enemyHpFill').style.width =
            enemy.hp_max > 0 ? `${(enemy.hp/enemy.hp_max)*100}%` : '0%';
        document.getElementById('enemyHpLabel').textContent =
            `${Math.floor(enemy.hp||0)}/${enemy.hp_max||0}`;

        document.getElementById('enemyMpFill').style.width =
            enemy.mp_max > 0 ? `${(enemy.mp/enemy.mp_max)*100}%` : '0%';
        document.getElementById('enemyMpLabel').textContent =
            `${Math.floor(enemy.mp||0)}/${enemy.mp_max||0}`;

        document.getElementById('enemyAtk').textContent = Math.floor(enemy.atk||0);
        document.getElementById('enemyDef').textContent = Math.floor(enemy.def||0);

        document.getElementById('btnStartBattle').disabled = true;
        document.getElementById('btnAttack').disabled = !isInBattle;
        document.getElementById('btnRetreat').disabled = !isInBattle;
        document.getElementById('battleStatus').textContent =
            isInBattle ? `⚔️ ต่อสู้ (เทิร์น ${battleState.turn||0})` : '⚔️ ต่อสู้';

        renderBattleSkills();

    } else {
        document.getElementById('enemyName').innerHTML = 'ศัตรู <span class="tag">-</span>';
        document.getElementById('enemyHpFill').style.width = '0%';
        document.getElementById('enemyHpLabel').textContent = '0/0';
        document.getElementById('enemyMpFill').style.width = '0%';
        document.getElementById('enemyMpLabel').textContent = '0/0';
        document.getElementById('enemyAtk').textContent = '0';
        document.getElementById('enemyDef').textContent = '0';

        document.getElementById('btnStartBattle').disabled = false;
        document.getElementById('btnAttack').disabled = true;
        document.getElementById('btnRetreat').disabled = true;
        document.getElementById('battleStatus').textContent = 'พร้อมต่อสู้';
        document.getElementById('skillButtons').innerHTML = '';
        document.getElementById('battleResult').style.display = 'none';
    }

    document.getElementById('turnIndicator').textContent =
        isInBattle ? `⚔️ เทิร์น ${battleState?.turn||0}` : '⏳ รอเริ่ม';
}

function renderBattleSkills() {
    const container = document.getElementById('skillButtons');
    container.innerHTML = '';
    if (!player || !player.skills || !player.skills.active) return;

    for (const sid of player.skills.active) {
        const skill = SkillDatabase.find(s => s.id === sid);
        if (!skill) continue;
        const meta = BattleModule.parseSkillMeta(skill.effect);
        const btn = document.createElement('button');
        btn.className = 'skill-btn';
        btn.textContent = `${skill.name} (${meta.mpCost||0}MP)`;
        btn.title = skill.effect;
        const hasEnoughMP = (player.combat_stats?.mp||0) >= (meta.mpCost||0);
        btn.disabled = !isInBattle || !hasEnoughMP;
        btn.addEventListener('click', () => {
            if (isInBattle && battleState && battleResolve) {
                battleResolve({ type: 'skill', skill: skill });
            }
        });
        container.appendChild(btn);
    }
}

// ============================================================
// START BATTLE (Async/await)
// ============================================================
export async function startBattle(enemyData = null, enemyType = 'normal') {
    if (isInBattle) return;
    if (!player) return;

    let enemy = enemyData;
    let enemyTypeFinal = enemyType;

    // ถ้าไม่มี enemyData ที่ส่งมา ให้สุ่มจากโซนปัจจุบัน
    if (!enemy) {
        const zoneId = player.current_zone || 'MAP-001';
        const enemies = ExplorationModule.getEnemiesInZone(zoneId);
        if (enemies.length === 0) {
            addLog('ระบบ', '❌ ไม่พบศัตรูในโซนนี้', 'system');
            return;
        }
        const filtered = enemies.filter(e => {
            const lvl = parseInt(e.เลเวล) || 1;
            return lvl >= player.level - 3 && lvl <= player.level + 5;
        });
        const pool = filtered.length > 0 ? filtered : enemies;
        enemy = pool[Math.floor(Math.random() * pool.length)];
        enemyTypeFinal = enemy["ประเภท"] || "Normal";
    }

    if (!enemy) {
        addLog('ระบบ', '❌ ไม่พบศัตรูที่เหมาะสม', 'system');
        return;
    }

    const enemyId = enemy["Enemy ID"] || enemy.id || 'unknown';
    const enemyName = enemy["ชื่อ"] || enemy.name || 'ศัตรู';
    const enemyLevel = parseInt(enemy.เลเวล) || 1;

    addLog('ระบบ', `⚔️ เริ่มต่อสู้กับ ${enemyName} (Lv.${enemyLevel})!`, 'system');

    // สร้าง Combatants ด้วย BattleModule
    const playerCombatant = BattleModule.createCombatant('player', player);
    const followers = (player.followers || [])
        .filter(f => f.is_active !== false)
        .map(f => BattleModule.createCombatant('follower', f));

    let enemyCombatant;
    if (enemyTypeFinal === 'area_boss' || enemyTypeFinal === 'mini_boss') {
        enemyCombatant = BattleModule.createCombatant(
            enemyTypeFinal === 'area_boss' ? 'boss' : 'mini_boss',
            enemy,
            {
                combatStyle: enemy.combatStyle || enemy.style || 'Melee',
                immuneToKillChance: true,
                specialPhase: enemy.specialPhase || null,
                goldReward: enemy.goldReward || null,
                uniqueDrops: enemy.uniqueDrops || [],
            }
        );
    } else {
        enemyCombatant = BattleModule.createCombatant('enemy', enemy, {
            combatStyle: enemy.combatStyle || 'Melee',
            dropTableId: enemy["Drop Table"] || null,
        });
    }

    const playerSide = [playerCombatant, ...followers];
    const enemySide = [enemyCombatant];
    const allCombatants = [...playerSide, ...enemySide];
    allCombatants.sort((a, b) => {
        if (a.agi === b.agi) return a.isPlayer ? -1 : 1;
        return b.agi - a.agi;
    });

    battleState = {
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
        enemySource: enemy,
        enemyType: enemyTypeFinal,
    };

    isInBattle = true;
    battleResolve = null;
    renderBattleUI();

    // Main battle loop
    let maxTurns = 100;
    while (battleState.state === 'ongoing' && maxTurns > 0) {
        battleState.turn += 1;
        addLog('⚔️', `--- เทิร์นที่ ${battleState.turn} ---`, 'system');

        // Reduce cooldowns
        for (const c of battleState.allCombatants) {
            for (const key in c.cooldowns) {
                if (c.cooldowns[key] > 0) c.cooldowns[key] -= 1;
            }
        }

        const aliveOrder = battleState.turnOrder
            .map(id => battleState.allCombatants.find(c => c.id === id))
            .filter(c => c && c.isAlive);

        if (aliveOrder.length === 0) {
            battleState.state = 'defeat';
            break;
        }

        for (const combatant of aliveOrder) {
            if (battleState.state !== 'ongoing') break;
            if (!combatant.isAlive) continue;

            const isPlayerSide = combatant.isPlayer;
            let defenders;
            if (isPlayerSide) {
                defenders = battleState.enemies.filter(e => e.isAlive);
            } else {
                defenders = [battleState.player, ...battleState.followers].filter(e => e.isAlive);
            }

            if (defenders.length === 0) {
                battleState.state = isPlayerSide ? 'victory' : 'defeat';
                break;
            }

            const target = defenders[0];

            // Player turn
            if (combatant.isPlayer && combatant.type === 'player') {
                document.getElementById('btnAttack').disabled = false;
                document.getElementById('btnRetreat').disabled = false;
                renderBattleSkills();

                const action = await new Promise(resolve => {
                    battleResolve = resolve;
                });

                battleResolve = null;
                document.getElementById('btnAttack').disabled = true;
                document.getElementById('btnRetreat').disabled = true;

                if (action.type === 'retreat') {
                    battleState.state = 'defeat';
                    addLog('ระบบ', '🏃 หนีสำเร็จ!', 'system');
                    break;
                } else if (action.type === 'attack') {
                    BattleModule.executeAutoAttack(battleState, combatant, target, '');
                } else if (action.type === 'skill') {
                    const skill = action.skill;
                    if (skill) {
                        const success = BattleModule.executeSkill(battleState, combatant, target, skill, '');
                        if (!success) {
                            BattleModule.executeAutoAttack(battleState, combatant, target, '');
                        }
                    } else {
                        BattleModule.executeAutoAttack(battleState, combatant, target, '');
                    }
                }

                renderBattleUI();
                updateUI();

                while (battleState.logs.length > 0) {
                    const logEntry = battleState.logs.shift();
                    addLog('⚔️', logEntry, 'normal');
                }
                continue;
            }

            // Follower AI
            if (combatant.isPlayer && combatant.type === 'follower') {
                const availableSkills = (combatant.skills.active || []).filter(skill => {
                    if (!skill) return false;
                    const cdKey = skill.id;
                    const cooldown = combatant.cooldowns[cdKey] || 0;
                    if (cooldown > 0) return false;
                    const meta = BattleModule.parseSkillMeta(skill.effect);
                    if (combatant.mp < meta.mpCost) return false;
                    return true;
                });

                if (availableSkills.length > 0 && Math.random() < 0.2) {
                    const skill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
                    BattleModule.executeSkill(battleState, combatant, target, skill, '[Follower] ');
                } else {
                    BattleModule.executeAutoAttack(battleState, combatant, target, '[Follower] ');
                }
                continue;
            }

            // Enemy AI
            if (!combatant.isPlayer) {
                const action = enemyAI(battleState, combatant, defenders);
                if (action) {
                    if (action.type === 'attack') {
                        BattleModule.executeAutoAttack(battleState, combatant, action.target, '[ศัตรู] ');
                    } else if (action.type === 'skill') {
                        BattleModule.executeSkill(battleState, combatant, action.target, action.skill, '[ศัตรู] ');
                    }
                }
                continue;
            }
        }

        // Boss Phase 2
        for (const enemy of battleState.enemies) {
            if (enemy.isBoss && enemy.specialPhase && !enemy.phaseTriggered) {
                if (enemy.hp / enemy.hp_max < 0.5) {
                    enemy.phaseTriggered = true;
                    addLog('⚠️', `${enemy.name} เข้าสู่ Phase 2! เพิ่มพลังโจมตีและป้องกัน!`, 'system');
                    enemy.atk = Math.floor(enemy.atk * 1.5);
                    enemy.def = Math.floor(enemy.def * 1.3);
                }
            }
        }

        const playerAlive = battleState.player.isAlive;
        const enemiesAlive = battleState.enemies.some(e => e.isAlive);

        if (!playerAlive) {
            battleState.state = 'defeat';
            battleState.player.hp = 1;
            addLog('💀', `${battleState.player.name} ถูกสังหาร! แพ้!`, 'system');
        } else if (!enemiesAlive) {
            battleState.state = 'victory';
            addLog('🎉', 'ชนะ! ศัตรูทั้งหมดถูกกำจัด!', 'system');
        }

        renderBattleUI();
        updateUI();

        if (battleState.state !== 'ongoing') break;
        maxTurns--;
    }

    isInBattle = false;
    document.getElementById('btnAttack').disabled = true;
    document.getElementById('btnRetreat').disabled = true;
    document.getElementById('skillButtons').innerHTML = '';

    // Process rewards
    if (battleState.state === 'victory') {
        const exp = BattleModule.calculateExpReward(enemy, enemyTypeFinal);
        const gold = BattleModule.calculateGoldReward(enemy, enemyTypeFinal, player);
        const drops = processDropsWithItemGen(enemy, enemyTypeFinal, player, enemyLevel);

        battleState.rewards.exp = exp;
        battleState.rewards.gold = gold;
        battleState.rewards.drops = drops;

        // Add EXP
        try {
            PlayerModule.addExp(player, exp);
        } catch (e) {
            addLog('ระบบ', `⚠️ Error adding EXP: ${e.message}`, 'system');
        }

        // Add Gold
        try {
            PlayerModule.updateGold(player, gold);
        } catch (e) {
            addLog('ระบบ', `⚠️ Error adding Gold: ${e.message}`, 'system');
        }

        // Follower EXP Sharing (60% of player exp)
        const expShare = Math.floor(exp * 0.6);
        for (const follower of player.followers) {
            if (follower.is_active !== false) {
                try {
                    FollowerModule.addFollowerExp(follower, expShare);
                } catch (e) {
                    // Silently fail
                }
            }
        }

        // Add Drops
        for (const drop of drops) {
            try {
                const entry = {
                    instanceId: 'inv_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
                    itemId: drop.id || drop.name || 'unknown',
                    itemData: drop,
                    quantity: 1,
                };
                player.inventory.push(entry);
            } catch (e) {
                addLog('ระบบ', `⚠️ Error adding drop: ${e.message}`, 'system');
            }
        }

        // Record boss defeat
        if (enemyTypeFinal === 'area_boss' || enemyTypeFinal === 'mini_boss') {
            const bossId = enemy.id || enemy.bossId || enemyId;
            ExplorationModule.recordBossDefeat(player, bossId, enemyTypeFinal);
        }

        const resultEl = document.getElementById('battleResult');
        resultEl.style.display = 'block';
        resultEl.className = 'battle-result victory';
        resultEl.innerHTML = `🎉 ชนะ! ได้รับ EXP ${exp} | Gold ${gold} | ไอเทม ${drops.length} ชิ้น`;
        document.getElementById('battleStatus').textContent = '🏆 ชนะ!';

        // Heal a bit
        const regen = 0.2;
        player.combat_stats.hp = Math.min(player.combat_stats.hp_max, player.combat_stats.hp + Math.floor(player.combat_stats.hp_max * regen));
        player.combat_stats.mp = Math.min(player.combat_stats.mp_max, player.combat_stats.mp + Math.floor(player.combat_stats.mp_max * regen));

    } else if (battleState.state === 'defeat') {
        player.combat_stats.hp = 1;
        ExplorationModule.teleportHome(player);
        const resultEl = document.getElementById('battleResult');
        resultEl.style.display = 'block';
        resultEl.className = 'battle-result defeat';
        resultEl.textContent = '💀 แพ้! ฟื้นฟู HP เหลือ 1 และกลับบ้าน';
        document.getElementById('battleStatus').textContent = '💀 แพ้';
        addLog('ระบบ', `🏠 เทเลพอร์ตกลับ ${player.current_zone}`, 'system');
    }

    SaveModule.saveGame(player);
    updateUI();
    renderBattleUI();
    renderAP();

    battleState = null;
    battleResolve = null;
    document.getElementById('btnStartBattle').disabled = false;
}

// ============================================================
// PROCESS DROPS WITH ITEM GENERATOR
// ============================================================
function processDropsWithItemGen(enemy, enemyType, player, enemyLevel) {
    const drops = [];

    // Unique drops for Bosses
    if (enemy.uniqueDrops && enemy.uniqueDrops.length > 0) {
        const dropCount = Math.min(enemy.uniqueDrops.length, Math.floor(Math.random() * 2) + 1);
        const shuffled = [...enemy.uniqueDrops].sort(() => Math.random() - 0.5);
        for (let i = 0; i < dropCount; i++) {
            if (shuffled[i]) {
                const ilvl = Math.min(enemyLevel + randomInRange(-2, 3), 90);
                const rarityWeights = enemyType === 'area_boss' ? { white: 0, green: 0, blue: 5, purple: 30, gold: 50, red: 15 } :
                                       enemyType === 'mini_boss' ? { white: 0, green: 10, blue: 40, purple: 35, gold: 14, red: 1 } :
                                       { white: 10, green: 30, blue: 35, purple: 20, gold: 5, red: 0 };
                const item = ItemGeneratorModule.generateItemFromDrop(
                    'random',
                    ilvl,
                    rarityWeights,
                    player.stats?.luck || 0
                );
                if (item) {
                    item.name = shuffled[i];
                    drops.push(item);
                }
            }
        }
        return drops;
    }

    // Normal drops from DropTable
    const dropTableId = enemy["Drop Table"];
    if (!dropTableId) return drops;

    const dropTable = DropTable.find(dt => dt.id === dropTableId);
    if (!dropTable) return drops;

    // Equipment Drop
    const luck = player.stats?.luck || 0;
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

        const ilvl = Math.min(enemyLevel + randomInRange(-2, 3), 90);
        const types = ['weapon', 'armor', 'accessory'];
        const type = types[Math.floor(Math.random() * types.length)];

        const item = ItemGeneratorModule.generateItem(selectedRarity, ilvl, type, luck);
        if (item) drops.push(item);
    }

    // Materials
    if (dropTable.materialDrops) {
        for (const mat of dropTable.materialDrops) {
            if (Math.random() * 100 <= mat.chance) {
                const matItem = ItemGeneratorModule.generateItem('white', enemyLevel, 'accessory', luck);
                if (matItem) {
                    matItem.name = mat.name;
                    matItem.type = 'material';
                    drops.push(matItem);
                }
            }
        }
    }

    // Consumables
    if (dropTable.consumables) {
        for (const con of dropTable.consumables) {
            if (Math.random() * 100 <= con.chance) {
                const conItem = ItemGeneratorModule.generateItem('white', enemyLevel, 'accessory', luck);
                if (conItem) {
                    conItem.name = con.name;
                    conItem.type = 'consumable';
                    drops.push(conItem);
                }
            }
        }
    }

    return drops;
}

function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============================================================
// ENEMY AI
// ============================================================
function enemyAI(state, enemy, playerSide) {
    const aliveTargets = playerSide.filter(p => p.isAlive);
    if (aliveTargets.length === 0) return null;
    const target = aliveTargets.find(p => p.isPlayer) || aliveTargets[0];

    const availableSkills = (enemy.skills.active || []).filter(skill => {
        if (!skill) return false;
        const cdKey = skill.id;
        const cooldown = enemy.cooldowns[cdKey] || 0;
        if (cooldown > 0) return false;
        const meta = BattleModule.parseSkillMeta(skill.effect);
        if (enemy.mp < meta.mpCost) return false;
        return true;
    });

    if (availableSkills.length > 0 && Math.random() < 0.3) {
        const skill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
        return { type: 'skill', target, skill };
    }
    return { type: 'attack', target };
}

// ============================================================
// MAP ACTIONS
// ============================================================
function setupMap() {
    document.querySelectorAll('#mapActions button').forEach(btn => {
        btn.addEventListener('click', async () => {
            const action = btn.dataset.action;
            if (action === 'explore' || action === 'train' || action === 'search') {
                const result = ExplorationModule.performAction(player, action);
                if (result.type === 'error') {
                    addLog('แผนที่', `❌ ${result.message}`, 'system');
                    renderAP();
                    return;
                }

                addLog('แผนที่', `ดำเนินการ: ${action} ใช้ AP 1`, 'system');

                if (result.type === 'battle') {
                    const enemy = result.data.enemy;
                    const enemyType = result.data.enemyType || 'Normal';
                    addLog('แผนที่', `⚔️ พบศัตรู ${enemy["ชื่อ"]||'ศัตรู'}!`, 'system');
                    await startBattle(enemy, enemyType);
                } else if (result.type === 'event') {
                    const event = result.data.event;
                    addLog('แผนที่', `🎋 พบ Event: ${event.eventName||'เหตุการณ์'}`, 'system');
                    showPanel('events');
                    renderEventFromData(event);
                } else if (result.type === 'treasure') {
                    const data = result.data;
                    addLog('แผนที่', `🎁 พบสมบัติ! ได้รับ Gold ${data.gold||0}, EXP ${data.exp||0}`, 'system');
                    if (data.gold) {
                        try { PlayerModule.updateGold(player, data.gold); } catch(e) {}
                    }
                    if (data.exp) {
                        try { PlayerModule.addExp(player, data.exp); } catch(e) {}
                    }
                    if (data.itemName) {
                        const ilvl = Math.min(player.level + randomInRange(-2, 3), 90);
                        const item = ItemGeneratorModule.generateItem('white', ilvl, 'accessory', player.stats?.luck||0);
                        if (item) {
                            item.name = data.itemName;
                            player.inventory.push({
                                instanceId: 'inv_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
                                itemId: item.id || item.name,
                                itemData: item,
                                quantity: 1,
                            });
                            addLog('แผนที่', `🎁 ได้รับไอเทม: ${item.name}`, 'system');
                        }
                    }
                    SaveModule.saveGame(player);
                    updateUI();
                    renderAP();
                } else if (result.type === 'train') {
                    const data = result.data;
                    addLog('แผนที่', `🧘 ฝึกฝนสำเร็จ EXP +${data.exp||0} ฟื้น HP/MP`, 'system');
                    SaveModule.saveGame(player);
                    updateUI();
                    renderAP();
                } else if (result.type === 'nothing') {
                    addLog('แผนที่', `🍃 ${result.data.message||'ไม่พบอะไร'}`, 'system');
                    renderAP();
                }
            } else if (action === 'boss') {
                const result = ExplorationModule.startBossFight(player, 'area');
                if (result.type === 'error') {
                    addLog('แผนที่', `❌ ${result.message}`, 'system');
                    return;
                }
                if (result.type === 'boss_battle') {
                    const boss = result.data.boss;
                    const bossType = result.data.bossType;
                    addLog('แผนที่', `👹 พบ ${boss.name||'Boss'}!`, 'system');
                    await startBattle(boss, bossType);
                }
            }
        });
    });
}

function renderMap() {
    if (!player) return;
    const zoneId = player.current_zone || 'MAP-001';
    document.getElementById('mapLevel').textContent = `ระดับ ${Math.floor((player.level+9)/10)}`;
    const zone = ExplorationModule.getZoneData(zoneId);
    if (zone) {
        document.getElementById('mapName').textContent = zone["ชื่อแมพ"] || zoneId;
        document.getElementById('mapDesc').textContent = zone["คำอธิบาย"] || 'พื้นที่สำรวจ';
    } else {
        document.getElementById('mapName').textContent = zoneId;
        document.getElementById('mapDesc').textContent = 'พื้นที่สำรวจ';
    }

    const enemies = ExplorationModule.getEnemiesInZone(zoneId);
    const enemyEl = document.getElementById('mapEnemies');
    if (enemies.length > 0) {
        enemyEl.innerHTML = `👹 ศัตรูในพื้นที่: ${enemies.map(e => e["ชื่อ"]).join(', ')}`;
    } else {
        enemyEl.innerHTML = '👹 ไม่พบศัตรูในพื้นที่นี้';
    }

    const bossBtn = document.querySelector('#mapActions button[data-action="boss"]');
    if (bossBtn) {
        const boss = ExplorationModule.getBossInZone(zoneId);
        bossBtn.disabled = !boss;
        bossBtn.textContent = boss ? `👹 ${boss.name}` : '👹 บอส (ไม่มี)';
    }
}

// ============================================================
// EVENT PANEL
// ============================================================
function renderEventFromData(event) {
    const textEl = document.getElementById('eventText');
    const choicesEl = document.getElementById('eventChoices');
    const resultEl = document.getElementById('eventResult');
    resultEl.style.display = 'none';

    if (!event) {
        textEl.textContent = 'ไม่มีเหตุการณ์ในขณะนี้';
        choicesEl.innerHTML = '';
        return;
    }

    textEl.textContent = event.description || event.text || 'เกิดเหตุการณ์บางอย่าง';

    if (event.choices && event.choices.length > 0) {
        choicesEl.innerHTML = event.choices.map((c, i) =>
            `<button data-choice="${i}">${c.label}</button>`
        ).join('');
        choicesEl.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.choice);
                const choice = event.choices[idx];
                if (choice && choice.result) {
                    resultEl.style.display = 'block';
                    resultEl.textContent = choice.result.text || '...';
                    choicesEl.innerHTML = '';
                    if (choice.result.gold) {
                        try { PlayerModule.updateGold(player, choice.result.gold); } catch(e) {}
                    }
                    if (choice.result.exp) {
                        try { PlayerModule.addExp(player, choice.result.exp); } catch(e) {}
                    }
                    if (choice.result.item_reward) {
                        const ilvl = Math.min(player.level + randomInRange(-2, 3), 90);
                        const item = ItemGeneratorModule.generateItem('white', ilvl, 'accessory', player.stats?.luck||0);
                        if (item) {
                            item.name = choice.result.item_reward;
                            player.inventory.push({
                                instanceId: 'inv_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
                                itemId: item.id || item.name,
                                itemData: item,
                                quantity: 1,
                            });
                        }
                    }
                    if (choice.result.trigger_battle) {
                        startBattle(choice.result.trigger_battle, 'normal');
                    }
                    SaveModule.saveGame(player);
                    updateUI();
                    addLog('เหตุการณ์', choice.result.text || 'เลือกสำเร็จ', 'system');
                }
            });
        });
    } else if (event.auto_result) {
        const result = event.auto_result;
        resultEl.style.display = 'block';
        resultEl.textContent = result.text || '...';
        if (result.gold) {
            try { PlayerModule.updateGold(player, result.gold); } catch(e) {}
        }
        if (result.exp) {
            try { PlayerModule.addExp(player, result.exp); } catch(e) {}
        }
        if (result.item_reward) {
            const ilvl = Math.min(player.level + randomInRange(-2, 3), 90);
            const item = ItemGeneratorModule.generateItem('white', ilvl, 'accessory', player.stats?.luck||0);
            if (item) {
                item.name = result.item_reward;
                player.inventory.push({
                    instanceId: 'inv_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
                    itemId: item.id || item.name,
                    itemData: item,
                    quantity: 1,
                });
            }
        }
        if (result.trigger_battle) {
            startBattle(result.trigger_battle, 'normal');
        }
        SaveModule.saveGame(player);
        updateUI();
        addLog('เหตุการณ์', result.text || 'เหตุการณ์จบ', 'system');
    } else {
        choicesEl.innerHTML = '';
    }
}

function renderEvents() {
    const textEl = document.getElementById('eventText');
    textEl.textContent = 'ไม่มีเหตุการณ์ในขณะนี้';
    document.getElementById('eventChoices').innerHTML = '';
    document.getElementById('eventResult').style.display = 'none';
}

// ============================================================
// STATS PANEL
// ============================================================
function setupStats() {
    document.querySelectorAll('.stats-toggle button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.stats-toggle button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const view = btn.dataset.view;
            document.getElementById('statsSimple').style.display = view === 'simple' ? 'grid' : 'none';
            document.getElementById('statsDetailed').style.display = view === 'detailed' ? 'grid' : 'none';
        });
    });

    document.querySelectorAll('.stat-alloc').forEach(btn => {
        btn.addEventListener('click', () => {
            const stat = btn.dataset.stat;
            if (player && player.stats.stat_points_available > 0) {
                try {
                    PlayerModule.allocateStat(player, stat, 1);
                    if (EquipmentModule && EquipmentModule.recalculateEquipmentStats) {
                        EquipmentModule.recalculateEquipmentStats(player);
                    }
                    SaveModule.saveGame(player);
                    renderStats();
                    updateUI();
                    addLog('ระบบ', `เพิ่ม ${stat.toUpperCase()} +1`, 'system');
                } catch (e) {
                    addLog('ระบบ', `❌ ${e.message}`, 'system');
                }
            } else {
                addLog('ระบบ', '❌ ไม่มีคะแนนสถานะคงเหลือ', 'system');
            }
        });
    });
}

function renderStats() {
    if (!player) return;
    const cs = player.combat_stats || {};
    const st = player.stats || {};
    document.getElementById('statsRank').textContent = player.rank || 'จอมยุทธ์ฝึกหัด';

    const simpleEl = document.getElementById('statsSimple');
    simpleEl.innerHTML = `
        <div class="stat-row"><span class="label">ระดับ</span><span class="value">${player.level}</span></div>
        <div class="stat-row"><span class="label">EXP</span><span class="value">${player.exp||0}/${player.exp_required||100}</span></div>
        <div class="stat-row"><span class="label">❤️ HP</span><span class="value hp-text">${Math.floor(cs.hp||0)}/${cs.hp_max||0}</span></div>
        <div class="stat-row"><span class="label">💎 MP</span><span class="value mp-text">${Math.floor(cs.mp||0)}/${cs.mp_max||0}</span></div>
        <div class="stat-row"><span class="label">⚔️ ATK</span><span class="value">${Math.floor(cs.atk||0)}</span></div>
        <div class="stat-row"><span class="label">🛡️ DEF</span><span class="value">${Math.floor(cs.def||0)}</span></div>
        <div class="stat-row"><span class="label">💨 AGI</span><span class="value">${st.agi||0}</span></div>
        <div class="stat-row"><span class="label">💪 STR</span><span class="value">${st.str||0}</span></div>
        <div class="stat-row"><span class="label">🛡️ CON</span><span class="value">${st.con||0}</span></div>
        <div class="stat-row"><span class="label">🧠 INT</span><span class="value">${st.int||0}</span></div>
        <div class="stat-row"><span class="label">🍀 LUCK</span><span class="value">${st.luck||0}</span></div>
        <div class="stat-row"><span class="label">💰 Gold</span><span class="value highlight">${player.gold||0}</span></div>
        <div class="stat-row"><span class="label">🎯 CRIT</span><span class="value">${(cs.crit||0).toFixed(1)}%</span></div>
        <div class="stat-row"><span class="label">💥 CRIT DMG</span><span class="value">${(cs.crit_damage||0).toFixed(0)}%</span></div>
        <div class="stat-row"><span class="label">🌀 DODGE</span><span class="value">${(cs.dodge||0).toFixed(1)}%</span></div>
        <div class="stat-row"><span class="label">🎯 ACC</span><span class="value">${(cs.accuracy||0).toFixed(1)}%</span></div>
    `;

    const detailedEl = document.getElementById('statsDetailed');
    const caps = PlayerModule.STAT_CAPS || {};
    const allStats = {
        'ระดับ': player.level,
        'EXP': `${player.exp||0}/${player.exp_required||100}`,
        'HP': `${Math.floor(cs.hp||0)}/${cs.hp_max||0}`,
        'MP': `${Math.floor(cs.mp||0)}/${cs.mp_max||0}`,
        'ATK': Math.floor(cs.atk||0),
        'DEF': Math.floor(cs.def||0),
        'STR': st.str||0,
        'CON': st.con||0,
        'AGI': st.agi||0,
        'INT': st.int||0,
        'LUCK': st.luck||0,
        'CRIT': `${(cs.crit||0).toFixed(1)}% (max ${caps.crit||75}%)`,
        'CRIT_DAMAGE': `${(cs.crit_damage||0).toFixed(0)}% (max ${caps.crit_damage||400}%)`,
        'DODGE': `${(cs.dodge||0).toFixed(1)}% (max ${caps.dodge||70}%)`,
        'ACCURACY': `${(cs.accuracy||0).toFixed(1)}% (max ${caps.accuracy||110}%)`,
        'ARMOR_PEN': `${(cs.armor_pen||0).toFixed(1)}% (max ${caps.armor_pen||75}%)`,
        'LIFE_STEAL': `${(cs.life_steal||0).toFixed(1)}% (max ${caps.life_steal||40}%)`,
        'MANA_STEAL': `${(cs.mana_steal||0).toFixed(1)}% (max ${caps.mana_steal||20}%)`,
        'KILL_CHANCE': `${(cs.kill_chance||0).toFixed(1)}% (max ${caps.kill_chance||8}%)`,
        'Gold': player.gold||0,
        'Rank': player.rank||'จอมยุทธ์ฝึกหัด',
        'Zone': player.current_zone||'MAP-001',
        'Stat Points': player.stats.stat_points_available||0,
    };
    detailedEl.innerHTML = Object.entries(allStats).map(([k, v]) =>
        `<div class="stat-row"><span class="label">${k}</span><span class="value">${v}</span></div>`
    ).join('');

    document.getElementById('statPointsDisplay').textContent =
        `คะแนนคงเหลือ: ${player.stats.stat_points_available||0}`;
}

// ============================================================
// INVENTORY PANEL
// ============================================================
function renderInventory() {
    const container = document.getElementById('inventoryGrid');
    if (!player || !player.inventory || player.inventory.length === 0) {
        container.innerHTML = '<div class="text-muted">คลังว่าง</div>';
        document.getElementById('invCount').textContent = '0 ชิ้น';
        return;
    }

    const items = player.inventory;
    document.getElementById('invCount').textContent = `${items.length} ชิ้น`;

    container.innerHTML = items.map((entry, idx) => {
        const itemData = entry.itemData;
        if (!itemData) {
            return `<div class="item-card">
                <div class="item-name">${entry.itemId || 'unknown'}</div>
                <div class="item-detail">จำนวน: ${entry.quantity||1}</div>
                <div class="item-rarity white">ทั่วไป</div>
            </div>`;
        }

        const rarityMap = { white: 'ขาว', green: 'เขียว', blue: 'ฟ้า', purple: 'ม่วง', gold: 'ทอง', red: 'แดง' };
        const rarityColor = itemData.rarity || 'white';
        const rarityDisplay = rarityMap[rarityColor] || rarityColor;

        let details = `iLv.${itemData.item_level||'?'} | ${rarityDisplay}`;
        if (itemData.required_level) {
            details += ` | ต้อง Lv.${itemData.required_level}`;
        }
        if (itemData.special_effect) {
            details += ` | ✨ ${itemData.special_effect.name||'พิเศษ'}`;
        }
        const statStr = (itemData.stats || []).slice(0, 3).map(s => `${s.stat_id}:${s.value}`).join(' ');
        const moreStat = (itemData.stats || []).length > 3 ? ` +${(itemData.stats||[]).length-3} stat` : '';

        return `<div class="item-card" data-index="${idx}">
            <div class="item-name">${itemData.name || 'อุปกรณ์'}</div>
            <div class="item-detail">${details}</div>
            <div class="item-detail">${statStr}${moreStat}</div>
            <div class="item-rarity ${rarityColor}">${rarityDisplay}</div>
            <div class="item-detail" style="margin-top:4px;font-size:0.6rem;color:var(--text-spiritual);">💰 ${itemData.sell_price||0}</div>
        </div>`;
    }).join('');

    container.querySelectorAll('.item-card').forEach(el => {
        el.addEventListener('click', () => {
            const idx = parseInt(el.dataset.index);
            const entry = player.inventory[idx];
            if (!entry || !entry.itemData) return;
            const itemData = entry.itemData;
            if (itemData.type === 'weapon' || itemData.type === 'armor' || itemData.type === 'accessory') {
                try {
                    if (itemData.required_level && player.level < itemData.required_level) {
                        addLog('ระบบ', `❌ ต้องมี Level ${itemData.required_level} ถึงจะสวมใส่ได้`, 'system');
                        return;
                    }
                    const result = EquipmentModule.equipItem(player, entry.instanceId, itemData);
                    if (result.success) {
                        if (EquipmentModule && EquipmentModule.recalculateEquipmentStats) {
                            EquipmentModule.recalculateEquipmentStats(player);
                        }
                        SaveModule.saveGame(player);
                        updateUI();
                        addLog('ระบบ', `✅ สวมใส่ ${itemData.name}`, 'system');
                    }
                } catch (e) {
                    addLog('ระบบ', `❌ ${e.message}`, 'system');
                }
            } else {
                // If it's a consumable or material, show info
                addLog('ระบบ', `ℹ️ ${itemData.name} ไม่สามารถสวมใส่ได้`, 'system');
            }
        });
    });
}

// ============================================================
// EQUIPMENT PANEL
// ============================================================
function renderEquipment() {
    const container = document.getElementById('equippedSlots');
    if (!player || !player.equipment) {
        container.innerHTML = '<div class="text-muted">ไม่มีอุปกรณ์</div>';
        document.getElementById('eqPower').textContent = 'พลัง: 0';
        return;
    }
    const eq = player.equipment;
    const slots = ['weapon', 'armor', 'accessory'];
    const slotNames = {
        weapon: '⚔️ อาวุธ',
        armor: '🛡️ เกราะ',
        accessory: '💍 เครื่องประดับ'
    };
    container.innerHTML = slots.map(slot => {
        const item = eq[slot];
        const hasItem = item && item.itemData;
        let itemDisplay = hasItem ? `${item.itemData.name||item.itemId||'อุปกรณ์'}` : 'ว่าง';
        if (hasItem && item.itemData.item_level) {
            itemDisplay += ` (iLv.${item.itemData.item_level})`;
        }
        return `
            <div class="equipped-slot" data-slot="${slot}">
                <span class="slot-label">${slotNames[slot]}</span>
                <span class="slot-item ${hasItem ? '' : 'slot-empty'}">
                    ${itemDisplay}
                </span>
                ${hasItem ? `<button class="slot-action" data-slot="${slot}">ถอด</button>` : ''}
            </div>
        `;
    }).join('');

    let power = 0;
    try {
        power = EquipmentModule.calculateTotalPowerScore(player) || 0;
    } catch (e) {}
    document.getElementById('eqPower').textContent = `พลัง: ${Math.floor(power)}`;

    document.querySelectorAll('.slot-action').forEach(btn => {
        btn.addEventListener('click', () => {
            const slot = btn.dataset.slot;
            try {
                EquipmentModule.unequipItem(player, slot);
                if (EquipmentModule && EquipmentModule.recalculateEquipmentStats) {
                    EquipmentModule.recalculateEquipmentStats(player);
                }
                SaveModule.saveGame(player);
                renderEquipment();
                updateUI();
                addLog('ระบบ', `ถอด ${slot} ออกจากอุปกรณ์`, 'system');
            } catch (e) {
                addLog('ระบบ', `❌ ${e.message}`, 'system');
            }
        });
    });
}

// ============================================================
// SKILLS PANEL
// ============================================================
function setupSkills() {
    document.querySelectorAll('.skill-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.skill-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderSkills();
        });
    });
}

function renderSkills() {
    const container = document.getElementById('skillsGrid');
    if (!player || !player.skills) {
        container.innerHTML = '<div class="text-muted">ไม่มีสกิล</div>';
        document.getElementById('skillCount').textContent = '0 สกิล';
        return;
    }
    const activeTab = document.querySelector('.skill-tab.active');
    const type = activeTab ? activeTab.dataset.type : 'active';
    const skillIds = type === 'active' ? player.skills.active : player.skills.passive;
    const maxSlots = type === 'active' ? player.skills.active_slots : player.skills.passive_slots;
    document.getElementById('skillCount').textContent =
        `${skillIds.length}/${maxSlots} ${type === 'active' ? 'Active' : 'Passive'}`;
    if (!skillIds || skillIds.length === 0) {
        container.innerHTML = '<div class="text-muted">ไม่มีสกิล</div>';
        return;
    }
    container.innerHTML = skillIds.map(sid => {
        const skill = SkillDatabase.find(s => s.id === sid);
        if (!skill) return '';
        const meta = BattleModule.parseSkillMeta(skill.effect || '');
        return `
            <div class="item-card">
                <div class="item-name">${skill.name}</div>
                <div class="item-detail">${skill.level||'ทั่วไป'}</div>
                <div class="item-detail">${skill.type||'Active'}</div>
                ${skill.effect ? `<div class="item-detail">${skill.effect.substring(0, 60)}${skill.effect.length>60?'...':''}</div>` : ''}
                ${meta.mpCost ? `<div class="item-detail">MP: ${meta.mpCost} | CD: ${meta.cooldown}</div>` : ''}
                <div class="item-rarity ${skill.level?.toLowerCase()||'white'}">${skill.level||'ทั่วไป'}</div>
            </div>
        `;
    }).join('');
}

// ============================================================
// FOLLOWERS PANEL
// ============================================================
function setupFollowers() {
    document.getElementById('btnRecruitFollower').addEventListener('click', () => {
        recruitFollower('city_cheap', 500);
    });
    document.getElementById('btnRecruitElite').addEventListener('click', () => {
        recruitFollower('city_expensive', 2000);
    });
}

function recruitFollower(source, cost) {
    const result = FollowerModule.recruitFollower(player, source, cost);
    const resultEl = document.getElementById('recruitResult');
    if (result.success) {
        resultEl.textContent = `✅ ${result.message}`;
        resultEl.style.color = 'var(--text-jade)';
        SaveModule.saveGame(player);
        renderFollowers();
        updateUI();
        addLog('ผู้ติดตาม', result.message, 'system');
    } else {
        resultEl.textContent = `❌ ${result.message}`;
        resultEl.style.color = 'var(--text-crimson)';
    }
    setTimeout(() => { resultEl.textContent = ''; }, 5000);
}

function renderFollowers() {
    const container = document.getElementById('followersList');
    if (!player || !player.followers || player.followers.length === 0) {
        container.innerHTML = '<div class="text-muted">ยังไม่มีผู้ติดตาม</div>';
        document.getElementById('followerCount').textContent = '0 คน';
        return;
    }
    document.getElementById('followerCount').textContent = `${player.followers.length} คน`;
    container.innerHTML = player.followers.map(f => `
        <div class="follower-card">
            <div class="follower-avatar">🧘</div>
            <div class="follower-info">
                <div class="name">${f.name||'ผู้ติดตาม'}</div>
                <div class="detail">Lv.${f.level||1} • ${f.rarity||'ทั่วไป'} • ${f.archetype||''}</div>
                <div class="detail" style="font-size:0.6rem;">💰 ค่าจ้าง: ${f.daily_upkeep||0}/วัน</div>
            </div>
            <span class="follower-status ${f.is_active !== false ? 'active' : 'inactive'}">
                ${f.is_active !== false ? '✅ ใช้งาน' : '⏸️ พัก'}
            </span>
            <button class="follower-toggle btn-secondary" data-id="${f.id}" style="font-size:0.6rem;padding:2px 8px;">
                ${f.is_active !== false ? 'พัก' : 'เปิดใช้งาน'}
            </button>
            <button class="follower-dismiss btn-secondary" data-id="${f.id}" style="font-size:0.6rem;padding:2px 8px;border-color:var(--border-crimson);">
                ✕
            </button>
        </div>
    `).join('');

    container.querySelectorAll('.follower-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const result = FollowerModule.toggleFollowerActive(player, btn.dataset.id);
            if (result.success) {
                SaveModule.saveGame(player);
                renderFollowers();
                addLog('ผู้ติดตาม', result.message, 'system');
            }
        });
    });

    container.querySelectorAll('.follower-dismiss').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('ต้องการปลดผู้ติดตามคนนี้ออกจากทีม?')) {
                const result = FollowerModule.dismissFollower(player, btn.dataset.id);
                if (result.success) {
                    SaveModule.saveGame(player);
                    renderFollowers();
                    updateUI();
                    addLog('ผู้ติดตาม', result.message, 'system');
                }
            }
        });
    });
}

// ============================================================
// SHOP PANEL
// ============================================================
function setupShop() {
    document.querySelectorAll('.shop-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.shop-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentShopType = btn.dataset.shop;
            renderShop();
        });
    });

    document.getElementById('btnShopRefresh').addEventListener('click', () => {
        ShopModule.refreshShops(player.level, player.stats?.luck || 0);
        renderShop();
        addLog('ร้านค้า', '🔄 รีเฟรชสินค้าแล้ว', 'system');
    });
}

function renderShop() {
    const container = document.getElementById('shopItems');
    const isElite = currentShopType === 'elite';

    // Check if elite shop is unlocked
    if (isElite && !ShopModule.isEliteShopUnlocked(player.level)) {
        container.innerHTML = `<div class="text-muted">⭐ Elite Shop ปลดล็อกที่ Level 30</div>`;
        document.getElementById('shopStatus').textContent = '🔒 ล็อก';
        return;
    }

    document.getElementById('shopStatus').textContent = isElite ? '⭐ Elite Shop' : '🏪 General Shop';

    let items;
    if (isElite) {
        items = ShopModule.getEliteShopItems(player.level, player.stats?.luck || 0);
    } else {
        items = ShopModule.getGeneralShopItems(player.level, player.stats?.luck || 0);
    }

    if (!items || items.length === 0) {
        container.innerHTML = '<div class="text-muted">สินค้าหมด กรุณารีเฟรช</div>';
        return;
    }

    const rarityMap = { white: 'ขาว', green: 'เขียว', blue: 'ฟ้า', purple: 'ม่วง', gold: 'ทอง', red: 'แดง' };

    container.innerHTML = items.map(entry => {
        const item = entry.item;
        const rarityColor = item.rarity || 'white';
        const rarityDisplay = rarityMap[rarityColor] || rarityColor;
        const statsStr = (item.stats || []).slice(0, 3).map(s => `${s.stat_id}:${s.value}`).join(' ');

        return `
            <div class="item-card shop-item" data-shop-id="${entry.shopItemId}">
                <div class="item-name">${item.name || 'อุปกรณ์'}</div>
                <div class="item-detail">iLv.${item.item_level||'?'} | ${rarityDisplay}</div>
                <div class="item-detail">${statsStr}</div>
                <div class="item-rarity ${rarityColor}">${rarityDisplay}</div>
                <div class="shop-item-price">💰 ${entry.price} Gold</div>
                <button class="shop-item-buy" data-shop-id="${entry.shopItemId}">🛒 ซื้อ</button>
            </div>
        `;
    }).join('');

    container.querySelectorAll('.shop-item-buy').forEach(btn => {
        btn.addEventListener('click', () => {
            const shopId = btn.dataset.shopId;
            const result = ShopModule.buyItem(player, shopId, currentShopType);
            if (result.success) {
                SaveModule.saveGame(player);
                renderShop();
                updateUI();
                addLog('ร้านค้า', result.message, 'system');
            } else {
                addLog('ร้านค้า', `❌ ${result.message}`, 'system');
            }
        });
    });
}

// ============================================================
// SELL ITEM (from inventory)
// ============================================================
export function sellItemFromInventory(instanceId) {
    if (!player) return;
    const result = ShopModule.sellItem(player, instanceId);
    if (result.success) {
        SaveModule.saveGame(player);
        renderInventory();
        updateUI();
        addLog('ร้านค้า', result.message, 'system');
        const resultEl = document.getElementById('shopSellResult');
        resultEl.textContent = `✅ ${result.message}`;
        setTimeout(() => { resultEl.textContent = ''; }, 3000);
    } else {
        addLog('ร้านค้า', `❌ ${result.message}`, 'system');
    }
}

// ============================================================
// EXPOSE GLOBALLY (for inline onclick)
// ============================================================
window.sellItemFromInventory = sellItemFromInventory;
window.startBattle = startBattle;
window.addLog = addLog;
window.updateUI = updateUI;

// ============================================================
// START
// ============================================================
document.addEventListener('DOMContentLoaded', init);
