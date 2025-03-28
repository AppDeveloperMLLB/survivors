import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    private target: Phaser.Physics.Arcade.Sprite;
    private moveSpeed: number = 100;
    private health: number = 100;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, target: Phaser.Physics.Arcade.Sprite) {
        super(scene, x, y, texture);
        this.target = target;

        // Enable physics
        scene.physics.add.existing(this);
        
        // Add to scene
        scene.add.existing(this);

        // Set collision boundary
        this.setCollideWorldBounds(true);
    }

    takeDamage(amount: number): void {
        this.health -= amount;
        if (this.health <= 0) {
            this.destroy();
        }
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        // Calculate direction to player
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const angle = Math.atan2(dy, dx);

        // Set velocity based on direction
        this.setVelocity(
            Math.cos(angle) * this.moveSpeed,
            Math.sin(angle) * this.moveSpeed
        );
    }
}