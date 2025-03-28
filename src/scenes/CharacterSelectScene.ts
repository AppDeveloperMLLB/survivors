import { PLAYER_CHARACTERS, PlayerCharacterConfig } from '../player/PlayerCharacters';

export default class CharacterSelectScene extends Phaser.Scene {
    private selectedCharacter: PlayerCharacterConfig | null = null;

    constructor() {
        super({ key: 'CharacterSelectScene' });
    }

    create() {
        const { width, height } = this.game.canvas;

        // Title
        this.add.text(width / 2, height * 0.15, 'Select Your Character', {
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Create character selection cards
        const characters = Object.values(PLAYER_CHARACTERS);
        const spacing = width / (characters.length + 1);

        characters.forEach((character, index) => {
            const x = spacing * (index + 1);
            const y = height * 0.5;
            this.createCharacterCard(x, y, character);
        });

        // Back button
        const backButton = this.add.text(50, 30, '< Back', {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        })
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('TitleScene');
        });

        // Hover effects
        [backButton].forEach(button => {
            button.on('pointerover', () => button.setScale(1.1));
            button.on('pointerout', () => button.setScale(1));
        });
    }

    private createCharacterCard(x: number, y: number, character: PlayerCharacterConfig) {
        const cardWidth = 200;
        const cardHeight = 300;
        
        const container = this.add.container(x, y);
        
        // Card background
        const background = this.add.rectangle(0, 0, cardWidth, cardHeight, 0x333333)
            .setInteractive()
            .on('pointerover', () => {
                background.setFillStyle(0x444444);
                container.setScale(1.05);
            })
            .on('pointerout', () => {
                background.setFillStyle(0x333333);
                container.setScale(1);
            })
            .on('pointerdown', () => {
                this.selectedCharacter = character;
                this.scene.start('GameScene', { selectedCharacter: character });
            });

        // Character name
        const nameText = this.add.text(0, -cardHeight * 0.35, character.name, {
            fontSize: '24px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Character description
        const descText = this.add.text(0, -cardHeight * 0.2, character.description, {
            fontSize: '16px',
            color: '#cccccc',
            align: 'center',
            wordWrap: { width: cardWidth - 20 }
        }).setOrigin(0.5);

        // Stats display
        const stats = [
            `Health: ${character.baseStats.health}`,
            `Speed: ${character.baseStats.speed}`,
            `Damage: ${character.baseStats.damage}`
        ];
        const statsText = this.add.text(0, 0, stats, {
            fontSize: '14px',
            color: '#ffffff',
            align: 'left'
        }).setOrigin(0.5);

        // Special ability
        if (character.specialAbility) {
            const abilityText = this.add.text(0, cardHeight * 0.25, [
                character.specialAbility.name,
                character.specialAbility.description
            ], {
                fontSize: '14px',
                color: '#ffff00',
                align: 'center',
                wordWrap: { width: cardWidth - 20 }
            }).setOrigin(0.5);
            container.add(abilityText);
        }

        container.add([background, nameText, descText, statsText]);
    }
}