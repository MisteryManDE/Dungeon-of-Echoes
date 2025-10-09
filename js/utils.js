/**
 * Utils-Modul für Dungeon of Echoes
 * Enthält Hilfsfunktionen für das Spiel
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
     * @param {Array} array - Das Array
     * @returns {*} Ein zufälliges Element
     */
    randomChoice: function(array) {
        if (!array || array.length === 0) return null;
        return array[Math.floor(Math.random() * array.length)];
    },
    
    /**
     * Formatiert eine Zahl mit Tausendertrennzeichen
     * @param {number} number - Die zu formatierende Zahl
     * @returns {string} Formatierte Zahl
     */
    formatNumber: function(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
     * Berechnet die Chance auf einen kritischen Treffer
     * @param {number} luck - Glückswert
     * @returns {number} Chance auf kritischen Treffer (0-1)
     */
    calculateCriticalChance: function(luck) {
        // Basiswahrscheinlichkeit + Bonus durch Glück
        return Config.combat.baseCriticalChance + (luck * Config.combat.luckCriticalMultiplier);
    },
    
    /**
     * Berechnet die Chance auf Ausweichen
     * @param {number} speed - Geschwindigkeitswert
     * @returns {number} Chance auf Ausweichen (0-1)
     */
    calculateDodgeChance: function(speed) {
        // Basiswahrscheinlichkeit + Bonus durch Geschwindigkeit
        return Config.combat.baseDodgeChance + (speed * Config.combat.speedDodgeMultiplier);
    },
    
    /**
     * Berechnet die Chance auf Flucht
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
     * Berechnet den Kaufpreis eines Gegenstands
     * @param {number} basePrice - Basispreis des Gegenstands
     * @param {number} charisma - Charismawert des Spielers
     * @returns {number} Berechneter Kaufpreis
     */
    calculateBuyPrice: function(basePrice, charisma) {
        // Charisma reduziert den Preis
        const discount = charisma * Config.economy.charismaBuyDiscount;
        const price = Math.round(basePrice * (1 - discount));
        
        return Math.max(1, price);
    },
    
    /**
     * Berechnet den Verkaufspreis eines Gegenstands
     * @param {number} basePrice - Basispreis des Gegenstands
     * @param {number} charisma - Charismawert des Spielers
     * @returns {number} Berechneter Verkaufspreis
     */
    calculateSellPrice: function(basePrice, charisma) {
        // Basisverkaufspreis
        let price = Math.round(basePrice * Config.economy.baseSellMultiplier);
        
        // Charisma erhöht den Verkaufspreis
        const bonus = charisma * Config.economy.charismaSellBonus;
        price = Math.round(price * (1 + bonus));
        
        return Math.max(1, price);
    },
    
    /**
     * Erstellt einen Tooltip für einen Gegenstand
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
     * Erstellt einen Tooltip für eine Fähigkeit
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
    },
    
    /**
     * Speichert Daten im LocalStorage
     * @param {string} key - Schlüssel
     * @param {*} data - Zu speichernde Daten
     */
    saveToLocalStorage: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Fehler beim Speichern im LocalStorage:', error);
            return false;
        }
    },
    
    /**
     * Lädt Daten aus dem LocalStorage
     * @param {string} key - Schlüssel
     * @returns {*} Geladene Daten oder null bei Fehler
     */
    loadFromLocalStorage: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Fehler beim Laden aus dem LocalStorage:', error);
            return null;
        }
    }
};
