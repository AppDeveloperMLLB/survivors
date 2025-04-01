import { PlayerCharacterConfig } from './PlayerCharacters';

export default class PlayerStats {
    private level: number = 1;
    private experience: number = 0;
    private experienceToNextLevel: number = 100;
    private baseStats: {
        health: number;
        speed: number;
        damage: number;
    };
    private statModifiers = {
        health: 1,
        speed: 1,
        damage: 1
    };
    private currentHealth: number;
    private character: PlayerCharacterConfig;

    constructor(character: PlayerCharacterConfig) {
        this.character = character;
        this.baseStats = { ...character.baseStats };
        this.currentHealth = this.getMaxHealth();
    }

    getMaxHealth(): number {
        return this.baseStats.health * this.statModifiers.health;
    }

    getCurrentHealth(): number {
        return this.currentHealth;
    }

    setHealth(amount: number): void {
        const maxHealth = this.getMaxHealth();
        this.currentHealth = Phaser.Math.Clamp(amount, 0, maxHealth);
    }

    takeDamage(amount: number): void {
        this.setHealth(this.currentHealth - amount);
    }

    heal(amount: number): void {
        this.setHealth(this.currentHealth + amount);
    }

    addExperience(amount: number): number {
        this.experience += amount;
        let levelUps = 0;

        while (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
            levelUps++;
        }

        return levelUps;
    }

    private levelUp(): void {
        this.level++;
        this.experience -= this.experienceToNextLevel;
        this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.2);
        
        // Apply character's special ability if exists
        if (this.character.specialAbility) {
            this.character.specialAbility.effect(this);
        }

        // Heal to full on level up
        this.heal(this.getMaxHealth());
    }

    getLevel(): number {
        return this.level;
    }

    getExperience(): number {
        return this.experience;
    }

    getExperienceToNextLevel(): number {
        return this.experienceToNextLevel;
    }

    getExperienceProgress(): number {
        return this.experience / this.experienceToNextLevel;
    }

    getStat(stat: keyof typeof this.baseStats): number {
        if (stat === 'health') {
            return this.currentHealth;
        }
        return this.baseStats[stat] * this.statModifiers[stat];
    }

    modifyStat(stat: keyof typeof this.baseStats, modifier: number): void {
        const oldMaxHealth = this.getMaxHealth();
        this.statModifiers[stat] *= modifier;
        
        // If health modifier changed, adjust current health proportionally
        if (stat === 'health') {
            const newMaxHealth = this.getMaxHealth();
            this.currentHealth = (this.currentHealth / oldMaxHealth) * newMaxHealth;
        }
    }

    getCharacter(): PlayerCharacterConfig {
        return this.character;
    }
}