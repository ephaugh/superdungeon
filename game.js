// game.js - FINAL Merged Version with Enemy System Enhancements

document.addEventListener('DOMContentLoaded', () => {
    // --- Constants ---
    const DUNGEON_BACKGROUNDS = [
    "https://i.imgur.com/T9bj9OD.png", // Dungeon 1 (overworld)
    "https://i.imgur.com/fHe9ijy.png", // Dungeon 2 (desert)
    "https://i.imgur.com/gOlj4Vq.png",  // Dungeon 3 (catacombs)
    "https://i.imgur.com/02aYtrV.png", // Dungeon 4 (jungle) 
    "https://i.imgur.com/OGJ46dn.png", // Dungeon 5 (badlands) 
    "https://i.imgur.com/oXJ9kJp.png", // Dungeon 6 (???) 
];
    const CLASS_DATA = {
        Barbarian: { baseHp: 20, baseMp: 0, baseStr: 5, baseDef: 5, baseInt: 5, baseMnd: 5, commands: ['Attack', 'Rage'], initialPowers: [], growth: { hp: 4, mp: 0, str: 1, def: 1, int: 0, mnd: 0 } },
        Valkyrie: { baseHp: 15, baseMp: 10, baseStr: 5, baseDef: 5, baseInt: 5, baseMnd: 5, commands: ['Attack', 'Prayer'], initialPowers: ['Heal1'], growth: { hp: 3, mp: 1, str: 0.5, def: 0.5, int: 0.5, mnd: 0.5 } },
        Ninja: { baseHp: 15, baseMp: 10, baseStr: 5, baseDef: 5, baseInt: 5, baseMnd: 5, commands: ['Attack', 'Spell'], initialPowers: ['Shock1'], growth: { hp: 3, mp: 1, str: 0.5, def: 0.5, int: 0.5, mnd: 0.5 } },
        Shaman: { baseHp: 12, baseMp: 15, baseStr: 5, baseDef: 5, baseInt: 5, baseMnd: 5, commands: ['Attack', 'Spell', 'Prayer'], initialPowers: ['Heal1', 'Shock1'], growth: { hp: 2, mp: 2, str: 0, def: 0.5, int: 1, mnd: 0.5 } },
        Sorceress: { baseHp: 10, baseMp: 20, baseStr: 5, baseDef: 5, baseInt: 5, baseMnd: 5, commands: ['Attack', 'Spell'], initialPowers: ['Fire1', 'Frost1', 'Shock1', 'Hydro1', 'Poison'], growth: { hp: 1, mp: 3, str: 0, def: 0, int: 2, mnd: 2 } },
        Bishop: { baseHp: 10, baseMp: 20, baseStr: 5, baseDef: 5, baseInt: 5, baseMnd: 5, commands: ['Attack', 'Prayer'], initialPowers: ['Heal1', 'Empower1', 'Restore1'], growth: { hp: 1, mp: 5, str: 0, def: 0, int: 2, mnd: 2 } }
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
        Omni: { level: 4, cost: 100, type: 'Spell', element: 'Darkness', target: 'enemies' },
        
    // Updated and new prayer entries
        Heal1: { level: 1, cost: 5, type: 'Prayer', effect: 'Heal', target: 'ally' },
        Empower1: { level: 1, cost: 5, type: 'Prayer', effect: 'Empower', statusName: 'Empower1', turns: 4, target: 'ally', damageMultiplier: 1.5 },
        Restore1: { level: 1, cost: 5, type: 'Prayer', effect: 'Restore', chance: 0.33, target: 'ally' },
        Heal2: { level: 2, cost: 15, type: 'Prayer', effect: 'Heal', target: 'ally' },
        Empower2: { level: 2, cost: 15, type: 'Prayer', effect: 'Empower', statusName: 'Empower2', turns: 4, target: 'ally', damageMultiplier: 3.0 },
        Restore2: { level: 2, cost: 15, type: 'Prayer', effect: 'Restore', chance: 0.66, target: 'ally' },
        Revive: { level: 2, cost: 15, type: 'Prayer', effect: 'Revive', hpPercent: 0.25, target: 'ally_ko' },
        Fury: { level: 2, cost: 20, type: 'Prayer', effect: 'Fury', statusName: 'Fury', turns: 4, target: 'ally' },
        Lifelink: { level: 2, cost: 20, type: 'Prayer', effect: 'Lifelink', statusName: 'Lifelink', turns: 4, target: 'ally', healPercent: 0.5 },
        Heal3: { level: 3, cost: 30, type: 'Prayer', effect: 'Heal', target: 'ally' },
        Empower3: { level: 3, cost: 30, type: 'Prayer', effect: 'Empower', statusName: 'Empower3', turns: 4, target: 'ally', damageMultiplier: 5.0 },
        Miracle: { level: 4, cost: 200, type: 'Prayer', effect: 'Miracle', target: 'ally_or_ko' },
};

    const UNLOCK_SCHEDULE = {
        10: { Sorceress: ['Fire2'], Bishop: ['Heal2'] }, 
        16: { Valkyrie: ['Empower1', 'Restore1'], Ninja: ['Fire1', 'Frost1', 'Hydro1', 'Poison'], Shaman: ['Fire1', 'Frost1', 'Hydro1', 'Poison', 'Empower1', 'Restore1'] }, 
        18: { Sorceress: ['Frost2','Hydro2'], Bishop: ['Empower2'] }, 
        24: { Sorceress: ['Shock2'], Bishop: ['Restore2'] }, 
        25: { Valkyrie: ['Heal2'], Ninja: ['Fire2'], Shaman: ['Heal2', 'Fire2'] }, 
        28: { Bishop: ['Fury'] },
        30: { Sorceress: ['Slow'], Bishop: ['Revive'] }, 
        32: { Valkyrie: ['Empower2'], Ninja: ['Frost2'] }, 
        33: { Shaman: ['Empower2', 'Frost2'] }, 
        35: { Valkyrie: ['Fury'], Shaman: ['Fury'] },
        38: { Valkyrie: ['Restore2'], Ninja: ['Shock2'] }, 
        39: { Shaman: ['Restore2', 'Shock2'] }, 
        40: { Sorceress: ['Fire3'], Bishop: ['Heal3'] },
        42: { Bishop: ['Lifelink'] },
        44: { Valkyrie: ['Revive'], Ninja: ['Slow'] }, 
        45: { Shaman: ['Revive', 'Slow'] },
        46: { Valkyrie: ['Lifelink'], Shaman: ['Lifelink', 'Fire3'], Ninja: ['Fire3'], },
        50: { Sorceress: ['Frost3','Hydro3','Shock3'], Bishop: ['Empower3'] },
        60: { Valkyrie: ['Empower3'], Shaman: ['Empower3', 'Frost3','Hydro3','Shock3'], Ninja: ['Frost3','Hydro3','Shock3'] },
        65: { Sorceress: ['Omni'], Bishop: ['Miracle'] },
        
};
    const CLASS_LIST = Object.keys(CLASS_DATA);
    const ENEMY_ARCHETYPES = {
        Weakling: { statMultipliers: { hp: 1.1, mp: 1.1, str: 1.1, def: 1.1, int: 1.1, mnd: 1.1 }, abilities: [] },
        Bruiser: { statMultipliers: { hp: 1.50, mp: 1.0, str: 1.50, def: 1.50, int: 1.0, mnd: 0.7 }, abilities: [] },
        Caster: { statMultipliers: { hp: 1.0, mp: 1.0, str: 1.0, def: 0.8, int: 1.40, mnd: 1.30 }, abilities: [] },
        Boss: { statMultipliers: { hp: 1.0, mp: 1.5, str: 1.8, def: 1.8, int: 1.3, mnd: 1.3 }, abilities: [] } // Boss HP Multiplier applied separately
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
        levelMultiplier: 1.5, // Reduced from 1.75
        mpCost: 5,
        aoe: true  // Now targets all party members
    },
    Wave: { 
        name: 'Wave', 
        element: 'Hydro',
        description: 'A surge of magical water that hits all party members',
        levelMultiplier: 1.6, // Reduced from 1.75
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
    },
    Pyro2: { 
        name: 'Pyro+', 
        element: 'Fire',
        description: 'An enhanced burst of magical flames that hits all party members',
        levelMultiplier: 1.8, // Higher than regular Pyro (1.10)
        mpCost: 5,
        aoe: true  // Targets all party members
},
    Corruption: { 
        name: 'Corruption', 
        element: 'Darkness',
        description: 'A wave of corruption that debuffs all stats of all party members',
        levelMultiplier: 2.15, 
        mpCost: 5,
        aoe: true  // Targets all party members
}    
};
    
    // Updated enemies with the new ability structure
    const DUNGEON_ENEMIES = [
    // Dungeon 1 - Overworld
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
                name: "GoblinPunch", 
                chance: 0.50, 
                type: 'BruiserAbility'
            }] 
        }, 
        caster: { 
            name: 'Kobold', 
            archetype: 'Caster', 
            abilities: [{ 
                name: "Pyro", 
                chance: 0.41, 
                type: 'Orison'
            }] 
        } 
    },
    // Dungeon 2 - Desert
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
            archetype: 'Caster', 
            abilities: [{ 
                name: "Lightning", 
                chance: 0.50, 
                type: 'Orison'
            }]
        } 
    },
    // Dungeon 3 - Catacombs
    { 
        weakling: { 
            name: 'Skeleton', 
            archetype: 'Weakling',
            abilities: [] // Weaklings have no abilities
        }, 
        bruiser: { 
            name: 'Ooze', 
            archetype: 'Bruiser', 
            abilities: [{ 
                name: "AcidSplash", 
                chance: 0.50, 
                type: 'BruiserAbility'
            }]
        }, 
        caster: { 
            name: 'Banshee', 
            archetype: 'Caster', 
            abilities: [{ 
                name: "Freeze", 
                chance: 0.70, 
                type: 'Orison'
            }]
        } 
    },
    // Dungeon 4 - Jungle
    {  
        weakling: { 
            name: 'Raptor', 
            archetype: 'Weakling',
            abilities: [] // Weaklings have no abilities
        }, 
        bruiser: { 
            name: 'Megasaurus', 
            archetype: 'Bruiser', 
            abilities: [{ 
                name: "Stomp", 
                chance: 0.50, 
                type: 'BruiserAbility'
            }]
        }, 
        caster: { 
            name: 'Nessiedon', 
            archetype: 'Caster', 
            abilities: [{ 
                name: "Wave", 
                chance: 0.70, 
                type: 'Orison'
            }]
        } 
    },
    // Dungeon 5 - Badlands
    {  
        weakling: { 
            name: 'Doomhound', 
            archetype: 'Weakling',
            abilities: [] // Weaklings have no abilities
        }, 
        bruiser: { 
            name: 'Dracoguard', 
            archetype: 'Bruiser', 
            abilities: [{ 
                name: "Slash", 
                chance: 0.75, 
                type: 'BruiserAbility'
            }]
        }, 
        caster: { 
            name: 'Elite Kobold', 
            archetype: 'Caster', 
            abilities: [{ 
                name: "Pyro2", 
                chance: 0.70, 
                type: 'Orison'
            }]
        } 
    },
    // Dungeon 6 - ???
    {  
        weakling: { 
            name: 'Mi-go', 
            archetype: 'Weakling',
            abilities: [] // Weaklings have no abilities
        }, 
        bruiser: { 
            name: 'Shoggoth', 
            archetype: 'Bruiser', 
            abilities: [{ 
                name: "Crush", 
                chance: 1.00, 
                type: 'BruiserAbility'
            }]
        }, 
        caster: { 
            name: 'Elder Thing', 
            archetype: 'Caster', 
            abilities: [{ 
                name: "Corruption", 
                chance: 0.75, 
                type: 'Orison'
            }]
        } 
    }
];
    
    
    const WAVE_COMPOSITIONS = [ "W", "WW", "B", "WB", "BB", "C", "CW", "BWW", "CBW", "CC", "WWWW", "BBC", "WWBC", "CBC" ];

   // --- Character Class ---
class Character {
    constructor(id, className) { 
        this.id = id; 
        this.name = className; 
        this.className = className; 
        this.level = 0; 
        
        const d = CLASS_DATA[this.className]; 
        this.baseHp = d.baseHp; 
        this.baseMp = d.baseMp; 
        this.baseStr = d.baseStr; 
        this.baseDef = d.baseDef; 
        this.baseInt = d.baseInt; 
        this.baseMnd = d.baseMnd; 
        
        this.maxHp = d.baseHp; 
        this.maxMp = d.baseMp; 
        this.str = d.baseStr; 
        this.def = d.baseDef; 
        this.int = d.baseInt; 
        this.mnd = d.baseMnd; 
        
        this.currentHp = this.maxHp; 
        this.currentMp = this.maxMp; 
        this.statusEffects = []; 
        this.isAlive = true; 
        this.isRaging = false; 
        this.powers = [...d.initialPowers]; 
        this.commands = [...d.commands]; 
    }
    
    // Only used during class changes in the tavern
    recalculateStats() { 
        // Store original values for debugging
        const oldMaxHp = this.maxHp;
        const oldMaxMp = this.maxMp;
        
        // Get the base data for the current class
        const classData = CLASS_DATA[this.className]; 
        
        // Completely reset stats to base values for the new class
        this.baseHp = classData.baseHp; 
        this.baseMp = classData.baseMp; 
        this.baseStr = classData.baseStr; 
        this.baseDef = classData.baseDef; 
        this.baseInt = classData.baseInt; 
        this.baseMnd = classData.baseMnd; 
        
        // Reset current stats to base values
        this.maxHp = classData.baseHp; 
        this.maxMp = classData.baseMp; 
        this.str = classData.baseStr; 
        this.def = classData.baseDef; 
        this.int = classData.baseInt; 
        this.mnd = classData.baseMnd; 
        
        // Store current level, reset to 0
        const storedLevel = this.level; 
        this.level = 0; 
        
        // Apply level-ups from scratch for the new class
        for (let i = 1; i <= storedLevel; i++) {
            this.applyLevelUpGrowth(i); 
        }
        
        // Restore the level
        this.level = storedLevel; 
        
        // Ensure Barbarians have 0 MP regardless of level
        if (this.className === 'Barbarian') {
            this.maxMp = 0;
            this.baseMp = 0;
        }
        
        // Reset powers to the class defaults
        const d = CLASS_DATA[this.className];
        this.powers = [...d.initialPowers];
        this.commands = [...d.commands];
        
        // Add powers based on level unlocks
        for (let i = 1; i <= this.level; i++) {
            if (UNLOCK_SCHEDULE[i]?.[this.className]) {
                UNLOCK_SCHEDULE[i][this.className].forEach(p => {
                    if (!this.powers.includes(p)) {
                        this.powers.push(p);
                    }
                });
            }
        }
        
        // Restore HP/MP to max after recalculation
        this.fullRestore(); 
        
        console.log(`Recalculated stats for ${this.name} (${this.className}): HP=${this.maxHp} (was ${oldMaxHp}), MP=${this.maxMp} (was ${oldMaxMp}), STR=${this.str}, DEF=${this.def}, INT=${this.int}, MND=${this.mnd}`);
    }
    
    applyLevelUpGrowth(lvl) { 
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
            // Reduced HP growth from 6% to 5% per level
            this.maxHp = Math.round(this.maxHp * 1.05); 
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
    }
    
    levelUp() { 
        const nL = this.level + 1; 
        this.applyLevelUpGrowth(nL); 
        
        if (UNLOCK_SCHEDULE[this.level]?.[this.className]) { 
            UNLOCK_SCHEDULE[this.level][this.className].forEach(p => { 
                if (!this.powers.includes(p)) { 
                    this.powers.push(p); 
                    gameState.addLogMessage(`${this.name} learned ${p}!`); 
                } 
            }); 
        } 
        
        console.log(`Lvl Up ${this.level}: ${this.name} HP:${this.maxHp} MP:${this.maxMp} STR:${this.str} DEF:${this.def} INT:${this.int} MND:${this.mnd}`); 
    }
    
    fullRestore() { 
        // Restore HP and MP to maximum
        this.currentHp = this.maxHp; 
        this.currentMp = this.maxMp; 
        
        // Clear status effects except permanent ones
        this.statusEffects = this.statusEffects.filter(s => s.isPermanent); 
        
        // Reset alive state and rage mode
        this.isAlive = this.currentHp > 0; 
        this.isRaging = false; 
        
        // Clear all the buffs
        this.removeStatus('Empower1');
        this.removeStatus('Empower2');
        this.removeStatus('Fury');
        this.removeStatus('Lifelink');
        this.removeStatus('Slow');
        this.removeStatus('Poison');
    }
    
    getCurrentStat(sName) { 
        let val = this[sName]; 
        this.statusEffects.forEach(e => { 
            if (e[`${sName}Bonus`]) val += e[`${sName}Bonus`]; 
            // Add this line to apply stat debuff reductions
            if (e[`${sName}Reduction`]) val -= e[`${sName}Reduction`];
        }); 
        return Math.max(0, val); 
    }
    
   takeDamage(amt) { 
    if (!this.isAlive) return 0; 
    
    // Debug the incoming damage amount
    console.log(`${this.name} taking damage: ${amt} (original)`);
    
    // CRITICAL FIX: Don't apply ANY transformations to the damage amount
    // except for the intentional rage multiplier
    // The Math.max(0, amt) was likely causing the issue by forcing small values to 0
    // which then became 1 after the final Math.max(1, damage) at the end
    const damageMultiplier = this.isRaging ? 2 : 1; 
    
    // Apply the multiplier directly to the incoming amount WITHOUT any other modifications
    const finalAmount = amt * damageMultiplier; 
    
    console.log(`${this.name} final damage: ${finalAmount} (after rage multiplier)`);
    
    // Apply the damage
    this.currentHp -= Math.round(finalAmount); 
    
    // Handle KO state
    if (this.currentHp <= 0) { 
        this.currentHp = 0; 
        this.isAlive = false; 
        this.isRaging = false; 
        this.statusEffects = this.statusEffects.filter(s => s.isPermanent); 
        gameState.addLogMessage(`${this.name} KO!`); 
    } 
    
    // Return the actual damage taken
    return Math.round(finalAmount); 
}
    
    heal(amt) { 
        if (!this.isAlive) return 0; 
        const heal = Math.max(0, amt); 
        const prev = this.currentHp; 
        this.currentHp = Math.min(this.maxHp, this.currentHp + heal); 
        return this.currentHp - prev; 
    }
    
    useMp(amt) { 
        if (this.currentMp < amt) return false; 
        this.currentMp -= amt; 
        return true; 
    }
    
    restoreMp(amt) { 
        if (!this.isAlive) return 0; 
        const r = Math.max(0, amt); 
        const p = this.currentMp; 
        this.currentMp = Math.min(this.maxMp, this.currentMp + r); 
        return this.currentMp - p; 
    }
    
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
        // For Empower effects, replace any existing Empower buff with the new one
        else if (effect.type === 'Empower1' || effect.type === 'Empower2' || effect.type === 'Empower3') {
            // Remove any existing Empower buff before adding the new one
            this.statusEffects = this.statusEffects.filter(s => 
                s.type !== 'Empower1' && s.type !== 'Empower2' && s.type !== 'Empower3'
            );
        }
        // For other buff effects (Fury, Lifelink), always replace with the new buff
        else if (effect.type === 'Fury' || effect.type === 'Lifelink') {
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
    
    removeStatus(sType) { 
        const l = this.statusEffects.length; 
        this.statusEffects = this.statusEffects.filter(s => s.type !== sType); 
        return this.statusEffects.length < l; 
    }
    
    clearNegativeStatuses() { 
        const neg = ['Poison', 'Slow']; 
        let r = false; 
        this.statusEffects = this.statusEffects.filter(s => { 
            if (neg.includes(s.type)) { 
                r = true; 
                return false; 
            } 
            return true; 
        }); 
        return r; 
    }
}
const ENEMY_SPRITES = {
    // Dungeon 1 - Overworld
    'Rat': {
        src: 'https://i.imgur.com/e4JnC9d.png',
        width: 70,
        height: 70,
        fallbackText: 'Rat',
    },
    'Goblin': {
        src: 'https://i.imgur.com/Xcu9zE2.png',
        width: 80,
        height: 80,
        fallbackText: 'Gob',
    },
    'Kobold': {
        src: 'https://i.imgur.com/6pzi1E0.png',
        width: 80,
        height: 80,
        fallbackText: 'Kob',
    },
    'White Dragon': {
        src: 'https://i.imgur.com/CKrfmRI.png',
        width: 154,
        height: 154,
        fallbackText: 'Whi',
    },
    
    // Dungeon 2 - Desert
    'Sand Worm': {
        src: 'https://i.imgur.com/xBJ4Zjs.png',
        width: 110,
        height: 110,
        fallbackText: 'San',
    },
    'Thief': {
        src: 'https://i.imgur.com/QdoIs9v.png',
        width: 90,
        height: 90,
        fallbackText: 'Thi',
    },
    'Mummy': {
        src: 'https://i.imgur.com/wYb4a7D.png',
        width: 90,
        height: 90,
        fallbackText: 'Mum',
    },
    'Blue Dragon': {
        src: 'https://i.imgur.com/K8Nf61W.png',
        width: 150,
        height: 150,
        fallbackText: 'Blu',
    },
    
    // Dungeon 3 - Catacombs
    'Skeleton': {
        src: 'https://i.imgur.com/aqz2BhZ.png',
        width: 90,
        height: 90,
        fallbackText: 'Ske',
    },
    'Ooze': {
        src: 'https://i.imgur.com/bw5bxXL.png',
        width: 120,
        height: 120,
        fallbackText: 'Ooz',
    },
    'Banshee': {
        src: 'https://i.imgur.com/eDqsh10.png',
        width: 90,
        height: 90,
        fallbackText: 'Ban',
    },
    'Black Dragon': {
        src: 'https://i.imgur.com/BjClt4D.png',
        width: 150,
        height: 150,
        fallbackText: 'Bla',
    },
    
    // Dungeon 4 - Jungle
    'Raptor': {
        src: 'https://i.imgur.com/VzONkiC.png',
        width: 105,
        height: 105,
        fallbackText: 'Rap',
    },
    'Megasaurus': {
        src: 'https://i.imgur.com/JjFq2lP.png',
        width: 150,
        height: 150,
        fallbackText: 'Meg',
    },
    'Nessiedon': {
        src: 'https://i.imgur.com/iwR4yRM.png',
        width: 125,
        height: 125,
        fallbackText: 'Nes',
    },
    'Green Dragon': {
        src: 'https://i.imgur.com/4Jmsp45.png',
        width: 150,
        height: 150,
        fallbackText: 'Gre',
    },
    
    // Dungeon 5 - Badlands
    'Doomhound': {
        src: 'https://i.imgur.com/Qkp0tB0.png',
        width: 90,
        height: 90,
        fallbackText: 'Doo',
    },
    'Dracoguard': {
        src: 'https://i.imgur.com/cxRSWSh.png',
        width: 120,
        height: 120,
        fallbackText: 'Dra',
    },
    'Elite Kobold': {
        src: 'https://i.imgur.com/NEvOD5x.png',
        width: 95,
        height: 95,
        fallbackText: 'Eli',
    },
    'Red Dragon': {
        src: 'https://i.imgur.com/EEMmCrp.png',
        width: 150,
        height: 150,
        fallbackText: 'Red',
    },
    
    // Dungeon 6 - ???
    'Mi-go': {
        src: 'https://i.imgur.com/1QONqdF.png',
        width: 85,
        height: 85,
        fallbackText: 'Mig',
    },
    'Shoggoth': {
        src: 'https://i.imgur.com/VjFQY3g.png',
        width: 130,
        height: 130,
        fallbackText: 'Sho',
    },
    'Elder Thing': {
        src: 'https://i.imgur.com/CG48Kwh.png',
        width: 100,
        height: 100,
        fallbackText: 'Eld',
    },
    'King in Yellow': {
        src: 'https://i.imgur.com/vwJ9eBE.png',
        width: 150,
        height: 150,
        fallbackText: 'Kin',
    },
}
const PLAYER_SPRITES = {
    // Barbarian
    'Barbarian': {
        src: 'https://i.imgur.com/Id39qQz.png',
        width: 120,
        height: 120,
        fallbackText: 'BAR'
    },
    // Valkyrie
    'Valkyrie': {
        src: 'https://i.imgur.com/2ZpPiAx.png',
        width: 100,
        height: 100,
        fallbackText: 'VAL'
    },
    // Ninja
    'Ninja': {
        src: 'https://i.imgur.com/MjTiI3c.png',
        width: 100,
        height: 100,
        fallbackText: 'NIN'
    },
    // Shaman
    'Shaman': {
        src: 'https://i.imgur.com/O0e0QCB.png',
        width: 110,
        height: 110,
        fallbackText: 'SHA'
    },
    // Sorceress
    'Sorceress': {
        src: 'https://i.imgur.com/sMfxdhj.png',
        width: 100,
        height: 100,
        fallbackText: 'SOR'
    },
    // Bishop
    'Bishop': {
        src: 'https://i.imgur.com/tTO0Ell.png',
        width: 100,
        height: 100,
        fallbackText: 'BIS'
    }
};
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
            updateProgressDisplay();
        }
    };

    const ELEMENT_DEBUFF_MAP = {
        'Fire': 'str',
        'Frost': 'def',
        'Shock': 'int',
        'Hydro': 'mnd',
        'Darkness': ['str', 'def', 'int', 'mnd']
    };

    // Function to add a visual debuff indicator to a sprite
    function addStatDebuffIndicator(targetId, statType, durationTurns) {
        // Get the correct element ID
        let elementId;
        if (targetId.startsWith("party-")) {
            elementId = targetId + "-sprite"; // Player sprites have -sprite suffix
        } else {
            elementId = targetId; // Enemy sprites use their ID directly
        }
        
        console.log(`Adding ${statType} debuff to ${elementId}, duration: ${durationTurns}`);
        
        // Use a small delay to ensure the sprite exists in the DOM
        setTimeout(() => {
            const targetElement = document.getElementById(elementId);
            
            if (!targetElement) {
                console.warn(`Debuff Target Sprite not found: ${elementId}`);
                return;
            }
            
            // Create debuff indicator element
            const debuffIndicator = document.createElement('div');
            debuffIndicator.className = `stat-debuff-indicator ${statType.toLowerCase()}`;
            debuffIndicator.textContent = `-${statType.toUpperCase()}`;
            debuffIndicator.dataset.turns = durationTurns;
            debuffIndicator.id = `${elementId}-${statType.toLowerCase()}-debuff`;
            
            // For easier visibility, add a background
            debuffIndicator.style.backgroundColor = "rgba(0,0,0,0.4)";
            
            // Remove any existing debuff of the same type
            const existingDebuff = document.getElementById(debuffIndicator.id);
            if (existingDebuff && existingDebuff.parentNode) {
                existingDebuff.parentNode.removeChild(existingDebuff);
            }
            
            // Add to the target sprite
            targetElement.appendChild(debuffIndicator);
            console.log(`Added ${statType} debuff indicator to ${elementId}`);
        }, 50); // Small delay to ensure DOM is ready
    }

// Function to remove a stat debuff indicator
function removeStatDebuffIndicator(targetId, statType) {
    const elementId = getCorrectElementId(targetId);
    const debuffId = `${elementId}-${statType.toLowerCase()}-debuff`;
    const debuffElement = document.getElementById(debuffId);
    
    if (debuffElement && debuffElement.parentNode) {
        debuffElement.parentNode.removeChild(debuffElement);
    }
}

// Function to apply a stat debuff to a character or enemy
function applyStatDebuff(target, statType, magnitude) {
    // Calculate reduction amount (stronger for higher spell levels)
    const reductionPercent = 0.15 + ((magnitude - 1) * 0.05); // 15% for lvl 1, 20% for lvl 2, 25% for lvl 3
    const turns = magnitude; // Duration equals spell level/magnitude
    
    // Calculate the actual stat reduction
    const baseStat = target[statType] || 0;
    const reductionAmount = Math.ceil(baseStat * reductionPercent);
    
    // Create the debuff effect
    const debuff = {
        type: `${statType}Debuff`,
        turns: turns,
        [`${statType}Reduction`]: reductionAmount,
        isPermanent: false
    };
    
    // Add to target's status effects
    if (target.addStatus) {
        target.addStatus(debuff);
    } else if (target.statusEffects) {
        // Remove any existing debuff of the same type
        target.statusEffects = target.statusEffects.filter(s => s.type !== debuff.type);
        // Add the new debuff
        target.statusEffects.push(debuff);
    }
    
    // Update the visual indicators
    addStatDebuffIndicator(target.id, statType, turns);
    console.log(`Applied ${statType}Debuff to ${target.name} (-${reductionAmount} for ${turns} turns)`);
}
    
    // --- Calculation Helper Functions ---
function calculatePhysicalDamage(attacker, defender) { 
    // Get base stats, using getCurrentStat if available (for status effects)
    const attackerStr = attacker.getCurrentStat ? attacker.getCurrentStat('str') : attacker.str; 
    const defenderDef = defender.getCurrentStat ? defender.getCurrentStat('def') : defender.def; 
    const attackerLevel = attacker.level; 
    const defenderLevel = defender.level; 
    
    // Determine base multiplier (higher for Rage)
    let baseMultiplier = attacker.isRaging ? 2.2 : (1.5 + Math.random() * 0.45); 
    
    // Calculate offense value using strength and level
    let offenseValue = (attackerLevel + attackerStr) * baseMultiplier; 
    
    // Calculate defense value using defense and level
    let defenseValue = (defenderLevel + defenderDef); 
    
    // Calculate raw damage by subtracting defense from offense
    const rawDamage = offenseValue - defenseValue;
    
    // Print debug info about the calculation
    console.log(`Attack: ${attacker.name} (STR:${attackerStr}, LVL:${attackerLevel}) -> ${defender.name} (DEF:${defenderDef}, LVL:${defenderLevel})`);
    console.log(`Formula: (${attackerLevel} + ${attackerStr}) * ${baseMultiplier.toFixed(2)} - (${defenderLevel} + ${defenderDef}) = ${rawDamage.toFixed(2)}`);
    
    // Ensure damage is at least 1 (minimum damage)
    return Math.max(1, Math.round(rawDamage)); 
}
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
    gameState.party.forEach((character, index) => {
        const statusBox = document.getElementById(`char-status-${index + 1}`);
        if (!statusBox) return;
        
        // Remove existing classes
        statusBox.classList.remove('ko', 'hp-critical', 'buffed', 'empower-buffed', 'fury-buffed', 'lifelink-buffed');
        statusBox.querySelectorAll('span').forEach(span => 
            span.classList.remove('hp-critical', 'hp-ko', 'buffed', 'empower-buffed', 'fury-buffed', 'lifelink-buffed')
        );
        
        // Get DOM elements
        const nameSpan = statusBox.querySelector('.char-name') || statusBox.children[0];
        const statusSpan = statusBox.querySelector('.char-status') || statusBox.children[1];
        const hpSpan = statusBox.querySelector('.char-hp') || statusBox.children[2];
        const mpSpan = statusBox.querySelector('.char-mp') || statusBox.children[3];
        
        // Update basic status info
        if (nameSpan) nameSpan.textContent = character.name;
        if (hpSpan) hpSpan.innerHTML = `HP: <span class="hp-value">${character.currentHp}</span>/<span class="hp-max">${character.maxHp}</span>`;
        if (mpSpan) mpSpan.innerHTML = `MP: <span class="mp-value">${character.currentMp}</span>/<span class="mp-max">${character.maxMp}</span>`;
        
        // Check for buffs (now includes Empower3)
        const hasEmpowerBuff = character.statusEffects.some(e => e.type === 'Empower1' || e.type === 'Empower2' || e.type === 'Empower3');
        const hasFuryBuff = character.statusEffects.some(e => e.type === 'Fury');
        const hasLifelinkBuff = character.statusEffects.some(e => e.type === 'Lifelink');
        const hasAnyBuff = hasEmpowerBuff || hasFuryBuff || hasLifelinkBuff;
        
        // Find the sprite but don't manipulate position properties
        const spriteElement = document.getElementById(`${character.id}-sprite`);
        if (spriteElement) {
            // CRITICAL: Reset any transforms that might have been applied
            spriteElement.style.bottom = '5px';
            spriteElement.style.position = 'absolute';
            spriteElement.style.transform = 'none';
            
            // Just add visual classes but not position-affecting ones
            spriteElement.classList.toggle('empower-pulse', hasEmpowerBuff);
            spriteElement.classList.toggle('fury-pulse', hasFuryBuff);
            spriteElement.classList.toggle('lifelink-pulse', hasLifelinkBuff);
            spriteElement.classList.toggle('buffed', hasAnyBuff);
            
            // Set high z-index for buffed characters to make them visually stand out
            if (hasAnyBuff) {
                spriteElement.style.zIndex = '4';
            } else {
                spriteElement.style.zIndex = '3';
            }
        }
        
        // Update status text and apply buff styling
        if (statusSpan) {
            if (!character.isAlive) {
                statusSpan.textContent = "KO";
                statusSpan.style.color = '#ff6666';
            } else {
                let statusText = '';
                
                // Collect buff names (now includes Empower3)
                const buffs = [];
                if (hasEmpowerBuff) {
                    const buff = character.statusEffects.find(e => e.type === 'Empower1' || e.type === 'Empower2' || e.type === 'Empower3');
                    let empowerLevel = buff.type.replace('Empower', '');
                    buffs.push(`E${empowerLevel}(x${buff.damageMultiplier})`);
                    statusBox.classList.add('buffed', 'empower-buffed');
                }
                
                if (hasFuryBuff) {
                    buffs.push('FURY');
                    statusBox.classList.add('buffed', 'fury-buffed');
                }
                
                if (hasLifelinkBuff) {
                    buffs.push('LIFE');
                    statusBox.classList.add('buffed', 'lifelink-buffed');
                }
                
                // Add negative statuses
                const negatives = character.statusEffects
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
        if (!character.isAlive) {
            if (nameSpan) nameSpan.classList.add('hp-ko');
            if (hpSpan) hpSpan.classList.add('hp-ko');
            if (mpSpan) mpSpan.classList.add('hp-ko');
            statusBox.classList.add('ko');
        } else if (character.maxHp > 0 && character.currentHp / character.maxHp < 0.33) {
            if (nameSpan) nameSpan.classList.add('hp-critical');
            if (hpSpan) hpSpan.classList.add('hp-critical');
            if (mpSpan) mpSpan.classList.add('hp-critical');
            statusBox.classList.add('hp-critical');
        }
        
        // Set opacity based on alive status
        statusBox.style.opacity = character.isAlive ? 1 : 0.6;
    });
}
    
    function updateCombatLogUI() { /* Log area removed */ }
    function updateActionMenuUI(char) { const box = document.querySelector('#dynamic-menu-content .action-menu-box'); if (!box) return; const btns = box.querySelectorAll('button'); if (!char || !char.isAlive) { btns.forEach(b => { b.style.display = 'none'; b.disabled = true; }); return; } btns.forEach(b => { const a = b.dataset.action; if (!a) return; let available = char.commands.includes(a); if (a === 'Spell' && !char.powers.some(p => POWER_DATA[p]?.type === 'Spell')) available = false; if (a === 'Prayer' && !char.powers.some(p => POWER_DATA[p]?.type === 'Prayer')) available = false; b.style.display = available ? 'block' : 'none'; b.disabled = !available; }); }
   
    function updateEnemySpritesUI() {
        // --- PART 1: HANDLE ENEMY SPRITES ---
        const enemyArea = document.getElementById('battlefield-enemy-area');
        enemyArea.innerHTML = '';
        
        gameState.enemies.forEach((enemy, index) => {
            const sprite = document.createElement('div');
            sprite.className = 'sprite enemy';
            sprite.id = enemy.id;
            
            // Position based on index and total enemies for better spacing
            const totalEnemies = gameState.enemies.length;
            const spacing = totalEnemies <= 3 ? 25 : 18; // Adjust spacing based on enemy count
            sprite.style.left = `${20 + index * spacing}%`;
            sprite.style.top = '50%';
            sprite.style.transform = 'translateY(-50%)';
            sprite.style.position = 'absolute'; // Ensure position is set for debuff indicators
            
            // Get the sprite data based on enemy type
            const enemyType = enemy.type;
            const spriteData = ENEMY_SPRITES[enemyType];
            
            if (spriteData) {
                // Apply custom dimensions from sprite config
                if (spriteData.width && spriteData.height) {
                    sprite.style.width = `${spriteData.width}px`;
                    sprite.style.height = `${spriteData.height}px`;
                }
                
                // Apply scaling for bosses if specified
                if (spriteData.scale) {
                    sprite.style.transform = `translateY(-50%) scale(${spriteData.scale})`;
                }
                
                // Create image element for the sprite
                const spriteImg = document.createElement('img');
                spriteImg.src = spriteData.src;
                spriteImg.alt = enemyType;
                spriteImg.className = 'enemy-sprite-img';
                
                // Handle image loading error - use text fallback
                spriteImg.onerror = () => {
                    console.warn(`Failed to load sprite image for ${enemyType}: ${spriteData.src}`);
                    spriteImg.style.display = 'none';
                    sprite.textContent = spriteData.fallbackText || enemyType.substring(0, 3);
                    sprite.style.backgroundColor = 'rgba(128, 128, 128, 0.7)';
                };
                
                sprite.appendChild(spriteImg);
                sprite.style.backgroundColor = 'transparent';
            } else {
                // Fallback to text if no sprite data is defined
                sprite.textContent = enemy.name.substring(0, 3);
            }
            
            // Add enemy status information to tooltip
            let statusText = '';
            if (enemy.statusEffects && enemy.statusEffects.length > 0) {
                statusText = ' | Status: ' + enemy.statusEffects.map(s => s.type).join(', ');
            }
            
            sprite.title = `${enemy.name} (HP: ${enemy.currentHp}/${enemy.maxHp}${statusText})`;
            
            // Add KO class if enemy is defeated
            if (!enemy.isAlive) {
                sprite.classList.add('ko');
            }
            
            // Apply status effect visual indicators
            if (enemy.statusEffects) {
                enemy.statusEffects.forEach(effect => {
                    if (effect.type === 'Poison') {
                        sprite.classList.add('poisoned');
                    } else if (effect.type === 'Slow') {
                        sprite.classList.add('slowed');
                    }
                    
                    // Re-add stat debuff indicators if present
                    if (effect.type === 'strDebuff') {
                        addStatDebuffIndicator(enemy.id, 'str', effect.turns);
                    } else if (effect.type === 'defDebuff') {
                        addStatDebuffIndicator(enemy.id, 'def', effect.turns);
                    } else if (effect.type === 'intDebuff') {
                        addStatDebuffIndicator(enemy.id, 'int', effect.turns);
                    } else if (effect.type === 'mndDebuff') {
                        addStatDebuffIndicator(enemy.id, 'mnd', effect.turns);
                    }
                });
            }
            
            enemyArea.appendChild(sprite);
        });
        
        // --- PART 2: HANDLE PARTY SPRITES WITH STRICT POSITIONING ---
        const partyArea = document.getElementById('battlefield-party-area');
        partyArea.innerHTML = '';
        
        gameState.party.forEach((character, index) => {
            // Create the basic sprite
            const sprite = document.createElement('div');
            sprite.className = 'sprite party-member';
            sprite.id = character.id + "-sprite";
            
            // CRITICAL: Set precise position in inline styles with !important
            sprite.style.cssText = `
                left: ${20 + index * 20}% !important;
                bottom: 5px !important;
                position: absolute !important;
            `;
            
            // Get sprite data for this character class
            const spriteData = PLAYER_SPRITES[character.className];
            
            if (spriteData) {
                // Apply custom dimensions from sprite config
                if (spriteData.width && spriteData.height) {
                    sprite.style.width = `${spriteData.width}px`;
                    sprite.style.height = `${spriteData.height}px`;
                }
                
                // Create image element for the sprite
                const spriteImg = document.createElement('img');
                spriteImg.src = spriteData.src;
                spriteImg.alt = character.className;
                spriteImg.className = 'player-sprite-img';
                
                // Handle image loading error - use text fallback
                spriteImg.onerror = () => {
                    console.warn(`Failed to load sprite image for ${character.className}: ${spriteData.src}`);
                    spriteImg.style.display = 'none';
                    sprite.textContent = spriteData.fallbackText || character.className.substring(0, 3);
                    sprite.style.backgroundColor = 'rgba(128, 128, 128, 0.7)';
                };
                
                sprite.appendChild(spriteImg);
                sprite.style.backgroundColor = 'transparent';
            } else {
                // Fallback to text if no sprite data is defined
                sprite.textContent = character.name.substring(0, 3);
            }
            
            sprite.title = `${character.name} (HP: ${character.currentHp}/${character.maxHp})`;
            
            // Add KO class if needed
            if (!character.isAlive) {
                sprite.classList.add('ko');
            }
            
            // Check for buffs - but don't let them affect positioning
            const hasEmpowerBuff = character.statusEffects.some(e => e.type === 'Empower1' || e.type === 'Empower2');
            const hasFuryBuff = character.statusEffects.some(e => e.type === 'Fury');
            const hasLifelinkBuff = character.statusEffects.some(e => e.type === 'Lifelink');
            
            if (hasEmpowerBuff) {
                sprite.classList.add('buffed', 'empower-buffed');
                sprite.style.zIndex = '4';
            }
            if (hasFuryBuff) {
                sprite.classList.add('buffed', 'fury-buffed');
                sprite.style.zIndex = '4';
            }
            if (hasLifelinkBuff) {
                sprite.classList.add('buffed', 'lifelink-buffed');
                sprite.style.zIndex = '4';
            }
            
            // For non-buffed characters
            if (!hasEmpowerBuff && !hasFuryBuff && !hasLifelinkBuff) {
                sprite.style.zIndex = '3';
            }
            
            // Add to the party area
            partyArea.appendChild(sprite);
            
            // Re-add stat debuff indicators if present
            if (character.statusEffects) {
                character.statusEffects.forEach(effect => {
                    if (effect.type === 'strDebuff') {
                        addStatDebuffIndicator(character.id, 'str', effect.turns);
                    } else if (effect.type === 'defDebuff') {
                        addStatDebuffIndicator(character.id, 'def', effect.turns);
                    } else if (effect.type === 'intDebuff') {
                        addStatDebuffIndicator(character.id, 'int', effect.turns);
                    } else if (effect.type === 'mndDebuff') {
                        addStatDebuffIndicator(character.id, 'mnd', effect.turns);
                    }
                });
            }
            
            // Extra step: set these properties again after appending
            // This is a failsafe to make sure they're applied
            setTimeout(() => {
                if (sprite.parentNode) {
                    sprite.style.bottom = '5px';
                    sprite.style.position = 'absolute';
                    sprite.style.transform = 'none';
                }
            }, 0);
        });
    }
    function updatePartySelectUI() { const cont = document.getElementById('party-select-slots'); cont.innerHTML = ''; for (let i = 0; i < 4; i++) { const d = document.createElement('div'); d.className = 'party-select-slot'; d.id = `select-slot-${i}`; let cN = '', conf = false, act = (i === gameState.partySelectionIndex); if (i < gameState.partySelectionIndex) { cN = gameState.selectedClasses[i]; conf = true; } else if (i === gameState.partySelectionIndex) { cN = gameState.tempSelectedClass; } else { cN = '---'; } d.innerHTML = `Character ${i + 1}: <span class="selected-class"></span>`; const s = d.querySelector('.selected-class'); s.textContent = cN; CLASS_LIST.forEach(c => s.classList.remove(c)); if (cN !== '---' && CLASS_DATA[cN]) s.classList.add(cN); if (act) d.classList.add('active'); if (conf) d.classList.add('confirmed'); cont.appendChild(d); } }
    function highlightActivePartyStatus(index) { document.querySelectorAll('#party-status-area > .character-status-box').forEach((b, i) => { if (i === index && gameState.party[index]?.isAlive) { b.classList.add('highlighted'); } else { b.classList.remove('highlighted'); } }); }
    // Dungeon Background function
    function updateDungeonBackground() {
    const bgElement = document.getElementById('game-background');
    if (!bgElement) return;
    
    const dungeonIndex = Math.min(DUNGEON_BACKGROUNDS.length - 1, Math.floor((gameState.currentWave - 1) / 15));
    const backgroundUrl = DUNGEON_BACKGROUNDS[dungeonIndex];
    
    if (backgroundUrl) {
        bgElement.style.backgroundImage = `url('${backgroundUrl}')`;
    } else {
        bgElement.style.backgroundImage = 'none';
    }
}
    // Function to update the progress display
function updateProgressDisplay() {
    const progressDisplay = document.getElementById('progress-info-display');
    const currentWaveSpan = document.getElementById('current-wave');
    const dungeonNameDiv = document.getElementById('dungeon-name');
    
    if (!progressDisplay || !currentWaveSpan || !dungeonNameDiv) return;
    
    // Only show progress info during gameplay, not on title or other screens
    if (gameState.currentState === 'PLAYER_COMMAND' || 
        gameState.currentState === 'ACTION_RESOLUTION' || 
        gameState.currentState === 'BETWEEN_WAVES') {
        progressDisplay.style.display = 'block';
    } else {
        progressDisplay.style.display = 'none';
        return;
    }
    
    // Update wave counter
    const currentWave = gameState.currentWave;
    const waveInDungeon = ((currentWave - 1) % 15) + 1;
    currentWaveSpan.textContent = waveInDungeon;
    
    // Update dungeon name
    const dungeonIndex = Math.floor((currentWave - 1) / 15);
    const dungeonNames = ["Overworld", "Desert", "Catacombs", "Jungle", "Badlands", "???",];
    dungeonNameDiv.textContent = dungeonNames[dungeonIndex] || `Dungeon ${dungeonIndex + 1}`;
}
    // --- Visual Effect Helpers ---
    function getCorrectElementId(actorOrTargetId) { 
        console.log("Getting element ID for:", actorOrTargetId);
        
        // For party members, append -sprite to the ID
        if (gameState.party.some(p => p.id === actorOrTargetId)) {
            const result = actorOrTargetId + "-sprite";
            console.log("Returning player sprite ID:", result);
            return result; 
        }
        
        // For enemies, return the ID as-is
        console.log("Returning enemy ID as-is:", actorOrTargetId);
        return actorOrTargetId; 
    }
    function flashSprite(id, color = 'white', dur = 150) { 
        const elementId = getCorrectElementId(id); 
        const element = document.getElementById(elementId); 
        
        if (element) {
            console.log("Flashing sprite:", elementId, color);
            // Create a flash effect overlay div
            const flashEffect = document.createElement('div');
            flashEffect.className = 'flash-effect';
            flashEffect.style.backgroundColor = color;
            flashEffect.style.opacity = '0.7'; 
            
            // Add the flash effect as a child of the sprite
            element.appendChild(flashEffect);
            
            // Animate out and remove after duration
            setTimeout(() => {
                flashEffect.style.opacity = '0';
                flashEffect.style.transition = `opacity ${dur/2}ms ease-out`;
                
                // Remove after transition completes
                setTimeout(() => {
                    if (element.contains(flashEffect)) {
                        element.removeChild(flashEffect);
                    }
                }, dur/2);
            }, dur/2);
        } else {
            console.warn("Flash target not found:", elementId);
        }
    }
    
    function shimmerSprite(id, color = 'gold', dur = 1400) { 
        const elementId = getCorrectElementId(id); 
        const element = document.getElementById(elementId); 
        
        if (element) {
            console.log("Shimmering sprite:", elementId, color);
            // Create shimmer effect as an absolute positioned child element
            const shimmerDiv = document.createElement('div');
            shimmerDiv.className = 'shimmer-effect';
            shimmerDiv.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 5;
                border-radius: 5px;
                box-shadow: 0 0 15px 8px ${color};
                opacity: 0.7;
                transition: opacity ${dur/1000}s ease-out;
            `;
            
            // Check if the element has relative positioning
            const computedStyle = window.getComputedStyle(element);
            if (computedStyle.position === 'static') {
                element.style.position = 'relative';
            }
            
            element.appendChild(shimmerDiv);
            
            // Animate out
            requestAnimationFrame(() => {
                setTimeout(() => {
                    shimmerDiv.style.opacity = '0';
                }, 50);
            });
            
            // Remove after animation
            setTimeout(() => {
                if (element.contains(shimmerDiv)) {
                    element.removeChild(shimmerDiv);
                    // Only reset position if we changed it
                    if (computedStyle.position === 'static') {
                        element.style.position = 'static';
                    }
                }
            }, dur);
        } else {
            console.warn("Shimmer target not found:", elementId);
        }
    }
    
    function showFloatingNumber(targetId, amount, type = 'damage') { 
        const elementId = getCorrectElementId(targetId); 
        const tE = document.getElementById(elementId); 
        if (!tE) { 
            console.warn("FloatNum Target Sprite not found:", elementId); 
            return; 
        } 
        
        const nE = document.createElement('span'); 
        nE.textContent = Math.abs(amount); 
        nE.className = `floating-number ${type}`; 
        
        const cont = document.getElementById('game-container'); 
        const targetRect = tE.getBoundingClientRect(); 
        const contRect = cont.getBoundingClientRect(); 
        let sX = targetRect.left - contRect.left + (targetRect.width / 2); 
        let sY = targetRect.top - contRect.top; 
        sX += Math.random() * 20 - 10; 
        nE.style.left = `${sX - 15}px`; 
        nE.style.top = `${sY}px`; 
        
        cont.appendChild(nE); 
        
        nE.addEventListener('animationend', () => { 
            if (nE.parentNode === cont) cont.removeChild(nE); 
        }, { once: true }); 
    }
    let announcementTimeout = null; 
function showActionAnnouncement(text, duration = 1500) { 
    const bar = document.getElementById('action-announcement-bar'); 
    const barText = document.getElementById('action-announcement-text'); 
    if (!bar || !barText) return; 
    
    if (announcementTimeout) clearTimeout(announcementTimeout); 
    barText.textContent = text; 
    bar.style.display = 'block'; 
    
    announcementTimeout = setTimeout(() => { 
        bar.style.display = 'none'; 
        announcementTimeout = null; 
    }, duration); 
}
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
    const contentArea = document.getElementById('dynamic-menu-content'); 
    contentArea.innerHTML = '';
    gameState.activeMenu = menuType; 
    let menuContainer = document.createElement('div');
    
    switch (menuType) {
        case 'main': 
            menuContainer.className = 'action-menu-box'; 
            const char = gameState.party[gameState.activeCharacterIndex]; 
            if (char) { 
                const commandsToShow = ['Attack', 'Spell', 'Prayer', 'Rage']; 
                commandsToShow.forEach(cmd => { 
                    let available = char.commands.includes(cmd); 
                    if (cmd === 'Spell' && !char.powers.some(p => POWER_DATA[p]?.type === 'Spell')) available = false; 
                    if (cmd === 'Prayer' && !char.powers.some(p => POWER_DATA[p]?.type === 'Prayer')) available = false; 
                    if (available) { 
                        const btn = document.createElement('button'); 
                        btn.dataset.action = cmd; 
                        btn.textContent = cmd; 
                        menuContainer.appendChild(btn); 
                    } 
                }); 
                updateActionMenuUI(char); 
            } 
            break;
            
        case 'Spell': 
        case 'Prayer': 
            menuContainer.className = 'sub-menu-box'; 
            const caster = gameState.party[gameState.activeCharacterIndex]; 
            const powerList = caster.powers.filter(p => POWER_DATA[p]?.type === (menuType === 'Spell' ? 'Spell' : 'Prayer')); 
            if (powerList.length > 0) { 
                powerList.forEach(pN => { 
                    const p = POWER_DATA[pN]; 
                    const btn = document.createElement('button'); 
                    btn.dataset.power = pN; 
                    btn.textContent = `${pN} (${p.cost} MP)`; 
                    btn.disabled = caster.currentMp < p.cost; 
                    menuContainer.appendChild(btn); 
                }); 
            } else { 
                menuContainer.innerHTML = `<p style="color: #aaa;">No ${menuType} known.</p>`; 
                const backBtn = document.createElement('button'); 
                backBtn.textContent = "Back"; 
                backBtn.onclick = handleMenuCancel; 
                menuContainer.appendChild(backBtn); 
            } 
            break;
            
        case 'targets': 
            menuContainer.className = 'sub-menu-box target-menu'; 
            const targetEnemies = associatedData; 
            const prompt = document.createElement('span'); 
            prompt.id = 'target-prompt'; 
            prompt.textContent = `Select Target (${targetEnemies ? 'Enemy' : 'Ally'}):`; 
            menuContainer.appendChild(prompt); 
            const list = targetEnemies ? gameState.enemies : gameState.party; 
            const pName = gameState.currentAction?.powerName; 
            const power = pName ? POWER_DATA[pName] : null; 
            let found = false; 
            
            list.forEach(t => { 
                let valid = false; 
                if (targetEnemies) {
                    valid = t.isAlive; 
                } else { 
                    if (power?.target === 'ally_ko') {
                        valid = !t.isAlive; 
                    } else if (pName === 'Miracle') {
                        valid = true; // Only Miracle can target both alive and KO'd allies
                    } else {
                        valid = t.isAlive; 
                    }
                } 
                
                if (valid) { 
                    found = true; 
                    const b = document.createElement('button'); 
                    b.dataset.targetId = t.id; 
                    // Only show (KO) indicator for Miracle when targeting fallen allies
                    b.textContent = t.name + (pName === 'Miracle' && !t.isAlive ? ' (KO)' : ''); 
                    menuContainer.appendChild(b); 
                } 
            }); 
            
            if (!found) { 
                menuContainer.innerHTML += `<p style="color: #aaa;">No valid targets.</p>`; 
                const backBtn = document.createElement('button'); 
                backBtn.textContent = "Back"; 
                backBtn.onclick = handleMenuCancel; 
                menuContainer.appendChild(backBtn); 
            } 
            break;
    }
    
    contentArea.appendChild(menuContainer); 
    resetFocusToMenu(menuType);
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
   function handlePowerSelection(button) { 
    const pN = button.dataset.power; 
    const p = POWER_DATA[pN]; 
    const caster = gameState.party[gameState.activeCharacterIndex]; 

    if (!p || caster.currentMp < p.cost) { 
        gameState.addLogMessage(`${caster.name} needs more MP for ${pN}!`); 
        return; 
    } 
    
    console.log(`${caster.name} selects ${pN}`); 
    gameState.currentAction.powerName = pN; 
    gameState.currentAction.powerCost = p.cost; 

    if (p.target === 'enemies' || p.target === 'allies') { 
        gameState.currentAction.targets = (p.target === 'enemies') ? 
            gameState.enemies.filter(e => e.isAlive).map(e => e.id) : 
            gameState.party.filter(pl => pl.isAlive).map(pl => pl.id); 
        queueAction(caster.id, gameState.currentAction); 
        gameState.currentAction = null; 
        highlightActivePartyStatus(-1); 
        prepareCommandPhase(); 
    } else { 
        // Determine if this power targets enemies or allies
        const targetsEnemies = p.target === 'enemy' || p.target === 'enemies';
        populateMenu('targets', targetsEnemies); 
    } 
}
    function handleTargetSelection(button) { const tId = button.dataset.targetId; console.log(`Target: ${tId}`); gameState.currentAction.targets = [tId]; if (gameState.currentState === 'PLAYER_COMMAND') { const act = gameState.currentAction; const cast = gameState.getCharacterById(act.casterId); /* MP Check/Deduction now primarily in handlePowerSelection */ queueAction(cast.id, act); gameState.currentAction = null; highlightActivePartyStatus(-1); prepareCommandPhase(); } else { console.error("Target selected outside command state!"); } }

    // --- Finalize Party Selection, Core Game Logic (Command Queue, Turn Order, Execution) ---
function finalizePartySelection() { 
    console.log("Finalizing party:", gameState.selectedClasses); 
    gameState.party = []; 
    gameState.selectedClasses.forEach((cN, i) => { 
        if (!cN) cN = 'Barbarian'; 
        const c = new Character(`party-${i + 1}`, cN); 
        
        // FOR TESTING: Set starting level here
        const TESTING_START_LEVEL = 1; // Change this number to test different levels
        
        // Apply level-ups from 1 to the testing level
        for (let level = 1; level <= TESTING_START_LEVEL; level++) {
            c.applyLevelUpGrowth(level);
        if (UNLOCK_SCHEDULE[level] && UNLOCK_SCHEDULE[level][c.className]) {
                UNLOCK_SCHEDULE[level][c.className].forEach(powerName => {
                    if (!c.powers.includes(powerName)) {
                        c.powers.push(powerName);
                        console.log(`${c.name} learned ${powerName} at level ${level}!`);
                    }
                });
            }
        
        
        }
        
        c.fullRestore(); 
        gameState.party.push(c); 
    }); 
    
    console.log("Party Created:", gameState.party); 
    gameState.setState('COMBAT_LOADING'); 
    setupCombatButtonListeners(); 
    startNextWave(); 
}    
    function startNextWave() { 
        if (gameState.currentWave === 0) gameState.currentWave = 0; // Start at wave 61
        gameState.currentWave++; 
        console.log(`Start Wave ${gameState.currentWave}`); 
        gameState.addLogMessage(`Wave ${gameState.currentWave}`); 
        
        // Added dungeon background functionality
        updateDungeonBackground();
        
        // Add this line to update the progress display
        updateProgressDisplay();
        
        gameState.enemies = generateEnemiesForWave(gameState.currentWave); 
        console.log("Enemies:", gameState.enemies); 
        gameState.actionQueue = []; 
        gameState.nextWaveEffect = null; 
        gameState.activeCharacterIndex = 0; 
        gameState.setState('PLAYER_COMMAND'); 
        prepareCommandPhase(); 
    }
    function generateEnemiesForWave(wave) { const enemies = []; const dungeonIndex = Math.min(DUNGEON_ENEMIES.length - 1, Math.floor((wave - 1) / 15)); const waveIndexInDungeon = (wave - 1) % 15; const dungeonData = DUNGEON_ENEMIES[dungeonIndex]; const baseStats = calculateEnemyStats(wave); let isBossWave = (waveIndexInDungeon === 14); let compositionString = ""; if (isBossWave) { compositionString = "BOSS"; } else if (waveIndexInDungeon < WAVE_COMPOSITIONS.length) { compositionString = WAVE_COMPOSITIONS[waveIndexInDungeon]; } else { compositionString = "W"; console.error("Wave comp OOB!"); } let letterCounts = { 'W': 0, 'B': 0, 'C': 0 }; if (isBossWave) { let bossName = 'Red Dragon'; if (dungeonIndex === 0) bossName = 'White Dragon'; else if (dungeonIndex === 1) bossName = 'Blue Dragon'; else if (dungeonIndex === 2) bossName = 'Black Dragon'; else if (dungeonIndex === 3) bossName = 'Green Dragon';const archetypeData = ENEMY_ARCHETYPES['Boss'] || ENEMY_ARCHETYPES['Weakling']; const multipliers = archetypeData.statMultipliers; let finalStats = { hp: Math.round(baseStats.hp * 2.50), mp: Math.round(baseStats.mp * multipliers.mp), str: Math.round(baseStats.str * multipliers.str), def: Math.round(baseStats.def * multipliers.def), int: Math.round(baseStats.int * multipliers.int), mnd: Math.round(baseStats.mnd * multipliers.mnd), }; enemies.push({ id: `enemy-1`, name: bossName, type: bossName, archetype: 'Boss', level: wave, maxHp: finalStats.hp, currentHp: finalStats.hp, maxMp: finalStats.mp, currentMp: finalStats.mp, str: finalStats.str, def: finalStats.def, int: finalStats.int, mnd: finalStats.mnd, isAlive: true, statusEffects: [], abilities: [{ name: 'DragonBreath', type: 'Ability', chance: 1.0 }], getCurrentStat(sN) { return this[sN]; }, actsTwice: true }); } else { for (let i = 0; i < compositionString.length; i++) { let enemyDef, archetypeKey, typeChar = compositionString[i]; if (typeChar === 'W') { archetypeKey = 'weakling'; enemyDef = dungeonData.weakling; } else if (typeChar === 'B') { archetypeKey = 'bruiser'; enemyDef = dungeonData.bruiser; } else if (typeChar === 'C') { archetypeKey = 'caster'; enemyDef = dungeonData.caster; } else continue; if (!enemyDef) { console.error(`Def missing ${typeChar} in dungeon ${dungeonIndex}`); continue; } const archetypeData = ENEMY_ARCHETYPES[enemyDef.archetype] || ENEMY_ARCHETYPES['Weakling']; const multipliers = archetypeData.statMultipliers; let finalStats = { hp: Math.round(baseStats.hp * multipliers.hp), mp: Math.round(baseStats.mp * multipliers.mp), str: Math.round(baseStats.str * multipliers.str), def: Math.round(baseStats.def * multipliers.def), int: Math.round(baseStats.int * multipliers.int), mnd: Math.round(baseStats.mnd * multipliers.mnd), }; letterCounts[typeChar]++; const enemyName = `${enemyDef.name} ${String.fromCharCode(64 + letterCounts[typeChar])}`; enemies.push({ id: `enemy-${enemies.length + 1}`, name: enemyName, type: enemyDef.name, archetype: enemyDef.archetype, level: wave, maxHp: finalStats.hp, currentHp: finalStats.hp, maxMp: finalStats.mp, currentMp: finalStats.mp, str: finalStats.str, def: finalStats.def, int: finalStats.int, mnd: finalStats.mnd, isAlive: true, statusEffects: [], abilities: enemyDef.abilities || [], getCurrentStat(sN) { return this[sN]; }, actsTwice: false }); } } return enemies; }
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
function prepareCommandPhase() {
    // Add our new debug logs here
    console.log("=== COMMAND PHASE STATUS CHECK ===");
    gameState.party.forEach(char => {
        if (char.className === 'Barbarian') {
            console.log(`Barbarian ${char.name} rage status: ${char.isRaging ? 'ACTIVE' : 'INACTIVE'}`);
        } else {
            console.log(`${char.className} ${char.name} rage status: ${char.isRaging ? 'ACTIVE' : 'INACTIVE'}`);
        }
    });
    console.log("=================================");
    
    if (gameState.currentState !== 'PLAYER_COMMAND') return;
    let found = false;
    let startIdx = gameState.activeCharacterIndex;
    for (let i = 0; i < gameState.party.length; i++) {
        let checkIdx = (startIdx + i) % gameState.party.length;
        const char = gameState.party[checkIdx];
        if (char.isAlive && !gameState.actionQueue.some(item => item.actorId === char.id)) {
            gameState.activeCharacterIndex = checkIdx;
            found = true;
            break;
        }
    }
    if (found) {
        const char = gameState.party[gameState.activeCharacterIndex];
        gameState.addLogMessage(`--- ${char.name}, command? ---`);
        populateMenu('main');
        highlightActivePartyStatus(gameState.activeCharacterIndex);
        document.getElementById('action-menu-area').style.display = 'flex';
    } else {
        console.log("Player commands done.");
        queueEnemyActions();
    }
}
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
   
    function applyCastingAnimation(actorId, castType, duration = 1000) {
        const elementId = getCorrectElementId(actorId);
        const element = document.getElementById(elementId);
        
        if (element) {
            console.log(`Applying ${castType} animation to ${elementId}`);
            
            // Remove any existing casting animations
            element.classList.remove(
                'casting-spell', 'casting-prayer', 'casting-rage',
                'casting-fire', 'casting-frost', 'casting-shock', 'casting-hydro',
                'casting-dragon-breath'
            );
            
            // Add the new casting animation class
            element.classList.add(`casting-${castType}`);
            
            // Schedule the removal of the animation class
            setTimeout(() => {
                if (element) {
                    element.classList.remove(`casting-${castType}`);
                }
            }, duration);
        }
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
            if (actor.currentMp < cost) {
                canAfford = false;
            } else {
                actor.currentMp -= cost;
                if (isPlayerActor) {
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
        
        // Apply appropriate animation based on action type
        switch (action.type) {
            case 'Attack':
                announceText = 'Attack';
                announceDur = 600;
                flashSprite(actorId, 'white', 200);
                break;
                
            case 'Rage':
                announceText = 'Rage';
                announceDur = 650;
                applyCastingAnimation(actorId, 'rage', 1000);
                break;
                
            case 'Spell':
                if (action.powerName) {
                    const spellData = POWER_DATA[action.powerName];
                    if (spellData && spellData.element) {
                        applyCastingAnimation(actorId, spellData.element.toLowerCase(), 1200);
                    } else {
                        applyCastingAnimation(actorId, 'spell', 1200);
                    }
                } else {
                    applyCastingAnimation(actorId, 'spell', 1200);
                }
                break;
                
            case 'Prayer':
                announceText = action.powerName || "Prayer";
                announceDur = 1500;
                applyCastingAnimation(actorId, 'prayer', 1300);
                break;
                
            case 'Orison':
                announceText = action.orisonName || "Orison";
                announceDur = 1000;
                if (action.orisonName) {
                    const orisonData = ORISONS[action.orisonName];
                    if (orisonData && orisonData.element) {
                        applyCastingAnimation(actorId, orisonData.element.toLowerCase(), 1200);
                    } else {
                        applyCastingAnimation(actorId, 'spell', 1200);
                    }
                } else {
                    applyCastingAnimation(actorId, 'spell', 1200);
                }
                break;
                
            case 'DragonBreath':
                announceText = "Dragon Breath";
                announceDur = 1600;
                applyCastingAnimation(actorId, 'dragon-breath', 1500);
                break;
        }
        
        showActionAnnouncement(announceText, announceDur);
        gameState.addLogMessage(`-- ${actor.name}'s action --`);
        
        // Continue with the original function logic
        let primaryTarget = null;
        let finalTargets = [];
        let redirectionNeeded = false;
        
        if (action.targets && action.targets.length > 0) {
            let initialTargets = action.targets.map(id => gameState.getCharacterById(id) || gameState.getEnemyById(id)).filter(t => t);
            
            if (action.targets.length === 1) {
                primaryTarget = initialTargets[0];
                const isRevive = (action.type === 'Prayer' && action.powerName === 'Revive');
                const isMiracle = (action.type === 'Prayer' && action.powerName === 'Miracle');
                
                if (!primaryTarget || 
                    (isRevive && primaryTarget.isAlive) || 
                    (!isRevive && !isMiracle && !primaryTarget.isAlive)) {
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
            case 'Darkness': effectColor = 'black'; break;
            default: effectColor = 'purple';
        }
        
        // Show a shimmer effect on the caster
        shimmerSprite(getCorrectElementId(caster.id), effectColor, 500);
        
        // Determine which stat gets debuffed based on element
        const debuffStat = ELEMENT_DEBUFF_MAP[orison.element];
        
        // Calculate debuff magnitude (scaled with enemy level)
        // This ensures lower level enemies apply weaker debuffs (1 turn)
        // while higher level enemies apply stronger debuffs (up to 3 turns)
        const debuffMagnitude = Math.min(3, Math.max(1, Math.floor(caster.level / 5)));
        
        // Apply damage to each target with slight delay between hits
        allTargets.forEach((target, index) => {
            setTimeout(() => {
                const targetElementId = getCorrectElementId(target.id);
                
                // Flash the target
                flashSprite(targetElementId, effectColor, 250);
                
                // Apply the stat debuff if applicable
                if (debuffStat) {
                    if (Array.isArray(debuffStat)) {
                    // Handle multiple stats (Darkness element)
                    debuffStat.forEach(stat => {
                        applyStatDebuff(target, stat, debuffMagnitude);
                    });
                } else {
                    // Handle single stat (Fire, Frost, etc.)
                    applyStatDebuff(target, debuffStat, debuffMagnitude);
        }
    }
                
                // Calculate and apply damage
                setTimeout(() => {
                    const damage = calculateOrisonDamage(caster, target);
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
        const hpBonus = Math.round(caster.maxHp * 0.2);
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
    
    // Apply Empower buff damage multiplier if present (now includes Empower3)
    const empowerBuff = c.statusEffects.find(e => e.type === 'Empower1' || e.type === 'Empower2' || e.type === 'Empower3');
    if (empowerBuff && empowerBuff.damageMultiplier) {
        dmg = Math.round(dmg * empowerBuff.damageMultiplier);
        let empowerLevel = empowerBuff.type.replace('Empower', '');
        gameState.addLogMessage(`${c.name}'s attack is empowered (Level ${empowerLevel})! (x${empowerBuff.damageMultiplier})`);
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
                    
                    // Apply Empower buff to second attack too (including Empower3)
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
     // Modified performPower function with fixed Empower functionality
   function performPower(c, pN, resolvedTargets) { 
    const p = POWER_DATA[pN]; 
    if (!p) return; 
    
    gameState.addLogMessage(`${c.name} casts ${pN}!`); 
    
    if (resolvedTargets.length === 0 && (p.target === 'ally' || p.target === 'ally_ko' || p.target === 'ally_or_ko' || p.target === 'enemy')) { 
        gameState.addLogMessage(`No valid targets remain.`); 
        highlightActivePartyStatus(-1); 
        return; 
    } 
    
    // Determine element color for spell animations
    let elementColor = 'purple'; // Default color
    if (p.element) {
        // Set color based on elemental type
        switch(p.element) {
            case 'Fire': 
                elementColor = 'orange'; 
                applyCastingAnimation(c.id, 'fire', 1200);
                break;
            case 'Frost': 
                elementColor = 'aqua'; 
                applyCastingAnimation(c.id, 'frost', 1200);
                break;
            case 'Hydro': 
                elementColor = 'blue'; 
                applyCastingAnimation(c.id, 'hydro', 1200);
                break;
            case 'Shock': 
                elementColor = 'yellow'; 
                applyCastingAnimation(c.id, 'shock', 1200);
                break;
            case 'Darkness':
                elementColor = 'black';
                applyCastingAnimation(c.id, 'darkness', 1200);
                break;
        }
    }
    else if (p.type === 'Prayer') {
        applyCastingAnimation(c.id, 'prayer', 1200);
    }
    
    resolvedTargets.forEach((t, index) => { 
        if (!t) return; 
        const targetElementId = getCorrectElementId(t.id); 
        
        if (p.element) { 
            const dmg = calculateMagicDamage(c, t, p.level); 
            
            // For elemental spells, determine which stat to debuff
            const debuffStat = ELEMENT_DEBUFF_MAP[p.element];
            
            // For elemental spells, apply flashSprite with a delay
            setTimeout(() => {
                // Flash the target with the elemental color
                flashSprite(targetElementId, elementColor, 250);
                
                // Apply the stat debuff if applicable
                if (debuffStat) {
                    applyStatDebuff(t, debuffStat, p.level);
                }
                
                // Show floating damage with a slight delay
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
                }, 150);
            }, index * 200); // Stagger the effects if multiple targets
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
            const statusName = p.statusName; // 'Empower1', 'Empower2', or 'Empower3'
            const damageMultiplier = p.damageMultiplier || 1.5;
            
            // Check if target already has any Empower buff
            const hadBuff = t.statusEffects.some(s => s.type === 'Empower1' || s.type === 'Empower2' || s.type === 'Empower3');
            
            const suc = t.addStatus({ 
                type: statusName, 
                turns: p.turns || 4, 
                isPhysicalBuff: true,
                damageMultiplier: damageMultiplier,
                visualEffect: 'active'
            }); 
            
            if (suc) {
                let empowerLevel = statusName.replace('Empower', '');
                if (hadBuff) {
                    gameState.addLogMessage(`${t.name}'s ${statusName} refreshed! (Damage x${damageMultiplier})`);
                } else {
                    gameState.addLogMessage(`${t.name} empowered (Level ${empowerLevel})! (Damage x${damageMultiplier})`);
                }
                
                // Different visual effects based on Empower level
                let shimmerColor = 'white';
                if (statusName === 'Empower2') {
                    shimmerColor = '#FFD700'; // Gold for Empower2
                } else if (statusName === 'Empower3') {
                    shimmerColor = '#FF69B4'; // Bright pink/magenta for Empower3
                }
                
                shimmerSprite(targetElementId, shimmerColor, 1200);
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
                healPercent: healPercent,
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
        else if (p.effect === 'Miracle') {
            // Miracle: Full heal + Empower3 + Lifelink + Fury, or revive with full HP
            const wasAlive = t.isAlive;
            
            if (!wasAlive) {
                // Revive the target with full HP
                t.isAlive = true;
                t.currentHp = t.maxHp;
                gameState.addLogMessage(`${t.name} miraculously revived with full HP!`);
                showFloatingNumber(targetElementId, t.maxHp, 'heal');
            } else {
                // Full heal for living target
                const healAmount = t.maxHp - t.currentHp;
                if (healAmount > 0) {
                    t.heal(healAmount);
                    showFloatingNumber(targetElementId, healAmount, 'heal');
                    gameState.addLogMessage(`${t.name} fully healed!`);
                }
            }
            
            // Apply Empower3 buff
            t.addStatus({ 
                type: 'Empower3', 
                turns: 4, 
                isPhysicalBuff: true,
                damageMultiplier: 5.0,
                visualEffect: 'active'
            });
            
            // Apply Fury buff
            t.addStatus({ 
                type: 'Fury', 
                turns: 4, 
                isPhysicalBuff: true,
                doubleAttack: true,
                visualEffect: 'active'
            });
            
            // Apply Lifelink buff
            t.addStatus({ 
                type: 'Lifelink', 
                turns: 4, 
                isPhysicalBuff: true,
                healPercent: 0.5,
                visualEffect: 'active'
            });
            
            gameState.addLogMessage(`${t.name} blessed with Empower3, Fury, and Lifelink!`);
            
            // Show spectacular visual effect combining multiple colors
            shimmerSprite(targetElementId, 'gold', 2000); // Golden miracle effect
            setTimeout(() => {
                shimmerSprite(targetElementId, '#FF69B4', 800); // Empower3 effect (bright pink)
            }, 400);
            setTimeout(() => {
                shimmerSprite(targetElementId, '#FF8080', 600); // Fury effect
            }, 800);
            setTimeout(() => {
                shimmerSprite(targetElementId, '#80FF80', 600); // Lifelink effect
            }, 1200);
            
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
    }); 
}
    function performDragonBreath(c) {
        gameState.addLogMessage(`${c.name} uses Dragon Breath!`);
        
        // Apply dragon breath animation
        applyCastingAnimation(c.id, 'dragon-breath', 1500);
        
        const targets = gameState.party.filter(p => p.isAlive);
        targets.forEach(t => {
            const dmg = Math.round(t.maxHp * 0.25);
            const targetElementId = getCorrectElementId(t.id);
            setTimeout(() => {
                showFloatingNumber(targetElementId, dmg, 'damage');
                gameState.addLogMessage(`${t.name} takes ${dmg} breath dmg!`);
                t.takeDamage(dmg);
                updatePartyStatusUI();
                highlightActivePartyStatus(-1);
                if (checkLoseCondition()) handleGameOver();
            }, 100);
        });
    }

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
            
            // Add descriptive message for buff expiration (now includes Empower3)
            if (e.type === 'Empower1' || e.type === 'Empower2' || e.type === 'Empower3') {
                let empowerLevel = e.type.replace('Empower', '');
                gameState.addLogMessage(`${c.name}'s Empower (Level ${empowerLevel}) wore off.`);
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
            
            // Remove visual effects when buff expires (now includes Empower3)
            const spriteElement = document.getElementById(getCorrectElementId(c.id + "-sprite"));
            if (spriteElement) {
                if (e.type === 'Empower1' || e.type === 'Empower2' || e.type === 'Empower3') {
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
                    (s.type === 'Empower1' || s.type === 'Empower2' || s.type === 'Empower3' || 
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
    console.log("Manually decrementing all buff durations...");
    let needsUpdate = false;
    
    gameState.party.forEach(c => {
        if (!c.isAlive) return;
        
        const remove = [];
        c.statusEffects.forEach(e => {
            if (e.turns !== undefined) {
                e.turns--;
                
                if (e.turns < 0) {
                    remove.push(e.type);
                    needsUpdate = true;
                    
                    // Add descriptive message for buff expiration
                    if (e.type === 'Empower1' || e.type === 'Empower2') {
                        gameState.addLogMessage(`${c.name}'s Empower wore off.`);
                    } 
                    else if (e.type === 'Empower3') {
                        gameState.addLogMessage(`${c.name}'s Empower3 wore off.`);
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
                        if (e.type === 'Empower1' || e.type === 'Empower2' || e.type === 'Empower3') {
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
                            (s.type === 'Empower1' || s.type === 'Empower2' || s.type === 'Empower3' ||
                             s.type === 'Fury' || s.type === 'Lifelink') && 
                            s.turns >= 0
                        );
                        
                        if (!stillHasBuffs) {
                            spriteElement.classList.remove('buffed');
                            spriteElement.style.zIndex = '3'; // Reset z-index
                        }
                    }
                }
            }
        });
        
        // Remove expired buffs
        remove.forEach(t => c.removeStatus(t));
    });
    
    // Update UI if any changes were made
    if (needsUpdate) {
        updatePartyStatusUI();
    }
    
    return needsUpdate;
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
    
    // Process end of round effects (including buff decrements) only once
    processEndOfRound();
    
    // Level up surviving characters
    gameState.party.forEach(c => { 
        if (c.isAlive) c.levelUp(); 
    }); 
    
    updatePartyStatusUI(); 
    
    // Determine next state based on wave number
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
    
    // Fully restore each party member (HP, MP, remove status effects, revive fallen)
    gameState.party.forEach(c => {
        // Store previous HP to check if character was revived
        const wasAlive = c.isAlive;
        
        // Full restoration
        c.fullRestore(); 
        
        // If character was dead and is now alive, add a specific message
        if (!wasAlive) {
            gameState.addLogMessage(`${c.name} revived!`);
        }
    }); 
    
    gameState.addLogMessage("Party fully restored!"); 
    
    // Update all UI elements to reflect restored state
    updatePartyStatusUI(); 
    updateEnemySpritesUI();
    
    // Update battlefield sprite visuals to remove any buff effects
    gameState.party.forEach(c => {
        const spriteElement = document.getElementById(getCorrectElementId(c.id + "-sprite"));
        if (spriteElement) {
            // Remove all buff-related classes
            spriteElement.classList.remove('buffed', 'empower-buffed', 'fury-buffed', 'lifelink-buffed');
            spriteElement.classList.remove('empower-pulse', 'fury-pulse', 'lifelink-pulse');
            spriteElement.classList.remove('ko');
        }
    });
    
    // Setup class change UI
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
    // Process class changes for each character
    gameState.party.forEach((character, index) => {
        const selectElement = document.getElementById(`class-select-${index + 1}`);
        if (selectElement) {
            const newClassName = selectElement.value;
            
            // Only apply changes if the class has actually changed
            if (newClassName !== character.className) {
                const oldClassName = character.className;
                console.log(`Changing ${character.name} from ${oldClassName} to ${newClassName}`);
                
                // Store original level before change
                const originalLevel = character.level;
                
                // Update character class
                character.className = newClassName;
                character.name = newClassName; // Update name to match class
                
                // Recalculate stats for the new class and level
                character.recalculateStats();
                
                gameState.addLogMessage(`${oldClassName} changed to ${newClassName}!`);
            }
        }
    });
    
    // Update UI with new stats and class names
    updatePartyStatusUI();
    
    // Handle background transition for new dungeon
    const backgroundElement = document.getElementById('game-background');
    if (backgroundElement) {
        const oldDungeonIndex = Math.floor((gameState.currentWave - 1) / 15);
        const newDungeonIndex = Math.floor(gameState.currentWave / 15);
        
        // If we're transitioning to a new dungeon
        if (oldDungeonIndex !== newDungeonIndex) {
            // Apply a transition effect for the background change
            backgroundElement.style.opacity = '0';
            setTimeout(() => {
                updateDungeonBackground();
                backgroundElement.style.opacity = '0.9';
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
