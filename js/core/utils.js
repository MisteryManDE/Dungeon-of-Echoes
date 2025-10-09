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
     * Berechnet die Chance für ein Ereignis basierend auf Spielerlevel und Basiswahrscheinlichkeit
     * @param {number} baseChance - Die Basiswahrscheinlichkeit (0-1)
     * @param {number} playerLevel - Das Spielerlevel
     * @param {number} scaleFactor - Skalierungsfaktor (optional, Standard: 0.01)
     * @returns {number} Die angepasste Wahrscheinlichkeit
     */
    calculateChance: function(baseChance, playerLevel, scaleFactor = 0.01) {
        // Erhöht die Chance leicht mit steigendem Spielerlevel
        return Math.min(0.95, baseChance + (playerLevel * scaleFactor));
    },
    
    /**
     * Generiert eine eindeutige ID
     * @returns {string} Eine eindeutige ID
     */
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    },
    
    /**
     * Berechnet den Schaden basierend auf Angriff, Verteidigung und Zufallsfaktor
     * @param {number} attack - Angriffswert
     * @param {number} defense - Verteidigungswert
     * @param {number} variance - Zufallsfaktor (0-1, Standard: 0.2)
     * @returns {number} Berechneter Schaden (mindestens 1)
     */
    calculateDamage: function(attack, defense, variance = 0.2) {
        // Basisschaden berechnen
        let baseDamage = Math.max(0, attack - (defense * 0.7));
        
        // Zufallsfaktor hinzufügen
        const randomFactor = 1 - variance + (Math.random() * variance * 2);
        const finalDamage = Math.round(baseDamage * randomFactor);
        
        // Mindestens 1 Schaden
        return Math.max(1, finalDamage);
    },
    
    /**
     * Berechnet die Erfahrungspunkte basierend auf Gegnerlevel und Spielerlevel
     * @param {number} enemyLevel - Level des Gegners
     * @param {number} playerLevel - Level des Spielers
     * @returns {number} Erfahrungspunkte
     */
    calculateExperience: function(enemyLevel, playerLevel) {
        // Basiswert
        let baseXP = enemyLevel * 10;
        
        // Anpassung basierend auf Levelunterschied
        const levelDifference = enemyLevel - playerLevel;
        
        if (levelDifference > 0) {
            // Bonus für stärkere Gegner
            baseXP *= (1 + (levelDifference * 0.1));
        } else if (levelDifference < -5) {
            // Reduzierung für viel schwächere Gegner
            baseXP *= Math.max(0.1, 0.5 + (levelDifference + 5) * 0.1);
        } else if (levelDifference < 0) {
            // Leichte Reduzierung für schwächere Gegner
            baseXP *= Math.max(0.5, 1 + (levelDifference * 0.05));
        }
        
        return Math.max(1, Math.round(baseXP));
    },
    
    /**
     * Berechnet die Goldbelohnung basierend auf Gegnerlevel und Glücksfaktor
     * @param {number} enemyLevel - Level des Gegners
     * @param {number} luckFactor - Glücksfaktor (0-1, Standard: 1)
     * @returns {number} Goldmenge
     */
    calculateGoldReward: function(enemyLevel, luckFactor = 1) {
        // Basiswert
        const baseGold = enemyLevel * 5;
        
        // Zufallsfaktor
        const randomFactor = 0.8 + (Math.random() * 0.4);
        
        // Glücksfaktor anwenden
        return Math.round(baseGold * randomFactor * luckFactor);
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
     * @param {number} charisma - Charisma-Wert des Spielers
     * @returns {number} Verkaufspreis
     */
    calculateSellPrice: function(basePrice, charisma = 0) {
        // Charisma erhöht den Verkaufspreis leicht
        const charismaMod = 1 + (charisma * 0.01);
        return Math.round(basePrice * 0.5 * charismaMod);
    },
    
    /**
     * Berechnet den Kaufpreis eines Gegenstands
     * @param {number} basePrice - Basispreis des Gegenstands
     * @param {number} charisma - Charisma-Wert des Spielers
     * @returns {number} Kaufpreis
     */
    calculateBuyPrice: function(basePrice, charisma = 0) {
        // Charisma senkt den Kaufpreis leicht
        const charismaMod = 1 - (charisma * 0.01);
        return Math.max(1, Math.round(basePrice * charismaMod));
    },
    
    /**
     * Berechnet die Fluchtchance basierend auf Spielergeschwindigkeit und Gegnerlevel
     * @param {number} playerSpeed - Geschwindigkeit des Spielers
     * @param {number} enemyLevel - Level des Gegners
     * @returns {number} Fluchtchance (0-1)
     */
    calculateEscapeChance: function(playerSpeed, enemyLevel) {
        // Basiswahrscheinlichkeit
        const baseChance = Config.combat.escapeBaseChance;
        
        // Geschwindigkeitsbonus
        const speedBonus = playerSpeed * 0.02;
        
        // Levelunterschied
        const levelDifference = enemyLevel - GameEngine.player.level;
        const levelPenalty = Math.max(0, levelDifference * 0.05);
        
        return Math.min(0.95, Math.max(0.05, baseChance + speedBonus - levelPenalty));
    },
    
    /**
     * Berechnet die Ausweichwahrscheinlichkeit
     * @param {number} speed - Geschwindigkeitswert
     * @returns {number} Ausweichwahrscheinlichkeit (0-1)
     */
    calculateDodgeChance: function(speed) {
        return Math.min(0.5, Config.combat.dodgeBaseChance + (speed * 0.01));
    },
    
    /**
     * Berechnet die kritische Trefferwahrscheinlichkeit
     * @param {number} luck - Glückswert
     * @returns {number} Kritische Trefferwahrscheinlichkeit (0-1)
     */
    calculateCriticalChance: function(luck) {
        return Math.min(0.5, Config.combat.criticalHitChance + (luck * 0.01));
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
     * Berechnet die verbleibende Zeit für einen Statuseffekt
     * @param {number} duration - Dauer in Runden
     * @returns {string} Formatierte Zeitangabe
     */
    formatDuration: function(duration) {
        if (duration <= 4) {
            return `${duration} Runden`;
        } else {
            return `${Math.ceil(duration / 4)} Minuten`;
        }
    },
    
    /**
     * Erstellt einen HTML-Tooltip für einen Gegenstand
     * @param {Object} item - Der Gegenstand
     * @returns {string} HTML-Code für den Tooltip
     */
    createItemTooltip: function(item) {
        let html = `<div class="tooltip-title">${item.name}</div>`;
        html += `<div class="tooltip-description">${item.description || 'Kein Beschreibungstext verfügbar.'}</div>`;
        
        if (item.type === 'weapon' || item.type === 'armor') {
            html += '<div class="tooltip-stats">';
            if (item.strength) html += `<div>Stärke: +${item.strength}</div>`;
            if (item.defense) html += `<div>Verteidigung: +${item.defense}</div>`;
            if (item.magic) html += `<div>Magie: +${item.magic}</div>`;
            if (item.speed) html += `<div>Geschwindigkeit: +${item.speed}</div>`;
            html += '</div>';
        } else if (item.type === 'consumable') {
            html += '<div class="tooltip-stats">';
            if (item.effect === 'restoreHp') {
                html += `<div>Heilt ${item.value} Lebenspunkte</div>`;
            } else if (item.effect === 'restoreMana') {
                html += `<div>Stellt ${item.value} Mana wieder her</div>`;
            } else if (item.effect === 'buff') {
                html += `<div>${item.buffDescription}</div>`;
            }
            html += '</div>';
        }
        
        if (item.price) {
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
        let html = `<div class="tooltip-title">${ability.name}</div>`;
        html += `<div class="tooltip-description">${ability.description || 'Keine Beschreibung verfügbar.'}</div>`;
        
        html += '<div class="tooltip-stats">';
        if (ability.damage) html += `<div>Schaden: ${ability.damage}</div>`;
        if (ability.healing) html += `<div>Heilung: ${ability.healing}</div>`;
        if (ability.manaCost) html += `<div>Manakosten: ${ability.manaCost}</div>`;
        if (ability.cooldown) html += `<div>Abklingzeit: ${ability.cooldown} Runden</div>`;
        html += '</div>';
        
        return html;
    }
};
