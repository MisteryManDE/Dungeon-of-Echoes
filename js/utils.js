

/**
 * Hilfsfunktionen für Dungeon of Echoes
 * Enthält allgemeine Utility-Funktionen
 * Version: 2.0.2
 */

const Utils = {
    /**
     * Generiert eine zufällige ganze Zahl zwischen min und max (inklusive)
     * @param {number} min - Minimaler Wert
     * @param {number} max - Maximaler Wert
     * @returns {number} Zufällige ganze Zahl
     */
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * Wählt ein zufälliges Element aus einem Array aus
     * @param {Array} array - Das Array, aus dem ausgewählt werden soll
     * @returns {*} Ein zufälliges Element aus dem Array
     */
    randomChoice: function(array) {
        if (!array || array.length === 0) return null;
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Wählt ein zufälliges Element aus einem Array basierend auf Gewichtungen aus
     * @param {Array} array - Das Array, aus dem ausgewählt werden soll
     * @param {Array} weights - Array mit Gewichtungen für jedes Element
     * @returns {*} Ein zufälliges Element aus dem Array
     */
    weightedRandomChoice: function(array, weights) {
        // Summe aller Gewichte berechnen
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        
        // Zufällige Zahl zwischen 0 und der Summe der Gewichte
        let random = Math.random() * totalWeight;
        
        // Element basierend auf Gewichtung auswählen
        for (let i = 0; i < array.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return array[i];
            }
        }
        
        // Fallback, falls etwas schief geht
        return array[array.length - 1];
    },
    
    /**
     * Mischt ein Array mit dem Fisher-Yates-Algorithmus
     * @param {Array} array - Das zu mischende Array
     * @returns {Array} Das gemischte Array
     */
    shuffleArray: function(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    },
    
    /**
     * Formatiert eine Zahl mit Tausendertrennzeichen
     * @param {number} number - Die zu formatierende Zahl
     * @returns {string} Die formatierte Zahl als String
     */
    formatNumber: function(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    
    /**
     * Kürzt einen Text auf eine bestimmte Länge und fügt ggf. Auslassungspunkte hinzu
     * @param {string} text - Der zu kürzende Text
     * @param {number} maxLength - Die maximale Länge
     * @returns {string} Der gekürzte Text
     */
    truncateText: function(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    },
    
    /**
     * Generiert eine eindeutige ID
     * @returns {string} Eine eindeutige ID
     */
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    },
    
    /**
     * Berechnet den Schaden basierend auf Angriff und Verteidigung
     * @param {number} attack - Angriffswert
     * @param {number} defense - Verteidigungswert
     * @returns {number} Berechneter Schaden
     */
    calculateDamage: function(attack, defense) {
        // Basisschaden
        let damage = attack;
        
        // Verteidigung reduziert den Schaden
        const reduction = defense * Config.combat.defenseMultiplier;
        damage = Math.max(1, damage - reduction);
        
        // Zufälliger Faktor (±20%)
        const randomFactor = 0.8 + (Math.random() * 0.4);
        damage = Math.round(damage * randomFactor);
        
        return Math.max(1, damage);
    },
    
    /**
     * Berechnet die erhaltene Erfahrung
     * @param {number} enemyLevel - Level des Gegners
     * @param {number} playerLevel - Level des Spielers
     * @returns {number} Erhaltene Erfahrung
     */
    calculateExperience: function(enemyLevel, playerLevel) {
        // Basiswert
        let xp = enemyLevel * Config.combat.baseXpMultiplier;
        
        // Levelunterschied berücksichtigen
        const levelDifference = enemyLevel - playerLevel;
        
        if (levelDifference > 0) {
            // Bonus für stärkere Gegner
            xp *= (1 + (levelDifference * Config.combat.levelXpBonus));
        } else if (levelDifference < 0) {
            // Malus für schwächere Gegner
            xp *= Math.max(0.1, 1 + (levelDifference * Config.combat.levelXpPenalty));
        }
        
        return Math.max(1, Math.round(xp));
    },
    
    /**
     * Berechnet die erhaltene Goldmenge
     * @param {number} enemyLevel - Level des Gegners
     * @returns {number} Erhaltene Goldmenge
     */
    calculateGoldReward: function(enemyLevel) {
        // Basiswert + zufälliger Bonus
        const baseGold = enemyLevel * Config.combat.baseGoldMultiplier;
        const randomBonus = this.randomInt(0, enemyLevel * 2);
        
        return baseGold + randomBonus;
    },

    /**
     * Berechnet die Wahrscheinlichkeit für einen Gegenstandsdrop
     * @param {number} baseChance - Basiswahrscheinlichkeit (0-1)
     * @param {number} itemRarity - Seltenheit des Gegenstands (1-5)
     * @param {number} luckFactor - Glücksfaktor des Spielers (0-1, Standard: 1)
     * @returns {number} Die berechnete Wahrscheinlichkeit
     */
    calculateDropChance: function(baseChance, itemRarity, luckFactor = 1) {
        // Seltenheit beeinflusst die Chance (seltenere Items haben geringere Chance)
        const rarityFactor = 1 - ((itemRarity - 1) * 0.15);
        
        // Glücksfaktor anwenden
        return Math.min(0.95, baseChance * rarityFactor * luckFactor);
    },
    
    /**
     * Berechnet die Heilungsmenge basierend auf Maximal-HP und Heilungsfaktor
     * @param {number} maxHp - Maximale Lebenspunkte
     * @param {number} healFactor - Heilungsfaktor (0-1)
     * @returns {number} Heilungsmenge
     */
    calculateHealing: function(maxHp, healFactor) {
        return Math.round(maxHp * healFactor);
    },

    /**
     * Berechnet den Verkaufspreis eines Gegenstands
     * @param {number} basePrice - Basispreis des Gegenstands
     * @param {number} charisma - Charismawert des Spielers
     * @returns {number} Berechneter Verkaufspreis
     */
    calculateSellPrice: function(basePrice, charisma = 0) {
        // Basisverkaufspreis
        let price = Math.round(basePrice * Config.economy.baseSellMultiplier);
        
        // Charisma erhöht den Verkaufspreis
        const bonus = charisma * Config.economy.charismaSellBonus;
        price = Math.round(price * (1 + bonus));
        
        return Math.max(1, price);
    },
    
    /**
     * Berechnet den Kaufpreis eines Gegenstands
     * @param {number} basePrice - Basispreis des Gegenstands
     * @param {number} charisma - Charismawert des Spielers
     * @returns {number} Berechneter Kaufpreis
     */
    calculateBuyPrice: function(basePrice, charisma = 0) {
        // Charisma reduziert den Preis
        const discount = charisma * Config.economy.charismaBuyDiscount;
        const price = Math.round(basePrice * (1 - discount));
        
        return Math.max(1, price);
    },

    /**
     * Berechnet die Fluchtchance basierend auf Spielergeschwindigkeit und Gegnerlevel
     * @param {number} speed - Geschwindigkeitswert des Spielers
     * @param {number} enemyLevel - Level des Gegners
     * @returns {number} Chance auf Flucht (0-1)
     */
    calculateEscapeChance: function(speed, enemyLevel) {
        // Basiswahrscheinlichkeit + Bonus durch Geschwindigkeit - Malus durch Gegnerlevel
        return Config.combat.baseEscapeChance + 
               (speed * Config.combat.speedEscapeMultiplier) - 
               (enemyLevel * Config.combat.levelEscapeMultiplier);
    },

    /**
     * Berechnet die Ausweichwahrscheinlichkeit
     * @param {number} speed - Geschwindigkeitswert
     * @param {Player} player - Das Spielerobjekt für Talent-Boni
     * @returns {number} Chance auf Ausweichen (0-1)
     */
    calculateDodgeChance: function(speed, player) {
        let dodgeChance = Config.combat.baseDodgeChance + (speed * Config.combat.speedDodgeMultiplier);

        // Talent-Effekte
        if (player && player.passiveEffects) {
            player.passiveEffects.forEach(effect => {
                if (effect.description && effect.description.includes('Ausweichchance')) {
                    const bonus = parseFloat(effect.description.match(/[\d.]+/)) / 100;
                    if (!isNaN(bonus)) {
                        dodgeChance += bonus;
                    }
                }
            });
        }
        return Math.min(0.75, dodgeChance);
    },

    /**
     * Berechnet die kritische Trefferwahrscheinlichkeit
     * @param {number} luck - Glückswert
     * @param {Player} player - Das Spielerobjekt für Talent-Boni
     * @returns {number} Chance auf kritischen Treffer (0-1)
     */
    calculateCriticalChance: function(luck, player) {
        let critChance = Config.combat.baseCriticalChance + (luck * Config.combat.luckCriticalMultiplier);

        // Talent-Effekte
        if (player && player.passiveEffects) {
            player.passiveEffects.forEach(effect => {
                if (effect.description && effect.description.includes('kritische Trefferchance')) {
                    const bonus = parseFloat(effect.description.match(/[\d.]+/)) / 100;
                    if (!isNaN(bonus)) {
                        critChance += bonus;
                    }
                }
            });
        }
        return Math.min(0.75, critChance);
    },

    /**
     * Speichert ein Objekt im LocalStorage
     * @param {string} key - Schlüssel für den LocalStorage
     * @param {Object} data - Zu speicherndes Objekt
     */
    saveToLocalStorage: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error("Fehler beim Speichern im LocalStorage:", error);
            return false;
        }
    },
    
    /**
     * Lädt ein Objekt aus dem LocalStorage
     * @param {string} key - Schlüssel für den LocalStorage
     * @returns {Object|null} Das geladene Objekt oder null bei Fehler
     */
    loadFromLocalStorage: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error("Fehler beim Laden aus dem LocalStorage:", error);
            return null;
        }
    },
    
    /**
     * Formatiert einen Zeitstempel als lesbares Datum und Uhrzeit
     * @param {number} timestamp - Zeitstempel in Millisekunden
     * @returns {string} Formatiertes Datum und Uhrzeit
     */
    formatTimestamp: function(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Formatiert eine Dauer in Runden als Text
     * @param {number} rounds - Anzahl der Runden
     * @returns {string} Formatierte Dauer
     */
    formatDuration: function(rounds) {
        // 4 Runden = 1 Minute (im Spiel)
        const minutes = Math.floor(rounds / 4);
        const remainingRounds = rounds % 4;
        
        if (minutes === 0) {
            return `${rounds} Runden`;
        } else if (remainingRounds === 0) {
            return `${minutes} Minuten`;
        } else {
            return `${minutes} Minuten, ${remainingRounds} Runden`;
        }
    },

    /**
     * Erstellt einen HTML-Tooltip für einen Gegenstand
     * @param {Item} item - Der Gegenstand
     * @returns {string} HTML-Code für den Tooltip
     */
    createItemTooltip: function(item) {
        if (!item) return '';
        
        // Titel mit Seltenheit
        let html = `<div class="tooltip-title" style="color: ${item.getRarityColor()}">${item.name}</div>`;
        html += `<div class="tooltip-subtitle">${item.getRarityText()} ${this.formatItemType(item.type)}</div>`;
        
        // Beschreibung
        if (item.description) {
            html += `<div class="tooltip-description">${item.description}</div>`;
        }
        
        // Attribute
        html += '<div class="tooltip-stats">';
        
        if (item.type === 'weapon') {
            html += `<div>Stärke: +${item.strength}</div>`;
            if (item.magic > 0) html += `<div>Magie: +${item.magic}</div>`;
            if (item.speed !== 0) html += `<div>Geschwindigkeit: ${item.speed > 0 ? '+' : ''}${item.speed}</div>`;
        } else if (item.type === 'armor' || item.type === 'helmet' || item.type === 'gloves' || item.type === 'boots') {
            html += `<div>Verteidigung: +${item.defense}</div>`;
            if (item.magic > 0) html += `<div>Magie: +${item.magic}</div>`;
            if (item.speed !== 0) html += `<div>Geschwindigkeit: ${item.speed > 0 ? '+' : ''}${item.speed}</div>`;
        } else if (item.type === 'accessory') {
            if (item.strength > 0) html += `<div>Stärke: +${item.strength}</div>`;
            if (item.defense > 0) html += `<div>Verteidigung: +${item.defense}</div>`;
            if (item.magic > 0) html += `<div>Magie: +${item.magic}</div>`;
            if (item.speed !== 0) html += `<div>Geschwindigkeit: ${item.speed > 0 ? '+' : ''}${item.speed}</div>`;
            if (item.maxHp > 0) html += `<div>Max. HP: +${item.maxHp}</div>`;
            if (item.maxMana > 0) html += `<div>Max. Mana: +${item.maxMana}</div>`;
        } else if (item.type === 'consumable') {
            if (item.effect === 'restoreHp') {
                html += `<div>Stellt ${item.value} Lebenspunkte wieder her</div>`;
            } else if (item.effect === 'restoreMana') {
                html += `<div>Stellt ${item.value} Mana wieder her</div>`;
            } else if (item.effect === 'buff') {
                html += `<div>Gewährt den Effekt "${item.buffName}" für ${this.formatDuration(item.buffDuration)}</div>`;
            }
        }
        
        html += '</div>';
        
        // Preis
        if (item.price > 0) {
            html += `<div class="tooltip-price">Wert: ${item.price} Gold</div>`;
        }
        
        return html;
    },
    
    /**
     * Erstellt einen HTML-Tooltip für eine Fähigkeit
     * @param {Object} ability - Die Fähigkeit
     * @returns {string} HTML-Code für den Tooltip
     */
    createAbilityTooltip: function(ability) {
        if (!ability) return '';
        
        // Titel
        let html = `<div class="tooltip-title">${ability.name}</div>`;
        
        // Beschreibung
        if (ability.description) {
            html += `<div class="tooltip-description">${ability.description}</div>`;
        }
        
        // Attribute
        html += '<div class="tooltip-stats">';
        
        if (ability.damage > 0) {
            html += `<div>Schaden: ${ability.damage}</div>`;
        }
        
        if (ability.manaCost > 0) {
            html += `<div>Manakosten: ${ability.manaCost}</div>`;
        }
        
        if (ability.cooldown > 0) {
            html += `<div>Abklingzeit: ${ability.cooldown} Runden</div>`;
        }
        
        // Typ
        let typeText;
        switch (ability.type) {
            case 'physical': typeText = 'Physisch'; break;
            case 'magic': typeText = 'Magisch'; break;
            case 'fire': typeText = 'Feuer'; break;
            case 'ice': typeText = 'Eis'; break;
            case 'poison': typeText = 'Gift'; break;
            case 'buff': typeText = 'Buff'; break;
            case 'debuff': typeText = 'Debuff'; break;
            default: typeText = ability.type;
        }
        
        html += `<div>Typ: ${typeText}</div>`;
        
        // Effekt
        if (ability.effect) {
            html += `<div>Effekt: ${ability.effect.name} (${this.formatDuration(ability.effect.duration)})</div>`;
        }
        
        // AoE
        if (ability.aoe) {
            html += `<div>Trifft alle Gegner</div>`;
        }
        
        html += '</div>';
        
        return html;
    },
    
    /**
     * Formatiert den Typ eines Gegenstands
     * @param {string} type - Typ des Gegenstands
     * @returns {string} Formatierter Typ
     */
    formatItemType: function(type) {
        switch (type) {
            case 'weapon': return 'Waffe';
            case 'armor': return 'Rüstung';
            case 'helmet': return 'Helm';
            case 'gloves': return 'Handschuhe';
            case 'boots': return 'Stiefel';
            case 'accessory': return 'Accessoire';
            case 'consumable': return 'Verbrauchsgegenstand';
            case 'material': return 'Material';
            case 'quest': return 'Questgegenstand';
            default: return type;
        }
    }
};