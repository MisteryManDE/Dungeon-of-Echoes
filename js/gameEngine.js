/**
 * GameEngine für Dungeon of Echoes
 * Hauptmodul, das das Spiel steuert
 * Version: 2.0.2
 */

const GameEngine = {
    // Spieler-Objekt
    player: null,

    // Aktueller Ort
    currentLocation: "startingTown",

    // Entdeckte Orte
    discoveredLocations: ["startingTown"],

    // Aktueller Dungeon
    currentDungeon: null,
    currentDungeonFloor: 1,

    // Aktueller Händler
    currentMerchant: null,

    // Spielzustände
    inCombat: false,
    inTavernGame: false,
    tavernGameState: null,

    /**
     * Initialisiert das Spiel
     */
    init: function() {
        try {
            // UI initialisieren
            GameUI.init();
        } catch (error) {
            console.error('Fehler bei der Initialisierung der UI:', error);
            ErrorHandler.handleError(error, 'GameEngine.init() - UI', 0);
        }

        try {
            // Kampfsystem initialisieren
            CombatSystem.init();
        } catch (error) {
            console.error('Fehler bei der Initialisierung des Kampfsystems:', error);
            ErrorHandler.handleError(error, 'GameEngine.init() - CombatSystem', 0);
        }

        try {
            // Inventarsystem initialisieren
            InventorySystem.init();
        } catch (error) {
            console.error('Fehler bei der Initialisierung des Inventarsystems:', error);
            ErrorHandler.handleError(error, 'GameEngine.init() - InventorySystem', 0);
        }

        try {
            // Quest-System initialisieren
            QuestSystem.init();
        } catch (error) {
            console.error('Fehler bei der Initialisierung des Quest-Systems:', error);
            ErrorHandler.handleError(error, 'GameEngine.init() - QuestSystem', 0);
        }

        try {
            // Speicher-/Ladesystem initialisieren
            SaveLoadSystem.init();
        } catch (error) {
            console.error('Fehler bei der Initialisierung des Speicher-/Ladesystems:', error);
            ErrorHandler.handleError(error, 'GameEngine.init() - SaveLoadSystem', 0);
        }

        try {
            // Tavernenspiel initialisieren
            TalentTreeUI.init();
            TavernGame.init();
        } catch (error) {
            console.error('Fehler bei der Initialisierung des Tavernen-Minispiels:', error);
            ErrorHandler.handleError(error, 'GameEngine.init() - TavernGame', 0);
        }

        // Startmenü anzeigen
        try {
            this.showStartMenu();
        } catch (error) {
            console.error('Fehler beim Anzeigen des Startmenüs:', error);
            ErrorHandler.handleError(error, 'GameEngine.init() - showStartMenu', 0);

            // Fallback: Einfaches Startmenü anzeigen
            try {
                GameUI.clearActions();
                GameUI.clearMessages();
                GameUI.addMessage('Willkommen bei Dungeon of Echoes!', 'title');
                GameUI.addAction('Neues Spiel', () => this.createNewCharacter(), 'primary');
                GameUI.addAction('Spiel laden', () => SaveLoadSystem.showLoadMenu(), 'primary');
            } catch (fallbackError) {
                console.error('Kritischer Fehler beim Anzeigen des Fallback-Startmenüs:', fallbackError);
                // Letzter Ausweg: Direkte DOM-Manipulation
                document.body.innerHTML = `
                    <div style="text-align: center; margin-top: 100px;">
                        <h1>Willkommen bei Dungeon of Echoes!</h1>
                        <p>Es ist ein Fehler aufgetreten. Bitte laden Sie die Seite neu.</p>
                        <button onclick="location.reload()">Seite neu laden</button>
                    </div>
                `;
            }
        }

        // Event-Listener für Werbung
        this.setupAdToggle();
    },

    /**
     * Richtet den Werbung-Toggle ein
     */
    setupAdToggle: function() {
        // Prüfen, ob Werbung deaktiviert ist
        const adsDisabled = localStorage.getItem('ads_disabled') === 'true';

        // Werbung-Status setzen
        if (adsDisabled) {
            document.body.classList.add('ads-disabled');
        }

        // Event-Listener für Werbung-Toggle
        const adToggle = document.getElementById('ad-toggle');
        if (adToggle) {
            adToggle.checked = !adsDisabled;

            adToggle.addEventListener('change', function() {
                if (this.checked) {
                    // Werbung aktivieren
                    document.body.classList.remove('ads-disabled');
                    localStorage.setItem('ads_disabled', 'false');
                } else {
                    // Werbung deaktivieren
                    document.body.classList.add('ads-disabled');
                    localStorage.setItem('ads_disabled', 'true');
                }
            });
        }
    },

    /**
     * Zeigt das Startmenü an
     */
    showStartMenu: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();

        // Titel anzeigen
        GameUI.addMessage("Dungeon of Echoes", 'title');
        GameUI.addMessage("Version " + Config.version, 'info');

        // Aktionen hinzufügen
        GameUI.addAction('Neues Spiel', () => {
            this.showCharacterCreation();
        }, 'primary');

        GameUI.addAction('Spiel laden', () => {
            SaveLoadSystem.showLoadMenu();
        }, 'primary');

        // Credits
        GameUI.addAction('Credits', () => {
            this.showCredits();
        }, 'secondary');
    },

    /**
     * Zeigt die Credits an
     */
    showCredits: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();

        // Credits anzeigen
        GameUI.addMessage("Dungeon of Echoes", 'title');
        GameUI.addMessage("Version " + Config.version, 'info');
        GameUI.addMessage("Ein Textadventure-RPG", 'info');
        GameUI.addMessage("© 2025 Dungeon of Echoes Team (und damit meine ich Erik)", 'info');

        // Zurück-Button
        GameUI.addAction('Zurück', () => {
            this.showStartMenu();
        }, 'secondary');
    },

    /**
     * Zeigt die Charaktererstellung an
     */
    showCharacterCreation: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();

        // Titel anzeigen
        GameUI.addMessage("Charaktererstellung", 'title');

        // Name eingeben
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'character-name';
        nameInput.placeholder = 'Gib deinen Namen ein';
        nameInput.style.padding = '8px';
        nameInput.style.margin = '10px 0';
        nameInput.style.width = '100%';
        nameInput.style.backgroundColor = '#333';
        nameInput.style.color = '#fff';
        nameInput.style.border = '1px solid #444';
        nameInput.style.borderRadius = '5px';

        const nameContainer = document.createElement('div');
        nameContainer.appendChild(nameInput);

        const gameLog = document.getElementById('game-log');
        if (gameLog) {
            gameLog.appendChild(nameContainer);
        }

        // Klasse auswählen
        GameUI.addMessage("Wähle deine Klasse:", 'info');

        // Krieger
        GameUI.addAction('Krieger', () => {
            this.createCharacter('warrior');
        }, 'primary');

        // Schurke
        GameUI.addAction('Schurke', () => {
            this.createCharacter('rogue');
        }, 'primary');

        // Magier
        GameUI.addAction('Magier', () => {
            this.createCharacter('mage');
        }, 'primary');

        // Zurück-Button
        GameUI.addAction('Zurück', () => {
            this.showStartMenu();
        }, 'secondary');
    },

    /**
     * Erstellt einen neuen Charakter
     * @param {string} characterClass - Die gewählte Charakterklasse
     */
    createCharacter: function(characterClass) {
        // Name abrufen
        const nameInput = document.getElementById('character-name');
        let name = nameInput ? nameInput.value.trim() : '';

        // Standardname, wenn kein Name eingegeben wurde
        if (!name) {
            name = 'Abenteurer';
        }

        // Spieler erstellen
        this.player = new Player(name, characterClass);

        // Startausrüstung hinzufügen
        this.addStartingEquipment();

        // Spiel starten
        this.startGame();
    },

    /**
     * Fügt die Startausrüstung hinzu
     */
    addStartingEquipment: function() {
        const player = this.player;
        if (!player) return;

        // Startausrüstung basierend auf der Klasse
        switch (player.characterClass) {
            case 'warrior':
                // Waffe
                const warriorSword = ItemData.createItem('rusty_sword');
                if (warriorSword) {
                    player.addItem(warriorSword);
                } else {
                    console.error('Konnte Rostiges Schwert nicht erstellen!');
                }

                // Rüstung
                const warriorArmor = ItemData.createItem('leather_armor');
                if (warriorArmor) {
                    player.addItem(warriorArmor);
                } else {
                    console.error('Konnte Lederrüstung nicht erstellen!');
                }

                // Tränke
                const warriorPotion = ItemData.createItem('health_potion_small');
                if (warriorPotion) {
                    player.addItem(warriorPotion);
                } else {
                    console.error('Konnte Kleinen Heiltrank nicht erstellen!');
                }
                break;

            case 'rogue':
                // Waffe
                const rogueDagger = ItemData.createItem('dagger');
                if (rogueDagger) {
                    player.addItem(rogueDagger);
                } else {
                    console.error('Konnte Dolch nicht erstellen!');
                }

                // Rüstung
                const rogueArmor = ItemData.createItem('leather_armor');
                if (rogueArmor) {
                    player.addItem(rogueArmor);
                } else {
                    console.error('Konnte Lederrüstung nicht erstellen!');
                }

                // Tränke
                const roguePotion = ItemData.createItem('health_potion_small');
                if (roguePotion) {
                    player.addItem(roguePotion);
                } else {
                    console.error('Konnte Kleinen Heiltrank nicht erstellen!');
                }
                break;

            case 'mage':
                // Waffe
                const mageStaff = ItemData.createItem('wooden_staff');
                if (mageStaff) {
                    player.addItem(mageStaff);
                } else {
                    console.error('Konnte Holzstab nicht erstellen!');
                }

                // Rüstung
                const mageRobe = ItemData.createItem('cloth_robe');
                if (mageRobe) {
                    player.addItem(mageRobe);
                } else {
                    console.error('Konnte Stoffrobe nicht erstellen!');
                }

                // Tränke
                const magePotion = ItemData.createItem('mana_potion_small');
                if (magePotion) {
                    player.addItem(magePotion);
                } else {
                    console.error('Konnte Kleinen Manatrank nicht erstellen!');
                }
                break;
        }

        // Startfähigkeiten hinzufügen
        this.addStartingAbilities();
    },

    /**
     * Fügt die Startfähigkeiten hinzu
     */
    addStartingAbilities: function() {
        const player = this.player;
        if (!player) return;

        // Startfähigkeiten basierend auf der Klasse
        const abilities = AbilityData.getAbilitiesByLevel(player.characterClass, 1);

        abilities.forEach(ability => {
            player.addAbility(ability);

            // Erste Fähigkeit ausrüsten
            if (player.equippedAbilities.length === 0) {
                player.equipAbility(0, 0);
            }
        });
    },

    /**
     * Startet das Spiel
     */
    startGame: function() {
        // Prüfen, ob ein Spieler existiert
        if (!this.player) return;

        // UI aktualisieren
        GameUI.updateStats();
        GameUI.showInventory();
        GameUI.showEquipment();
        GameUI.showAbilities();

        // Einführung anzeigen
        this.showIntroduction();
    },

    /**
     * Zeigt die Einführung an
     */
    showIntroduction: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();

        // Einführung anzeigen
        GameUI.addMessage("Willkommen in der Welt von Dungeon of Echoes!", 'title');

        // Klassenspezifische Einführung
        switch (this.player.characterClass) {
            case 'warrior':
                GameUI.addMessage("Als Krieger bist du stark im Nahkampf und kannst viel Schaden einstecken.", 'info');
                GameUI.addMessage("Deine Stärke liegt in deiner Ausdauer und rohen Kraft.", 'info');
                break;

            case 'rogue':
                GameUI.addMessage("Als Schurke bist du schnell und geschickt.", 'info');
                GameUI.addMessage("Deine Stärke liegt in deiner Geschwindigkeit und Präzision.", 'info');
                break;

            case 'mage':
                GameUI.addMessage("Als Magier beherrschst du mächtige Zauber.", 'info');
                GameUI.addMessage("Deine Stärke liegt in deiner magischen Kraft und deinem Wissen.", 'info');
                break;
        }

        GameUI.addMessage("Deine Reise beginnt in der Stadt Echofels, einem kleinen Ort am Rande des Königreichs.", 'info');
        GameUI.addMessage("Gerüchte über mysteriöse Dungeons und verborgene Schätze haben dich hierher geführt.", 'info');
        GameUI.addMessage("Was wirst du als Erstes tun?", 'info');

        // Weiter-Button
        GameUI.addAction('Weiter', () => {
            this.showTownMenu();
        }, 'primary');
    },

    /**
     * Zeigt das Hauptmenü an
     */
    showMainMenu: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();

        // Titel anzeigen
        GameUI.addMessage("Hauptmenü", 'title');

        // Aktionen hinzufügen
        GameUI.addAction('Zurück zum Spiel', () => {
            this.showTownMenu();
        }, 'primary');

        GameUI.addAction('Inventar', () => {
            InventorySystem.showInventoryMenu();
        }, 'primary');

        GameUI.addAction('Quests', () => {
            QuestSystem.showQuestMenu();
        }, 'primary');

        GameUI.addAction('Talentbaum', () => {
            TalentTreeUI.showTalentTree();
        }, 'primary');

        GameUI.addAction('Spiel speichern', () => {
            SaveLoadSystem.showSaveMenu();
        }, 'secondary');

        GameUI.addAction('Spielstand löschen', () => {
            SaveLoadSystem.showDeleteMenu();
        }, 'danger');

        GameUI.addAction('Zum Startmenü', () => {
            this.confirmQuit();
        }, 'danger');
    },

    /**
     * Zeigt eine Bestätigung für das Beenden des Spiels an
     */
    confirmQuit: function() {
        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();

        // Bestätigung anfordern
        GameUI.addMessage("Möchtest du wirklich zum Startmenü zurückkehren?", 'danger');
        GameUI.addMessage("Nicht gespeicherte Fortschritte gehen verloren!", 'danger');

        // Ja/Nein-Buttons
        GameUI.addAction('Ja', () => {
            this.player = null;
            this.showStartMenu();
        }, 'danger');

        GameUI.addAction('Nein', () => {
            this.showMainMenu();
        }, 'secondary');
    }
};
