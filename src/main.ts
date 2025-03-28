import 'phaser';
import GameScene from './scenes/GameScene';
import TitleScene from './scenes/TitleScene';
import CharacterSelectScene from './scenes/CharacterSelectScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [TitleScene, CharacterSelectScene, GameScene]
};

new Phaser.Game(config);