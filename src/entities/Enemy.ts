import Phaser from 'phaser';
import { EnemyConfig } from './enemies/EnemyTypes';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    private target: Phaser.Physics.Arcade.Sprite;
    private config: EnemyConfig;
    private currentHealth: number;
    private isStunned: boolean = false;
    private stunTimeout: number | null = null;
    private slowFactor: number = 1;
    private slowTimeout: number | null = null;
    private isFrozen: boolean = false;
    private freezeTimeout: number | null = null;
    private damageOverTimeEffects: Map<string, {damage: number, interval: number, remaining: number, timerId: number}> = new Map();

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
    }    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        // Don't move if stunned or frozen
        if (this.isStunned || this.isFrozen) {
            this.setVelocity(0, 0);
            return;
        }

        // Calculate direction to player
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const angle = Math.atan2(dy, dx);

        // Set velocity based on direction using config speed
        this.setVelocity(
            Math.cos(angle) * this.config.speed * this.slowFactor,
            Math.sin(angle) * this.config.speed * this.slowFactor
        );
    }

    /**
     * Stuns the enemy for a specified duration
     */
    stun(duration: number): void {
        this.isStunned = true;
        
        // Clear any existing stun timeout
        if (this.stunTimeout !== null) {
            clearTimeout(this.stunTimeout);
        }
        
        // Set a new timeout to remove stun after duration
        this.stunTimeout = window.setTimeout(() => {
            this.isStunned = false;
            this.stunTimeout = null;
        }, duration * 1000);
    }
    
    /**
     * Slows the enemy movement for a specified duration
     */
    slow(factor: number, duration: number): void {
        this.slowFactor = Math.min(this.slowFactor, 1 - factor);
        
        // Clear any existing slow timeout
        if (this.slowTimeout !== null) {
            clearTimeout(this.slowTimeout);
        }
        
        // Set a new timeout to remove slow after duration
        this.slowTimeout = window.setTimeout(() => {
            this.slowFactor = 1;
            this.slowTimeout = null;
        }, duration * 1000);
    }
    
    /**
     * Freezes the enemy for a specified duration
     */
    freeze(duration: number): void {
        this.isFrozen = true;
        
        // Clear any existing freeze timeout
        if (this.freezeTimeout !== null) {
            clearTimeout(this.freezeTimeout);
        }
        
        // Set a new timeout to remove freeze after duration
        this.freezeTimeout = window.setTimeout(() => {
            this.isFrozen = false;
            this.freezeTimeout = null;
        }, duration * 1000);
    }
    
    /**
     * Apply knockback to the enemy
     */
    knockback(angle: number, power: number): void {
        const speedX = Math.cos(angle) * power;
        const speedY = Math.sin(angle) * power;
        
        this.setVelocity(-speedX, -speedY);
        
        // Reset to normal movement after a short time
        this.scene.time.delayedCall(300, () => {
            if (this.active) {
                this.setVelocity(0, 0);
            }
        });
    }
    
    /**
     * Apply damage over time effect (poison, burn, etc.)
     */
    applyDamageOverTime(type: string, damagePerTick: number, duration: number): void {
        // Remove existing effect of the same type
        this.removeDamageOverTimeEffect(type);
        
        // Calculate number of ticks (damage applied every 0.5 seconds)
        const tickInterval = 500; // milliseconds
        const totalTicks = Math.ceil((duration * 1000) / tickInterval);
        
        // Setup periodic damage
        const timerId = window.setInterval(() => {
            if (!this.active) {
                this.removeDamageOverTimeEffect(type);
                return;
            }
            
            // Apply damage
            this.takeDamage(damagePerTick);
            
            // Show visual feedback
            this.scene.tweens.add({
                targets: this,
                alpha: 0.6,
                duration: 100,
                yoyo: true
            });
            
            // Update remaining ticks
            const effect = this.damageOverTimeEffects.get(type);
            if (effect) {
                effect.remaining--;
                if (effect.remaining <= 0) {
                    this.removeDamageOverTimeEffect(type);
                }
            }
        }, tickInterval);
        
        // Store the effect data
        this.damageOverTimeEffects.set(type, {
            damage: damagePerTick,
            interval: tickInterval,
            remaining: totalTicks,
            timerId: timerId
        });
    }
    
    /**
     * Remove a damage over time effect
     */
    private removeDamageOverTimeEffect(type: string): void {
        const effect = this.damageOverTimeEffects.get(type);
        if (effect) {
            clearInterval(effect.timerId);
            this.damageOverTimeEffects.delete(type);
        }
    }
}