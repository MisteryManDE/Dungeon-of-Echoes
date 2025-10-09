/**
 * Quest-System für Dungeon of Echoes
 * Verwaltet Quests und deren Fortschritt
 * Version: 2.0.2
 */

const QuestSystem = {
    // Aktive Quests
    activeQuests: [],
    
    // Tägliche Quests
    dailyQuests: [],
    
    // Zeitpunkt der letzten Aktualisierung der täglichen Quests
    lastDailyQuestUpdate: 0,
    
    /**
     * Initialisiert das Quest-System
     */
    init: function() {
        // Aktive Quests aus dem Spielstand laden
        this.loadActiveQuests();
        
        // Tägliche Quests aktualisieren
        this.updateDailyQuests();
        
        // Event-Listener für Quest-Ereignisse registrieren
        EventSystem.on('enemyDefeated', (enemy) => this.updateKillObjectives(enemy));
        EventSystem.on('itemCollected', (item) => this.updateCollectObjectives(item));
        EventSystem.on('locationDiscovered', (location) => this.updateExploreObjectives(location));
        EventSystem.on('npcTalked', (npc) => this.updateTalkObjectives(npc));
    },
    
    /**
     * Lädt aktive Quests aus dem Spielstand
     */
    loadActiveQuests: function() {
        const player = GameEngine.player;
        if (!player) return;
        
        // Aktive Quests zurücksetzen
        this.activeQuests = [];
        
        // Aktive Quests aus dem Spielstand laden
        if (player.activeQuests) {
            player.activeQuests.forEach(questData => {
                const quest = QuestData.getQuest(questData.id);
                if (quest) {
                    // Quest-Fortschritt wiederherstellen
                    const activeQuest = { ...quest };
                    activeQuest.objectives = activeQuest.objectives.map((objective, index) => {
                        return {
                            ...objective,
                            progress: questData.objectiveProgress[index] || 0,
                            completed: questData.objectiveCompleted[index] || false
                        };
                    });
                    
                    this.activeQuests.push(activeQuest);
                }
            });
        }
    },
    
    /**
     * Speichert aktive Quests im Spielstand
     */
    saveActiveQuests: function() {
        const player = GameEngine.player;
        if (!player) return;
        
        // Aktive Quests im Spielstand speichern
        player.activeQuests = this.activeQuests.map(quest => {
            return {
                id: quest.id,
                objectiveProgress: quest.objectives.map(objective => objective.progress || 0),
                objectiveCompleted: quest.objectives.map(objective => objective.completed || false)
            };
        });
    },
    
    /**
     * Aktualisiert die täglichen Quests
     */
    updateDailyQuests: function() {
        // Prüfen, ob die täglichen Quests aktualisiert werden müssen
        const now = Date.now();
        const oneDayInMs = 24 * 60 * 60 * 1000;
        
        if (now - this.lastDailyQuestUpdate >= oneDayInMs) {
            // Tägliche Quests zurücksetzen
            this.dailyQuests = [];
            
            // Neue tägliche Quests generieren
            const player = GameEngine.player;
            if (player) {
                // 3 zufällige tägliche Quests generieren
                for (let i = 0; i < 3; i++) {
                    const questTemplate = QuestData.getRandomDailyQuest(player.level);
                    if (questTemplate) {
                        const quest = QuestData.generateRandomQuest(questTemplate, player.level);
                        this.dailyQuests.push(quest);
                    }
                }
            }
            
            // Zeitpunkt der letzten Aktualisierung speichern
            this.lastDailyQuestUpdate = now;
        }
    },
    
    /**
     * Zeigt das Quest-Menü an
     */
    showQuestMenu: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();
        
        // Titel anzeigen
        GameUI.addMessage("Quests", 'title');
        
        // Aktive Quests anzeigen
        if (this.activeQuests.length === 0) {
            GameUI.addMessage("Du hast keine aktiven Quests.", 'info');
        } else {
            GameUI.addMessage("Aktive Quests:", 'info');
            
            this.activeQuests.forEach((quest, index) => {
                // Quest-Fortschritt berechnen
                const completedObjectives = quest.objectives.filter(objective => objective.completed).length;
                const totalObjectives = quest.objectives.length;
                const progress = Math.floor((completedObjectives / totalObjectives) * 100);
                
                GameUI.addAction(`${quest.name} (${progress}%)`, () => {
                    this.showQuestDetails(index);
                }, quest.type === 'main' ? 'primary' : 'secondary');
            });
        }
        
        // Tägliche Quests anzeigen
        if (this.dailyQuests.length > 0) {
            GameUI.addMessage("Tägliche Quests:", 'info');
            
            this.dailyQuests.forEach((quest, index) => {
                // Prüfen, ob die Quest bereits aktiv ist
                const isActive = this.activeQuests.some(q => q.id === quest.id);
                
                if (!isActive) {
                    GameUI.addAction(quest.name, () => {
                        this.showDailyQuestDetails(index);
                    }, 'secondary');
                }
            });
        }
        
        // Verfügbare Quests anzeigen
        const availableQuests = this.getAvailableQuests();
        
        if (availableQuests.length > 0) {
            GameUI.addMessage("Verfügbare Quests:", 'info');
            
            availableQuests.forEach((quest, index) => {
                GameUI.addAction(quest.name, () => {
                    this.showAvailableQuestDetails(index);
                }, quest.type === 'main' ? 'primary' : 'secondary');
            });
        }
        
        // Zurück-Button
        GameUI.addAction('Zurück', () => {
            GameEngine.showMainMenu();
        }, 'secondary');
    },
    
    /**
     * Zeigt die Details einer aktiven Quest an
     * @param {number} index - Index der Quest
     */
    showQuestDetails: function(index) {
        if (index < 0 || index >= this.activeQuests.length) return;
        
        const quest = this.activeQuests[index];
        
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();
        
        // Titel anzeigen
        GameUI.addMessage(`Quest: ${quest.name}`, 'title');
        GameUI.addMessage(quest.description, 'info');
        
        // Ziele anzeigen
        GameUI.addMessage("Ziele:", 'info');
        
        quest.objectives.forEach(objective => {
            let objectiveText = objective.description;
            
            // Fortschritt anzeigen
            if (objective.type === 'kill' || objective.type === 'collect') {
                objectiveText += ` (${objective.progress || 0}/${objective.count})`;
            }
            
            GameUI.addMessage(`- ${objectiveText}`, objective.completed ? 'success' : 'info');
        });
        
        // Belohnungen anzeigen
        GameUI.addMessage("Belohnungen:", 'info');
        
        quest.rewards.forEach(reward => {
            let rewardText;
            
            switch (reward.type) {
                case 'gold':
                    rewardText = `${reward.amount} Gold`;
                    break;
                    
                case 'xp':
                    rewardText = `${reward.amount} Erfahrungspunkte`;
                    break;
                    
                case 'item':
                    const item = ItemData.getItem(reward.itemKey);
                    rewardText = item ? item.name : reward.itemKey;
                    break;
                    
                default:
                    rewardText = reward.type;
            }
            
            GameUI.addMessage(`- ${rewardText}`, 'loot');
        });
        
        // Quest abbrechen
        if (quest.type !== 'main') {
            GameUI.addAction('Quest abbrechen', () => {
                this.abandonQuest(index);
            }, 'danger');
        }
        
        // Zurück-Button
        GameUI.addAction('Zurück', () => {
            this.showQuestMenu();
        }, 'secondary');
    },
    
    /**
     * Zeigt die Details einer täglichen Quest an
     * @param {number} index - Index der Quest
     */
    showDailyQuestDetails: function(index) {
        if (index < 0 || index >= this.dailyQuests.length) return;
        
        const quest = this.dailyQuests[index];
        
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();
        
        // Titel anzeigen
        GameUI.addMessage(`Tägliche Quest: ${quest.name}`, 'title');
        GameUI.addMessage(quest.description, 'info');
        
        // Ziele anzeigen
        GameUI.addMessage("Ziele:", 'info');
        
        quest.objectives.forEach(objective => {
            GameUI.addMessage(`- ${objective.description}`, 'info');
        });
        
        // Belohnungen anzeigen
        GameUI.addMessage("Belohnungen:", 'info');
        
        quest.rewards.forEach(reward => {
            let rewardText;
            
            switch (reward.type) {
                case 'gold':
                    rewardText = `${reward.amount} Gold`;
                    break;
                    
                case 'xp':
                    rewardText = `${reward.amount} Erfahrungspunkte`;
                    break;
                    
                case 'item':
                    const item = ItemData.getItem(reward.itemKey);
                    rewardText = item ? item.name : reward.itemKey;
                    break;
                    
                default:
                    rewardText = reward.type;
            }
            
            GameUI.addMessage(`- ${rewardText}`, 'loot');
        });
        
        // Quest annehmen
        GameUI.addAction('Quest annehmen', () => {
            this.acceptDailyQuest(index);
        }, 'primary');
        
        // Zurück-Button
        GameUI.addAction('Zurück', () => {
            this.showQuestMenu();
        }, 'secondary');
    },
    
    /**
     * Zeigt die Details einer verfügbaren Quest an
     * @param {number} index - Index der Quest
     */
    showAvailableQuestDetails: function(index) {
        const availableQuests = this.getAvailableQuests();
        
        if (index < 0 || index >= availableQuests.length) return;
        
        const quest = availableQuests[index];
        
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();
        
        // Titel anzeigen
        GameUI.addMessage(`Quest: ${quest.name}`, 'title');
        GameUI.addMessage(quest.description, 'info');
        
        // Ziele anzeigen
        GameUI.addMessage("Ziele:", 'info');
        
        quest.objectives.forEach(objective => {
            GameUI.addMessage(`- ${objective.description}`, 'info');
        });
        
        // Belohnungen anzeigen
        GameUI.addMessage("Belohnungen:", 'info');
        
        quest.rewards.forEach(reward => {
            let rewardText;
            
            switch (reward.type) {
                case 'gold':
                    rewardText = `${reward.amount} Gold`;
                    break;
                    
                case 'xp':
                    rewardText = `${reward.amount} Erfahrungspunkte`;
                    break;
                    
                case 'item':
                    const item = ItemData.getItem(reward.itemKey);
                    rewardText = item ? item.name : reward.itemKey;
                    break;
                    
                default:
                    rewardText = reward.type;
            }
            
            GameUI.addMessage(`- ${rewardText}`, 'loot');
        });
        
        // Quest annehmen
        GameUI.addAction('Quest annehmen', () => {
            this.acceptQuest(quest.id);
        }, 'primary');
        
        // Zurück-Button
        GameUI.addAction('Zurück', () => {
            this.showQuestMenu();
        }, 'secondary');
    },
    
    /**
     * Nimmt eine Quest an
     * @param {string} questId - ID der Quest
     */
    acceptQuest: function(questId) {
        const quest = QuestData.getQuest(questId);
        if (!quest) return;
        
        // Prüfen, ob die Quest bereits aktiv ist
        if (this.activeQuests.some(q => q.id === questId)) {
            GameUI.addMessage(`Du hast die Quest "${quest.name}" bereits angenommen.`, 'danger');
            return;
        }
        
        // Quest aktivieren
        const activeQuest = { ...quest };
        
        // Ziele initialisieren
        activeQuest.objectives = activeQuest.objectives.map(objective => {
            return {
                ...objective,
                progress: 0,
                completed: false
            };
        });
        
        this.activeQuests.push(activeQuest);
        
        // Quest im Spielstand speichern
        this.saveActiveQuests();
        
        // Nachricht anzeigen
        GameUI.addMessage(`Du hast die Quest "${quest.name}" angenommen!`, 'quest');
        
        // Quest-Menü erneut anzeigen
        this.showQuestMenu();
    },
    
    /**
     * Nimmt eine tägliche Quest an
     * @param {number} index - Index der Quest
     */
    acceptDailyQuest: function(index) {
        if (index < 0 || index >= this.dailyQuests.length) return;
        
        const quest = this.dailyQuests[index];
        
        // Prüfen, ob die Quest bereits aktiv ist
        if (this.activeQuests.some(q => q.id === quest.id)) {
            GameUI.addMessage(`Du hast die Quest "${quest.name}" bereits angenommen.`, 'danger');
            return;
        }
        
        // Quest aktivieren
        const activeQuest = { ...quest };
        
        // Ziele initialisieren
        activeQuest.objectives = activeQuest.objectives.map(objective => {
            return {
                ...objective,
                progress: 0,
                completed: false
            };
        });
        
        this.activeQuests.push(activeQuest);
        
        // Quest im Spielstand speichern
        this.saveActiveQuests();
        
        // Nachricht anzeigen
        GameUI.addMessage(`Du hast die tägliche Quest "${quest.name}" angenommen!`, 'quest');
        
        // Quest-Menü erneut anzeigen
        this.showQuestMenu();
    },
    
    /**
     * Bricht eine Quest ab
     * @param {number} index - Index der Quest
     */
    abandonQuest: function(index) {
        if (index < 0 || index >= this.activeQuests.length) return;
        
        const quest = this.activeQuests[index];
        
        // Hauptquests können nicht abgebrochen werden
        if (quest.type === 'main') {
            GameUI.addMessage("Hauptquests können nicht abgebrochen werden!", 'danger');
            return;
        }
        
        // Bestätigung anfordern
        GameUI.clearActions();
        GameUI.addMessage(`Möchtest du die Quest "${quest.name}" wirklich abbrechen?`, 'danger');
        
        GameUI.addAction('Ja', () => {
            // Quest entfernen
            this.activeQuests.splice(index, 1);
            
            // Quest im Spielstand speichern
            this.saveActiveQuests();
            
            // Nachricht anzeigen
            GameUI.addMessage(`Du hast die Quest "${quest.name}" abgebrochen.`, 'info');
            
            // Quest-Menü erneut anzeigen
            this.showQuestMenu();
        }, 'danger');
        
        GameUI.addAction('Nein', () => {
            // Quest-Details erneut anzeigen
            this.showQuestDetails(index);
        }, 'secondary');
    },
    
    /**
     * Aktualisiert die Tötungsziele
     * @param {Enemy} enemy - Der besiegte Gegner
     */
    updateKillObjectives: function(enemy) {
        let questsUpdated = false;
        
        // Alle aktiven Quests durchgehen
        this.activeQuests.forEach(quest => {
            // Alle Ziele durchgehen
            quest.objectives.forEach(objective => {
                // Nur Tötungsziele aktualisieren
                if (objective.type === 'kill' && !objective.completed) {
                    // Prüfen, ob der Gegner dem Ziel entspricht
                    if (objective.target === enemy.type) {
                        // Fortschritt erhöhen
                        objective.progress = (objective.progress || 0) + 1;
                        
                        // Prüfen, ob das Ziel erreicht wurde
                        if (objective.progress >= objective.count) {
                            objective.completed = true;
                            GameUI.addMessage(`Quest-Ziel erreicht: ${objective.description}`, 'quest');
                        } else {
                            GameUI.addMessage(`Quest-Fortschritt: ${objective.progress}/${objective.count} ${enemy.name} getötet`, 'info');
                        }
                        
                        questsUpdated = true;
                    }
                }
            });
            
            // Prüfen, ob die Quest abgeschlossen ist
            this.checkQuestCompletion(quest);
        });
        
        // Quests speichern, wenn Änderungen vorgenommen wurden
        if (questsUpdated) {
            this.saveActiveQuests();
        }
    },
    
    /**
     * Aktualisiert die Sammelziele
     * @param {Item} item - Der gesammelte Gegenstand
     */
    updateCollectObjectives: function(item) {
        let questsUpdated = false;
        
        // Alle aktiven Quests durchgehen
        this.activeQuests.forEach(quest => {
            // Alle Ziele durchgehen
            quest.objectives.forEach(objective => {
                // Nur Sammelziele aktualisieren
                if (objective.type === 'collect' && !objective.completed) {
                    // Prüfen, ob der Gegenstand dem Ziel entspricht
                    if (objective.target === item.type) {
                        // Fortschritt erhöhen
                        objective.progress = (objective.progress || 0) + 1;
                        
                        // Prüfen, ob das Ziel erreicht wurde
                        if (objective.progress >= objective.count) {
                            objective.completed = true;
                            GameUI.addMessage(`Quest-Ziel erreicht: ${objective.description}`, 'quest');
                        } else {
                            GameUI.addMessage(`Quest-Fortschritt: ${objective.progress}/${objective.count} ${item.name} gesammelt`, 'info');
                        }
                        
                        questsUpdated = true;
                    }
                }
            });
            
            // Prüfen, ob die Quest abgeschlossen ist
            this.checkQuestCompletion(quest);
        });
        
        // Quests speichern, wenn Änderungen vorgenommen wurden
        if (questsUpdated) {
            this.saveActiveQuests();
        }
    },
    
    /**
     * Aktualisiert die Erkundungsziele
     * @param {string} location - Der erkundete Ort
     */
    updateExploreObjectives: function(location) {
        let questsUpdated = false;
        
        // Alle aktiven Quests durchgehen
        this.activeQuests.forEach(quest => {
            // Alle Ziele durchgehen
            quest.objectives.forEach(objective => {
                // Nur Erkundungsziele aktualisieren
                if (objective.type === 'explore' && !objective.completed) {
                    // Prüfen, ob der Ort dem Ziel entspricht
                    if (objective.target === location) {
                        // Ziel als abgeschlossen markieren
                        objective.completed = true;
                        GameUI.addMessage(`Quest-Ziel erreicht: ${objective.description}`, 'quest');
                        
                        questsUpdated = true;
                    }
                }
            });
            
            // Prüfen, ob die Quest abgeschlossen ist
            this.checkQuestCompletion(quest);
        });
        
        // Quests speichern, wenn Änderungen vorgenommen wurden
        if (questsUpdated) {
            this.saveActiveQuests();
        }
    },
    
    /**
     * Aktualisiert die Gesprächsziele
     * @param {string} npc - Der NPC, mit dem gesprochen wurde
     */
    updateTalkObjectives: function(npc) {
        let questsUpdated = false;
        
        // Alle aktiven Quests durchgehen
        this.activeQuests.forEach(quest => {
            // Alle Ziele durchgehen
            quest.objectives.forEach(objective => {
                // Nur Gesprächsziele aktualisieren
                if (objective.type === 'talk' && !objective.completed) {
                    // Prüfen, ob der NPC dem Ziel entspricht
                    if (objective.target === npc) {
                        // Ziel als abgeschlossen markieren
                        objective.completed = true;
                        GameUI.addMessage(`Quest-Ziel erreicht: ${objective.description}`, 'quest');
                        
                        questsUpdated = true;
                    }
                }
            });
            
            // Prüfen, ob die Quest abgeschlossen ist
            this.checkQuestCompletion(quest);
        });
        
        // Quests speichern, wenn Änderungen vorgenommen wurden
        if (questsUpdated) {
            this.saveActiveQuests();
        }
    },
    
    /**
     * Prüft, ob eine Quest abgeschlossen ist
     * @param {Object} quest - Die zu prüfende Quest
     */
    checkQuestCompletion: function(quest) {
        // Prüfen, ob alle Ziele abgeschlossen sind
        const allCompleted = quest.objectives.every(objective => objective.completed);
        
        if (allCompleted) {
            // Quest als abgeschlossen markieren
            quest.completed = true;
            
            // Belohnungen vergeben
            this.giveQuestRewards(quest);
            
            // Quest aus den aktiven Quests entfernen
            this.activeQuests = this.activeQuests.filter(q => q.id !== quest.id);
            
            // Quest zu den abgeschlossenen Quests hinzufügen
            const player = GameEngine.player;
            if (player) {
                if (!player.completedQuests) {
                    player.completedQuests = [];
                }
                
                player.completedQuests.push(quest.id);
            }
            
            // Nachricht anzeigen
            GameUI.addMessage(`Quest abgeschlossen: ${quest.name}`, 'quest');
            
            // Nächste Quest starten, falls vorhanden
            if (quest.nextQuest) {
                const nextQuest = QuestData.getQuest(quest.nextQuest);
                if (nextQuest) {
                    GameUI.addMessage(`Neue Quest verfügbar: ${nextQuest.name}`, 'quest');
                }
            }
        }
    },
    
    /**
     * Vergibt die Belohnungen für eine abgeschlossene Quest
     * @param {Object} quest - Die abgeschlossene Quest
     */
    giveQuestRewards: function(quest) {
        const player = GameEngine.player;
        if (!player) return;
        
        // Belohnungen vergeben
        quest.rewards.forEach(reward => {
            switch (reward.type) {
                case 'gold':
                    player.gold += reward.amount;
                    GameUI.addMessage(`Du erhältst ${reward.amount} Gold!`, 'loot');
                    break;
                    
                case 'xp':
                    player.addExperience(reward.amount);
                    GameUI.addMessage(`Du erhältst ${reward.amount} Erfahrungspunkte!`, 'loot');
                    break;
                    
                case 'item':
                    const item = ItemData.createItem(reward.itemKey);
                    if (item) {
                        if (player.addItem(item)) {
                            GameUI.addMessage(`Du erhältst ${item.name}!`, 'loot');
                        } else {
                            GameUI.addMessage(`Du kannst ${item.name} nicht aufnehmen. Dein Inventar ist voll!`, 'danger');
                        }
                    }
                    break;
            }
        });
        
        // UI aktualisieren
        GameUI.updateStats();
    },
    
    /**
     * Gibt alle verfügbaren Quests zurück
     * @returns {Array} Array mit verfügbaren Quests
     */
    getAvailableQuests: function() {
        const player = GameEngine.player;
        if (!player) return [];
        
        // Alle Quests abrufen, die für das Level des Spielers verfügbar sind
        const allQuests = QuestData.getQuestsByLevel(player.level);
        
        // Nur Quests zurückgeben, die noch nicht abgeschlossen wurden und nicht aktiv sind
        return allQuests.filter(quest => {
            // Prüfen, ob die Quest bereits abgeschlossen wurde
            const isCompleted = player.completedQuests && player.completedQuests.includes(quest.id);
            
            // Prüfen, ob die Quest bereits aktiv ist
            const isActive = this.activeQuests.some(q => q.id === quest.id);
            
            // Prüfen, ob die Voraussetzungen erfüllt sind
            let prerequisitesMet = true;
            
            if (quest.prerequisite) {
                prerequisitesMet = player.completedQuests && player.completedQuests.includes(quest.prerequisite);
            }
            
            return !isCompleted && !isActive && prerequisitesMet;
        });
    }
};
