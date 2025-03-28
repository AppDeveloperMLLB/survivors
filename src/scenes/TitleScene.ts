export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    preload() {
        // Load game assets that will be used in GameScene
        this.load.setBaseURL(window.location.origin);
        this.load.svg('player', '/assets/player.svg');
        this.load.svg('enemy', '/assets/enemy.svg');
    }

    create() {
        const { width, height } = this.game.canvas;

        // Add title text
        this.add.text(width / 2, height / 3, 'SURVIVORS', {
            fontSize: '64px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Add start button
        const startButton = this.add.text(width / 2, height * 2 / 3, 'Start Game', {
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        })
        .setOrigin(0.5)
        .setInteractive();

        // Add hover effect
        startButton.on('pointerover', () => {
            startButton.setScale(1.1);
        });

        startButton.on('pointerout', () => {
            startButton.setScale(1);
        });

        // Start character selection on click
        startButton.on('pointerdown', () => {
            this.scene.start('CharacterSelectScene');
        });
    }
}