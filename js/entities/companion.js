/**
 * Companion-Klasse für Dungeon of Echoes
 * Repräsentiert einen Begleiter des Spielers
 * Version: 2.0.2
 */

class Companion {
    /**
     * Erstellt einen neuen Begleiter
     * @param {string} name - Name des Begleiters
     * @param {string} type - Typ des Begleiters (pet, familiar, mount, etc.)
     * @param {Object} properties - Zusätzliche Eigenschaften des Begleiters
     */
    constructor(name, type, properties = {}) {
        this.name = name;
        this.type = type;
        this.description = properties.description || "";
        this.icon = properties.icon || this.getDefaultIcon(type);
        this.level = properties.level || 1;
        this.experience = properties.experience || 0;
        this.maxLevel = properties.maxLevel || 10;
        
        // Bonus-Eigenschaften
        this.bonusType = properties.bonusType || null;
        this.bonusValue = properties.bonusValue || 0;
        
        // Kampffähigkeiten
        this.canFight = properties.canFight || false;
        this.strength = properties.strength || 0;
        this.defense = properties.defense || 0;
        this.magic = properties.magic || 0;
        this.speed = properties.speed || 0;
        
        // Spezialfähigkeiten
        this.abilities = properties.abilities || [];
        
        // Loyalität (beeinflusst die Effektivität)
        this.loyalty = properties.loyalty || 50; // 0-100
        
        // Zusätzliche Eigenschaften
        for (const key in properties) {
            if (!this.hasOwnProperty(key)) {
                this[key] = properties[key];
            }
        }
    }
    
    /**
     * Gibt ein Standard-Icon basierend auf dem Typ zurück
     * @param {string} type - Typ des Begleiters
     * @returns {string} Standard-Icon
     */
    getDefaultIcon(type) {
        switch (type) {
            case 'pet': return '🐕';
            case 'familiar': return '🦉';
            case 'mount': return '🐎';
            case 'spirit': return '👻';
            case 'robot': return '🤖';
            default: return '🐾';
        }
    }
    
    /**
     * Fügt Erfahrungspunkte hinzu und levelt ggf. auf
     * @param {number} amount - Menge an Erfahrungspunkten
     */
    addExperience(amount) {
        if (this.level >= this.maxLevel) return;
        
        this.experience += amount;
        
        // Prüfen, ob ein Level-Up möglich ist
        const expNeeded = this.getExperienceForNextLevel();
        if (this.experience >= expNeeded) {
            this.levelUp();
        }
    }
    
    /**
     * Berechnet die benötigten Erfahrungspunkte für das nächste Level
     * @returns {number} Benötigte Erfahrungspunkte
     */
    getExperienceForNextLevel() {
        return this.level * 100;
    }
    
    /**
     * Führt ein Level-Up durch
     */
    levelUp() {
        if (this.level >= this.maxLevel) return;
        
        this.level++;
        this.experience = 0;
        
        // Attribute verbessern
        if (this.canFight) {
            this.strength += 1;
            this.defense += 1;
            this.magic += 1;
            this.speed += 1;
        }
        
        // Bonus verbessern
        this.bonusValue += 1;
        
        // Event auslösen
        EventSystem.emit('companionLevelUp', this);
    }
    
    /**
     * Erhöht die Loyalität des Begleiters
     * @param {number} amount - Menge an Loyalität
     */
    increaseLoyalty(amount) {
        this.loyalty = Math.min(100, this.loyalty + amount);
        
        // Event auslösen
        EventSystem.emit('companionLoyaltyChanged', this);
    }
    
    /**
     * Verringert die Loyalität des Begleiters
     * @param {number} amount - Menge an Loyalität
     */
    decreaseLoyalty(amount) {
        this.loyalty = Math.max(0, this.loyalty - amount);
        
        // Event auslösen
        EventSystem.emit('companionLoyaltyChanged', this);
    }
    
    /**
     * Berechnet den effektiven Bonuswert basierend auf Loyalität
     * @returns {number} Effektiver Bonuswert
     */
    getEffectiveBonusValue() {
        // Loyalität beeinflusst die Effektivität (50% - 100%)
        const loyaltyFactor = 0.5 + (this.loyalty / 200);
        return Math.floor(this.bonusValue * loyaltyFactor);
    }
    
    /**
     * Führt eine Kampfaktion aus
     * @returns {Object|null} Informationen über die Aktion oder null, wenn keine Aktion möglich ist
     */
    performAction() {
        if (!this.canFight) return null;
        
        // Zufällig bestimmen, ob der Begleiter handelt (basierend auf Loyalität)
        if (Math.random() > (this.loyalty / 100)) {
            return null;
        }
        
        // Wenn Fähigkeiten vorhanden sind, zufällige Fähigkeit auswählen
        if (this.abilities.length > 0) {
            const ability = Utils.randomChoice(this.abilities);
            
            return {
                name: ability.name,
                type: ability.type,
                value: ability.value,
                description: ability.description
            };
        }
        
        // Standardaktion
        return {
            name: "Angriff",
            type: "damage",
            value: this.strength,
            description: `${this.name} greift an!`
        };
    }
    
    /**
     * Gibt eine Beschreibung des Begleiters zurück
     * @returns {string} Beschreibung des Begleiters
     */
    getDescription() {
        let description = this.description || `Ein treuer ${this.type}-Begleiter.`;
        
        description += `\nLevel: ${this.level}/${this.maxLevel}`;
        
        if (this.bonusType) {
            const bonusText = {
                'strength': 'Stärke',
                'defense': 'Verteidigung',
                'magic': 'Magie',
                'speed': 'Geschwindigkeit',
                'maxHp': 'Max. HP',
                'maxMana': 'Max. Mana'
            }[this.bonusType] || this.bonusType;
            
            description += `\nBonus: +${this.getEffectiveBonusValue()} ${bonusText}`;
        }
        
        if (this.canFight) {
            description += `\nKampffähig: Ja`;
            description += `\nStärke: ${this.strength}`;
            description += `\nVerteidigung: ${this.defense}`;
            description += `\nMagie: ${this.magic}`;
            description += `\nGeschwindigkeit: ${this.speed}`;
        }
        
        description += `\nLoyalität: ${this.loyalty}%`;
        
        return description;
    }
    
    /**
     * Erstellt eine Kopie des Begleiters
     * @returns {Companion} Kopie des Begleiters
     */
    clone() {
        const properties = {};
        
        // Alle Eigenschaften kopieren
        for (const key in this) {
            if (this.hasOwnProperty(key) && key !== 'name' && key !== 'type') {
                properties[key] = this[key];
            }
        }
        
        return new Companion(this.name, this.type, properties);
    }
    
    /**
     * Erstellt einen Begleiter aus einem JSON-Objekt
     * @param {Object} data - JSON-Objekt mit Begleiterdaten
     * @returns {Companion} Der erstellte Begleiter
     */
    static fromJSON(data) {
        const properties = {};
        
        // Alle Eigenschaften außer Name und Typ kopieren
        for (const key in data) {
            if (data.hasOwnProperty(key) && key !== 'name' && key !== 'type') {
                properties[key] = data[key];
            }
        }
        
        return new Companion(data.name, data.type, properties);
    }
}
