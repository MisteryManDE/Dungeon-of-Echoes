/**
 * Enemy-Klasse für Dungeon of Echoes
 * Repräsentiert einen Gegner im Spiel
 * Version: 2.0.2
 */

class Enemy {
    /**
     * Erstellt einen neuen Gegner
     * @param {string} type - Typ des Gegners
     * @param {Object} stats - Statistiken des Gegners
     */
    constructor(type, stats) {
        this.type = type;
        this.name = stats.name || type;
        this.level = stats.level || 1;
        this.maxHp = stats.hp || 10;
        this.hp = this.maxHp;
        this.strength = stats.strength || 2;
        this.defense = stats.defense || 1;
        this.magic = stats.magic || 0;
        this.speed = stats.speed || 1;
        this.xp = stats.xp || 5;
        this.gold = stats.gold || 5;
        this.icon = stats.icon || "👹";
        this.isBoss = stats.isBoss || false;
        
        // Angriffe und Fähigkeiten
        this.attacks = stats.attacks || [{
            name: "Angriff",
            damage: this.strength,
            type: "physical"
        }];
        
        // Beute
        this.loot = stats.loot || [];
        
        // Statuseffekte
        this.statusEffects = [];
        
        // Cooldowns für Fähigkeiten
        this.cooldowns = {};
    }
    
    /**
     * Führt einen Angriff aus
     * @returns {Object} Informationen über den Angriff
     */
    attack() {
        // Verfügbare Angriffe filtern (keine mit aktivem Cooldown)
        const availableAttacks = this.attacks.filter(attack => 
            !this.cooldowns[attack.name] || this.cooldowns[attack.name] <= 0);
        
        // Wenn keine Angriffe verfügbar sind, Standardangriff verwenden
        if (availableAttacks.length === 0) {
            return {
                name: "Angriff",
                damage: this.strength,
                type: "physical"
            };
        }
        
        // Zufälligen Angriff auswählen
        const attack = Utils.randomChoice(availableAttacks);
        
        // Cooldown setzen, falls vorhanden
        if (attack.cooldown) {
            this.cooldowns[attack.name] = attack.cooldown;
        }
        
        // Angriffsinformationen zurückgeben
        return {
            name: attack.name,
            damage: attack.damage || this.strength,
            type: attack.type || "physical",
            effect: attack.effect || null
        };
    }
    
    /**
     * Aktualisiert die Cooldowns für Fähigkeiten
     */
    updateCooldowns() {
        for (const attackName in this.cooldowns) {
            if (this.cooldowns[attackName] > 0) {
                this.cooldowns[attackName]--;
            }
        }
    }
    
    /**
     * Fügt einen Statuseffekt hinzu
     * @param {Object} effect - Der Statuseffekt
     */
    addStatusEffect(effect) {
        // Prüfen, ob der Effekt bereits vorhanden ist
        const existingEffect = this.statusEffects.find(e => e.name === effect.name);
        
        if (existingEffect) {
            // Dauer aktualisieren
            existingEffect.duration = Math.max(existingEffect.duration, effect.duration);
        } else {
            // Neuen Effekt hinzufügen
            this.statusEffects.push(effect);
        }
    }
    
    /**
     * Aktualisiert alle Statuseffekte (reduziert Dauer, entfernt abgelaufene)
     */
    updateStatusEffects() {
        // Dauer aller Effekte reduzieren
        for (let i = 0; i < this.statusEffects.length; i++) {
            this.statusEffects[i].duration--;
        }
        
        // Abgelaufene Effekte entfernen
        this.statusEffects = this.statusEffects.filter(effect => effect.duration > 0);
    }
    
    /**
     * Generiert Beute basierend auf den Loot-Tabellen
     * @returns {Array} Array mit Beute-Objekten
     */
    generateLoot() {
        const lootItems = [];
        
        // Jedes mögliche Beutestück durchgehen
        for (const lootEntry of this.loot) {
            // Zufällig bestimmen, ob das Item gedroppt wird
            if (Math.random() < lootEntry.chance) {
                // Item erstellen
                const item = new Item(
                    lootEntry.name,
                    lootEntry.type,
                    lootEntry.properties || {}
                );
                
                // Anzahl bestimmen (falls angegeben)
                if (lootEntry.minCount && lootEntry.maxCount) {
                    item.count = Utils.randomInt(lootEntry.minCount, lootEntry.maxCount);
                }
                
                lootItems.push(item);
            }
        }
        
        return lootItems;
    }
    
    /**
     * Berechnet die tatsächlichen Attribute unter Berücksichtigung von Statuseffekten
     * @returns {Object} Objekt mit den aktuellen Attributen
     */
    getEffectiveStats() {
        let effectiveStrength = this.strength;
        let effectiveDefense = this.defense;
        let effectiveSpeed = this.speed;
        
        // Statuseffekte anwenden
        for (const effect of this.statusEffects) {
            switch (effect.effect) {
                case 'strengthBoost':
                    effectiveStrength += effect.value;
                    break;
                case 'strengthReduction':
                    effectiveStrength = Math.max(1, effectiveStrength - effect.value);
                    break;
                case 'defenseBoost':
                    effectiveDefense += effect.value;
                    break;
                case 'defenseReduction':
                    effectiveDefense = Math.max(0, effectiveDefense - effect.value);
                    break;
                case 'speedBoost':
                    effectiveSpeed += effect.value;
                    break;
                case 'speedReduction':
                    effectiveSpeed = Math.max(1, effectiveSpeed - effect.value);
                    break;
            }
        }
        
        return {
            strength: effectiveStrength,
            defense: effectiveDefense,
            speed: effectiveSpeed
        };
    }
    
    /**
     * Prüft, ob der Gegner einen bestimmten Statuseffekt hat
     * @param {string} effectName - Name des Statuseffekts
     * @returns {boolean} true, wenn der Effekt vorhanden ist, sonst false
     */
    hasStatusEffect(effectName) {
        return this.statusEffects.some(effect => effect.name === effectName);
    }
    
    /**
     * Erstellt eine Kopie des Gegners
     * @returns {Enemy} Kopie des Gegners
     */
    clone() {
        return new Enemy(this.type, {
            name: this.name,
            level: this.level,
            hp: this.maxHp,
            strength: this.strength,
            defense: this.defense,
            magic: this.magic,
            speed: this.speed,
            xp: this.xp,
            gold: this.gold,
            icon: this.icon,
            isBoss: this.isBoss,
            attacks: [...this.attacks],
            loot: [...this.loot]
        });
    }
}
