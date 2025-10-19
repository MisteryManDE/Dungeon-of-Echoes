

/**
 * Config-Modul für Dungeon of Echoes
 * Enthält Konfigurationseinstellungen für das Spiel
 * Version: 2.0.2
 */

const Config = {
    // Spielversion
    version: "2.0.2",

    // Allgemeine Einstellungen
    settings: {
        // Spieler
        startingLevel: 1,
        startingGold: 50,
        maxLevel: 30,
        maxCompanions: 3,

        // Inventar
        maxInventorySlots: 20,

        // Fähigkeiten
        maxAbilitySlots: 4,

        // Speichern
        saveInterval: 5 * 60 * 1000, // 5 Minuten

        // Debug-Modus
        debugMode: false
    },

    // Kampfeinstellungen
    combat: {
        // Schaden
        defenseMultiplier: 0.5,

        // Kritische Treffer
        baseCriticalChance: 0.05,
        luckCriticalMultiplier: 0.01,
        criticalHitMultiplier: 1.5,

        // Ausweichen
        baseDodgeChance: 0.05,
        speedDodgeMultiplier: 0.01,

        // Flucht
        baseEscapeChance: 0.3,
        speedEscapeMultiplier: 0.02,
        levelEscapeMultiplier: 0.02,

        // Erfahrung
        baseXpMultiplier: 10,
        levelXpBonus: 0.2,
        levelXpPenalty: 0.1,

        // Gold
        baseGoldMultiplier: 5,

        // Mehrere Gegner
        maxEnemies: 3,
        multiEnemyChance: 0.3,
        thirdEnemyChance: 0.2
    },

    // Wirtschaftseinstellungen
    economy: {
        // Verkauf
        baseSellMultiplier: 0.5,
        charismaSellBonus: 0.02,

        // Kauf
        charismaBuyDiscount: 0.02
    },

    // Erfahrungstabelle
    experienceTable: {
        1: 100,
        2: 250,
        3: 500,
        4: 1000,
        5: 2000,
        6: 3500,
        7: 5500,
        8: 8000,
        9: 11000,
        10: 15000,
        11: 20000,
        12: 26000,
        13: 33000,
        14: 41000,
        15: 50000,
        16: 60000,
        17: 72000,
        18: 85000,
        19: 100000,
        20: 120000,
        21: 145000,
        22: 175000,
        23: 210000,
        24: 250000,
        25: 300000,
        26: 360000,
        27: 430000,
        28: 510000,
        29: 600000,
        30: 700000
    },

    // Tavernenspiel-Einstellungen
    tavernGame: {
        // Countdown vor Spielbeginn (in Sekunden)
        countdownDuration: 3,

        // Länge der Tastensequenz
        keySequenceLength: 4,

        // Dauer des Powerups (in Spielschritten)
        powerupDuration: 10,

        // Automatischer Abfall des Fortschrittsbalkens (pro Sekunde)
        progressDecayRate: 0.07,

        // Schwierigkeitsstufen
        difficultyLevels: [
            {
                // Anfänger
                maxProgress: 100,
                playerSpeed: 5,
                dwarfSpeed: 2, // Verlangsamt von 3 auf 2
                dwarfFailRate: 0.5 // Erhöht von 0.4 auf 0.5
            },
            {
                // Fortgeschritten
                maxProgress: 150,
                playerSpeed: 5,
                dwarfSpeed: 3, // Verlangsamt von 4 auf 3
                dwarfFailRate: 0.4 // Erhöht von 0.3 auf 0.4
            },
            {
                // Meister
                maxProgress: 200,
                playerSpeed: 5,
                dwarfSpeed: 4, // Verlangsamt von 5 auf 4
                dwarfFailRate: 0.3 // Erhöht von 0.2 auf 0.3
            }
        ]
    },

    // Startattribute für Klassen
    classBaseStats: {
        warrior: {
            hp: 50,
            mana: 20,
            strength: 8,
            defense: 6,
            magic: 2,
            speed: 4
        },
        rogue: {
            hp: 40,
            mana: 30,
            strength: 6,
            defense: 4,
            magic: 3,
            speed: 8
        },
        mage: {
            hp: 30,
            mana: 50,
            strength: 3,
            defense: 3,
            magic: 8,
            speed: 5
        }
    },

    // Attributwachstum pro Level
    classGrowthRates: {
        warrior: {
            hp: 10,
            mana: 3,
            strength: 1.5,
            defense: 1.2,
            magic: 0.5,
            speed: 0.8
        },
        rogue: {
            hp: 8,
            mana: 5,
            strength: 1.2,
            defense: 0.8,
            magic: 0.7,
            speed: 1.5
        },
        mage: {
            hp: 6,
            mana: 10,
            strength: 0.6,
            defense: 0.6,
            magic: 1.5,
            speed: 1.0
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
    }
};