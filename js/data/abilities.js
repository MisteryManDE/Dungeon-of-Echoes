/**
 * Abilities-Datenmodul für Dungeon of Echoes
 * Enthält Definitionen für alle Fähigkeiten im Spiel
 * Version: 2.0.2
 */

const AbilityData = {
    // Krieger-Fähigkeiten
    warrior: {
        slash: {
            name: "Schlitzer",
            description: "Ein schneller Schwerthieb, der moderaten Schaden verursacht.",
            icon: "⚔️",
            damage: 8,
            manaCost: 0,
            cooldown: 0,
            type: "physical",
            level: 1
        },

        heavy_strike: {
            name: "Schwerer Schlag",
            description: "Ein mächtiger Schlag, der hohen Schaden verursacht.",
            icon: "🔨",
            damage: 15,
            manaCost: 5,
            cooldown: 3,
            type: "physical",
            level: 3
        },

        shield_bash: {
            name: "Schildschlag",
            description: "Ein Schlag mit dem Schild, der den Gegner betäubt.",
            icon: "🛡️",
            damage: 5,
            manaCost: 8,
            cooldown: 4,
            type: "physical",
            effect: {
                name: "Betäubt",
                duration: 1,
                effect: "stun",
                value: 1
            },
            level: 5
        },

        battle_cry: {
            name: "Kampfschrei",
            description: "Ein lauter Schrei, der deine Stärke erhöht.",
            icon: "📢",
            damage: 0,
            manaCost: 10,
            cooldown: 5,
            type: "buff",
            effect: {
                name: "Kampfrausch",
                duration: 3,
                effect: "strengthBoost",
                value: 5
            },
            level: 7
        },

        whirlwind: {
            name: "Wirbelwind",
            description: "Ein Wirbelangriff, der alle Gegner trifft.",
            icon: "🌪️",
            damage: 12,
            manaCost: 15,
            cooldown: 6,
            type: "physical",
            aoe: true,
            level: 10
        }
    },

    // Schurken-Fähigkeiten
    rogue: {
        backstab: {
            name: "Meucheln",
            description: "Ein hinterhältiger Angriff, der hohen Schaden verursacht.",
            icon: "🗡️",
            damage: 12,
            manaCost: 5, // Von 0 auf 5 erhöht
            cooldown: 2,
            type: "physical",
            level: 1
        },

        poison_strike: {
            name: "Giftschlag",
            description: "Ein vergifteter Angriff, der über Zeit Schaden verursacht.",
            icon: "☠️",
            damage: 5,
            manaCost: 8,
            cooldown: 4,
            type: "poison",
            effect: {
                name: "Gift",
                duration: 3,
                effect: "poison",
                value: 3
            },
            level: 3
        },

        shadow_step: {
            name: "Schattenschritt",
            description: "Teleportiere dich hinter den Gegner und erhöhe deine Ausweichrate.",
            icon: "👤",
            damage: 0,
            manaCost: 10,
            cooldown: 5,
            type: "buff",
            effect: {
                name: "Schattenhaft",
                duration: 2,
                effect: "dodgeBoost",
                value: 0.2
            },
            level: 5
        },

        fan_of_knives: {
            name: "Messerfächer",
            description: "Wirf mehrere Messer, die alle Gegner treffen.",
            icon: "🔪",
            damage: 8,
            manaCost: 12,
            cooldown: 6,
            type: "physical",
            aoe: true,
            level: 7
        },

        assassination: {
            name: "Meistermeuchler",
            description: "Ein tödlicher Angriff mit hoher Chance auf kritischen Treffer.",
            icon: "💀",
            damage: 20,
            manaCost: 15,
            cooldown: 8,
            type: "physical",
            critBoost: 0.5,
            level: 10
        }
    },

    // Magier-Fähigkeiten
    mage: {
        magic_missile: {
            name: "Magisches Geschoss",
            description: "Ein einfacher magischer Angriff.",
            icon: "✨",
            damage: 10,
            manaCost: 5,
            cooldown: 0,
            type: "magic",
            level: 1
        },

        fireball: {
            name: "Feuerball",
            description: "Ein Feuerball, der Schaden verursacht und den Gegner verbrennt.",
            icon: "🔥",
            damage: 15,
            manaCost: 10,
            cooldown: 3,
            type: "fire",
            effect: {
                name: "Brennend",
                duration: 2,
                effect: "fire",
                value: 3
            },
            level: 3
        },

        ice_spike: {
            name: "Eisstachel",
            description: "Ein Eisstachel, der Schaden verursacht und den Gegner verlangsamt.",
            icon: "❄️",
            damage: 12,
            manaCost: 8,
            cooldown: 4,
            type: "ice",
            effect: {
                name: "Verlangsamt",
                duration: 2,
                effect: "speedReduction",
                value: 2
            },
            level: 5
        },

        arcane_shield: {
            name: "Arkaner Schild",
            description: "Ein magischer Schild, der deine Verteidigung erhöht.",
            icon: "🛡️",
            damage: 0,
            manaCost: 12,
            cooldown: 5,
            type: "buff",
            effect: {
                name: "Arkaner Schild",
                duration: 3,
                effect: "defenseBoost",
                value: 5
            },
            level: 7
        },

        meteor_strike: {
            name: "Meteoritenschlag",
            description: "Rufe einen Meteoriten herbei, der alle Gegner trifft.",
            icon: "☄️",
            damage: 25,
            manaCost: 20,
            cooldown: 8,
            type: "fire",
            aoe: true,
            level: 10
        }
    },

    /**
     * Gibt eine Fähigkeit anhand ihres Schlüssels zurück
     * @param {string} className - Name der Klasse
     * @param {string} abilityKey - Schlüssel der Fähigkeit
     * @returns {Object|null} Die Fähigkeit oder null, wenn nicht gefunden
     */
    getAbility: function(className, abilityKey) {
        if (!this[className] || !this[className][abilityKey]) return null;

        return this[className][abilityKey];
    },

    /**
     * Gibt alle Fähigkeiten einer Klasse zurück
     * @param {string} className - Name der Klasse
     * @returns {Array} Array mit Fähigkeiten
     */
    getAbilitiesByClass: function(className) {
        if (!this[className]) return [];

        const abilities = [];
        for (const key in this[className]) {
            const ability = this[className][key];
            abilities.push({
                key: key,
                ...ability
            });
        }

        return abilities;
    },

    /**
     * Gibt alle Fähigkeiten einer Klasse zurück, die für ein bestimmtes Level verfügbar sind
     * @param {string} className - Name der Klasse
     * @param {number} level - Level des Spielers
     * @returns {Array} Array mit Fähigkeiten
     */
    getAbilitiesByLevel: function(className, level) {
        if (!this[className]) return [];

        const abilities = [];
        for (const key in this[className]) {
            const ability = this[className][key];
            if (ability.level <= level) {
                abilities.push({
                    key: key,
                    ...ability
                });
            }
        }

        return abilities;
    },

    /**
     * Berechnet den Schaden einer Fähigkeit basierend auf den Attributen des Spielers
     * @param {Object} ability - Die Fähigkeit
     * @param {Player} player - Der Spieler
     * @returns {number} Der berechnete Schaden
     */
    calculateDamage: function(ability, player) {
        if (!ability || !player) return 0;

        let baseDamage = ability.damage || 0;

        // Schadenstyp berücksichtigen
        switch (ability.type) {
            case "physical":
                baseDamage += player.strength * 0.5;
                break;

            case "magic":
            case "fire":
            case "ice":
            case "poison":
                baseDamage += player.magic * 0.5;
                break;
        }

        // Kritischer Treffer
        const critChance = Utils.calculateCriticalChance(player.luck || 0);
        if (Math.random() < critChance + (ability.critBoost || 0)) {
            baseDamage *= Config.combat.criticalHitMultiplier;
        }

        return Math.round(baseDamage);
    }
};
