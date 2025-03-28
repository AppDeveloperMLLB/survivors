import { EnemyConfig } from './EnemyTypes';

export interface BossAttackPattern {
    name: string;
    cooldown: number;
    execute: (boss: Boss) => void;
}

export default class Boss extends Phaser.Physics.Arcade.Sprite {
    private target: Phaser.Physics.Arcade.Sprite;
    private config: EnemyConfig;
    private currentHealth: number;
    private lastAttackTime: { [key: string]: number } = {};
    private attackPatterns: BossAttackPattern[];
    private currentPhase: number = 1;
    private readonly PHASE_THRESHOLD = 0.5; // 50%のHPで第2フェーズに移行

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        target: Phaser.Physics.Arcade.Sprite,
        config: EnemyConfig
    ) {
        super(scene, x, y, texture);
        this.target = target;
        this.config = config;
        this.currentHealth = config.health;
        
        // ボスの基本攻撃パターンを設定
        this.attackPatterns = [
            {
                name: 'Rush',
                cooldown: 5000,
                execute: () => this.rushAttack()
            },
            {
                name: 'SummonMinions',
                cooldown: 15000,
                execute: () => this.summonMinions()
            },
            {
                name: 'CircularAttack',
                cooldown: 8000,
                execute: () => this.circularAttack()
            }
        ];

        // スケールとカラーを設定
        this.setScale(config.scale || 2);
        this.setTint(config.color || 0xFFFFFF);

        // 物理演算を有効化
        scene.physics.add.existing(this);
        scene.add.existing(this);

        // ワールドの境界との衝突を設定
        this.setCollideWorldBounds(true);
    }

    takeDamage(amount: number): void {
        this.currentHealth -= amount;
        
        // HPに応じてフェーズを変更
        if (this.currentHealth / this.config.health <= this.PHASE_THRESHOLD && this.currentPhase === 1) {
            this.enterPhase2();
        }

        if (this.currentHealth <= 0) {
            this.onDeath();
        }
    }

    private enterPhase2(): void {
        this.currentPhase = 2;
        this.setTint(0xFF0000); // 赤色に変化
        this.config.speed *= 1.5; // 移動速度上昇
        
        // 新しい攻撃パターンを追加
        this.attackPatterns.push({
            name: 'RageMode',
            cooldown: 20000,
            execute: () => this.rageMode()
        });
    }

    private onDeath(): void {
        // 死亡時の報酬やエフェクトを実装
        const emitter = this.scene.add.particles(0, 0, 'enemy', {
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000
        });
        
        emitter.explode(20, this.x, this.y);
        
        // 経験値やアイテムのドロップ処理をここに追加
        
        this.destroy();
    }

    private rushAttack(): void {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        const velocity = 300;
        this.setVelocity(
            Math.cos(angle) * velocity,
            Math.sin(angle) * velocity
        );
        
        // 1秒後に通常の移動に戻る
        this.scene.time.delayedCall(1000, () => {
            if (this.active) {
                this.setVelocity(0);
            }
        });
    }

    private summonMinions(): void {
        const positions = [
            { x: -50, y: -50 },
            { x: 50, y: -50 },
            { x: -50, y: 50 },
            { x: 50, y: 50 }
        ];

        positions.forEach(pos => {
            const enemyConfig = {
                key: 'minion',
                health: 30,
                speed: 120,
                damage: 5,
                experienceValue: 5,
                scale: 0.8,
                color: 0xFF00FF
            };

            const enemy = new Boss(
                this.scene,
                this.x + pos.x,
                this.y + pos.y,
                'enemy',
                this.target,
                enemyConfig
            );
            
            (this.scene as any).enemies.add(enemy);
        });
    }

    private circularAttack(): void {
        const projectileCount = 8;
        const angleStep = (Math.PI * 2) / projectileCount;
        const velocity = 150;

        for (let i = 0; i < projectileCount; i++) {
            const angle = angleStep * i;
            const projectile = this.scene.physics.add.sprite(this.x, this.y, 'enemy')
                .setScale(0.5)
                .setTint(0xFF0000);

            projectile.setVelocity(
                Math.cos(angle) * velocity,
                Math.sin(angle) * velocity
            );

            // 3秒後に消滅
            this.scene.time.delayedCall(3000, () => {
                projectile.destroy();
            });
        }
    }

    private rageMode(): void {
        const originalSpeed = this.config.speed;
        const originalScale = this.scale;
        
        // 一時的なパワーアップ
        this.config.speed *= 2;
        this.setScale(this.scale * 1.5);
        this.setTint(0xFF0000);

        // 全ての攻撃パターンを即座に実行
        this.attackPatterns.forEach(pattern => {
            if (pattern.name !== 'RageMode') {
                pattern.execute(this);
            }
        });

        // 10秒後に元に戻る
        this.scene.time.delayedCall(10000, () => {
            if (this.active) {
                this.config.speed = originalSpeed;
                this.setScale(originalScale);
                this.setTint(0xFFFFFF);
            }
        });
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        const body = this.body as Phaser.Physics.Arcade.Body | null;
        if (body && body.velocity.x === 0 && body.velocity.y === 0) {
            // 通常移動（ターゲットに向かって移動）
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
            this.setVelocity(
                Math.cos(angle) * this.config.speed,
                Math.sin(angle) * this.config.speed
            );
        }

        // 攻撃パターンの実行
        this.attackPatterns.forEach(pattern => {
            const lastTime = this.lastAttackTime[pattern.name] || 0;
            if (time - lastTime >= pattern.cooldown) {
                pattern.execute(this);
                this.lastAttackTime[pattern.name] = time;
            }
        });
    }
}