export interface EnemyConfig {
    key: string;
    health: number;
    speed: number;
    damage: number;
    experienceValue: number;
    scale?: number;
    color?: number;
}

export const ENEMY_TYPES: { [key: string]: EnemyConfig } = {
    SLIME: {
        key: 'slime',
        health: 30,
        speed: 100,
        damage: 10,
        experienceValue: 10,
        color: 0x00ff00
    },
    FAST_SLIME: {
        key: 'fast_slime',
        health: 20,
        speed: 200,
        damage: 5,
        experienceValue: 15,
        color: 0x00ffff,
        scale: 0.8
    },
    TANK_SLIME: {
        key: 'tank_slime',
        health: 100,
        speed: 50,
        damage: 20,
        experienceValue: 30,
        color: 0xff0000,
        scale: 1.2
    },
    GHOST: {
        key: 'ghost',
        health: 40,
        speed: 150,
        damage: 15,
        experienceValue: 20,
        color: 0xcccccc,
        scale: 0.9
    },
    BOSS_SLIME: {
        key: 'boss_slime',
        health: 500,
        speed: 80,
        damage: 40,
        experienceValue: 100,
        color: 0xff00ff,
        scale: 2
    }
};