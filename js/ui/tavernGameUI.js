/**
 * TavernGameUI-Modul für Dungeon of Echoes
 * Verwaltet die Benutzeroberfläche für das Tavernenspiel
 * Version: 2.0.2
 */

// Erweitere das GameUI-Objekt um Tavernenspiel-Funktionen
Object.assign(GameUI, {
    /**
     * Zeigt die Benutzeroberfläche für das Tavernenspiel an
     */
    showTavernGameUI: function() {
        const gameLog = document.getElementById('game-log');

        // Fortschrittsbalken-Container erstellen
        const progressContainer = document.createElement('div');
        progressContainer.id = 'tavern-game-container';

        // Feste Position am unteren Bildschirmrand
        progressContainer.style.position = 'fixed';
        progressContainer.style.bottom = '10px';
        progressContainer.style.left = '50%';
        progressContainer.style.transform = 'translateX(-50%)';
        progressContainer.style.width = '80%';
        progressContainer.style.maxWidth = '600px';
        progressContainer.style.zIndex = '1000';
        progressContainer.style.padding = '15px';
        progressContainer.style.backgroundColor = '#333';
        progressContainer.style.borderRadius = '5px';
        progressContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

        // Spieler-Fortschrittsbalken
        const playerBar = document.createElement('div');
        playerBar.id = 'player-progress';
        playerBar.className = 'progress-bar';
        playerBar.innerHTML = '<div style="width: 0%;"></div>';
        playerBar.style.marginBottom = '10px';

        // Zwerg-Fortschrittsbalken
        const dwarfBar = document.createElement('div');
        dwarfBar.id = 'dwarf-progress';
        dwarfBar.className = 'progress-bar';
        dwarfBar.innerHTML = '<div style="width: 0%;"></div>';

        // Sequenz-Anzeige Container
        const sequenceContainer = document.createElement('div');
        sequenceContainer.style.textAlign = 'center';
        sequenceContainer.style.marginTop = '15px';

        // Hinweis-Label
        const keyLabel = document.createElement('div');
        keyLabel.textContent = 'DRÜCKE:';
        keyLabel.style.color = 'white';
        keyLabel.style.fontSize = '16px';
        keyLabel.style.fontWeight = 'bold';
        keyLabel.style.marginBottom = '5px';
        sequenceContainer.appendChild(keyLabel);

        // Leertaste-Hinweis
        const spacebarHint = document.createElement('div');
        spacebarHint.textContent = 'Leertaste für PROST!';
        spacebarHint.style.color = '#FFD700';
        spacebarHint.style.fontSize = '14px';
        spacebarHint.style.marginTop = '10px';
        spacebarHint.style.fontStyle = 'italic';
        spacebarHint.style.fontWeight = 'bold';

        // Sequenz-Anzeige
        const sequenceDisplay = document.createElement('div');
        sequenceDisplay.id = 'sequence-display';
        sequenceDisplay.style.textAlign = 'center';
        sequenceDisplay.style.fontSize = '48px';
        sequenceDisplay.style.fontWeight = 'bold';
        sequenceDisplay.style.backgroundColor = '#222';
        sequenceDisplay.style.padding = '10px';
        sequenceDisplay.style.borderRadius = '10px';
        sequenceDisplay.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.3)';
        sequenceDisplay.style.width = '80px';
        sequenceDisplay.style.height = '80px';
        sequenceDisplay.style.lineHeight = '60px';
        sequenceDisplay.style.margin = '0 auto';
        sequenceDisplay.style.position = 'relative';
        sequenceContainer.appendChild(sequenceDisplay);
        sequenceContainer.appendChild(spacebarHint);

        // Alles zum Container hinzufügen
        progressContainer.appendChild(playerBar);
        progressContainer.appendChild(dwarfBar);
        progressContainer.appendChild(sequenceContainer);

        // Container zum Spiellog hinzufügen
        gameLog.appendChild(progressContainer);
    },

    /**
     * Aktualisiert die Fortschrittsbalken im Tavernenspiel
     * @param {number} playerProgress - Fortschritt des Spielers (0-100)
     * @param {number} dwarfProgress - Fortschritt des Zwergs (0-100)
     * @param {number} maxProgress - Maximaler Fortschritt
     */
    updateTavernGameProgress: function(playerProgress, dwarfProgress, maxProgress) {
        const playerBar = document.querySelector('#player-progress > div');
        const dwarfBar = document.querySelector('#dwarf-progress > div');

        if (playerBar && dwarfBar) {
            // Prozentsätze berechnen
            const playerPercent = Math.min(100, (playerProgress / maxProgress) * 100);
            const dwarfPercent = Math.min(100, (dwarfProgress / maxProgress) * 100);

            // Fortschrittsbalken aktualisieren
            playerBar.style.width = `${playerPercent}%`;
            dwarfBar.style.width = `${dwarfPercent}%`;
        }
    },

    /**
     * Aktualisiert die Sequenzanzeige im Tavernenspiel
     * @param {string} keySymbol - Symbol für die aktuelle Taste
     */
    updateSequenceDisplay: function(keySymbol) {
        const sequenceDisplay = document.getElementById('sequence-display');
        if (sequenceDisplay) {
            // Sicherstellen, dass das Symbol sofort sichtbar ist und größer dargestellt wird
            sequenceDisplay.innerHTML = keySymbol || '↑'; // Standardmäßig Pfeil nach oben anzeigen
            sequenceDisplay.style.color = '#FFD700'; // Gold
            sequenceDisplay.style.fontSize = '72px'; // Größere Schrift
            sequenceDisplay.style.textShadow = '0 0 10px #FFD700'; // Leuchteffekt

            // Pulsierender Effekt für bessere Sichtbarkeit
            sequenceDisplay.style.animation = 'pulse 1s infinite';

            // Wenn noch nicht vorhanden, CSS-Animation hinzufügen
            if (!document.getElementById('tavern-game-animations')) {
                const styleElement = document.createElement('style');
                styleElement.id = 'tavern-game-animations';
                styleElement.textContent = `
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.2); }
                        100% { transform: scale(1); }
                    }
                `;
                document.head.appendChild(styleElement);
            }

            // Fokus auf das Spiel setzen, um Tastatureingaben zu erleichtern
            sequenceDisplay.focus();

            // Akustisches Feedback (optional)
            try {
                const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
                audio.volume = 0.1;
                audio.play().catch(() => {}); // Fehler ignorieren, falls Browser Audio blockiert
            } catch (e) {
                // Audio wird nicht unterstützt oder ist blockiert
            }
        }
    },

    /**
     * Zeigt einen visuellen Effekt für den Tastenwechsel an
     */
    showKeyChangeEffect: function() {
        // Visueller Effekt für Tastenwechsel
        const sequenceDisplay = document.getElementById('sequence-display');
        if (!sequenceDisplay) return;

        // Kurze Farbanimation
        sequenceDisplay.style.backgroundColor = '#4CAF50'; // Grün
        sequenceDisplay.style.transform = 'scale(1.2)';

        // Zurück zur normalen Farbe und Größe
        setTimeout(() => {
            sequenceDisplay.style.backgroundColor = '#222';
            sequenceDisplay.style.transform = 'scale(1)';
        }, 200);

        // Auch einen Ton abspielen (optional)
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
            audio.volume = 0.2;
            audio.play().catch(() => {}); // Fehler ignorieren, falls Browser Audio blockiert
        } catch (e) {
            // Audio wird nicht unterstützt oder ist blockiert
        }
    },

    /**
     * Zeigt eine Bier-Spritzer-Animation an
     */
    showBeerSplash: function() {
        // Bier-Spritzer-Animation
        const gameContainer = document.getElementById('tavern-game-container');
        if (!gameContainer) return;

        const splash = document.createElement('div');
        splash.textContent = '🍻';
        splash.style.position = 'absolute';
        splash.style.fontSize = '24px';
        splash.style.left = `${Math.random() * 80 + 10}%`;
        splash.style.top = `${Math.random() * 80}%`;
        splash.style.opacity = '1';
        splash.style.transition = 'all 0.5s';

        gameContainer.appendChild(splash);

        // Animation
        setTimeout(() => {
            splash.style.transform = `translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px)`;
            splash.style.opacity = '0';
        }, 50);

        // Entfernen
        setTimeout(() => {
            if (splash.parentNode) {
                splash.parentNode.removeChild(splash);
            }
        }, 550);
    }
});
