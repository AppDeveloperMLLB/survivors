import { ENEMY_TYPES, EnemyConfig } from './EnemyTypes';
import Enemy from '../Enemy';

export default class EnemyFactory {
    private static difficulty: number = 1;
    private static waveNumber: number = 1;

    static createEnemy(scene: Phaser.Scene, x: number, y: number, target: Phaser.Physics.Arcade.Sprite): Enemy {
        const enemyType = this.selectEnemyType();
        return new Enemy(scene, x, y, 'enemy', target, enemyType);
    }

    private static selectEnemyType(): EnemyConfig {
        const roll = Math.random() * 100;
        
        // Boss spawning logic
        if (this.waveNumber % 5 === 0 && Math.random() < 0.1) {
            return ENEMY_TYPES.BOSS_SLIME;
        }

        // Normal enemy selection
        if (roll < 40) {
            return ENEMY_TYPES.SLIME;
        } else if (roll < 60) {
            return ENEMY_TYPES.FAST_SLIME;
        } else if (roll < 80) {
            return ENEMY_TYPES.GHOST;
        } else {
            return ENEMY_TYPES.TANK_SLIME;
        }
    }

    static increaseDifficulty(): void {
        this.difficulty += 0.1;
        this.waveNumber++;
    }

    static getWaveNumber(): number {
        return this.waveNumber;
    }
}