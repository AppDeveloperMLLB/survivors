export default class PlayerStats {
    private level: number = 1;
    private experience: number = 0;
    private experienceToNextLevel: number = 100;
    private baseStats = {
        health: 100,
        speed: 200,
        damage: 10
    };
    private statModifiers = {
        health: 1,
        speed: 1,
        damage: 1
    };

    addExperience(amount: number): boolean {
        this.experience += amount;
        if (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
            return true;
        }
        return false;
    }

    private levelUp(): void {
        this.level++;
        this.experience -= this.experienceToNextLevel;
        this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.2);
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
}
