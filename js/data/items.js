/**
 * Items-Datenmodul für Dungeon of Echoes
 * Enthält Definitionen für alle Gegenstände im Spiel
 * Version: 2.0.2
 */

const ItemData = {
    // Waffen
    weapons: {
        // Anfängerwaffen
        rusty_sword: {
            name: "Rostiges Schwert",
            type: "weapon",
            description: "Ein altes, rostiges Schwert. Besser als nichts.",
            icon: "⚔️",
            strength: 2,
            price: 10,
            rarity: 1
        },
        wooden_staff: {
            name: "Holzstab",
            type: "weapon",
            description: "Ein einfacher Holzstab. Gut für angehende Magier.",
            icon: "🗒️", // Scroll-Emoji als Alternative zum Zauberstab
            strength: 1,
            magic: 2,
            price: 10,
            rarity: 1
        },
        dagger: {
            name: "Dolch",
            type: "weapon",
            description: "Ein kleiner, aber scharfer Dolch. Perfekt für schnelle Angriffe.",
            icon: "🗡️",
            strength: 1,
            speed: 1,
            price: 10,
            rarity: 1
        },

        // Bessere Waffen
        iron_sword: {
            name: "Eisenschwert",
            type: "weapon",
            description: "Ein solides Eisenschwert. Zuverlässig im Kampf.",
            icon: "⚔️",
            strength: 4,
            price: 25,
            rarity: 2
        },
        enchanted_staff: {
            name: "Verzauberter Stab",
            type: "weapon",
            description: "Ein mit magischer Energie aufgeladener Stab.",
            icon: "🪄",
            strength: 2,
            magic: 4,
            price: 25,
            rarity: 2
        },
        assassins_blade: {
            name: "Assassinenklinge",
            type: "weapon",
            description: "Eine leichte, aber tödliche Klinge für präzise Angriffe.",
            icon: "🗡️",
            strength: 3,
            speed: 2,
            price: 25,
            rarity: 2
        },

        // Seltene Waffen
        steel_greatsword: {
            name: "Stahlgroßschwert",
            type: "weapon",
            description: "Ein mächtiges Großschwert aus feinstem Stahl.",
            icon: "⚔️",
            strength: 7,
            speed: -1,
            price: 60,
            rarity: 3
        },
        arcane_wand: {
            name: "Arkaner Zauberstab",
            type: "weapon",
            description: "Ein Zauberstab, der mit arkaner Energie pulsiert.",
            icon: "🪄",
            strength: 3,
            magic: 7,
            price: 60,
            rarity: 3
        },
        shadow_daggers: {
            name: "Schattendolche",
            type: "weapon",
            description: "Dolche, die im Schatten fast unsichtbar werden.",
            icon: "🗡️",
            strength: 5,
            speed: 3,
            price: 60,
            rarity: 3
        },

        // Epische Waffen
        dragonslayer: {
            name: "Drachentöter",
            type: "weapon",
            description: "Ein legendäres Schwert, geschmiedet, um Drachen zu töten.",
            icon: "⚔️",
            strength: 12,
            defense: 2,
            price: 150,
            rarity: 4
        },
        staff_of_elements: {
            name: "Stab der Elemente",
            type: "weapon",
            description: "Ein mächtiger Stab, der die Kraft der Elemente kontrolliert.",
            icon: "🪄",
            strength: 5,
            magic: 12,
            price: 150,
            rarity: 4
        },
        venom_fangs: {
            name: "Giftfänge",
            type: "weapon",
            description: "Dolche, die mit tödlichem Gift getränkt sind.",
            icon: "🗡️",
            strength: 9,
            speed: 5,
            price: 150,
            rarity: 4
        }
    },

    // Rüstungen
    armors: {
        // Anfängerrüstungen
        leather_armor: {
            name: "Lederrüstung",
            type: "armor",
            description: "Eine einfache Rüstung aus gehärtetem Leder.",
            icon: "🛡️",
            defense: 2,
            price: 15,
            rarity: 1
        },
        cloth_robe: {
            name: "Stoffrobe",
            type: "armor",
            description: "Eine leichte Robe, die Bewegungsfreiheit bietet.",
            icon: "👘",
            defense: 1,
            magic: 1,
            price: 15,
            rarity: 1
        },

        // Bessere Rüstungen
        chainmail: {
            name: "Kettenhemd",
            type: "armor",
            description: "Ein Kettenhemd, das guten Schutz bietet.",
            icon: "🛡️",
            defense: 4,
            speed: -1,
            price: 35,
            rarity: 2
        },
        enchanted_robe: {
            name: "Verzauberte Robe",
            type: "armor",
            description: "Eine Robe, die mit magischen Runen bestickt ist.",
            icon: "👘",
            defense: 2,
            magic: 3,
            price: 35,
            rarity: 2
        },

        // Seltene Rüstungen
        plate_armor: {
            name: "Plattenrüstung",
            type: "armor",
            description: "Eine schwere Rüstung aus massiven Metallplatten.",
            icon: "🛡️",
            defense: 7,
            speed: -2,
            price: 80,
            rarity: 3
        },
        archmage_robe: {
            name: "Erzmagierrobe",
            type: "armor",
            description: "Die Robe eines mächtigen Erzmagiers.",
            icon: "👘",
            defense: 4,
            magic: 6,
            price: 80,
            rarity: 3
        },

        // Epische Rüstungen
        dragon_scale_armor: {
            name: "Drachenschuppenrüstung",
            type: "armor",
            description: "Eine Rüstung aus den unzerstörbaren Schuppen eines Drachen.",
            icon: "🛡️",
            defense: 12,
            strength: 2,
            price: 200,
            rarity: 4
        },
        robe_of_arcana: {
            name: "Robe der Arkana",
            type: "armor",
            description: "Eine Robe, die mit der Essenz der Magie selbst durchtränkt ist.",
            icon: "👘",
            defense: 7,
            magic: 10,
            price: 200,
            rarity: 4
        }
    },

    // Helme
    helmets: {
        leather_cap: {
            name: "Lederkappe",
            type: "helmet",
            description: "Eine einfache Kappe aus gehärtetem Leder.",
            icon: "🪖",
            defense: 1,
            price: 8,
            rarity: 1
        },
        iron_helmet: {
            name: "Eisenhelm",
            type: "helmet",
            description: "Ein solider Helm aus Eisen.",
            icon: "🪖",
            defense: 3,
            price: 20,
            rarity: 2
        },
        mage_hood: {
            name: "Magierkapuze",
            type: "helmet",
            description: "Eine Kapuze, die die magische Konzentration verbessert.",
            icon: "🧢",
            defense: 1,
            magic: 2,
            price: 20,
            rarity: 2
        }
    },

    // Handschuhe
    gloves: {
        leather_gloves: {
            name: "Lederhandschuhe",
            type: "gloves",
            description: "Einfache Handschuhe aus weichem Leder.",
            icon: "🧤",
            defense: 1,
            price: 5,
            rarity: 1
        },
        iron_gauntlets: {
            name: "Eisenhandschuhe",
            type: "gloves",
            description: "Schwere Handschuhe aus Eisen.",
            icon: "🧤",
            defense: 2,
            strength: 1,
            price: 15,
            rarity: 2
        },
        spellweavers: {
            name: "Zauberwirker",
            type: "gloves",
            description: "Handschuhe, die das Wirken von Zaubern erleichtern.",
            icon: "🧤",
            defense: 1,
            magic: 2,
            price: 15,
            rarity: 2
        }
    },

    // Stiefel
    boots: {
        leather_boots: {
            name: "Lederstiefel",
            type: "boots",
            description: "Einfache Stiefel aus weichem Leder.",
            icon: "👢",
            defense: 1,
            price: 5,
            rarity: 1
        },
        iron_boots: {
            name: "Eisenstiefel",
            type: "boots",
            description: "Schwere Stiefel aus Eisen.",
            icon: "👢",
            defense: 2,
            speed: -1,
            price: 15,
            rarity: 2
        },
        swift_boots: {
            name: "Flinke Stiefel",
            type: "boots",
            description: "Leichte Stiefel, die die Beweglichkeit erhöhen.",
            icon: "👢",
            defense: 1,
            speed: 2,
            price: 15,
            rarity: 2
        }
    },

    // Accessoires
    accessories: {
        lucky_charm: {
            name: "Glücksbringer",
            type: "accessory",
            description: "Ein kleiner Anhänger, der Glück bringen soll.",
            icon: "🍀",
            speed: 1,
            price: 10,
            rarity: 1
        },
        strength_amulet: {
            name: "Amulett der Stärke",
            type: "accessory",
            description: "Ein Amulett, das die körperliche Stärke erhöht.",
            icon: "📿",
            strength: 2,
            price: 25,
            rarity: 2
        },
        magic_ring: {
            name: "Magischer Ring",
            type: "accessory",
            description: "Ein Ring, der die magische Kraft verstärkt.",
            icon: "💍",
            magic: 2,
            price: 25,
            rarity: 2
        },
        health_pendant: {
            name: "Gesundheitsanhänger",
            type: "accessory",
            description: "Ein Anhänger, der die Lebenskraft stärkt.",
            icon: "📿",
            maxHp: 10,
            price: 25,
            rarity: 2
        }
    },

    // Verbrauchsgegenstände
    consumables: {
        health_potion_small: {
            name: "Kleiner Heiltrank",
            type: "consumable",
            description: "Ein kleiner Trank, der einige Lebenspunkte wiederherstellt.",
            icon: "🧪",
            effect: "restoreHp",
            value: 20,
            price: 10,
            rarity: 1,
            stackable: true
        },
        health_potion_medium: {
            name: "Mittlerer Heiltrank",
            type: "consumable",
            description: "Ein Trank, der eine moderate Menge an Lebenspunkten wiederherstellt.",
            icon: "🧪",
            effect: "restoreHp",
            value: 50,
            price: 25,
            rarity: 2,
            stackable: true
        },
        health_potion_large: {
            name: "Großer Heiltrank",
            type: "consumable",
            description: "Ein starker Trank, der viele Lebenspunkte wiederherstellt.",
            icon: "🧪",
            effect: "restoreHp",
            value: 100,
            price: 50,
            rarity: 3,
            stackable: true
        },
        mana_potion_small: {
            name: "Kleiner Manatrank",
            type: "consumable",
            description: "Ein kleiner Trank, der etwas Mana wiederherstellt.",
            icon: "🧪",
            effect: "restoreMana",
            value: 10,
            price: 10,
            rarity: 1,
            stackable: true
        },
        mana_potion_medium: {
            name: "Mittlerer Manatrank",
            type: "consumable",
            description: "Ein Trank, der eine moderate Menge an Mana wiederherstellt.",
            icon: "🧪",
            effect: "restoreMana",
            value: 25,
            price: 25,
            rarity: 2,
            stackable: true
        },
        mana_potion_large: {
            name: "Großer Manatrank",
            type: "consumable",
            description: "Ein starker Trank, der viel Mana wiederherstellt.",
            icon: "🧪",
            effect: "restoreMana",
            value: 50,
            price: 50,
            rarity: 3,
            stackable: true
        },
        strength_elixir: {
            name: "Stärkeelixier",
            type: "consumable",
            description: "Ein Elixier, das vorübergehend die Stärke erhöht.",
            icon: "🧪",
            effect: "buff",
            buffName: "Erhöhte Stärke",
            buffDuration: 20, // 5 Minuten (20 Runden)
            buffEffect: "strengthBoost",
            buffValue: 3,
            price: 30,
            rarity: 2,
            stackable: true
        },
        defense_elixir: {
            name: "Verteidigungselixier",
            type: "consumable",
            description: "Ein Elixier, das vorübergehend die Verteidigung erhöht.",
            icon: "🧪",
            effect: "buff",
            buffName: "Erhöhte Verteidigung",
            buffDuration: 20, // 5 Minuten (20 Runden)
            buffEffect: "defenseBoost",
            buffValue: 3,
            price: 30,
            rarity: 2,
            stackable: true
        },
        speed_elixir: {
            name: "Geschwindigkeitselixier",
            type: "consumable",
            description: "Ein Elixier, das vorübergehend die Geschwindigkeit erhöht.",
            icon: "🧪",
            effect: "buff",
            buffName: "Erhöhte Geschwindigkeit",
            buffDuration: 20, // 5 Minuten (20 Runden)
            buffEffect: "speedBoost",
            buffValue: 3,
            price: 30,
            rarity: 2,
            stackable: true
        },
        magic_elixir: {
            name: "Magieelixier",
            type: "consumable",
            description: "Ein Elixier, das vorübergehend die magische Kraft erhöht.",
            icon: "🧪",
            effect: "buff",
            buffName: "Erhöhte Magie",
            buffDuration: 20, // 5 Minuten (20 Runden)
            buffEffect: "magicBoost",
            buffValue: 3,
            price: 30,
            rarity: 2,
            stackable: true
        },
        antidote: {
            name: "Gegengift",
            type: "consumable",
            description: "Heilt Vergiftungen und andere Statuseffekte.",
            icon: "🧪",
            effect: "cureStatus",
            price: 15,
            rarity: 1,
            stackable: true
        },
        dwarven_ale: {
            name: "Zwergenmet",
            type: "consumable",
            description: "Ein starkes Getränk, das von Zwergen gebraut wird. Heilt 30 HP.",
            icon: "🍺",
            effect: "restoreHp",
            value: 30,
            price: 20,
            rarity: 2,
            stackable: true
        },
        rare_dwarven_ale: {
            name: "Seltener Zwergenmet",
            type: "consumable",
            description: "Ein besonders starker Zwergenmet. Heilt 50 HP.",
            icon: "🍺",
            effect: "restoreHp",
            value: 50,
            price: 40,
            rarity: 3,
            stackable: true
        }
    },

    // Materialien
    materials: {
        iron_ore: {
            name: "Eisenerz",
            type: "material",
            description: "Ein Stück Eisenerz, das zum Schmieden verwendet werden kann.",
            icon: "🪨",
            price: 5,
            rarity: 1,
            stackable: true
        },
        leather: {
            name: "Leder",
            type: "material",
            description: "Ein Stück gegerbtes Leder.",
            icon: "🧶",
            price: 3,
            rarity: 1,
            stackable: true
        },
        wood: {
            name: "Holz",
            type: "material",
            description: "Ein Stück Holz, das für verschiedene Zwecke verwendet werden kann.",
            icon: "🪵",
            price: 2,
            rarity: 1,
            stackable: true
        },
        herb: {
            name: "Heilkraut",
            type: "material",
            description: "Eine Pflanze mit heilenden Eigenschaften.",
            icon: "🌿",
            price: 3,
            rarity: 1,
            stackable: true
        },
        crystal: {
            name: "Magischer Kristall",
            type: "material",
            description: "Ein Kristall, der magische Energie speichert.",
            icon: "💎",
            price: 10,
            rarity: 2,
            stackable: true
        }
    },

    // Questgegenstände
    questItems: {
        ancient_key: {
            name: "Alter Schlüssel",
            type: "quest",
            description: "Ein alter, rostiger Schlüssel. Wofür er wohl ist?",
            icon: "🔑",
            rarity: 2
        },
        mysterious_scroll: {
            name: "Mysteriöse Schriftrolle",
            type: "quest",
            description: "Eine Schriftrolle mit seltsamen Symbolen.",
            icon: "📜",
            rarity: 2
        },
        dragon_scale: {
            name: "Drachenschuppe",
            type: "quest",
            description: "Eine glänzende Schuppe eines Drachen.",
            icon: "🔶",
            rarity: 3
        }
    },

    /**
     * Gibt einen Gegenstand anhand seines Schlüssels zurück
     * @param {string} key - Schlüssel des Gegenstands
     * @returns {Object|null} Der Gegenstand oder null, wenn nicht gefunden
     */
    getItem: function(key) {
        // Alle Kategorien durchsuchen
        const categories = [
            this.weapons,
            this.armors,
            this.helmets,
            this.gloves,
            this.boots,
            this.accessories,
            this.consumables,
            this.materials,
            this.questItems
        ];

        for (const category of categories) {
            if (category[key]) {
                return category[key];
            }
        }

        return null;
    },

    /**
     * Erstellt ein Item-Objekt aus einem Schlüssel
     * @param {string} key - Schlüssel des Gegenstands
     * @returns {Item|null} Das Item-Objekt oder null, wenn nicht gefunden
     */
    createItem: function(key) {
        const itemData = this.getItem(key);
        if (!itemData) {
            console.error(`Item mit Schlüssel '${key}' nicht gefunden!`);
            return null;
        }

        // Sicherstellen, dass alle erforderlichen Eigenschaften vorhanden sind
        const properties = { ...itemData };

        // Sicherstellen, dass Verbrauchsgegenstände korrekt initialisiert werden
        if (itemData.type === 'consumable') {
            if (!properties.effect) {
                console.warn(`Verbrauchsgegenstand ${itemData.name} hat keinen Effekt!`);
            }
            if (properties.effect === 'restoreHp' && !properties.value) {
                console.warn(`Heiltrank ${itemData.name} hat keinen Wert!`);
                properties.value = 20; // Standardwert
            }
            if (properties.effect === 'restoreMana' && !properties.value) {
                console.warn(`Manatrank ${itemData.name} hat keinen Wert!`);
                properties.value = 10; // Standardwert
            }
        }

        return new Item(itemData.name, itemData.type, properties);
    },

    /**
     * Gibt eine Liste aller Gegenstände einer bestimmten Kategorie zurück
     * @param {string} category - Name der Kategorie (weapons, armors, etc.)
     * @returns {Array} Array mit Gegenständen
     */
    getItemsByCategory: function(category) {
        if (!this[category]) return [];

        const items = [];
        for (const key in this[category]) {
            items.push(this.createItem(key));
        }

        return items;
    },

    /**
     * Gibt eine Liste aller Gegenstände zurück, die bestimmte Kriterien erfüllen
     * @param {Object} criteria - Kriterien für die Filterung
     * @returns {Array} Array mit Gegenständen
     */
    getItemsByCriteria: function(criteria) {
        const items = [];

        // Alle Kategorien durchsuchen
        const categories = [
            this.weapons,
            this.armors,
            this.helmets,
            this.gloves,
            this.boots,
            this.accessories,
            this.consumables,
            this.materials,
            this.questItems
        ];

        for (const category of categories) {
            for (const key in category) {
                const itemData = category[key];
                let matches = true;

                // Alle Kriterien prüfen
                for (const criteriaKey in criteria) {
                    if (itemData[criteriaKey] !== criteria[criteriaKey]) {
                        matches = false;
                        break;
                    }
                }

                if (matches) {
                    items.push(this.createItem(key));
                }
            }
        }

        return items;
    }
};
