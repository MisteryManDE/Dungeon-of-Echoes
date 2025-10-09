/**
 * Player-Klasse für Dungeon of Echoes
 * Repräsentiert den Spielercharakter
 * Version: 2.0.2
 */

class Player {
    /**
     * Erstellt einen neuen Spielercharakter
     * @param {string} name - Name des Spielers
     * @param {string} characterClass - Klasse des Spielers (warrior, rogue, mage)
     */
    constructor(name, characterClass) {
        this.name = name;
        this.characterClass = characterClass;
        this.level = Config.settings.startingLevel;
        this.experience = 0;
        this.gold = Config.settings.startingGold;

        // Basiswerte aus der Konfiguration laden
        const baseStats = Config.classBaseStats[characterClass];
        this.maxHp = baseStats.hp;
        this.hp = this.maxHp;
        this.maxMana = baseStats.magic * 10;
        this.mana = this.maxMana;
        this.strength = baseStats.strength;
        this.defense = baseStats.defense;
        this.magic = baseStats.magic;
        this.speed = baseStats.speed;

        // Inventar und Ausrüstung
        this.inventory = [];
        this.equipment = {
            weapon: null,
            armor: null,
            helmet: null,
            gloves: null,
            boots: null,
            accessory: null
        };

        // Fähigkeiten
        this.abilities = [];
        this.equippedAbilities = [];

        // Statuseffekte
        this.statusEffects = [];

        // Begleiter
        this.companions = [];
        this.activeCompanion = null;

        // Fortschritt
        this.completedQuests = [];
        this.discoveredLocations = ["startingTown"];
        this.achievements = [];

        // Tavernenspiel-Fortschritt
        this.tavernGameProgress = {
            level: 1,
            wins: 0,
            highestLevel: 1
        };
    }

    /**
     * Fügt Erfahrungspunkte hinzu und levelt ggf. auf
     * @param {number} amount - Menge an Erfahrungspunkten
     */
    addExperience(amount) {
        this.experience += amount;

        // Prüfen, ob ein Level-Up möglich ist
        while (this.level < Config.settings.maxLevel &&
               this.experience >= Config.experienceTable[this.level]) {
            this.levelUp();
        }
    }

    /**
     * Führt ein Level-Up durch
     */
    levelUp() {
        this.level++;

        // Wachstumsraten aus der Konfiguration laden
        const growthRates = Config.classGrowthRates[this.characterClass];

        // Attribute erhöhen
        this.maxHp += Math.round(growthRates.hp);
        this.hp = this.maxHp; // Vollständige Heilung beim Level-Up
        this.maxMana += Math.round(growthRates.magic * 5);
        this.mana = this.maxMana; // Vollständige Mana-Wiederherstellung
        this.strength += growthRates.strength;
        this.defense += growthRates.defense;
        this.magic += growthRates.magic;
        this.speed += growthRates.speed;

        // Event auslösen
        EventSystem.emit('playerLevelUp', this.level);
    }

    /**
     * Fügt einen Gegenstand zum Inventar hinzu
     * @param {Item} item - Der hinzuzufügende Gegenstand
     * @returns {boolean} true, wenn erfolgreich, false, wenn das Inventar voll ist
     */
    addItem(item) {
        // Prüfen, ob das Inventar voll ist
        if (this.inventory.length >= Config.settings.maxInventorySlots) {
            return false;
        }

        // Prüfen, ob es sich um einen stapelbaren Gegenstand handelt
        if (item.stackable) {
            // Nach einem vorhandenen Stapel suchen
            const existingItem = this.inventory.find(i =>
                i.name === item.name && i.type === item.type);

            if (existingItem) {
                // Stapel erhöhen
                existingItem.count = (existingItem.count || 1) + (item.count || 1);
                return true;
            }
        }

        // Neuen Gegenstand hinzufügen
        this.inventory.push(item);

        // Event auslösen
        EventSystem.emit('inventoryChanged', this.inventory);

        return true;
    }

    /**
     * Entfernt einen Gegenstand aus dem Inventar
     * @param {number} index - Index des zu entfernenden Gegenstands
     * @param {number} count - Anzahl der zu entfernenden Gegenstände (bei stapelbaren Items)
     * @returns {Item|null} Der entfernte Gegenstand oder null bei Fehler
     */
    removeItem(index, count = 1) {
        if (index < 0 || index >= this.inventory.length) {
            return null;
        }

        const item = this.inventory[index];

        // Bei stapelbaren Gegenständen nur die angegebene Anzahl entfernen
        if (item.stackable && item.count > count) {
            // Methode reduceQuantity verwenden, wenn vorhanden
            if (typeof item.reduceQuantity === 'function') {
                item.reduceQuantity(count);
            } else {
                item.count -= count;
            }

            // Event auslösen
            EventSystem.emit('inventoryChanged', this.inventory);

            // Kopie des Items mit der entfernten Anzahl zurückgeben
            const removedItem = Object.assign({}, item);
            removedItem.count = count;
            return removedItem;
        } else {
            // Gegenstand vollständig entfernen
            const removedItem = this.inventory.splice(index, 1)[0];

            // Event auslösen
            EventSystem.emit('inventoryChanged', this.inventory);

            return removedItem;
        }
    }

    /**
     * Rüstet einen Gegenstand aus
     * @param {number} inventoryIndex - Index des Gegenstands im Inventar
     * @returns {boolean} true, wenn erfolgreich, false bei Fehler
     */
    equipItem(inventoryIndex) {
        if (inventoryIndex < 0 || inventoryIndex >= this.inventory.length) {
            return false;
        }

        const item = this.inventory[inventoryIndex];

        // Prüfen, ob der Gegenstand ausrüstbar ist
        if (!item.type || (item.type !== 'weapon' && item.type !== 'armor' &&
            item.type !== 'helmet' && item.type !== 'gloves' &&
            item.type !== 'boots' && item.type !== 'accessory')) {
            return false;
        }

        // Alten Gegenstand entfernen und zum Inventar hinzufügen
        const oldItem = this.equipment[item.type];
        if (oldItem) {
            this.inventory.push(oldItem);
        }

        // Neuen Gegenstand ausrüsten
        this.equipment[item.type] = item;

        // Gegenstand aus dem Inventar entfernen
        this.inventory.splice(inventoryIndex, 1);

        // Attribute aktualisieren
        this.updateStats();

        // Events auslösen
        EventSystem.emit('equipmentChanged', this.equipment);
        EventSystem.emit('inventoryChanged', this.inventory);

        return true;
    }

    /**
     * Entfernt einen ausgerüsteten Gegenstand
     * @param {string} slot - Ausrüstungsslot (weapon, armor, etc.)
     * @returns {boolean} true, wenn erfolgreich, false bei Fehler
     */
    unequipItem(slot) {
        if (!this.equipment[slot]) {
            return false;
        }

        // Prüfen, ob das Inventar voll ist
        if (this.inventory.length >= Config.settings.maxInventorySlots) {
            return false;
        }

        // Gegenstand zum Inventar hinzufügen
        this.inventory.push(this.equipment[slot]);

        // Ausrüstungsslot leeren
        this.equipment[slot] = null;

        // Attribute aktualisieren
        this.updateStats();

        // Events auslösen
        EventSystem.emit('equipmentChanged', this.equipment);
        EventSystem.emit('inventoryChanged', this.inventory);

        return true;
    }

    /**
     * Benutzt einen Gegenstand aus dem Inventar
     * @param {number} index - Index des zu benutzenden Gegenstands
     * @returns {boolean} true, wenn erfolgreich, false bei Fehler
     */
    useItem(index) {
        if (index < 0 || index >= this.inventory.length) {
            console.error(`Ungültiger Inventar-Index: ${index}`);
            return false;
        }

        const item = this.inventory[index];

        // Prüfen, ob der Gegenstand benutzbar ist
        if (item.type !== 'consumable') {
            console.error(`Gegenstand ist nicht verwendbar: ${item.name} (Typ: ${item.type})`);
            return false;
        }

        // Prüfen, ob der Gegenstand einen Effekt hat
        if (!item.effect) {
            console.error(`Gegenstand hat keinen Effekt: ${item.name}`);
            return false;
        }

        let success = false;

        try {
            // Effekt anwenden
            switch (item.effect) {
                case 'restoreHp':
                    // Prüfen, ob der Wert vorhanden ist
                    if (typeof item.value !== 'number') {
                        console.error(`Heiltrank hat keinen gültigen Wert: ${item.name}`);
                        return false;
                    }

                    const healAmount = Math.min(item.value, this.maxHp - this.hp);
                    this.hp += healAmount;
                    console.log(`${item.name} verwendet: ${healAmount} HP wiederhergestellt`);
                    EventSystem.emit('playerHealed', healAmount);
                    success = true;
                    break;

                case 'restoreMana':
                    // Prüfen, ob der Wert vorhanden ist
                    if (typeof item.value !== 'number') {
                        console.error(`Manatrank hat keinen gültigen Wert: ${item.name}`);
                        return false;
                    }

                    const manaAmount = Math.min(item.value, this.maxMana - this.mana);
                    this.mana += manaAmount;
                    console.log(`${item.name} verwendet: ${manaAmount} Mana wiederhergestellt`);
                    EventSystem.emit('playerManaRestored', manaAmount);
                    success = true;
                    break;

            case 'buff':
                // Prüfen, ob die Buff-Eigenschaften vorhanden sind
                if (!item.buffName || !item.buffDuration || !item.buffEffect || typeof item.buffValue !== 'number') {
                    console.error(`Buff-Gegenstand hat ungültige Eigenschaften: ${item.name}`);
                    return false;
                }

                this.addStatusEffect({
                    name: item.buffName,
                    duration: item.buffDuration,
                    effect: item.buffEffect,
                    value: item.buffValue
                });
                console.log(`${item.name} verwendet: ${item.buffName} für ${item.buffDuration} Runden`);
                success = true;
                break;

            case 'cureStatus':
                // Statuseffekte entfernen
                this.statusEffects = [];
                console.log(`${item.name} verwendet: Alle Statuseffekte entfernt`);
                success = true;
                break;

            default:
                console.error(`Unbekannter Effekt: ${item.effect}`);
                return false;
        }

        if (success) {
            try {
                // Gegenstand entfernen (bei stapelbaren Gegenständen nur einen)
                this.removeItem(index, 1);
                return true;
            } catch (error) {
                console.error('Fehler beim Entfernen des Gegenstands:', error);
                return false;
            }
        }

        return false;
        } catch (error) {
            console.error('Fehler beim Verwenden des Gegenstands:', error);
            return false;
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

        // Event auslösen
        EventSystem.emit('statusEffectAdded', effect);
    }

    /**
     * Aktualisiert alle Statuseffekte (reduziert Dauer, entfernt abgelaufene)
     */
    updateStatusEffects() {
        const expiredEffects = [];

        // Dauer aller Effekte reduzieren
        for (let i = 0; i < this.statusEffects.length; i++) {
            this.statusEffects[i].duration--;

            // Abgelaufene Effekte markieren
            if (this.statusEffects[i].duration <= 0) {
                expiredEffects.push(this.statusEffects[i]);
            }
        }

        // Abgelaufene Effekte entfernen
        this.statusEffects = this.statusEffects.filter(effect => effect.duration > 0);

        // Events für abgelaufene Effekte auslösen
        for (const effect of expiredEffects) {
            EventSystem.emit('statusEffectRemoved', effect);
        }
    }

    /**
     * Aktualisiert die Spielerattribute basierend auf Ausrüstung und Statuseffekten
     */
    updateStats() {
        // Basiswerte aus der Konfiguration laden
        const baseStats = Config.classBaseStats[this.characterClass];
        const growthRates = Config.classGrowthRates[this.characterClass];

        // Basiswerte berechnen (Level-basiert)
        const levelBonus = this.level - 1;
        this.maxHp = baseStats.hp + Math.round(growthRates.hp * levelBonus);
        this.maxMana = (baseStats.magic + Math.round(growthRates.magic * levelBonus)) * 10;
        this.strength = baseStats.strength + growthRates.strength * levelBonus;
        this.defense = baseStats.defense + growthRates.defense * levelBonus;
        this.magic = baseStats.magic + growthRates.magic * levelBonus;
        this.speed = baseStats.speed + growthRates.speed * levelBonus;

        // Ausrüstungsboni hinzufügen
        for (const slot in this.equipment) {
            const item = this.equipment[slot];
            if (item) {
                if (item.strength) this.strength += item.strength;
                if (item.defense) this.defense += item.defense;
                if (item.magic) this.magic += item.magic;
                if (item.speed) this.speed += item.speed;
                if (item.maxHp) this.maxHp += item.maxHp;
                if (item.maxMana) this.maxMana += item.maxMana;
            }
        }

        // Begleiterboni hinzufügen
        if (this.activeCompanion) {
            if (this.activeCompanion.bonusType === 'strength') this.strength += this.activeCompanion.bonusValue;
            if (this.activeCompanion.bonusType === 'defense') this.defense += this.activeCompanion.bonusValue;
            if (this.activeCompanion.bonusType === 'magic') this.magic += this.activeCompanion.bonusValue;
            if (this.activeCompanion.bonusType === 'speed') this.speed += this.activeCompanion.bonusValue;
            if (this.activeCompanion.bonusType === 'maxHp') this.maxHp += this.activeCompanion.bonusValue;
            if (this.activeCompanion.bonusType === 'maxMana') this.maxMana += this.activeCompanion.bonusValue;
        }

        // Statuseffekte anwenden
        for (const effect of this.statusEffects) {
            switch (effect.effect) {
                case 'strengthBoost':
                    this.strength += effect.value;
                    break;
                case 'strengthReduction':
                    this.strength = Math.max(1, this.strength - effect.value);
                    break;
                case 'defenseBoost':
                    this.defense += effect.value;
                    break;
                case 'defenseReduction':
                    this.defense = Math.max(0, this.defense - effect.value);
                    break;
                case 'magicBoost':
                    this.magic += effect.value;
                    break;
                case 'magicReduction':
                    this.magic = Math.max(0, this.magic - effect.value);
                    break;
                case 'speedBoost':
                    this.speed += effect.value;
                    break;
                case 'speedReduction':
                    this.speed = Math.max(1, this.speed - effect.value);
                    break;
            }
        }

        // HP und Mana auf Maximum begrenzen
        this.hp = Math.min(this.hp, this.maxHp);
        this.mana = Math.min(this.mana, this.maxMana);

        // Event auslösen
        EventSystem.emit('playerStatsUpdated', this);
    }

    /**
     * Fügt einen Begleiter hinzu
     * @param {Companion} companion - Der hinzuzufügende Begleiter
     * @returns {boolean} true, wenn erfolgreich, false wenn die maximale Anzahl erreicht ist
     */
    addCompanion(companion) {
        if (this.companions.length >= Config.settings.maxCompanions) {
            return false;
        }

        this.companions.push(companion);

        // Wenn noch kein aktiver Begleiter vorhanden ist, diesen aktivieren
        if (!this.activeCompanion) {
            this.setActiveCompanion(this.companions.length - 1);
        }

        // Event auslösen
        EventSystem.emit('companionAdded', companion);

        return true;
    }

    /**
     * Setzt einen Begleiter als aktiv
     * @param {number} index - Index des Begleiters
     * @returns {boolean} true, wenn erfolgreich, false bei Fehler
     */
    setActiveCompanion(index) {
        if (index < 0 || index >= this.companions.length) {
            return false;
        }

        this.activeCompanion = this.companions[index];

        // Attribute aktualisieren
        this.updateStats();

        // Event auslösen
        EventSystem.emit('activeCompanionChanged', this.activeCompanion);

        return true;
    }

    /**
     * Fügt eine Fähigkeit hinzu
     * @param {Object} ability - Die hinzuzufügende Fähigkeit
     * @returns {boolean} true, wenn erfolgreich, false bei Fehler
     */
    addAbility(ability) {
        // Prüfen, ob die Fähigkeit bereits vorhanden ist
        if (this.abilities.some(a => a.name === ability.name)) {
            return false;
        }

        this.abilities.push(ability);

        // Event auslösen
        EventSystem.emit('abilityAdded', ability);

        return true;
    }

    /**
     * Rüstet eine Fähigkeit aus
     * @param {number} abilityIndex - Index der Fähigkeit
     * @param {number} slotIndex - Index des Slots
     * @returns {boolean} true, wenn erfolgreich, false bei Fehler
     */
    equipAbility(abilityIndex, slotIndex) {
        if (abilityIndex < 0 || abilityIndex >= this.abilities.length ||
            slotIndex < 0 || slotIndex >= Config.settings.maxAbilitySlots) {
            return false;
        }

        // Fähigkeit in den Slot setzen
        while (this.equippedAbilities.length <= slotIndex) {
            this.equippedAbilities.push(null);
        }

        this.equippedAbilities[slotIndex] = this.abilities[abilityIndex];

        // Event auslösen
        EventSystem.emit('equippedAbilitiesChanged', this.equippedAbilities);

        return true;
    }

    /**
     * Entfernt eine ausgerüstete Fähigkeit
     * @param {number} slotIndex - Index des Slots
     * @returns {boolean} true, wenn erfolgreich, false bei Fehler
     */
    unequipAbility(slotIndex) {
        if (slotIndex < 0 || slotIndex >= this.equippedAbilities.length) {
            return false;
        }

        this.equippedAbilities[slotIndex] = null;

        // Event auslösen
        EventSystem.emit('equippedAbilitiesChanged', this.equippedAbilities);

        return true;
    }

    /**
     * Speichert den Spieler als JSON-Objekt
     * @returns {Object} JSON-Objekt mit Spielerdaten
     */
    toJSON() {
        // Spezielle Behandlung für Inventar und Ausrüstung
        const inventoryData = this.inventory.map(item => {
            return {
                name: item.name,
                type: item.type,
                description: item.description,
                icon: item.icon,
                price: item.price,
                rarity: item.rarity,
                stackable: item.stackable,
                count: item.count,
                strength: item.strength,
                defense: item.defense,
                magic: item.magic,
                speed: item.speed,
                maxHp: item.maxHp,
                maxMana: item.maxMana,
                effect: item.effect,
                value: item.value,
                buffName: item.buffName,
                buffDuration: item.buffDuration,
                buffEffect: item.buffEffect,
                buffValue: item.buffValue
            };
        });

        const equipmentData = {};
        for (const slot in this.equipment) {
            if (this.equipment[slot]) {
                const item = this.equipment[slot];
                equipmentData[slot] = {
                    name: item.name,
                    type: item.type,
                    description: item.description,
                    icon: item.icon,
                    price: item.price,
                    rarity: item.rarity,
                    strength: item.strength,
                    defense: item.defense,
                    magic: item.magic,
                    speed: item.speed,
                    maxHp: item.maxHp,
                    maxMana: item.maxMana
                };
            }
        }

        // Spezielle Behandlung für Begleiter
        const companionsData = this.companions.map(companion => {
            if (!companion) return null;
            return {
                name: companion.name,
                type: companion.type,
                description: companion.description,
                icon: companion.icon,
                level: companion.level,
                experience: companion.experience,
                maxLevel: companion.maxLevel,
                bonusType: companion.bonusType,
                bonusValue: companion.bonusValue,
                canFight: companion.canFight,
                strength: companion.strength,
                defense: companion.defense,
                magic: companion.magic,
                speed: companion.speed,
                abilities: companion.abilities,
                loyalty: companion.loyalty
            };
        });

        let activeCompanionData = null;
        if (this.activeCompanion) {
            activeCompanionData = {
                name: this.activeCompanion.name,
                type: this.activeCompanion.type,
                description: this.activeCompanion.description,
                icon: this.activeCompanion.icon,
                level: this.activeCompanion.level,
                experience: this.activeCompanion.experience,
                maxLevel: this.activeCompanion.maxLevel,
                bonusType: this.activeCompanion.bonusType,
                bonusValue: this.activeCompanion.bonusValue,
                canFight: this.activeCompanion.canFight,
                strength: this.activeCompanion.strength,
                defense: this.activeCompanion.defense,
                magic: this.activeCompanion.magic,
                speed: this.activeCompanion.speed,
                abilities: this.activeCompanion.abilities,
                loyalty: this.activeCompanion.loyalty
            };
        }

        return {
            name: this.name,
            characterClass: this.characterClass,
            level: this.level,
            experience: this.experience,
            gold: this.gold,
            maxHp: this.maxHp,
            hp: this.hp,
            maxMana: this.maxMana,
            mana: this.mana,
            strength: this.strength,
            defense: this.defense,
            magic: this.magic,
            speed: this.speed,
            inventory: inventoryData,
            equipment: equipmentData,
            abilities: this.abilities,
            equippedAbilities: this.equippedAbilities,
            statusEffects: this.statusEffects,
            companions: companionsData,
            activeCompanion: activeCompanionData,
            completedQuests: this.completedQuests,
            discoveredLocations: this.discoveredLocations,
            achievements: this.achievements,
            tavernGameProgress: this.tavernGameProgress
        };
    }

    /**
     * Lädt einen Spieler aus einem JSON-Objekt
     * @param {Object} data - JSON-Objekt mit Spielerdaten
     * @returns {Player} Der geladene Spieler
     */
    static fromJSON(data) {
        const player = new Player(data.name, data.characterClass);

        player.level = data.level || 1;
        player.experience = data.experience || 0;
        player.gold = data.gold || 0;
        player.maxHp = data.maxHp || 0;
        player.hp = data.hp || 0;
        player.maxMana = data.maxMana || 0;
        player.mana = data.mana || 0;
        player.strength = data.strength || 0;
        player.defense = data.defense || 0;
        player.magic = data.magic || 0;
        player.speed = data.speed || 0;

        // Inventar laden
        player.inventory = [];
        if (data.inventory && Array.isArray(data.inventory)) {
            for (const itemData of data.inventory) {
                const item = new Item(itemData.name, itemData.type, itemData);
                player.inventory.push(item);
            }
        }

        // Ausrüstung laden
        player.equipment = {};
        if (data.equipment) {
            for (const slot in data.equipment) {
                if (data.equipment[slot]) {
                    const itemData = data.equipment[slot];
                    player.equipment[slot] = new Item(itemData.name, itemData.type, itemData);
                }
            }
        }

        player.abilities = data.abilities || [];
        player.equippedAbilities = data.equippedAbilities || [];
        player.statusEffects = data.statusEffects || [];

        // Begleiter laden
        player.companions = [];
        if (data.companions && Array.isArray(data.companions)) {
            for (const companionData of data.companions) {
                if (companionData) {
                    const companion = Companion.fromJSON(companionData);
                    player.companions.push(companion);
                }
            }
        }

        // Aktiven Begleiter laden
        player.activeCompanion = null;
        if (data.activeCompanion) {
            player.activeCompanion = Companion.fromJSON(data.activeCompanion);
        }

        player.completedQuests = data.completedQuests || [];
        player.discoveredLocations = data.discoveredLocations || ["startingTown"];
        player.achievements = data.achievements || [];
        player.tavernGameProgress = data.tavernGameProgress || { level: 1, wins: 0, highestLevel: 1 };

        return player;
    }
}
