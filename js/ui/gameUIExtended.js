/**
 * GameUI-Modul für Dungeon of Echoes (Erweiterung)
 * Verwaltet die erweiterten UI-Funktionen
 * Version: 2.0.2
 */

// Erweitere das GameUI-Objekt um zusätzliche Funktionen
Object.assign(GameUI, {
    /**
     * Zeigt das Inventar des Spielers an
     * @param {boolean} isMerchantMode - Ob das Inventar im Händlermodus angezeigt wird
     * @param {boolean} skipActions - Ob die Aktionsbuttons übersprungen werden sollen
     */
    showInventory: function(isMerchantMode = false, skipActions = false) {
        const player = GameEngine.player;
        if (!player) return;

        const inventoryContainer = document.getElementById('inventory');
        if (!inventoryContainer) return;

        // Inventar leeren
        inventoryContainer.innerHTML = '';

        // Inventarplätze anzeigen
        for (let i = 0; i < Config.settings.maxInventorySlots; i++) {
            const item = player.inventory[i];
            const itemElement = document.createElement('div');

            if (item) {
                // Item anzeigen
                itemElement.className = `item ${item.type}`;
                itemElement.innerHTML = `
                    <div class="item-icon">${item.icon}</div>
                    <div class="item-name">${item.name}</div>
                `;

                // Anzahl anzeigen, wenn stapelbar
                if (item.stackable && item.count > 1) {
                    const countElement = document.createElement('div');
                    countElement.className = 'item-count';
                    countElement.textContent = item.count;
                    itemElement.appendChild(countElement);
                }

                // Verkaufspreis anzeigen, wenn im Händlermodus
                if (isMerchantMode && typeof item.price === 'number') {
                    try {
                        const sellPrice = Utils.calculateSellPrice(item.price, player.charisma || 0);
                        const priceElement = document.createElement('div');
                        priceElement.className = 'item-price';
                        priceElement.textContent = `${sellPrice} Gold`;
                        itemElement.appendChild(priceElement);
                    } catch (error) {
                        console.error('Fehler beim Berechnen des Verkaufspreises:', error);
                    }
                }

                // Tooltip hinzufügen
                itemElement.addEventListener('mouseover', () => {
                    this.showTooltip(itemElement, Utils.createItemTooltip(item));
                });

                // Kontextmenü hinzufügen
                itemElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showItemContextMenu(i);
                });
            } else {
                // Leeren Platz anzeigen
                itemElement.className = 'item empty';
                itemElement.innerHTML = '<div class="item-icon">-</div>';
            }

            inventoryContainer.appendChild(itemElement);
        }

        // Aktionsbuttons hinzufügen, wenn nicht übersprungen
        if (!skipActions) {
            this.clearActions();

            // Crafting-Button
            this.addAction('Handwerk', () => {
                InventorySystem.showCraftingMenu();
            }, 'primary');

            // Zurück-Button je nach Kontext
            if (GameEngine.currentDungeon) {
                this.addAction('Zurück zum Dungeon', () => {
                    GameEngine.exploreDungeon();
                }, 'secondary');
            } else {
                this.addAction('Zurück zur Stadt', () => {
                    GameEngine.showTownMenu();
                }, 'secondary');
            }
        }
    },

    /**
     * Zeigt das Kontextmenü für ein Item an
     * @param {number} index - Index des Items im Inventar
     */
    showItemContextMenu: function(index) {
        const player = GameEngine.player;
        if (!player || index < 0 || index >= player.inventory.length) return;

        const item = player.inventory[index];

        // Aktionen löschen
        this.clearActions();

        // Iteminformationen anzeigen
        this.addMessage(`<strong>${item.name}</strong>`, 'title');
        this.addMessage(item.getDescription(), 'info');

        // Aktionen basierend auf Itemtyp hinzufügen
        if (item.type === 'weapon' || item.type === 'armor' ||
            item.type === 'helmet' || item.type === 'gloves' ||
            item.type === 'boots' || item.type === 'accessory') {

            // Ausrüsten
            this.addAction('Ausrüsten', () => {
                if (player.equipItem(index)) {
                    this.addMessage(`Du rüstest ${item.name} aus.`, 'success');

                    // Inventar und Ausrüstung aktualisieren (ohne Aktionsbuttons)
                    this.showInventory(false, true);
                    this.showEquipment();

                    // Zurück-Button je nach Kontext hinzufügen
                    if (GameEngine.currentDungeon) {
                        this.addAction('Zurück zum Dungeon', () => {
                            GameEngine.exploreDungeon();
                        }, 'secondary');
                    } else {
                        this.addAction('Zurück zur Stadt', () => {
                            GameEngine.showTownMenu();
                        }, 'secondary');
                    }
                } else {
                    this.addMessage(`Du kannst ${item.name} nicht ausrüsten.`, 'danger');
                }
            }, 'primary');

        } else if (item.type === 'consumable') {
            // Benutzen
            this.addAction('Benutzen', () => {
                if (player.useItem(index)) {
                    this.addMessage(`Du benutzt ${item.name}.`, 'success');

                    // Inventar aktualisieren (ohne Aktionsbuttons)
                    this.showInventory(false, true);

                    // Zurück-Button je nach Kontext hinzufügen
                    if (GameEngine.currentDungeon) {
                        this.addAction('Zurück zum Dungeon', () => {
                            GameEngine.exploreDungeon();
                        }, 'secondary');
                    } else {
                        this.addAction('Zurück zur Stadt', () => {
                            GameEngine.showTownMenu();
                        }, 'secondary');
                    }
                } else {
                    this.addMessage(`Du kannst ${item.name} nicht benutzen.`, 'danger');
                }
            }, 'primary');
        }

        // Wegwerfen
        this.addAction('Wegwerfen', () => {
            // Bestätigung anfordern
            this.clearActions();
            this.addMessage(`Möchtest du ${item.name} wirklich wegwerfen?`, 'danger');

            this.addAction('Ja', () => {
                player.removeItem(index);
                this.addMessage(`Du wirfst ${item.name} weg.`, 'info');
                // Inventar direkt anzeigen ohne Umweg (mit Aktionsbuttons)
                this.showInventory(false, false);
            }, 'danger');

            this.addAction('Nein', () => {
                this.showItemContextMenu(index);
            }, 'secondary');

        }, 'danger');

        // Zurück zum Inventar
        this.addAction('Zurück zum Inventar', () => {
            this.clearMessages();
            this.clearActions();
            this.showInventory();
        }, 'secondary');
    },

    /**
     * Zeigt die Ausrüstung des Spielers an
     */
    showEquipment: function() {
        const player = GameEngine.player;
        if (!player) return;

        const equipmentContainer = document.getElementById('equipment');
        if (!equipmentContainer) return;

        // Ausrüstung leeren
        equipmentContainer.innerHTML = '';

        // Ausrüstungsslots definieren
        const slots = [
            { id: 'weapon', name: 'Waffe' },
            { id: 'armor', name: 'Rüstung' },
            { id: 'helmet', name: 'Helm' },
            { id: 'gloves', name: 'Handschuhe' },
            { id: 'boots', name: 'Stiefel' },
            { id: 'accessory', name: 'Accessoire' }
        ];

        // Ausrüstungsslots anzeigen
        for (const slot of slots) {
            const item = player.equipment[slot.id];
            const itemElement = document.createElement('div');

            if (item) {
                // Item anzeigen
                itemElement.className = `item ${item.type} equipped`;
                itemElement.innerHTML = `
                    <div class="item-icon">${item.icon}</div>
                    <div class="item-name">${item.name}</div>
                `;

                // Tooltip hinzufügen
                itemElement.addEventListener('mouseover', () => {
                    this.showTooltip(itemElement, Utils.createItemTooltip(item));
                });

                // Kontextmenü hinzufügen
                itemElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showEquipmentContextMenu(slot.id);
                });
            } else {
                // Leeren Slot anzeigen
                itemElement.className = 'item empty';
                itemElement.innerHTML = `
                    <div class="item-icon">-</div>
                    <div class="item-name">${slot.name}</div>
                `;
            }

            equipmentContainer.appendChild(itemElement);
        }
    },

    /**
     * Zeigt das Kontextmenü für ein Ausrüstungsteil an
     * @param {string} slotId - ID des Ausrüstungsslots
     */
    showEquipmentContextMenu: function(slotId) {
        const player = GameEngine.player;
        if (!player || !player.equipment[slotId]) return;

        const item = player.equipment[slotId];

        // Aktionen löschen
        this.clearActions();

        // Iteminformationen anzeigen
        this.addMessage(`<strong>${item.name}</strong>`, 'title');
        this.addMessage(item.getDescription(), 'info');

        // Ablegen
        this.addAction('Ablegen', () => {
            if (player.unequipItem(slotId)) {
                this.addMessage(`Du legst ${item.name} ab.`, 'success');
                this.showInventory();
                this.showEquipment();
            } else {
                this.addMessage(`Du kannst ${item.name} nicht ablegen. Dein Inventar ist voll.`, 'danger');
            }
        }, 'primary');

        // Zurück zur Ausrüstung
        this.addAction('Zurück zur Ausrüstung', () => {
            this.clearMessages();
            this.clearActions();
            this.showEquipment();
        }, 'secondary');
    },

    /**
     * Zeigt die Fähigkeiten des Spielers an
     */
    showAbilities: function() {
        const player = GameEngine.player;
        if (!player) return;

        const abilitiesContainer = document.getElementById('abilities');
        if (!abilitiesContainer) return;

        // Fähigkeiten leeren
        abilitiesContainer.innerHTML = '';

        // Ausgerüstete Fähigkeiten anzeigen
        for (let i = 0; i < Config.settings.maxAbilitySlots; i++) {
            const ability = player.equippedAbilities[i];
            const abilityElement = document.createElement('div');

            if (ability) {
                // Fähigkeit anzeigen
                abilityElement.className = 'ability';
                abilityElement.innerHTML = `
                    <div class="ability-icon">${ability.icon || '✨'}</div>
                    <div class="ability-name">${ability.name}</div>
                `;

                // Tooltip hinzufügen
                abilityElement.addEventListener('mouseover', () => {
                    this.showTooltip(abilityElement, Utils.createAbilityTooltip(ability));
                });

                // Kontextmenü hinzufügen
                abilityElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showAbilityContextMenu(i);
                });
            } else {
                // Leeren Slot anzeigen
                abilityElement.className = 'ability empty';
                abilityElement.innerHTML = `
                    <div class="ability-icon">-</div>
                    <div class="ability-name">Slot ${i + 1}</div>
                `;

                // Fähigkeit ausrüsten
                abilityElement.addEventListener('click', () => {
                    this.showAbilitySelectionMenu(i);
                });
            }

            abilitiesContainer.appendChild(abilityElement);
        }
    },

    /**
     * Zeigt das Kontextmenü für eine Fähigkeit an
     * @param {number} index - Index der Fähigkeit
     */
    showAbilityContextMenu: function(index) {
        const player = GameEngine.player;
        if (!player || index < 0 || index >= player.equippedAbilities.length) return;

        const ability = player.equippedAbilities[index];
        if (!ability) return;

        // Aktionen löschen
        this.clearActions();

        // Fähigkeitsinformationen anzeigen
        this.addMessage(`<strong>${ability.name}</strong>`, 'title');
        this.addMessage(ability.description, 'info');

        // Entfernen
        this.addAction('Entfernen', () => {
            player.unequipAbility(index);
            this.addMessage(`Du entfernst ${ability.name}.`, 'success');
            this.showAbilities();
        }, 'danger');

        // Zurück zu den Fähigkeiten
        this.addAction('Zurück zu den Fähigkeiten', () => {
            this.clearMessages();
            this.clearActions();
            this.showAbilities();
        }, 'secondary');
    },

    /**
     * Zeigt das Menü zur Auswahl einer Fähigkeit an
     * @param {number} slotIndex - Index des Fähigkeitsslots
     */
    showAbilitySelectionMenu: function(slotIndex) {
        const player = GameEngine.player;
        if (!player) return;

        // Aktionen löschen
        this.clearActions();

        // Titel anzeigen
        this.addMessage(`<strong>Fähigkeit für Slot ${slotIndex + 1} auswählen</strong>`, 'title');

        // Verfügbare Fähigkeiten anzeigen
        if (player.abilities.length === 0) {
            this.addMessage('Du hast noch keine Fähigkeiten erlernt.', 'info');
        } else {
            player.abilities.forEach((ability, index) => {
                // Prüfen, ob die Fähigkeit bereits ausgerüstet ist
                const isEquipped = player.equippedAbilities.some(a => a && a.name === ability.name);

                if (!isEquipped) {
                    this.addAction(ability.name, () => {
                        player.equipAbility(index, slotIndex);
                        this.addMessage(`Du rüstest ${ability.name} aus.`, 'success');
                        this.showAbilities();
                    }, 'primary');
                }
            });
        }

        // Zurück zu den Fähigkeiten
        this.addAction('Zurück zu den Fähigkeiten', () => {
            this.clearMessages();
            this.clearActions();
            this.showAbilities();
        }, 'secondary');
    }
});
