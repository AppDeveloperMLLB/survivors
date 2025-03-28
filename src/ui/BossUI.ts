export default class BossUI extends Phaser.GameObjects.Container {
    private healthBar: Phaser.GameObjects.Graphics;
    private nameText: Phaser.GameObjects.Text;
    private phaseText: Phaser.GameObjects.Text;
    private maxHealth: number;
    private currentHealth: number;

    constructor(scene: Phaser.Scene, x: number, y: number, name: string, maxHealth: number) {
        super(scene, x, y);
        
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;

        // ボス名表示
        this.nameText = scene.add.text(0, 0, name, {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // HPバー背景
        this.healthBar = scene.add.graphics();
        
        // フェーズ表示
        this.phaseText = scene.add.text(0, 30, 'Phase 1', {
            fontSize: '18px',
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.add([this.healthBar, this.nameText, this.phaseText]);
        scene.add.existing(this);

        this.draw();
    }

    setHealth(amount: number): void {
        this.currentHealth = Phaser.Math.Clamp(amount, 0, this.maxHealth);
        this.draw();
    }

    setPhase(phase: number): void {
        this.phaseText.setText(`Phase ${phase}`);
        if (phase > 1) {
            this.phaseText.setColor('#ff0000');
        }
    }

    private draw(): void {
        this.healthBar.clear();

        // HPバー背景
        this.healthBar.fillStyle(0x000000);
        this.healthBar.fillRect(-150, 15, 300, 20);

        // HP残量表示
        const healthPercentage = this.currentHealth / this.maxHealth;
        const barWidth = 296 * healthPercentage;
        
        let color: number;
        if (healthPercentage > 0.5) {
            color = 0xff0000; // 赤
        } else if (healthPercentage > 0.25) {
            color = 0xff6600; // オレンジ
        } else {
            color = 0xff0000; // 赤（激怒状態）
        }
        
        this.healthBar.fillStyle(color);
        this.healthBar.fillRect(-148, 17, barWidth, 16);
    }
}