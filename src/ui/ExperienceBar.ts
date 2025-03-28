export default class ExperienceBar {
    private bar: Phaser.GameObjects.Graphics;
    private currentXP: number = 0;
    private nextLevelXP: number = 100;
    private level: number = 1;
    private text: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        this.bar = scene.add.graphics();
        this.text = scene.add.text(10, 40, 'Level 1', {
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.draw();
    }

    addExperience(amount: number): void {
        this.currentXP += amount;
        if (this.currentXP >= this.nextLevelXP) {
            this.levelUp();
        }
        this.draw();
    }

    private levelUp(): void {
        this.currentXP -= this.nextLevelXP;
        this.level++;
        this.nextLevelXP = Math.floor(this.nextLevelXP * 1.2); // 20% increase per level
        this.text.setText(`Level ${this.level}`);
    }

    getLevel(): number {
        return this.level;
    }

    private draw(): void {
        this.bar.clear();

        // Draw background
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(10, 30, 200, 6);

        // Draw XP progress
        const progress = (this.currentXP / this.nextLevelXP);
        this.bar.fillStyle(0x00ffff);
        this.bar.fillRect(11, 31, 198 * progress, 4);
    }
}