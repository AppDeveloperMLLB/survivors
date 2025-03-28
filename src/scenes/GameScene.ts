import Enemy from '../entities/Enemy';

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys: { [key: string]: Phaser.Input.Keyboard.Key } = {};
  private enemies!: Phaser.GameObjects.Group;
  private playerHealth: number = 100;
  private lastEnemySpawnTime: number = 0;
  private enemySpawnInterval: number = 2000; // 2秒ごとに敵を生成

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Load player sprite
    this.load.image('player', 'src/assets/player.png');
    // Load enemy sprite (一時的に player.png を使用)
    this.load.image('enemy', 'src/assets/player.png');
  }

  create() {
    // Create player sprite
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

    // Setup collision between player and enemies
    this.physics.add.overlap(
      this.player,
      this.enemies,
      (_obj1, _obj2) => {
        this.playerHealth -= 10;
        if (this.playerHealth <= 0) {
          this.scene.pause();
          console.log('Game Over');
        }
      },
      undefined,
      this
    );
  }

  private spawnEnemy() {
    const padding = 50;
    const spawnSide = Phaser.Math.Between(0, 3); // 0: top, 1: right, 2: bottom, 3: left
    let x, y;

    switch (spawnSide) {
      case 0: // top
        x = Phaser.Math.Between(padding, this.game.canvas.width - padding);
        y = -padding;
        break;
      case 1: // right
        x = this.game.canvas.width + padding;
        y = Phaser.Math.Between(padding, this.game.canvas.height - padding);
        break;
      case 2: // bottom
        x = Phaser.Math.Between(padding, this.game.canvas.width - padding);
        y = this.game.canvas.height + padding;
        break;
      default: // left
        x = -padding;
        y = Phaser.Math.Between(padding, this.game.canvas.height - padding);
        break;
    }

    const enemy = new Enemy(this, x, y, 'enemy', this.player);
    this.enemies.add(enemy);
  }

  update(time: number) {
    const speed = 200;

    // Reset velocity
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
    }
  }
}