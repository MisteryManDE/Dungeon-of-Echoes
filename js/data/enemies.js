/**
 * Enemies-Datenmodul für Dungeon of Echoes
 * Enthält Definitionen für alle Gegner im Spiel
 * Version: 2.0.2
 */

const EnemyData = {
    // Anfängergegner (Level 1-3)
    rat: {
        name: "Ratte",
        level: 1,
        hp: 15,
        strength: 2,
        defense: 0,
        magic: 0,
        speed: 3,
        xp: 5,
        gold: 2,
        icon: "🐀",
        attacks: [
            {
                name: "Biss",
                damage: 2,
                type: "physical"
            }
        ],
        loot: [
            {
                name: "Rattenfell",
                type: "material",
                properties: {
                    description: "Das Fell einer Ratte. Nicht besonders wertvoll.",
                    price: 1,
                    stackable: true
                },
                chance: 0.5,
                minCount: 1,
                maxCount: 1
            }
        ]
    },
    
    spider: {
        name: "Spinne",
        level: 2,
        hp: 20,
        strength: 3,
        defense: 1,
        magic: 0,
        speed: 4,
        xp: 8,
        gold: 3,
        icon: "🕷️",
        attacks: [
            {
                name: "Biss",
                damage: 3,
                type: "physical"
            },
            {
                name: "Giftbiss",
                damage: 2,
                type: "poison",
                effect: {
                    name: "Gift",
                    duration: 3,
                    effect: "poison",
                    value: 1
                },
                cooldown: 3
            }
        ],
        loot: [
            {
                name: "Spinnengift",
                type: "material",
                properties: {
                    description: "Gift einer Spinne. Kann für Tränke verwendet werden.",
                    price: 3,
                    stackable: true
                },
                chance: 0.3,
                minCount: 1,
                maxCount: 1
            }
        ]
    },
    
    goblin: {
        name: "Goblin",
        level: 3,
        hp: 25,
        strength: 4,
        defense: 1,
        magic: 0,
        speed: 3,
        xp: 10,
        gold: 5,
        icon: "👺",
        attacks: [
            {
                name: "Dolchstich",
                damage: 4,
                type: "physical"
            },
            {
                name: "Hinterhältiger Angriff",
                damage: 6,
                type: "physical",
                cooldown: 3
            }
        ],
        loot: [
            {
                name: "Goblinohr",
                type: "material",
                properties: {
                    description: "Das Ohr eines Goblins. Manche Sammler zahlen dafür.",
                    price: 2,
                    stackable: true
                },
                chance: 0.4,
                minCount: 1,
                maxCount: 2
            },
            {
                name: "Rostiges Schwert",
                type: "weapon",
                properties: {
                    description: "Ein altes, rostiges Schwert. Besser als nichts.",
                    strength: 2,
                    price: 5
                },
                chance: 0.1,
                minCount: 1,
                maxCount: 1
            }
        ]
    },
    
    // Mittlere Gegner (Level 4-7)
    skeleton: {
        name: "Skelett",
        level: 4,
        hp: 35,
        strength: 5,
        defense: 2,
        magic: 0,
        speed: 2,
        xp: 15,
        gold: 8,
        icon: "💀",
        attacks: [
            {
                name: "Knochenschlag",
                damage: 5,
                type: "physical"
            },
            {
                name: "Knochenwurf",
                damage: 4,
                type: "physical",
                cooldown: 2
            }
        ],
        loot: [
            {
                name: "Knochen",
                type: "material",
                properties: {
                    description: "Ein Knochen eines Skeletts. Kann für Rituale verwendet werden.",
                    price: 3,
                    stackable: true
                },
                chance: 0.6,
                minCount: 1,
                maxCount: 3
            }
        ]
    },
    
    wolf: {
        name: "Wolf",
        level: 5,
        hp: 40,
        strength: 6,
        defense: 2,
        magic: 0,
        speed: 5,
        xp: 18,
        gold: 7,
        icon: "🐺",
        attacks: [
            {
                name: "Biss",
                damage: 6,
                type: "physical"
            },
            {
                name: "Heulen",
                damage: 0,
                type: "buff",
                effect: {
                    name: "Gestärkt",
                    duration: 3,
                    effect: "strengthBoost",
                    value: 2
                },
                cooldown: 4
            }
        ],
        loot: [
            {
                name: "Wolfsfell",
                type: "material",
                properties: {
                    description: "Das Fell eines Wolfs. Warm und wertvoll.",
                    price: 8,
                    stackable: true
                },
                chance: 0.5,
                minCount: 1,
                maxCount: 1
            }
        ]
    },
    
    bandit: {
        name: "Bandit",
        level: 6,
        hp: 45,
        strength: 7,
        defense: 3,
        magic: 0,
        speed: 4,
        xp: 20,
        gold: 15,
        icon: "🦹",
        attacks: [
            {
                name: "Schwertschlag",
                damage: 7,
                type: "physical"
            },
            {
                name: "Taschendiebstahl",
                damage: 0,
                type: "special",
                effect: "stealGold",
                cooldown: 5
            }
        ],
        loot: [
            {
                name: "Gestohlene Waren",
                type: "material",
                properties: {
                    description: "Waren, die der Bandit gestohlen hat. Kann verkauft werden.",
                    price: 10,
                    stackable: true
                },
                chance: 0.4,
                minCount: 1,
                maxCount: 2
            },
            {
                name: "Eisenschwert",
                type: "weapon",
                properties: {
                    description: "Ein solides Eisenschwert. Zuverlässig im Kampf.",
                    strength: 4,
                    price: 20
                },
                chance: 0.1,
                minCount: 1,
                maxCount: 1
            }
        ]
    },
    
    orc: {
        name: "Ork",
        level: 7,
        hp: 55,
        strength: 8,
        defense: 4,
        magic: 0,
        speed: 3,
        xp: 25,
        gold: 12,
        icon: "👹",
        attacks: [
            {
                name: "Axtschlag",
                damage: 8,
                type: "physical"
            },
            {
                name: "Kampfschrei",
                damage: 0,
                type: "buff",
                effect: {
                    name: "Kampfrausch",
                    duration: 3,
                    effect: "strengthBoost",
                    value: 3
                },
                cooldown: 4
            },
            {
                name: "Mächtiger Hieb",
                damage: 12,
                type: "physical",
                cooldown: 3
            }
        ],
        loot: [
            {
                name: "Orkzahn",
                type: "material",
                properties: {
                    description: "Der Zahn eines Orks. Kann für Amulette verwendet werden.",
                    price: 5,
                    stackable: true
                },
                chance: 0.5,
                minCount: 1,
                maxCount: 2
            },
            {
                name: "Orkaxt",
                type: "weapon",
                properties: {
                    description: "Eine schwere Axt, die von Orks verwendet wird.",
                    strength: 6,
                    speed: -1,
                    price: 25
                },
                chance: 0.15,
                minCount: 1,
                maxCount: 1
            }
        ]
    },
    
    // Fortgeschrittene Gegner (Level 8-12)
    ghost: {
        name: "Geist",
        level: 8,
        hp: 50,
        strength: 6,
        defense: 3,
        magic: 5,
        speed: 6,
        xp: 30,
        gold: 10,
        icon: "👻",
        attacks: [
            {
                name: "Geisterhafter Berührung",
                damage: 6,
                type: "magic"
            },
            {
                name: "Schreckensschrei",
                damage: 4,
                type: "magic",
                effect: {
                    name: "Verängstigt",
                    duration: 2,
                    effect: "strengthReduction",
                    value: 2
                },
                cooldown: 3
            }
        ],
        loot: [
            {
                name: "Ektoplasma",
                type: "material",
                properties: {
                    description: "Eine seltsame, geisterhafte Substanz.",
                    price: 12,
                    stackable: true
                },
                chance: 0.4,
                minCount: 1,
                maxCount: 2
            }
        ]
    },
    
    troll: {
        name: "Troll",
        level: 10,
        hp: 80,
        strength: 10,
        defense: 6,
        magic: 0,
        speed: 2,
        xp: 40,
        gold: 20,
        icon: "🧌",
        attacks: [
            {
                name: "Keulenschlag",
                damage: 10,
                type: "physical"
            },
            {
                name: "Stampfen",
                damage: 8,
                type: "physical",
                effect: {
                    name: "Benommen",
                    duration: 1,
                    effect: "stun",
                    value: 1
                },
                cooldown: 4
            },
            {
                name: "Regeneration",
                damage: -5, // Negative Damage = Heilung
                type: "heal",
                cooldown: 5
            }
        ],
        loot: [
            {
                name: "Trollhaut",
                type: "material",
                properties: {
                    description: "Die dicke Haut eines Trolls. Sehr widerstandsfähig.",
                    price: 15,
                    stackable: true
                },
                chance: 0.5,
                minCount: 1,
                maxCount: 2
            },
            {
                name: "Trollkeule",
                type: "weapon",
                properties: {
                    description: "Eine massive Keule, die von einem Troll verwendet wurde.",
                    strength: 8,
                    speed: -2,
                    price: 35
                },
                chance: 0.2,
                minCount: 1,
                maxCount: 1
            }
        ]
    },
    
    dark_mage: {
        name: "Dunkler Magier",
        level: 12,
        hp: 70,
        strength: 5,
        defense: 4,
        magic: 10,
        speed: 5,
        xp: 50,
        gold: 30,
        icon: "🧙",
        attacks: [
            {
                name: "Schattenblitz",
                damage: 8,
                type: "magic"
            },
            {
                name: "Feuerball",
                damage: 12,
                type: "fire",
                effect: {
                    name: "Brennend",
                    duration: 2,
                    effect: "fire",
                    value: 3
                },
                cooldown: 3
            },
            {
                name: "Lebensraub",
                damage: 6,
                type: "magic",
                effect: "leechLife",
                cooldown: 4
            }
        ],
        loot: [
            {
                name: "Magischer Kristall",
                type: "material",
                properties: {
                    description: "Ein Kristall, der magische Energie speichert.",
                    price: 20,
                    stackable: true
                },
                chance: 0.6,
                minCount: 1,
                maxCount: 3
            },
            {
                name: "Verzauberter Stab",
                type: "weapon",
                properties: {
                    description: "Ein mit magischer Energie aufgeladener Stab.",
                    strength: 2,
                    magic: 6,
                    price: 40
                },
                chance: 0.2,
                minCount: 1,
                maxCount: 1
            }
        ]
    },
    
    // Bosse
    goblin_king: {
        name: "Goblinkönig",
        level: 5,
        hp: 100,
        strength: 7,
        defense: 3,
        magic: 2,
        speed: 4,
        xp: 50,
        gold: 50,
        icon: "👑",
        isBoss: true,
        attacks: [
            {
                name: "Königlicher Schlag",
                damage: 7,
                type: "physical"
            },
            {
                name: "Befehl zum Angriff",
                damage: 5,
                type: "physical",
                effect: "summonMinion",
                cooldown: 4
            },
            {
                name: "Königlicher Zorn",
                damage: 10,
                type: "physical",
                cooldown: 3
            }
        ],
        loot: [
            {
                name: "Goblinkrone",
                type: "accessory",
                properties: {
                    description: "Die Krone des Goblinkönigs. Verleiht dem Träger Autorität.",
                    strength: 2,
                    defense: 1,
                    price: 100
                },
                chance: 0.8,
                minCount: 1,
                maxCount: 1
            },
            {
                name: "Königlicher Rubin",
                type: "material",
                properties: {
                    description: "Ein wertvoller Rubin aus der Krone des Goblinkönigs.",
                    price: 50,
                    stackable: true
                },
                chance: 1.0,
                minCount: 1,
                maxCount: 3
            }
        ]
    },
    
    ancient_guardian: {
        name: "Uralter Wächter",
        level: 10,
        hp: 200,
        strength: 12,
        defense: 8,
        magic: 5,
        speed: 3,
        xp: 100,
        gold: 100,
        icon: "🗿",
        isBoss: true,
        attacks: [
            {
                name: "Steinfaust",
                damage: 12,
                type: "physical"
            },
            {
                name: "Erdbeben",
                damage: 10,
                type: "physical",
                effect: {
                    name: "Erschüttert",
                    duration: 2,
                    effect: "speedReduction",
                    value: 2
                },
                cooldown: 4
            },
            {
                name: "Steinregen",
                damage: 8,
                type: "physical",
                cooldown: 3
            },
            {
                name: "Versteinern",
                damage: 0,
                type: "debuff",
                effect: {
                    name: "Versteinert",
                    duration: 1,
                    effect: "stun",
                    value: 1
                },
                cooldown: 5
            }
        ],
        loot: [
            {
                name: "Uralter Stein",
                type: "material",
                properties: {
                    description: "Ein Stein mit uralten Runen. Strahlt magische Energie aus.",
                    price: 75,
                    stackable: true
                },
                chance: 1.0,
                minCount: 2,
                maxCount: 5
            },
            {
                name: "Amulett des Wächters",
                type: "accessory",
                properties: {
                    description: "Ein Amulett, das vom Uralten Wächter getragen wurde. Verleiht große Verteidigung.",
                    defense: 5,
                    maxHp: 20,
                    price: 200
                },
                chance: 0.7,
                minCount: 1,
                maxCount: 1
            }
        ]
    },
    
    dragon: {
        name: "Drache",
        level: 20,
        hp: 500,
        strength: 20,
        defense: 15,
        magic: 15,
        speed: 8,
        xp: 500,
        gold: 500,
        icon: "🐉",
        isBoss: true,
        attacks: [
            {
                name: "Klauenangriff",
                damage: 20,
                type: "physical"
            },
            {
                name: "Feuerodem",
                damage: 25,
                type: "fire",
                effect: {
                    name: "Brennend",
                    duration: 3,
                    effect: "fire",
                    value: 5
                },
                cooldown: 3
            },
            {
                name: "Schwanzschlag",
                damage: 15,
                type: "physical",
                effect: {
                    name: "Zurückgeworfen",
                    duration: 1,
                    effect: "stun",
                    value: 1
                },
                cooldown: 4
            },
            {
                name: "Brüllen",
                damage: 0,
                type: "debuff",
                effect: {
                    name: "Verängstigt",
                    duration: 2,
                    effect: "strengthReduction",
                    value: 5
                },
                cooldown: 5
            }
        ],
        loot: [
            {
                name: "Drachenschuppe",
                type: "material",
                properties: {
                    description: "Eine glänzende Schuppe eines Drachen. Extrem wertvoll und selten.",
                    price: 200,
                    stackable: true
                },
                chance: 1.0,
                minCount: 3,
                maxCount: 8
            },
            {
                name: "Drachenzahn",
                type: "material",
                properties: {
                    description: "Der scharfe Zahn eines Drachen. Kann für mächtige Waffen verwendet werden.",
                    price: 150,
                    stackable: true
                },
                chance: 0.8,
                minCount: 1,
                maxCount: 3
            },
            {
                name: "Drachenschuppenrüstung",
                type: "armor",
                properties: {
                    description: "Eine Rüstung aus den unzerstörbaren Schuppen eines Drachen.",
                    defense: 12,
                    strength: 2,
                    price: 1000
                },
                chance: 0.5,
                minCount: 1,
                maxCount: 1
            }
        ]
    },
    
    /**
     * Gibt einen Gegner anhand seines Schlüssels zurück
     * @param {string} key - Schlüssel des Gegners
     * @returns {Object|null} Der Gegner oder null, wenn nicht gefunden
     */
    getEnemy: function(key) {
        return this[key] || null;
    },
    
    /**
     * Erstellt ein Enemy-Objekt aus einem Schlüssel
     * @param {string} key - Schlüssel des Gegners
     * @returns {Enemy|null} Das Enemy-Objekt oder null, wenn nicht gefunden
     */
    createEnemy: function(key) {
        const enemyData = this.getEnemy(key);
        if (!enemyData) return null;
        
        return new Enemy(key, enemyData);
    },
    
    /**
     * Gibt eine Liste aller Gegner zurück, die bestimmte Kriterien erfüllen
     * @param {Object} criteria - Kriterien für die Filterung
     * @returns {Array} Array mit Gegnern
     */
    getEnemiesByCriteria: function(criteria) {
        const enemies = [];
        
        for (const key in this) {
            if (typeof this[key] !== 'object' || typeof this[key].name !== 'string') continue;
            
            const enemyData = this[key];
            let matches = true;
            
            // Alle Kriterien prüfen
            for (const criteriaKey in criteria) {
                if (enemyData[criteriaKey] !== criteria[criteriaKey]) {
                    matches = false;
                    break;
                }
            }
            
            if (matches) {
                enemies.push(this.createEnemy(key));
            }
        }
        
        return enemies;
    },
    
    /**
     * Gibt eine Liste aller Gegner in einem bestimmten Levelbereich zurück
     * @param {number} minLevel - Minimales Level
     * @param {number} maxLevel - Maximales Level
     * @param {boolean} includeBosses - Gibt an, ob Bosse eingeschlossen werden sollen
     * @returns {Array} Array mit Gegnern
     */
    getEnemiesByLevel: function(minLevel, maxLevel, includeBosses = false) {
        const enemies = [];
        
        for (const key in this) {
            if (typeof this[key] !== 'object' || typeof this[key].name !== 'string') continue;
            
            const enemyData = this[key];
            
            // Level prüfen
            if (enemyData.level >= minLevel && enemyData.level <= maxLevel) {
                // Bosse prüfen
                if (!enemyData.isBoss || includeBosses) {
                    enemies.push(this.createEnemy(key));
                }
            }
        }
        
        return enemies;
    },
    
    /**
     * Gibt einen zufälligen Gegner aus einem bestimmten Levelbereich zurück
     * @param {number} minLevel - Minimales Level
     * @param {number} maxLevel - Maximales Level
     * @param {boolean} includeBosses - Gibt an, ob Bosse eingeschlossen werden sollen
     * @returns {Enemy|null} Ein zufälliger Gegner oder null, wenn keiner gefunden wurde
     */
    getRandomEnemy: function(minLevel, maxLevel, includeBosses = false) {
        const enemies = this.getEnemiesByLevel(minLevel, maxLevel, includeBosses);
        
        if (enemies.length === 0) return null;
        
        return Utils.randomChoice(enemies);
    },
    
    /**
     * Gibt einen Boss aus einem bestimmten Levelbereich zurück
     * @param {number} minLevel - Minimales Level
     * @param {number} maxLevel - Maximales Level
     * @returns {Enemy|null} Ein Boss oder null, wenn keiner gefunden wurde
     */
    getBoss: function(minLevel, maxLevel) {
        const bosses = [];
        
        for (const key in this) {
            if (typeof this[key] !== 'object' || typeof this[key].name !== 'string') continue;
            
            const enemyData = this[key];
            
            // Level und Boss prüfen
            if (enemyData.level >= minLevel && enemyData.level <= maxLevel && enemyData.isBoss) {
                bosses.push(this.createEnemy(key));
            }
        }
        
        if (bosses.length === 0) return null;
        
        return Utils.randomChoice(bosses);
    }
};
