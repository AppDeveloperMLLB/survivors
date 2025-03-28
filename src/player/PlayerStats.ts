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
    private character: PlayerCharacterConfig;

    constructor(character: PlayerCharacterConfig) {
        this.character = character;
        this.baseStats = { ...character.baseStats };
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
        return this.baseStats[stat] * this.statModifiers[stat];
    }

    modifyStat(stat: keyof typeof this.baseStats, modifier: number): void {
        this.statModifiers[stat] *= modifier;
    }

    getCharacter(): PlayerCharacterConfig {
        return this.character;
    }
}