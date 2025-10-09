/**
 * Konfigurationsdatei für Dungeon of Echoes
 * Enthält globale Einstellungen und Konstanten
 * Version: 2.0.2
 */

const Config = {
    // Spielversion
    version: '2.0.2',
    
    // Spieleinstellungen
    settings: {
        startingGold: 50,
        startingLevel: 1,
        maxLevel: 30,
        maxInventorySlots: 20,
        maxEquipmentSlots: 6,
        maxAbilitySlots: 5,
        maxCompanions: 1,
        saveInterval: 300000, // 5 Minuten in Millisekunden
        debugMode: false
    },
    
    // Erfahrungspunkte pro Level
    experienceTable: [
        0,      // Level 1
        100,    // Level 2
        300,    // Level 3
        600,    // Level 4
        1000,   // Level 5
        1500,   // Level 6
        2100,   // Level 7
        2800,   // Level 8
        3600,   // Level 9
        4500,   // Level 10
        5500,   // Level 11
        6600,   // Level 12
        7800,   // Level 13
        9100,   // Level 14
        10500,  // Level 15
        12000,  // Level 16
        13600,  // Level 17
        15300,  // Level 18
        17100,  // Level 19
        19000,  // Level 20
        21000,  // Level 21
        23100,  // Level 22
        25300,  // Level 23
        27600,  // Level 24
        30000,  // Level 25
        32500,  // Level 26
        35100,  // Level 27
        37800,  // Level 28
        40600,  // Level 29
        43500   // Level 30
    ],
    
    // Klassen-Basiswerte
    classBaseStats: {
        warrior: {
            hp: 50,
            strength: 8,
            defense: 5,
            magic: 2,
            speed: 3
        },
        rogue: {
            hp: 40,
            strength: 5,
            defense: 3,
            magic: 3,
            speed: 7
        },
        mage: {
            hp: 35,
            strength: 2,
            defense: 2,
            magic: 8,
            speed: 4
        }
    },
    
    // Klassen-Wachstumsraten pro Level
    classGrowthRates: {
        warrior: {
            hp: 10,
            strength: 1.5,
            defense: 1.2,
            magic: 0.5,
            speed: 0.8
        },
        rogue: {
            hp: 8,
            strength: 1.0,
            defense: 0.8,
            magic: 0.7,
            speed: 1.5
        },
        mage: {
            hp: 6,
            strength: 0.5,
            defense: 0.6,
            magic: 1.8,
            speed: 1.0
        }
    },
    
    // Kampfeinstellungen
    combat: {
        criticalHitChance: 0.1,
        criticalHitMultiplier: 1.5,
        dodgeBaseChance: 0.05,
        maxEnemies: 3,
        turnTimeLimit: 30000, // 30 Sekunden in Millisekunden
        escapeBaseChance: 0.5,
        statusEffectMaxDuration: 5, // 5 Runden
        multiEnemyChances: {
            second: 0.05, // 5% Chance für einen zweiten Gegner
            third: 0.02   // 2% Chance für einen dritten Gegner
        }
    },
    
    // Erkundungseinstellungen
    exploration: {
        eventChance: 0.7,
        enemyChance: 0.4,
        itemChance: 0.2,
        nothingChance: 0.1,
        specialEventChance: 0.05,
        companionFindChance: 0.02,
        weatherChangeChance: 0.1
    },
    
    // Wetter-Effekte
    weather: {
        clear: {
            name: "Klar",
            description: "Ein klarer Tag ohne besondere Effekte.",
            effect: null
        },
        rainy: {
            name: "Regnerisch",
            description: "Der Regen erschwert die Sicht. Genauigkeit leicht reduziert.",
            effect: {
                type: "accuracyReduction",
                value: 0.1
            }
        },
        foggy: {
            name: "Neblig",
            description: "Dichter Nebel umgibt dich. Chance auf kritische Treffer erhöht.",
            effect: {
                type: "criticalChanceBoost",
                value: 0.05
            }
        },
        stormy: {
            name: "Stürmisch",
            description: "Ein heftiger Sturm tobt. Bewegungsgeschwindigkeit reduziert.",
            effect: {
                type: "speedReduction",
                value: 0.15
            }
        },
        sunny: {
            name: "Sonnig",
            description: "Die Sonne scheint hell. Regeneration leicht erhöht.",
            effect: {
                type: "regenerationBoost",
                value: 1
            }
        }
    },
    
    // Tavernenspiel-Einstellungen
    tavernGame: {
        difficultyLevels: [
            { playerSpeed: 6, dwarfSpeed: 1.5, maxProgress: 100, dwarfFailRate: 0.4 }, // Level 1: Leicht
            { playerSpeed: 6, dwarfSpeed: 2.5, maxProgress: 120, dwarfFailRate: 0.25 }, // Level 2: Mittel
            { playerSpeed: 5, dwarfSpeed: 3.5, maxProgress: 150, dwarfFailRate: 0.1 }  // Level 3: Schwer
        ],
        progressDecayRate: 0.07, // 7% pro Sekunde
        powerupDuration: 40, // 6 Sekunden (40 * 150ms)
        keySequenceLength: 4,
        countdownDuration: 3 // 3 Sekunden Countdown
    }
};
