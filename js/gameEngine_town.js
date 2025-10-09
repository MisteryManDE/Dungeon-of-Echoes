/**
 * GameEngine für Dungeon of Echoes - Stadtfunktionen
 * Erweitert das Hauptmodul um Funktionen für die Stadt
 * Version: 2.0.2
 */

// Erweitere das GameEngine-Objekt um Stadtfunktionen
Object.assign(GameEngine, {
    /**
     * Zeigt das Stadtmenü an
     */
    showTownMenu: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();
        
        // Titel anzeigen
        GameUI.addMessage("Stadt Echofels", 'title');
        GameUI.addMessage("Du befindest dich in der Stadt Echofels, einem kleinen Ort am Rande des Königreichs.", 'info');
        
        // Aktionen hinzufügen
        GameUI.addAction('Erkunden', () => {
            this.startExploration();
        }, 'primary');
        
        GameUI.addAction('Händler besuchen', () => {
            this.showMerchantSelection();
        }, 'primary');
        
        GameUI.addAction('Taverne besuchen', () => {
            this.showTavernMenu();
        }, 'primary');
        
        GameUI.addAction('Handwerk', () => {
            InventorySystem.showCraftingMenu();
        }, 'primary');
        
        GameUI.addAction('Ausruhen', () => {
            this.restInTown();
        }, 'secondary');
        
        GameUI.addAction('Hauptmenü', () => {
            this.showMainMenu();
        }, 'secondary');
    },
    
    /**
     * Zeigt die Händlerauswahl an
     */
    showMerchantSelection: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();
        
        // Titel anzeigen
        GameUI.addMessage("Händler", 'title');
        GameUI.addMessage("Welchen Händler möchtest du besuchen?", 'info');
        
        // Händler definieren
        const merchants = [
            {
                id: "general_store",
                name: "Allgemeiner Händler",
                greeting: "Willkommen im 'Zum goldenen Apfel'! Was kann ich für dich tun?",
                inventory: ["health_potion_small", "health_potion_medium", "mana_potion_small", "leather_armor", "iron_sword"]
            },
            {
                id: "blacksmith",
                name: "Schmied",
                greeting: "Ah, ein Kunde! Meine Waffen und Rüstungen sind die besten in der Stadt!",
                inventory: ["iron_sword", "chainmail", "iron_helmet", "iron_gauntlets", "iron_boots"]
            },
            {
                id: "alchemist",
                name: "Alchemist",
                greeting: "Willkommen in meinem bescheidenen Laden. Ich habe Tränke für jeden Bedarf.",
                inventory: ["health_potion_small", "health_potion_medium", "mana_potion_small", "mana_potion_medium", "strength_elixir", "defense_elixir"]
            }
        ];
        
        // Händler anzeigen
        merchants.forEach(merchant => {
            GameUI.addAction(merchant.name, () => {
                this.visitMerchant(merchant);
            }, 'primary');
        });
        
        // Zurück-Button
        GameUI.addAction('Zurück', () => {
            this.showTownMenu();
        }, 'secondary');
    },
    
    /**
     * Besucht einen Händler
     * @param {Object} merchant - Der Händler
     */
    visitMerchant: function(merchant) {
        // Aktuellen Händler speichern
        this.currentMerchant = merchant;
        
        // Händlermenü anzeigen
        InventorySystem.showMerchantMenu(merchant);
    },
    
    /**
     * Zeigt das Tavernenmenü an
     */
    showTavernMenu: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();
        
        // Titel anzeigen
        GameUI.addMessage("Taverne 'Zum Trunkenen Drachen'", 'title');
        GameUI.addMessage("Die Taverne ist voll mit Abenteurern, Händlern und Einheimischen.", 'info');
        GameUI.addMessage("Der Wirt begrüßt dich mit einem freundlichen Nicken.", 'npc');
        
        // Aktionen hinzufügen
        GameUI.addAction('Informationen sammeln', () => {
            this.gatherInformation();
        }, 'primary');
        
        GameUI.addAction('Trinkspiel spielen', () => {
            this.showDrinkingGameMenu();
        }, 'primary');
        
        GameUI.addAction('Essen und Trinken', () => {
            this.eatAndDrink();
        }, 'primary');
        
        // Zurück-Button
        GameUI.addAction('Zurück', () => {
            this.showTownMenu();
        }, 'secondary');
    },
    
    /**
     * Sammelt Informationen in der Taverne
     */
    gatherInformation: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();
        
        // Titel anzeigen
        GameUI.addMessage("Informationen sammeln", 'title');
        
        // Zufällige Informationen auswählen
        const informations = [
            "Du hörst Gerüchte über einen Drachen, der in den Bergen haust.",
            "Ein Händler erzählt von einer verlorenen Stadt im Wald.",
            "Ein alter Mann murmelt etwas über einen verborgenen Schatz in der Goblinhöhle.",
            "Zwei Abenteurer diskutieren über die besten Taktiken gegen Untote.",
            "Ein Barde singt ein Lied über einen legendären Helden, der einen mächtigen Dämon besiegte."
        ];
        
        const randomInfo = Utils.randomChoice(informations);
        GameUI.addMessage(randomInfo, 'info');
        
        // Chance auf neue Quest
        if (Math.random() < 0.3) {
            const availableQuests = QuestSystem.getAvailableQuests();
            if (availableQuests.length > 0) {
                const quest = Utils.randomChoice(availableQuests);
                GameUI.addMessage(`Ein Fremder spricht dich an und erzählt dir von einer Aufgabe: ${quest.name}`, 'quest');
                
                // Quest annehmen
                GameUI.addAction('Quest annehmen', () => {
                    QuestSystem.acceptQuest(quest.id);
                    this.showTavernMenu();
                }, 'primary');
                
                // Ablehnen
                GameUI.addAction('Ablehnen', () => {
                    this.showTavernMenu();
                }, 'secondary');
                
                return;
            }
        }
        
        // Zurück-Button
        GameUI.addAction('Zurück', () => {
            this.showTavernMenu();
        }, 'secondary');
    },
    
    /**
     * Zeigt das Menü für das Trinkspiel an
     */
    showDrinkingGameMenu: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();
        
        // Titel anzeigen
        GameUI.addMessage("Trinkspiel", 'title');
        GameUI.addMessage("Der Wirt zeigt auf einen grimmig dreinblickenden Zwerg in der Ecke.", 'npc');
        GameUI.addMessage("'Wenn du dich traust, kannst du gegen unseren Champion antreten. Aber ich warne dich, er ist ungeschlagen!'", 'npc');
        
        // Spieler-Fortschritt abrufen
        const progress = this.player.tavernGameProgress || { level: 1, wins: 0, highestLevel: 1 };
        
        // Gegner je nach Level
        const opponents = [
            "Kurzbein Bierkrug (Anfänger)",
            "Eisenfaust Malzbart (Fortgeschritten)",
            "Thorin Eichenschluck (Meister)"
        ];
        
        // Verfügbare Gegner anzeigen
        for (let i = 0; i < progress.highestLevel; i++) {
            const level = i + 1;
            GameUI.addAction(`Gegen ${opponents[i]} antreten (Level ${level})`, () => {
                this.startDrinkingGame(level);
            }, 'primary');
        }
        
        // Spielregeln
        GameUI.addAction('Spielregeln', () => {
            this.showDrinkingGameRules();
        }, 'secondary');
        
        // Zurück-Button
        GameUI.addAction('Zurück', () => {
            this.showTavernMenu();
        }, 'secondary');
    },
    
    /**
     * Zeigt die Regeln für das Trinkspiel an
     */
    showDrinkingGameRules: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();
        
        // Titel anzeigen
        GameUI.addMessage("Trinkspiel - Regeln", 'title');
        GameUI.addMessage("Ziel des Spiels ist es, schneller zu trinken als der Zwerg.", 'info');
        GameUI.addMessage("1. Drücke die angezeigten Pfeiltasten (↑ ↓ ← →) im richtigen Rhythmus, um zu trinken.", 'info');
        GameUI.addMessage("2. Drücke die Leertaste für 'Prost!', um den Zwerg kurzzeitig zu verlangsamen.", 'info');
        GameUI.addMessage("3. Dein Fortschritt sinkt mit der Zeit! Trinke schnell genug, um zu gewinnen.", 'info');
        GameUI.addMessage("4. Wer zuerst den Fortschrittsbalken füllt, gewinnt.", 'info');
        GameUI.addMessage("5. Wenn du verlierst, bekommst du einen Kater (temporärer Debuff).", 'info');
        GameUI.addMessage("6. Wenn du gewinnst, erhältst du Gold und möglicherweise einen Trank.", 'info');
        
        // Zurück-Button
        GameUI.addAction('Zurück', () => {
            this.showDrinkingGameMenu();
        }, 'secondary');
    },
    
    /**
     * Startet das Trinkspiel
     * @param {number} level - Die Schwierigkeitsstufe
     */
    startDrinkingGame: function(level) {
        // Spieler-Fortschritt aktualisieren
        if (!this.player.tavernGameProgress) {
            this.player.tavernGameProgress = { level: 1, wins: 0, highestLevel: 1 };
        }
        
        this.player.tavernGameProgress.level = level;
        
        // Trinkspiel starten
        TavernGame.startGame();
    },
    
    /**
     * Essen und Trinken in der Taverne
     */
    eatAndDrink: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();
        
        // Titel anzeigen
        GameUI.addMessage("Essen und Trinken", 'title');
        
        // Menü anzeigen
        const menu = [
            { name: "Einfache Mahlzeit", price: 5, hp: 10 },
            { name: "Herzhafter Eintopf", price: 10, hp: 25 },
            { name: "Festmahl", price: 20, hp: 50 },
            { name: "Bier", price: 3, hp: 5 },
            { name: "Wein", price: 8, hp: 15 },
            { name: "Zwergenmet", price: 15, hp: 30 }
        ];
        
        // Menüpunkte anzeigen
        menu.forEach(item => {
            // Prüfen, ob der Spieler genug Gold hat
            const canAfford = this.player.gold >= item.price;
            
            const button = GameUI.addAction(`${item.name} (${item.price} Gold, +${item.hp} HP)`, () => {
                this.buyFood(item);
            }, canAfford ? 'primary' : 'danger');
            
            if (!canAfford) {
                button.disabled = true;
            }
        });
        
        // Zurück-Button
        GameUI.addAction('Zurück', () => {
            this.showTavernMenu();
        }, 'secondary');
    },
    
    /**
     * Kauft Essen oder Getränke
     * @param {Object} item - Das Essen oder Getränk
     */
    buyFood: function(item) {
        // Prüfen, ob der Spieler genug Gold hat
        if (this.player.gold < item.price) {
            GameUI.addMessage(`Du hast nicht genug Gold für ${item.name}!`, 'danger');
            return;
        }
        
        // Gold abziehen
        this.player.gold -= item.price;
        
        // HP wiederherstellen
        const healAmount = Math.min(item.hp, this.player.maxHp - this.player.hp);
        this.player.hp += healAmount;
        
        // Nachricht anzeigen
        GameUI.addMessage(`Du genießt ${item.name} und stellst ${healAmount} HP wieder her.`, 'success');
        
        // UI aktualisieren
        GameUI.updateStats();
        
        // Zurück zum Menü
        setTimeout(() => {
            this.eatAndDrink();
        }, 1500);
    },
    
    /**
     * Ruht sich in der Stadt aus
     */
    restInTown: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();
        
        // Titel anzeigen
        GameUI.addMessage("Ausruhen", 'title');
        
        // Optionen anzeigen
        const restOptions = [
            { name: "Auf einer Bank schlafen", price: 0, recovery: 0.3 },
            { name: "Einfaches Zimmer in der Taverne", price: 10, recovery: 0.7 },
            { name: "Luxuszimmer in der Taverne", price: 25, recovery: 1.0 }
        ];
        
        // Optionen anzeigen
        restOptions.forEach(option => {
            // Prüfen, ob der Spieler genug Gold hat
            const canAfford = this.player.gold >= option.price;
            
            const button = GameUI.addAction(`${option.name} (${option.price} Gold, ${Math.round(option.recovery * 100)}% Erholung)`, () => {
                this.rest(option);
            }, canAfford ? 'primary' : 'danger');
            
            if (!canAfford) {
                button.disabled = true;
            }
        });
        
        // Zurück-Button
        GameUI.addAction('Zurück', () => {
            this.showTownMenu();
        }, 'secondary');
    },
    
    /**
     * Ruht sich aus
     * @param {Object} option - Die Ausruhoption
     */
    rest: function(option) {
        // Prüfen, ob der Spieler genug Gold hat
        if (this.player.gold < option.price) {
            GameUI.addMessage(`Du hast nicht genug Gold für ${option.name}!`, 'danger');
            return;
        }
        
        // Gold abziehen
        this.player.gold -= option.price;
        
        // HP und Mana wiederherstellen
        const healAmount = Math.round(this.player.maxHp * option.recovery);
        const manaAmount = Math.round(this.player.maxMana * option.recovery);
        
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);
        this.player.mana = Math.min(this.player.maxMana, this.player.mana + manaAmount);
        
        // Statuseffekte reduzieren
        if (this.player.statusEffects.length > 0) {
            // Dauer aller Effekte reduzieren
            this.player.statusEffects.forEach(effect => {
                effect.duration = Math.max(0, effect.duration - 4); // 4 Runden (1 Stunde) abziehen
            });
            
            // Abgelaufene Effekte entfernen
            this.player.statusEffects = this.player.statusEffects.filter(effect => effect.duration > 0);
            
            GameUI.addMessage("Du fühlst dich erfrischt und einige Statuseffekte klingen ab.", 'success');
        }
        
        // Nachricht anzeigen
        GameUI.addMessage(`Du ruhst dich aus und stellst ${healAmount} HP und ${manaAmount} Mana wieder her.`, 'success');
        
        // UI aktualisieren
        GameUI.updateStats();
        
        // Zurück zum Stadtmenü
        setTimeout(() => {
            this.showTownMenu();
        }, 1500);
    },
    
    /**
     * Kehrt zur Stadt zurück
     */
    returnToTown: function() {
        // Aktuellen Dungeon zurücksetzen
        this.currentDungeon = null;
        this.currentDungeonFloor = 1;
        
        // Stadtmenü anzeigen
        this.showTownMenu();
    }
});
