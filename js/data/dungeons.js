/**
 * Dungeons-Datenmodul für Dungeon of Echoes
 * Enthält Definitionen für alle Dungeons im Spiel
 * Version: 2.0.2
 */

const DungeonData = {
    // Anfänger-Dungeon
    goblin_cave: {
        name: "Goblinhöhle",
        description: "Eine Höhle voller Goblins. Ein guter Ort für Anfänger.",
        minLevel: 1,
        maxLevel: 5,
        icon: "🏔️",
        background: "#654321",
        floors: 3,
        enemies: ["rat", "spider", "goblin"],
        boss: "goblin_king",
        loot: {
            common: ["health_potion_small", "leather_gloves", "leather_boots"],
            uncommon: ["iron_sword", "leather_armor", "strength_elixir"],
            rare: ["chainmail", "iron_helmet"]
        },
        events: [
            {
                name: "Versteckte Truhe",
                description: "Du findest eine versteckte Truhe in einer Nische.",
                chance: 0.2,
                rewards: [
                    {
                        type: "gold",
                        min: 10,
                        max: 30,
                        chance: 1.0
                    },
                    {
                        type: "item",
                        itemKey: "health_potion_small",
                        chance: 0.5
                    }
                ]
            },
            {
                name: "Goblin-Lager",
                description: "Du stolperst über ein verlassenes Goblin-Lager.",
                chance: 0.15,
                rewards: [
                    {
                        type: "gold",
                        min: 5,
                        max: 15,
                        chance: 0.8
                    },
                    {
                        type: "item",
                        itemKey: "leather_armor",
                        chance: 0.3
                    }
                ]
            }
        ]
    },
    
    // Mittlerer Dungeon
    haunted_crypt: {
        name: "Verfluchte Krypta",
        description: "Eine alte Krypta, in der die Toten keine Ruhe finden.",
        minLevel: 5,
        maxLevel: 10,
        icon: "⚰️",
        background: "#333333",
        floors: 5,
        enemies: ["skeleton", "ghost", "bandit"],
        boss: "ancient_guardian",
        loot: {
            common: ["health_potion_medium", "mana_potion_small", "iron_gauntlets"],
            uncommon: ["steel_greatsword", "enchanted_robe", "defense_elixir"],
            rare: ["archmage_robe", "magic_ring"]
        },
        events: [
            {
                name: "Alter Altar",
                description: "Du findest einen alten Altar, der schwach leuchtet.",
                chance: 0.2,
                rewards: [
                    {
                        type: "heal",
                        min: 20,
                        max: 40,
                        chance: 0.7
                    },
                    {
                        type: "damage",
                        min: 5,
                        max: 15,
                        chance: 0.3
                    }
                ]
            },
            {
                name: "Geheime Bibliothek",
                description: "Du entdeckst eine verborgene Bibliothek mit alten Schriften.",
                chance: 0.1,
                rewards: [
                    {
                        type: "item",
                        itemKey: "magic_elixir",
                        chance: 0.5
                    },
                    {
                        type: "xp",
                        min: 50,
                        max: 100,
                        chance: 0.8
                    }
                ]
            }
        ]
    },
    
    // Fortgeschrittener Dungeon
    dragon_lair: {
        name: "Drachenhöhle",
        description: "Die Höhle eines mächtigen Drachen. Nur für erfahrene Abenteurer.",
        minLevel: 15,
        maxLevel: 25,
        icon: "🔥",
        background: "#8B0000",
        floors: 7,
        enemies: ["troll", "dark_mage", "orc"],
        boss: "dragon",
        loot: {
            common: ["health_potion_large", "mana_potion_medium", "plate_armor"],
            uncommon: ["dragonslayer", "robe_of_arcana", "speed_elixir"],
            rare: ["dragon_scale_armor", "health_pendant"]
        },
        events: [
            {
                name: "Drachenschatz",
                description: "Du findest einen Teil des Drachenschatzes.",
                chance: 0.15,
                rewards: [
                    {
                        type: "gold",
                        min: 100,
                        max: 300,
                        chance: 1.0
                    },
                    {
                        type: "item",
                        itemKey: "rare_dwarven_ale",
                        chance: 0.4
                    }
                ]
            },
            {
                name: "Heiße Quelle",
                description: "Du entdeckst eine heiße Quelle, die von der Hitze des Drachen erwärmt wird.",
                chance: 0.2,
                rewards: [
                    {
                        type: "heal",
                        min: 50,
                        max: 100,
                        chance: 0.9
                    },
                    {
                        type: "buff",
                        buffName: "Hitzeresistenz",
                        buffDuration: 10,
                        buffEffect: "defenseBoost",
                        buffValue: 3,
                        chance: 0.7
                    }
                ]
            }
        ]
    },
    
    /**
     * Gibt einen Dungeon anhand seines Schlüssels zurück
     * @param {string} key - Schlüssel des Dungeons
     * @returns {Object|null} Der Dungeon oder null, wenn nicht gefunden
     */
    getDungeon: function(key) {
        return this[key] || null;
    },
    
    /**
     * Gibt eine Liste aller Dungeons zurück
     * @returns {Array} Array mit Dungeons
     */
    getAllDungeons: function() {
        const dungeons = [];
        
        for (const key in this) {
            if (typeof this[key] !== 'object' || typeof this[key].name !== 'string') continue;
            
            const dungeon = this[key];
            dungeons.push({
                key: key,
                name: dungeon.name,
                description: dungeon.description,
                minLevel: dungeon.minLevel,
                maxLevel: dungeon.maxLevel,
                icon: dungeon.icon
            });
        }
        
        return dungeons;
    },
    
    /**
     * Gibt eine Liste aller Dungeons zurück, die für ein bestimmtes Level geeignet sind
     * @param {number} playerLevel - Level des Spielers
     * @returns {Array} Array mit Dungeons
     */
    getDungeonsByLevel: function(playerLevel) {
        const dungeons = [];
        
        for (const key in this) {
            if (typeof this[key] !== 'object' || typeof this[key].name !== 'string') continue;
            
            const dungeon = this[key];
            
            // Level prüfen
            if (playerLevel >= dungeon.minLevel && playerLevel <= dungeon.maxLevel + 5) {
                dungeons.push({
                    key: key,
                    name: dungeon.name,
                    description: dungeon.description,
                    minLevel: dungeon.minLevel,
                    maxLevel: dungeon.maxLevel,
                    icon: dungeon.icon
                });
            }
        }
        
        return dungeons;
    },
    
    /**
     * Generiert einen zufälligen Gegner für einen Dungeon
     * @param {string} dungeonKey - Schlüssel des Dungeons
     * @param {boolean} isBoss - Gibt an, ob es sich um einen Boss handeln soll
     * @returns {Enemy|null} Ein zufälliger Gegner oder null, wenn keiner gefunden wurde
     */
    generateEnemy: function(dungeonKey, isBoss = false) {
        const dungeon = this.getDungeon(dungeonKey);
        if (!dungeon) return null;
        
        if (isBoss) {
            // Boss generieren
            return EnemyData.createEnemy(dungeon.boss);
        } else {
            // Zufälligen Gegner generieren
            const enemyKey = Utils.randomChoice(dungeon.enemies);
            return EnemyData.createEnemy(enemyKey);
        }
    },
    
    /**
     * Generiert einen zufälligen Gegenstand als Beute für einen Dungeon
     * @param {string} dungeonKey - Schlüssel des Dungeons
     * @returns {Item|null} Ein zufälliger Gegenstand oder null, wenn keiner gefunden wurde
     */
    generateLoot: function(dungeonKey) {
        const dungeon = this.getDungeon(dungeonKey);
        if (!dungeon || !dungeon.loot) return null;
        
        // Seltenheit bestimmen
        const rarityRoll = Math.random();
        let rarityCategory;
        
        if (rarityRoll < 0.6) {
            rarityCategory = "common";
        } else if (rarityRoll < 0.9) {
            rarityCategory = "uncommon";
        } else {
            rarityCategory = "rare";
        }
        
        // Gegenstand aus der Kategorie auswählen
        const lootCategory = dungeon.loot[rarityCategory];
        if (!lootCategory || lootCategory.length === 0) return null;
        
        const itemKey = Utils.randomChoice(lootCategory);
        return ItemData.createItem(itemKey);
    },
    
    /**
     * Generiert ein zufälliges Ereignis für einen Dungeon
     * @param {string} dungeonKey - Schlüssel des Dungeons
     * @returns {Object|null} Ein zufälliges Ereignis oder null, wenn keines gefunden wurde
     */
    generateEvent: function(dungeonKey) {
        const dungeon = this.getDungeon(dungeonKey);
        if (!dungeon || !dungeon.events || dungeon.events.length === 0) return null;
        
        // Zufälliges Ereignis auswählen
        const event = Utils.randomChoice(dungeon.events);
        
        // Prüfen, ob das Ereignis eintritt
        if (Math.random() > event.chance) return null;
        
        // Belohnungen generieren
        const rewards = [];
        
        for (const reward of event.rewards) {
            if (Math.random() <= reward.chance) {
                switch (reward.type) {
                    case "gold":
                        rewards.push({
                            type: "gold",
                            amount: Utils.randomInt(reward.min, reward.max)
                        });
                        break;
                        
                    case "item":
                        rewards.push({
                            type: "item",
                            item: ItemData.createItem(reward.itemKey)
                        });
                        break;
                        
                    case "xp":
                        rewards.push({
                            type: "xp",
                            amount: Utils.randomInt(reward.min, reward.max)
                        });
                        break;
                        
                    case "heal":
                        rewards.push({
                            type: "heal",
                            amount: Utils.randomInt(reward.min, reward.max)
                        });
                        break;
                        
                    case "damage":
                        rewards.push({
                            type: "damage",
                            amount: Utils.randomInt(reward.min, reward.max)
                        });
                        break;
                        
                    case "buff":
                        rewards.push({
                            type: "buff",
                            buffName: reward.buffName,
                            buffDuration: reward.buffDuration,
                            buffEffect: reward.buffEffect,
                            buffValue: reward.buffValue
                        });
                        break;
                }
            }
        }
        
        return {
            name: event.name,
            description: event.description,
            rewards: rewards
        };
    }
};
