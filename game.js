// game.js - FINAL Merged Version with Enemy System Enhancements

document.addEventListener('DOMContentLoaded', () => {
    // --- Constants ---
    const DUNGEON_BACKGROUNDS = [
    "C:\Users\everett.haugh\Downloads\dungeon1_bg.png", // Dungeon 1
    //"url_to_dungeon2_background", // Dungeon 2 (placeholder)
   // "url_to_dungeon3_background"  // Dungeon 3 (placeholder)
];
    const CLASS_DATA = {
        Barbarian: { baseHp: 20, baseMp: 0, baseStr: 5, baseDef: 5, baseInt: 5, baseMnd: 5, commands: ['Attack', 'Rage'], initialPowers: [], growth: { hp: 5, mp: 0, str: 1, def: 1, int: 0, mnd: 0 } },
        Valkyrie: { baseHp: 15, baseMp: 10, baseStr: 5, baseDef: 5, baseInt: 5, baseMnd: 5, commands: ['Attack', 'Prayer'], initialPowers: ['Heal1'], growth: { hp: 3, mp: 1, str: 0.5, def: 0.5, int: 0.5, mnd: 0.5 } },
        Ninja: { baseHp: 15, baseMp: 10, baseStr: 5, baseDef: 5, baseInt: 5, baseMnd: 5, commands: ['Attack', 'Spell'], initialPowers: ['Shock1'], growth: { hp: 3, mp: 1, str: 0.5, def: 0.5, int: 0.5, mnd: 0.5 } },
        Shaman: { baseHp: 12, baseMp: 15, baseStr: 5, baseDef: 5, baseInt: 5, baseMnd: 5, commands: ['Attack', 'Spell', 'Prayer'], initialPowers: ['Heal1', 'Shock1'], growth: { hp: 2, mp: 2, str: 0, def: 0.5, int: 1, mnd: 0.5 } },
        Sorceress: { baseHp: 10, baseMp: 20, baseStr: 5, baseDef: 5, baseInt: 5, baseMnd: 5, commands: ['Attack', 'Spell'], initialPowers: ['Fire1', 'Frost1', 'Shock1', 'Hydro1', 'Poison'], growth: { hp: 1, mp: 3, str: 0, def: 0, int: 2, mnd: 2 } },
        Bishop: { baseHp: 10, baseMp: 20, baseStr: 5, baseDef: 5, baseInt: 5, baseMnd: 5, commands: ['Attack', 'Prayer'], initialPowers: ['Heal1', 'Empower1'], growth: { hp: 1, mp: 5, str: 0, def: 0, int: 2, mnd: 2 } }
    };
    const POWER_DATA = {
    // Existing spell entries remain unchanged
        Fire1: { level: 1, cost: 5, type: 'Spell', element: 'Fire', target: 'enemies' },
        Frost1: { level: 1, cost: 5, type: 'Spell', element: 'Frost', target: 'enemies' },
        Shock1: { level: 1, cost: 5, type: 'Spell', element: 'Shock', target: 'enemies' },
        Hydro1: { level: 1, cost: 5, type: 'Spell', element: 'Hydro', target: 'enemies' },
        Poison: { level: 1, cost: 5, type: 'Spell', effect: 'Poison', chance: 0.7, target: 'enemies', duration: 5 },
        Fire2: { level: 2, cost: 15, type: 'Spell', element: 'Fire', target: 'enemies' },
        Frost2: { level: 2, cost: 15, type: 'Spell', element: 'Frost', target: 'enemies' },
        Shock2: { level: 2, cost: 15, type: 'Spell', element: 'Shock', target: 'enemies' },
        Hydro2: { level: 2, cost: 15, type: 'Spell', element: 'Hydro', target: 'enemies' },
        Slow: { level: 2, cost: 15, type: 'Spell', effect: 'Slow', chance: 0.6, target: 'enemies', duration: 5 },
        Fire3: { level: 3, cost: 30, type: 'Spell', element: 'Fire', target: 'enemies' },
        Frost3: { level: 3, cost: 30, type: 'Spell', element: 'Frost', target: 'enemies' },
        Hydro3: { level: 3, cost: 30, type: 'Spell', element: 'Hydro', target: 'enemies' },
        Shock3: { level: 3, cost: 30, type: 'Spell', element: 'Shock', target: 'enemies' },
        
    // Updated and new prayer entries
        Heal1: { level: 1, cost: 5, type: 'Prayer', effect: 'Heal', target: 'ally' },
        Empower1: { level: 1, cost: 5, type: 'Prayer', effect: 'Empower', statusName: 'Empower1', turns: 4, target: 'ally', damageMultiplier: 1.5 },
    //    Restore1: { level: 1, cost: 5, type: 'Prayer', effect: 'Restore', chance: 0.33, target: 'ally' },
        Heal2: { level: 2, cost: 15, type: 'Prayer', effect: 'Heal', target: 'ally' },
        Empower2: { level: 2, cost: 15, type: 'Prayer', effect: 'Empower', statusName: 'Empower2', turns: 4, target: 'ally', damageMultiplier: 3.0 },
     //   Restore2: { level: 2, cost: 15, type: 'Prayer', effect: 'Restore', chance: 0.66, target: 'ally' },
        Revive: { level: 2, cost: 15, type: 'Prayer', effect: 'Revive', hpPercent: 0.25, target: 'ally_ko' },
        Fury: { level: 2, cost: 20, type: 'Prayer', effect: 'Fury', statusName: 'Fury', turns: 4, target: 'ally' },
        Lifelink: { level: 2, cost: 20, type: 'Prayer', effect: 'Lifelink', statusName: 'Lifelink', turns: 4, target: 'ally', healPercent: 0.5 },
        Heal3: { level: 3, cost: 30, type: 'Prayer', effect: 'Heal', target: 'ally' },
        Empower3: { level: 3, cost: 30, type: 'Prayer', effect: 'Empower', statusName: 'Empower3', turns: 4, target: 'ally', damageMultiplier: 5.0 },
};

    const UNLOCK_SCHEDULE = {
        10: { Sorceress: ['Fire2'], Bishop: ['Heal2'] }, 
        16: { Ninja: ['Fire1', 'Frost1', 'Hydro1', 'Poison'], Shaman: ['Fire1', 'Frost1', 'Hydro1', 'Poison', 'Empower1'] }, 
        18: { Sorceress: ['Frost2','Hydro2'], Bishop: ['Empower2'] }, 
        24: { Sorceress: ['Shock2'],  
        25: { Valkyrie: ['Heal2'], Ninja: ['Fire2'], Shaman: ['Heal2', 'Fire2'] }, 
        28: { Bishop: ['Fury'] },
        30: { Sorceress: ['Slow'], Bishop: ['Revive'] }, 
        32: { Valkyrie: ['Empower2'], Ninja: ['Frost2'] }, 
        33: { Shaman: ['Empower2', 'Frost2'] }, 
        35: { Valkyrie: ['Fury'], Shaman: ['Fury'] },
        38: { Ninja: ['Shock2'] }, 
        39: { Shaman: ['Shock2'] }, 
        40: { Sorceress: ['Fire3'], Bishop: ['Heal3'] },
        42: { Bishop: ['Lifelink'] },
        44: { Valkyrie: ['Revive'], Ninja: ['Slow'] }, 
        45: { Shaman: ['Revive', 'Slow'] },
        46: { Valkyrie: ['Lifelink'], Shaman: ['Lifelink'] },
        50: { Sorceress: ['Frost3','Hydro3','Shock3'], Bishop: ['Empower3'] },
};
    const CLASS_LIST = Object.keys(CLASS_DATA);
    const ENEMY_ARCHETYPES = {
        Weakling: { statMultipliers: { hp: 1.0, mp: 1.0, str: 1.0, def: 1.0, int: 1.0, mnd: 1.0 }, abilities: [] },
        Bruiser: { statMultipliers: { hp: 1.20, mp: 1.0, str: 1.20, def: 1.20, int: 1.0, mnd: 1.0 }, abilities: [] },
        Caster: { statMultipliers: { hp: 1.0, mp: 1.0, str: 1.0, def: 1.0, int: 1.10, mnd: 1.30 }, abilities: [] },
        Boss: { statMultipliers: { hp: 1.0, mp: 1.5, str: 1.3, def: 1.3, int: 1.3, mnd: 1.3 }, abilities: [] } // Boss HP Multiplier applied separately
    };
    
    // Define the Orisons for Casters
    const ORISONS = {
    Pyro: { 
        name: 'Pyro', 
        element: 'Fire',
        description: 'A burst of magical flames that hits all party members',
        levelMultiplier: 1.10, // Reduced from 1.75
        mpCost: 5,
        aoe: true  // Now targets all party members
    },
    Freeze: { 
        name: 'Freeze', 
        element: 'Frost',
        description: 'A blast of magical ice that hits all party members',
        levelMultiplier: 1.25, // Reduced from 1.75
        mpCost: 5,
        aoe: true  // Now targets all party members
    },
    Wave: { 
        name: 'Wave', 
        element: 'Hydro',
        description: 'A surge of magical water that hits all party members',
        levelMultiplier: 1.25, // Reduced from 1.75
        mpCost: 5,
        aoe: true  // Now targets all party members
    },
    Lightning: { 
        name: 'Lightning', 
        element: 'Shock',
        description: 'A strike of magical lightning that hits all party members',
        levelMultiplier: 1.25, // Reduced from 1.75
        mpCost: 5,
        aoe: true  // Now targets all party members
    }
};
    
    // Updated enemies with the new ability structure
    const DUNGEON_ENEMIES = [
        { 
            weakling: { 
                name: 'Rat', 
                archetype: 'Weakling',
                abilities: [] // Weaklings have no abilities
            }, 
            bruiser: { 
                name: 'Goblin', 
                archetype: 'Bruiser', 
                abilities: [{ 
                    name: "Goblin Bash", 
                    chance: 0.50, 
                    type: 'BruiserAbility'
                }] 
            }, 
            caster: { 
                name: 'Kobold', 
                archetype: 'Caster', 
                abilities: [{ 
                    name: "Pyro", 
                    chance: 0.35, 
                    type: 'Orison'
                }] 
            } 
        },
        { 
            weakling: { 
                name: 'Sand Worm', 
                archetype: 'Weakling',
                abilities: [] // Weaklings have no abilities
            }, 
            bruiser: { 
                name: 'Thief', 
                archetype: 'Bruiser', 
                abilities: [{ 
                    name: "Backstab", 
                    chance: 0.50, 
                    type: 'BruiserAbility'
                }]
            }, 
            caster: { 
                name: 'Mummy', 
                archetype: 'Mummy', 
                abilities: [{ 
                    name: "Lightning", 
                    chance: 0.50, 
                    type: 'Orison'
                }]
            } 
        },
        { 
            weakling: { 
                name: 'Bat', 
                archetype: 'Weakling',
                abilities: [] // Weaklings have no abilities
            }, 
            bruiser: { 
                name: 'Ooze', 
                archetype: 'Bruiser', 
                abilities: [{ 
                    name: "Acid Splash", 
                    chance: 0.50, 
                    type: 'BruiserAbility'
                }]
            }, 
            caster: { 
                name: 'Skeleton', 
                archetype: 'Caster', 
                abilities: [{ 
                    name: "Freeze", 
                    chance: 0.70, 
                    type: 'Orison'
                }]
            } 
        }
    ];
    
    const WAVE_COMPOSITIONS = [ "W", "WW", "B", "WB", "BB", "C", "CW", "BWW", "CBW", "CC", "WWWW", "BBC", "WWBC", "CBC" ];

    // --- Character Class ---
    class Character {
        constructor(id, className) { this.id = id; this.name = className; this.className = className; this.level = 0; const d = CLASS_DATA[this.className]; this.baseHp = d.baseHp; this.baseMp = d.baseMp; this.baseStr = d.baseStr; this.baseDef = d.baseDef; this.baseInt = d.baseInt; this.baseMnd = d.baseMnd; this.maxHp = d.baseHp; this.maxMp = d.baseMp; this.str = d.baseStr; this.def = d.baseDef; this.int = d.baseInt; this.mnd = d.baseMnd; this.currentHp = this.maxHp; this.currentMp = this.maxMp; this.statusEffects = []; this.isAlive = true; this.isRaging = false; this.powers = [...d.initialPowers]; this.commands = [...d.commands]; }
        recalculateStats() { const d = CLASS_DATA[this.className]; this.maxHp = d.baseHp; this.maxMp = d.baseMp; this.str = d.baseStr; this.def = d.baseDef; this.int = d.baseInt; this.mnd = d.baseMnd; const sL = this.level; this.level = 0; for (let i = 1; i <= sL; i++) this.applyLevelUpGrowth(i); this.level = sL; if (this.className === 'Barbarian') this.maxMp = 0; this.fullRestore(); }
        applyLevelUpGrowth = function(lvl) { 
            this.level = lvl; 
            const g = CLASS_DATA[this.className].growth; 
            let hp = 0, mp = 0, str = 1, def = 1, int = 1, mnd = 1; 
    
            hp += g.hp || 0; 
            mp += g.mp || 0; 
    
            if (this.className === 'Barbarian') { 
            str += g.str; 
        def += g.def; 
    } else if (this.className === 'Sorceress' || this.className === 'Bishop') { 
        int += g.int; 
        mnd += g.mnd; 
    } else if (this.className === 'Valkyrie' || this.className === 'Ninja') { 
        if (lvl % 2 === 0) { 
            str += 1; 
            int += 1; 
        } else { 
            def += 1; 
            mnd += 1; 
        } 
    } else if (this.className === 'Shaman') { 
        int += g.int; 
        if (lvl % 2 === 0) mnd += 1; 
        else def += 1; 
    } 
    
    if (lvl > 1) { 
        // Reduced HP growth from 10% to 6% per level
        this.maxHp = Math.round(this.maxHp * 1.06); 
        if (this.baseMp > 0) this.maxMp = Math.round(this.maxMp * 1.05); 
    } 
    
    this.maxHp += hp; 
    this.maxMp += mp; 
    this.str += str; 
    this.def += def; 
    this.int += int; 
    this.mnd += mnd; 
    
    // Cap HP at 9999 and MP at 999
    this.maxHp = Math.min(this.maxHp, 9999);
    this.maxMp = Math.min(this.maxMp, 999);
};
        levelUp() { const nL = this.level + 1; this.applyLevelUpGrowth(nL); if (UNLOCK_SCHEDULE[this.level]?.[this.className]) { UNLOCK_SCHEDULE[this.level][this.className].forEach(p => { if (!this.powers.includes(p)) { this.powers.push(p); gameState.addLogMessage(`${this.name} learned ${p}!`); } }); } console.log(`Lvl Up ${this.level}: ${this.name} HP:${this.maxHp} MP:${this.maxMp} STR:${this.str} DEF:${this.def} INT:${this.int} MND:${this.mnd}`); }
    fullRestore = function() { 
    this.currentHp = this.maxHp; 
    this.currentMp = this.maxMp; 
    this.statusEffects = this.statusEffects.filter(s => s.isPermanent); 
    this.isAlive = this.currentHp > 0; 
    this.isRaging = false; 
    // Clear all the buffs
    this.removeStatus('Empower1');
    this.removeStatus('Empower2');
    this.removeStatus('Fury');
    this.removeStatus('Lifelink');
    this.removeStatus('Slow');
    this.removeStatus('Poison');
};        getCurrentStat(sName) { let val = this[sName]; this.statusEffects.forEach(e => { if (e[`${sName}Bonus`]) val += e[`${sName}Bonus`]; }); return Math.max(0, val); }
        takeDamage(amt) { if (!this.isAlive) return 0; const damageMultiplier = this.isRaging ? 2 : 1; const finalAmount = Math.max(0, amt) * damageMultiplier; this.currentHp -= Math.round(finalAmount); if (this.currentHp <= 0) { this.currentHp = 0; this.isAlive = false; this.isRaging = false; this.statusEffects = this.statusEffects.filter(s => s.isPermanent); gameState.addLogMessage(`${this.name} KO!`); } return Math.round(finalAmount); }
        heal(amt) { if (!this.isAlive) return 0; const heal = Math.max(0, amt); const prev = this.currentHp; this.currentHp = Math.min(this.maxHp, this.currentHp + heal); return this.currentHp - prev; }
        useMp(amt) { if (this.currentMp < amt) return false; this.currentMp -= amt; return true; }
        restoreMp(amt) { if (!this.isAlive) return 0; const r = Math.max(0, amt); const p = this.currentMp; this.currentMp = Math.min(this.maxMp, this.currentMp + r); return this.currentMp - p; }
        addStatus(effect) { 
            const idx = this.statusEffects.findIndex(s => s.type === effect.type); 
    
            if (idx !== -1) { 
        // For Bolster effects, keep the special handling
        if (effect.type.startsWith('Bolster')) { 
            const existingLevel = parseInt(this.statusEffects[idx].type.replace('Bolster', ''));
            const newLevel = parseInt(effect.type.replace('Bolster', '')); 
            if (newLevel >= existingLevel) {
                this.statusEffects.splice(idx, 1);
            } else {
                return false; 
            } 
        } 
               // For buff effects (Empower, Fury, Lifelink), always replace with the new buff
        else if (effect.type === 'Empower1' || effect.type === 'Empower2' || 
                 effect.type === 'Fury' || effect.type === 'Lifelink') {
            // Remove the old buff
            this.statusEffects.splice(idx, 1);
            // The new buff will be added below
        }
        // For other status effects (like debuffs), keep original behavior
        else { 
            return false; 
        }
    }
    
    // Add the new effect
    this.statusEffects.push({ ...effect }); 
    return true; 
} 
        removeStatus(sType) { const l = this.statusEffects.length; this.statusEffects = this.statusEffects.filter(s => s.type !== sType); return this.statusEffects.length < l; }
        clearNegativeStatuses() { const neg = ['Poison', 'Slow']; let r = false; this.statusEffects = this.statusEffects.filter(s => { if (neg.includes(s.type)) { r = true; return false; } return true; }); return r; }
    }

    // --- Game State Manager ---
    const gameState = {
        currentWave: 0, currentDungeon: 0, party: [], enemies: [], currentState: 'TITLE_SCREEN', partySelectionIndex: 0, selectedClasses: [null, null, null, null], tempSelectedClass: CLASS_LIST[0], activeCharacterIndex: 0, currentAction: null, messageLog: [], nextWaveEffect: null, activeMenu: 'main', focusedIndex: 0, actionQueue: [],
        addLogMessage(msg) { this.messageLog.push(msg); if (this.messageLog.length > 50) this.messageLog.shift(); /* No log UI */ },
        getCharacterById(id) { return this.party.find(c => c.id === id); },
        getEnemyById(id) { return this.enemies.find(e => e.id === id); },
        setState(newState) { console.log(`State: ${this.currentState} -> ${newState}`); this.currentState = newState; this.updateUIForState(); },
        updateUIForState() {
            console.log("Update UI for state:", this.currentState);
            const overlays = ['title-screen', 'party-select-screen', 'item-choice-screen', 'tavern-screen', 'game-over-screen'];
            const combatUIContainers = ['battlefield-enemy-area', 'battlefield-party-area', 'ui-main-box'];
            const dynamicMenuContent = document.getElementById('dynamic-menu-content');
            overlays.forEach(id => document.getElementById(id).style.display = 'none');
            combatUIContainers.forEach(id => document.getElementById(id).style.display = 'none');
            if (dynamicMenuContent) dynamicMenuContent.innerHTML = ''; // Clear dynamic menu

            switch (this.currentState) {
                case 'TITLE_SCREEN': document.getElementById('title-screen').style.display = 'flex'; break;
                case 'PARTY_SELECTION': document.getElementById('party-select-screen').style.display = 'flex'; updatePartySelectUI(); break;
                case 'PLAYER_COMMAND': case 'ACTION_RESOLUTION':
                    combatUIContainers.forEach(id => document.getElementById(id).style.display = id === 'ui-main-box' ? 'grid' : 'block');
                    updatePartyStatusUI(); updateEnemySpritesUI();
                    const actionArea = document.getElementById('action-menu-area');
                    const partyStatusArea = document.getElementById('party-status-area');
                    if (this.currentState === 'PLAYER_COMMAND') {
                        actionArea.style.display = 'flex'; partyStatusArea.style.display = 'grid';
                        const char = this.party[this.activeCharacterIndex];
                        if (char) { populateMenu(gameState.activeMenu); updateActionMenuUI(char); highlightActivePartyStatus(this.activeCharacterIndex); resetFocusToMenu(gameState.activeMenu); }
                    } else { actionArea.style.display = 'none'; partyStatusArea.style.display = 'grid'; highlightActivePartyStatus(-1); }
                    break;
                case 'BETWEEN_WAVES': document.getElementById('item-choice-screen').style.display = 'flex'; showItemRewardScreen(); break;
                case 'TAVERN': document.getElementById('tavern-screen').style.display = 'flex'; enterTavern(); break;
                case 'GAME_OVER': document.getElementById('game-over-screen').style.display = 'flex'; handleGameOver(); break;
            }
        }
    };

    // --- Calculation Helper Functions ---
    function calculatePhysicalDamage(attacker, defender) { const attackerStr = attacker.getCurrentStat ? attacker.getCurrentStat('str') : attacker.str; const defenderDef = defender.getCurrentStat ? defender.getCurrentStat('def') : defender.def; const attackerLevel = attacker.level; const defenderLevel = defender.level; let baseMultiplier = attacker.isRaging ? 2.2 : (1.5 + Math.random() * 0.45); let offenseValue = (attackerLevel + attackerStr) * baseMultiplier; let defenseValue = (defenderLevel + defenderDef); const damage = Math.round(offenseValue - defenseValue); return Math.max(1, damage); }
    function calculateMagicDamage(caster, target, spellLvl) { const cI = caster.getCurrentStat ? caster.getCurrentStat('int') : caster.int; const tM = target.getCurrentStat ? target.getCurrentStat('mnd') : target.mnd; const cL = caster.level, tL = target.level; const rM = 1.5 + Math.random() * 0.45; const sM = spellLvl; const oV = ((cL + cI) * sM) * rM; const dV = (tL + tM); const dmg = Math.round(oV - dV); return Math.max(1, dmg); }
    function calculateHealing(caster, prayerLvl) { 
    const cI = caster.getCurrentStat ? caster.getCurrentStat('int') : caster.int; 
    const cL = caster.level; 
    let base, mult, levelBonus;
    
    switch (prayerLvl) { 
        case 1: 
            base = 15; 
            mult = 0.5;
            levelBonus = cL; // Add caster's level to Heal1
            break; 
        case 2: 
            base = 40; 
            mult = 0.75;
            levelBonus = cL * 2.5; // Add 2.5 * caster's level to Heal2 
            break; 
        case 3: 
            base = 100; 
            mult = 1.0;
            levelBonus = cL * 5; // Add 5 * caster's level to Heal3
            break; 
        default: 
            base = 10; 
            mult = 0.4;
            levelBonus = 0;
    } 
    
    const heal = Math.round(base + ((cL + cI) * mult) + levelBonus); 
    return Math.max(1, heal); 
}
    function calculateHeal1Amount(caster) { 
    const cI = caster.getCurrentStat ? caster.getCurrentStat('int') : caster.int; 
    const cL = caster.level; 
    const pF = 1.2 * (cL + cI); 
    const rM = 1.0 + Math.random() * 0.15; 
    // Add caster's level to the healing amount
    const heal = Math.round((pF * rM) + cL); 
    return Math.max(1, heal); 
}

    // --- New function to calculate Orison damage
    function calculateOrisonDamage(caster, target) {
    const casterInt = caster.getCurrentStat ? caster.getCurrentStat('int') : caster.int;
    const targetMnd = target.getCurrentStat ? target.getCurrentStat('mnd') : target.mnd;
    const casterLevel = caster.level;
    const targetLevel = target.level;
    
    // Using similar formula as magic damage but with the reduced orison multiplier
    const levelMultiplier = 1.25; // Reduced from 1.75
    const randomMultiplier = 1.5 + Math.random() * 0.45;
    
    const offenseValue = ((casterLevel + casterInt) * levelMultiplier) * randomMultiplier;
    const defenseValue = (targetLevel + targetMnd);
    
    const damage = Math.round(offenseValue - defenseValue);
    return Math.max(1, damage);
}

    // --- UI Update Functions ---
    function updatePartyStatusUI() {
    gameState.party.forEach((c, i) => {
        const b = document.getElementById(`char-status-${i + 1}`);
        if (!b) return;
        
        // Remove existing classes
        b.classList.remove('ko', 'hp-critical', 'buffed', 'empower-buffed', 'fury-buffed', 'lifelink-buffed');
        b.querySelectorAll('span').forEach(span => 
            span.classList.remove('hp-critical', 'hp-ko', 'buffed', 'empower-buffed', 'fury-buffed', 'lifelink-buffed')
        );
        
        // Get DOM elements
        const nameSpan = b.querySelector('.char-name') || b.children[0];
        const statusSpan = b.querySelector('.char-status') || b.children[1];
        const hpSpan = b.querySelector('.char-hp') || b.children[2];
        const mpSpan = b.querySelector('.char-mp') || b.children[3];
        
        // Update basic status info
        if (nameSpan) nameSpan.textContent = c.name;
        if (hpSpan) hpSpan.innerHTML = `HP: <span class="hp-value">${c.currentHp}</span>/<span class="hp-max">${c.maxHp}</span>`;
        if (mpSpan) mpSpan.innerHTML = `MP: <span class="mp-value">${c.currentMp}</span>/<span class="mp-max">${c.maxMp}</span>`;
        
        // Check for buffs
        const hasEmpowerBuff = c.statusEffects.some(e => e.type === 'Empower1' || e.type === 'Empower2');
        const hasFuryBuff = c.statusEffects.some(e => e.type === 'Fury');
        const hasLifelinkBuff = c.statusEffects.some(e => e.type === 'Lifelink');
        const hasAnyBuff = hasEmpowerBuff || hasFuryBuff || hasLifelinkBuff;
        
        // Also update sprites with buff classes
        const spriteElement = document.getElementById(getCorrectElementId(c.id + "-sprite"));
        if (spriteElement) {
            spriteElement.classList.remove('buffed', 'empower-buffed', 'fury-buffed', 'lifelink-buffed');
            spriteElement.classList.remove('empower-pulse', 'fury-pulse', 'lifelink-pulse');
            
            if (hasEmpowerBuff) {
                spriteElement.classList.add('buffed', 'empower-buffed', 'empower-pulse');
            }
            if (hasFuryBuff) {
                spriteElement.classList.add('buffed', 'fury-buffed', 'fury-pulse');
            }
            if (hasLifelinkBuff) {
                spriteElement.classList.add('buffed', 'lifelink-buffed', 'lifelink-pulse');
            }
        }
        
        // Update status text and apply buff styling
        if (statusSpan) {
            if (!c.isAlive) {
                statusSpan.textContent = "KO";
                statusSpan.style.color = '#ff6666';
            } else {
                let statusText = '';
                
                // Collect buff names
                const buffs = [];
                if (hasEmpowerBuff) {
                    const buff = c.statusEffects.find(e => e.type === 'Empower1' || e.type === 'Empower2');
                    buffs.push(`E${buff.damageMultiplier}x`);
                    b.classList.add('buffed', 'empower-buffed');
                }
                
                if (hasFuryBuff) {
                    buffs.push('FURY');
                    b.classList.add('buffed', 'fury-buffed');
                }
                
                if (hasLifelinkBuff) {
                    buffs.push('LIFE');
                    b.classList.add('buffed', 'lifelink-buffed');
                }
                
                // Add negative statuses
                const negatives = c.statusEffects
                    .filter(e => e.type === 'Poison' || e.type === 'Slow')
                    .map(e => e.type);
                
                // Combined status text
                if (buffs.length > 0) {
                    statusText = buffs.join('+');
                    if (negatives.length > 0) {
                        statusText += ' ' + negatives.join(' ');
                    }
                    
                    // Add buff visual class
                    statusSpan.classList.add('buffed');
                    statusSpan.style.color = '#ffffff';
                } else if (negatives.length > 0) {
                    statusText = negatives.join(' ');
                    statusSpan.style.color = '#ffee88';
                } else {
                    statusText = 'OK';
                    statusSpan.style.color = '#ffee88';
                }
                
                statusSpan.textContent = statusText;
            }
        }
        
        // Apply KO and critical HP styles
        if (!c.isAlive) {
            if (nameSpan) nameSpan.classList.add('hp-ko');
            if (hpSpan) hpSpan.classList.add('hp-ko');
            if (mpSpan) mpSpan.classList.add('hp-ko');
            b.classList.add('ko');
        } else if (c.maxHp > 0 && c.currentHp / c.maxHp < 0.33) {
            if (nameSpan) nameSpan.classList.add('hp-critical');
            if (hpSpan) hpSpan.classList.add('hp-critical');
            if (mpSpan) mpSpan.classList.add('hp-critical');
            b.classList.add('hp-critical');
        }
        
        // Set opacity based on alive status
        b.style.opacity = c.isAlive ? 1 : 0.6;
    });
 }    
    function updateCombatLogUI() { /* Log area removed */ }
    function updateActionMenuUI(char) { const box = document.querySelector('#dynamic-menu-content .action-menu-box'); if (!box) return; const btns = box.querySelectorAll('button'); if (!char || !char.isAlive) { btns.forEach(b => { b.style.display = 'none'; b.disabled = true; }); return; } btns.forEach(b => { const a = b.dataset.action; if (!a) return; let available = char.commands.includes(a); if (a === 'Spell' && !char.powers.some(p => POWER_DATA[p]?.type === 'Spell')) available = false; if (a === 'Prayer' && !char.powers.some(p => POWER_DATA[p]?.type === 'Prayer')) available = false; b.style.display = available ? 'block' : 'none'; b.disabled = !available; }); }
    function updateEnemySpritesUI() { const enemyArea = document.getElementById('battlefield-enemy-area'); enemyArea.innerHTML = ''; gameState.enemies.forEach((e, i) => { const d = document.createElement('div'); d.className = 'sprite enemy'; d.id = e.id; d.style.left = `${20 + i * 20}%`; d.style.top = '50%'; d.style.transform = 'translateY(-50%)'; d.textContent = e.name.substring(0, 3); d.title = `${e.name}(HP:${e.currentHp}/${e.maxHp})`; if (!e.isAlive) d.classList.add('ko'); enemyArea.appendChild(d); }); const partyArea = document.getElementById('battlefield-party-area'); partyArea.innerHTML = ''; gameState.party.forEach((p, i) => { const d = document.createElement('div'); d.className = 'sprite party-member'; d.id = p.id + "-sprite"; d.style.left = `${20 + i * 20}%`; d.textContent = p.name.substring(0, 3); d.title = `${p.name}(HP:${p.currentHp}/${p.maxHp})`; if (!p.isAlive) d.classList.add('ko'); partyArea.appendChild(d); }); }
    function updatePartySelectUI() { const cont = document.getElementById('party-select-slots'); cont.innerHTML = ''; for (let i = 0; i < 4; i++) { const d = document.createElement('div'); d.className = 'party-select-slot'; d.id = `select-slot-${i}`; let cN = '', conf = false, act = (i === gameState.partySelectionIndex); if (i < gameState.partySelectionIndex) { cN = gameState.selectedClasses[i]; conf = true; } else if (i === gameState.partySelectionIndex) { cN = gameState.tempSelectedClass; } else { cN = '---'; } d.innerHTML = `Character ${i + 1}: <span class="selected-class"></span>`; const s = d.querySelector('.selected-class'); s.textContent = cN; CLASS_LIST.forEach(c => s.classList.remove(c)); if (cN !== '---' && CLASS_DATA[cN]) s.classList.add(cN); if (act) d.classList.add('active'); if (conf) d.classList.add('confirmed'); cont.appendChild(d); } }
    function highlightActivePartyStatus(index) { document.querySelectorAll('#party-status-area > .character-status-box').forEach((b, i) => { if (i === index && gameState.party[index]?.isAlive) { b.classList.add('highlighted'); } else { b.classList.remove('highlighted'); } }); }
    function updateDungeonBackground() {
        const bgElement = document.getElementById('game-background');
        if (!bgElement) {
            console.error("Background element not found!");
            return;
        }
        
        // Remove all existing background classes
        bgElement.classList.remove('dungeon1-background', 'dungeon2-background', 'dungeon3-background');
        
        // Calculate the current dungeon index (0-based)
        const dungeonIndex = Math.min(2, Math.floor((gameState.currentWave - 1) / 15));
        
        // Add the appropriate class for the current dungeon
        if (dungeonIndex >= 0) {
            const className = `dungeon${dungeonIndex + 1}-background`;
            bgElement.classList.add(className);
            console.log(`Applied background class: ${className}`);
        }
    }
    // --- Visual Effect Helpers ---
    function getCorrectElementId(actorOrTargetId) { return gameState.party.some(p => p.id === actorOrTargetId) ? actorOrTargetId + "-sprite" : actorOrTargetId; }
    function flashSprite(id, color = 'white', dur = 150) { const elementId = getCorrectElementId(id); const e = document.getElementById(elementId); if (e) { const oF = e.style.filter; e.style.transition = 'filter 0.05s ease-in-out'; e.style.filter = 'brightness(3) contrast(2)'; setTimeout(() => { e.style.filter = oF || 'none'; setTimeout(() => e.style.transition = '', 50); }, dur); } }
    function shimmerSprite(id, color = 'gold', dur = 1400) { const elementId = getCorrectElementId(id); const e = document.getElementById(elementId); if (e) { const sD = document.createElement('div'); sD.style.cssText = `position:absolute;inset:0;pointer-events:none;z-index:5;opacity:0.7;border-radius:50%;box-shadow:0 0 15px 8px ${color};transition:opacity ${dur / 1000}s ease-out;`; e.style.position = 'relative'; e.appendChild(sD); requestAnimationFrame(() => { setTimeout(() => sD.style.opacity = '0', 50); }); setTimeout(() => { if (e.contains(sD)) e.removeChild(sD); e.style.position = ''; }, dur); } }
    function showFloatingNumber(targetId, amount, type = 'damage') { const elementId = getCorrectElementId(targetId); const tE = document.getElementById(elementId); if (!tE) { console.warn("FloatNum Target Sprite not found:", elementId); return; } const nE = document.createElement('span'); nE.textContent = Math.abs(amount); nE.className = `floating-number ${type}`; const cont = document.getElementById('game-container'); const targetRect = tE.getBoundingClientRect(); const contRect = cont.getBoundingClientRect(); let sX = targetRect.left - contRect.left + (targetRect.width / 2); let sY = targetRect.top - contRect.top; sX += Math.random() * 20 - 10; nE.style.left = `${sX - 15}px`; nE.style.top = `${sY}px`; cont.appendChild(nE); nE.addEventListener('animationend', () => { if (nE.parentNode === cont) cont.removeChild(nE); }, { once: true }); }
    let announcementTimeout = null; function showActionAnnouncement(text, duration = 1500) { const bar = document.getElementById('action-announcement-bar'); const barText = document.getElementById('action-announcement-text'); if (!bar || !barText) return; if (announcementTimeout) clearTimeout(announcementTimeout); barText.textContent = text; bar.style.display = 'block'; announcementTimeout = setTimeout(() => { bar.style.display = 'none'; announcementTimeout = null; }, duration); }

    // --- Initialization Function ---
   function initializeGame() { 
    console.log("Init Game..."); 
    gameState.currentWave = 0; 
    gameState.currentDungeon = 0; 
    gameState.messageLog = []; 
    gameState.party = []; 
    gameState.enemies = []; 
    gameState.nextWaveEffect = null; 
    gameState.partySelectionIndex = 0; 
    gameState.selectedClasses = [null, null, null, null]; 
    gameState.tempSelectedClass = CLASS_LIST[0]; 
    gameState.activeMenu = 'main'; 
    gameState.focusedIndex = 0; 
    gameState.actionQueue = []; 
    
    // Clear the background when returning to title screen
    const bgElement = document.getElementById('game-background');
    if (bgElement) bgElement.style.backgroundImage = 'none';
    
    gameState.setState('TITLE_SCREEN'); 
    setupGlobalKeyListener(); 
    console.log("Init complete. State:", gameState.currentState); 
}

    // --- Menu Population Function ---
    function populateMenu(menuType, associatedData = null) {
        const contentArea = document.getElementById('dynamic-menu-content'); contentArea.innerHTML = '';
        gameState.activeMenu = menuType; let menuContainer = document.createElement('div');
        switch (menuType) {
            case 'main': menuContainer.className = 'action-menu-box'; const char = gameState.party[gameState.activeCharacterIndex]; if (char) { const commandsToShow = ['Attack', 'Spell', 'Prayer', 'Rage']; commandsToShow.forEach(cmd => { let available = char.commands.includes(cmd); if (cmd === 'Spell' && !char.powers.some(p => POWER_DATA[p]?.type === 'Spell')) available = false; if (cmd === 'Prayer' && !char.powers.some(p => POWER_DATA[p]?.type === 'Prayer')) available = false; if (available) { const btn = document.createElement('button'); btn.dataset.action = cmd; btn.textContent = cmd; menuContainer.appendChild(btn); } }); updateActionMenuUI(char); } break;
            case 'Spell': case 'Prayer': menuContainer.className = 'sub-menu-box'; const caster = gameState.party[gameState.activeCharacterIndex]; const powerList = caster.powers.filter(p => POWER_DATA[p]?.type === (menuType === 'Spell' ? 'Spell' : 'Prayer')); if (powerList.length > 0) { powerList.forEach(pN => { const p = POWER_DATA[pN]; const btn = document.createElement('button'); btn.dataset.power = pN; btn.textContent = `${pN} (${p.cost} MP)`; btn.disabled = caster.currentMp < p.cost; menuContainer.appendChild(btn); }); } else { menuContainer.innerHTML = `<p style="color: #aaa;">No ${menuType} known.</p>`; const backBtn = document.createElement('button'); backBtn.textContent = "Back"; backBtn.onclick = handleMenuCancel; menuContainer.appendChild(backBtn); } break;
            case 'targets': menuContainer.className = 'sub-menu-box target-menu'; const targetEnemies = associatedData; const prompt = document.createElement('span'); prompt.id = 'target-prompt'; prompt.textContent = `Select Target (${targetEnemies ? 'Enemy' : 'Ally'}):`; menuContainer.appendChild(prompt); const list = targetEnemies ? gameState.enemies : gameState.party; const pName = gameState.currentAction?.powerName; const power = pName ? POWER_DATA[pName] : null; let found = false; list.forEach(t => { let valid = false; if (targetEnemies) valid = t.isAlive; else { if (power?.target === 'ally_ko') valid = !t.isAlive; else valid = t.isAlive; } if (valid) { found = true; const b = document.createElement('button'); b.dataset.targetId = t.id; b.textContent = t.name; menuContainer.appendChild(b); } }); if (!found) { menuContainer.innerHTML += `<p style="color: #aaa;">No valid targets.</p>`; const backBtn = document.createElement('button'); backBtn.textContent = "Back"; backBtn.onclick = handleMenuCancel; menuContainer.appendChild(backBtn); } break;
        }
        contentArea.appendChild(menuContainer); resetFocusToMenu(menuType);
    }

    // --- Event Listeners & Input Handling ---
    function setupGlobalKeyListener() { document.removeEventListener('keydown', handleGlobalKeyPress); document.addEventListener('keydown', handleGlobalKeyPress); console.log("GlobalKeyListener Attached"); }
    function handleGlobalKeyPress(event) { let prevent = false; switch (gameState.currentState) { case 'TITLE_SCREEN': if (event.key === 'Enter') { prevent = true; gameState.setState('PARTY_SELECTION'); } break; case 'PARTY_SELECTION': prevent = true; handlePartySelectKeyPress(event); break; case 'PLAYER_COMMAND': prevent = handleCombatKeyPress(event); break; case 'GAME_OVER': if (event.key === 'Enter') { prevent = true; document.getElementById('restart-button')?.click(); } break; } if (prevent) event.preventDefault(); }
    function handlePartySelectKeyPress(event) { const curI = CLASS_LIST.indexOf(gameState.tempSelectedClass); let newI = curI; switch (event.key) { case 'ArrowUp': case 'ArrowLeft': newI = (curI - 1 + CLASS_LIST.length) % CLASS_LIST.length; break; case 'ArrowDown': case 'ArrowRight': newI = (curI + 1) % CLASS_LIST.length; break; case 'Enter': gameState.selectedClasses[gameState.partySelectionIndex] = gameState.tempSelectedClass; gameState.partySelectionIndex++; if (gameState.partySelectionIndex >= 4) finalizePartySelection(); else { gameState.tempSelectedClass = CLASS_LIST[0]; updatePartySelectUI(); } return; case 'Shift': case 'Escape': if (gameState.partySelectionIndex > 0) { gameState.partySelectionIndex--; gameState.tempSelectedClass = gameState.selectedClasses[gameState.partySelectionIndex] || CLASS_LIST[0]; gameState.selectedClasses[gameState.partySelectionIndex] = null; updatePartySelectUI(); } return; } if (newI !== curI) { gameState.tempSelectedClass = CLASS_LIST[newI]; updatePartySelectUI(); } }
    function setupCombatButtonListeners() { console.log("Setup Combat Listener on Dynamic Area"); const contentArea = document.getElementById('dynamic-menu-content'); if (contentArea) { contentArea.removeEventListener('click', handleCombatButtonClick); contentArea.addEventListener('click', handleCombatButtonClick); } }
    function handleCombatButtonClick(e) { if (e.target.tagName === 'BUTTON' && gameState.currentState === 'PLAYER_COMMAND') { const button = e.target; if (button.dataset.action) { handleActionClick(button); } else if (button.dataset.power) { handlePowerSelection(button); } else if (button.dataset.targetId) { handleTargetSelection(button); } else if (button.textContent === "Back") { handleMenuCancel(); } } }
    function handleCombatKeyPress(event) { let handled = false; const menuEl = document.querySelector('#dynamic-menu-content > div'); if (!menuEl) return false; const btns = getVisibleEnabledButtons(menuEl); if (btns.length === 0) { if (event.key === 'Shift' || event.key === 'Escape') { handleMenuCancel(); return true; } return false; } let curF = gameState.focusedIndex; if (curF < 0 || curF >= btns.length) curF = 0; let newF = curF; switch (event.key) { case 'ArrowUp': newF = (curF - 1 + btns.length) % btns.length; handled = true; break; case 'ArrowDown': newF = (curF + 1) % btns.length; handled = true; break; case 'Enter': if (btns[curF]) btns[curF].click(); handled = true; break; case 'Shift': case 'Escape': handleMenuCancel(); handled = true; break; } if (handled && newF !== curF) { updateMenuFocus(btns, newF); gameState.focusedIndex = newF; } return handled; }
    function getVisibleEnabledButtons(parent) { if (!parent) return []; return Array.from(parent.querySelectorAll('button')).filter(b => !b.disabled && b.style.display !== 'none' && b.offsetParent !== null); }
    function updateMenuFocus(btns, newIdx) { btns.forEach((b, i) => { if (i === newIdx) b.classList.add('focused'); else b.classList.remove('focused'); }); }
    function handleMenuCancel() { 
    console.log("Cancel. Menu:", gameState.activeMenu); 
    
    switch (gameState.activeMenu) { 
        case 'Spell': 
        case 'Prayer': 
            // Return to main menu
            populateMenu('main'); 
            gameState.currentAction = null; // Clear the current action
            break;
            
        case 'targets': 
            const aT = gameState.currentAction?.type; 
            
            // Return to the appropriate menu based on action type
            if (aT === 'Spell') {
                populateMenu('Spell');
            } 
            else if (aT === 'Prayer') {
                populateMenu('Prayer');
            }
            else {
                // For other action types like Attack, back to main menu
                populateMenu('main');
                gameState.currentAction = null; // Clear the current action
            }
            break;
            
        case 'main': 
            // Already at main menu, no action needed
            break;
    }
}
    function resetFocusToMenu(menuName) { gameState.activeMenu = menuName; const menuEl = document.querySelector('#dynamic-menu-content > div'); if (menuEl) { const btns = getVisibleEnabledButtons(menuEl); if (btns.length > 0) { gameState.focusedIndex = 0; updateMenuFocus(btns, 0); } else { gameState.focusedIndex = -1; updateMenuFocus(btns, -1); } } else { gameState.focusedIndex = -1; } }

    // --- Action Handling Modifications ---
    function handleActionClick(button) { const aT = button.dataset.action; const char = gameState.party[gameState.activeCharacterIndex]; if (!char || !char.isAlive || button.disabled) return; console.log(`${char.name} selects ${aT}`); gameState.currentAction = { type: aT, casterId: char.id, targets: [] }; switch (aT) { case 'Attack': case 'Rage': populateMenu('targets', true); break; case 'Spell': populateMenu('Spell'); break; case 'Prayer': populateMenu('Prayer'); break; default: console.error("Unhandled action:", aT); populateMenu('main'); } }
    function handlePowerSelection(button) { const pN = button.dataset.power; const p = POWER_DATA[pN]; const caster = gameState.party[gameState.activeCharacterIndex]; if (!p || caster.currentMp < p.cost) { gameState.addLogMessage(`${caster.name} needs more MP for ${pN}!`); return; } console.log(`${caster.name} selects ${pN}`); gameState.currentAction.powerName = pN; gameState.currentAction.powerCost = p.cost; if (p.target === 'enemies' || p.target === 'allies') { gameState.currentAction.targets = (p.target === 'enemies') ? gameState.enemies.filter(e => e.isAlive).map(e => e.id) : gameState.party.filter(pl => pl.isAlive).map(pl => pl.id); queueAction(caster.id, gameState.currentAction); gameState.currentAction = null; highlightActivePartyStatus(-1); prepareCommandPhase(); } else { populateMenu('targets', p.target === 'enemy' || p.target === 'enemies'); } }    
    function handleTargetSelection(button) { const tId = button.dataset.targetId; console.log(`Target: ${tId}`); gameState.currentAction.targets = [tId]; if (gameState.currentState === 'PLAYER_COMMAND') { const act = gameState.currentAction; const cast = gameState.getCharacterById(act.casterId); /* MP Check/Deduction now primarily in handlePowerSelection */ queueAction(cast.id, act); gameState.currentAction = null; highlightActivePartyStatus(-1); prepareCommandPhase(); } else { console.error("Target selected outside command state!"); } }

    // --- Finalize Party Selection, Core Game Logic (Command Queue, Turn Order, Execution) ---
    function finalizePartySelection() { console.log("Finalizing party:", gameState.selectedClasses); gameState.party = []; gameState.selectedClasses.forEach((cN, i) => { if (!cN) cN = 'Barbarian'; const c = new Character(`party-${i + 1}`, cN); c.applyLevelUpGrowth(1); c.fullRestore(); gameState.party.push(c); }); console.log("Party Created:", gameState.party); gameState.setState('COMBAT_LOADING'); setupCombatButtonListeners(); startNextWave(); }
    
    function startNextWave() { 
    gameState.currentWave++; 
    console.log(`Start Wave ${gameState.currentWave}`); 
    gameState.addLogMessage(`Wave ${gameState.currentWave}`); 
    
    // Add this line to update the background
    updateDungeonBackground();
    
    gameState.enemies = generateEnemiesForWave(gameState.currentWave); 
    console.log("Enemies:", gameState.enemies); 
    gameState.actionQueue = []; 
    gameState.nextWaveEffect = null; 
    gameState.activeCharacterIndex = 0; 
    gameState.setState('PLAYER_COMMAND'); 
    prepareCommandPhase(); 
}
    function generateEnemiesForWave(wave) { const enemies = []; const dungeonIndex = Math.min(DUNGEON_ENEMIES.length - 1, Math.floor((wave - 1) / 15)); const waveIndexInDungeon = (wave - 1) % 15; const dungeonData = DUNGEON_ENEMIES[dungeonIndex]; const baseStats = calculateEnemyStats(wave); let isBossWave = (waveIndexInDungeon === 14); let compositionString = ""; if (isBossWave) { compositionString = "BOSS"; } else if (waveIndexInDungeon < WAVE_COMPOSITIONS.length) { compositionString = WAVE_COMPOSITIONS[waveIndexInDungeon]; } else { compositionString = "W"; console.error("Wave comp OOB!"); } let letterCounts = { 'W': 0, 'B': 0, 'C': 0 }; if (isBossWave) { let bossName = 'FinalDragon'; if (dungeonIndex === 0) bossName = 'WhiteDragon'; else if (dungeonIndex === 1) bossName = 'BlueDragon'; else if (dungeonIndex === 2) bossName = 'BlackDragon'; const archetypeData = ENEMY_ARCHETYPES['Boss'] || ENEMY_ARCHETYPES['Weakling']; const multipliers = archetypeData.statMultipliers; let finalStats = { hp: Math.round(baseStats.hp * 2.50), mp: Math.round(baseStats.mp * multipliers.mp), str: Math.round(baseStats.str * multipliers.str), def: Math.round(baseStats.def * multipliers.def), int: Math.round(baseStats.int * multipliers.int), mnd: Math.round(baseStats.mnd * multipliers.mnd), }; enemies.push({ id: `enemy-1`, name: bossName, type: bossName, archetype: 'Boss', level: wave, maxHp: finalStats.hp, currentHp: finalStats.hp, maxMp: finalStats.mp, currentMp: finalStats.mp, str: finalStats.str, def: finalStats.def, int: finalStats.int, mnd: finalStats.mnd, isAlive: true, statusEffects: [], abilities: [{ name: 'DragonBreath', type: 'Ability', chance: 1.0 }], getCurrentStat(sN) { return this[sN]; }, actsTwice: true }); } else { for (let i = 0; i < compositionString.length; i++) { let enemyDef, archetypeKey, typeChar = compositionString[i]; if (typeChar === 'W') { archetypeKey = 'weakling'; enemyDef = dungeonData.weakling; } else if (typeChar === 'B') { archetypeKey = 'bruiser'; enemyDef = dungeonData.bruiser; } else if (typeChar === 'C') { archetypeKey = 'caster'; enemyDef = dungeonData.caster; } else continue; if (!enemyDef) { console.error(`Def missing ${typeChar} in dungeon ${dungeonIndex}`); continue; } const archetypeData = ENEMY_ARCHETYPES[enemyDef.archetype] || ENEMY_ARCHETYPES['Weakling']; const multipliers = archetypeData.statMultipliers; let finalStats = { hp: Math.round(baseStats.hp * multipliers.hp), mp: Math.round(baseStats.mp * multipliers.mp), str: Math.round(baseStats.str * multipliers.str), def: Math.round(baseStats.def * multipliers.def), int: Math.round(baseStats.int * multipliers.int), mnd: Math.round(baseStats.mnd * multipliers.mnd), }; letterCounts[typeChar]++; const enemyName = `${enemyDef.name} ${String.fromCharCode(64 + letterCounts[typeChar])}`; enemies.push({ id: `enemy-${enemies.length + 1}`, name: enemyName, type: enemyDef.name, archetype: enemyDef.archetype, level: wave, maxHp: finalStats.hp, currentHp: finalStats.hp, maxMp: finalStats.mp, currentMp: finalStats.mp, str: finalStats.str, def: finalStats.def, int: finalStats.int, mnd: finalStats.mnd, isAlive: true, statusEffects: [], abilities: enemyDef.abilities || [], getCurrentStat(sN) { return this[sN]; }, actsTwice: false }); } } return enemies; }
    // Modified calculateEnemyStats function to limit HP growth to 8% per wave
// and add +5 stat growth to Str, Def, Int, and Mnd every 15 rounds
function calculateEnemyStats(wave) { 
    let hp = 15, mp = 10, s = 4, d = 4, i = 4, m = 4; 
    
    // Calculate how many bonus +5 increments should be applied (every 15 waves)
    const bonusIncrements = Math.floor((wave - 1) / 15);
    
    for (let n = 1; n < wave; n++) { 
        hp = Math.round(hp * 1.08); 
        mp = Math.round(mp * 1.12); 
        s++; 
        d++; 
        i++; 
        m++; 
    }
    
    // Apply the bonus stat increments (+5 every 15 waves)
    s += bonusIncrements * 5;
    d += bonusIncrements * 5;
    i += bonusIncrements * 5;
    m += bonusIncrements * 5;
    
    return { hp, mp, str: s, def: d, int: i, mnd: m }; 
}
    function prepareCommandPhase() { if (gameState.currentState !== 'PLAYER_COMMAND') return; let found = false; let startIdx = gameState.activeCharacterIndex; for (let i = 0; i < gameState.party.length; i++) { let checkIdx = (startIdx + i) % gameState.party.length; const char = gameState.party[checkIdx]; if (char.isAlive && !gameState.actionQueue.some(item => item.actorId === char.id)) { gameState.activeCharacterIndex = checkIdx; found = true; break; } } if (found) { const char = gameState.party[gameState.activeCharacterIndex]; gameState.addLogMessage(`--- ${char.name}, command? ---`); populateMenu('main'); highlightActivePartyStatus(gameState.activeCharacterIndex); document.getElementById('action-menu-area').style.display = 'flex'; } else { console.log("Player commands done."); queueEnemyActions(); } }
    function queueAction(actorId, actionDetails) { 
        const actor = gameState.getCharacterById(actorId) || gameState.getEnemyById(actorId); 
        if (!actor) return; 
        if (actionDetails.type === 'Rage' && actor.className === 'Barbarian') { 
            actor.isRaging = true; 
            console.log(`${actor.name} is now Raging (flag set on queue).`); 
        } 
        gameState.actionQueue.push({ actorId: actorId, action: { ...actionDetails } }); 
        console.log(`Queued for ${actorId}:`, actionDetails); 
        gameState.addLogMessage(`${actor?.name || actorId} prepares ${actionDetails.type}${actionDetails.powerName ? '(' + actionDetails.powerName + ')' : ''}...`); 
    }
    
    // --- Updated queueEnemyActions function to handle the new enemy abilities
    function queueEnemyActions() { 
        console.log("Queueing Enemy Actions"); 
        gameState.enemies.forEach(enemy => { 
            if (enemy.isAlive) { 
                const alivePlayers = gameState.party.filter(p => p.isAlive); 
                if (alivePlayers.length > 0) { 
                    let actionsToQueue = []; 
                    const targetPlayer = alivePlayers[Math.floor(Math.random() * alivePlayers.length)]; 
                    
                    if (enemy.type.includes('Dragon')) { 
                        actionsToQueue.push({ type: 'DragonBreath', casterId: enemy.id, targets: [] }); 
                        actionsToQueue.push({ type: 'Attack', casterId: enemy.id, targets: [targetPlayer.id] }); 
                    } 
                    else if (enemy.archetype === 'Bruiser') { 
                        let usedAbility = false; 
                        if (enemy.abilities?.length > 0) { 
                            const ability = enemy.abilities[0]; 
                            if (Math.random() < (ability.chance || 0)) { 
                                actionsToQueue.push({ 
                                    type: 'BruiserAbility', 
                                    abilityName: ability.name, 
                                    casterId: enemy.id, 
                                    targets: [targetPlayer.id] 
                                }); 
                                usedAbility = true; 
                                console.log(`${enemy.name} prepares ${ability.name}`); 
                            } 
                        } 
                        if (!usedAbility) { 
                            actionsToQueue.push({ type: 'Attack', casterId: enemy.id, targets: [targetPlayer.id] }); 
                        } 
                    } 
                    else if (enemy.archetype === 'Caster') { 
                        let usedAbility = false; 
                        if (enemy.abilities?.length > 0) { 
                            const casterAbility = enemy.abilities[0]; 
                            
                            if (casterAbility.type === 'Orison') {
                                const orisonData = ORISONS[casterAbility.name];
                                if (orisonData && enemy.currentMp >= orisonData.mpCost && Math.random() < (casterAbility.chance || 0)) { 
                                    actionsToQueue.push({ 
                                        type: 'Orison', 
                                        orisonName: casterAbility.name, 
                                        casterId: enemy.id, 
                                        targets: [targetPlayer.id] 
                                    }); 
                                    usedAbility = true; 
                                    console.log(`${enemy.name} prepares ${casterAbility.name} orison`); 
                                }
                            }
                        } 
                        if (!usedAbility) { 
                            actionsToQueue.push({ type: 'Attack', casterId: enemy.id, targets: [targetPlayer.id] }); 
                        } 
                    } 
                    else { // Weaklings or any other type
                        actionsToQueue.push({ type: 'Attack', casterId: enemy.id, targets: [targetPlayer.id] }); 
                    } 
                    
                    actionsToQueue.forEach(action => queueAction(enemy.id, action)); 
                } 
            } 
        }); 
        startActionResolution(); 
    }

    function startActionResolution() { 
        console.log("Start Action Resolution"); 
        if (gameState.actionQueue.length === 0) { 
            endRound(); 
            return; 
        } 
        gameState.setState('ACTION_RESOLUTION'); 
        gameState.actionQueue.forEach(i => { 
            i.speedRoll = Math.floor(Math.random() * 100); 
        }); 
        gameState.actionQueue.sort((a, b) => { 
            const actorA = gameState.getCharacterById(a.actorId) || gameState.getEnemyById(a.actorId); 
            const actorB = gameState.getCharacterById(b.actorId) || gameState.getEnemyById(b.actorId); 
            const aIsDragon = actorA?.type?.includes('Dragon'); 
            const bIsDragon = actorB?.type?.includes('Dragon'); 
            if (aIsDragon && !bIsDragon) return -1; 
            if (!aIsDragon && bIsDragon) return 1; 
            if (b.speedRoll !== a.speedRoll) return b.speedRoll - a.speedRoll; 
            const aP = !!actorA && !!gameState.getCharacterById(a.actorId); 
            const bP = !!actorB && !!gameState.getCharacterById(b.actorId); 
            if (aP && !bP) return 1; 
            if (!aP && bP) return -1; 
            if (!aP && !bP) { 
                const iA = gameState.enemies.findIndex(e => e.id === a.actorId); 
                const iB = gameState.enemies.findIndex(e => e.id === b.actorId); 
                return iA - iB; 
            } 
            return 0; 
        }); 
        console.log("Sorted Queue:", gameState.actionQueue.map(i => `${i.actorId}(${i.speedRoll})`)); 
        executeNextQueuedAction(); 
    }
    
    // --- Updated executeNextQueuedAction function to handle new action types
   function executeNextQueuedAction() {
    if (gameState.currentState !== 'ACTION_RESOLUTION') {
        console.warn("Wrong state for action exec.");
        gameState.actionQueue = [];
        return;
    }
    
    if (gameState.actionQueue.length === 0) {
        console.log("Queue empty.");
        endRound();
        return;
    }
    
    const item = gameState.actionQueue.shift();
    const actorId = item.actorId;
    const action = item.action;
    const actor = gameState.getCharacterById(actorId) || gameState.getEnemyById(actorId);
    
    if (!actor || !actor.isAlive) {
        console.log(`${actorId} skipped (KO'd).`);
        setTimeout(executeNextQueuedAction, 50);
        return;
    }
    
    let canAfford = true;
    let cost = 0;
    const isPlayerActor = !!gameState.getCharacterById(actorId);
    
    if (action.type === 'Spell' || action.type === 'Prayer') {
        cost = action.powerCost || POWER_DATA[action.powerName]?.cost || 0;
    }
    else if (action.type === 'Orison') {
        cost = ORISONS[action.orisonName]?.mpCost || 0;
    }
    
    if (cost > 0) {
        // CHANGED: Now deducting MP costs for both player and enemy actors here
        if (actor.currentMp < cost) {
            canAfford = false;
        } else {
            actor.currentMp -= cost;
            if (isPlayerActor) {
                // Update UI to reflect the MP change
                updatePartyStatusUI();
            }
        }
        
        if (!canAfford) {
            gameState.addLogMessage(`${actor.name} doesn't have enough MP for ${action.powerName || action.orisonName || action.type}!`);
            setTimeout(executeNextQueuedAction, 50);
            return;
        }
    }
    
    console.log(`Executing for ${actorId}:`, action);
    
    let announceText = action.powerName || action.abilityName || action.orisonName || action.type;
    let announceDur = 1500;
    const actorSpriteId = getCorrectElementId(actorId);
    
    switch (action.type) {
        case 'Attack':
            announceText = 'Attack';
            announceDur = 600;
            flashSprite(actorSpriteId);
            break;
            
        case 'Rage':
            announceText = 'Rage';
            announceDur = 600;
            shimmerSprite(actorSpriteId, 'red', 600);
            break;
            
        case 'Spell':
            shimmerSprite(actorSpriteId, 'purple', 1400);
            break;
            
        case 'Prayer':
            shimmerSprite(actorSpriteId, 'gold', 1400);
            break;
            
        case 'Orison':
            announceText = action.orisonName || "Orison";
            announceDur = 1000;
            shimmerSprite(actorSpriteId, 'purple', 1400);
            break;
            
        case 'BruiserAbility':
            announceText = action.abilityName || "Special Attack";
            announceDur = 800;
            shimmerSprite(actorSpriteId, 'cyan', 600);
            break;
            
        case 'DragonBreath':
            announceText = "Dragon Breath";
            announceDur = 1600;
            shimmerSprite(actorSpriteId, 'cyan', 1400);
            break;
    }
    
    showActionAnnouncement(announceText, announceDur);
    gameState.addLogMessage(`-- ${actor.name}'s action --`);
    
    let primaryTarget = null;
    let finalTargets = [];
    let redirectionNeeded = false;
    
    if (action.targets && action.targets.length > 0) {
        let initialTargets = action.targets.map(id => gameState.getCharacterById(id) || gameState.getEnemyById(id)).filter(t => t);
        
        if (action.targets.length === 1) {
            primaryTarget = initialTargets[0];
            const isRevive = (action.type === 'Prayer' && action.powerName === 'Revive');
            
            if (!primaryTarget || (isRevive && primaryTarget.isAlive) || (!isRevive && !primaryTarget.isAlive)) {
                gameState.addLogMessage(`${actor.name}'s original target invalid!`);
                redirectionNeeded = true;
                primaryTarget = null;
            } else {
                finalTargets = [primaryTarget];
            }
            
            if (redirectionNeeded) {
                if (action.type === 'Attack' || action.type === 'Rage' || 
                    action.type === 'BruiserAbility' ||
                    action.type === 'Orison' ||
                    (action.type === 'Spell' && POWER_DATA[action.powerName]?.target === 'enemy')) {
                    
                    const livingEnemies = gameState.enemies.filter(e => e.isAlive);
                    if (livingEnemies.length > 0) {
                        primaryTarget = livingEnemies[Math.floor(Math.random() * livingEnemies.length)];
                        finalTargets = [primaryTarget];
                        gameState.addLogMessage(`Redirecting to ${primaryTarget.name}!`);
                    } else {
                        finalTargets = [];
                    }
                } else if (action.type === 'Prayer' && !isRevive) {
                    const livingAllies = gameState.party.filter(p => p.isAlive && p.id !== actorId);
                    if (livingAllies.length > 0) {
                        primaryTarget = livingAllies[Math.floor(Math.random() * livingAllies.length)];
                        finalTargets = [primaryTarget];
                        gameState.addLogMessage(`Redirecting ${action.powerName} to ${primaryTarget.name}!`);
                    } else if (actor.isAlive && isPlayerActor) {
                        primaryTarget = actor;
                        finalTargets = [primaryTarget];
                        gameState.addLogMessage(`Redirecting ${action.powerName} to self!`);
                    } else {
                        finalTargets = [];
                    }
                }
            }
        } else {
            const pInfo = POWER_DATA[action.powerName];
            if (pInfo?.target === 'enemies') {
                finalTargets = gameState.enemies.filter(e => e.isAlive);
            } else if (pInfo?.target === 'allies') {
                finalTargets = gameState.party.filter(p => p.isAlive);
            } else {
                finalTargets = initialTargets.filter(t => t.isAlive);
            }
            
            if (finalTargets.length === 0)
                gameState.addLogMessage(pInfo?.target === 'enemies' ? "No enemies remain!" : "No allies remain!");
        }
    }
    
    let skipAction = false;
    if ((action.type === 'Attack' || action.type === 'Rage' || action.type === 'Prayer' || 
         action.type === 'BruiserAbility' || action.type === 'Orison' ||
        (action.type === 'Spell' && POWER_DATA[action.powerName]?.target !== 'enemies' && 
         POWER_DATA[action.powerName]?.target !== 'allies')) && 
        finalTargets.length === 0 && action.targets?.length > 0) {
        
        gameState.addLogMessage(`Action fails - no valid targets found.`);
        skipAction = true;
    }
    
    if (skipAction) {
        setTimeout(executeNextQueuedAction, 50);
        return;
    } else {
        switch (action.type) {
            case 'Attack':
            case 'Rage':
                performAttack(actor, primaryTarget);
                break;
                
            case 'Spell':
            case 'Prayer':
                performPower(actor, action.powerName, finalTargets);
                break;
                
            case 'Orison':
                performOrison(actor, action.orisonName, finalTargets);
                break;
                
            case 'BruiserAbility':
                performBruiserAbility(actor, action.abilityName, primaryTarget);
                break;
                
            case 'DragonBreath':
                performDragonBreath(actor);
                break;
                
            default:
                console.error(`Unhandled type: ${action.type}`);
        }
    }
    
    const delay = Math.max(800, announceDur + 100);
    setTimeout(executeNextQueuedAction, delay);
}

    // --- New function to handle Orison casting by enemy Casters
    function performOrison(caster, orisonName, targets) {
        const orison = ORISONS[orisonName];
        if (!orison) {
            console.error(`Unknown orison: ${orisonName}`);
            return;
        }
        
        // Targets should already be checked by executeNextQueuedAction
        const allTargets = gameState.party.filter(p => p.isAlive);
    
        if (allTargets.length === 0) {
            gameState.addLogMessage(`${caster.name}'s ${orisonName} finds no targets!`);
            return;
        }
        
        gameState.addLogMessage(`${caster.name} casts ${orisonName} on all party members!`);
        
        // Apply damage to primary target
        const target = targets[0];
        const targetElementId = getCorrectElementId(target.id);
        
        // Show visual effect based on element
        let effectColor;
        switch(orison.element) {
            case 'Fire': effectColor = 'orange'; break;
            case 'Frost': effectColor = 'aqua'; break;
            case 'Hydro': effectColor = 'blue'; break;
            case 'Shock': effectColor = 'yellow'; break;
            default: effectColor = 'purple';
        }
        
        // Show a shimmer effect on the caster
    shimmerSprite(getCorrectElementId(caster.id), effectColor, 500);
    
    // Apply damage to each target with slight delay between hits
    allTargets.forEach((target, index) => {
        setTimeout(() => {
            const targetElementId = getCorrectElementId(target.id);
            
            // Flash the target
            flashSprite(targetElementId, effectColor, 250);
            
            // Calculate and apply damage
            const damage = calculateOrisonDamage(caster, target);
            
            setTimeout(() => {
                showFloatingNumber(targetElementId, damage, 'damage');
                gameState.addLogMessage(`${target.name} takes ${damage} ${orison.element} damage!`);
                
                // Apply the damage
                target.takeDamage(damage);
                
                // Update UI
                updatePartyStatusUI();
                
                // Check lose condition after each hit
                if (checkLoseCondition()) handleGameOver();
                
            }, 150 + (index * 50));
        }, index * 300); // Stagger the hits for visual effect
    });
}

    // --- Function for Bruiser abilities with HP-based damage bonus
    function performBruiserAbility(caster, abilityName, target) {
        if (!target || !target.isAlive) {
            gameState.addLogMessage(`${caster.name}'s ${abilityName} has no valid target!`);
            return;
        }
        
        const targetElementId = getCorrectElementId(target.id);
        
        // Calculate base physical damage
        const baseDamage = calculatePhysicalDamage(caster, target);
        
        // Add 10% of bruiser's max HP as additional damage
        const hpBonus = Math.round(caster.maxHp * 0.1);
        const totalDamage = baseDamage + hpBonus;
        
        gameState.addLogMessage(`${caster.name} uses ${abilityName}!`);
        flashSprite(targetElementId, 'crimson', 200);
        
        setTimeout(() => {
            showFloatingNumber(targetElementId, totalDamage, 'damage');
            gameState.addLogMessage(`${target.name} takes ${totalDamage} damage (${baseDamage} + ${hpBonus})!`);
            
            let wasKO = !target.isAlive;
            if ('takeDamage' in target) {
                target.takeDamage(totalDamage);
                updatePartyStatusUI();
            } else {
                target.currentHp -= totalDamage;
                if (target.currentHp <= 0) {
                    target.currentHp = 0;
                    target.isAlive = false;
                    if (!wasKO) gameState.addLogMessage(`${target.name} defeated!`);
                }
                updateEnemySpritesUI();
            }
            
            // Check win/lose conditions
            if (checkWinCondition()) handleWinWave();
            if (checkLoseCondition()) handleGameOver();
        }, 200);
    }

    function performAttack(c, t) { 
    if (!c || !t || !t.isAlive) return; 
    
    // Get attack message based on rage state
    gameState.addLogMessage(`${c.name} ${c.isRaging ? 'rages at' : 'attacks'} ${t.name}!`); 
    
    const isPlayerTarget = !!gameState.getCharacterById(t.id); 
    const targetElementId = getCorrectElementId(t.id); 
    const actorElementId = getCorrectElementId(c.id);
    
    // Apply flash effect on actor and then target
    flashSprite(actorElementId, 'white', 100);
    setTimeout(() => {
        // Apply flash effect
        flashSprite(targetElementId, 'white', 150); 
    }, 150);
    
    // Get base damage
    let dmg = calculatePhysicalDamage(c, t); 
    
    // Apply Empower buff damage multiplier if present
    const empowerBuff = c.statusEffects.find(e => e.type === 'Empower1' || e.type === 'Empower2');
    if (empowerBuff && empowerBuff.damageMultiplier) {
        dmg = Math.round(dmg * empowerBuff.damageMultiplier);
        gameState.addLogMessage(`${c.name}'s attack is empowered! (x${empowerBuff.damageMultiplier})`);
    }
    
    // Apply damage with a slight delay
    setTimeout(() => { 
        showFloatingNumber(targetElementId, dmg, 'damage'); 
        
        let actualDamageTaken;
        if (isPlayerTarget) { 
            actualDamageTaken = t.takeDamage(dmg); 
        } else { 
            t.currentHp -= dmg; 
            actualDamageTaken = dmg; 
            if (t.currentHp <= 0) t.currentHp = 0; 
            t.isAlive = t.currentHp > 0; 
        } 
        
        gameState.addLogMessage(`${t.name} takes ${actualDamageTaken} damage.`); 
        
        // Process Lifelink buff if present
        const lifelinkBuff = c.statusEffects.find(e => e.type === 'Lifelink');
        if (lifelinkBuff && lifelinkBuff.healPercent && c.isAlive) {
            const healAmount = Math.round(actualDamageTaken * lifelinkBuff.healPercent);
            if (healAmount > 0) {
                c.heal(healAmount);
                showFloatingNumber(actorElementId, healAmount, 'heal');
                gameState.addLogMessage(`${c.name} absorbs ${healAmount} HP!`);
            }
        }
        
        // Update UI elements
        const e = document.getElementById(targetElementId); 
        if (!t.isAlive) { 
            gameState.addLogMessage(`${t.name} defeated!`); 
            if (e) { 
                e.classList.add('ko'); 
                e.title = `${t.name}(HP:0/${t.maxHp})`; 
            } 
        } else { 
            if (e) e.title = `${t.name}(HP:${t.currentHp}/${t.maxHp})`; 
        } 
        
        updateEnemySpritesUI(); 
        updatePartyStatusUI(); 
        highlightActivePartyStatus(-1);
        
        // Modified fury attack section (to be integrated in the performAttack function)
        // Process Fury buff (double attack) after a delay
        const furyBuff = c.statusEffects.find(e => e.type === 'Fury');
        if (furyBuff && c.isAlive && t.isAlive) {
            setTimeout(() => {
                // Show a fury action announcement before the second attack
                showActionAnnouncement(`Fury Attack`, 1000, 'fury');
                gameState.addLogMessage(`${c.name}'s Fury triggers a second attack!`);
                
                // Flash the attacker sprite with red to indicate fury attack
                flashSprite(actorElementId, 'crimson', 200);
                
                setTimeout(() => {
                    // Calculate second attack damage (without applying rage bonus again)
                    let wasRaging = c.isRaging;
                    if (wasRaging) c.isRaging = false; // Temporarily disable rage for calculation
                    
                    let dmg2 = calculatePhysicalDamage(c, t);
                    
                    // Restore rage state
                    if (wasRaging) c.isRaging = true;
                    
                    // Apply Empower buff to second attack too
                    if (empowerBuff && empowerBuff.damageMultiplier) {
                        dmg2 = Math.round(dmg2 * empowerBuff.damageMultiplier);
                    }
                    
                    // Flash target and apply second hit
                    flashSprite(targetElementId, 'crimson', 200);
                    
                    setTimeout(() => {
                        showFloatingNumber(targetElementId, dmg2, 'damage');
                        
                        let actualDamage2;
                        if (isPlayerTarget) {
                            actualDamage2 = t.takeDamage(dmg2);
                        } else {
                            t.currentHp -= dmg2;
                            actualDamage2 = dmg2;
                            if (t.currentHp <= 0) t.currentHp = 0;
                            t.isAlive = t.currentHp > 0;
                        }
                        
                        gameState.addLogMessage(`${t.name} takes ${actualDamage2} additional damage!`);
                        
                        // Apply Lifelink to second attack too
                        if (lifelinkBuff && lifelinkBuff.healPercent && c.isAlive) {
                            const healAmount = Math.round(actualDamage2 * lifelinkBuff.healPercent);
                            if (healAmount > 0) {
                                c.heal(healAmount);
                                showFloatingNumber(actorElementId, healAmount, 'heal');
                                gameState.addLogMessage(`${c.name} absorbs ${healAmount} more HP!`);
                            }
                        }
                        
                        // Update UI after second hit
                        updateEnemySpritesUI();
                        updatePartyStatusUI();
                        
                        // Check win/lose conditions after second hit
                        if (checkWinCondition()) handleWinWave();
                        if (checkLoseCondition()) handleGameOver();
                        
                    }, 200);
                    
                }, 300); // Delay for fury announcement
                
            }, 800); // Increased delay between attacks for better visualization
        }
        
        // Check win/lose conditions
        if (checkWinCondition()) handleWinWave();
        if (checkLoseCondition()) handleGameOver();
        
    }, 300);
}
     function performRage(c) { /* Effect handled elsewhere */ console.log(`${c.name} executing Rage action.`); updatePartyStatusUI(); highlightActivePartyStatus(-1); }
  function performPower(c, pN, resolvedTargets) { 
    const p = POWER_DATA[pN]; 
    if (!p) return; 
    
    gameState.addLogMessage(`${c.name} casts ${pN}!`); 
    
    if (resolvedTargets.length === 0 && (p.target === 'ally' || p.target === 'ally_ko' || p.target === 'enemy')) { 
        gameState.addLogMessage(`No valid targets remain.`); 
        highlightActivePartyStatus(-1); 
        return; 
    } 
    
    resolvedTargets.forEach(t => { 
        if (!t) return; 
        const targetElementId = getCorrectElementId(t.id); 
        
        if (p.element) { 
            const dmg = calculateMagicDamage(c, t, p.level); 
            setTimeout(() => { 
                showFloatingNumber(targetElementId, dmg, 'damage'); 
                gameState.addLogMessage(`${t.name} takes ${dmg} ${p.element} dmg.`); 
                
                let damageApplied = false; 
                if ('takeDamage' in t) { 
                    t.takeDamage(dmg); 
                    damageApplied = true; 
                    updatePartyStatusUI(); 
                } else { 
                    t.currentHp -= dmg; 
                    if (t.currentHp <= 0) { 
                        t.currentHp = 0; 
                        t.isAlive = false; 
                        gameState.addLogMessage(`${t.name} defeated!`); 
                    } 
                    damageApplied = true; 
                    updateEnemySpritesUI(); 
                } 
                
                if (damageApplied) { 
                    highlightActivePartyStatus(-1); 
                    if (checkWinCondition()) handleWinWave(); 
                    if (checkLoseCondition()) handleGameOver(); 
                } 
            }, 300); 
        } 
        else if (p.effect === 'Heal') { 
            let healAmount; 
            if (pN === 'Heal1') healAmount = calculateHeal1Amount(c); 
            else healAmount = calculateHealing(c, p.level); 
            
            const hd = t.heal(healAmount); 
            if (hd > 0) showFloatingNumber(targetElementId, hd, 'heal'); 
            gameState.addLogMessage(`${t.name} +${hd} HP.`); 
            updatePartyStatusUI(); 
            highlightActivePartyStatus(-1); 
        } 
        else if (p.effect === 'Revive') { 
            if (!t.isAlive) { 
                t.isAlive = true; 
                const hp = Math.round(t.maxHp * p.hpPercent); 
                t.heal(hp); 
                showFloatingNumber(targetElementId, hp, 'heal'); 
                gameState.addLogMessage(`${t.name} revived!`); 
                updatePartyStatusUI(); 
            } else { 
                gameState.addLogMessage(`${t.name} alive.`); 
            } 
            highlightActivePartyStatus(-1); 
        } 
        else if (p.effect === 'Poison' || p.effect === 'Slow') { 
            const ch = p.chance || 1.0; 
            if (Math.random() < ch) { 
                const dur = p.duration || 5; 
                if ('addStatus' in t) { 
                    const suc = t.addStatus({ type: p.effect, turns: dur }); 
                    if (suc) gameState.addLogMessage(`${t.name} gets ${p.effect}!`); 
                    else gameState.addLogMessage(`${t.name} resists.`); 
                    updatePartyStatusUI(); 
                } else if (t.statusEffects) { 
                    if (!t.statusEffects.some(s => s.type === p.effect)) { 
                        t.statusEffects.push({ type: p.effect, turns: dur }); 
                        gameState.addLogMessage(`${t.name} gets ${p.effect}!`); 
                    } else gameState.addLogMessage(`${t.name} resists.`); 
                } 
            } else { 
                gameState.addLogMessage(`${t.name} resists.`); 
            } 
            highlightActivePartyStatus(-1); 
        } 
        else if (p.effect === 'Empower') { 
            const statusName = p.statusName;
            const damageMultiplier = p.damageMultiplier || 1.5;
            
            const hadBuff = t.statusEffects.some(s => s.type === statusName);
            
            const suc = t.addStatus({ 
                type: statusName, 
                turns: p.turns || 4, 
                isPhysicalBuff: true,
                damageMultiplier: damageMultiplier,
                visualEffect: 'active'
            }); 
            
            if (suc) {
                if (hadBuff) {
                    gameState.addLogMessage(`${t.name}'s ${statusName} refreshed! (Damage x${damageMultiplier})`);
                } else {
                    gameState.addLogMessage(`${t.name} empowered! (Damage x${damageMultiplier})`);
                }
                shimmerSprite(getCorrectElementId(t.id), 'white', 1200);
            }
            updatePartyStatusUI(); 
            highlightActivePartyStatus(-1); 
        }
        else if (p.effect === 'Fury') { 
            const hadBuff = t.statusEffects.some(s => s.type === p.statusName);
            
            const suc = t.addStatus({ 
                type: p.statusName, 
                turns: p.turns || 4, 
                isPhysicalBuff: true,
                doubleAttack: true,
                visualEffect: 'active'
            }); 
            
            if (suc) {
                if (hadBuff) {
                    gameState.addLogMessage(`${t.name}'s Fury refreshed! (Double attack)`);
                } else {
                    gameState.addLogMessage(`${t.name} gains Fury! (Double attack)`);
                }
                shimmerSprite(getCorrectElementId(t.id), '#FF8080', 1200);
            }
            updatePartyStatusUI(); 
            highlightActivePartyStatus(-1); 
        }
        else if (p.effect === 'Lifelink') { 
            const healPercent = p.healPercent || 0.5;
            
            const hadBuff = t.statusEffects.some(s => s.type === p.statusName);
            
            const suc = t.addStatus({ 
                type: p.statusName, 
                turns: p.turns || 4, 
                isPhysicalBuff: true,
                lifeStealPercent: healPercent,
                visualEffect: 'active'
            }); 
            
            if (suc) {
                if (hadBuff) {
                    gameState.addLogMessage(`${t.name}'s Lifelink refreshed! (${Math.round(healPercent * 100)}% life steal)`);
                } else {
                    gameState.addLogMessage(`${t.name} gains Lifelink! (${Math.round(healPercent * 100)}% life steal)`);
                }
                shimmerSprite(getCorrectElementId(t.id), '#80FF80', 1200);
            }
            updatePartyStatusUI(); 
            highlightActivePartyStatus(-1); 
        }
        else if (p.effect === 'Restore') { 
            const ch = p.chance || 1.0; 
            if (Math.random() < ch) { 
                let rem = false; 
                if ('clearNegativeStatuses' in t) { 
                    rem = t.clearNegativeStatuses(); 
                } else if (t.statusEffects) { 
                    const len = t.statusEffects.length; 
                    t.statusEffects = t.statusEffects.filter(s => !['Poison', 'Slow'].includes(s.type)); 
                    rem = t.statusEffects.length < len; 
                } 
                if (rem) gameState.addLogMessage(`${t.name}'s ailments fade.`); 
                else gameState.addLogMessage(`${pN} no effect.`); 
                if ('clearNegativeStatuses' in t) updatePartyStatusUI(); 
            } else { 
                gameState.addLogMessage(`${pN} no effect.`); 
            } 
            highlightActivePartyStatus(-1); 
        }
else if (p.effect === 'Restore') { const ch = p.chance || 1.0; if (Math.random() < ch) { let rem = false; if ('clearNegativeStatuses' in t) { rem = t.clearNegativeStatuses(); } else if (t.statusEffects) { const len = t.statusEffects.length; t.statusEffects = t.statusEffects.filter(s => !['Poison', 'Slow'].includes(s.type)); rem = t.statusEffects.length < len; } if (rem) gameState.addLogMessage(`${t.name}'s ailments fade.`); else gameState.addLogMessage(`${pN} no effect.`); if ('clearNegativeStatuses' in t) updatePartyStatusUI(); } else { gameState.addLogMessage(`${pN} no effect.`); } highlightActivePartyStatus(-1); } }); }
    function performDragonBreath(c) { gameState.addLogMessage(`${c.name} uses Dragon Breath!`); const targets = gameState.party.filter(p => p.isAlive); targets.forEach(t => { const dmg = Math.round(t.maxHp * 0.25); const targetElementId = getCorrectElementId(t.id); setTimeout(() => { showFloatingNumber(targetElementId, dmg, 'damage'); gameState.addLogMessage(`${t.name} takes ${dmg} breath dmg!`); t.takeDamage(dmg); updatePartyStatusUI(); highlightActivePartyStatus(-1); if (checkLoseCondition()) handleGameOver(); }, 100); }); }
    function endRound() { console.log("Round End."); gameState.actionQueue = []; if (checkWinCondition()) { handleWinWave(); return; } if (checkLoseCondition()) { handleGameOver(); return; } processEndOfRound(); if (checkWinCondition()) { handleWinWave(); return; } if (checkLoseCondition()) { handleGameOver(); return; } gameState.activeCharacterIndex = 0; gameState.setState('PLAYER_COMMAND'); prepareCommandPhase(); }
    function processEndOfRound() { 
        console.log("EOR Effects..."); 
        let needsUpdate = false; 
    
        gameState.party.forEach(c => { 
        if (!c.isAlive) return; 
        
        let poisonDmg = 0; 
        const remove = []; 
        
        c.statusEffects.forEach(e => { 
            if (e.turns !== undefined) e.turns--; 
            
            if (e.type === 'Poison' && e.turns >= 0) {
                poisonDmg = Math.max(1, Math.round(c.maxHp * 0.05)); 
            }
                
            if (e.turns < 0) { 
                remove.push(e.type); 
                
                // Add descriptive message for buff expiration
                if (e.type === 'Empower1' || e.type === 'Empower2') {
                    gameState.addLogMessage(`${c.name}'s Empower wore off.`);
                } 
                else if (e.type === 'Fury') {
                    gameState.addLogMessage(`${c.name}'s Fury subsided.`);
                }
                else if (e.type === 'Lifelink') {
                    gameState.addLogMessage(`${c.name}'s Lifelink broke.`);
                }
                else {
                    gameState.addLogMessage(`${c.name}'s ${e.type} wore off.`);
                }
                
                needsUpdate = true; 
                
                // Remove visual effects when buff expires
                const spriteElement = document.getElementById(getCorrectElementId(c.id + "-sprite"));
                if (spriteElement) {
                    if (e.type === 'Empower1' || e.type === 'Empower2') {
                        spriteElement.classList.remove('empower-buffed', 'empower-pulse');
                    }
                    else if (e.type === 'Fury') {
                        spriteElement.classList.remove('fury-buffed', 'fury-pulse');
                    }
                    else if (e.type === 'Lifelink') {
                        spriteElement.classList.remove('lifelink-buffed', 'lifelink-pulse');
                    }
                    
                    // Check if any buffs remain
                    const stillHasBuffs = c.statusEffects.some(s => 
                        (s.type === 'Empower1' || s.type === 'Empower2' || 
                         s.type === 'Fury' || s.type === 'Lifelink') && 
                        s.turns >= 0
                    );
                    
                    if (!stillHasBuffs) {
                        spriteElement.classList.remove('buffed');
                    }
                }
            } 
        }); 
        
        remove.forEach(t => c.removeStatus(t)); 
        
        if (poisonDmg > 0) { 
            gameState.addLogMessage(`${c.name} takes ${poisonDmg} poison!`); 
            const elementId = getCorrectElementId(c.id); 
            showFloatingNumber(elementId, poisonDmg, 'damage'); 
            c.takeDamage(poisonDmg); 
            needsUpdate = true; 
        } 
        
        if (c.isRaging) { 
            c.isRaging = false; 
            gameState.addLogMessage(`${c.name}'s rage ends.`); 
            needsUpdate = true; 
        } 
    }); 
    
    gameState.enemies.forEach(e => { 
        if (!e.isAlive) return; 
        
        let poisonDmg = 0; 
        const remove = []; 
        
        e.statusEffects.forEach(ef => { 
            if (ef.turns !== undefined) ef.turns--; 
            if (ef.type === 'Poison' && ef.turns >= 0) poisonDmg = Math.max(1, Math.round(e.maxHp * 0.05)); 
            if (ef.turns < 0) remove.push(ef.type); 
        }); 
        
        remove.forEach(t => { 
            e.statusEffects = e.statusEffects.filter(s => s.type !== t); 
        }); 
        
        if (poisonDmg > 0) { 
            gameState.addLogMessage(`${e.name} takes ${poisonDmg} poison!`); 
            showFloatingNumber(e.id, poisonDmg, 'damage'); 
            e.currentHp -= poisonDmg; 
            if (e.currentHp <= 0) { 
                e.currentHp = 0; 
                e.isAlive = false; 
                gameState.addLogMessage(`${e.name} succumbed!`); 
            } 
            needsUpdate = true; 
        } 
    }); 
    
    if (needsUpdate) { 
        updatePartyStatusUI(); 
        updateEnemySpritesUI(); 
        if (checkLoseCondition()) handleGameOver(); 
        if (checkWinCondition()) handleWinWave(); 
    } 
}

    // --- Win/Loss/Reward/Tavern Handlers ---
    function decrementAllBuffDurations() {
    gameState.party.forEach(c => {
        if (!c.isAlive) return;
        
        const remove = [];
        c.statusEffects.forEach(e => {
            if (e.turns !== undefined) {
                e.turns--;
                
                if (e.turns < 0) {
                    remove.push(e.type);
                    
                    // Add descriptive message for buff expiration
                    if (e.type === 'Empower1' || e.type === 'Empower2') {
                        gameState.addLogMessage(`${c.name}'s Empower wore off.`);
                    } 
                    else if (e.type === 'Fury') {
                        gameState.addLogMessage(`${c.name}'s Fury subsided.`);
                    }
                    else if (e.type === 'Lifelink') {
                        gameState.addLogMessage(`${c.name}'s Lifelink broke.`);
                    }
                    else {
                        gameState.addLogMessage(`${c.name}'s ${e.type} wore off.`);
                    }
                    
                    // Remove visual effects when buff expires
                    const spriteElement = document.getElementById(getCorrectElementId(c.id + "-sprite"));
                    if (spriteElement) {
                        if (e.type === 'Empower1' || e.type === 'Empower2') {
                            spriteElement.classList.remove('empower-buffed', 'empower-pulse');
                        }
                        else if (e.type === 'Fury') {
                            spriteElement.classList.remove('fury-buffed', 'fury-pulse');
                        }
                        else if (e.type === 'Lifelink') {
                            spriteElement.classList.remove('lifelink-buffed', 'lifelink-pulse');
                        }
                        
                        // Check if any buffs remain
                        const stillHasBuffs = c.statusEffects.some(s => 
                            (s.type === 'Empower1' || s.type === 'Empower2' || 
                             s.type === 'Fury' || s.type === 'Lifelink') && 
                            s.turns >= 0
                        );
                        
                        if (!stillHasBuffs) {
                            spriteElement.classList.remove('buffed');
                        }
                    }
                }
            }
        });
        
        remove.forEach(t => c.removeStatus(t));
    });
    
    updatePartyStatusUI();
}
    function checkWinCondition() { 
        return gameState.enemies.length > 0 && gameState.enemies.every(e => !e.isAlive); 
    }
    
    function checkLoseCondition() { 
        return gameState.party.length > 0 && gameState.party.every(p => !p.isAlive); 
    }
    
   function handleWinWave() { 
    gameState.addLogMessage(`Wave ${gameState.currentWave} Cleared!`); 
    console.log(`Wave ${gameState.currentWave} Cleared!`); 
    
    // Process buffs before leveling up characters
    decrementAllBuffDurations();
    
    gameState.party.forEach(c => { 
        if (c.isAlive) c.levelUp(); 
    }); 
    
    updatePartyStatusUI(); 
    
    if (gameState.currentWave % 15 === 0) 
        gameState.setState('TAVERN'); 
    else 
        gameState.setState('BETWEEN_WAVES'); 
}

    
    function handleItemChoice(e) { 
        const iN = e.currentTarget.dataset.item; 
        gameState.addLogMessage(`Chosen: ${iN}`); 
        console.log(`Chosen: ${iN}`); 
        applyItemEffect(iN); 
        gameState.setState('COMBAT_LOADING'); 
        startNextWave(); 
    }
   
    function showItemRewardScreen() { 
    const o = document.getElementById('item-options'); 
    o.innerHTML = ''; 
    
    const i1 = 'Potion'; 
    let i2 = ''; 
    const r = Math.random(); 
    
    if (r < 0.40) i2 = 'Serum'; 
    else if (r < 0.80) { 
        i2 = 'Scroll'; 
    } /*Flasks disabled*/ 
    else i2 = 'Scroll'; 
    
    [i1, i2].forEach(iN => { 
        const b = document.createElement('button'); 
        b.dataset.item = iN; 
        b.textContent = iN; 
        b.addEventListener('click', handleItemChoice); 
        o.appendChild(b); 
    }); 
}
    function applyItemEffect(iN) { 
        switch (iN) { 
            case 'Potion': 
                gameState.party.forEach(c => { 
                    if (c.isAlive) c.heal(Math.round(c.maxHp * 0.20)); 
                }); 
                gameState.addLogMessage("Party +20% HP!"); 
                break; 
                
            case 'Serum': 
                gameState.party.forEach(c => { 
                    if (c.isAlive) c.restoreMp(Math.round(c.maxMp * 0.50)); 
                }); 
                gameState.addLogMessage("Party +50% MP!"); 
                break; 
                
            case 'Fire Flask': 
            case 'Frost Flask': 
            case 'Shock Flask': 
                gameState.addLogMessage(`${iN} disabled.`); 
                break; 
                
             case 'Scroll': 
            let rev = 0; 
            gameState.party.forEach(c => { 
                if (!c.isAlive) { 
                    c.isAlive = true; 
                    // Revive with 33% of max HP instead of just 1 HP
                    const healAmount = Math.round(c.maxHp * 0.33);
                    c.heal(healAmount);
                    } 
                }); 
                gameState.addLogMessage(rev > 0 ? `Scroll revives ${rev}!` : "Scroll no effect."); 
                break; 
        } 
        
        updatePartyStatusUI(); 
    }
    
    function enterTavern() { 
        gameState.addLogMessage("Tavern..."); 
        console.log("Tavern"); 
        
        gameState.party.forEach(c => c.fullRestore()); 
        gameState.addLogMessage("Party restored!"); 
        updatePartyStatusUI(); 
        
        const area = document.getElementById('class-change-area'); 
        area.innerHTML = ''; 
        
        gameState.party.forEach((c, i) => { 
            const d = document.createElement('div'); 
            d.style.marginBottom = '10px'; 
            
            const l = document.createElement('span'); 
            l.textContent = `Char ${i + 1}(${c.name}): `; 
            d.appendChild(l); 
            
            const s = document.createElement('select'); 
            s.id = `class-select-${i + 1}`; 
            s.dataset.characterIndex = i; 
            
            Object.keys(CLASS_DATA).forEach(cN => { 
                const o = document.createElement('option'); 
                o.value = cN; 
                o.textContent = cN; 
                if (cN === c.className) o.selected = true; 
                s.appendChild(o); 
            }); 
            
            d.appendChild(s); 
            area.appendChild(d); 
        }); 
        
        const b = document.getElementById('proceed-button'); 
        b.replaceWith(b.cloneNode(true)); 
        document.getElementById('proceed-button').addEventListener('click', handleTavernProceed); 
    }
    
    function handleTavernProceed() { 
        const sels = document.querySelectorAll('#class-change-area select'); 
        
        sels.forEach(s => { 
            const idx = parseInt(s.dataset.characterIndex); 
            const nCN = s.value; 
            const char = gameState.party[idx]; 
            
            if (char.className !== nCN) { 
                gameState.addLogMessage(`Char ${idx + 1} -> ${nCN}.`); 
                
                const lvl = char.level; 
                gameState.party[idx] = new Character(char.id, nCN); 
                gameState.party[idx].level = 0; 
                
                for (let i = 1; i <= lvl; i++) 
                    gameState.party[idx].applyLevelUpGrowth(i); 
                
                for (let l = 1; l <= lvl; l++) { 
                    if (UNLOCK_SCHEDULE[l]?.[nCN]) 
                        UNLOCK_SCHEDULE[l][nCN].forEach(p => { 
                            if (!gameState.party[idx].powers.includes(p)) 
                                gameState.party[idx].powers.push(p); 
                        }); 
                } 
                
                gameState.party[idx].fullRestore(); 
            } 
        }); 
        
        // Handle background transition between dungeons
        const bgElement = document.getElementById('game-background');
        if (bgElement) {
            const oldDungeonIndex = Math.floor((gameState.currentWave - 1) / 15);
            const newDungeonIndex = Math.floor(gameState.currentWave / 15);
            
            // If we're transitioning to a new dungeon
            if (oldDungeonIndex !== newDungeonIndex) {
                // Apply a fade transition
                bgElement.style.opacity = '0';
                
                setTimeout(() => {
                    // Remove old classes and add new one
                    bgElement.classList.remove('dungeon1-background', 'dungeon2-background', 'dungeon3-background');
                    bgElement.classList.add(`dungeon${newDungeonIndex + 1}-background`);
                    
                    // Fade back in
                    bgElement.style.opacity = '0.9';
                }, 500);
            }
        }
        
        gameState.setState('COMBAT_LOADING'); 
        startNextWave(); 
    }
    
    function handleGameOver() { 
        console.error("GAME OVER!"); 
        gameState.addLogMessage("Party fallen..."); 
        
        const b = document.getElementById('restart-button'); 
        b.replaceWith(b.cloneNode(true)); 
        document.getElementById('restart-button').addEventListener('click', initializeGame); 
    }

    // --- Start the Game ---
    initializeGame();

}); // End DOMContentLoaded
