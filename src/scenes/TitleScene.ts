export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
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
        const startButton = this.add.text(width / 2, height * 2 / 3, 'Click to Start', {
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

        // Start game on click
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}