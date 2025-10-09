/**
 * TalentTreeUI-Modul für Dungeon of Echoes
 * Verwaltet die Benutzeroberfläche für den Talentbaum
 * Version: 2.0.2
 */

const TalentTreeUI = {
    /**
     * Initialisiert die Benutzeroberfläche für den Talentbaum
     */
    init: function() {
        // Modal-Element abrufen
        this.modal = document.getElementById('talent-tree-modal');
        this.modalContent = document.querySelector('#talent-tree-modal .modal-content');
        this.closeButton = document.querySelector('#talent-tree-modal .close');
        
        // Event-Listener für das Schließen des Modals
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.hideModal();
            });
        }
        
        // Event-Listener für Klicks außerhalb des Modals
        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.hideModal();
            }
        });
    },
    
    /**
     * Zeigt den Talentbaum an
     */
    showTalentTree: function() {
        const player = GameEngine.player;
        if (!player) return;
        
        // Container für den Talentbaum abrufen
        const container = document.getElementById('talent-tree-container');
        if (!container) return;
        
        // Container leeren
        container.innerHTML = '';
        
        // Talentpunkte anzeigen
        const talentPoints = player.talentPoints || 0;
        const talentPointsElement = document.createElement('div');
        talentPointsElement.className = 'talent-points';
        talentPointsElement.textContent = `Verfügbare Talentpunkte: ${talentPoints}`;
        container.appendChild(talentPointsElement);
        
        // Talentbäume für jede Klasse erstellen
        this.createClassTalentTree(container, player);
        
        // Modal anzeigen
        this.showModal();
    },
    
    /**
     * Erstellt den Talentbaum für eine Klasse
     * @param {HTMLElement} container - Container für den Talentbaum
     * @param {Player} player - Der Spieler
     */
    createClassTalentTree: function(container, player) {
        // Talentbaum-Container erstellen
        const treeContainer = document.createElement('div');
        treeContainer.className = 'talent-tree-class';
        
        // Titel hinzufügen
        const title = document.createElement('h3');
        title.className = 'talent-tree-title';
        title.textContent = this.formatClassName(player.characterClass);
        treeContainer.appendChild(title);
        
        // Talentbaum-Grid erstellen
        const grid = document.createElement('div');
        grid.className = 'talent-tree-grid';
        
        // Talente basierend auf der Klasse laden
        const talents = this.getTalentsForClass(player.characterClass);
        
        // Talente zum Grid hinzufügen
        talents.forEach((talent, index) => {
            const node = this.createTalentNode(talent, player);
            grid.appendChild(node);
        });
        
        treeContainer.appendChild(grid);
        container.appendChild(treeContainer);
    },
    
    /**
     * Erstellt einen Talentknoten
     * @param {Object} talent - Das Talent
     * @param {Player} player - Der Spieler
     * @returns {HTMLElement} Der Talentknoten
     */
    createTalentNode: function(talent, player) {
        const node = document.createElement('div');
        node.className = 'talent-node';
        
        // Prüfen, ob das Talent verfügbar ist
        const isAvailable = this.isTalentAvailable(talent, player);
        const isSelected = this.isTalentSelected(talent, player);
        
        if (isSelected) {
            node.classList.add('selected');
        } else if (isAvailable) {
            node.classList.add('available');
        } else {
            node.classList.add('unavailable');
        }
        
        // Talent-Icon
        const icon = document.createElement('div');
        icon.className = 'talent-icon';
        icon.textContent = talent.icon || '✨';
        node.appendChild(icon);
        
        // Talent-Name
        const name = document.createElement('div');
        name.className = 'talent-name';
        name.textContent = talent.name;
        node.appendChild(name);
        
        // Tooltip hinzufügen
        node.addEventListener('mouseover', () => {
            GameUI.showTooltip(node, this.createTalentTooltip(talent, isAvailable, isSelected));
        });
        
        // Klick-Handler
        node.addEventListener('click', () => {
            if (isAvailable && !isSelected && player.talentPoints > 0) {
                this.selectTalent(talent, player);
                this.showTalentTree(); // Talentbaum aktualisieren
            }
        });
        
        return node;
    },
    
    /**
     * Prüft, ob ein Talent verfügbar ist
     * @param {Object} talent - Das Talent
     * @param {Player} player - Der Spieler
     * @returns {boolean} true, wenn das Talent verfügbar ist
     */
    isTalentAvailable: function(talent, player) {
        // Prüfen, ob die Voraussetzungen erfüllt sind
        if (talent.requires) {
            // Prüfen, ob alle erforderlichen Talente ausgewählt sind
            for (const requiredTalent of talent.requires) {
                if (!this.isTalentSelected({ id: requiredTalent }, player)) {
                    return false;
                }
            }
        }
        
        // Prüfen, ob das Level ausreichend ist
        if (talent.requiredLevel && player.level < talent.requiredLevel) {
            return false;
        }
        
        return true;
    },
    
    /**
     * Prüft, ob ein Talent ausgewählt ist
     * @param {Object} talent - Das Talent
     * @param {Player} player - Der Spieler
     * @returns {boolean} true, wenn das Talent ausgewählt ist
     */
    isTalentSelected: function(talent, player) {
        // Prüfen, ob das Talent in den ausgewählten Talenten des Spielers ist
        return player.selectedTalents && player.selectedTalents.includes(talent.id);
    },
    
    /**
     * Wählt ein Talent aus
     * @param {Object} talent - Das Talent
     * @param {Player} player - Der Spieler
     */
    selectTalent: function(talent, player) {
        // Sicherstellen, dass der Spieler Talentpunkte hat
        if (!player.talentPoints || player.talentPoints <= 0) {
            GameUI.addMessage('Du hast keine Talentpunkte mehr.', 'danger');
            return;
        }
        
        // Sicherstellen, dass der Spieler ein selectedTalents-Array hat
        if (!player.selectedTalents) {
            player.selectedTalents = [];
        }
        
        // Talent hinzufügen
        player.selectedTalents.push(talent.id);
        
        // Talentpunkt abziehen
        player.talentPoints--;
        
        // Talent-Effekt anwenden
        this.applyTalentEffect(talent, player);
        
        // Nachricht anzeigen
        GameUI.addMessage(`Du hast das Talent "${talent.name}" erlernt!`, 'success');
        
        // Event auslösen
        EventSystem.emit('talentSelected', talent);
    },
    
    /**
     * Wendet den Effekt eines Talents an
     * @param {Object} talent - Das Talent
     * @param {Player} player - Der Spieler
     */
    applyTalentEffect: function(talent, player) {
        if (!talent.effect) return;
        
        switch (talent.effect.type) {
            case 'statBoost':
                // Attribut erhöhen
                if (talent.effect.stat && talent.effect.value) {
                    player[talent.effect.stat] += talent.effect.value;
                }
                break;
                
            case 'abilityUnlock':
                // Fähigkeit freischalten
                if (talent.effect.ability) {
                    player.addAbility(talent.effect.ability);
                }
                break;
                
            case 'passiveEffect':
                // Passiven Effekt hinzufügen
                if (!player.passiveEffects) {
                    player.passiveEffects = [];
                }
                player.passiveEffects.push(talent.effect);
                break;
        }
        
        // Spielerattribute aktualisieren
        player.updateStats();
    },
    
    /**
     * Erstellt einen Tooltip für ein Talent
     * @param {Object} talent - Das Talent
     * @param {boolean} isAvailable - Gibt an, ob das Talent verfügbar ist
     * @param {boolean} isSelected - Gibt an, ob das Talent ausgewählt ist
     * @returns {string} HTML-Code für den Tooltip
     */
    createTalentTooltip: function(talent, isAvailable, isSelected) {
        let html = `<div class="tooltip-title">${talent.name}</div>`;
        html += `<div class="tooltip-description">${talent.description || 'Keine Beschreibung verfügbar.'}</div>`;
        
        if (talent.effect) {
            html += '<div class="tooltip-stats">';
            
            switch (talent.effect.type) {
                case 'statBoost':
                    const statName = {
                        'strength': 'Stärke',
                        'defense': 'Verteidigung',
                        'magic': 'Magie',
                        'speed': 'Geschwindigkeit',
                        'maxHp': 'Max. HP',
                        'maxMana': 'Max. Mana'
                    }[talent.effect.stat] || talent.effect.stat;
                    
                    html += `<div>${statName}: +${talent.effect.value}</div>`;
                    break;
                    
                case 'abilityUnlock':
                    html += `<div>Schaltet die Fähigkeit "${talent.effect.ability.name}" frei</div>`;
                    break;
                    
                case 'passiveEffect':
                    html += `<div>${talent.effect.description}</div>`;
                    break;
            }
            
            html += '</div>';
        }
        
        if (talent.requiredLevel) {
            html += `<div class="tooltip-requirement">Benötigtes Level: ${talent.requiredLevel}</div>`;
        }
        
        if (talent.requires && talent.requires.length > 0) {
            html += '<div class="tooltip-requirement">Benötigt: ';
            talent.requires.forEach((req, index) => {
                html += req;
                if (index < talent.requires.length - 1) {
                    html += ', ';
                }
            });
            html += '</div>';
        }
        
        if (isSelected) {
            html += '<div class="tooltip-status">Status: Erlernt</div>';
        } else if (isAvailable) {
            html += '<div class="tooltip-status">Status: Verfügbar</div>';
        } else {
            html += '<div class="tooltip-status">Status: Nicht verfügbar</div>';
        }
        
        return html;
    },
    
    /**
     * Gibt Talente für eine Klasse zurück
     * @param {string} className - Name der Klasse
     * @returns {Array} Array mit Talenten
     */
    getTalentsForClass: function(className) {
        // Hier würden normalerweise die Talente aus einer Datenbank oder Konfiguration geladen
        // Für dieses Beispiel verwenden wir Dummy-Daten
        const talents = {
            warrior: [
                {
                    id: 'warrior_strength',
                    name: 'Erhöhte Stärke',
                    description: 'Erhöht deine Stärke permanent.',
                    icon: '💪',
                    effect: {
                        type: 'statBoost',
                        stat: 'strength',
                        value: 2
                    }
                },
                {
                    id: 'warrior_defense',
                    name: 'Verbesserte Verteidigung',
                    description: 'Erhöht deine Verteidigung permanent.',
                    icon: '🛡️',
                    effect: {
                        type: 'statBoost',
                        stat: 'defense',
                        value: 2
                    },
                    requires: ['warrior_strength'],
                    requiredLevel: 3
                },
                {
                    id: 'warrior_health',
                    name: 'Eiserne Gesundheit',
                    description: 'Erhöht deine maximalen Lebenspunkte.',
                    icon: '❤️',
                    effect: {
                        type: 'statBoost',
                        stat: 'maxHp',
                        value: 10
                    },
                    requiredLevel: 2
                },
                {
                    id: 'warrior_slam',
                    name: 'Mächtiger Schlag',
                    description: 'Ein kraftvoller Angriff, der hohen Schaden verursacht.',
                    icon: '⚔️',
                    effect: {
                        type: 'abilityUnlock',
                        ability: {
                            name: 'Mächtiger Schlag',
                            description: 'Ein kraftvoller Angriff, der hohen Schaden verursacht.',
                            damage: 15,
                            manaCost: 5,
                            cooldown: 3,
                            icon: '⚔️'
                        }
                    },
                    requires: ['warrior_strength'],
                    requiredLevel: 5
                },
                {
                    id: 'warrior_taunt',
                    name: 'Provokation',
                    description: 'Provoziere Gegner, um ihre Aufmerksamkeit auf dich zu lenken.',
                    icon: '😠',
                    effect: {
                        type: 'abilityUnlock',
                        ability: {
                            name: 'Provokation',
                            description: 'Provoziere Gegner, um ihre Aufmerksamkeit auf dich zu lenken.',
                            manaCost: 3,
                            cooldown: 2,
                            icon: '😠'
                        }
                    },
                    requiredLevel: 4
                }
            ],
            rogue: [
                // Schurken-Talente hier einfügen
            ],
            mage: [
                // Magier-Talente hier einfügen
            ]
        };
        
        return talents[className] || [];
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
     * Zeigt das Modal an
     */
    showModal: function() {
        if (this.modal) {
            this.modal.style.display = 'block';
        }
    },
    
    /**
     * Versteckt das Modal
     */
    hideModal: function() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
    }
};
