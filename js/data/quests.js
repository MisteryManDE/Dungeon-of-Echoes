/**
 * Quests-Datenmodul für Dungeon of Echoes
 * Enthält Definitionen für alle Quests im Spiel
 * Version: 2.0.2
 */

const QuestData = {
    // Hauptquests
    main_quests: {
        mysterious_letter: {
            id: "mysterious_letter",
            name: "Der mysteriöse Brief",
            description: "Du hast einen mysteriösen Brief erhalten, der dich zu einem Abenteuer einlädt. Finde heraus, wer ihn geschickt hat.",
            type: "main",
            level: 1,
            objectives: [
                {
                    type: "talk",
                    target: "innkeeper",
                    description: "Sprich mit dem Wirt in der Taverne"
                },
                {
                    type: "explore",
                    target: "town_square",
                    description: "Untersuche den Marktplatz"
                }
            ],
            rewards: [
                {
                    type: "gold",
                    amount: 50
                },
                {
                    type: "xp",
                    amount: 100
                },
                {
                    type: "item",
                    itemKey: "leather_armor"
                }
            ],
            nextQuest: "goblin_threat"
        },
        
        goblin_threat: {
            id: "goblin_threat",
            name: "Die Goblin-Bedrohung",
            description: "Goblins haben die Umgebung der Stadt unsicher gemacht. Finde und besiege ihren Anführer.",
            type: "main",
            level: 3,
            objectives: [
                {
                    type: "kill",
                    target: "goblin",
                    count: 5,
                    description: "Töte 5 Goblins"
                },
                {
                    type: "explore",
                    target: "goblin_cave",
                    description: "Finde die Goblinhöhle"
                },
                {
                    type: "kill",
                    target: "goblin_king",
                    count: 1,
                    description: "Besiege den Goblinkönig"
                }
            ],
            rewards: [
                {
                    type: "gold",
                    amount: 100
                },
                {
                    type: "xp",
                    amount: 200
                },
                {
                    type: "item",
                    itemKey: "iron_sword"
                }
            ],
            nextQuest: "ancient_ruins"
        },
        
        ancient_ruins: {
            id: "ancient_ruins",
            name: "Die alten Ruinen",
            description: "In den alten Ruinen soll ein mächtiges Artefakt verborgen sein. Finde es, bevor es in die falschen Hände gerät.",
            type: "main",
            level: 7,
            objectives: [
                {
                    type: "explore",
                    target: "ancient_ruins_entrance",
                    description: "Finde den Eingang zu den alten Ruinen"
                },
                {
                    type: "collect",
                    target: "ancient_key",
                    count: 3,
                    description: "Sammle 3 antike Schlüssel"
                },
                {
                    type: "explore",
                    target: "ancient_ruins_chamber",
                    description: "Betrete die Hauptkammer der Ruinen"
                },
                {
                    type: "kill",
                    target: "ancient_guardian",
                    count: 1,
                    description: "Besiege den Uralten Wächter"
                }
            ],
            rewards: [
                {
                    type: "gold",
                    amount: 250
                },
                {
                    type: "xp",
                    amount: 500
                },
                {
                    type: "item",
                    itemKey: "amulet_of_power"
                }
            ],
            nextQuest: "dragon_threat"
        }
    },
    
    // Nebenquests
    side_quests: {
        lost_pet: {
            id: "lost_pet",
            name: "Das verlorene Haustier",
            description: "Ein Dorfbewohner hat sein Haustier verloren. Hilf ihm, es wiederzufinden.",
            type: "side",
            level: 1,
            objectives: [
                {
                    type: "explore",
                    target: "forest_edge",
                    description: "Suche am Waldrand"
                },
                {
                    type: "collect",
                    target: "pet_collar",
                    count: 1,
                    description: "Finde das Halsband des Haustiers"
                },
                {
                    type: "talk",
                    target: "villager",
                    description: "Bringe das Halsband zum Dorfbewohner zurück"
                }
            ],
            rewards: [
                {
                    type: "gold",
                    amount: 20
                },
                {
                    type: "xp",
                    amount: 50
                }
            ]
        },
        
        herb_collection: {
            id: "herb_collection",
            name: "Kräutersammlung",
            description: "Der Alchemist benötigt seltene Kräuter für seine Tränke.",
            type: "side",
            level: 2,
            objectives: [
                {
                    type: "collect",
                    target: "herb",
                    count: 10,
                    description: "Sammle 10 Heilkräuter"
                },
                {
                    type: "talk",
                    target: "alchemist",
                    description: "Bringe die Kräuter zum Alchemisten"
                }
            ],
            rewards: [
                {
                    type: "gold",
                    amount: 30
                },
                {
                    type: "xp",
                    amount: 75
                },
                {
                    type: "item",
                    itemKey: "health_potion_medium"
                }
            ]
        },
        
        bandit_camp: {
            id: "bandit_camp",
            name: "Das Banditenlager",
            description: "Banditen haben die Handelsrouten unsicher gemacht. Räume ihr Lager auf.",
            type: "side",
            level: 5,
            objectives: [
                {
                    type: "explore",
                    target: "bandit_camp",
                    description: "Finde das Banditenlager"
                },
                {
                    type: "kill",
                    target: "bandit",
                    count: 8,
                    description: "Töte 8 Banditen"
                },
                {
                    type: "collect",
                    target: "stolen_goods",
                    count: 1,
                    description: "Finde die gestohlenen Waren"
                },
                {
                    type: "talk",
                    target: "merchant",
                    description: "Bringe die Waren zum Händler zurück"
                }
            ],
            rewards: [
                {
                    type: "gold",
                    amount: 100
                },
                {
                    type: "xp",
                    amount: 150
                },
                {
                    type: "item",
                    itemKey: "chainmail"
                }
            ]
        }
    },
    
    // Tägliche Quests
    daily_quests: {
        monster_hunt: {
            id: "monster_hunt",
            name: "Monsterjagd",
            description: "Jage eine bestimmte Anzahl von Monstern.",
            type: "daily",
            level: 1,
            objectives: [
                {
                    type: "kill",
                    target: "random",
                    count: 10,
                    description: "Töte 10 Monster"
                }
            ],
            rewards: [
                {
                    type: "gold",
                    amount: 50
                },
                {
                    type: "xp",
                    amount: 100
                }
            ]
        },
        
        resource_gathering: {
            id: "resource_gathering",
            name: "Ressourcensammlung",
            description: "Sammle verschiedene Ressourcen für die Stadt.",
            type: "daily",
            level: 1,
            objectives: [
                {
                    type: "collect",
                    target: "wood",
                    count: 5,
                    description: "Sammle 5 Holz"
                },
                {
                    type: "collect",
                    target: "herb",
                    count: 3,
                    description: "Sammle 3 Heilkräuter"
                }
            ],
            rewards: [
                {
                    type: "gold",
                    amount: 30
                },
                {
                    type: "xp",
                    amount: 75
                }
            ]
        },
        
        dungeon_exploration: {
            id: "dungeon_exploration",
            name: "Dungeon-Erkundung",
            description: "Erkunde einen Dungeon und besiege Gegner.",
            type: "daily",
            level: 3,
            objectives: [
                {
                    type: "explore",
                    target: "random_dungeon",
                    description: "Betrete einen Dungeon"
                },
                {
                    type: "kill",
                    target: "random",
                    count: 15,
                    description: "Töte 15 Gegner im Dungeon"
                }
            ],
            rewards: [
                {
                    type: "gold",
                    amount: 75
                },
                {
                    type: "xp",
                    amount: 150
                },
                {
                    type: "item",
                    itemKey: "random_potion"
                }
            ]
        }
    },
    
    /**
     * Gibt eine Quest anhand ihrer ID zurück
     * @param {string} questId - ID der Quest
     * @returns {Object|null} Die Quest oder null, wenn nicht gefunden
     */
    getQuest: function(questId) {
        // Alle Questtypen durchsuchen
        for (const questType in this) {
            if (typeof this[questType] !== 'object') continue;
            
            for (const key in this[questType]) {
                if (this[questType][key].id === questId) {
                    return this[questType][key];
                }
            }
        }
        
        return null;
    },
    
    /**
     * Gibt alle Quests eines bestimmten Typs zurück
     * @param {string} type - Typ der Quests (main, side, daily)
     * @returns {Array} Array mit Quests
     */
    getQuestsByType: function(type) {
        const questsObj = this[type + "_quests"];
        if (!questsObj) return [];
        
        const quests = [];
        for (const key in questsObj) {
            quests.push(questsObj[key]);
        }
        
        return quests;
    },
    
    /**
     * Gibt alle Quests zurück, die für ein bestimmtes Level verfügbar sind
     * @param {number} playerLevel - Level des Spielers
     * @returns {Array} Array mit Quests
     */
    getQuestsByLevel: function(playerLevel) {
        const quests = [];
        
        // Alle Questtypen durchsuchen
        for (const questType in this) {
            if (typeof this[questType] !== 'object') continue;
            
            for (const key in this[questType]) {
                const quest = this[questType][key];
                if (quest.level <= playerLevel) {
                    quests.push(quest);
                }
            }
        }
        
        return quests;
    },
    
    /**
     * Gibt eine zufällige tägliche Quest zurück
     * @param {number} playerLevel - Level des Spielers
     * @returns {Object|null} Eine zufällige tägliche Quest oder null, wenn keine verfügbar ist
     */
    getRandomDailyQuest: function(playerLevel) {
        const dailyQuests = this.getQuestsByType("daily").filter(quest => quest.level <= playerLevel);
        
        if (dailyQuests.length === 0) return null;
        
        return Utils.randomChoice(dailyQuests);
    },
    
    /**
     * Generiert eine zufällige Quest basierend auf einer Vorlage
     * @param {Object} template - Die Quest-Vorlage
     * @param {number} playerLevel - Level des Spielers
     * @returns {Object} Die generierte Quest
     */
    generateRandomQuest: function(template, playerLevel) {
        const quest = { ...template };
        
        // Zufällige Ziele generieren
        for (let i = 0; i < quest.objectives.length; i++) {
            const objective = quest.objectives[i];
            
            if (objective.target === "random") {
                // Zufälliges Ziel basierend auf dem Spielerlevel
                const enemies = EnemyData.getEnemiesByLevel(playerLevel - 2, playerLevel + 2, false);
                if (enemies.length > 0) {
                    const enemy = Utils.randomChoice(enemies);
                    objective.target = enemy.type;
                    objective.description = `Töte ${objective.count} ${enemy.name}`;
                }
            } else if (objective.target === "random_dungeon") {
                // Zufälliger Dungeon basierend auf dem Spielerlevel
                const dungeons = DungeonData.getDungeonsByLevel(playerLevel);
                if (dungeons.length > 0) {
                    const dungeon = Utils.randomChoice(dungeons);
                    objective.target = dungeon.key;
                    objective.description = `Betrete ${dungeon.name}`;
                }
            }
        }
        
        // Zufällige Belohnungen generieren
        for (let i = 0; i < quest.rewards.length; i++) {
            const reward = quest.rewards[i];
            
            if (reward.type === "item" && reward.itemKey === "random_potion") {
                // Zufälliger Trank basierend auf dem Spielerlevel
                const potions = ["health_potion_small", "health_potion_medium", "health_potion_large", "mana_potion_small", "mana_potion_medium"];
                reward.itemKey = Utils.randomChoice(potions);
            }
        }
        
        return quest;
    }
};
