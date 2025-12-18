// game.js - With Monk Class and Special/Limit Break System

document.addEventListener('DOMContentLoaded', () => {
    // --- Constants ---
    const DUNGEON_BACKGROUNDS = [
        "https://i.imgur.com/T9bj9OD.png",
        "https://i.imgur.com/fHe9ijy.png",
        "https://i.imgur.com/gOlj4Vq.png",
        "https://i.imgur.com/02aYtrV.png",
        "https://i.imgur.com/OGJ46dn.png",
        "https://i.imgur.com/oXJ9kJp.png",
    ];

    const CLASS_DATA = {
        Barbarian: { baseHp: 30, baseMp: 0, baseStr: 7, baseDef: 7, baseInt: 5, baseMnd: 5, commands: ['Attack', 'Rage'], initialPowers: [], growth: { hp: 6, mp: 0, str: 1, def: 1, int: 0, mnd: 0 } },
        Valkyrie: { baseHp: 20, baseMp: 10, baseStr: 6, baseDef: 6, baseInt: 6, baseMnd: 6, commands: ['Attack', 'Prayer'], initialPowers: ['Heal1'], growth: { hp: 4, mp: 1, str: 0.5, def: 0.5, int: 0.5, mnd: 0.5 } },
        Ninja: { baseHp: 20, baseMp: 10, baseStr: 6, baseDef: 6, baseInt: 6, baseMnd: 6, commands: ['Attack', 'Spell'], initialPowers: ['Shock1'], growth: { hp: 4, mp: 1, str: 0.5, def: 0.5, int: 0.5, mnd: 0.5 } },
        Shaman: { baseHp: 17, baseMp: 15, baseStr: 5, baseDef: 5, baseInt: 6, baseMnd: 6, commands: ['Attack', 'Spell', 'Prayer'], initialPowers: ['Heal1', 'Shock1'], growth: { hp: 3, mp: 2, str: 0, def: 0.5, int: 1, mnd: 0.5 } },
        Sorceress: { baseHp: 15, baseMp: 20, baseStr: 5, baseDef: 5, baseInt: 6, baseMnd: 7, commands: ['Attack', 'Spell'], initialPowers: ['Fire1', 'Frost1', 'Shock1', 'Hydro1', 'Poison'], growth: { hp: 2, mp: 3, str: 0, def: 0, int: 2, mnd: 1 } },
        Bishop: { baseHp: 15, baseMp: 20, baseStr: 5, baseDef: 5, baseInt: 7, baseMnd: 6, commands: ['Attack', 'Prayer'], initialPowers: ['Heal1', 'Empower1', 'Restore1'], growth: { hp: 2, mp: 5, str: 0, def: 0, int: 2, mnd: 1 } },
        Monk: { baseHp: 27, baseMp: 0, baseStr: 7, baseDef: 8, baseInt: 5, baseMnd: 5, commands: ['Attack', 'Arts'], initialPowers: ['Rapid'], growth: { hp: 5, mp: 0, str: 1.2, def: 1, int: 0, mnd: 0 } }
    };

    const SPECIAL_NAMES = {
        'Barbarian': 'Bloodfury',
        'Valkyrie': 'Battle Cry',
        'Ninja': 'Night Slash',
        'Sorceress': 'Meteor Storm',
        'Shaman': 'Elemental Fury',
        'Bishop': 'Angelic Chorus',
        'Monk': 'Nirvana Fist'
    };

    const POWER_DATA = {
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
        Omni: { level: 5, cost: 100, type: 'Spell', element: 'Darkness', target: 'enemies' },
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
        Miracle: { level: 4, cost: 150, type: 'Prayer', effect: 'Miracle', target: 'ally_or_ko' },
        Rapid: { level: 1, cost: 0, type: 'Art', effect: 'DoubleAttack', target: 'random_enemies', damageMultiplier: 0.45, alwaysFirst: true },
        Focus: { level: 1, cost: 0, type: 'Art', effect: 'EnhancedStrike', target: 'enemy', damageMultiplier: 1.8, alwaysLast: true },
        Zen: { level: 1, cost: 0, type: 'Art', effect: 'SelfHeal', target: 'self', healPercent: 0.27 },
        Kick: { level: 1, cost: 0, type: 'Art', effect: 'AOE_Attack', target: 'all_enemies', damageMultiplier: 1.0 },
    };

    const UNLOCK_SCHEDULE = {
        10: { Sorceress: ['Fire2'], Bishop: ['Heal2'], Monk: ['Zen'] },
        16: { Valkyrie: ['Empower1', 'Restore1'], Ninja: ['Fire1', 'Frost1', 'Hydro1', 'Poison'], Shaman: ['Fire1', 'Frost1', 'Hydro1', 'Poison', 'Empower1', 'Restore1'] },
        18: { Sorceress: ['Frost2', 'Hydro2'], Bishop: ['Empower2'] },
        20: { Monk: ['Focus'] },
        24: { Sorceress: ['Shock2'], Bishop: ['Restore2'] },
        25: { Valkyrie: ['Heal2'], Ninja: ['Fire2'], Shaman: ['Heal2', 'Fire2'] },
        28: { Bishop: ['Fury'] },
        30: { Sorceress: ['Slow'], Bishop: ['Revive'], Monk: ['Kick'] },
        32: { Valkyrie: ['Empower2'], Ninja: ['Frost2'] },
        33: { Shaman: ['Empower2', 'Frost2'] },
        35: { Valkyrie: ['Fury'], Shaman: ['Fury'] },
        38: { Valkyrie: ['Restore2'], Ninja: ['Shock2'] },
        39: { Shaman: ['Restore2', 'Shock2'] },
        40: { Sorceress: ['Fire3'], Bishop: ['Heal3'] },
        42: { Bishop: ['Lifelink'] },
        44: { Valkyrie: ['Revive'], Ninja: ['Slow'] },
        45: { Shaman: ['Revive', 'Slow'] },
        46: { Valkyrie: ['Lifelink'], Shaman: ['Lifelink', 'Fire3'], Ninja: ['Fire3'] },
        50: { Sorceress: ['Frost3', 'Hydro3', 'Shock3'], Bishop: ['Empower3'] },
        60: { Valkyrie: ['Empower3'], Shaman: ['Empower3', 'Frost3', 'Hydro3', 'Shock3'], Ninja: ['Frost3', 'Hydro3', 'Shock3'] },
        65: { Sorceress: ['Omni'], Bishop: ['Miracle'] },
    };

    const CLASS_LIST = Object.keys(CLASS_DATA);

    const ENEMY_ARCHETYPES = {
        Weakling: { statMultipliers: { hp: 1.05, mp: 1.0, str: 1.1, def: 0.9, int: 1.0, mnd: 1.0 } },
        Bruiser: { statMultipliers: { hp: 1.20, mp: 1.0, str: 1.2, def: 1.10, int: 1.0, mnd: 0.6 } },
        Caster: { statMultipliers: { hp: 1.0, mp: 1.0, str: 1.1, def: 0.8, int: 1.30, mnd: 1.2 } },
        Boss: { statMultipliers: { hp: 1.0, mp: 1.5, str: 2.0, def: 1.5, int: 1.3, mnd: 1.3 } }
    };

    const ORISONS = {
        Pyro: { name: 'Pyro', element: 'Fire', levelMultiplier: 1.00, mpCost: 5, aoe: true },
        Freeze: { name: 'Freeze', element: 'Frost', levelMultiplier: 1.4, mpCost: 5, aoe: true },
        Wave: { name: 'Wave', element: 'Hydro', levelMultiplier: 1.75, mpCost: 5, aoe: true },
        Lightning: { name: 'Lightning', element: 'Shock', levelMultiplier: 1.20, mpCost: 5, aoe: true },
        Pyro2: { name: 'Pyro+', element: 'Fire', levelMultiplier: 2.25, mpCost: 5, aoe: true },
        Corruption: { name: 'Corruption', element: 'Darkness', levelMultiplier: 2.75, mpCost: 5, aoe: true }
    };

    const DUNGEON_ENEMIES = [
        { weakling: { name: 'Rat', archetype: 'Weakling', abilities: [] }, bruiser: { name: 'Goblin', archetype: 'Bruiser', abilities: [{ name: "GoblinPunch", chance: 0.50, type: 'BruiserAbility' }] }, caster: { name: 'Kobold', archetype: 'Caster', abilities: [{ name: "Pyro", chance: 0.41, type: 'Orison' }] } },
        { weakling: { name: 'Sand Worm', archetype: 'Weakling', abilities: [] }, bruiser: { name: 'Thief', archetype: 'Bruiser', abilities: [{ name: "Backstab", chance: 0.50, type: 'BruiserAbility' }] }, caster: { name: 'Mummy', archetype: 'Caster', abilities: [{ name: "Lightning", chance: 0.50, type: 'Orison' }] } },
        { weakling: { name: 'Skeleton', archetype: 'Weakling', abilities: [] }, bruiser: { name: 'Ooze', archetype: 'Bruiser', abilities: [{ name: "AcidSplash", chance: 0.50, type: 'BruiserAbility' }] }, caster: { name: 'Banshee', archetype: 'Caster', abilities: [{ name: "Freeze", chance: 0.70, type: 'Orison' }] } },
        { weakling: { name: 'Raptor', archetype: 'Weakling', abilities: [] }, bruiser: { name: 'Megasaurus', archetype: 'Bruiser', abilities: [{ name: "Stomp", chance: 0.50, type: 'BruiserAbility' }] }, caster: { name: 'Nessiedon', archetype: 'Caster', abilities: [{ name: "Wave", chance: 0.70, type: 'Orison' }] } },
        { weakling: { name: 'Doomhound', archetype: 'Weakling', abilities: [] }, bruiser: { name: 'Dracoguard', archetype: 'Bruiser', abilities: [{ name: "Slash", chance: 0.75, type: 'BruiserAbility' }] }, caster: { name: 'Elite Kobold', archetype: 'Caster', abilities: [{ name: "Pyro2", chance: 0.70, type: 'Orison' }] } },
        { weakling: { name: 'Mi-go', archetype: 'Weakling', abilities: [] }, bruiser: { name: 'Shoggoth', archetype: 'Bruiser', abilities: [{ name: "Crush", chance: 1.00, type: 'BruiserAbility' }] }, caster: { name: 'Elder Thing', archetype: 'Caster', abilities: [{ name: "Corruption", chance: 0.75, type: 'Orison' }] } }
    ];

    const WAVE_COMPOSITIONS = ["W", "WW", "B", "WB", "BB", "C", "CW", "BWW", "CBW", "CC", "WWWW", "BBC", "WWBC", "CBC"];

    const ENEMY_SPRITES = {
        'Rat': { src: 'https://i.imgur.com/e4JnC9d.png', width: 70, height: 70 },
        'Goblin': { src: 'https://i.imgur.com/Xcu9zE2.png', width: 80, height: 80 },
        'Kobold': { src: 'https://i.imgur.com/6pzi1E0.png', width: 80, height: 80 },
        'White Dragon': { src: 'https://i.imgur.com/CKrfmRI.png', width: 154, height: 154 },
        'Sand Worm': { src: 'https://i.imgur.com/xBJ4Zjs.png', width: 110, height: 110 },
        'Thief': { src: 'https://i.imgur.com/QdoIs9v.png', width: 90, height: 90 },
        'Mummy': { src: 'https://i.imgur.com/wYb4a7D.png', width: 90, height: 90 },
        'Blue Dragon': { src: 'https://i.imgur.com/K8Nf61W.png', width: 150, height: 150 },
        'Skeleton': { src: 'https://i.imgur.com/aqz2BhZ.png', width: 90, height: 90 },
        'Ooze': { src: 'https://i.imgur.com/bw5bxXL.png', width: 120, height: 120 },
        'Banshee': { src: 'https://i.imgur.com/eDqsh10.png', width: 90, height: 90 },
        'Black Dragon': { src: 'https://i.imgur.com/BjClt4D.png', width: 150, height: 150 },
        'Raptor': { src: 'https://i.imgur.com/VzONkiC.png', width: 105, height: 105 },
        'Megasaurus': { src: 'https://i.imgur.com/JjFq2lP.png', width: 150, height: 150 },
        'Nessiedon': { src: 'https://i.imgur.com/iwR4yRM.png', width: 125, height: 125 },
        'Green Dragon': { src: 'https://i.imgur.com/4Jmsp45.png', width: 150, height: 150 },
        'Doomhound': { src: 'https://i.imgur.com/Qkp0tB0.png', width: 90, height: 90 },
        'Dracoguard': { src: 'https://i.imgur.com/cxRSWSh.png', width: 120, height: 120 },
        'Elite Kobold': { src: 'https://i.imgur.com/NEvOD5x.png', width: 95, height: 95 },
        'Red Dragon': { src: 'https://i.imgur.com/EEMmCrp.png', width: 150, height: 150 },
        'Mi-go': { src: 'https://i.imgur.com/1QONqdF.png', width: 85, height: 85 },
        'Shoggoth': { src: 'https://i.imgur.com/VjFQY3g.png', width: 130, height: 130 },
        'Elder Thing': { src: 'https://i.imgur.com/CG48Kwh.png', width: 100, height: 100 },
        'King in Yellow': { src: 'https://i.imgur.com/vwJ9eBE.png', width: 150, height: 150 },
    };

    const PLAYER_SPRITES = {
        'Barbarian': { src: 'https://i.imgur.com/Id39qQz.png', width: 120, height: 120 },
        'Valkyrie': { src: 'https://i.imgur.com/2ZpPiAx.png', width: 100, height: 100 },
        'Ninja': { src: 'https://i.imgur.com/MjTiI3c.png', width: 100, height: 100 },
        'Shaman': { src: 'https://i.imgur.com/O0e0QCB.png', width: 110, height: 110 },
        'Sorceress': { src: 'https://i.imgur.com/sMfxdhj.png', width: 100, height: 100 },
        'Bishop': { src: 'https://i.imgur.com/tTO0Ell.png', width: 100, height: 100 },
        'Monk': { src: 'https://i.imgur.com/QG9vhk2.png', width: 100, height: 100 }
    };

    const ELEMENT_DEBUFF_MAP = { 'Fire': 'str', 'Frost': 'def', 'Shock': 'int', 'Hydro': 'mnd', 'Darkness': ['str', 'def', 'int', 'mnd'] };

    // --- Character Class ---
    class Character {
        constructor(id, className) {
            this.id = id;
            this.name = className;
            this.className = className;
            this.level = 0;
            const d = CLASS_DATA[this.className];
            this.baseHp = d.baseHp; this.baseMp = d.baseMp;
            this.baseStr = d.baseStr; this.baseDef = d.baseDef;
            this.baseInt = d.baseInt; this.baseMnd = d.baseMnd;
            this.maxHp = d.baseHp; this.maxMp = d.baseMp;
            this.str = d.baseStr; this.def = d.baseDef;
            this.int = d.baseInt; this.mnd = d.baseMnd;
            this.currentHp = this.maxHp; this.currentMp = this.maxMp;
            this.statusEffects = []; this.isAlive = true; this.isRaging = false;
            this.powers = [...d.initialPowers]; this.commands = [...d.commands];
            this.limitGauge = 0;
            this.specialName = SPECIAL_NAMES[className] || 'Special';
        }

        recalculateStats() {
            const classData = CLASS_DATA[this.className];
            this.baseHp = classData.baseHp; this.baseMp = classData.baseMp;
            this.baseStr = classData.baseStr; this.baseDef = classData.baseDef;
            this.baseInt = classData.baseInt; this.baseMnd = classData.baseMnd;
            this.maxHp = classData.baseHp; this.maxMp = classData.baseMp;
            this.str = classData.baseStr; this.def = classData.baseDef;
            this.int = classData.baseInt; this.mnd = classData.baseMnd;
            const storedLevel = this.level; this.level = 0;
            for (let i = 1; i <= storedLevel; i++) { this.applyLevelUpGrowth(i); }
            this.level = storedLevel;
            if (this.className === 'Barbarian' || this.className === 'Monk') { this.maxMp = 0; this.baseMp = 0; }
            const d = CLASS_DATA[this.className];
            this.powers = [...d.initialPowers]; this.commands = [...d.commands];
            for (let i = 1; i <= this.level; i++) {
                if (UNLOCK_SCHEDULE[i]?.[this.className]) {
                    UNLOCK_SCHEDULE[i][this.className].forEach(p => { if (!this.powers.includes(p)) this.powers.push(p); });
                }
            }
            this.specialName = SPECIAL_NAMES[this.className] || 'Special';
            this.fullRestore();
        }

        applyLevelUpGrowth(lvl) {
            this.level = lvl; const g = CLASS_DATA[this.className].growth;
            let hp = 0, mp = 0, str = 1, def = 1, int = 1, mnd = 1;
            hp += g.hp || 0; mp += g.mp || 0;
            if (this.className === 'Barbarian' || this.className === 'Monk') { str += g.str; def += g.def; }
            else if (this.className === 'Sorceress' || this.className === 'Bishop') { int += g.int; mnd += g.mnd; }
            else if (this.className === 'Valkyrie' || this.className === 'Ninja') {
                if (lvl % 2 === 0) { str += 1; int += 1; } else { def += 1; mnd += 1; }
            } else if (this.className === 'Shaman') { int += g.int; if (lvl % 2 === 0) mnd += 1; else def += 1; }
            if (lvl > 1) { this.maxHp = Math.round(this.maxHp * 1.05); if (this.baseMp > 0) this.maxMp = Math.round(this.maxMp * 1.05); }
            this.maxHp += hp; this.maxMp += mp; this.str += str; this.def += def; this.int += int; this.mnd += mnd;
            this.maxHp = Math.min(this.maxHp, 9999); this.maxMp = Math.min(this.maxMp, 999);
        }

        levelUp() {
            const nL = this.level + 1; this.applyLevelUpGrowth(nL);
            if (UNLOCK_SCHEDULE[this.level]?.[this.className]) {
                UNLOCK_SCHEDULE[this.level][this.className].forEach(p => {
                    if (!this.powers.includes(p)) { this.powers.push(p); gameState.addLogMessage(`${this.name} learned ${p}!`); }
                });
            }
        }

        fullRestore() {
            this.currentHp = this.maxHp; this.currentMp = this.maxMp;
            this.statusEffects = this.statusEffects.filter(s => s.isPermanent);
            this.isAlive = this.currentHp > 0; this.isRaging = false;
            ['Empower1', 'Empower2', 'Empower3', 'Fury', 'Lifelink', 'Slow', 'Poison', 'Dodge', 'Taunt'].forEach(s => this.removeStatus(s));
        }

        getCurrentStat(sName) {
            let val = this[sName];
            this.statusEffects.forEach(e => {
                if (e[`${sName}Bonus`]) val += e[`${sName}Bonus`];
                if (e[`${sName}Reduction`]) val -= e[`${sName}Reduction`];
            });
            return Math.max(0, val);
        }

        takeDamage(amt) {
            if (!this.isAlive) return 0;
            const hasDodge = this.statusEffects.some(e => e.type === 'Dodge');
            if (hasDodge) {
                gameState.addLogMessage(`${this.name} dodges the attack!`);
                flashSprite(this.id, 'cyan', 150);
                return 0;
            }
            const damageMultiplier = this.isRaging ? 2 : 1;
            const finalAmount = amt * damageMultiplier;
            this.currentHp -= Math.round(finalAmount);
            if (this.maxHp > 0) {
                const percentageLost = (Math.round(finalAmount) / this.maxHp) * 100;
                const gaugeIncrease = percentageLost * 0.5;
                updateLimitGauge(this, gaugeIncrease);
            }
            if (this.currentHp <= 0) {
                this.currentHp = 0; this.isAlive = false; this.isRaging = false;
                this.statusEffects = this.statusEffects.filter(s => s.isPermanent);
                resetLimitGauge(this);
                gameState.addLogMessage(`${this.name} KO!`);
            }
            return Math.round(finalAmount);
        }

        heal(amt) { if (!this.isAlive) return 0; const heal = Math.max(0, amt); const prev = this.currentHp; this.currentHp = Math.min(this.maxHp, this.currentHp + heal); return this.currentHp - prev; }
        useMp(amt) { if (this.currentMp < amt) return false; this.currentMp -= amt; return true; }
        restoreMp(amt) { if (!this.isAlive) return 0; const r = Math.max(0, amt); const p = this.currentMp; this.currentMp = Math.min(this.maxMp, this.currentMp + r); return this.currentMp - p; }
        addStatus(effect) {
            const idx = this.statusEffects.findIndex(s => s.type === effect.type);
            if (idx !== -1) {
                if (effect.type === 'Empower1' || effect.type === 'Empower2' || effect.type === 'Empower3') {
                    this.statusEffects = this.statusEffects.filter(s => s.type !== 'Empower1' && s.type !== 'Empower2' && s.type !== 'Empower3');
                } else if (effect.type === 'Fury' || effect.type === 'Lifelink' || effect.type === 'Dodge' || effect.type === 'Taunt') {
                    this.statusEffects.splice(idx, 1);
                } else { return false; }
            }
            this.statusEffects.push({ ...effect }); return true;
        }
        removeStatus(sType) { const l = this.statusEffects.length; this.statusEffects = this.statusEffects.filter(s => s.type !== sType); return this.statusEffects.length < l; }
        clearNegativeStatuses() { const neg = ['Poison', 'Slow']; let r = false; this.statusEffects = this.statusEffects.filter(s => { if (neg.includes(s.type)) { r = true; return false; } return true; }); return r; }
    }

    // --- Game State Manager ---
    const gameState = {
        currentWave: 0, currentDungeon: 0, party: [], enemies: [], currentState: 'TITLE_SCREEN', partySelectionIndex: 0, selectedClasses: [null, null, null, null], tempSelectedClass: CLASS_LIST[0], activeCharacterIndex: 0, currentAction: null, messageLog: [], nextWaveEffect: null, activeMenu: 'main', focusedIndex: 0, actionQueue: [],
        addLogMessage(msg) { this.messageLog.push(msg); if (this.messageLog.length > 50) this.messageLog.shift(); },
        getCharacterById(id) { return this.party.find(c => c.id === id); },
        getEnemyById(id) { return this.enemies.find(e => e.id === id); },
        setState(newState) { console.log(`State: ${this.currentState} -> ${newState}`); this.currentState = newState; this.updateUIForState(); },
        updateUIForState() {
            const overlays = ['title-screen', 'party-select-screen', 'item-choice-screen', 'tavern-screen', 'game-over-screen', 'victory-screen'];
            const combatUIContainers = ['battlefield-enemy-area', 'battlefield-party-area', 'ui-main-box'];
            const dynamicMenuContent = document.getElementById('dynamic-menu-content');
            overlays.forEach(id => document.getElementById(id).style.display = 'none');
            combatUIContainers.forEach(id => document.getElementById(id).style.display = 'none');
            if (dynamicMenuContent) dynamicMenuContent.innerHTML = '';
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
                case 'VICTORY_SCREEN': document.getElementById('victory-screen').style.display = 'flex'; setupVictoryScreen(); break;
            }
            updateProgressDisplay();
        }
    };

    // --- Limit Gauge Functions ---
    function updateLimitGauge(character, percentageIncrease) {
        if (!character.isAlive) return;
        character.limitGauge += percentageIncrease;
        character.limitGauge = Math.min(100, character.limitGauge);
        character.limitGauge = Math.max(0, character.limitGauge);
        updateLimitGaugeUI(character);
        if (character.limitGauge >= 100) {
            gameState.addLogMessage(`${character.name}'s Special is ready!`);
        }
    }

    function resetLimitGauge(character) {
        character.limitGauge = 0;
        updateLimitGaugeUI(character);
    }

    function grantKillCredit(killerCharacter) {
        if (killerCharacter && gameState.party.includes(killerCharacter)) {
            updateLimitGauge(killerCharacter, 2.0);
        }
        gameState.party.forEach(char => {
            if (char.isAlive && char.id !== killerCharacter?.id) {
                updateLimitGauge(char, 1.0);
            }
        });
    }

    function createLimitGaugeElement(character) {
        const spriteElement = document.getElementById(character.id + '-sprite');
        if (!spriteElement) return;
        const existing = document.getElementById(`${character.id}-limit-gauge`);
        if (existing) existing.remove();
        const gaugeContainer = document.createElement('div');
        gaugeContainer.className = 'limit-gauge';
        gaugeContainer.id = `${character.id}-limit-gauge`;
        const gaugeFill = document.createElement('div');
        gaugeFill.className = 'limit-gauge-fill charging';
        gaugeFill.id = `${character.id}-limit-gauge-fill`;
        gaugeFill.style.width = `${character.limitGauge}%`;
        const gaugeText = document.createElement('div');
        gaugeText.className = 'limit-gauge-text';
        gaugeText.id = `${character.id}-limit-gauge-text`;
        gaugeText.textContent = `${Math.floor(character.limitGauge)}%`;
        gaugeContainer.appendChild(gaugeFill);
        gaugeContainer.appendChild(gaugeText);
        spriteElement.appendChild(gaugeContainer);
    }

    function updateLimitGaugeUI(character) {
        const fillElement = document.getElementById(`${character.id}-limit-gauge-fill`);
        const textElement = document.getElementById(`${character.id}-limit-gauge-text`);
        if (!fillElement || !textElement) return;
        fillElement.style.width = `${character.limitGauge}%`;
        textElement.textContent = `${Math.floor(character.limitGauge)}%`;
        if (character.limitGauge >= 100) {
            fillElement.classList.remove('charging');
            fillElement.classList.add('ready');
        } else {
            fillElement.classList.remove('ready');
            fillElement.classList.add('charging');
        }
    }

    function initializeLimitGauges() {
        gameState.party.forEach(character => {
            createLimitGaugeElement(character);
        });
    }

    // --- Stat Debuff Functions ---
    function addStatDebuffIndicator(targetId, statType, durationTurns) {
        let elementId = targetId.startsWith("party-") ? targetId + "-sprite" : targetId;
        setTimeout(() => {
            const targetElement = document.getElementById(elementId);
            if (!targetElement) return;
            const debuffIndicator = document.createElement('div');
            debuffIndicator.className = `stat-debuff-indicator ${statType.toLowerCase()}`;
            debuffIndicator.textContent = `-${statType.toUpperCase()}`;
            debuffIndicator.id = `${elementId}-${statType.toLowerCase()}-debuff`;
            debuffIndicator.style.backgroundColor = "rgba(0,0,0,0.4)";
            const existingDebuff = document.getElementById(debuffIndicator.id);
            if (existingDebuff && existingDebuff.parentNode) existingDebuff.parentNode.removeChild(existingDebuff);
            targetElement.appendChild(debuffIndicator);
        }, 50);
    }

    function applyStatDebuff(target, statType, magnitude) {
        const reductionPercent = 0.15 + ((magnitude - 1) * 0.05);
        const turns = magnitude;
        const baseStat = target[statType] || 0;
        const reductionAmount = Math.ceil(baseStat * reductionPercent);
        const debuff = { type: `${statType}Debuff`, turns: turns, [`${statType}Reduction`]: reductionAmount, isPermanent: false };
        if (target.addStatus) target.addStatus(debuff);
        else if (target.statusEffects) { target.statusEffects = target.statusEffects.filter(s => s.type !== debuff.type); target.statusEffects.push(debuff); }
        addStatDebuffIndicator(target.id, statType, turns);
    }

    // --- Calculation Helper Functions ---
    function calculatePhysicalDamage(attacker, defender) {
        const attackerStr = attacker.getCurrentStat ? attacker.getCurrentStat('str') : attacker.str;
        const defenderDef = defender.getCurrentStat ? defender.getCurrentStat('def') : defender.def;
        let baseMultiplier = attacker.isRaging ? 3.00 : (1.5 + Math.random() * 0.45);
        let offenseValue = (attacker.level + attackerStr) * baseMultiplier;
        let defenseValue = (defender.level + defenderDef);
        let rawDamage = offenseValue - defenseValue;
        return Math.max(1, Math.round(rawDamage));
    }

    function calculateMagicDamage(caster, target, spellLvl) {
        const cI = caster.getCurrentStat ? caster.getCurrentStat('int') : caster.int;
        const tM = target.getCurrentStat ? target.getCurrentStat('mnd') : target.mnd;
        const rM = 1.5 + Math.random() * 0.45;
        const oV = ((caster.level + cI) * spellLvl) * rM;
        const dV = (target.level + tM);
        return Math.max(1, Math.round(oV - dV));
    }

    function calculateHealing(caster, prayerLvl) {
        const cI = caster.getCurrentStat ? caster.getCurrentStat('int') : caster.int;
        let base, mult, levelBonus;
        switch (prayerLvl) { case 1: base = 15; mult = 0.75; levelBonus = caster.level; break; case 2: base = 40; mult = 0.95; levelBonus = caster.level * 3.75; break; case 3: base = 100; mult = 1.5; levelBonus = caster.level * 6; break; default: base = 10; mult = 0.4; levelBonus = 0; }
        return Math.max(1, Math.round(base + ((caster.level + cI) * mult) + levelBonus));
    }

    function calculateHeal1Amount(caster) {
        const cI = caster.getCurrentStat ? caster.getCurrentStat('int') : caster.int;
        const pF = 1.2 * (caster.level + cI);
        const rM = 1.0 + Math.random() * 0.15;
        return Math.max(1, Math.round((pF * rM) + caster.level));
    }

    function calculateOrisonDamage(caster, target) {
        const casterInt = caster.getCurrentStat ? caster.getCurrentStat('int') : caster.int;
        const targetMnd = target.getCurrentStat ? target.getCurrentStat('mnd') : target.mnd;
        const offenseValue = ((caster.level + casterInt) * 1.25) * (1.5 + Math.random() * 0.45);
        const defenseValue = (target.level + targetMnd);
        return Math.max(1, Math.round(offenseValue - defenseValue));
    }

    // --- Visual Effect Helpers ---
    function getCorrectElementId(actorOrTargetId) {
        if (gameState.party.some(p => p.id === actorOrTargetId)) return actorOrTargetId + "-sprite";
        return actorOrTargetId;
    }

    function flashSprite(id, color = 'white', dur = 150) {
        const elementId = getCorrectElementId(id);
        const element = document.getElementById(elementId);
        if (element) {
            const flashEffect = document.createElement('div');
            flashEffect.className = 'flash-effect';
            flashEffect.style.backgroundColor = color;
            flashEffect.style.opacity = '0.7';
            element.appendChild(flashEffect);
            setTimeout(() => {
                flashEffect.style.opacity = '0';
                flashEffect.style.transition = `opacity ${dur / 2}ms ease-out`;
                setTimeout(() => { if (element.contains(flashEffect)) element.removeChild(flashEffect); }, dur / 2);
            }, dur / 2);
        }
    }

    function shimmerSprite(id, color = 'gold', dur = 1400) {
        const elementId = getCorrectElementId(id);
        const element = document.getElementById(elementId);
        if (element) {
            const shimmerDiv = document.createElement('div');
            shimmerDiv.className = 'shimmer-effect';
            shimmerDiv.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; border-radius: 5px; box-shadow: 0 0 15px 8px ${color}; opacity: 0.7; transition: opacity ${dur / 1000}s ease-out;`;
            element.appendChild(shimmerDiv);
            requestAnimationFrame(() => { setTimeout(() => { shimmerDiv.style.opacity = '0'; }, 50); });
            setTimeout(() => { if (element.contains(shimmerDiv)) element.removeChild(shimmerDiv); }, dur);
        }
    }

    function showFloatingNumber(targetId, amount, type = 'damage') {
        const elementId = getCorrectElementId(targetId);
        const tE = document.getElementById(elementId);
        if (!tE) return;
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
        nE.addEventListener('animationend', () => { if (nE.parentNode === cont) cont.removeChild(nE); }, { once: true });
    }

    let announcementTimeout = null;
    function showActionAnnouncement(text, duration = 1500, isSpecial = false) {
        const bar = document.getElementById('action-announcement-bar');
        const barText = document.getElementById('action-announcement-text');
        if (!bar || !barText) return;
        if (announcementTimeout) clearTimeout(announcementTimeout);
        if (isSpecial) {
            bar.classList.add('special-announcement');
            barText.classList.add('special-text');
        } else {
            bar.classList.remove('special-announcement');
            barText.classList.remove('special-text');
        }
        barText.textContent = text;
        bar.style.display = 'block';
        announcementTimeout = setTimeout(() => {
            bar.style.display = 'none';
            bar.classList.remove('special-announcement');
            barText.classList.remove('special-text');
            announcementTimeout = null;
        }, duration);
    }

    function applyCastingAnimation(actorId, castType, duration = 1000) {
        const elementId = getCorrectElementId(actorId);
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('casting-spell', 'casting-prayer', 'casting-rage', 'casting-fire', 'casting-frost', 'casting-shock', 'casting-hydro', 'casting-dragon-breath', 'casting-focus', 'casting-rapid', 'casting-zen', 'casting-kick', 'casting-taunt', 'casting-dodge');
            element.classList.add(`casting-${castType}`);
            setTimeout(() => { if (element) element.classList.remove(`casting-${castType}`); }, duration);
        }
    }

    // --- UI Update Functions ---
    function updatePartyStatusUI() {
        gameState.party.forEach((character, index) => {
            const statusBox = document.getElementById(`char-status-${index + 1}`);
            if (!statusBox) return;
            statusBox.classList.remove('ko', 'hp-critical', 'buffed', 'empower-buffed', 'fury-buffed', 'lifelink-buffed');
            statusBox.querySelectorAll('span').forEach(span => span.classList.remove('hp-critical', 'hp-ko', 'buffed'));
            const nameSpan = statusBox.querySelector('.char-name') || statusBox.children[0];
            const statusSpan = statusBox.querySelector('.char-status') || statusBox.children[1];
            const hpSpan = statusBox.querySelector('.char-hp') || statusBox.children[2];
            const mpSpan = statusBox.querySelector('.char-mp') || statusBox.children[3];
            if (nameSpan) nameSpan.textContent = character.name;
            if (hpSpan) hpSpan.innerHTML = `HP: <span class="hp-value">${character.currentHp}</span>/<span class="hp-max">${character.maxHp}</span>`;
            if (mpSpan) mpSpan.innerHTML = `MP: <span class="mp-value">${character.currentMp}</span>/<span class="mp-max">${character.maxMp}</span>`;
            const hasEmpowerBuff = character.statusEffects.some(e => e.type === 'Empower1' || e.type === 'Empower2' || e.type === 'Empower3');
            const hasFuryBuff = character.statusEffects.some(e => e.type === 'Fury');
            const hasLifelinkBuff = character.statusEffects.some(e => e.type === 'Lifelink');
            const hasDodgeBuff = character.statusEffects.some(e => e.type === 'Dodge');
            const hasTauntBuff = character.statusEffects.some(e => e.type === 'Taunt');
            const spriteElement = document.getElementById(`${character.id}-sprite`);
            if (spriteElement) {
                spriteElement.style.bottom = '25px';
                spriteElement.style.position = 'absolute';
                spriteElement.style.transform = 'none';
                spriteElement.classList.toggle('dodging', hasDodgeBuff);
                spriteElement.classList.toggle('taunting', hasTauntBuff);
            }
            if (statusSpan) {
                if (!character.isAlive) { statusSpan.textContent = "KO"; statusSpan.style.color = '#ff6666'; }
                else {
                    let buffs = [];
                    if (hasEmpowerBuff) { const buff = character.statusEffects.find(e => e.type.startsWith('Empower')); buffs.push(`E${buff.type.slice(-1)}(x${buff.damageMultiplier})`); }
                    if (hasFuryBuff) buffs.push('FURY');
                    if (hasLifelinkBuff) buffs.push('LIFE');
                    if (hasDodgeBuff) buffs.push('DODGE');
                    if (hasTauntBuff) buffs.push('TAUNT');
                    const negatives = character.statusEffects.filter(e => e.type === 'Poison' || e.type === 'Slow').map(e => e.type);
                    statusSpan.textContent = buffs.length > 0 ? buffs.join('+') + (negatives.length > 0 ? ' ' + negatives.join(' ') : '') : (negatives.length > 0 ? negatives.join(' ') : 'OK');
                    statusSpan.style.color = buffs.length > 0 ? '#ffffff' : '#ffee88';
                }
            }
            if (!character.isAlive) { if (nameSpan) nameSpan.classList.add('hp-ko'); if (hpSpan) hpSpan.classList.add('hp-ko'); if (mpSpan) mpSpan.classList.add('hp-ko'); statusBox.classList.add('ko'); }
            else if (character.maxHp > 0 && character.currentHp / character.maxHp < 0.33) { if (nameSpan) nameSpan.classList.add('hp-critical'); if (hpSpan) hpSpan.classList.add('hp-critical'); if (mpSpan) mpSpan.classList.add('hp-critical'); }
            statusBox.style.opacity = character.isAlive ? 1 : 0.6;
        });
    }

    function updateActionMenuUI(char) {
        const box = document.querySelector('#dynamic-menu-content .action-menu-box');
        if (!box) return;
        const btns = box.querySelectorAll('button');
        if (!char || !char.isAlive) { btns.forEach(b => { b.style.display = 'none'; b.disabled = true; }); return; }
        btns.forEach(b => {
            const a = b.dataset.action;
            if (!a) return;
            let available = char.commands.includes(a) || a === 'Special';
            if (a === 'Spell' && !char.powers.some(p => POWER_DATA[p]?.type === 'Spell')) available = false;
            if (a === 'Prayer' && !char.powers.some(p => POWER_DATA[p]?.type === 'Prayer')) available = false;
            if (a === 'Arts' && !char.powers.some(p => POWER_DATA[p]?.type === 'Art')) available = false;
            if (a === 'Special' && char.limitGauge < 100) available = false;
            b.style.display = available ? 'block' : 'none';
            b.disabled = !available;
        });
    }

    function updateEnemySpritesUI() {
        const enemyArea = document.getElementById('battlefield-enemy-area');
        enemyArea.innerHTML = '';
        gameState.enemies.forEach((enemy, index) => {
            const sprite = document.createElement('div');
            sprite.className = 'sprite enemy';
            sprite.id = enemy.id;
            const totalEnemies = gameState.enemies.length;
            const spacing = totalEnemies <= 3 ? 25 : 18;
            sprite.style.left = `${20 + index * spacing}%`;
            sprite.style.top = '50%';
            sprite.style.transform = 'translateY(-50%)';
            sprite.style.position = 'absolute';
            const spriteData = ENEMY_SPRITES[enemy.type];
            if (spriteData) {
                if (spriteData.width && spriteData.height) { sprite.style.width = `${spriteData.width}px`; sprite.style.height = `${spriteData.height}px`; }
                const spriteImg = document.createElement('img');
                spriteImg.src = spriteData.src;
                spriteImg.alt = enemy.type;
                spriteImg.className = 'enemy-sprite-img';
                spriteImg.onerror = () => { spriteImg.style.display = 'none'; sprite.textContent = enemy.type.substring(0, 3); sprite.style.backgroundColor = 'rgba(128, 128, 128, 0.7)'; };
                sprite.appendChild(spriteImg);
                sprite.style.backgroundColor = 'transparent';
            } else { sprite.textContent = enemy.name.substring(0, 3); }
            sprite.title = `${enemy.name} (HP: ${enemy.currentHp}/${enemy.maxHp})`;
            if (!enemy.isAlive) sprite.classList.add('ko');
            if (enemy.statusEffects) {
                enemy.statusEffects.forEach(effect => {
                    if (effect.type === 'Poison') sprite.classList.add('poisoned');
                    else if (effect.type === 'Slow') sprite.classList.add('slowed');
                });
            }
            enemyArea.appendChild(sprite);
        });
        const partyArea = document.getElementById('battlefield-party-area');
        partyArea.innerHTML = '';
        gameState.party.forEach((character, index) => {
            const sprite = document.createElement('div');
            sprite.className = 'sprite party-member';
            sprite.id = character.id + "-sprite";
            sprite.style.cssText = `left: ${20 + index * 20}% !important; bottom: 25px !important; position: absolute !important;`;
            const spriteData = PLAYER_SPRITES[character.className];
            if (spriteData) {
                if (spriteData.width && spriteData.height) { sprite.style.width = `${spriteData.width}px`; sprite.style.height = `${spriteData.height}px`; }
                const spriteImg = document.createElement('img');
                spriteImg.src = spriteData.src;
                spriteImg.alt = character.className;
                spriteImg.className = 'player-sprite-img';
                spriteImg.onerror = () => { spriteImg.style.display = 'none'; sprite.textContent = character.className.substring(0, 3); sprite.style.backgroundColor = 'rgba(128, 128, 128, 0.7)'; };
                sprite.appendChild(spriteImg);
                sprite.style.backgroundColor = 'transparent';
            } else { sprite.textContent = character.name.substring(0, 3); }
            sprite.title = `${character.name} (HP: ${character.currentHp}/${character.maxHp})`;
            if (!character.isAlive) sprite.classList.add('ko');
            const hasDodgeBuff = character.statusEffects.some(e => e.type === 'Dodge');
            const hasTauntBuff = character.statusEffects.some(e => e.type === 'Taunt');
            if (hasDodgeBuff) sprite.classList.add('dodging');
            if (hasTauntBuff) sprite.classList.add('taunting');
            partyArea.appendChild(sprite);
        });
        initializeLimitGauges();
    }

    function updatePartySelectUI() {
        const cont = document.getElementById('party-select-slots');
        cont.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            const d = document.createElement('div');
            d.className = 'party-select-slot';
            d.id = `select-slot-${i}`;
            let cN = '', conf = false, act = (i === gameState.partySelectionIndex);
            if (i < gameState.partySelectionIndex) { cN = gameState.selectedClasses[i]; conf = true; }
            else if (i === gameState.partySelectionIndex) { cN = gameState.tempSelectedClass; }
            else { cN = '---'; }
            d.innerHTML = `Character ${i + 1}: <span class="selected-class"></span>`;
            const s = d.querySelector('.selected-class');
            s.textContent = cN;
            CLASS_LIST.forEach(c => s.classList.remove(c));
            if (cN !== '---' && CLASS_DATA[cN]) s.classList.add(cN);
            if (act) d.classList.add('active');
            if (conf) d.classList.add('confirmed');
            cont.appendChild(d);
        }
    }

    function highlightActivePartyStatus(index) {
        document.querySelectorAll('#party-status-area > .character-status-box').forEach((b, i) => {
            if (i === index && gameState.party[index]?.isAlive) { b.classList.add('highlighted'); }
            else { b.classList.remove('highlighted'); }
        });
    }

    function updateDungeonBackground() {
        const bgElement = document.getElementById('game-background');
        if (!bgElement) return;
        
        let backgroundUrl;
        if (gameState.currentWave >= 91) {
            // Arena: Fixed arena background
            backgroundUrl = 'https://i.imgur.com/Kxs7cI2.png';
        } else {
            // Normal: Background based on dungeon
            const dungeonIndex = Math.min(DUNGEON_BACKGROUNDS.length - 1, Math.floor((gameState.currentWave - 1) / 15));
            backgroundUrl = DUNGEON_BACKGROUNDS[dungeonIndex];
        }
        
        if (backgroundUrl) bgElement.style.backgroundImage = `url('${backgroundUrl}')`;
        else bgElement.style.backgroundImage = 'none';
    }

    function updateProgressDisplay() {
        const progressDisplay = document.getElementById('progress-info-display');
        const currentWaveSpan = document.getElementById('current-wave');
        const dungeonNameDiv = document.getElementById('dungeon-name');
        if (!progressDisplay || !currentWaveSpan || !dungeonNameDiv) return;
        if (gameState.currentState === 'PLAYER_COMMAND' || gameState.currentState === 'ACTION_RESOLUTION' || gameState.currentState === 'BETWEEN_WAVES') {
            progressDisplay.style.display = 'block';
        } else { progressDisplay.style.display = 'none'; return; }
        
        const isArena = gameState.currentWave >= 91;
        if (isArena) {
            // Arena: Show total wave number
            currentWaveSpan.textContent = gameState.currentWave;
            dungeonNameDiv.textContent = "Arena";
        } else {
            // Normal dungeons: Show wave within dungeon
            const waveInDungeon = ((gameState.currentWave - 1) % 15) + 1;
            currentWaveSpan.textContent = waveInDungeon;
            const dungeonIndex = Math.floor((gameState.currentWave - 1) / 15);
            const dungeonNames = ["Overworld", "Desert", "Catacombs", "Jungle", "Badlands", "???"];
            dungeonNameDiv.textContent = dungeonNames[dungeonIndex] || `Dungeon ${dungeonIndex + 1}`;
        }
    }

    // --- Initialization Function ---
    function initializeGame() {
        gameState.currentWave = 0; gameState.currentDungeon = 0; gameState.messageLog = []; gameState.party = []; gameState.enemies = []; gameState.nextWaveEffect = null; gameState.partySelectionIndex = 0; gameState.selectedClasses = [null, null, null, null]; gameState.tempSelectedClass = CLASS_LIST[0]; gameState.activeMenu = 'main'; gameState.focusedIndex = 0; gameState.actionQueue = [];
        const bgElement = document.getElementById('game-background');
        if (bgElement) bgElement.style.backgroundImage = 'none';
        gameState.setState('TITLE_SCREEN');
        setupGlobalKeyListener();
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
                    const hasSpecial = char.limitGauge >= 100;
                    if (hasSpecial) {
                        const specialBtn = document.createElement('button');
                        specialBtn.dataset.action = 'Special';
                        specialBtn.textContent = '✨ Special ✨';
                        specialBtn.classList.add('special-ready');
                        menuContainer.appendChild(specialBtn);
                    }
                    ['Attack', 'Spell', 'Prayer', 'Rage', 'Arts'].forEach(cmd => {
                        let available = char.commands.includes(cmd);
                        if (cmd === 'Attack' && hasSpecial) available = false;
                        if (cmd === 'Spell' && !char.powers.some(p => POWER_DATA[p]?.type === 'Spell')) available = false;
                        if (cmd === 'Prayer' && !char.powers.some(p => POWER_DATA[p]?.type === 'Prayer')) available = false;
                        if (cmd === 'Arts' && !char.powers.some(p => POWER_DATA[p]?.type === 'Art')) available = false;
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
            case 'Spell': case 'Prayer':
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
            case 'Arts':
                menuContainer.className = 'sub-menu-box';
                const monk = gameState.party[gameState.activeCharacterIndex];
                const artsList = monk.powers.filter(p => POWER_DATA[p]?.type === 'Art');
                if (artsList.length > 0) {
                    artsList.forEach(pN => {
                        const btn = document.createElement('button');
                        btn.dataset.power = pN;
                        btn.textContent = `${pN} (0 MP)`;
                        btn.disabled = false;
                        menuContainer.appendChild(btn);
                    });
                } else {
                    menuContainer.innerHTML = `<p style="color: #aaa;">No Arts known.</p>`;
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
                    if (targetEnemies) { valid = t.isAlive; }
                    else { if (power?.target === 'ally_ko') valid = !t.isAlive; else if (pName === 'Miracle') valid = true; else valid = t.isAlive; }
                    if (valid) {
                        found = true;
                        const b = document.createElement('button');
                        b.dataset.targetId = t.id;
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
    function setupGlobalKeyListener() {
        document.removeEventListener('keydown', handleGlobalKeyPress);
        document.addEventListener('keydown', handleGlobalKeyPress);
    }

    function handleGlobalKeyPress(event) {
        let prevent = false;
        switch (gameState.currentState) {
            case 'TITLE_SCREEN': if (event.key === 'Enter') { prevent = true; gameState.setState('PARTY_SELECTION'); } break;
            case 'PARTY_SELECTION': prevent = true; handlePartySelectKeyPress(event); break;
            case 'PLAYER_COMMAND': prevent = handleCombatKeyPress(event); break;
            case 'GAME_OVER': if (event.key === 'Enter') { prevent = true; document.getElementById('restart-button')?.click(); } break;
        }
        if (prevent) event.preventDefault();
    }

    function handlePartySelectKeyPress(event) {
        const curI = CLASS_LIST.indexOf(gameState.tempSelectedClass);
        let newI = curI;
        switch (event.key) {
            case 'ArrowUp': case 'ArrowLeft': newI = (curI - 1 + CLASS_LIST.length) % CLASS_LIST.length; break;
            case 'ArrowDown': case 'ArrowRight': newI = (curI + 1) % CLASS_LIST.length; break;
            case 'Enter':
                gameState.selectedClasses[gameState.partySelectionIndex] = gameState.tempSelectedClass;
                gameState.partySelectionIndex++;
                if (gameState.partySelectionIndex >= 4) finalizePartySelection();
                else { gameState.tempSelectedClass = CLASS_LIST[0]; updatePartySelectUI(); }
                return;
            case 'Shift': case 'Escape':
                if (gameState.partySelectionIndex > 0) {
                    gameState.partySelectionIndex--;
                    gameState.tempSelectedClass = gameState.selectedClasses[gameState.partySelectionIndex] || CLASS_LIST[0];
                    gameState.selectedClasses[gameState.partySelectionIndex] = null;
                    updatePartySelectUI();
                }
                return;
        }
        if (newI !== curI) { gameState.tempSelectedClass = CLASS_LIST[newI]; updatePartySelectUI(); }
    }

    function setupCombatButtonListeners() {
        const contentArea = document.getElementById('dynamic-menu-content');
        if (contentArea) {
            contentArea.removeEventListener('click', handleCombatButtonClick);
            contentArea.addEventListener('click', handleCombatButtonClick);
        }
    }

    function handleCombatButtonClick(e) {
        if (e.target.tagName === 'BUTTON' && gameState.currentState === 'PLAYER_COMMAND') {
            const button = e.target;
            if (button.dataset.action) handleActionClick(button);
            else if (button.dataset.power) handlePowerSelection(button);
            else if (button.dataset.targetId) handleTargetSelection(button);
            else if (button.textContent === "Back") handleMenuCancel();
        }
    }

    function handleCombatKeyPress(event) {
        let handled = false;
        const menuEl = document.querySelector('#dynamic-menu-content > div');
        if (!menuEl) return false;
        const btns = getVisibleEnabledButtons(menuEl);
        if (btns.length === 0) { if (event.key === 'Shift' || event.key === 'Escape') { handleMenuCancel(); return true; } return false; }
        let curF = gameState.focusedIndex;
        if (curF < 0 || curF >= btns.length) curF = 0;
        let newF = curF;
        switch (event.key) {
            case 'ArrowUp': newF = (curF - 1 + btns.length) % btns.length; handled = true; break;
            case 'ArrowDown': newF = (curF + 1) % btns.length; handled = true; break;
            case 'Enter': if (btns[curF]) btns[curF].click(); handled = true; break;
            case 'Shift': case 'Escape': handleMenuCancel(); handled = true; break;
        }
        if (handled && newF !== curF) { updateMenuFocus(btns, newF); gameState.focusedIndex = newF; }
        return handled;
    }

    function getVisibleEnabledButtons(parent) {
        if (!parent) return [];
        return Array.from(parent.querySelectorAll('button')).filter(b => !b.disabled && b.style.display !== 'none' && b.offsetParent !== null);
    }

    function updateMenuFocus(btns, newIdx) {
        btns.forEach((b, i) => { if (i === newIdx) b.classList.add('focused'); else b.classList.remove('focused'); });
    }

    function handleMenuCancel() {
        switch (gameState.activeMenu) {
            case 'Spell': case 'Prayer': case 'Arts': populateMenu('main'); gameState.currentAction = null; break;
            case 'targets':
                const aT = gameState.currentAction?.type;
                if (aT === 'Spell') populateMenu('Spell');
                else if (aT === 'Prayer') populateMenu('Prayer');
                else if (aT === 'Art') populateMenu('Arts');
                else { populateMenu('main'); gameState.currentAction = null; }
                break;
            case 'main': break;
        }
    }

    function resetFocusToMenu(menuName) {
        gameState.activeMenu = menuName;
        const menuEl = document.querySelector('#dynamic-menu-content > div');
        if (menuEl) {
            const btns = getVisibleEnabledButtons(menuEl);
            if (btns.length > 0) { gameState.focusedIndex = 0; updateMenuFocus(btns, 0); }
            else { gameState.focusedIndex = -1; }
        } else { gameState.focusedIndex = -1; }
    }

    // --- Action Handling ---
    function handleActionClick(button) {
        const aT = button.dataset.action;
        const char = gameState.party[gameState.activeCharacterIndex];
        if (!char || !char.isAlive || button.disabled) return;
        gameState.currentAction = { type: aT, casterId: char.id, targets: [] };
        switch (aT) {
            case 'Attack': case 'Rage': populateMenu('targets', true); break;
            case 'Spell': populateMenu('Spell'); break;
            case 'Prayer': populateMenu('Prayer'); break;
            case 'Arts': populateMenu('Arts'); break;
            case 'Special':
                gameState.currentAction = { type: 'Special', casterId: char.id, specialName: char.specialName, targets: [] };
                queueAction(char.id, gameState.currentAction);
                gameState.currentAction = null;
                highlightActivePartyStatus(-1);
                prepareCommandPhase();
                break;
            default: populateMenu('main');
        }
    }

    function handlePowerSelection(button) {
        const pN = button.dataset.power;
        const p = POWER_DATA[pN];
        const caster = gameState.party[gameState.activeCharacterIndex];
        if (!p || (p.cost > 0 && caster.currentMp < p.cost)) { gameState.addLogMessage(`${caster.name} needs more MP for ${pN}!`); return; }
        gameState.currentAction.powerName = pN;
        gameState.currentAction.powerCost = p.cost;
        gameState.currentAction.type = p.type;
        if (p.target === 'enemies' || p.target === 'allies' || p.target === 'all_enemies' || p.target === 'random_enemies') {
            gameState.currentAction.targets = (p.target === 'enemies' || p.target === 'all_enemies' || p.target === 'random_enemies') ? gameState.enemies.filter(e => e.isAlive).map(e => e.id) : gameState.party.filter(pl => pl.isAlive).map(pl => pl.id);
            queueAction(caster.id, gameState.currentAction);
            gameState.currentAction = null;
            highlightActivePartyStatus(-1);
            prepareCommandPhase();
        } else if (p.target === 'self') {
            gameState.currentAction.targets = [caster.id];
            queueAction(caster.id, gameState.currentAction);
            gameState.currentAction = null;
            highlightActivePartyStatus(-1);
            prepareCommandPhase();
        } else {
            const targetsEnemies = p.target === 'enemy' || p.target === 'enemies';
            populateMenu('targets', targetsEnemies);
        }
    }

    function handleTargetSelection(button) {
        const tId = button.dataset.targetId;
        gameState.currentAction.targets = [tId];
        if (gameState.currentState === 'PLAYER_COMMAND') {
            const act = gameState.currentAction;
            const cast = gameState.getCharacterById(act.casterId);
            queueAction(cast.id, act);
            gameState.currentAction = null;
            highlightActivePartyStatus(-1);
            prepareCommandPhase();
        }
    }

    // --- Core Game Logic ---
    function finalizePartySelection() {
        gameState.party = [];
        gameState.selectedClasses.forEach((cN, i) => {
            if (!cN) cN = 'Barbarian';
            const c = new Character(`party-${i + 1}`, cN);
            const TESTING_START_LEVEL = 1;
            for (let level = 1; level <= TESTING_START_LEVEL; level++) { c.applyLevelUpGrowth(level); }
            c.fullRestore();
            gameState.party.push(c);
        });
        gameState.setState('COMBAT_LOADING');
        setupCombatButtonListeners();
        startNextWave();
    }

    function startNextWave() {
        gameState.currentWave++;
        gameState.addLogMessage(`Wave ${gameState.currentWave}`);
        gameState.party.forEach(c => { if (c.isRaging) c.isRaging = false; });
        updateDungeonBackground();
        updateProgressDisplay();
        gameState.enemies = generateEnemiesForWave(gameState.currentWave);
        gameState.actionQueue = [];
        gameState.nextWaveEffect = null;
        gameState.activeCharacterIndex = 0;
        gameState.setState('PLAYER_COMMAND');
        prepareCommandPhase();
    }

    // Arena enemy pools (all enemies from all worlds)
    const ARENA_ENEMY_POOLS = {
        weaklings: [
            { name: 'Rat', archetype: 'Weakling', abilities: [] },
            { name: 'Sand Worm', archetype: 'Weakling', abilities: [] },
            { name: 'Skeleton', archetype: 'Weakling', abilities: [] },
            { name: 'Raptor', archetype: 'Weakling', abilities: [] },
            { name: 'Doomhound', archetype: 'Weakling', abilities: [] },
            { name: 'Mi-go', archetype: 'Weakling', abilities: [] }
        ],
        bruisers: [
            { name: 'Goblin', archetype: 'Bruiser', abilities: [{ name: "GoblinPunch", chance: 0.50, type: 'BruiserAbility' }] },
            { name: 'Thief', archetype: 'Bruiser', abilities: [{ name: "Backstab", chance: 0.50, type: 'BruiserAbility' }] },
            { name: 'Ooze', archetype: 'Bruiser', abilities: [{ name: "AcidSplash", chance: 0.50, type: 'BruiserAbility' }] },
            { name: 'Megasaurus', archetype: 'Bruiser', abilities: [{ name: "Stomp", chance: 0.50, type: 'BruiserAbility' }] },
            { name: 'Dracoguard', archetype: 'Bruiser', abilities: [{ name: "Slash", chance: 0.75, type: 'BruiserAbility' }] },
            { name: 'Shoggoth', archetype: 'Bruiser', abilities: [{ name: "Crush", chance: 1.00, type: 'BruiserAbility' }] }
        ],
        casters: [
            { name: 'Kobold', archetype: 'Caster', abilities: [{ name: "Pyro", chance: 0.41, type: 'Orison' }] },
            { name: 'Mummy', archetype: 'Caster', abilities: [{ name: "Lightning", chance: 0.50, type: 'Orison' }] },
            { name: 'Banshee', archetype: 'Caster', abilities: [{ name: "Freeze", chance: 0.70, type: 'Orison' }] },
            { name: 'Nessiedon', archetype: 'Caster', abilities: [{ name: "Wave", chance: 0.70, type: 'Orison' }] },
            { name: 'Elite Kobold', archetype: 'Caster', abilities: [{ name: "Pyro2", chance: 0.70, type: 'Orison' }] },
            { name: 'Elder Thing', archetype: 'Caster', abilities: [{ name: "Corruption", chance: 0.75, type: 'Orison' }] }
        ],
        bosses: ['White Dragon', 'Blue Dragon', 'Black Dragon', 'Green Dragon', 'Red Dragon']
    };

    function generateEnemiesForWave(wave) {
        const enemies = [];
        const isArena = wave >= 91;
        const dungeonIndex = isArena ? 6 : Math.min(DUNGEON_ENEMIES.length - 1, Math.floor((wave - 1) / 15));
        const waveIndexInDungeon = (wave - 1) % 15;
        const dungeonData = isArena ? null : DUNGEON_ENEMIES[dungeonIndex];
        const baseStats = calculateEnemyStats(wave);
        let isBossWave = (waveIndexInDungeon === 14);
        let compositionString = "";
        if (isBossWave) compositionString = "BOSS";
        else if (waveIndexInDungeon < WAVE_COMPOSITIONS.length) compositionString = WAVE_COMPOSITIONS[waveIndexInDungeon];
        else compositionString = "W";
        let letterCounts = { 'W': 0, 'B': 0, 'C': 0 };
        
        if (isBossWave) {
            let bossName;
            if (isArena) {
                // Random dragon for Arena boss
                bossName = ARENA_ENEMY_POOLS.bosses[Math.floor(Math.random() * ARENA_ENEMY_POOLS.bosses.length)];
            } else {
                // Fixed boss per dungeon
                if (dungeonIndex === 0) bossName = 'White Dragon';
                else if (dungeonIndex === 1) bossName = 'Blue Dragon';
                else if (dungeonIndex === 2) bossName = 'Black Dragon';
                else if (dungeonIndex === 3) bossName = 'Green Dragon';
                else if (dungeonIndex === 4) bossName = 'Red Dragon';
                else if (dungeonIndex === 5) bossName = 'King in Yellow';
            }
            const multipliers = ENEMY_ARCHETYPES['Boss'].statMultipliers;
            let finalStats = { hp: Math.round(baseStats.hp * 4.275), mp: Math.round(baseStats.mp * multipliers.mp), str: Math.round(baseStats.str * multipliers.str), def: Math.round(baseStats.def * multipliers.def), int: Math.round(baseStats.int * multipliers.int), mnd: Math.round(baseStats.mnd * multipliers.mnd) };
            enemies.push({ id: `enemy-1`, name: bossName, type: bossName, archetype: 'Boss', level: wave, maxHp: finalStats.hp, currentHp: finalStats.hp, maxMp: finalStats.mp, currentMp: finalStats.mp, str: finalStats.str, def: finalStats.def, int: finalStats.int, mnd: finalStats.mnd, isAlive: true, statusEffects: [], abilities: [{ name: bossName === 'King in Yellow' ? 'Annihilate' : 'DragonBreath', type: 'Ability', chance: 1.0 }], getCurrentStat(sN) { return this[sN]; }, actsTwice: true });
        } else {
            for (let i = 0; i < compositionString.length; i++) {
                let enemyDef, typeChar = compositionString[i];
                
                if (isArena) {
                    // Arena: Random enemy from pool
                    if (typeChar === 'W') enemyDef = ARENA_ENEMY_POOLS.weaklings[Math.floor(Math.random() * ARENA_ENEMY_POOLS.weaklings.length)];
                    else if (typeChar === 'B') enemyDef = ARENA_ENEMY_POOLS.bruisers[Math.floor(Math.random() * ARENA_ENEMY_POOLS.bruisers.length)];
                    else if (typeChar === 'C') enemyDef = ARENA_ENEMY_POOLS.casters[Math.floor(Math.random() * ARENA_ENEMY_POOLS.casters.length)];
                    else continue;
                } else {
                    // Normal: Enemy from current dungeon
                    if (typeChar === 'W') enemyDef = dungeonData.weakling;
                    else if (typeChar === 'B') enemyDef = dungeonData.bruiser;
                    else if (typeChar === 'C') enemyDef = dungeonData.caster;
                    else continue;
                }
                
                if (!enemyDef) continue;
                const multipliers = ENEMY_ARCHETYPES[enemyDef.archetype].statMultipliers;
                let finalStats = { hp: Math.round(baseStats.hp * multipliers.hp), mp: Math.round(baseStats.mp * multipliers.mp), str: Math.round(baseStats.str * multipliers.str), def: Math.round(baseStats.def * multipliers.def), int: Math.round(baseStats.int * multipliers.int), mnd: Math.round(baseStats.mnd * multipliers.mnd) };
                letterCounts[typeChar]++;
                const enemyName = `${enemyDef.name} ${String.fromCharCode(64 + letterCounts[typeChar])}`;
                enemies.push({ id: `enemy-${enemies.length + 1}`, name: enemyName, type: enemyDef.name, archetype: enemyDef.archetype, level: wave, maxHp: finalStats.hp, currentHp: finalStats.hp, maxMp: finalStats.mp, currentMp: finalStats.mp, str: finalStats.str, def: finalStats.def, int: finalStats.int, mnd: finalStats.mnd, isAlive: true, statusEffects: [], abilities: enemyDef.abilities || [], getCurrentStat(sN) { return this[sN]; }, actsTwice: false });
            }
        }
        return enemies;
    }

    function calculateEnemyStats(wave) {
        let hp = 15, mp = 10, s = 4, d = 4, i = 4, m = 4;
        const bonusIncrements = Math.floor((wave - 1) / 15);
        
        for (let n = 1; n < wave; n++) { 
            if (n >= 91) {
                // Arena (post-game): Different stat progression
                hp = Math.round(hp * 1.01);  // +1% HP per wave
                mp = Math.round(mp * 1.12);
                s += 2;  // +2 STR per wave
                i += 2;  // +2 INT per wave
                // DEF and MND don't increase in Arena
            } else {
                // Normal progression (waves 1-90)
                hp = Math.round(hp * 1.077);
                mp = Math.round(mp * 1.12); 
                s++; d++; i++; m++; 
            }
        }
        
        // Every 15 wave bonus still applies
        s += bonusIncrements * 5; d += bonusIncrements * 5; i += bonusIncrements * 5; m += bonusIncrements * 5;
        return { hp, mp, str: s, def: d, int: i, mnd: m };
    }

    function prepareCommandPhase() {
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
        } else { queueEnemyActions(); }
    }

    function queueAction(actorId, actionDetails) {
        const actor = gameState.getCharacterById(actorId) || gameState.getEnemyById(actorId);
        if (!actor) return;
        if (actionDetails.type === 'Rage' && actor.className === 'Barbarian') actor.isRaging = true;
        gameState.actionQueue.push({ actorId: actorId, action: { ...actionDetails } });
        gameState.addLogMessage(`${actor?.name || actorId} prepares ${actionDetails.type}${actionDetails.powerName ? '(' + actionDetails.powerName + ')' : ''}...`);
    }

    function queueEnemyActions() {
        const monkWithTaunt = gameState.party.find(p => p.isAlive && p.className === 'Monk' && p.statusEffects.some(e => e.type === 'Taunt'));
        gameState.enemies.forEach(enemy => {
            if (enemy.isAlive) {
                const alivePlayers = gameState.party.filter(p => p.isAlive);
                if (alivePlayers.length > 0) {
                    let actionsToQueue = [];
                    let targetPlayer;
                    if (monkWithTaunt && (enemy.archetype === 'Weakling' || enemy.archetype === 'Bruiser')) {
                        targetPlayer = monkWithTaunt;
                        gameState.addLogMessage(`${enemy.name} is drawn to ${monkWithTaunt.name}!`);
                    } else {
                        targetPlayer = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
                    }
                    if (enemy.type.includes('Dragon')) {
                        actionsToQueue.push({ type: 'DragonBreath', casterId: enemy.id, targets: [] });
                        actionsToQueue.push({ type: 'Attack', casterId: enemy.id, targets: [targetPlayer.id] });
                    } else if (enemy.type === 'King in Yellow') {
                        actionsToQueue.push({ type: 'Annihilate', casterId: enemy.id, targets: [] });
                        actionsToQueue.push({ type: 'Attack', casterId: enemy.id, targets: [targetPlayer.id] });
                        actionsToQueue.push({ type: 'Attack', casterId: enemy.id, targets: [targetPlayer.id] });
                    } else if (enemy.archetype === 'Bruiser') {
                        let usedAbility = false;
                        if (enemy.abilities?.length > 0) {
                            const ability = enemy.abilities[0];
                            if (Math.random() < (ability.chance || 0)) {
                                actionsToQueue.push({ type: 'BruiserAbility', abilityName: ability.name, casterId: enemy.id, targets: [targetPlayer.id] });
                                usedAbility = true;
                            }
                        }
                        if (!usedAbility) actionsToQueue.push({ type: 'Attack', casterId: enemy.id, targets: [targetPlayer.id] });
                    } else if (enemy.archetype === 'Caster') {
                        let usedAbility = false;
                        if (enemy.abilities?.length > 0) {
                            const casterAbility = enemy.abilities[0];
                            if (casterAbility.type === 'Orison') {
                                const orisonData = ORISONS[casterAbility.name];
                                if (orisonData && enemy.currentMp >= orisonData.mpCost && Math.random() < (casterAbility.chance || 0)) {
                                    actionsToQueue.push({ type: 'Orison', orisonName: casterAbility.name, casterId: enemy.id, targets: [targetPlayer.id] });
                                    usedAbility = true;
                                }
                            }
                        }
                        if (!usedAbility) actionsToQueue.push({ type: 'Attack', casterId: enemy.id, targets: [targetPlayer.id] });
                    } else { actionsToQueue.push({ type: 'Attack', casterId: enemy.id, targets: [targetPlayer.id] }); }
                    actionsToQueue.forEach(action => queueAction(enemy.id, action));
                }
            }
        });
        startActionResolution();
    }

    // --- Action Resolution ---
    function startActionResolution() {
        if (gameState.actionQueue.length === 0) { endRound(); return; }
        gameState.setState('ACTION_RESOLUTION');
        gameState.actionQueue.forEach(i => {
            i.speedRoll = Math.floor(Math.random() * 100);
            const power = i.action.powerName ? POWER_DATA[i.action.powerName] : null;
            if (i.action.type === 'Special') { i.priorityTier = 0; }
            else if (power?.alwaysFirst) { i.priorityTier = 1; }
            else if (i.action.type === 'DragonBreath' || i.action.type === 'Annihilate') { i.priorityTier = 2; }
            else if (power?.alwaysLast) { i.priorityTier = 4; }
            else { i.priorityTier = 3; }
        });
        gameState.actionQueue.sort((a, b) => {
            if (a.priorityTier !== b.priorityTier) return a.priorityTier - b.priorityTier;
            if (b.speedRoll !== a.speedRoll) return b.speedRoll - a.speedRoll;
            const aP = !!gameState.getCharacterById(a.actorId);
            const bP = !!gameState.getCharacterById(b.actorId);
            if (aP && !bP) return 1; if (!aP && bP) return -1;
            return 0;
        });
        console.log("Sorted Queue:", gameState.actionQueue.map(i => `${i.actorId}(T${i.priorityTier},S${i.speedRoll})`));
        executeNextQueuedAction();
    }

    function executeNextQueuedAction() {
        if (gameState.currentState !== 'ACTION_RESOLUTION') { gameState.actionQueue = []; return; }
        if (gameState.actionQueue.length === 0) { endRound(); return; }
        const item = gameState.actionQueue.shift();
        const actorId = item.actorId;
        const action = item.action;
        const actor = gameState.getCharacterById(actorId) || gameState.getEnemyById(actorId);
        if (!actor || !actor.isAlive) { setTimeout(executeNextQueuedAction, 50); return; }
        let canAfford = true; let cost = 0;
        const isPlayerActor = !!gameState.getCharacterById(actorId);
        if (action.type === 'Spell' || action.type === 'Prayer') {
            cost = action.powerCost || POWER_DATA[action.powerName]?.cost || 0;
        } else if (action.type === 'Orison') {
            cost = ORISONS[action.orisonName]?.mpCost || 0;
        }
        if (cost > 0) {
            if (actor.currentMp < cost) canAfford = false;
            else { actor.currentMp -= cost; if (isPlayerActor) updatePartyStatusUI(); }
            if (!canAfford) { gameState.addLogMessage(`${actor.name} doesn't have enough MP!`); setTimeout(executeNextQueuedAction, 50); return; }
        }
        let announceText = action.powerName || action.abilityName || action.orisonName || action.type;
        let announceDur = 1500;
        let isSpecialAnnouncement = false;
        switch (action.type) {
            case 'Attack': announceText = 'Attack'; announceDur = 600; flashSprite(actorId, 'white', 200); break;
            case 'Rage': announceText = 'Rage'; announceDur = 650; applyCastingAnimation(actorId, 'rage', 1000); break;
            case 'Art':
                const artData = POWER_DATA[action.powerName];
                if (artData) {
                    if (action.powerName === 'Focus') applyCastingAnimation(actorId, 'focus', 1000);
                    else if (action.powerName === 'Rapid') applyCastingAnimation(actorId, 'rapid', 800);
                    else if (action.powerName === 'Zen') applyCastingAnimation(actorId, 'zen', 1200);
                    else if (action.powerName === 'Dodge') applyCastingAnimation(actorId, 'dodge', 600);
                    else if (action.powerName === 'Kick') applyCastingAnimation(actorId, 'kick', 1000);
                    else if (action.powerName === 'Taunt') applyCastingAnimation(actorId, 'taunt', 800);
                }
                break;
            case 'Spell':
                const spellData = POWER_DATA[action.powerName];
                if (spellData?.element) applyCastingAnimation(actorId, spellData.element.toLowerCase(), 1200);
                else applyCastingAnimation(actorId, 'spell', 1200);
                break;
            case 'Prayer': applyCastingAnimation(actorId, 'prayer', 1300); break;
            case 'Orison':
                const orisonData = ORISONS[action.orisonName];
                if (orisonData?.element) applyCastingAnimation(actorId, orisonData.element.toLowerCase(), 1200);
                break;
            case 'DragonBreath': case 'Annihilate': announceText = action.type === 'Annihilate' ? 'Annihilate' : 'Dragon Breath'; announceDur = 1600; applyCastingAnimation(actorId, 'dragon-breath', 1500); break;
            case 'Special':
                announceText = action.specialName || actor.specialName;
                announceDur = getSpecialAnnouncementDuration(announceText);
                isSpecialAnnouncement = true;
                break;
        }
        showActionAnnouncement(announceText, announceDur, isSpecialAnnouncement);
        gameState.addLogMessage(`-- ${actor.name}'s action --`);
        let primaryTarget = null; let finalTargets = [];
        if (action.targets && action.targets.length > 0) {
            let initialTargets = action.targets.map(id => gameState.getCharacterById(id) || gameState.getEnemyById(id)).filter(t => t);
            if (action.targets.length === 1) {
                primaryTarget = initialTargets[0];
                const isRevive = (action.type === 'Prayer' && action.powerName === 'Revive');
                const isMiracle = (action.type === 'Prayer' && action.powerName === 'Miracle');
                if (!primaryTarget || (isRevive && primaryTarget.isAlive) || (!isRevive && !isMiracle && !primaryTarget.isAlive)) {
                    if (action.type === 'Attack' || action.type === 'Rage' || action.type === 'BruiserAbility' || action.type === 'Orison' || (action.type === 'Spell' && POWER_DATA[action.powerName]?.target === 'enemy') || (action.type === 'Art' && POWER_DATA[action.powerName]?.target === 'enemy')) {
                        const livingEnemies = gameState.enemies.filter(e => e.isAlive);
                        if (livingEnemies.length > 0) { primaryTarget = livingEnemies[Math.floor(Math.random() * livingEnemies.length)]; finalTargets = [primaryTarget]; }
                    } else if (action.type === 'Prayer' && !isRevive) {
                        const livingAllies = gameState.party.filter(p => p.isAlive && p.id !== actorId);
                        if (livingAllies.length > 0) { primaryTarget = livingAllies[Math.floor(Math.random() * livingAllies.length)]; finalTargets = [primaryTarget]; }
                        else if (actor.isAlive && isPlayerActor) { primaryTarget = actor; finalTargets = [primaryTarget]; }
                    }
                } else { finalTargets = [primaryTarget]; }
            } else {
                const pInfo = POWER_DATA[action.powerName];
                if (pInfo?.target === 'enemies' || pInfo?.target === 'all_enemies') finalTargets = gameState.enemies.filter(e => e.isAlive);
                else if (pInfo?.target === 'allies') finalTargets = gameState.party.filter(p => p.isAlive);
                else if (pInfo?.target === 'random_enemies') finalTargets = gameState.enemies.filter(e => e.isAlive);
                else finalTargets = initialTargets.filter(t => t.isAlive);
            }
        }
        switch (action.type) {
            case 'Attack': case 'Rage': performAttack(actor, primaryTarget); break;
            case 'Spell': case 'Prayer': performPower(actor, action.powerName, finalTargets); break;
            case 'Art': performArt(actor, action.powerName, finalTargets); break;
            case 'Orison': performOrison(actor, action.orisonName, finalTargets); break;
            case 'BruiserAbility': performBruiserAbility(actor, action.abilityName, primaryTarget); break;
            case 'DragonBreath': case 'Annihilate': performDragonBreath(actor); break;
            case 'Special': executeSpecial(actor); break;
            default: console.error(`Unhandled type: ${action.type}`);
        }
        const delay = Math.max(800, announceDur + 100);
        setTimeout(executeNextQueuedAction, delay);
    }

    function getSpecialAnnouncementDuration(specialName) {
        const DURATIONS = {
            'Bloodfury': 4000,
            'Battle Cry': 2000,
            'Night Slash': 3000,
            'Meteor Storm': 4500,
            'Elemental Fury': 6000,
            'Angelic Chorus': 2500,
            'Nirvana Fist': 3000
        };
        return DURATIONS[specialName] || 3000;
    }

    // --- Special Ability System ---
    function applySpecialVisuals(actor) {
        const bgElement = document.getElementById('game-background');
        bgElement.style.transition = 'opacity 0.5s';
        bgElement.style.opacity = '0.4';
        gameState.party.forEach(char => {
            const sprite = document.getElementById(char.id + '-sprite');
            if (char.id !== actor.id) {
                sprite.style.transition = 'opacity 0.3s';
                sprite.style.opacity = '0';
            } else {
                sprite.style.filter = 'drop-shadow(0 0 15px white)';
            }
        });
    }

    function removeSpecialVisuals() {
        const bgElement = document.getElementById('game-background');
        bgElement.style.opacity = '0.9';
        gameState.party.forEach(char => {
            const sprite = document.getElementById(char.id + '-sprite');
            if (sprite) {
                sprite.style.opacity = '1';
                sprite.style.filter = 'none';
            }
        });
    }

    function executeSpecial(actor) {
        const specialName = actor.specialName;
        applySpecialVisuals(actor);
        gameState.addLogMessage(`${actor.name} uses ${specialName}!`);
        switch (specialName) {
            case 'Bloodfury': performBloodfury(actor); break;
            case 'Battle Cry': performBattleCry(actor); break;
            case 'Night Slash': performNightSlash(actor); break;
            case 'Meteor Storm': performMeteorStorm(actor); break;
            case 'Elemental Fury': performElementalFury(actor); break;
            case 'Angelic Chorus': performAngelicChorus(actor); break;
            case 'Nirvana Fist': performNirvanaFist(actor); break;
            default: console.error(`Unknown Special: ${specialName}`);
        }
        resetLimitGauge(actor);
    }

    function performBloodfury(actor) {
        const empowerBuff = actor.statusEffects.find(e => e.type === 'Empower1' || e.type === 'Empower2' || e.type === 'Empower3');
        const lifelinkBuff = actor.statusEffects.find(e => e.type === 'Lifelink');
        const actorElementId = getCorrectElementId(actor.id);
        const totalHits = 11;
        for (let i = 0; i < totalHits; i++) {
            setTimeout(() => {
                const livingEnemies = gameState.enemies.filter(e => e.isAlive);
                if (livingEnemies.length === 0) return;
                const target = livingEnemies[Math.floor(Math.random() * livingEnemies.length)];
                const targetElementId = getCorrectElementId(target.id);
                let damage = Math.round(calculatePhysicalDamage(actor, target) * 0.8);
                if (empowerBuff?.damageMultiplier) damage = Math.round(damage * empowerBuff.damageMultiplier);
                flashSprite(targetElementId, 'crimson', 200);
                setTimeout(() => {
                    showFloatingNumber(targetElementId, damage, 'damage');
                    target.currentHp -= damage;
                    if (target.currentHp <= 0) {
                        target.currentHp = 0; target.isAlive = false;
                        gameState.addLogMessage(`${target.name} defeated!`);
                        grantKillCredit(actor);
                    }
                    const healAmount = damage;
                    actor.heal(healAmount);
                    showFloatingNumber(actorElementId, healAmount, 'heal');
                    if (lifelinkBuff?.healPercent) {
                        const extraHeal = Math.round(damage * lifelinkBuff.healPercent);
                        actor.heal(extraHeal);
                        showFloatingNumber(actorElementId, extraHeal, 'heal');
                    }
                    updateEnemySpritesUI(); updatePartyStatusUI();
                    if (checkWinCondition()) handleWinWave();
                }, 150);
            }, i * 400);
        }
        setTimeout(() => { removeSpecialVisuals(); }, 3500);
    }

    function performBattleCry(actor) {
        const actorElementId = getCorrectElementId(actor.id);
        shimmerSprite(actorElementId, 'gold', 2000);
        gameState.party.forEach((char, idx) => {
            if (char.isAlive) {
                setTimeout(() => {
                    const charElementId = getCorrectElementId(char.id);
                    char.addStatus({ type: 'Empower3', turns: 4, damageMultiplier: 5.0 });
                    char.addStatus({ type: 'Fury', turns: 4, doubleAttack: true });
                    const healAmount = actor.maxHp;
                    const healed = char.heal(healAmount);
                    if (healed > 0) showFloatingNumber(charElementId, healed, 'heal');
                    shimmerSprite(charElementId, 'gold', 1000);
                    gameState.addLogMessage(`${char.name} gains Empower3 + Fury!`);
                }, idx * 200);
            }
        });
        setTimeout(() => { removeSpecialVisuals(); updatePartyStatusUI(); }, 1800);
    }

    function performNightSlash(actor) {
        const empowerBuff = actor.statusEffects.find(e => e.type === 'Empower1' || e.type === 'Empower2' || e.type === 'Empower3');
        const lifelinkBuff = actor.statusEffects.find(e => e.type === 'Lifelink');
        const actorElementId = getCorrectElementId(actor.id);
        const targets = gameState.enemies.filter(e => e.isAlive);
        targets.forEach((target, index) => {
            setTimeout(() => {
                const targetElementId = getCorrectElementId(target.id);
                let damage = Math.round(calculatePhysicalDamage(actor, target) * 7.0);
                if (empowerBuff?.damageMultiplier) damage = Math.round(damage * empowerBuff.damageMultiplier);
                flashSprite(targetElementId, 'purple', 300);
                setTimeout(() => {
                    showFloatingNumber(targetElementId, damage, 'damage');
                    target.currentHp -= damage;
                    if (target.currentHp <= 0) {
                        target.currentHp = 0; target.isAlive = false;
                        gameState.addLogMessage(`${target.name} defeated!`);
                        grantKillCredit(actor);
                    }
                    if (!target.statusEffects.some(e => e.type === 'Poison')) {
                        target.statusEffects.push({ type: 'Poison', turns: 5 });
                        gameState.addLogMessage(`${target.name} is poisoned!`);
                    }
                    if (lifelinkBuff?.healPercent && actor.isAlive) {
                        const healAmount = Math.round(damage * lifelinkBuff.healPercent);
                        actor.heal(healAmount);
                        showFloatingNumber(actorElementId, healAmount, 'heal');
                    }
                    updateEnemySpritesUI(); updatePartyStatusUI();
                    if (checkWinCondition()) handleWinWave();
                }, 150);
            }, index * 300);
        });
        setTimeout(() => { removeSpecialVisuals(); }, 2500);
    }

    function performMeteorStorm(actor) {
        const empowerBuff = actor.statusEffects.find(e => e.type === 'Empower1' || e.type === 'Empower2' || e.type === 'Empower3');
        const totalHits = 7;
        for (let i = 0; i < totalHits; i++) {
            setTimeout(() => {
                const livingEnemies = gameState.enemies.filter(e => e.isAlive);
                if (livingEnemies.length === 0) return;
                const target = livingEnemies[Math.floor(Math.random() * livingEnemies.length)];
                const targetElementId = getCorrectElementId(target.id);
                let damage = Math.round(calculateMagicDamage(actor, target, 3) * 2.5);
                if (empowerBuff?.damageMultiplier) damage = Math.round(damage * empowerBuff.damageMultiplier);
                flashSprite(targetElementId, 'orange', 300);
                setTimeout(() => {
                    showFloatingNumber(targetElementId, damage, 'damage');
                    target.currentHp -= damage;
                    ['str', 'def', 'int', 'mnd'].forEach(stat => applyStatDebuff(target, stat, 3));
                    if (target.currentHp <= 0) {
                        target.currentHp = 0; target.isAlive = false;
                        gameState.addLogMessage(`${target.name} defeated!`);
                        grantKillCredit(actor);
                    }
                    updateEnemySpritesUI(); updatePartyStatusUI();
                    if (checkWinCondition()) handleWinWave();
                }, 150);
            }, i * 500);
        }
        setTimeout(() => { removeSpecialVisuals(); }, 4000);
    }

    function performElementalFury(actor) {
        const empowerBuff = actor.statusEffects.find(e => e.type === 'Empower1' || e.type === 'Empower2' || e.type === 'Empower3');
        const spells = [
            { name: 'Hydro3', element: 'Hydro', stat: 'mnd', mult: 1.5, color: 'blue', delay: 1000 },
            { name: 'Fire3', element: 'Fire', stat: 'str', mult: 1.0, color: 'orange', delay: 2000 },
            { name: 'Frost3', element: 'Frost', stat: 'def', mult: 1.0, color: 'cyan', delay: 3000 },
            { name: 'Shock3', element: 'Shock', stat: 'int', mult: 1.0, color: 'yellow', delay: 4000 }
        ];
        spells.forEach(spell => {
            setTimeout(() => {
                const targets = gameState.enemies.filter(e => e.isAlive);
                targets.forEach((target, idx) => {
                    setTimeout(() => {
                        const targetElementId = getCorrectElementId(target.id);
                        let damage = Math.round(calculateMagicDamage(actor, target, 3) * spell.mult);
                        if (empowerBuff?.damageMultiplier) damage = Math.round(damage * empowerBuff.damageMultiplier);
                        flashSprite(targetElementId, spell.color, 250);
                        applyStatDebuff(target, spell.stat, 3);
                        setTimeout(() => {
                            showFloatingNumber(targetElementId, damage, 'damage');
                            target.currentHp -= damage;
                            if (target.currentHp <= 0) {
                                target.currentHp = 0; target.isAlive = false;
                                gameState.addLogMessage(`${target.name} defeated!`);
                                grantKillCredit(actor);
                            }
                            updateEnemySpritesUI();
                            if (checkWinCondition()) handleWinWave();
                        }, 100);
                    }, idx * 100);
                });
            }, spell.delay);
        });
        setTimeout(() => { removeSpecialVisuals(); updatePartyStatusUI(); }, 5500);
    }

    function performAngelicChorus(actor) {
        const actorElementId = getCorrectElementId(actor.id);
        shimmerSprite(actorElementId, 'white', 2500);
        gameState.party.forEach((char, idx) => {
            setTimeout(() => {
                const charElementId = getCorrectElementId(char.id);
                if (!char.isAlive) {
                    char.isAlive = true;
                    char.currentHp = char.maxHp;
                    char.currentMp = char.maxMp;
                    gameState.addLogMessage(`${char.name} has been revived!`);
                    showFloatingNumber(charElementId, char.maxHp, 'heal');
                } else {
                    const hpHealed = char.maxHp - char.currentHp;
                    const mpRestored = char.maxMp - char.currentMp;
                    char.currentHp = char.maxHp;
                    char.currentMp = char.maxMp;
                    if (hpHealed > 0) showFloatingNumber(charElementId, hpHealed, 'heal');
                }
                shimmerSprite(charElementId, 'gold', 1500);
            }, idx * 200);
        });
        setTimeout(() => { removeSpecialVisuals(); updateEnemySpritesUI(); updatePartyStatusUI(); }, 2200);
    }

    function performNirvanaFist(actor) {
        const actorElementId = getCorrectElementId(actor.id);
        setTimeout(() => {
            const hpHealed = actor.maxHp - actor.currentHp;
            actor.currentHp = actor.maxHp;
            if (hpHealed > 0) showFloatingNumber(actorElementId, hpHealed, 'heal');
            actor.addStatus({ type: 'Empower3', turns: 4, damageMultiplier: 5.0 });
            actor.addStatus({ type: 'Fury', turns: 4, doubleAttack: true });
            actor.addStatus({ type: 'Lifelink', turns: 4, healPercent: 0.5 });
            shimmerSprite(actorElementId, 'gold', 1500);
            gameState.addLogMessage(`${actor.name} achieves enlightenment!`);
            updatePartyStatusUI();
        }, 500);
        setTimeout(() => {
            const livingEnemies = gameState.enemies.filter(e => e.isAlive);
            if (livingEnemies.length === 0) { removeSpecialVisuals(); return; }
            const target = livingEnemies[Math.floor(Math.random() * livingEnemies.length)];
            const targetElementId = getCorrectElementId(target.id);
            let damage = Math.round(calculatePhysicalDamage(actor, target) * 3.0);
            const empowerBuff = actor.statusEffects.find(e => e.type === 'Empower3');
            if (empowerBuff?.damageMultiplier) damage = Math.round(damage * empowerBuff.damageMultiplier);
            flashSprite(actorElementId, 'white', 300);
            flashSprite(targetElementId, 'gold', 300);
            setTimeout(() => {
                showFloatingNumber(targetElementId, damage, 'damage');
                target.currentHp -= damage;
                if (target.currentHp <= 0) {
                    target.currentHp = 0; target.isAlive = false;
                    gameState.addLogMessage(`${target.name} defeated!`);
                    grantKillCredit(actor);
                }
                const lifelinkBuff = actor.statusEffects.find(e => e.type === 'Lifelink');
                if (lifelinkBuff?.healPercent) {
                    const healAmount = Math.round(damage * lifelinkBuff.healPercent);
                    actor.heal(healAmount);
                    showFloatingNumber(actorElementId, healAmount, 'heal');
                }
                updateEnemySpritesUI(); updatePartyStatusUI();
                if (checkWinCondition()) handleWinWave();
            }, 300);
        }, 1500);
        setTimeout(() => { removeSpecialVisuals(); }, 2700);
    }

    // --- Combat Actions ---
    function performAttack(c, t) {
        if (!c || !t || !t.isAlive) return;
        gameState.addLogMessage(`${c.name} ${c.isRaging ? 'rages at' : 'attacks'} ${t.name}!`);
        const isPlayerTarget = !!gameState.getCharacterById(t.id);
        const targetElementId = getCorrectElementId(t.id);
        const actorElementId = getCorrectElementId(c.id);
        flashSprite(actorElementId, 'white', 100);
        setTimeout(() => { flashSprite(targetElementId, 'white', 150); }, 150);
        let dmg = calculatePhysicalDamage(c, t);
        const empowerBuff = c.statusEffects.find(e => e.type === 'Empower1' || e.type === 'Empower2' || e.type === 'Empower3');
        if (empowerBuff?.damageMultiplier) { dmg = Math.round(dmg * empowerBuff.damageMultiplier); gameState.addLogMessage(`${c.name}'s attack is empowered!`); }
        setTimeout(() => {
            showFloatingNumber(targetElementId, dmg, 'damage');
            let actualDamageTaken;
            if (isPlayerTarget) { actualDamageTaken = t.takeDamage(dmg); }
            else {
                t.currentHp -= dmg; actualDamageTaken = dmg;
                if (t.currentHp <= 0) { t.currentHp = 0; t.isAlive = false; grantKillCredit(c); }
            }
            gameState.addLogMessage(`${t.name} takes ${actualDamageTaken} damage.`);
            const lifelinkBuff = c.statusEffects.find(e => e.type === 'Lifelink');
            if (lifelinkBuff?.healPercent && c.isAlive) {
                const healAmount = Math.round(actualDamageTaken * lifelinkBuff.healPercent);
                if (healAmount > 0) { c.heal(healAmount); showFloatingNumber(actorElementId, healAmount, 'heal'); }
            }
            if (!t.isAlive) gameState.addLogMessage(`${t.name} defeated!`);
            updateEnemySpritesUI(); updatePartyStatusUI(); highlightActivePartyStatus(-1);
            const furyBuff = c.statusEffects.find(e => e.type === 'Fury');
            if (furyBuff && c.isAlive && t.isAlive) {
                setTimeout(() => {
                    showActionAnnouncement(`Fury Attack`, 1000);
                    gameState.addLogMessage(`${c.name}'s Fury triggers a second attack!`);
                    flashSprite(actorElementId, 'crimson', 200);
                    setTimeout(() => {
                        let wasRaging = c.isRaging; if (wasRaging) c.isRaging = false;
                        let dmg2 = calculatePhysicalDamage(c, t);
                        if (wasRaging) c.isRaging = true;
                        if (empowerBuff?.damageMultiplier) dmg2 = Math.round(dmg2 * empowerBuff.damageMultiplier);
                        flashSprite(targetElementId, 'crimson', 200);
                        setTimeout(() => {
                            showFloatingNumber(targetElementId, dmg2, 'damage');
                            let actualDamage2;
                            if (isPlayerTarget) { actualDamage2 = t.takeDamage(dmg2); }
                            else { t.currentHp -= dmg2; actualDamage2 = dmg2; if (t.currentHp <= 0) { t.currentHp = 0; t.isAlive = false; grantKillCredit(c); } }
                            gameState.addLogMessage(`${t.name} takes ${actualDamage2} additional damage!`);
                            if (lifelinkBuff?.healPercent && c.isAlive) {
                                const h2 = Math.round(actualDamage2 * lifelinkBuff.healPercent);
                                if (h2 > 0) { c.heal(h2); showFloatingNumber(actorElementId, h2, 'heal'); }
                            }
                            updateEnemySpritesUI(); updatePartyStatusUI();
                            if (checkWinCondition()) handleWinWave();
                            if (checkLoseCondition()) handleGameOver();
                        }, 200);
                    }, 300);
                }, 800);
            }
            if (checkWinCondition()) handleWinWave();
            if (checkLoseCondition()) handleGameOver();
        }, 300);
    }

    function performArt(actor, artName, resolvedTargets) {
        const artData = POWER_DATA[artName];
        if (!artData) return;
        gameState.addLogMessage(`${actor.name} uses ${artName}!`);
        const empowerBuff = actor.statusEffects.find(e => e.type === 'Empower1' || e.type === 'Empower2' || e.type === 'Empower3');
        const hasFury = actor.statusEffects.some(e => e.type === 'Fury');
        const lifelinkBuff = actor.statusEffects.find(e => e.type === 'Lifelink');
        switch (artData.effect) {
            case 'EnhancedStrike': performFocus(actor, resolvedTargets[0], empowerBuff, hasFury, lifelinkBuff); break;
            case 'DoubleAttack': performRapid(actor, empowerBuff, hasFury, lifelinkBuff); break;
            case 'SelfHeal': performZen(actor); break;
            case 'AOE_Attack': performKick(actor, empowerBuff, lifelinkBuff); break;
        }
    }

    function performFocus(actor, target, empowerBuff, hasFury, lifelinkBuff) {
        if (!target || !target.isAlive) {
            const livingEnemies = gameState.enemies.filter(e => e.isAlive);
            if (livingEnemies.length > 0) target = livingEnemies[Math.floor(Math.random() * livingEnemies.length)];
            else { gameState.addLogMessage(`${actor.name}'s Focus finds no target!`); return; }
        }
        const focusMultiplier = POWER_DATA['Focus'].damageMultiplier;
        const targetElementId = getCorrectElementId(target.id);
        const actorElementId = getCorrectElementId(actor.id);
        let baseDamage = calculatePhysicalDamage(actor, target);
        let focusDamage = Math.round(baseDamage * focusMultiplier);
        if (empowerBuff?.damageMultiplier) { focusDamage = Math.round(focusDamage * empowerBuff.damageMultiplier); gameState.addLogMessage(`${actor.name}'s Focus is empowered!`); }
        flashSprite(targetElementId, 'orange', 300);
        setTimeout(() => {
            showFloatingNumber(targetElementId, focusDamage, 'damage');
            gameState.addLogMessage(`${target.name} takes ${focusDamage} damage!`);
            target.currentHp -= focusDamage;
            if (target.currentHp <= 0) { target.currentHp = 0; target.isAlive = false; gameState.addLogMessage(`${target.name} defeated!`); grantKillCredit(actor); }
            if (lifelinkBuff?.healPercent && actor.isAlive) {
                const healAmount = Math.round(focusDamage * lifelinkBuff.healPercent);
                if (healAmount > 0) { actor.heal(healAmount); showFloatingNumber(actorElementId, healAmount, 'heal'); }
            }
            updateEnemySpritesUI(); updatePartyStatusUI();
            if (hasFury && target.isAlive) {
                setTimeout(() => {
                    gameState.addLogMessage(`${actor.name}'s Fury triggers a second Focus!`);
                    let fury2Damage = Math.round(calculatePhysicalDamage(actor, target) * focusMultiplier);
                    if (empowerBuff?.damageMultiplier) fury2Damage = Math.round(fury2Damage * empowerBuff.damageMultiplier);
                    flashSprite(targetElementId, 'crimson', 300);
                    setTimeout(() => {
                        showFloatingNumber(targetElementId, fury2Damage, 'damage');
                        target.currentHp -= fury2Damage;
                        if (target.currentHp <= 0) { target.currentHp = 0; target.isAlive = false; gameState.addLogMessage(`${target.name} defeated!`); grantKillCredit(actor); }
                        if (lifelinkBuff?.healPercent && actor.isAlive) {
                            const h2 = Math.round(fury2Damage * lifelinkBuff.healPercent);
                            if (h2 > 0) { actor.heal(h2); showFloatingNumber(actorElementId, h2, 'heal'); }
                        }
                        updateEnemySpritesUI(); updatePartyStatusUI();
                        if (checkWinCondition()) handleWinWave();
                    }, 200);
                }, 600);
            }
            if (checkWinCondition()) handleWinWave();
        }, 300);
    }

    function performRapid(actor, empowerBuff, hasFury, lifelinkBuff) {
        const rapidMultiplier = POWER_DATA['Rapid'].damageMultiplier;
        const totalHits = hasFury ? 4 : 2;
        const actorElementId = getCorrectElementId(actor.id);
        gameState.addLogMessage(`${actor.name} strikes ${totalHits} times!`);
        for (let i = 0; i < totalHits; i++) {
            setTimeout(() => {
                const livingEnemies = gameState.enemies.filter(e => e.isAlive);
                if (livingEnemies.length === 0) return;
                const target = livingEnemies[Math.floor(Math.random() * livingEnemies.length)];
                const targetElementId = getCorrectElementId(target.id);
                let baseDamage = calculatePhysicalDamage(actor, target);
                let rapidDamage = Math.round(baseDamage * rapidMultiplier);
                if (empowerBuff?.damageMultiplier) { rapidDamage = Math.round(rapidDamage * empowerBuff.damageMultiplier); }
                flashSprite(targetElementId, 'silver', 150);
                setTimeout(() => {
                    showFloatingNumber(targetElementId, rapidDamage, 'damage');
                    gameState.addLogMessage(`${target.name} takes ${rapidDamage} damage!`);
                    target.currentHp -= rapidDamage;
                    if (target.currentHp <= 0) { target.currentHp = 0; target.isAlive = false; gameState.addLogMessage(`${target.name} defeated!`); grantKillCredit(actor); }
                    if (lifelinkBuff?.healPercent && actor.isAlive) {
                        const healAmount = Math.round(rapidDamage * lifelinkBuff.healPercent);
                        if (healAmount > 0) { actor.heal(healAmount); showFloatingNumber(actorElementId, healAmount, 'heal'); }
                    }
                    updateEnemySpritesUI(); updatePartyStatusUI();
                    if (checkWinCondition()) handleWinWave();
                }, 100);
            }, i * 400);
        }
    }

    function performZen(actor) {
        const healPercent = POWER_DATA['Zen'].healPercent;
        const healAmount = Math.round(actor.maxHp * healPercent);
        const actorElementId = getCorrectElementId(actor.id);
        shimmerSprite(actorElementId, 'gold', 1200);
        setTimeout(() => {
            const healed = actor.heal(healAmount);
            if (healed > 0) showFloatingNumber(actorElementId, healed, 'heal');
            gameState.addLogMessage(`${actor.name} restores ${healed} HP!`);
            updatePartyStatusUI();
        }, 300);
    }

    function performKick(actor, empowerBuff, lifelinkBuff) {
        const kickMultiplier = POWER_DATA['Kick'].damageMultiplier;
        const targets = gameState.enemies.filter(e => e.isAlive);
        const actorElementId = getCorrectElementId(actor.id);
        if (targets.length === 0) { gameState.addLogMessage(`${actor.name}'s Kick finds no targets!`); return; }
        gameState.addLogMessage(`${actor.name} kicks all enemies!`);
        targets.forEach((target, index) => {
            setTimeout(() => {
                const targetElementId = getCorrectElementId(target.id);
                let baseDamage = calculatePhysicalDamage(actor, target);
                let kickDamage = Math.round(baseDamage * kickMultiplier);
                if (empowerBuff?.damageMultiplier) { kickDamage = Math.round(kickDamage * empowerBuff.damageMultiplier); }
                flashSprite(targetElementId, 'orange', 200);
                setTimeout(() => {
                    showFloatingNumber(targetElementId, kickDamage, 'damage');
                    gameState.addLogMessage(`${target.name} takes ${kickDamage} damage!`);
                    target.currentHp -= kickDamage;
                    if (target.currentHp <= 0) { target.currentHp = 0; target.isAlive = false; gameState.addLogMessage(`${target.name} defeated!`); grantKillCredit(actor); }
                    if (lifelinkBuff?.healPercent && actor.isAlive) {
                        const healAmount = Math.round(kickDamage * lifelinkBuff.healPercent);
                        if (healAmount > 0) { actor.heal(healAmount); showFloatingNumber(actorElementId, healAmount, 'heal'); }
                    }
                    updateEnemySpritesUI(); updatePartyStatusUI();
                    if (checkWinCondition()) handleWinWave();
                }, 100);
            }, index * 250);
        });
    }

    function performOrison(caster, orisonName, targets) {
        const orison = ORISONS[orisonName]; if (!orison) return;
        const allTargets = gameState.party.filter(p => p.isAlive);
        if (allTargets.length === 0) { gameState.addLogMessage(`${caster.name}'s ${orisonName} finds no targets!`); return; }
        gameState.addLogMessage(`${caster.name} casts ${orisonName} on all party members!`);
        let effectColor;
        switch (orison.element) { case 'Fire': effectColor = 'orange'; break; case 'Frost': effectColor = 'aqua'; break; case 'Hydro': effectColor = 'blue'; break; case 'Shock': effectColor = 'yellow'; break; case 'Darkness': effectColor = 'black'; break; default: effectColor = 'purple'; }
        shimmerSprite(getCorrectElementId(caster.id), effectColor, 500);
        const debuffStat = ELEMENT_DEBUFF_MAP[orison.element];
        const debuffMagnitude = Math.min(3, Math.max(1, Math.floor(caster.level / 5)));
        allTargets.forEach((target, index) => {
            setTimeout(() => {
                const targetElementId = getCorrectElementId(target.id);
                flashSprite(targetElementId, effectColor, 250);
                if (debuffStat) { if (Array.isArray(debuffStat)) debuffStat.forEach(stat => applyStatDebuff(target, stat, debuffMagnitude)); else applyStatDebuff(target, debuffStat, debuffMagnitude); }
                setTimeout(() => {
                    const damage = calculateOrisonDamage(caster, target);
                    showFloatingNumber(targetElementId, damage, 'damage');
                    gameState.addLogMessage(`${target.name} takes ${damage} ${orison.element} damage!`);
                    target.takeDamage(damage);
                    updatePartyStatusUI();
                    if (checkLoseCondition()) handleGameOver();
                }, 150 + (index * 50));
            }, index * 300);
        });
    }

    function performBruiserAbility(caster, abilityName, target) {
        if (!target || !target.isAlive) { gameState.addLogMessage(`${caster.name}'s ${abilityName} has no valid target!`); return; }
        const targetElementId = getCorrectElementId(target.id);
        const baseDamage = calculatePhysicalDamage(caster, target);
        const hpBonus = Math.round(caster.maxHp * 0.2);
        const totalDamage = baseDamage + hpBonus;
        gameState.addLogMessage(`${caster.name} uses ${abilityName}!`);
        flashSprite(targetElementId, 'crimson', 200);
        setTimeout(() => {
            showFloatingNumber(targetElementId, totalDamage, 'damage');
            gameState.addLogMessage(`${target.name} takes ${totalDamage} damage!`);
            if ('takeDamage' in target) { target.takeDamage(totalDamage); updatePartyStatusUI(); }
            else { target.currentHp -= totalDamage; if (target.currentHp <= 0) { target.currentHp = 0; target.isAlive = false; } updateEnemySpritesUI(); }
            if (checkWinCondition()) handleWinWave();
            if (checkLoseCondition()) handleGameOver();
        }, 200);
    }

    function performDragonBreath(c) {
        gameState.addLogMessage(`${c.name} uses Dragon Breath!`);
        applyCastingAnimation(c.id, 'dragon-breath', 1500);
        const targets = gameState.party.filter(p => p.isAlive);
        targets.forEach(t => {
            const dmg = Math.round(t.maxHp * 0.25);
            const targetElementId = getCorrectElementId(t.id);
            setTimeout(() => {
                showFloatingNumber(targetElementId, dmg, 'damage');
                gameState.addLogMessage(`${t.name} takes ${dmg} breath dmg!`);
                t.takeDamage(dmg);
                updatePartyStatusUI(); highlightActivePartyStatus(-1);
                if (checkLoseCondition()) handleGameOver();
            }, 100);
        });
    }

    function performPower(c, pN, resolvedTargets) {
        const p = POWER_DATA[pN]; if (!p) return;
        gameState.addLogMessage(`${c.name} casts ${pN}!`);
        if (resolvedTargets.length === 0 && (p.target === 'ally' || p.target === 'ally_ko' || p.target === 'ally_or_ko' || p.target === 'enemy')) { gameState.addLogMessage(`No valid targets remain.`); highlightActivePartyStatus(-1); return; }
        let elementColor = 'purple';
        if (p.element) { switch (p.element) { case 'Fire': elementColor = 'orange'; break; case 'Frost': elementColor = 'aqua'; break; case 'Hydro': elementColor = 'blue'; break; case 'Shock': elementColor = 'yellow'; break; case 'Darkness': elementColor = 'black'; break; } }
        resolvedTargets.forEach((t, index) => {
            if (!t) return;
            const targetElementId = getCorrectElementId(t.id);
            if (p.element) {
                const dmg = calculateMagicDamage(c, t, p.level);
                const debuffStat = ELEMENT_DEBUFF_MAP[p.element];
                setTimeout(() => {
                    flashSprite(targetElementId, elementColor, 250);
                    if (debuffStat) { if (Array.isArray(debuffStat)) debuffStat.forEach(stat => applyStatDebuff(t, stat, p.level)); else applyStatDebuff(t, debuffStat, p.level); }
                    setTimeout(() => {
                        showFloatingNumber(targetElementId, dmg, 'damage');
                        gameState.addLogMessage(`${t.name} takes ${dmg} ${p.element} dmg.`);
                        if ('takeDamage' in t) { t.takeDamage(dmg); updatePartyStatusUI(); }
                        else { t.currentHp -= dmg; if (t.currentHp <= 0) { t.currentHp = 0; t.isAlive = false; gameState.addLogMessage(`${t.name} defeated!`); grantKillCredit(c); } updateEnemySpritesUI(); }
                        highlightActivePartyStatus(-1);
                        if (checkWinCondition()) handleWinWave();
                        if (checkLoseCondition()) handleGameOver();
                    }, 150);
                }, index * 200);
            }
            else if (p.effect === 'Heal') {
                let healAmount = pN === 'Heal1' ? calculateHeal1Amount(c) : calculateHealing(c, p.level);
                const hd = t.heal(healAmount); if (hd > 0) showFloatingNumber(targetElementId, hd, 'heal');
                gameState.addLogMessage(`${t.name} +${hd} HP.`); updatePartyStatusUI(); highlightActivePartyStatus(-1);
            }
            else if (p.effect === 'Revive') {
                if (!t.isAlive) { t.isAlive = true; const hp = Math.round(t.maxHp * p.hpPercent); t.heal(hp); showFloatingNumber(targetElementId, hp, 'heal'); gameState.addLogMessage(`${t.name} revived!`); updatePartyStatusUI(); updateEnemySpritesUI(); }
                else { gameState.addLogMessage(`${t.name} alive.`); }
                highlightActivePartyStatus(-1);
            }
            else if (p.effect === 'Poison' || p.effect === 'Slow') {
                const ch = p.chance || 1.0;
                if (Math.random() < ch) { const dur = p.duration || 5; if ('addStatus' in t) { const suc = t.addStatus({ type: p.effect, turns: dur }); if (suc) gameState.addLogMessage(`${t.name} gets ${p.effect}!`); else gameState.addLogMessage(`${t.name} resists.`); updatePartyStatusUI(); } else if (t.statusEffects) { if (!t.statusEffects.some(s => s.type === p.effect)) { t.statusEffects.push({ type: p.effect, turns: dur }); gameState.addLogMessage(`${t.name} gets ${p.effect}!`); } else gameState.addLogMessage(`${t.name} resists.`); } }
                else { gameState.addLogMessage(`${t.name} resists.`); }
                highlightActivePartyStatus(-1);
            }
            else if (p.effect === 'Empower') {
                const statusName = p.statusName; const damageMultiplier = p.damageMultiplier || 1.5;
                const suc = t.addStatus({ type: statusName, turns: p.turns || 4, isPhysicalBuff: true, damageMultiplier: damageMultiplier });
                if (suc) { gameState.addLogMessage(`${t.name} empowered! (x${damageMultiplier})`); shimmerSprite(targetElementId, statusName === 'Empower3' ? '#FF69B4' : (statusName === 'Empower2' ? '#FFD700' : 'white'), 1200); }
                updatePartyStatusUI(); highlightActivePartyStatus(-1);
            }
            else if (p.effect === 'Fury') {
                const suc = t.addStatus({ type: p.statusName, turns: p.turns || 4, isPhysicalBuff: true, doubleAttack: true });
                if (suc) { gameState.addLogMessage(`${t.name} gains Fury!`); shimmerSprite(targetElementId, '#FF8080', 1200); }
                updatePartyStatusUI(); highlightActivePartyStatus(-1);
            }
            else if (p.effect === 'Lifelink') {
                const healPercent = p.healPercent || 0.5;
                const suc = t.addStatus({ type: p.statusName, turns: p.turns || 4, isPhysicalBuff: true, healPercent: healPercent });
                if (suc) { gameState.addLogMessage(`${t.name} gains Lifelink!`); shimmerSprite(targetElementId, '#80FF80', 1200); }
                updatePartyStatusUI(); highlightActivePartyStatus(-1);
            }
            else if (p.effect === 'Miracle') {
                const wasAlive = t.isAlive;
                if (!wasAlive) { t.isAlive = true; t.currentHp = t.maxHp; gameState.addLogMessage(`${t.name} miraculously revived!`); showFloatingNumber(targetElementId, t.maxHp, 'heal'); }
                else { const healAmount = t.maxHp - t.currentHp; if (healAmount > 0) { t.heal(healAmount); showFloatingNumber(targetElementId, healAmount, 'heal'); } }
                t.addStatus({ type: 'Empower3', turns: 4, isPhysicalBuff: true, damageMultiplier: 5.0 });
                t.addStatus({ type: 'Fury', turns: 4, isPhysicalBuff: true, doubleAttack: true });
                t.addStatus({ type: 'Lifelink', turns: 4, isPhysicalBuff: true, healPercent: 0.5 });
                gameState.addLogMessage(`${t.name} blessed with Empower3, Fury, and Lifelink!`);
                shimmerSprite(targetElementId, 'gold', 2000);
                updatePartyStatusUI(); updateEnemySpritesUI(); highlightActivePartyStatus(-1);
            }
            else if (p.effect === 'Restore') {
                const ch = p.chance || 1.0;
                if (Math.random() < ch) { let rem = false; if ('clearNegativeStatuses' in t) rem = t.clearNegativeStatuses(); else if (t.statusEffects) { const len = t.statusEffects.length; t.statusEffects = t.statusEffects.filter(s => !['Poison', 'Slow'].includes(s.type)); rem = t.statusEffects.length < len; } if (rem) gameState.addLogMessage(`${t.name}'s ailments fade.`); else gameState.addLogMessage(`${pN} no effect.`); if ('clearNegativeStatuses' in t) updatePartyStatusUI(); }
                else { gameState.addLogMessage(`${pN} no effect.`); }
                highlightActivePartyStatus(-1);
            }
        });
    }

    function endRound() {
        gameState.actionQueue = [];
        if (checkWinCondition()) { handleWinWave(); return; }
        if (checkLoseCondition()) { handleGameOver(); return; }
        processEndOfRound();
        if (checkWinCondition()) { handleWinWave(); return; }
        if (checkLoseCondition()) { handleGameOver(); return; }
        gameState.activeCharacterIndex = 0;
        gameState.setState('PLAYER_COMMAND');
        prepareCommandPhase();
    }

    function processEndOfRound() {
        gameState.party.forEach(c => {
            if (!c.isAlive) return;
            let poisonDmg = 0; const remove = [];
            c.statusEffects.forEach(e => {
                if (e.turns !== undefined) e.turns--;
                if (e.type === 'Poison' && e.turns >= 0) poisonDmg = Math.max(1, Math.round(c.maxHp * 0.05));
                if (e.turns < 0) {
                    remove.push(e.type);
                    if (e.type === 'Empower1' || e.type === 'Empower2' || e.type === 'Empower3') gameState.addLogMessage(`${c.name}'s Empower wore off.`);
                    else if (e.type === 'Fury') gameState.addLogMessage(`${c.name}'s Fury subsided.`);
                    else if (e.type === 'Lifelink') gameState.addLogMessage(`${c.name}'s Lifelink broke.`);
                    else if (e.type === 'Dodge') gameState.addLogMessage(`${c.name}'s Dodge stance ends.`);
                    else if (e.type === 'Taunt') gameState.addLogMessage(`${c.name}'s Taunt fades.`);
                    else gameState.addLogMessage(`${c.name}'s ${e.type} wore off.`);
                }
            });
            remove.forEach(t => c.removeStatus(t));
            if (poisonDmg > 0) { gameState.addLogMessage(`${c.name} takes ${poisonDmg} poison!`); showFloatingNumber(getCorrectElementId(c.id), poisonDmg, 'damage'); c.takeDamage(poisonDmg); }
            if (c.isRaging) { c.isRaging = false; gameState.addLogMessage(`${c.name}'s rage ends.`); }
        });
        gameState.enemies.forEach(e => {
            if (!e.isAlive) return;
            let poisonDmg = 0; const remove = [];
            e.statusEffects.forEach(ef => { if (ef.turns !== undefined) ef.turns--; if (ef.type === 'Poison' && ef.turns >= 0) poisonDmg = Math.max(1, Math.round(e.maxHp * 0.05)); if (ef.turns < 0) remove.push(ef.type); });
            remove.forEach(t => { e.statusEffects = e.statusEffects.filter(s => s.type !== t); });
            if (poisonDmg > 0) { gameState.addLogMessage(`${e.name} takes ${poisonDmg} poison!`); showFloatingNumber(e.id, poisonDmg, 'damage'); e.currentHp -= poisonDmg; if (e.currentHp <= 0) { e.currentHp = 0; e.isAlive = false; gameState.addLogMessage(`${e.name} succumbed!`); } }
        });
        updatePartyStatusUI(); updateEnemySpritesUI();
        if (checkLoseCondition()) handleGameOver();
        if (checkWinCondition()) handleWinWave();
    }

    function checkWinCondition() { return gameState.enemies.length > 0 && gameState.enemies.every(e => !e.isAlive); }
    function checkLoseCondition() { return gameState.party.length > 0 && gameState.party.every(p => !p.isAlive); }

    function handleWinWave() {
        gameState.addLogMessage(`Wave ${gameState.currentWave} Cleared!`);
        gameState.party.forEach(c => { if (c.isRaging) { c.isRaging = false; gameState.addLogMessage(`${c.name}'s rage ends.`); } });
        gameState.party.forEach(c => { if (c.isAlive) c.levelUp(); });
        updatePartyStatusUI();
        
        // Check for victory (wave 90 = King in Yellow defeated)
        if (gameState.currentWave === 90) {
            gameState.setState('VICTORY_SCREEN');
        } else if (gameState.currentWave % 15 === 0) {
            gameState.setState('TAVERN');
        } else {
            gameState.setState('BETWEEN_WAVES');
        }
    }
    
    function setupVictoryScreen() {
        // Setup button handlers for victory screen
        const onwardBtn = document.getElementById('victory-onward-button');
        const restartBtn = document.getElementById('victory-restart-button');
        
        // Remove old listeners by replacing elements
        onwardBtn.replaceWith(onwardBtn.cloneNode(true));
        restartBtn.replaceWith(restartBtn.cloneNode(true));
        
        // Add new listeners
        document.getElementById('victory-onward-button').addEventListener('click', () => {
            gameState.setState('TAVERN');
        });
        
        document.getElementById('victory-restart-button').addEventListener('click', () => {
            initializeGame();
        });
    }

    function handleItemChoice(e) {
        const iN = e.currentTarget.dataset.item;
        gameState.addLogMessage(`Chosen: ${iN}`);
        applyItemEffect(iN);
        gameState.setState('COMBAT_LOADING');
        startNextWave();
    }

    function showItemRewardScreen() {
        const o = document.getElementById('item-options');
        o.innerHTML = '';
        const i1 = 'Potion'; let i2 = '';
        const r = Math.random();
        if (r < 0.49) i2 = 'Serum';
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
            case 'Potion': gameState.party.forEach(c => { if (c.isAlive) c.heal(Math.round(c.maxHp * 0.20)); }); gameState.addLogMessage("Party +20% HP!"); break;
            case 'Serum': gameState.party.forEach(c => { if (c.isAlive) c.restoreMp(Math.round(c.maxMp * 0.50)); }); gameState.addLogMessage("Party +50% MP!"); break;
            case 'Scroll': gameState.party.forEach(c => { if (!c.isAlive) { c.isAlive = true; const healAmount = Math.round(c.maxHp * 0.33); c.heal(healAmount); } }); gameState.addLogMessage("Scroll revives fallen!"); break;
        }
        updatePartyStatusUI();
    }

    function enterTavern() {
        gameState.addLogMessage("Tavern...");
        gameState.party.forEach(c => {
            const wasAlive = c.isAlive;
            c.fullRestore();
            resetLimitGauge(c);
            if (!wasAlive) gameState.addLogMessage(`${c.name} revived!`);
        });
        gameState.addLogMessage("Party fully restored!");
        updatePartyStatusUI();
        updateEnemySpritesUI();
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
        gameState.party.forEach((character, index) => {
            const selectElement = document.getElementById(`class-select-${index + 1}`);
            if (selectElement) {
                const newClassName = selectElement.value;
                if (newClassName !== character.className) {
                    const oldClassName = character.className;
                    character.className = newClassName;
                    character.name = newClassName;
                    character.recalculateStats();
                    gameState.addLogMessage(`${oldClassName} changed to ${newClassName}!`);
                }
            }
        });
        updatePartyStatusUI();
        const backgroundElement = document.getElementById('game-background');
        if (backgroundElement) {
            backgroundElement.style.opacity = '0';
            setTimeout(() => { updateDungeonBackground(); backgroundElement.style.opacity = '0.9'; }, 500);
        }
        gameState.setState('COMBAT_LOADING');
        startNextWave();
    }

    function handleGameOver() {
        gameState.addLogMessage("Party fallen...");
        const b = document.getElementById('restart-button');
        b.replaceWith(b.cloneNode(true));
        document.getElementById('restart-button').addEventListener('click', initializeGame);
    }

    // --- Start the Game ---
    initializeGame();

}); // End DOMContentLoaded
