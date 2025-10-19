
/**
 * Inventory-System für Dungeon of Echoes
 * Verwaltet das Inventar und die Ausrüstung des Spielers
 * Version: 2.0.2
 */

const InventorySystem = {
    /**
     * Initialisiert das Inventarsystem
     */
    init: function() {
        // Event-Listener für Inventaränderungen registrieren
        EventSystem.on('inventoryChanged', () => this.updateInventoryUI());
        EventSystem.on('equipmentChanged', () => this.updateEquipmentUI());
    },

    /**
     * Aktualisiert die Inventar-UI
     */
    updateInventoryUI: function() {
        GameUI.showInventory();
    },

    /**
     * Aktualisiert die Ausrüstungs-UI
     */
    updateEquipmentUI: function() {
        GameUI.showEquipment();
    },

    /**
     * Zeigt das Inventarmenü an
     */
    showInventoryMenu: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();

        // Titel anzeigen
        GameUI.addMessage("Inventar", 'title');

        // Inventar und Ausrüstung anzeigen
        this.updateInventoryUI();
        this.updateEquipmentUI();

        // Aktionen hinzufügen
        GameUI.addAction('Zurück', () => {
            GameEngine.showMainMenu();
        }, 'secondary');
    },

    /**
     * Fügt einen Gegenstand zum Inventar hinzu
     * @param {Item} item - Der hinzuzufügende Gegenstand
     * @returns {boolean} true, wenn erfolgreich, false, wenn das Inventar voll ist
     */
    addItem: function(item) {
        return GameEngine.player.addItem(item);
    },

    /**
     * Entfernt einen Gegenstand aus dem Inventar
     * @param {number} index - Index des zu entfernenden Gegenstands
     * @param {number} count - Anzahl der zu entfernenden Gegenstände (bei stapelbaren Items)
     * @returns {Item|null} Der entfernte Gegenstand oder null bei Fehler
     */
    removeItem: function(index, count = 1) {
        return GameEngine.player.removeItem(index, count);
    },

    /**
     * Rüstet einen Gegenstand aus
     * @param {number} inventoryIndex - Index des Gegenstands im Inventar
     * @returns {boolean} true, wenn erfolgreich, false bei Fehler
     */
    equipItem: function(inventoryIndex) {
        return GameEngine.player.equipItem(inventoryIndex);
    },

    /**
     * Entfernt einen ausgerüsteten Gegenstand
     * @param {string} slot - Ausrüstungsslot (weapon, armor, etc.)
     * @returns {boolean} true, wenn erfolgreich, false bei Fehler
     */
    unequipItem: function(slot) {
        return GameEngine.player.unequipItem(slot);
    },

    /**
     * Benutzt einen Gegenstand aus dem Inventar
     * @param {number} index - Index des zu benutzenden Gegenstands
     * @returns {boolean} true, wenn erfolgreich, false bei Fehler
     */
    useItem: function(index) {
        return GameEngine.player.useItem(index);
    },

    /**
     * Zeigt das Händlermenü an
     * @param {Object} merchant - Der Händler
     */
    showMerchantMenu: function(merchant) {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();

        // Titel anzeigen
        GameUI.addMessage(`Händler: ${merchant.name}`, 'title');
        GameUI.addMessage(merchant.greeting, 'npc');

        // Aktionen hinzufügen
        GameUI.addAction('Kaufen', () => {
            this.showBuyMenu(merchant);
        }, 'primary');

        GameUI.addAction('Verkaufen', () => {
            this.showSellMenu();
        }, 'primary');

        GameUI.addAction('Zurück', () => {
            GameEngine.showTownMenu();
        }, 'secondary');
    },

    /**
     * Zeigt das Kaufmenü an
     * @param {Object} merchant - Der Händler
     */
    showBuyMenu: function(merchant) {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();

        // Titel anzeigen
        GameUI.addMessage(`Kaufen von ${merchant.name}`, 'title');
        GameUI.addMessage(`Du hast ${GameEngine.player.gold} Gold.`, 'info');

        // Waren anzeigen
        if (!merchant.inventory || merchant.inventory.length === 0) {
            GameUI.addMessage("Der Händler hat keine Waren anzubieten.", 'info');
        } else {
            merchant.inventory.forEach((itemKey, index) => {
                const item = ItemData.createItem(itemKey);
                if (!item) return;

                // Kaufpreis berechnen
                const price = Utils.calculateBuyPrice(item.price, GameEngine.player.charisma || 0);

                // Prüfen, ob der Spieler genug Gold hat
                const canBuy = GameEngine.player.gold >= price;

                const button = GameUI.addAction(`${item.name} (${price} Gold)`, () => {
                    this.buyItem(merchant, index);
                }, canBuy ? 'primary' : 'danger');

                if (!canBuy) {
                    button.disabled = true;
                }
            });
        }

        // Zurück-Button
        GameUI.addAction('Zurück', () => {
            this.showMerchantMenu(merchant);
        }, 'secondary');
    },

    /**
     * Kauft einen Gegenstand von einem Händler
     * @param {Object} merchant - Der Händler
     * @param {number} index - Index des zu kaufenden Gegenstands
     */
    buyItem: function(merchant, index) {
        const player = GameEngine.player;

        if (!merchant.inventory || index < 0 || index >= merchant.inventory.length) return;

        const itemKey = merchant.inventory[index];
        const item = ItemData.createItem(itemKey);

        if (!item) return;

        // Kaufpreis berechnen
        const price = Utils.calculateBuyPrice(item.price, player.charisma || 0);

        // Prüfen, ob der Spieler genug Gold hat
        if (player.gold < price) {
            GameUI.addMessage(`Du hast nicht genug Gold, um ${item.name} zu kaufen!`, 'danger');
            return;
        }

        // Prüfen, ob das Inventar voll ist
        if (player.inventory.length >= Config.settings.maxInventorySlots) {
            GameUI.addMessage(`Dein Inventar ist voll! Du kannst ${item.name} nicht kaufen.`, 'danger');
            return;
        }

        // Gold abziehen
        player.gold -= price;

        // Item zum Inventar hinzufügen
        player.addItem(item);

        // Nachricht anzeigen
        GameUI.addMessage(`Du kaufst ${item.name} für ${price} Gold.`, 'success');

        // UI aktualisieren
        GameUI.updateStats();

        // Kaufmenü erneut anzeigen
        this.showBuyMenu(merchant);
    },

    /**
     * Zeigt das Verkaufsmenü an
     */
    showSellMenu: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();

        // Titel anzeigen
        GameUI.addMessage("Verkaufen", 'title');
        GameUI.addMessage(`Du hast ${GameEngine.player.gold} Gold.`, 'info');

        // Inventar im Händlermodus anzeigen
        GameUI.showInventory(true);

        // Inventar anzeigen
        const player = GameEngine.player;

        if (player.inventory.length === 0) {
            GameUI.addMessage("Du hast keine Gegenstände zum Verkaufen.", 'info');
        } else {
            player.inventory.forEach((item, index) => {
                try {
                    // Verkaufspreis berechnen
                    const price = Utils.calculateSellPrice(item.price, player.charisma || 0);

                    GameUI.addAction(`${item.name}${item.stackable && item.count > 1 ? ` (${item.count})` : ''} (${price} Gold)`, () => {
                        this.sellItem(index);
                    }, 'primary');
                } catch (error) {
                    console.error('Fehler beim Berechnen des Verkaufspreises für', item.name, error);
                    GameUI.addAction(`${item.name}${item.stackable && item.count > 1 ? ` (${item.count})` : ''} (1 Gold)`, () => {
                        this.sellItem(index);
                    }, 'primary');
                }
            });
        }

        // Zurück-Button
        GameUI.addAction('Zurück', () => {
            this.showMerchantMenu(GameEngine.currentMerchant);
        }, 'secondary');
    },

    /**
     * Verkauft einen Gegenstand
     * @param {number} index - Index des zu verkaufenden Gegenstands
     */
    sellItem: function(index) {
        const player = GameEngine.player;

        if (index < 0 || index >= player.inventory.length) return;

        const item = player.inventory[index];

        try {
            // Verkaufspreis berechnen
            const price = item.getSellPrice ? item.getSellPrice(player.charisma || 0) : Utils.calculateSellPrice(item.price, player.charisma || 0);

            // Anzahl abfragen, wenn stapelbar
            if (item.stackable && item.count > 1) {
                // UI vorbereiten
                GameUI.clearActions();
                GameUI.clearMessages();

                // Titel anzeigen
                GameUI.addMessage(`Verkaufe ${item.name}`, 'title');
                GameUI.addMessage(`Du hast ${item.count} ${item.name}. Wie viele möchtest du verkaufen?`, 'info');

            // Optionen anzeigen
            for (let i = 1; i <= Math.min(5, item.count); i++) {
                GameUI.addAction(`${i} (${price * i} Gold)`, () => {
                    this.sellItemCount(index, i);
                }, 'primary');
            }

            if (item.count > 5) {
                GameUI.addAction(`Alle (${price * item.count} Gold)`, () => {
                    this.sellItemCount(index, item.count);
                }, 'primary');
            }

            // Zurück-Button
            GameUI.addAction('Zurück', () => {
                this.showSellMenu();
            }, 'secondary');
        } else {
            // Einzelnen Gegenstand verkaufen
            this.sellItemCount(index, 1);
        }
        } catch (error) {
            console.error('Fehler beim Verkaufen von', item.name, error);
            GameUI.addMessage(`Fehler beim Verkaufen von ${item.name}.`, 'error');
        }
    },

    /**
     * Verkauft eine bestimmte Anzahl eines Gegenstands
     * @param {number} index - Index des zu verkaufenden Gegenstands
     * @param {number} count - Anzahl der zu verkaufenden Gegenstände
     */
    sellItemCount: function(index, count) {
        const player = GameEngine.player;

        if (index < 0 || index >= player.inventory.length) return;

        const item = player.inventory[index];

        try {
            // Verkaufspreis berechnen
            const unitPrice = item.getSellPrice ? item.getSellPrice(player.charisma || 0) : Utils.calculateSellPrice(item.price, player.charisma || 0);
            const price = unitPrice * count;

            // Gegenstand entfernen
            const removedItem = player.removeItem(index, count);

            if (removedItem) {
                // Gold hinzufügen
                player.gold += price;

                // Nachricht anzeigen
                GameUI.addMessage(`Du verkaufst ${count > 1 ? `${count}x ` : ''}${item.name} für ${price} Gold.`, 'success');

                // UI aktualisieren
                GameUI.updateStats();
            }
        } catch (error) {
            console.error('Fehler beim Verkaufen von', item.name, error);
            GameUI.addMessage(`Fehler beim Verkaufen von ${item.name}.`, 'error');
        }

        // Verkaufsmenü erneut anzeigen
        this.showSellMenu();
    },

    /**
     * Zeigt das Crafting-Menü an
     */
    showCraftingMenu: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();

        // Titel anzeigen
        GameUI.addMessage("Handwerk", 'title');

        // Kategorien anzeigen
        GameUI.addAction('Waffen', () => {
            this.showCraftingCategory('weapon');
        }, 'primary');

        GameUI.addAction('Rüstungen', () => {
            this.showCraftingCategory('armor');
        }, 'primary');

        GameUI.addAction('Tränke', () => {
            this.showCraftingCategory('potion');
        }, 'primary');

        // Zurück-Button
        GameUI.addAction('Zurück zum Inventar', () => {
            GameUI.clearMessages();
            GameUI.clearActions();
            GameUI.showInventory();
        }, 'secondary');

        // Zurück zur Stadt oder zum Dungeon
        if (GameEngine.currentDungeon) {
            GameUI.addAction('Zurück zum Dungeon', () => {
                GameEngine.exploreDungeon();
            }, 'secondary');
        } else {
            GameUI.addAction('Zurück zur Stadt', () => {
                GameEngine.showTownMenu();
            }, 'secondary');
        }
    },

    /**
     * Zeigt eine Crafting-Kategorie an
     * @param {string} category - Die Kategorie
     */
    showCraftingCategory: function(category) {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();

        // Titel anzeigen
        let categoryName;
        switch (category) {
            case 'weapon': categoryName = 'Waffen'; break;
            case 'armor': categoryName = 'Rüstungen'; break;
            case 'potion': categoryName = 'Tränke'; break;
            default: categoryName = category;
        }

        GameUI.addMessage(`Handwerk: ${categoryName}`, 'title');

        // Rezepte anzeigen
        const recipes = this.getCraftingRecipes(category);

        if (recipes.length === 0) {
            GameUI.addMessage(`Du kennst noch keine Rezepte für ${categoryName}.`, 'info');
        } else {
            recipes.forEach((recipe, index) => {
                // Prüfen, ob der Spieler die benötigten Materialien hat
                const canCraft = this.canCraftRecipe(recipe);

                const button = GameUI.addAction(recipe.name, () => {
                    this.showRecipeDetails(recipe);
                }, canCraft ? 'primary' : 'danger');

                // Nur wenn der Button erfolgreich erstellt wurde
                if (button && !canCraft) {
                    try {
                        button.disabled = true;
                    } catch (error) {
                        console.error('Fehler beim Deaktivieren des Buttons:', error);
                    }
                }
            });
        }

        // Zurück-Button
        GameUI.addAction('Zurück', () => {
            this.showCraftingMenu();
        }, 'secondary');
    },

    /**
     * Zeigt die Details eines Rezepts an
     * @param {Object} recipe - Das Rezept
     */
    showRecipeDetails: function(recipe) {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();

        // Titel anzeigen
        GameUI.addMessage(`Rezept: ${recipe.name}`, 'title');

        // Beschreibung anzeigen
        if (recipe.description) {
            GameUI.addMessage(recipe.description, 'info');
        } else {
            // Flavor-Text basierend auf Rezepttyp hinzufügen
            const flavorTexts = {
                weapon: "Eine gut gefertigte Waffe kann den Unterschied zwischen Leben und Tod bedeuten.",
                armor: "Gute Rüstung schützt dich vor den tödlichen Klauen und Zähnen der Dungeon-Bewohner.",
                potion: "Tränke brauen ist eine Kunst, die Konzentration und Präzision erfordert."
            };

            GameUI.addMessage(flavorTexts[recipe.category] || "Ein wertvoller Gegenstand, der dir auf deiner Reise helfen wird.", 'info');
        }

        // Eigenschaften des herzustellenden Gegenstands anzeigen
        if (recipe.result && recipe.result.properties) {
            GameUI.addMessage("Eigenschaften:", 'info');

            const props = recipe.result.properties;
            if (props.strength) GameUI.addMessage(`- Stärke: +${props.strength}`, 'success');
            if (props.defense) GameUI.addMessage(`- Verteidigung: +${props.defense}`, 'success');
            if (props.magic) GameUI.addMessage(`- Magie: +${props.magic}`, 'success');
            if (props.speed) GameUI.addMessage(`- Geschwindigkeit: +${props.speed}`, 'success');
            if (props.value) GameUI.addMessage(`- Wert: ${props.value} ${recipe.result.effect === 'restoreHp' ? 'HP' : 'Mana'}`, 'success');
        }

        // Benötigte Materialien anzeigen
        GameUI.addMessage("Benötigte Materialien:", 'info');

        recipe.materials.forEach(material => {
            const playerMaterial = GameEngine.player.inventory.find(item =>
                item.name === material.name && item.type === 'material');

            const playerCount = playerMaterial ? playerMaterial.count : 0;
            const hasEnough = playerCount >= material.count;

            GameUI.addMessage(`- ${material.name}: ${playerCount}/${material.count}`, hasEnough ? 'success' : 'danger');
        });

        // Herstellen-Button
        const canCraft = this.canCraftRecipe(recipe);

        const craftButton = GameUI.addAction('Herstellen', () => {
            this.craftItem(recipe);
        }, 'primary');

        // Nur wenn der Button erfolgreich erstellt wurde
        if (craftButton) {
            if (!canCraft) {
                try {
                    craftButton.disabled = true;
                } catch (error) {
                    console.error('Fehler beim Deaktivieren des Craft-Buttons:', error);
                }
                GameUI.addMessage("Du hast nicht genug Materialien, um diesen Gegenstand herzustellen.", 'danger');
                GameUI.addMessage("Tipp: Materialien findest du beim Erkunden von Dungeons oder kannst sie bei Händlern kaufen.", 'info');
            } else {
                GameUI.addMessage("Du hast alle benötigten Materialien! Klicke auf 'Herstellen', um den Gegenstand zu fertigen.", 'success');
            }
        }

        // Zurück-Button
        GameUI.addAction('Zurück', () => {
            this.showCraftingCategory(recipe.category);
        }, 'secondary');
    },

    /**
     * Prüft, ob ein Rezept hergestellt werden kann
     * @param {Object} recipe - Das Rezept
     * @returns {boolean} true, wenn das Rezept hergestellt werden kann
     */
    canCraftRecipe: function(recipe) {
        const player = GameEngine.player;

        // Prüfen, ob der Spieler die benötigten Materialien hat
        for (const material of recipe.materials) {
            const playerMaterial = player.inventory.find(item =>
                item.name === material.name && item.type === 'material');

            if (!playerMaterial || playerMaterial.count < material.count) {
                return false;
            }
        }

        // Prüfen, ob das Inventar voll ist
        if (player.inventory.length >= Config.settings.maxInventorySlots) {
            return false;
        }

        return true;
    },

    /**
     * Stellt einen Gegenstand her
     * @param {Object} recipe - Das Rezept
     */
    craftItem: function(recipe) {
        const player = GameEngine.player;

        // Prüfen, ob das Rezept hergestellt werden kann
        if (!this.canCraftRecipe(recipe)) {
            GameUI.addMessage("Du kannst diesen Gegenstand nicht herstellen!", 'danger');
            return;
        }

        // Materialien verbrauchen
        for (const material of recipe.materials) {
            const materialIndex = player.inventory.findIndex(item =>
                item.name === material.name && item.type === 'material');

            player.removeItem(materialIndex, material.count);
        }

        // Gegenstand erstellen
        const item = new Item(recipe.result.name, recipe.result.type, recipe.result.properties);

        // Gegenstand zum Inventar hinzufügen
        player.addItem(item);

        // Nachricht anzeigen
        GameUI.addMessage(`Du hast erfolgreich ${recipe.name} hergestellt!`, 'success');

        // UI aktualisieren
        GameUI.updateStats();

        // Rezeptdetails erneut anzeigen
        this.showRecipeDetails(recipe);
    },

    /**
     * Gibt alle Crafting-Rezepte einer Kategorie zurück
     * @param {string} category - Die Kategorie
     * @returns {Array} Array mit Rezepten
     */
    getCraftingRecipes: function(category) {
        // Hier würden normalerweise die Rezepte aus einer Datenbank oder Konfiguration geladen
        const recipes = {
            weapon: [
                {
                    name: "Eisenschwert",
                    description: "Ein solides Schwert aus Eisen.",
                    category: "weapon",
                    materials: [
                        { name: "Eisenerz", count: 3 },
                        { name: "Holz", count: 1 }
                    ],
                    result: ItemData.getItem('iron_sword')
                },
                 {
                    name: "Verzauberter Stab",
                    description: "Ein Stab, aufgeladen mit magischer Energie.",
                    category: "weapon",
                    materials: [ { name: "Holz", count: 3 }, { name: "Magischer Kristall", count: 2 } ],
                    result: ItemData.getItem('enchanted_staff')
                },
                {
                    name: "Assassinenklinge",
                    description: "Eine leichte, tödliche Klinge.",
                    category: "weapon",
                    materials: [ { name: "Eisenerz", count: 4 }, { name: "Leder", count: 2 } ],
                    result: ItemData.getItem('assassins_blade')
                }
            ],
            armor: [
                {
                    name: "Lederrüstung",
                    description: "Eine einfache Rüstung aus gehärtetem Leder.",
                    category: "armor",
                    materials: [
                        { name: "Leder", count: 5 }
                    ],
                    result: ItemData.getItem('leather_armor')
                },
                 {
                    name: "Kettenhemd",
                    description: "Ein Hemd aus verbundenen Metallringen.",
                    category: "armor",
                    materials: [ { name: "Eisenerz", count: 5 } ],
                    result: ItemData.getItem('chainmail')
                }
            ],
            potion: [
                {
                    name: "Kleiner Heiltrank",
                    description: "Ein Trank, der einige Lebenspunkte wiederherstellt.",
                    category: "potion",
                    materials: [
                        { name: "Heilkraut", count: 2 }
                    ],
                    result: ItemData.getItem('health_potion_small')
                },
                {
                    name: "Kleiner Manatrank",
                    description: "Stellt eine kleine Menge Mana wieder her.",
                    category: "potion",
                    materials: [ { name: "Heilkraut", count: 1 }, { name: "Magischer Kristall", count: 1 } ],
                    result: ItemData.getItem('mana_potion_small')
                },
                {
                    name: "Stärkeelixier",
                    description: "Erhöht die Stärke temporär.",
                    category: "potion",
                    materials: [ { name: "Heilkraut", count: 3 }, { name: "Eisenerz", count: 1 } ],
                    result: ItemData.getItem('strength_elixir')
                }
            ]
        };

        return recipes[category] || [];
    }
};
