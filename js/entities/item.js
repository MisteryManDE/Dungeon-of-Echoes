/**
 * Item-Klasse für Dungeon of Echoes
 * Repräsentiert einen Gegenstand im Spiel
 * Version: 2.0.2
 */

class Item {
    /**
     * Erstellt einen neuen Gegenstand
     * @param {string} name - Name des Gegenstands
     * @param {string} type - Typ des Gegenstands (weapon, armor, consumable, etc.)
     * @param {Object} properties - Zusätzliche Eigenschaften des Gegenstands
     */
    constructor(name, type, properties = {}) {
        this.name = name;
        this.type = type;
        this.description = properties.description || "";
        this.icon = properties.icon || this.getDefaultIcon(type);
        this.rarity = properties.rarity || 1; // 1 = gewöhnlich, 5 = legendär
        this.price = properties.price || this.calculateDefaultPrice();
        this.stackable = properties.stackable || (type === 'consumable' || type === 'material');
        this.count = properties.count || 1;

        // Typ-spezifische Eigenschaften
        if (type === 'weapon') {
            this.strength = properties.strength || 1;
            this.magic = properties.magic || 0;
            this.speed = properties.speed || 0;
        } else if (type === 'armor' || type === 'helmet' || type === 'gloves' || type === 'boots') {
            this.defense = properties.defense || 1;
            this.magic = properties.magic || 0;
            this.speed = properties.speed || 0;
        } else if (type === 'accessory') {
            this.strength = properties.strength || 0;
            this.defense = properties.defense || 0;
            this.magic = properties.magic || 0;
            this.speed = properties.speed || 0;
            this.maxHp = properties.maxHp || 0;
            this.maxMana = properties.maxMana || 0;
        } else if (type === 'consumable') {
            this.effect = properties.effect || null;
            this.value = properties.value || 0;
            this.buffName = properties.buffName || null;
            this.buffDuration = properties.buffDuration || 0;
            this.buffEffect = properties.buffEffect || null;
            this.buffValue = properties.buffValue || 0;
        }

        // Zusätzliche Eigenschaften
        for (const key in properties) {
            if (!this.hasOwnProperty(key)) {
                this[key] = properties[key];
            }
        }
    }

    /**
     * Gibt ein Standard-Icon basierend auf dem Typ zurück
     * @param {string} type - Typ des Gegenstands
     * @returns {string} Standard-Icon
     */
    getDefaultIcon(type) {
        switch (type) {
            case 'weapon': return '⚔️';
            case 'armor': return '🛡️';
            case 'helmet': return '🪖';
            case 'gloves': return '🧤';
            case 'boots': return '👢';
            case 'accessory': return '💍';
            case 'consumable': return '🧪';
            case 'material': return '📦';
            case 'quest': return '📜';
            default: return '❓';
        }
    }

    /**
     * Berechnet einen Standardpreis basierend auf Typ und Seltenheit
     * @returns {number} Standardpreis
     */
    calculateDefaultPrice() {
        const basePrice = {
            'weapon': 20,
            'armor': 15,
            'helmet': 10,
            'gloves': 8,
            'boots': 8,
            'accessory': 12,
            'consumable': 5,
            'material': 2,
            'quest': 0
        }[this.type] || 1;

        // Seltenheit beeinflusst den Preis
        const rarityMultiplier = Math.pow(2, this.rarity - 1);

        return basePrice * rarityMultiplier;
    }

    /**
     * Gibt eine Beschreibung des Gegenstands zurück
     * @returns {string} Beschreibung des Gegenstands
     */
    getDescription() {
        let description = this.description || `Ein${this.type === 'weapon' ? 'e' : ''} ${this.name}`;

        // Zusätzliche Informationen basierend auf dem Typ
        if (this.type === 'weapon') {
            description += `\nStärke: +${this.strength}`;
            if (this.magic > 0) description += `\nMagie: +${this.magic}`;
            if (this.speed !== 0) description += `\nGeschwindigkeit: ${this.speed > 0 ? '+' : ''}${this.speed}`;
        } else if (this.type === 'armor' || this.type === 'helmet' || this.type === 'gloves' || this.type === 'boots') {
            description += `\nVerteidigung: +${this.defense}`;
            if (this.magic > 0) description += `\nMagie: +${this.magic}`;
            if (this.speed !== 0) description += `\nGeschwindigkeit: ${this.speed > 0 ? '+' : ''}${this.speed}`;
        } else if (this.type === 'accessory') {
            if (this.strength > 0) description += `\nStärke: +${this.strength}`;
            if (this.defense > 0) description += `\nVerteidigung: +${this.defense}`;
            if (this.magic > 0) description += `\nMagie: +${this.magic}`;
            if (this.speed !== 0) description += `\nGeschwindigkeit: ${this.speed > 0 ? '+' : ''}${this.speed}`;
            if (this.maxHp > 0) description += `\nMax. HP: +${this.maxHp}`;
            if (this.maxMana > 0) description += `\nMax. Mana: +${this.maxMana}`;
        } else if (this.type === 'consumable') {
            if (this.effect === 'restoreHp') {
                description += `\nStellt ${this.value} Lebenspunkte wieder her.`;
            } else if (this.effect === 'restoreMana') {
                description += `\nStellt ${this.value} Mana wieder her.`;
            } else if (this.effect === 'buff') {
                description += `\nGewährt den Effekt "${this.buffName}" für ${Utils.formatDuration(this.buffDuration)}.`;
            }
        }

        // Preis hinzufügen
        if (this.price > 0) {
            description += `\nWert: ${this.price} Gold`;
        }

        return description;
    }

    /**
     * Gibt die Seltenheit als Text zurück
     * @returns {string} Seltenheitstext
     */
    getRarityText() {
        const rarityTexts = [
            'Gewöhnlich',
            'Ungewöhnlich',
            'Selten',
            'Episch',
            'Legendär'
        ];

        return rarityTexts[Math.min(this.rarity - 1, rarityTexts.length - 1)];
    }

    /**
     * Gibt die Farbe basierend auf der Seltenheit zurück
     * @returns {string} CSS-Farbcode
     */
    getRarityColor() {
        const rarityColors = [
            '#FFFFFF', // Gewöhnlich (weiß)
            '#2196F3', // Ungewöhnlich (blau)
            '#9C27B0', // Selten (lila)
            '#FF9800', // Episch (orange)
            '#FFD700'  // Legendär (gold)
        ];

        return rarityColors[Math.min(this.rarity - 1, rarityColors.length - 1)];
    }

    /**
     * Erstellt eine Kopie des Gegenstands
     * @returns {Item} Kopie des Gegenstands
     */
    clone() {
        const properties = {};

        // Alle Eigenschaften kopieren
        for (const key in this) {
            if (this.hasOwnProperty(key) && key !== 'name' && key !== 'type') {
                properties[key] = this[key];
            }
        }

        return new Item(this.name, this.type, properties);
    }

    /**
     * Berechnet den Verkaufspreis des Gegenstands
     * @param {number} charisma - Charismawert des Spielers
     * @returns {number} Verkaufspreis
     */
    getSellPrice(charisma = 0) {
        return Utils.calculateSellPrice(this.price, charisma);
    }

    /**
     * Reduziert die Anzahl des Gegenstands
     * @param {number} amount - Zu reduzierende Menge (Standard: 1)
     * @returns {number} Verbleibende Anzahl
     */
    reduceQuantity(amount = 1) {
        if (!this.stackable) {
            console.warn(`Versuch, die Anzahl eines nicht stapelbaren Gegenstands zu reduzieren: ${this.name}`);
            return 1;
        }

        this.count = Math.max(0, this.count - amount);
        return this.count;
    }

    /**
     * Erhöht die Anzahl des Gegenstands
     * @param {number} amount - Zu erhöhende Menge (Standard: 1)
     * @returns {number} Neue Anzahl
     */
    increaseQuantity(amount = 1) {
        if (!this.stackable) {
            console.warn(`Versuch, die Anzahl eines nicht stapelbaren Gegenstands zu erhöhen: ${this.name}`);
            return 1;
        }

        this.count += amount;
        return this.count;
    }

    /**
     * Erstellt einen Gegenstand aus einem JSON-Objekt
     * @param {Object} data - JSON-Objekt mit Gegenstandsdaten
     * @returns {Item} Der erstellte Gegenstand
     */
    static fromJSON(data) {
        if (!data || !data.name || !data.type) {
            console.error('Ungültiges Item-JSON:', data);
            return null;
        }

        const properties = {};

        // Alle Eigenschaften außer Name und Typ kopieren
        for (const key in data) {
            if (data.hasOwnProperty(key) && key !== 'name' && key !== 'type') {
                properties[key] = data[key];
            }
        }

        // Sicherstellen, dass wichtige Eigenschaften vorhanden sind
        if (data.type === 'consumable') {
            if (!properties.effect) {
                console.warn(`Verbrauchsgegenstand ${data.name} hat keinen Effekt!`);
            }
            if (properties.effect === 'restoreHp' && !properties.value) {
                console.warn(`Heiltrank ${data.name} hat keinen Wert!`);
                properties.value = 20; // Standardwert
            }
            if (properties.effect === 'restoreMana' && !properties.value) {
                console.warn(`Manatrank ${data.name} hat keinen Wert!`);
                properties.value = 10; // Standardwert
            }
        }

        return new Item(data.name, data.type, properties);
    }
}
