/**
 * GameEngine für Dungeon of Echoes - Erkundungsfunktionen
 * Erweitert das Hauptmodul um Funktionen für die Erkundung
 * Version: 2.0.2
 */

// Erweitere das GameEngine-Objekt um Erkundungsfunktionen
Object.assign(GameEngine, {
    /**
     * Startet die Erkundung
     */
    startExploration: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();
        
        // Titel anzeigen
        GameUI.addMessage("Erkundung", 'title');
        GameUI.addMessage("Wohin möchtest du gehen?", 'info');
        
        // Dungeons anzeigen
        const availableDungeons = DungeonData.getDungeonsByLevel(this.player.level);
        
        if (availableDungeons.length === 0) {
            GameUI.addMessage("Es gibt keine Dungeons, die für dein Level geeignet sind.", 'danger');
        } else {
            // Dungeons anzeigen
            availableDungeons.forEach(dungeon => {
                // Prüfen, ob der Dungeon bereits entdeckt wurde
                const isDiscovered = this.discoveredLocations.includes(dungeon.key);
                
                GameUI.addAction(`${dungeon.icon} ${dungeon.name} (Level ${dungeon.minLevel}-${dungeon.maxLevel})${isDiscovered ? '' : ' (Neu)'}`, () => {
                    this.enterDungeon(dungeon.key);
                }, isDiscovered ? 'primary' : 'success');
            });
        }
        
        // Zurück-Button
        GameUI.addAction('Zurück zur Stadt', () => {
            this.showTownMenu();
        }, 'secondary');
    },
    
    /**
     * Betritt einen Dungeon
     * @param {string} dungeonKey - Schlüssel des Dungeons
     */
    enterDungeon: function(dungeonKey) {
        // Dungeon abrufen
        const dungeon = DungeonData.getDungeon(dungeonKey);
        if (!dungeon) return;
        
        // Dungeon speichern
        this.currentDungeon = dungeonKey;
        this.currentDungeonFloor = 1;
        
        // Dungeon als entdeckt markieren
        if (!this.discoveredLocations.includes(dungeonKey)) {
            this.discoveredLocations.push(dungeonKey);
            
            // Event auslösen
            EventSystem.emit('locationDiscovered', dungeonKey);
        }
        
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();
        
        // Dungeon-Beschreibung anzeigen
        GameUI.addMessage(`${dungeon.name} - Ebene ${this.currentDungeonFloor}`, 'title');
        GameUI.addMessage(dungeon.description, 'info');
        
        // Erkundung starten
        this.exploreDungeon();
    },
    
    /**
     * Erkundet den aktuellen Dungeon
     */
    exploreDungeon: function() {
        // Prüfen, ob ein Dungeon ausgewählt ist
        if (!this.currentDungeon) return;
        
        // Dungeon abrufen
        const dungeon = DungeonData.getDungeon(this.currentDungeon);
        if (!dungeon) return;
        
        // UI vorbereiten
        GameUI.clearActions();
        
        // Dungeon-Titel anzeigen
        GameUI.addMessage(`${dungeon.name} - Ebene ${this.currentDungeonFloor}`, 'title');
        
        // Zufälliges Ereignis generieren
        const eventType = this.generateDungeonEvent();
        
        // Aktionen basierend auf dem Ereignistyp
        switch (eventType) {
            case 'combat':
                // Kampf
                this.startDungeonCombat();
                break;
                
            case 'treasure':
                // Schatz
                this.findDungeonTreasure();
                break;
                
            case 'trap':
                // Falle
                this.encounterDungeonTrap();
                break;
                
            case 'event':
                // Spezielles Ereignis
                this.specialDungeonEvent();
                break;
                
            case 'empty':
                // Leerer Raum
                this.emptyDungeonRoom();
                break;
        }
    },
    
    /**
     * Generiert ein zufälliges Dungeon-Ereignis
     * @returns {string} Typ des Ereignisses
     */
    generateDungeonEvent: function() {
        // Ereigniswahrscheinlichkeiten
        const eventChances = {
            combat: 0.4,    // 40% Chance auf Kampf
            treasure: 0.2,  // 20% Chance auf Schatz
            trap: 0.1,      // 10% Chance auf Falle
            event: 0.1,     // 10% Chance auf spezielles Ereignis
            empty: 0.2      // 20% Chance auf leeren Raum
        };
        
        // Zufälliges Ereignis auswählen
        const roll = Math.random();
        let cumulativeChance = 0;
        
        for (const eventType in eventChances) {
            cumulativeChance += eventChances[eventType];
            if (roll < cumulativeChance) {
                return eventType;
            }
        }
        
        return 'empty'; // Fallback
    },
    
    /**
     * Startet einen Kampf im Dungeon
     */
    startDungeonCombat: function() {
        // Dungeon abrufen
        const dungeon = DungeonData.getDungeon(this.currentDungeon);
        if (!dungeon) return;
        
        // Anzahl der Gegner bestimmen
        let enemyCount = 1;
        
        // Chance auf zusätzliche Gegner
        if (Math.random() < Config.combat.multiEnemyChance) {
            enemyCount++;
            
            // Chance auf einen dritten Gegner
            if (Math.random() < Config.combat.thirdEnemyChance) {
                enemyCount++;
            }
        }
        
        // Gegner generieren
        const enemies = [];
        for (let i = 0; i < enemyCount; i++) {
            const enemy = DungeonData.generateEnemy(this.currentDungeon, false);
            if (enemy) {
                enemies.push(enemy);
            }
        }
        
        // Kampf starten
        if (enemies.length > 0) {
            CombatSystem.startCombat(enemies);
        } else {
            // Fallback, falls keine Gegner generiert werden konnten
            this.emptyDungeonRoom();
        }
    },
    
    /**
     * Findet einen Schatz im Dungeon
     */
    findDungeonTreasure: function() {
        // Dungeon abrufen
        const dungeon = DungeonData.getDungeon(this.currentDungeon);
        if (!dungeon) return;
        
        // Schatz generieren
        const item = DungeonData.generateLoot(this.currentDungeon);
        
        // Gold generieren
        const goldAmount = Utils.randomInt(
            dungeon.minLevel * 5,
            dungeon.maxLevel * 15
        );
        
        // Nachricht anzeigen
        GameUI.addMessage("Du findest eine Schatztruhe!", 'success');
        GameUI.addMessage(`Du findest ${goldAmount} Gold!`, 'loot');
        
        // Gold hinzufügen
        this.player.gold += goldAmount;
        
        // Item hinzufügen, falls vorhanden
        if (item) {
            if (this.player.addItem(item)) {
                GameUI.addMessage(`Du findest ${item.name}!`, 'loot');
            } else {
                GameUI.addMessage(`Du findest ${item.name}, aber dein Inventar ist voll!`, 'danger');
            }
        }
        
        // UI aktualisieren
        GameUI.updateStats();
        
        // Aktionen anzeigen
        this.showDungeonActions();
    },
    
    /**
     * Begegnet einer Falle im Dungeon
     */
    encounterDungeonTrap: function() {
        // Dungeon abrufen
        const dungeon = DungeonData.getDungeon(this.currentDungeon);
        if (!dungeon) return;
        
        // Fallentypen
        const trapTypes = [
            {
                name: "Fallgrube",
                description: "Du trittst auf eine lose Bodenfliese und fällst in eine Grube!",
                damage: { min: 5, max: 15 },
                avoidable: true,
                avoidStat: "speed",
                avoidDC: 10
            },
            {
                name: "Giftpfeile",
                description: "Plötzlich schießen Giftpfeile aus den Wänden!",
                damage: { min: 8, max: 20 },
                statusEffect: {
                    name: "Vergiftet",
                    duration: 3,
                    effect: "poison",
                    value: 2
                },
                avoidable: true,
                avoidStat: "speed",
                avoidDC: 12
            },
            {
                name: "Flammenwerfer",
                description: "Aus dem Boden schießen plötzlich Flammen!",
                damage: { min: 10, max: 25 },
                statusEffect: {
                    name: "Brennend",
                    duration: 2,
                    effect: "fire",
                    value: 3
                },
                avoidable: true,
                avoidStat: "speed",
                avoidDC: 15
            }
        ];
        
        // Zufällige Falle auswählen
        const trap = Utils.randomChoice(trapTypes);
        
        // Nachricht anzeigen
        GameUI.addMessage(`Falle: ${trap.name}!`, 'danger');
        GameUI.addMessage(trap.description, 'danger');
        
        // Prüfen, ob der Spieler die Falle vermeiden kann
        let avoided = false;
        
        if (trap.avoidable) {
            const avoidCheck = this.player[trap.avoidStat] + Utils.randomInt(1, 10);
            avoided = avoidCheck >= trap.avoidDC;
        }
        
        if (avoided) {
            // Falle vermieden
            GameUI.addMessage("Du schaffst es, der Falle auszuweichen!", 'success');
        } else {
            // Schaden berechnen
            const damage = Utils.randomInt(trap.damage.min, trap.damage.max);
            
            // Schaden anwenden
            this.player.hp = Math.max(1, this.player.hp - damage);
            
            // Nachricht anzeigen
            GameUI.addMessage(`Du erleidest ${damage} Schaden!`, 'danger');
            
            // Statuseffekt anwenden, falls vorhanden
            if (trap.statusEffect) {
                this.player.addStatusEffect({...trap.statusEffect});
                GameUI.addMessage(`Du bist jetzt ${trap.statusEffect.name}!`, 'danger');
            }
            
            // UI aktualisieren
            GameUI.updateStats();
        }
        
        // Aktionen anzeigen
        this.showDungeonActions();
    },
    
    /**
     * Spezielles Ereignis im Dungeon
     */
    specialDungeonEvent: function() {
        // Dungeon abrufen
        const dungeon = DungeonData.getDungeon(this.currentDungeon);
        if (!dungeon) return;
        
        // Ereignis generieren
        const event = DungeonData.generateEvent(this.currentDungeon);
        
        if (event) {
            // Ereignis anzeigen
            GameUI.addMessage(`Ereignis: ${event.name}`, 'info');
            GameUI.addMessage(event.description, 'info');
            
            // Belohnungen anwenden
            if (event.rewards && event.rewards.length > 0) {
                event.rewards.forEach(reward => {
                    switch (reward.type) {
                        case 'gold':
                            this.player.gold += reward.amount;
                            GameUI.addMessage(`Du findest ${reward.amount} Gold!`, 'loot');
                            break;
                            
                        case 'item':
                            if (this.player.addItem(reward.item)) {
                                GameUI.addMessage(`Du findest ${reward.item.name}!`, 'loot');
                            } else {
                                GameUI.addMessage(`Du findest ${reward.item.name}, aber dein Inventar ist voll!`, 'danger');
                            }
                            break;
                            
                        case 'xp':
                            this.player.addExperience(reward.amount);
                            GameUI.addMessage(`Du erhältst ${reward.amount} Erfahrungspunkte!`, 'loot');
                            break;
                            
                        case 'heal':
                            const healAmount = Math.min(reward.amount, this.player.maxHp - this.player.hp);
                            this.player.hp += healAmount;
                            GameUI.addMessage(`Du wirst um ${healAmount} HP geheilt!`, 'success');
                            break;
                            
                        case 'damage':
                            this.player.hp = Math.max(1, this.player.hp - reward.amount);
                            GameUI.addMessage(`Du erleidest ${reward.amount} Schaden!`, 'danger');
                            break;
                            
                        case 'buff':
                            this.player.addStatusEffect({
                                name: reward.buffName,
                                duration: reward.buffDuration,
                                effect: reward.buffEffect,
                                value: reward.buffValue
                            });
                            GameUI.addMessage(`Du erhältst den Effekt ${reward.buffName}!`, 'info');
                            break;
                    }
                });
                
                // UI aktualisieren
                GameUI.updateStats();
            }
        } else {
            // Fallback, falls kein Ereignis generiert werden konnte
            this.emptyDungeonRoom();
        }
        
        // Aktionen anzeigen
        this.showDungeonActions();
    },
    
    /**
     * Leerer Raum im Dungeon
     */
    emptyDungeonRoom: function() {
        // Zufällige Beschreibung auswählen
        const descriptions = [
            "Du betrittst einen leeren Raum. Hier scheint nichts Interessantes zu sein.",
            "Der Raum ist verlassen. Nur Staub und Spinnweben sind zu sehen.",
            "Ein ruhiger Raum ohne besondere Merkmale. Du hörst nur das Echo deiner Schritte.",
            "Dieser Teil des Dungeons scheint unberührt zu sein. Nichts Besonderes zu finden.",
            "Ein leerer Korridor erstreckt sich vor dir. Keine Anzeichen von Gefahr oder Schätzen."
        ];
        
        const description = Utils.randomChoice(descriptions);
        GameUI.addMessage(description, 'info');
        
        // Aktionen anzeigen
        this.showDungeonActions();
    },
    
    /**
     * Zeigt die Aktionen im Dungeon an
     */
    showDungeonActions: function() {
        // Dungeon abrufen
        const dungeon = DungeonData.getDungeon(this.currentDungeon);
        if (!dungeon) return;
        
        // Aktionen hinzufügen
        GameUI.addAction('Weiter erkunden', () => {
            this.exploreDungeon();
        }, 'primary');
        
        // Zur nächsten Ebene, wenn nicht auf der letzten Ebene
        if (this.currentDungeonFloor < dungeon.floors) {
            GameUI.addAction('Zur nächsten Ebene', () => {
                this.nextDungeonFloor();
            }, 'primary');
        } else {
            // Auf der letzten Ebene: Boss-Kampf
            GameUI.addAction('Boss-Raum betreten', () => {
                this.enterBossRoom();
            }, 'danger');
        }
        
        // Dungeon verlassen
        GameUI.addAction('Dungeon verlassen', () => {
            this.leaveDungeon();
        }, 'secondary');
    },
    
    /**
     * Geht zur nächsten Ebene des Dungeons
     */
    nextDungeonFloor: function() {
        // Dungeon abrufen
        const dungeon = DungeonData.getDungeon(this.currentDungeon);
        if (!dungeon) return;
        
        // Ebene erhöhen
        this.currentDungeonFloor++;
        
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();
        
        // Neue Ebene anzeigen
        GameUI.addMessage(`${dungeon.name} - Ebene ${this.currentDungeonFloor}`, 'title');
        GameUI.addMessage(`Du steigst tiefer in den Dungeon hinab und erreichst Ebene ${this.currentDungeonFloor}.`, 'info');
        
        // Erkundung fortsetzen
        this.exploreDungeon();
    },
    
    /**
     * Betritt den Boss-Raum
     */
    enterBossRoom: function() {
        // Dungeon abrufen
        const dungeon = DungeonData.getDungeon(this.currentDungeon);
        if (!dungeon) return;
        
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();
        
        // Boss-Raum anzeigen
        GameUI.addMessage(`${dungeon.name} - Boss-Raum`, 'title');
        GameUI.addMessage("Du betrittst einen großen, imposanten Raum. Die Luft ist schwer und du spürst eine drohende Präsenz.", 'danger');
        
        // Boss generieren
        const boss = DungeonData.generateEnemy(this.currentDungeon, true);
        
        if (boss) {
            // Boss-Kampf starten
            setTimeout(() => {
                CombatSystem.startCombat([boss]);
            }, 1500);
        } else {
            // Fallback, falls kein Boss generiert werden konnte
            GameUI.addMessage("Seltsam, der Raum scheint verlassen zu sein. Vielleicht ist der Boss bereits besiegt worden?", 'info');
            this.showDungeonActions();
        }
    },
    
    /**
     * Verlässt den Dungeon
     */
    leaveDungeon: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();
        
        // Nachricht anzeigen
        GameUI.addMessage("Du verlässt den Dungeon und kehrst zur Stadt zurück.", 'info');
        
        // Dungeon zurücksetzen
        this.currentDungeon = null;
        this.currentDungeonFloor = 1;
        
        // Zurück zur Stadt
        setTimeout(() => {
            this.showTownMenu();
        }, 1500);
    },
    
    /**
     * Setzt die Erkundung fort (nach einem Kampf)
     */
    resumeExploration: function() {
        // Prüfen, ob ein Dungeon aktiv ist
        if (this.currentDungeon) {
            // Dungeon-Aktionen anzeigen
            this.showDungeonActions();
        } else {
            // Zurück zur Stadt
            this.showTownMenu();
        }
    }
});
