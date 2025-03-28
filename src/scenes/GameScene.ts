import Enemy from '../entities/Enemy';
import HealthBar from '../ui/HealthBar';
import ScoreDisplay from '../ui/ScoreDisplay';
import ExperienceBar from '../ui/ExperienceBar';

export default class GameScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private keys: { [key: string]: Phaser.Input.Keyboard.Key } = {};
    private enemies!: Phaser.GameObjects.Group;
    private playerHealth: number = 100;
    private lastEnemySpawnTime: number = 0;
    private enemySpawnInterval: number = 2000;

    // UI Components
    private healthBar!: HealthBar;
    private scoreDisplay!: ScoreDisplay;
    private experienceBar!: ExperienceBar;
    private isPaused: boolean = false;
    private pauseMenu!: Phaser.GameObjects.Container;

    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Load game assets
        this.load.setBaseURL(window.location.origin);
        this.load.svg('player', '/assets/player.svg');
        this.load.svg('enemy', '/assets/enemy.svg');
    }

    create() {
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);

        // Setup keyboard controls
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.keys = this.input.keyboard!.addKeys('W,S,A,D') as { [key: string]: Phaser.Input.Keyboard.Key };

        // Initialize enemies group
        this.enemies = this.add.group({
            classType: Enemy,
            runChildUpdate: true
        });

        // Setup UI components
        this.healthBar = new HealthBar(this, 10, 10);
        this.scoreDisplay = new ScoreDisplay(this, 10, 70);
        this.experienceBar = new ExperienceBar(this);

        // Setup collision between player and enemies
        this.physics.add.overlap(
            this.player,
            this.enemies,
            (_obj1, _obj2) => {
                this.playerHealth -= 10;
                this.healthBar.setHealth(this.playerHealth);
                if (this.playerHealth <= 0) {
                    this.gameOver();
                }
            },
            undefined,
            this
        );

        // Setup pause functionality
        this.input.keyboard!.addKey('ESC').on('down', () => {
            this.togglePause();
        });

        // Create pause menu (initially hidden)
        this.createPauseMenu();
    }

    private createPauseMenu(): void {
        const { width, height } = this.game.canvas;
        
        this.pauseMenu = this.add.container(0, 0);
        
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        
        const pauseText = this.add.text(width / 2, height / 3, 'PAUSED', {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        const resumeButton = this.add.text(width / 2, height / 2, 'Resume', {
            fontSize: '32px',
            color: '#ffffff'
        })
        .setOrigin(0.5)
        .setInteractive();
        
        const titleButton = this.add.text(width / 2, height / 2 + 50, 'Back to Title', {
            fontSize: '32px',
            color: '#ffffff'
        })
        .setOrigin(0.5)
        .setInteractive();
        
        [resumeButton, titleButton].forEach(button => {
            button.on('pointerover', () => button.setScale(1.1));
            button.on('pointerout', () => button.setScale(1));
        });
        
        resumeButton.on('pointerdown', () => this.togglePause());
        titleButton.on('pointerdown', () => {
            this.scene.start('TitleScene');
        });
        
        this.pauseMenu.add([overlay, pauseText, resumeButton, titleButton]);
        this.pauseMenu.setDepth(1000);
        this.pauseMenu.setVisible(false);
    }

    private togglePause(): void {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.physics.pause();
            this.pauseMenu.setVisible(true);
        } else {
            this.physics.resume();
            this.pauseMenu.setVisible(false);
        }
    }

    private gameOver(): void {
        this.enemies.clear(true, true); // 全ての敵を削除
        this.physics.pause(); // 物理エンジンを停止
        const { width, height } = this.game.canvas;
        
        const gameOverText = this.add.text(width / 2, height / 2, 'GAME OVER', {
            fontSize: '64px',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5).setDepth(1000);
        
        const restartText = this.add.text(width / 2, height / 2 + 80, 'Click to Restart', {
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(1000);
        
        this.input.once('pointerdown', () => {
            gameOverText.destroy();
            restartText.destroy();
            this.scene.restart(); // シーンを再起動
        });
    }

    update(time: number) {
        if (this.isPaused) return;

        const speed = 200;
        this.player.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown || this.keys['A']?.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown || this.keys['D']?.isDown) {
            this.player.setVelocityX(speed);
        }

        // Vertical movement
        if (this.cursors.up.isDown || this.keys['W']?.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down.isDown || this.keys['S']?.isDown) {
            this.player.setVelocityY(speed);
        }

        // Normalize diagonal movement
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        if (body && body.velocity.x !== 0 && body.velocity.y !== 0) {
            body.velocity.normalize().scale(speed);
        }

        // Spawn enemies
        if (time - this.lastEnemySpawnTime >= this.enemySpawnInterval) {
            this.spawnEnemy();
            this.lastEnemySpawnTime = time;
            // Add score when enemy is spawned (temporary)
            this.scoreDisplay.addScore(10);
            // Add experience when enemy is spawned (temporary)
            this.experienceBar.addExperience(20);
        }
    }

    private spawnEnemy() {
        const padding = 50;
        const spawnSide = Phaser.Math.Between(0, 3);
        let x, y;

        switch (spawnSide) {
            case 0:
                x = Phaser.Math.Between(padding, this.game.canvas.width - padding);
                y = -padding;
                break;
            case 1:
                x = this.game.canvas.width + padding;
                y = Phaser.Math.Between(padding, this.game.canvas.height - padding);
                break;
            case 2:
                x = Phaser.Math.Between(padding, this.game.canvas.width - padding);
                y = this.game.canvas.height + padding;
                break;
            default:
                x = -padding;
                y = Phaser.Math.Between(padding, this.game.canvas.height - padding);
                break;
        }

        const enemy = new Enemy(this, x, y, 'enemy', this.player);
        this.enemies.add(enemy);
    }
}