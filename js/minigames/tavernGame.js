/**
 * TavernGame-Modul für Dungeon of Echoes
 * Implementiert das Tavernen-Rhythmusspiel
 * Version: 2.0.2
 */

const TavernGame = {
    /**
     * Initialisiert das Tavernenspiel
     */
    init: function() {
        // Event-Listener für Tastatureingaben
        this.keyHandler = this.handleKeyPress.bind(this);
    },

    /**
     * Startet das Tavernenspiel
     */
    startGame: function() {
        // Spieler-Objekt abrufen
        const player = GameEngine.player;
        if (!player) return;

        // Markieren, dass wir im Tavernen-Minispiel sind
        GameEngine.inTavernGame = true;

        // Aktuelle Schwierigkeitsstufe und Zwerg bestimmen
        const level = player.tavernGameProgress.level;
        const dwarfNames = [
            "Kurzbein Bierkrug",
            "Eisenfaust Malzbart",
            "Thorin Eichenschluck"
        ];

        const dwarfDialogues = [
            "'Hicks! Lass uns anfangen! Ich... ich bin bereit!'",
            "'Zeig was du kannst, Weichling! Niemand hält mit einem Eisenfaust mit!'",
            "'Dein Untergang beginnt JETZT! Hahaha!'"
        ];

        const currentDwarf = dwarfNames[level-1];
        const currentDialogue = dwarfDialogues[level-1];

        // UI vorbereiten
        GameUI.clearActions();
        GameUI.clearMessages();
        GameUI.addMessage(`=== TRINKDUELL GEGEN ${currentDwarf.toUpperCase()} (LEVEL ${level}) ===`, 'title');
        GameUI.addMessage("Willkommen in der Taverne 'Zum Trunkenen Drachen'!", 'npc');
        GameUI.addMessage(currentDialogue, 'npc');
        GameUI.addMessage("Drücke die Pfeiltasten (↑ ↓ ← →) im richtigen Rhythmus, um zu trinken!", 'info');
        GameUI.addMessage("Drücke die Leertaste für 'PROST!' (verlangsamt den Zwerg und gibt dir einen Bonus)", 'info');
        GameUI.addMessage("ACHTUNG: Dein Fortschritt sinkt mit der Zeit! Trinke schnell genug, um zu gewinnen!", 'danger');

        // Spielvariablen - Schwierigkeit je nach Level anpassen
        const difficultySettings = Config.tavernGame.difficultyLevels[level-1];

        // Spielzustand initialisieren
        GameEngine.tavernGameState = {
            playerProgress: 0,
            dwarfProgress: 0,
            maxProgress: difficultySettings.maxProgress,
            playerSpeed: difficultySettings.playerSpeed,
            dwarfSpeed: difficultySettings.dwarfSpeed,
            dwarfFailRate: difficultySettings.dwarfFailRate,
            powerupActive: false,
            powerupDuration: 0,
            sequence: [],
            currentSequenceIndex: 0,
            gameInterval: null,
            lastKeyTime: 0,
            level: level,
            gameStarted: false,
            countdownValue: Config.tavernGame.countdownDuration,
            lastDecayTime: 0
        };

        // Fortschrittsbalken und UI-Elemente erstellen, BEVOR die erste Taste angezeigt wird
        GameUI.showTavernGameUI();

        // Zufällige Sequenz generieren und erste Taste anzeigen
        this.generateSequence();

        // Tastatur-Event-Listener hinzufügen
        this.setupControls();

        // Countdown starten
        GameUI.addMessage(`Bereite dich vor! Das Spiel beginnt in ${Config.tavernGame.countdownDuration} Sekunden...`, 'info');

        // Countdown-Anzeige erstellen
        const countdownDisplay = document.createElement('div');
        countdownDisplay.id = 'tavern-countdown';
        countdownDisplay.style.position = 'fixed';
        countdownDisplay.style.top = '50%';
        countdownDisplay.style.left = '50%';
        countdownDisplay.style.transform = 'translate(-50%, -50%)';
        countdownDisplay.style.fontSize = '100px';
        countdownDisplay.style.fontWeight = 'bold';
        countdownDisplay.style.color = '#FFD700';
        countdownDisplay.style.textShadow = '0 0 10px #000';
        countdownDisplay.style.zIndex = '1001';
        countdownDisplay.textContent = Config.tavernGame.countdownDuration.toString();
        document.body.appendChild(countdownDisplay);

        // Countdown-Intervall
        const countdownInterval = setInterval(() => {
            const state = GameEngine.tavernGameState;
            state.countdownValue--;

            if (state.countdownValue > 0) {
                // Countdown läuft noch
                countdownDisplay.textContent = state.countdownValue.toString();
            } else {
                // Countdown beendet, Spiel starten
                clearInterval(countdownInterval);
                countdownDisplay.textContent = 'LOS!';

                // Countdown-Anzeige nach kurzer Zeit entfernen
                setTimeout(() => {
                    if (countdownDisplay.parentNode) {
                        countdownDisplay.parentNode.removeChild(countdownDisplay);
                    }

                    // Spiel starten
                    state.gameStarted = true;
                    state.lastDecayTime = Date.now();

                    // Spiel-Loop starten
                    GameEngine.tavernGameState.gameInterval = setInterval(() => this.updateGame(), 150);
                }, 1000);
            }
        }, 1000);

        // Intervall speichern
        GameEngine.tavernGameState.countdownInterval = countdownInterval;
    },

    /**
     * Beendet das Tavernenspiel
     */
    endGame: function() {
        const state = GameEngine.tavernGameState;
        const player = GameEngine.player;
        const progress = player.tavernGameProgress;

        // Spiel-Loop und Countdown stoppen
        clearInterval(state.gameInterval);
        clearInterval(state.countdownInterval);

        // Event-Listener entfernen
        document.removeEventListener('keydown', this.keyHandler);

        // UI entfernen
        const gameContainer = document.getElementById('tavern-game-container');
        if (gameContainer && gameContainer.parentNode) {
            gameContainer.parentNode.removeChild(gameContainer);
        }

        // Markieren, dass wir nicht mehr im Tavernen-Minispiel sind
        GameEngine.inTavernGame = false;

        // Zwerg-Namen je nach Level
        const dwarfNames = [
            "Kurzbein Bierkrug",
            "Eisenfaust Malzbart",
            "Thorin Eichenschluck"
        ];

        const currentDwarf = dwarfNames[state.level-1];

        // Ergebnis bestimmen
        let result;
        if (state.playerProgress >= state.maxProgress && state.dwarfProgress >= state.maxProgress) {
            // Unentschieden
            result = "tie";
            GameUI.addMessage(`Unentschieden! Du und ${currentDwarf} fallt gleichzeitig unter den Tisch!`, 'info');
        } else if (state.playerProgress >= state.maxProgress) {
            // Spieler gewinnt
            result = "win";
            GameUI.addMessage(`Du gewinnst das Trinkduell! ${currentDwarf} fällt unter den Tisch!`, 'success');

            // Zähle den Sieg
            progress.wins++;

            // Schalte nächste Schwierigkeitsstufe frei, wenn möglich
            if (state.level === progress.highestLevel && progress.highestLevel < 3) {
                progress.highestLevel++;
                GameUI.addMessage(`Du hast die nächste Schwierigkeitsstufe freigeschaltet! Neuer Gegner verfügbar: ${dwarfNames[state.level]}`, 'quest');
            }
        } else {
            // Zwerg gewinnt
            result = "lose";
            GameUI.addMessage(`Du verlierst das Trinkduell und fällst unter den Tisch! ${currentDwarf} lacht über dich.`, 'danger');
        }

        // Belohnungen/Strafen basierend auf dem Ergebnis und Level
        if (result === "win") {
            // Belohnungen je nach Schwierigkeitsstufe
            const rewards = [
                { gold: 10, item: { name: "Kleiner Heiltrank", effect: "restoreHp", value: 20, chance: 0.7 } },
                { gold: 25, item: { name: "Zwergenmet", effect: "restoreHp", value: 30, chance: 0.8 } },
                { gold: 50, item: { name: "Seltener Zwergenmet", effect: "restoreHp", value: 50, chance: 0.9 } }
            ];

            const reward = rewards[state.level-1];

            // Gold-Belohnung
            player.gold += reward.gold;
            GameUI.addMessage(`Du erhältst ${reward.gold} Gold!`, 'loot');

            // Chance auf Item
            if (Math.random() < reward.item.chance) {
                const item = new Item(reward.item.name, "consumable", {
                    effect: reward.item.effect,
                    value: reward.item.value,
                    price: Math.floor(reward.item.value * 0.6)
                });

                if (player.addItem(item)) {
                    GameUI.addMessage(`Du erhältst ${reward.item.name}! (Heilt ${reward.item.value} HP)`, 'loot');
                } else {
                    GameUI.addMessage(`${currentDwarf} wollte dir ${reward.item.name} geben, aber dein Inventar ist voll!`, 'danger');
                }
            }

            // Zusätzlicher Dialog je nach Zwerg
            const winDialogues = [
                "'Hicks! Du... du bist gut! Ich muss noch viel lernen...'",
                "'Bei meinem Bart! Du trinkst wie ein Zwerg! Respekt, Mensch.'",
                "'UNGLAUBLICH! Noch nie... noch NIE hat jemand mich besiegt! Du bist legendär!'"
            ];

            GameUI.addMessage(winDialogues[state.level-1], 'npc');

        } else if (result === "lose") {
            // Strafen je nach Schwierigkeitsstufe
            const penalties = [
                { hp: 5, debuff: { name: "Leichter Kater", duration: 12, value: 1 } },  // 3 Minuten
                { hp: 10, debuff: { name: "Kater", duration: 20, value: 2 } },           // 5 Minuten
                { hp: 20, debuff: { name: "Schwerer Kater", duration: 40, value: 3 } }    // 10 Minuten
            ];

            const penalty = penalties[state.level-1];

            // HP-Verlust
            player.hp = Math.max(1, player.hp - penalty.hp);
            GameUI.addMessage(`Du verlierst ${penalty.hp} HP!`, 'danger');

            // Kater-Debuff
            player.addStatusEffect({
                name: penalty.debuff.name,
                duration: penalty.debuff.duration,
                effect: "strengthReduction",
                value: penalty.debuff.value
            });
            GameUI.addMessage(`Du hast einen ${penalty.debuff.name}! (-${penalty.debuff.value} Stärke für ${penalty.debuff.duration / 4} Minuten)`, 'danger');

            // Zusätzlicher Dialog je nach Zwerg
            const loseDialogues = [
                "'Haha! Ich bin vielleicht jung, aber ich kann trinken! Komm wieder, wenn du mehr vertragen kannst!'",
                "'HAHAHA! Niemand hält mit einem Eisenfaust mit! Geh nach Hause und schlaf deinen Rausch aus, Weichling!'",
                "'Wie erwartet! Niemand kann mich besiegen! Dein Kopf wird morgen doppelt so groß sein wie jetzt!'"
            ];

            GameUI.addMessage(loseDialogues[state.level-1], 'npc');

        } else {
            // Unentschieden - kleine Belohnung und kleine Strafe
            const goldReward = 5 + Math.floor(Math.random() * 5);
            player.gold += goldReward;
            GameUI.addMessage(`Du erhältst ${goldReward} Gold!`, 'loot');

            // Kleiner HP-Verlust
            const hpLoss = 5;
            player.hp = Math.max(1, player.hp - hpLoss);
            GameUI.addMessage(`Du verlierst ${hpLoss} HP!`, 'danger');

            // Unentschieden-Dialog
            const tieDialogues = [
                "'Hicks! Das... das war ein guter Kampf! Lass uns das... wiederholen...'",
                "'Ein Unentschieden? Ich muss wohl aus der Übung sein. Nächstes Mal gewinne ich!'",
                "'UNENTSCHIEDEN? UNENTSCHIEDEN?! Das... das ist noch nie passiert! Du bist würdig!'"
            ];

            GameUI.addMessage(tieDialogues[state.level-1], 'npc');
        }

        // Spielzustand aktualisieren
        GameUI.updateStats();

        // Zurück zum Spiel
        GameUI.addAction('Weitergehen', () => GameEngine.resumeExploration(), 'primary');
    },

    /**
     * Generiert eine zufällige Sequenz von Pfeiltasten
     */
    generateSequence: function() {
        const state = GameEngine.tavernGameState;
        const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

        // Neue Sequenz generieren
        state.sequence = [];
        for (let i = 0; i < Config.tavernGame.keySequenceLength; i++) {
            state.sequence.push(Utils.randomChoice(keys));
        }

        // Sequenzindex zurücksetzen
        state.currentSequenceIndex = 0;

        // Erste Taste anzeigen
        this.updateKeyDisplay();
    },

    /**
     * Aktualisiert die Anzeige der aktuellen Taste
     */
    updateKeyDisplay: function() {
        const state = GameEngine.tavernGameState;
        const currentKey = state.sequence[state.currentSequenceIndex];

        // Symbol für die Taste bestimmen
        let keySymbol;
        switch (currentKey) {
            case "ArrowUp": keySymbol = "↑"; break;
            case "ArrowDown": keySymbol = "↓"; break;
            case "ArrowLeft": keySymbol = "←"; break;
            case "ArrowRight": keySymbol = "→"; break;
            default: keySymbol = "?";
        }

        // Taste anzeigen
        GameUI.updateSequenceDisplay(keySymbol);
    },

    /**
     * Richtet die Steuerung für das Tavernenspiel ein
     */
    setupControls: function() {
        // Event-Listener für Tastatureingaben hinzufügen
        document.addEventListener('keydown', this.keyHandler);
    },

    /**
     * Behandelt Tastatureingaben
     * @param {KeyboardEvent} event - Das Tastatur-Event
     */
    handleKeyPress: function(event) {
        const state = GameEngine.tavernGameState;

        // Nur verarbeiten, wenn das Spiel gestartet wurde
        if (!state.gameStarted) return;

        // Leertaste für Powerup
        if (event.code === "Space" && !state.powerupActive) {
            // Powerup aktivieren
            state.powerupActive = true;
            state.powerupDuration = Config.tavernGame.powerupDuration;

            // Visuelles Feedback
            GameUI.addMessage("PROST! Der Zwerg ist kurzzeitig verlangsamt!", 'success');

            // Zwerg-Fortschrittsbalken einfärben
            const dwarfProgress = document.querySelector('#dwarf-progress > div');
            if (dwarfProgress) {
                dwarfProgress.style.backgroundColor = '#888888';
            }

            // Bier-Spritzer-Animation
            GameUI.showBeerSplash();

            return;
        }

        // Pfeiltasten für Sequenz
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
            const currentKey = state.sequence[state.currentSequenceIndex];

            // Prüfen, ob die richtige Taste gedrückt wurde
            if (event.code === currentKey) {
                // Spieler-Fortschritt erhöhen
                state.playerProgress += state.playerSpeed;

                // Fortschrittsbalken aktualisieren
                GameUI.updateTavernGameProgress(state.playerProgress, state.dwarfProgress, state.maxProgress);

                // Nächste Taste in der Sequenz
                state.currentSequenceIndex = (state.currentSequenceIndex + 1) % state.sequence.length;

                // Visuelles Feedback für Tastenwechsel
                GameUI.showKeyChangeEffect();

                // Neue Taste anzeigen
                this.updateKeyDisplay();

                // Bier-Spritzer-Animation
                if (Math.random() < 0.3) {
                    GameUI.showBeerSplash();
                }
            } else {
                // Falsche Taste - kleiner Rückschlag
                state.playerProgress = Math.max(0, state.playerProgress - 2);

                // Fortschrittsbalken aktualisieren
                GameUI.updateTavernGameProgress(state.playerProgress, state.dwarfProgress, state.maxProgress);
            }

            // Zeit der letzten Tasteneingabe speichern
            state.lastKeyTime = Date.now();
        }
    },

    /**
     * Aktualisiert den Spielzustand
     */
    updateGame: function() {
        const state = GameEngine.tavernGameState;

        // Wenn das Spiel noch nicht gestartet wurde, nichts tun
        if (!state.gameStarted) return;

        // Aktuellen Zeitpunkt speichern
        const currentTime = Date.now();

        // Automatischer Abfall des Fortschrittsbalkens (7% pro Sekunde)
        if (state.lastDecayTime) {
            const elapsedSeconds = (currentTime - state.lastDecayTime) / 1000;
            const decayAmount = state.maxProgress * Config.tavernGame.progressDecayRate * elapsedSeconds;

            // Fortschritt reduzieren, aber nicht unter 0
            state.playerProgress = Math.max(0, state.playerProgress - decayAmount);
        }

        // Zeit für den nächsten Abfall aktualisieren
        state.lastDecayTime = currentTime;

        // Zwerg-Namen je nach Level
        const dwarfNames = [
            "Kurzbein Bierkrug",
            "Eisenfaust Malzbart",
            "Thorin Eichenschluck"
        ];

        // Zwerg-Fortschritt aktualisieren
        if (state.powerupActive) {
            // Zwerg ist verlangsamt
            state.dwarfProgress += state.dwarfSpeed * 0.2;
            state.powerupDuration--;

            if (state.powerupDuration <= 0) {
                state.powerupActive = false;
                GameUI.addMessage('Der Zwerg erholt sich!', 'info');

                // Zwerg-Farbe zurücksetzen
                const dwarfProgress = document.querySelector('#dwarf-progress > div');
                if (dwarfProgress) {
                    dwarfProgress.style.backgroundColor = '#F44336';
                }
            }
        } else {
            // Skill-Check für den Zwerg - manchmal versagt er
            if (Math.random() < state.dwarfFailRate) {
                // Zwerg versagt beim Trinken
                GameUI.addMessage(`${dwarfNames[state.level-1]} verschüttet sein Bier!`, 'success');
            } else {
                // Normale Geschwindigkeit
                state.dwarfProgress += state.dwarfSpeed;
            }
        }

        // Fortschrittsbalken aktualisieren
        GameUI.updateTavernGameProgress(state.playerProgress, state.dwarfProgress, state.maxProgress);

        // Prüfen, ob das Spiel beendet ist
        if (state.playerProgress >= state.maxProgress || state.dwarfProgress >= state.maxProgress) {
            this.endGame();
        }
    }
};