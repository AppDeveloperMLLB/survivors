export interface PlayerCharacterConfig {
    key: string;
    name: string;
    description: string;
    baseStats: {
        health: number;
        speed: number;
        damage: number;
    };
    specialAbility?: {
        name: string;
        description: string;
        effect: (stats: any) => void;
    };
}

export const PLAYER_CHARACTERS: { [key: string]: PlayerCharacterConfig } = {
    WARRIOR: {
        key: 'warrior',
        name: 'Warrior',
        description: 'A balanced fighter with high health',
        baseStats: {
            health: 120,
            speed: 180,
            damage: 12
        },
        specialAbility: {
            name: 'Berserker',
            description: 'Damage increases as health decreases',
            effect: (stats) => {
                const healthPercent = stats.getStat('health') / stats.baseStats.health;
                stats.modifyStat('damage', 1 + (1 - healthPercent) * 0.5);
            }
        }
    },
    SCOUT: {
        key: 'scout',
        name: 'Scout',
        description: 'Fast but fragile',
        baseStats: {
            health: 80,
            speed: 250,
            damage: 8
        },
        specialAbility: {
            name: 'Swift Strike',
            description: 'Higher movement speed increases damage',
            effect: (stats) => {
                const speedMultiplier = stats.getStat('speed') / stats.baseStats.speed;
                stats.modifyStat('damage', speedMultiplier);
            }
        }
    },
    TANK: {
        key: 'tank',
        name: 'Tank',
        description: 'Very tough but slow',
        baseStats: {
            health: 200,
            speed: 150,
            damage: 10
        },
        specialAbility: {
            name: 'Iron Wall',
            description: 'Reduces damage taken when health is low',
            effect: (stats) => {
                const healthPercent = stats.getStat('health') / stats.baseStats.health;
                if (healthPercent < 0.5) {
                    stats.modifyStat('health', 1.2);
                }
            }
        }
    }
};