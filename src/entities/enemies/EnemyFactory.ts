import { ENEMY_TYPES, EnemyConfig } from './EnemyTypes';
import Enemy from '../Enemy';
import Boss from './Boss';

export default class EnemyFactory {
    private static difficulty: number = 1;
    private static waveNumber: number = 1;

    static createEnemy(scene: Phaser.Scene, x: number, y: number, target: Phaser.Physics.Arcade.Sprite): Enemy | Boss {
        const enemyType = this.selectEnemyType();

        // ボスキャラクターの場合
        if (enemyType.key === 'boss_slime') {
            return new Boss(scene, x, y, 'enemy', target, enemyType);
        }

        // 通常の敵キャラクターの場合
        return new Enemy(scene, x, y, 'enemy', target, enemyType);
    }

    private static selectEnemyType(): EnemyConfig {
        const roll = Math.random() * 100;
        
        // ボス出現条件をチェック
        if (this.waveNumber >= 5 && this.waveNumber % 5 === 0 && Math.random() < 0.1) {
            const bossConfig = { ...ENEMY_TYPES.BOSS_SLIME };
            // 難易度に応じてボスを強化
            bossConfig.health *= this.difficulty;
            bossConfig.damage *= this.difficulty;
            return bossConfig;
        }

        // 通常の敵キャラクター選択
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