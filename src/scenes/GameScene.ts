export default class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Load player sprite
    this.load.image('player', 'src/assets/player.png');
  }

  create() {
    // Create player sprite
    this.player = this.physics.add.sprite(400, 300, 'player');
    this.player.setCollideWorldBounds(true);

    // Setup keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();

    // Add WASD keys
    this.input.keyboard.addKeys('W,S,A,D');
  }

  update() {
    const speed = 200;
    const keyboard = this.input.keyboard;

    // Reset velocity
    this.player.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown || keyboard.keys['A']?.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown || keyboard.keys['D']?.isDown) {
      this.player.setVelocityX(speed);
    }

    // Vertical movement
    if (this.cursors.up.isDown || keyboard.keys['W']?.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown || keyboard.keys['S']?.isDown) {
      this.player.setVelocityY(speed);
    }

    // Normalize diagonal movement
    if (this.player.body.velocity.x !== 0 && this.player.body.velocity.y !== 0) {
      this.player.body.velocity.normalize().scale(speed);
    }
  }
}
