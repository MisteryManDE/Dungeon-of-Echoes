/**
 * GameUI-Modul für Dungeon of Echoes
 * Verwaltet die Benutzeroberfläche des Spiels
 * Version: 2.0.2
 * Teil 1: Grundlegende UI-Funktionen
 */

const GameUI = {
    /**
     * Initialisiert die Benutzeroberfläche
     */
    init: function() {
        // Event-Listener für UI-Aktualisierungen registrieren
        EventSystem.on('playerStatsUpdated', () => this.updateStats());
        EventSystem.on('inventoryChanged', () => this.showInventory());
        EventSystem.on('equipmentChanged', () => this.showEquipment());
        EventSystem.on('equippedAbilitiesChanged', () => this.showAbilities());

        // Tooltip-Container erstellen
        this.createTooltipContainer();
    },

    /**
     * Erstellt einen Container für Tooltips
     */
    createTooltipContainer: function() {
        // Vorhandenen Container entfernen, falls vorhanden
        const existingTooltip = document.getElementById('tooltip-container');
        if (existingTooltip) {
            existingTooltip.remove();
        }

        // Neuen Container erstellen
        const tooltipContainer = document.createElement('div');
        tooltipContainer.id = 'tooltip-container';
        tooltipContainer.className = 'tooltip';
        tooltipContainer.style.display = 'none';
        document.body.appendChild(tooltipContainer);

        // Event-Listener für Mausbewegungen
        document.addEventListener('mousemove', (e) => {
            if (tooltipContainer.style.display !== 'none') {
                // Tooltip der Maus folgen lassen
                const x = e.clientX + 15;
                const y = e.clientY + 15;

                // Sicherstellen, dass der Tooltip im sichtbaren Bereich bleibt
                const tooltipWidth = tooltipContainer.offsetWidth;
                const tooltipHeight = tooltipContainer.offsetHeight;
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                // Horizontale Position anpassen
                if (x + tooltipWidth > windowWidth) {
                    tooltipContainer.style.left = (x - tooltipWidth - 30) + 'px';
                } else {
                    tooltipContainer.style.left = x + 'px';
                }

                // Vertikale Position anpassen
                if (y + tooltipHeight > windowHeight) {
                    tooltipContainer.style.top = (y - tooltipHeight - 30) + 'px';
                } else {
                    tooltipContainer.style.top = y + 'px';
                }
            }
        });
    },

    /**
     * Zeigt einen Tooltip an
     * @param {HTMLElement} element - Das Element, für das der Tooltip angezeigt werden soll
     * @param {string} content - Der Inhalt des Tooltips
     */
    showTooltip: function(element, content) {
        const tooltipContainer = document.getElementById('tooltip-container');
        if (!tooltipContainer) return;

        // Tooltip-Inhalt setzen
        tooltipContainer.innerHTML = content;
        tooltipContainer.style.display = 'block';
        tooltipContainer.style.opacity = '1';

        // Event-Listener für das Element
        element.addEventListener('mouseout', () => {
            tooltipContainer.style.display = 'none';
        });
    },

    /**
     * Aktualisiert die Spielerstatistiken in der UI
     */
    updateStats: function() {
        const player = GameEngine.player;
        if (!player) return;

        const statsContainer = document.getElementById('player-stats');
        if (!statsContainer) return;

        // Statistiken formatieren
        let statsHTML = `
            <div class="stat">Name: ${player.name}</div>
            <div class="stat">Klasse: ${this.formatClassName(player.characterClass)}</div>
            <div class="stat">Level: ${player.level}</div>
            <div class="stat">XP: ${Utils.formatNumber(player.experience)} / ${Utils.formatNumber(Config.experienceTable[player.level] || 'Max')}</div>
            <div class="stat">Gold: ${Utils.formatNumber(player.gold)}</div>
            <div class="stat">HP: ${Math.floor(player.hp)} / ${player.maxHp}</div>
        `;

        if (player.maxMana > 0) {
            statsHTML += `<div class="stat">Mana: ${Math.floor(player.mana)} / ${player.maxMana}</div>`;
        }

        statsHTML += `
            <div class="stat">Stärke: ${player.strength}</div>
            <div class="stat">Verteidigung: ${player.defense}</div>
            <div class="stat">Magie: ${player.magic}</div>
            <div class="stat">Geschwindigkeit: ${player.speed}</div>
        `;

        // Statuseffekte anzeigen
        if (player.statusEffects.length > 0) {
            statsHTML += '<div class="stat status-effects">Status: ';
            player.statusEffects.forEach((effect, index) => {
                const effectClass = this.getStatusEffectClass(effect.effect);
                statsHTML += `<span class="${effectClass}" title="${effect.name}: ${Utils.formatDuration(effect.duration)}">${effect.name}</span>`;
                if (index < player.statusEffects.length - 1) {
                    statsHTML += ', ';
                }
            });
            statsHTML += '</div>';
        }

        // Aktiver Begleiter
        if (player.activeCompanion) {
            statsHTML += `<div class="stat">Begleiter: ${player.activeCompanion.icon} ${player.activeCompanion.name}</div>`;
        }

        statsContainer.innerHTML = statsHTML;
    },

    /**
     * Formatiert den Klassennamen
     * @param {string} className - Der Klassenname
     * @returns {string} Der formatierte Klassenname
     */
    formatClassName: function(className) {
        switch (className) {
            case 'warrior': return 'Krieger';
            case 'rogue': return 'Schurke';
            case 'mage': return 'Magier';
            default: return className;
        }
    },

    /**
     * Gibt eine CSS-Klasse für einen Statuseffekt zurück
     * @param {string} effectType - Typ des Statuseffekts
     * @returns {string} CSS-Klasse
     */
    getStatusEffectClass: function(effectType) {
        switch (effectType) {
            case 'poison': return 'effect-poison';
            case 'fire': return 'effect-fire';
            case 'ice': return 'effect-ice';
            case 'stun': return 'effect-stun';
            case 'strengthBoost': return 'effect-buff';
            case 'strengthReduction': return 'effect-debuff';
            case 'defenseBoost': return 'effect-buff';
            case 'defenseReduction': return 'effect-debuff';
            case 'magicBoost': return 'effect-buff';
            case 'magicReduction': return 'effect-debuff';
            case 'speedBoost': return 'effect-buff';
            case 'speedReduction': return 'effect-debuff';
            default: return '';
        }
    },

    /**
     * Fügt eine Nachricht zum Spiellog hinzu
     * @param {string} message - Die Nachricht
     * @param {string} type - Typ der Nachricht (info, success, danger, etc.)
     */
    addMessage: function(message, type = 'info') {
        const gameLog = document.getElementById('game-log');
        if (!gameLog) return;

        // Nachricht erstellen
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.innerHTML = message;

        // Nachricht zum Log hinzufügen
        gameLog.appendChild(messageElement);

        // Zum Ende scrollen
        gameLog.scrollTop = gameLog.scrollHeight;
    },

    /**
     * Löscht alle Nachrichten im Spiellog
     */
    clearMessages: function() {
        const gameLog = document.getElementById('game-log');
        if (gameLog) {
            gameLog.innerHTML = '';
        }
    },

    /**
     * Fügt eine Aktionsschaltfläche hinzu
     * @param {string} text - Text der Schaltfläche
     * @param {Function} callback - Callback-Funktion
     * @param {string} style - Stil der Schaltfläche (primary, secondary, danger, etc.)
     * @returns {HTMLButtonElement} Die erstellte Schaltfläche
     */
    addAction: function(text, callback, style = '') {
        const actionButtons = document.getElementById('action-buttons');
        if (!actionButtons) return null;

        // Schaltfläche erstellen
        const button = document.createElement('button');
        button.className = `action-btn ${style}`;
        button.textContent = text;
        button.onclick = callback;

        // Schaltfläche hinzufügen
        actionButtons.appendChild(button);

        // Schaltfläche zurückgeben, damit sie weiter manipuliert werden kann
        return button;
    },

    /**
     * Löscht alle Aktionsschaltflächen
     */
    clearActions: function() {
        const actionButtons = document.getElementById('action-buttons');
        if (actionButtons) {
            actionButtons.innerHTML = '';
        }
    },

    /**
     * Deaktiviert alle Aktionsschaltflächen
     */
    disableActions: function() {
        const buttons = document.querySelectorAll('#action-buttons button');
        buttons.forEach(button => {
            button.disabled = true;
        });
    },

    /**
     * Aktiviert alle Aktionsschaltflächen
     */
    enableActions: function() {
        const buttons = document.querySelectorAll('#action-buttons button');
        buttons.forEach(button => {
            button.disabled = false;
        });
    }
};
