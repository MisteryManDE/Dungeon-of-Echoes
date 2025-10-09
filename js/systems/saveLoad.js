/**
 * SaveLoad-System für Dungeon of Echoes
 * Verwaltet das Speichern und Laden von Spielständen
 * Version: 2.0.2
 */

const SaveLoadSystem = {
    // Schlüssel für den LocalStorage
    SAVE_KEY: 'dungeon_of_echoes_save',

    // Maximale Anzahl an Spielständen
    MAX_SAVE_SLOTS: 3,

    // Automatisches Speichern
    autoSaveEnabled: true,
    autoSaveInterval: null,

    /**
     * Initialisiert das Speicher-/Ladesystem
     */
    init: function() {
        // Automatisches Speichern einrichten
        if (this.autoSaveEnabled) {
            this.startAutoSave();
        }
    },

    /**
     * Startet das automatische Speichern
     */
    startAutoSave: function() {
        // Vorhandenes Intervall löschen
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }

        // Neues Intervall einrichten
        this.autoSaveInterval = setInterval(() => {
            this.autoSave();
        }, Config.settings.saveInterval);
    },

    /**
     * Stoppt das automatische Speichern
     */
    stopAutoSave: function() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    },

    /**
     * Führt einen automatischen Speichervorgang durch
     */
    autoSave: function() {
        // Nur speichern, wenn ein Spieler existiert
        if (GameEngine.player) {
            // In Slot 0 (Auto-Save) speichern
            this.saveGame(0, true);

            if (Config.settings.debugMode) {
                console.log('Auto-Save durchgeführt');
            }
        }
    },

    /**
     * Zeigt das Speichermenü an
     */
    showSaveMenu: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();

        // Titel anzeigen
        GameUI.addMessage("Spiel speichern", 'title');

        // Spielstände laden
        const saveGames = this.getSaveGames();

        // Speicherslots anzeigen
        for (let i = 1; i <= this.MAX_SAVE_SLOTS; i++) {
            const saveGame = saveGames[i];

            let slotText = `Slot ${i}`;
            if (saveGame) {
                const date = new Date(saveGame.timestamp);
                slotText += ` - ${saveGame.playerName} (Level ${saveGame.playerLevel}) - ${date.toLocaleString()}`;
            } else {
                slotText += " - Leer";
            }

            GameUI.addAction(slotText, () => {
                this.confirmSave(i);
            }, saveGame ? 'danger' : 'primary');
        }

        // Zurück-Button
        GameUI.addAction('Zurück', () => {
            GameEngine.showMainMenu();
        }, 'secondary');
    },

    /**
     * Zeigt eine Bestätigung für das Überschreiben eines Spielstands an
     * @param {number} slot - Der Speicherslot
     */
    confirmSave: function(slot) {
        // Spielstände laden
        const saveGames = this.getSaveGames();
        const saveGame = saveGames[slot];

        // Wenn der Slot leer ist, direkt speichern
        if (!saveGame) {
            this.saveGame(slot);
            return;
        }

        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();

        // Bestätigung anfordern
        GameUI.addMessage(`Möchtest du den Spielstand in Slot ${slot} überschreiben?`, 'danger');

        // Spielstandinformationen anzeigen
        const date = new Date(saveGame.timestamp);
        GameUI.addMessage(`Aktueller Spielstand: ${saveGame.playerName} (Level ${saveGame.playerLevel}) - ${date.toLocaleString()}`, 'info');

        // Ja/Nein-Buttons
        GameUI.addAction('Ja', () => {
            this.saveGame(slot);
        }, 'danger');

        GameUI.addAction('Nein', () => {
            this.showSaveMenu();
        }, 'secondary');
    },

    /**
     * Speichert das Spiel
     * @param {number} slot - Der Speicherslot
     * @param {boolean} isAutoSave - Gibt an, ob es sich um einen automatischen Speichervorgang handelt
     */
    saveGame: function(slot, isAutoSave = false) {
        // Spieler-Objekt abrufen
        const player = GameEngine.player;
        if (!player) return;

        // Spielstand erstellen
        const saveGame = {
            version: Config.version,
            timestamp: Date.now(),
            playerName: player.name,
            playerLevel: player.level,
            player: player.toJSON(),
            questSystem: {
                activeQuests: QuestSystem.activeQuests,
                dailyQuests: QuestSystem.dailyQuests,
                lastDailyQuestUpdate: QuestSystem.lastDailyQuestUpdate
            },
            gameState: {
                currentLocation: GameEngine.currentLocation,
                discoveredLocations: GameEngine.discoveredLocations
            }
        };

        // Spielstände laden
        const saveGames = this.getSaveGames();

        // Spielstand speichern
        saveGames[slot] = saveGame;

        // Spielstände speichern
        Utils.saveToLocalStorage(this.SAVE_KEY, saveGames);

        // Nachricht anzeigen (nur bei manuellem Speichern)
        if (!isAutoSave) {
            GameUI.addMessage(`Spiel erfolgreich in Slot ${slot} gespeichert!`, 'success');

            // Zurück zum Speichermenü
            setTimeout(() => {
                this.showSaveMenu();
            }, 1500);
        }
    },

    /**
     * Zeigt das Lademenü an
     */
    showLoadMenu: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();

        // Titel anzeigen
        GameUI.addMessage("Spiel laden", 'title');

        // Spielstände laden
        const saveGames = this.getSaveGames();

        // Prüfen, ob Spielstände vorhanden sind
        let hasSaveGames = false;

        // Speicherslots anzeigen
        for (let i = 0; i <= this.MAX_SAVE_SLOTS; i++) {
            const saveGame = saveGames[i];

            if (saveGame) {
                hasSaveGames = true;

                let slotText = i === 0 ? "Auto-Save" : `Slot ${i}`;
                const date = new Date(saveGame.timestamp);
                slotText += ` - ${saveGame.playerName} (Level ${saveGame.playerLevel}) - ${date.toLocaleString()}`;

                GameUI.addAction(slotText, () => {
                    this.loadGame(i);
                }, 'primary');
            }
        }

        if (!hasSaveGames) {
            GameUI.addMessage("Keine Spielstände vorhanden.", 'info');
        }

        // Zurück-Button
        GameUI.addAction('Zurück', () => {
            GameEngine.showStartMenu();
        }, 'secondary');
    },

    /**
     * Lädt ein Spiel
     * @param {number} slot - Der Speicherslot
     */
    loadGame: function(slot) {
        // Spielstände laden
        const saveGames = this.getSaveGames();
        const saveGame = saveGames[slot];

        if (!saveGame) {
            GameUI.addMessage(`Kein Spielstand in Slot ${slot} vorhanden!`, 'danger');
            return;
        }

        // Versionsprüfung
        if (saveGame.version !== Config.version) {
            GameUI.addMessage(`Warnung: Der Spielstand wurde mit Version ${saveGame.version} erstellt, aktuelle Version ist ${Config.version}.`, 'danger');
            GameUI.addMessage("Es kann zu Kompatibilitätsproblemen kommen.", 'danger');

            // Bestätigung anfordern
            GameUI.clearActions();

            GameUI.addAction('Trotzdem laden', () => {
                this.doLoadGame(saveGame);
            }, 'danger');

            GameUI.addAction('Abbrechen', () => {
                this.showLoadMenu();
            }, 'secondary');

            return;
        }

        // Spiel laden
        this.doLoadGame(saveGame);
    },

    /**
     * Führt den eigentlichen Ladevorgang durch
     * @param {Object} saveGame - Der zu ladende Spielstand
     */
    doLoadGame: function(saveGame) {
        try {
            // Spieler laden
            const player = Player.fromJSON(saveGame.player);
            if (!player) {
                throw new Error('Spieler konnte nicht geladen werden!');
            }
            GameEngine.player = player;

            // Quest-System laden
            QuestSystem.activeQuests = saveGame.questSystem.activeQuests || [];
            QuestSystem.dailyQuests = saveGame.questSystem.dailyQuests || [];
            QuestSystem.lastDailyQuestUpdate = saveGame.questSystem.lastDailyQuestUpdate || 0;

            // Spielzustand laden
            GameEngine.currentLocation = saveGame.gameState.currentLocation || "startingTown";
            GameEngine.discoveredLocations = saveGame.gameState.discoveredLocations || ["startingTown"];

            // Nachricht anzeigen
            GameUI.addMessage(`Spielstand von ${saveGame.playerName} (Level ${saveGame.playerLevel}) geladen!`, 'success');

            // Spiel starten
            setTimeout(() => {
                GameEngine.startGame();
            }, 1500);
        } catch (error) {
            console.error('Fehler beim Laden:', error);
            GameUI.addMessage(`Fehler beim Laden: ${error.message}`, 'danger');

            // Zurück zum Ladenmenü
            setTimeout(() => {
                this.showLoadMenu();
            }, 1500);
        }
    },

    /**
     * Gibt alle gespeicherten Spielstände zurück
     * @returns {Object} Objekt mit Spielständen
     */
    getSaveGames: function() {
        // Spielstände aus dem LocalStorage laden
        const saveGames = Utils.loadFromLocalStorage(this.SAVE_KEY) || {};

        return saveGames;
    },

    /**
     * Löscht einen Spielstand
     * @param {number} slot - Der zu löschende Speicherslot
     */
    deleteSaveGame: function(slot) {
        // Spielstände laden
        const saveGames = this.getSaveGames();

        // Spielstand löschen
        if (saveGames[slot]) {
            delete saveGames[slot];

            // Spielstände speichern
            Utils.saveToLocalStorage(this.SAVE_KEY, saveGames);

            // Nachricht anzeigen
            GameUI.addMessage(`Spielstand in Slot ${slot} gelöscht!`, 'success');
        } else {
            GameUI.addMessage(`Kein Spielstand in Slot ${slot} vorhanden!`, 'danger');
        }

        // Zurück zum Lademenü
        setTimeout(() => {
            this.showLoadMenu();
        }, 1500);
    },

    /**
     * Zeigt das Löschmenü an
     */
    showDeleteMenu: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();

        // Titel anzeigen
        GameUI.addMessage("Spielstand löschen", 'title');

        // Spielstände laden
        const saveGames = this.getSaveGames();

        // Prüfen, ob Spielstände vorhanden sind
        let hasSaveGames = false;

        // Speicherslots anzeigen
        for (let i = 1; i <= this.MAX_SAVE_SLOTS; i++) {
            const saveGame = saveGames[i];

            if (saveGame) {
                hasSaveGames = true;

                let slotText = `Slot ${i}`;
                const date = new Date(saveGame.timestamp);
                slotText += ` - ${saveGame.playerName} (Level ${saveGame.playerLevel}) - ${date.toLocaleString()}`;

                GameUI.addAction(slotText, () => {
                    this.confirmDelete(i);
                }, 'danger');
            }
        }

        if (!hasSaveGames) {
            GameUI.addMessage("Keine Spielstände vorhanden.", 'info');
        }

        // Zurück-Button
        GameUI.addAction('Zurück', () => {
            GameEngine.showMainMenu();
        }, 'secondary');
    },

    /**
     * Zeigt eine Bestätigung für das Löschen eines Spielstands an
     * @param {number} slot - Der Speicherslot
     */
    confirmDelete: function(slot) {
        // Spielstände laden
        const saveGames = this.getSaveGames();
        const saveGame = saveGames[slot];

        if (!saveGame) {
            GameUI.addMessage(`Kein Spielstand in Slot ${slot} vorhanden!`, 'danger');
            return;
        }

        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();

        // Bestätigung anfordern
        GameUI.addMessage(`Möchtest du den Spielstand in Slot ${slot} wirklich löschen?`, 'danger');

        // Spielstandinformationen anzeigen
        const date = new Date(saveGame.timestamp);
        GameUI.addMessage(`Spielstand: ${saveGame.playerName} (Level ${saveGame.playerLevel}) - ${date.toLocaleString()}`, 'info');

        // Ja/Nein-Buttons
        GameUI.addAction('Ja', () => {
            this.deleteSaveGame(slot);
        }, 'danger');

        GameUI.addAction('Nein', () => {
            this.showDeleteMenu();
        }, 'secondary');
    }
};
