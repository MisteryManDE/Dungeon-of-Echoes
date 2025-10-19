
/**
 * Combat-System für Dungeon of Echoes
 * Verwaltet Kampfmechaniken und -abläufe
 * Version: 2.0.2
 */

const CombatSystem = {
    // Aktueller Kampfzustand
    state: {
        inCombat: false,
        enemies: [],
        currentEnemy: null,
        playerTurn: true,
        round: 0,
        escapeAttempts: 0,
        loot: []
    },
    
    /**
     * Initialisiert das Kampfsystem
     */
    init: function() {
        // Event-Listener für Kampfereignisse registrieren
        EventSystem.on('playerStatsUpdated', () => {
            if (this.state.inCombat) {
                this.updateCombatUI();
            }
        });
    },
    
    /**
     * Startet einen Kampf gegen einen oder mehrere Gegner
     * @param {Array} enemies - Array mit Gegnern
     */
    startCombat: function(enemies) {
        // Spieler-Objekt abrufen
        const player = GameEngine.player;
        if (!player) return;
        
        // Kampfzustand zurücksetzen
        this.state.inCombat = true;
        this.state.enemies = enemies;
        this.state.currentEnemy = enemies[0];
        this.state.playerTurn = true;
        this.state.round = 0;
        this.state.escapeAttempts = 0;
        this.state.loot = [];
        
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();
        
        // Kampfbeginn ankündigen
        if (enemies.length === 1) {
            GameUI.addMessage(`Ein${enemies[0].isBoss ? ' mächtiger' : ''} ${enemies[0].name} greift dich an!`, 'danger');
        } else {
            const enemyNames = enemies.map(e => e.name).join(', ');
            GameUI.addMessage(`Eine Gruppe von Gegnern greift dich an: ${enemyNames}`, 'danger');
        }
        
        // Kampf-UI anzeigen
        this.showCombatUI();
        
        // Erste Runde starten
        this.startRound();
    },
    
    /**
     * Startet eine neue Kampfrunde
     */
    startRound: function() {
        this.state.round++;
        
        // Statuseffekte aktualisieren
        GameEngine.player.updateStatusEffects();
        this.state.enemies.forEach(enemy => enemy.updateStatusEffects());
        this.state.enemies.forEach(enemy => enemy.updateCooldowns());
        
        // Spielerzug starten
        this.state.playerTurn = true;
        this.showPlayerActions();
    },
    
    /**
     * Zeigt die Kampf-UI an
     */
    showCombatUI: function() {
        // Kampfbereich erstellen
        const combatArea = document.createElement('div');
        combatArea.id = 'combat-area';
        combatArea.className = 'combat-area';
        
        // Gegner-Container erstellen
        const enemiesContainer = document.createElement('div');
        enemiesContainer.id = 'combat-enemies';
        enemiesContainer.className = 'combat-enemies';
        
        // Gegner anzeigen
        this.state.enemies.forEach((enemy, index) => {
            const enemyContainer = document.createElement('div');
            enemyContainer.className = `enemy-container ${enemy === this.state.currentEnemy ? 'selected' : ''}`;
            enemyContainer.dataset.index = index;
            
            enemyContainer.innerHTML = `
                <div class="enemy-icon">${enemy.icon}</div>
                <div class="enemy-name">${enemy.name}</div>
                <div class="enemy-hp">HP: ${enemy.hp}/${enemy.maxHp}</div>
            `;
            
            // Klick-Handler für Gegnerwechsel
            enemyContainer.addEventListener('click', () => {
                this.selectEnemy(index);
            });
            
            enemiesContainer.appendChild(enemyContainer);
        });
        
        combatArea.appendChild(enemiesContainer);
        
        // Kampfbereich zum Spiellog hinzufügen
        const gameLog = document.getElementById('game-log');
        if (gameLog) {
            // Vorhandenen Kampfbereich entfernen, falls vorhanden
            const existingCombatArea = document.getElementById('combat-area');
            if (existingCombatArea) {
                existingCombatArea.remove();
            }
            
            gameLog.appendChild(combatArea);
        }
    },
    
    /**
     * Aktualisiert die Kampf-UI
     */
    updateCombatUI: function() {
        // Gegner-Container aktualisieren
        const enemiesContainer = document.getElementById('combat-enemies');
        if (!enemiesContainer) return;
        
        // Alle Gegner-Container entfernen
        enemiesContainer.innerHTML = '';
        
        // Gegner anzeigen
        this.state.enemies.forEach((enemy, index) => {
            const enemyContainer = document.createElement('div');
            enemyContainer.className = `enemy-container ${enemy === this.state.currentEnemy ? 'selected' : ''}`;
            enemyContainer.dataset.index = index;
            
            // Statuseffekte anzeigen
            let statusEffectsHTML = '';
            if (enemy.statusEffects.length > 0) {
                statusEffectsHTML = '<div class="enemy-status">';
                enemy.statusEffects.forEach(effect => {
                    statusEffectsHTML += `<span class="${GameUI.getStatusEffectClass(effect.effect)}">${effect.name}</span> `;
                });
                statusEffectsHTML += '</div>';
            }
            
            enemyContainer.innerHTML = `
                <div class="enemy-icon">${enemy.icon}</div>
                <div class="enemy-name">${enemy.name}</div>
                <div class="enemy-hp">HP: ${enemy.hp}/${enemy.maxHp}</div>
                ${statusEffectsHTML}
            `;
            
            // Klick-Handler für Gegnerwechsel
            enemyContainer.addEventListener('click', () => {
                this.selectEnemy(index);
            });
            
            enemiesContainer.appendChild(enemyContainer);
        });
    },
    
    /**
     * Wählt einen Gegner aus
     * @param {number} index - Index des Gegners
     */
    selectEnemy: function(index) {
        if (index < 0 || index >= this.state.enemies.length) return;
        
        this.state.currentEnemy = this.state.enemies[index];
        this.updateCombatUI();
        
        // Aktionen aktualisieren, wenn der Spieler am Zug ist
        if (this.state.playerTurn) {
            this.showPlayerActions();
        }
    },
    
    /**
     * Zeigt die Aktionen des Spielers an
     */
    showPlayerActions: function() {
        GameUI.clearActions();
        
        const player = GameEngine.player;
        
        // Angriffsaktion
        GameUI.addAction('Angreifen', () => {
            this.playerAttack();
        }, 'danger');
        
        // Fähigkeiten anzeigen, wenn vorhanden
        if (player.equippedAbilities && player.equippedAbilities.length > 0) {
            player.equippedAbilities.forEach((ability, index) => {
                if (!ability) return;
                
                // Prüfen, ob genug Mana vorhanden ist
                const disabled = ability.manaCost > player.mana;
                
                const button = GameUI.addAction(`${ability.name} (${ability.manaCost} Mana)`, () => {
                    this.useAbility(index);
                }, 'primary');
                
                if (disabled) {
                    button.disabled = true;
                }
            });
        }
        
        // Item verwenden
        GameUI.addAction('Item verwenden', () => {
            this.showItemSelection();
        }, 'secondary');
        
        // Fluchtversuch
        GameUI.addAction('Fliehen', () => {
            this.tryEscape();
        }, 'secondary');
    },
    
    /**
     * Führt einen Spielerangriff aus
     */
    playerAttack: function() {
        const player = GameEngine.player;
        const enemy = this.state.currentEnemy;
        
        // Aktionen deaktivieren
        GameUI.disableActions();
        
        // Schaden berechnen
        const damage = Utils.calculateDamage(player.strength, enemy.defense);
        
        // Angriffsnachricht anzeigen
        GameUI.addMessage(`Du greifst ${enemy.name} an und verursachst ${damage} Schaden!`, 'success');
        
        // Schaden anwenden
        enemy.hp = Math.max(0, enemy.hp - damage);
        
        // UI aktualisieren
        this.updateCombatUI();
        
        // Prüfen, ob der Gegner besiegt wurde
        if (enemy.hp <= 0) {
            this.defeatEnemy(enemy);
        } else {
            // Gegnerzug starten
            setTimeout(() => {
                this.state.playerTurn = false;
                this.enemyTurn();
            }, 1000);
        }
    },
    
    /**
     * Verwendet eine Fähigkeit
     * @param {number} abilityIndex - Index der Fähigkeit
     */
    useAbility: function(abilityIndex) {
        const player = GameEngine.player;
        const ability = player.equippedAbilities[abilityIndex];
        
        if (!ability) return;
        
        // Prüfen, ob genug Mana vorhanden ist
        if (ability.manaCost > player.mana) {
            GameUI.addMessage(`Du hast nicht genug Mana für ${ability.name}!`, 'danger');
            return;
        }
        
        // Aktionen deaktivieren
        GameUI.disableActions();
        
        // Mana abziehen
        player.mana -= ability.manaCost;
        
        // Schaden berechnen
        let damage = 0;
        if (ability.damage) {
            damage = AbilityData.calculateDamage(ability, player);
        }
        
        // Fähigkeit anwenden
        if (ability.aoe) {
            // Flächenangriff
            GameUI.addMessage(`Du verwendest ${ability.name} und triffst alle Gegner!`, 'success');
            
            this.state.enemies.forEach(enemy => {
                // Schaden anwenden
                if (damage > 0) {
                    enemy.hp = Math.max(0, enemy.hp - damage);
                    GameUI.addMessage(`${enemy.name} erleidet ${damage} Schaden!`, 'success');
                }
                
                // Statuseffekt anwenden
                if (ability.effect) {
                    enemy.addStatusEffect({...ability.effect});
                    GameUI.addMessage(`${enemy.name} ist jetzt ${ability.effect.name}!`, 'info');
                }
            });
        } else {
            // Einzelangriff
            const enemy = this.state.currentEnemy;
            
            GameUI.addMessage(`Du verwendest ${ability.name} gegen ${enemy.name}!`, 'success');
            
            // Schaden anwenden
            if (damage > 0) {
                enemy.hp = Math.max(0, enemy.hp - damage);
                GameUI.addMessage(`${enemy.name} erleidet ${damage} Schaden!`, 'success');
            }
            
            // Statuseffekt anwenden
            if (ability.effect) {
                let finalEffect = {...ability.effect}; // Effekt kopieren, um ihn zu modifizieren
                
                // Talent-Effekte prüfen
                if (player.passiveEffects) {
                    player.passiveEffects.forEach(talentEffect => {
                        // Verbessertes Gift
                        if (ability.name === 'Giftschlag' && talentEffect.description && talentEffect.description.includes('Giftschlag +2 Schaden pro Runde')) {
                            finalEffect.value += 2;
                        }
                        // Eisstachel Betäubung
                        if (ability.name === 'Eisstachel' && talentEffect.description && talentEffect.description.includes('Eisstachel hat 25% Betäubungschance')) {
                             if (Math.random() < 0.25) {
                                enemy.addStatusEffect({ name: "Betäubt", duration: 1, effect: "stun", value: 1 });
                                GameUI.addMessage(`${enemy.name} wird durch den Eisstachel betäubt!`, 'info');
                             }
                        }
                    });
                }
                
                if (ability.type === "buff") {
                    // Buff für den Spieler
                    player.addStatusEffect(finalEffect);
                    GameUI.addMessage(`Du bist jetzt ${finalEffect.name}!`, 'info');
                } else {
                    // Debuff für den Gegner
                    enemy.addStatusEffect(finalEffect);
                    GameUI.addMessage(`${enemy.name} ist jetzt ${finalEffect.name}!`, 'info');
                }
            }
        }
        
        // UI aktualisieren
        GameUI.updateStats();
        this.updateCombatUI();
        
        // Prüfen, ob Gegner besiegt wurden
        const defeatedEnemies = this.state.enemies.filter(enemy => enemy.hp <= 0);
        if (defeatedEnemies.length > 0) {
            // Gegner nacheinander besiegen
            this.defeatMultipleEnemies(defeatedEnemies);
        } else {
            // Gegnerzug starten
            setTimeout(() => {
                this.state.playerTurn = false;
                this.enemyTurn();
            }, 1000);
        }
    },
    
    /**
     * Zeigt die Itemauswahl an
     */
    showItemSelection: function() {
        const player = GameEngine.player;
        
        // Aktionen löschen
        GameUI.clearActions();
        
        // Titel anzeigen
        GameUI.addMessage("Wähle ein Item zum Verwenden:", 'info');
        
        // Verwendbare Items anzeigen
        let hasUsableItems = false;
        
        player.inventory.forEach((item, index) => {
            if (item.type === 'consumable') {
                hasUsableItems = true;
                
                GameUI.addAction(`${item.name} ${item.stackable && item.count > 1 ? `(${item.count})` : ''}`, () => {
                    this.useItem(index);
                }, 'primary');
            }
        });
        
        if (!hasUsableItems) {
            GameUI.addMessage("Du hast keine verwendbaren Items!", 'danger');
        }
        
        // Zurück-Button
        GameUI.addAction('Zurück', () => {
            this.showPlayerActions();
        }, 'secondary');
    },
    
    /**
     * Verwendet ein Item
     * @param {number} itemIndex - Index des Items im Inventar
     */
    useItem: function(itemIndex) {
        const player = GameEngine.player;
        const item = player.inventory[itemIndex];
        
        if (!item || item.type !== 'consumable') return;
        
        // Item verwenden
        if (player.useItem(itemIndex)) {
            GameUI.addMessage(`Du verwendest ${item.name}!`, 'success');
            
            // Effekt anzeigen
            switch (item.effect) {
                case 'restoreHp':
                    GameUI.addMessage(`Du heilst ${Math.min(item.value, player.maxHp - player.hp)} HP!`, 'success');
                    break;
                    
                case 'restoreMana':
                    GameUI.addMessage(`Du stellst ${Math.min(item.value, player.maxMana - player.mana)} Mana wieder her!`, 'success');
                    break;
                    
                case 'buff':
                    GameUI.addMessage(`Du erhältst den Effekt ${item.buffName}!`, 'info');
                    break;
            }
            
            // UI aktualisieren
            GameUI.updateStats();
            
            // Gegnerzug starten
            setTimeout(() => {
                this.state.playerTurn = false;
                this.enemyTurn();
            }, 1000);
        } else {
            GameUI.addMessage(`Du kannst ${item.name} nicht verwenden!`, 'danger');
            this.showItemSelection();
        }
    },
    
    /**
     * Versucht zu fliehen
     */
    tryEscape: function() {
        const player = GameEngine.player;
        
        // Fluchtchance berechnen
        const baseChance = Utils.calculateEscapeChance(player.speed, this.state.currentEnemy.level);
        
        // Fluchtchance erhöht sich mit jedem Versuch
        const escapeChance = Math.min(0.9, baseChance + (this.state.escapeAttempts * 0.1));
        
        // Fluchtversuch zählen
        this.state.escapeAttempts++;
        
        // Aktionen deaktivieren
        GameUI.disableActions();
        
        // Fluchtversuch
        if (Math.random() < escapeChance) {
            // Erfolgreiche Flucht
            GameUI.addMessage("Du konntest erfolgreich fliehen!", 'success');
            
            // Kampf beenden
            setTimeout(() => {
                this.endCombat(false);
            }, 1000);
        } else {
            // Fehlgeschlagene Flucht
            GameUI.addMessage("Dein Fluchtversuch ist fehlgeschlagen!", 'danger');
            
            // Gegnerzug starten
            setTimeout(() => {
                this.state.playerTurn = false;
                this.enemyTurn();
            }, 1000);
        }
    },
    
    /**
     * Führt den Gegnerzug aus
     */
    enemyTurn: function() {
        // Alle Gegner angreifen lassen
        const attackPromises = this.state.enemies.map(enemy => {
            return new Promise(resolve => {
                setTimeout(() => {
                    this.enemyAttack(enemy);
                    resolve();
                }, 500);
            });
        });
        
        // Wenn alle Gegner angegriffen haben, nächste Runde starten
        Promise.all(attackPromises).then(() => {
            // Prüfen, ob der Spieler noch lebt
            if (GameEngine.player.hp <= 0) {
                this.playerDefeated();
            } else {
                // Nächste Runde starten
                setTimeout(() => {
                    this.startRound();
                }, 1000);
            }
        });
    },
    
    /**
     * Führt einen Gegnerangriff aus
     * @param {Enemy} enemy - Der angreifende Gegner
     */
    enemyAttack: function(enemy) {
        const player = GameEngine.player;
        
        // Prüfen, ob der Gegner betäubt ist
        if (enemy.hasStatusEffect("Betäubt") || enemy.hasStatusEffect("Versteinert")) {
            GameUI.addMessage(`${enemy.name} ist betäubt und kann nicht angreifen!`, 'info');
            return;
        }
        
        // Angriff auswählen
        const attack = enemy.attack();
        
        // Ausweichen prüfen
        const dodgeChance = Utils.calculateDodgeChance(player.speed, player);
        if (Math.random() < dodgeChance) {
            GameUI.addMessage(`${enemy.name} greift mit ${attack.name} an, aber du weichst aus!`, 'success');
            return;
        }
        
        // Effektive Attribute des Gegners abrufen
        const effectiveStats = enemy.getEffectiveStats();
        
        // Schaden berechnen
        let damage = attack.damage;
        if (attack.type === "physical") {
            damage = Utils.calculateDamage(effectiveStats.strength, player.defense);
        } else if (attack.type === "magic" || attack.type === "fire" || attack.type === "ice" || attack.type === "poison") {
            damage = Utils.calculateDamage(enemy.magic, player.magic);
        }
        
        // Angriffsnachricht anzeigen
        GameUI.addMessage(`${enemy.name} greift mit ${attack.name} an und verursacht ${damage} Schaden!`, 'danger');
        
        // Schaden anwenden
        player.hp = Math.max(0, player.hp - damage);
        
        // Statuseffekt anwenden
        if (attack.effect && typeof attack.effect !== 'string') {
            player.addStatusEffect({...attack.effect});
            GameUI.addMessage(`Du bist jetzt ${attack.effect.name}!`, 'danger');
        } else if (attack.effect === "leechLife") {
            // Lebensraub
            const healAmount = Math.floor(damage / 2);
            enemy.hp = Math.min(enemy.maxHp, enemy.hp + healAmount);
            GameUI.addMessage(`${enemy.name} stiehlt ${healAmount} Lebenspunkte!`, 'danger');
        } else if (attack.effect === "summonMinion") {
            // Helfer beschwören
            if (this.state.enemies.length < Config.combat.maxEnemies) {
                const minion = EnemyData.createEnemy("goblin");
                minion.level = Math.max(1, enemy.level - 2);
                this.state.enemies.push(minion);
                GameUI.addMessage(`${enemy.name} ruft einen Helfer herbei!`, 'danger');
                this.updateCombatUI();
            }
        }
        
        // UI aktualisieren
        GameUI.updateStats();
    },
    
    /**
     * Besiegt einen Gegner
     * @param {Enemy} enemy - Der besiegte Gegner
     */
    defeatEnemy: function(enemy) {
        // Nachricht anzeigen
        if (enemy.isBoss) {
            GameUI.addMessage(`Du hast ${enemy.name} besiegt! Ein mächtiger Gegner wurde bezwungen!`, 'success');
        } else {
            GameUI.addMessage(`Du hast ${enemy.name} besiegt!`, 'success');
        }
        
        // Beute generieren
        const loot = enemy.generateLoot();
        if (loot.length > 0) {
            this.state.loot = this.state.loot.concat(loot);
        }
        
        // Erfahrung und Gold
        const xpReward = Utils.calculateExperience(enemy.level, GameEngine.player.level);
        const goldReward = Utils.calculateGoldReward(enemy.level);
        
        GameEngine.player.addExperience(xpReward);
        GameEngine.player.gold += goldReward;
        
        GameUI.addMessage(`Du erhältst ${xpReward} Erfahrungspunkte und ${goldReward} Gold!`, 'loot');
        
        // Gegner aus der Liste entfernen
        this.state.enemies = this.state.enemies.filter(e => e !== enemy);
        
        // Nächsten Gegner auswählen, falls vorhanden
        if (this.state.enemies.length > 0) {
            this.state.currentEnemy = this.state.enemies[0];
            this.updateCombatUI();
            
            // Kampf fortsetzen
            if (this.state.playerTurn) {
                this.showPlayerActions();
            } else {
                setTimeout(() => {
                    this.enemyTurn();
                }, 1000);
            }
        } else {
            // Alle Gegner besiegt
            setTimeout(() => {
                this.endCombat(true);
            }, 1000);
        }
    },
    
    /**
     * Besiegt mehrere Gegner nacheinander
     * @param {Array} enemies - Array mit besiegten Gegnern
     */
    defeatMultipleEnemies: function(enemies) {
        // Ersten Gegner besiegen
        const enemy = enemies[0];
        this.defeatEnemy(enemy);
        
        // Restliche Gegner nacheinander besiegen
        if (enemies.length > 1 && this.state.enemies.length > 0) {
            setTimeout(() => {
                const remainingEnemies = enemies.slice(1).filter(e => this.state.enemies.includes(e));
                if (remainingEnemies.length > 0) {
                    this.defeatMultipleEnemies(remainingEnemies);
                }
            }, 1000);
        }
    },
    
    /**
     * Behandelt die Niederlage des Spielers
     */
    playerDefeated: function() {
        GameUI.addMessage("Du wurdest besiegt!", 'danger');
        
        // Kampf beenden
        setTimeout(() => {
            this.endCombat(false);
            
            // Spieler wiederbeleben
            GameEngine.player.hp = Math.max(1, Math.floor(GameEngine.player.maxHp * 0.1));
            GameUI.updateStats();
            
            // Zurück zur Stadt
            GameUI.addMessage("Du wachst in der Stadt auf. Zum Glück konntest du entkommen, aber du hast etwas Gold verloren.", 'info');
            
            // Gold verlieren
            const goldLoss = Math.floor(GameEngine.player.gold * 0.1);
            if (goldLoss > 0) {
                GameEngine.player.gold -= goldLoss;
                GameUI.addMessage(`Du hast ${goldLoss} Gold verloren!`, 'danger');
                GameUI.updateStats();
            }
            
            // Zurück zur Stadt
            GameUI.addAction('Weiter', () => {
                GameEngine.returnToTown();
            }, 'primary');
        }, 1000);
    },
    
    /**
     * Beendet den Kampf
     * @param {boolean} victory - Gibt an, ob der Kampf gewonnen wurde
     */
    endCombat: function(victory) {
        // Kampfzustand zurücksetzen
        this.state.inCombat = false;
        
        // Kampf-UI entfernen
        const combatArea = document.getElementById('combat-area');
        if (combatArea) {
            combatArea.remove();
        }
        
        // Aktionen löschen
        GameUI.clearActions();
        
        if (victory) {
            // Kampf gewonnen
            GameUI.addMessage("Du hast den Kampf gewonnen!", 'success');
            
            // Beute anzeigen
            if (this.state.loot.length > 0) {
                GameUI.addMessage("Du hast folgende Beute gefunden:", 'loot');
                
                this.state.loot.forEach(item => {
                    // Item zum Inventar hinzufügen
                    if (GameEngine.player.addItem(item)) {
                        GameUI.addMessage(`- ${item.name}${item.stackable && item.count > 1 ? ` (${item.count})` : ''}`, 'loot');
                    } else {
                        GameUI.addMessage(`- ${item.name} (Inventar voll)`, 'danger');
                    }
                });
            }
            
            // Weitergehen
            GameUI.addAction('Weitergehen', () => {
                GameEngine.resumeExploration();
            }, 'primary');
        } else {
            // Kampf verloren oder geflohen
            if (GameEngine.player.hp <= 0) {
                // Spieler wurde besiegt
                // (Wird in playerDefeated behandelt)
            } else {
                // Spieler ist geflohen
                GameUI.addMessage("Du bist dem Kampf entkommen!", 'info');
                
                // Weitergehen
                GameUI.addAction('Weitergehen', () => {
                    GameEngine.resumeExploration();
                }, 'primary');
            }
        }
    }
};
