export default class HealthBar {
    private bar: Phaser.GameObjects.Graphics;
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private maxHealth: number;
    private currentHealth: number;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number = 200, height: number = 20) {
        this.bar = scene.add.graphics();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.maxHealth = 100;
        this.currentHealth = 100;
        this.draw();
    }

    setMaxHealth(maxHealth: number): void {
        this.maxHealth = maxHealth;
        this.currentHealth = Math.min(this.currentHealth, maxHealth);
        this.draw();
    }

    setHealth(amount: number): void {
        this.currentHealth = Phaser.Math.Clamp(amount, 0, this.maxHealth);
        this.draw();
    }

    private draw(): void {
        this.bar.clear();

        // Draw background
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, this.width, this.height);

        // Calculate health width
        const healthWidth = Math.floor(this.width * (this.currentHealth / this.maxHealth));

        // Draw health
        if (this.currentHealth / this.maxHealth > 0.6) {
            this.bar.fillStyle(0x00ff00); // Green for high health
        } else if (this.currentHealth / this.maxHealth > 0.3) {
            this.bar.fillStyle(0xffff00); // Yellow for medium health
        } else {
            this.bar.fillStyle(0xff0000); // Red for low health
        }
        this.bar.fillRect(this.x + 1, this.y + 1, healthWidth - 2, this.height - 2);
    }
}