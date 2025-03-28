import Phaser from 'phaser';
import { EnemyConfig } from './enemies/EnemyTypes';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    private target: Phaser.Physics.Arcade.Sprite;
    private config: EnemyConfig;
    private currentHealth: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, target: Phaser.Physics.Arcade.Sprite, config: EnemyConfig) {
        super(scene, x, y, texture);
        this.target = target;
        this.config = config;
        this.currentHealth = config.health;

        // Enable physics
        scene.physics.add.existing(this);
        
        // Add to scene
        scene.add.existing(this);

        // Set collision boundary
        this.setCollideWorldBounds(true);

        // Apply enemy configuration
        this.setScale(config.scale || 1);
        if (config.color) {
            this.setTint(config.color);
        }
    }

    getCurrentHealth(): number {
        return this.currentHealth;
    }

    getMaxHealth(): number {
        return this.config.health;
    }

    takeDamage(amount: number): void {
        this.currentHealth -= amount;
        if (this.currentHealth <= 0) {
            this.destroy();
        }
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        // Calculate direction to player
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const angle = Math.atan2(dy, dx);

        // Set velocity based on direction using config speed
        this.setVelocity(
            Math.cos(angle) * this.config.speed,
            Math.sin(angle) * this.config.speed
        );
    }
}